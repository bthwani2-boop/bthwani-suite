package store

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"bthwani.local/wlt/domain"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostgresRepository is the production WLT data store backed by PostgreSQL.
type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(ctx context.Context, databaseURL string) (*PostgresRepository, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("wlt postgres: connect: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("wlt postgres: ping: %w", err)
	}
	return &PostgresRepository{pool: pool}, nil
}

func (r *PostgresRepository) Close() error {
	r.pool.Close()
	return nil
}

func pgNewID(prefix string) string {
	return fmt.Sprintf("%s-%d-%04d", prefix, time.Now().UnixMilli(), rand.Intn(9999)) //nolint:gosec
}

// ─── Payment Sessions ─────────────────────────────────────────────────────────

func (r *PostgresRepository) CreatePaymentSession(ctx context.Context, req domain.CreatePaymentSessionRequest) (domain.PaymentSession, error) {
	if req.Currency == "" {
		req.Currency = "YER"
	}
	if req.PaymentMethod == "" {
		req.PaymentMethod = "wallet"
	}

	existing, ok, err := r.GetPaymentSessionByIdempotency(ctx, req.IdempotencyKey)
	if err != nil {
		return domain.PaymentSession{}, err
	}
	if ok {
		return existing, nil
	}

	id := pgNewID("pay")
	n := time.Now().UTC()
	exp := n.Add(15 * time.Minute)

	const q = `
INSERT INTO wlt_payment_sessions
  (id, checkout_intent_id, client_id, amount, currency, status, payment_method,
   dsh_base_url, idempotency_key, created_at, expires_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
RETURNING id, checkout_intent_id, client_id, amount, currency, status, payment_method,
          provider_ref, dsh_base_url, idempotency_key, failure_reason,
          created_at, expires_at, confirmed_at, failed_at`

	var ps domain.PaymentSession
	row := r.pool.QueryRow(ctx, q,
		id, req.CheckoutIntentID, req.ClientID, req.Amount, req.Currency,
		domain.PaymentStatusPending, req.PaymentMethod,
		req.DshBaseURL, req.IdempotencyKey, n, exp,
	)
	if err := scanPaymentSession(row, &ps); err != nil {
		return domain.PaymentSession{}, fmt.Errorf("wlt postgres: create payment session: %w", err)
	}
	return ps, nil
}

func (r *PostgresRepository) GetPaymentSession(ctx context.Context, id string) (domain.PaymentSession, error) {
	const q = `
SELECT id, checkout_intent_id, client_id, amount, currency, status, payment_method,
       provider_ref, dsh_base_url, idempotency_key, failure_reason,
       created_at, expires_at, confirmed_at, failed_at
FROM wlt_payment_sessions WHERE id = $1`

	var ps domain.PaymentSession
	if err := scanPaymentSession(r.pool.QueryRow(ctx, q, id), &ps); err != nil {
		if err == pgx.ErrNoRows {
			return domain.PaymentSession{}, fmt.Errorf("payment session not found")
		}
		return domain.PaymentSession{}, fmt.Errorf("wlt postgres: get payment session: %w", err)
	}
	return ps, nil
}

func (r *PostgresRepository) GetPaymentSessionByIdempotency(ctx context.Context, key string) (domain.PaymentSession, bool, error) {
	const q = `
SELECT id, checkout_intent_id, client_id, amount, currency, status, payment_method,
       provider_ref, dsh_base_url, idempotency_key, failure_reason,
       created_at, expires_at, confirmed_at, failed_at
FROM wlt_payment_sessions WHERE idempotency_key = $1`

	var ps domain.PaymentSession
	if err := scanPaymentSession(r.pool.QueryRow(ctx, q, key), &ps); err != nil {
		if err == pgx.ErrNoRows {
			return domain.PaymentSession{}, false, nil
		}
		return domain.PaymentSession{}, false, fmt.Errorf("wlt postgres: get payment session by idempotency: %w", err)
	}
	return ps, true, nil
}

func (r *PostgresRepository) ConfirmPaymentSession(ctx context.Context, id string, req domain.ConfirmPaymentRequest) (domain.PaymentSession, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return domain.PaymentSession{}, err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	n := time.Now().UTC()
	const q = `
UPDATE wlt_payment_sessions
SET status = $1, confirmed_at = $2, provider_ref = COALESCE(NULLIF($3,''), provider_ref)
WHERE id = $4 AND status = 'PENDING'
RETURNING id, checkout_intent_id, client_id, amount, currency, status, payment_method,
          provider_ref, dsh_base_url, idempotency_key, failure_reason,
          created_at, expires_at, confirmed_at, failed_at`

	var ps domain.PaymentSession
	if err := scanPaymentSession(tx.QueryRow(ctx, q, domain.PaymentStatusConfirmed, n, req.ProviderRef, id), &ps); err != nil {
		if err == pgx.ErrNoRows {
			return domain.PaymentSession{}, fmt.Errorf("payment session not found or not in PENDING state")
		}
		return domain.PaymentSession{}, fmt.Errorf("wlt postgres: confirm payment session: %w", err)
	}

	isTopup := strings.HasPrefix(strings.ToLower(ps.CheckoutIntentID), "topup") || strings.HasPrefix(strings.ToLower(ps.CheckoutIntentID), "dsh-client-topup")

	if isTopup {
		var walletID string
		var currentBalance float64
		err := tx.QueryRow(ctx, `
			INSERT INTO wlt_wallets (id, subject, actor_type, balance, currency, created_at, updated_at)
			VALUES ($1, $2, 'client', 0, 'YER', $3, $3)
			ON CONFLICT (subject) DO UPDATE SET updated_at = EXCLUDED.updated_at
			RETURNING id, balance`, pgNewID("wal"), ps.ClientID, n).Scan(&walletID, &currentBalance)
		if err != nil {
			return domain.PaymentSession{}, fmt.Errorf("get/create wallet for topup: %w", err)
		}

		newBalance := currentBalance + ps.Amount
		_, err = tx.Exec(ctx, `UPDATE wlt_wallets SET balance = $1, updated_at = $2 WHERE id = $3`, newBalance, n, walletID)
		if err != nil {
			return domain.PaymentSession{}, fmt.Errorf("update wallet balance: %w", err)
		}

		ledgerID := pgNewID("led")
		_, err = tx.Exec(ctx, `
			INSERT INTO wlt_ledger
			  (id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
			   order_id, description, status, created_at, completed_at)
			VALUES ($1, $2, $3, 'CREDIT', $4, $5, 'payment_session', $6, $7, $8, 'COMPLETED', $9, $9)`,
			ledgerID, walletID, ps.ClientID, ps.Amount, ps.Currency, ps.ID, ps.CheckoutIntentID, "Wallet top-up via "+ps.PaymentMethod, n)
		if err != nil {
			return domain.PaymentSession{}, fmt.Errorf("create topup ledger entry: %w", err)
		}
	} else {
		if ps.PaymentMethod == "wallet" {
			var walletID string
			var currentBalance float64
			err := tx.QueryRow(ctx, `SELECT id, balance FROM wlt_wallets WHERE subject = $1`, ps.ClientID).Scan(&walletID, &currentBalance)
			if err == pgx.ErrNoRows {
				return domain.PaymentSession{}, fmt.Errorf("wallet not found for client: %s", ps.ClientID)
			} else if err != nil {
				return domain.PaymentSession{}, fmt.Errorf("get wallet: %w", err)
			}

			if currentBalance < ps.Amount {
				return domain.PaymentSession{}, fmt.Errorf("insufficient balance: current=%.2f required=%.2f", currentBalance, ps.Amount)
			}

			newBalance := currentBalance - ps.Amount
			_, err = tx.Exec(ctx, `UPDATE wlt_wallets SET balance = $1, updated_at = $2 WHERE id = $3`, newBalance, n, walletID)
			if err != nil {
				return domain.PaymentSession{}, fmt.Errorf("update wallet balance: %w", err)
			}

			ledgerID := pgNewID("led")
			_, err = tx.Exec(ctx, `
				INSERT INTO wlt_ledger
				  (id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
				   order_id, description, status, created_at, completed_at)
				VALUES ($1, $2, $3, 'DEBIT', $4, $5, 'payment_session', $6, $7, $8, 'COMPLETED', $9, $9)`,
				ledgerID, walletID, ps.ClientID, ps.Amount, ps.Currency, ps.ID, ps.CheckoutIntentID, "Payment for order checkout", n)
			if err != nil {
				return domain.PaymentSession{}, fmt.Errorf("create payment ledger entry: %w", err)
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.PaymentSession{}, fmt.Errorf("commit confirm transaction: %w", err)
	}

	return ps, nil
}

func (r *PostgresRepository) FailPaymentSession(ctx context.Context, id string, reason string) (domain.PaymentSession, error) {
	n := time.Now().UTC()
	const q = `
UPDATE wlt_payment_sessions
SET status = $1, failed_at = $2, failure_reason = $3
WHERE id = $4 AND status = 'PENDING'
RETURNING id, checkout_intent_id, client_id, amount, currency, status, payment_method,
          provider_ref, dsh_base_url, idempotency_key, failure_reason,
          created_at, expires_at, confirmed_at, failed_at`

	var ps domain.PaymentSession
	if err := scanPaymentSession(r.pool.QueryRow(ctx, q, domain.PaymentStatusFailed, n, reason, id), &ps); err != nil {
		if err == pgx.ErrNoRows {
			return domain.PaymentSession{}, fmt.Errorf("payment session not found or not in PENDING state")
		}
		return domain.PaymentSession{}, fmt.Errorf("wlt postgres: fail payment session: %w", err)
	}
	return ps, nil
}

func scanPaymentSession(row pgx.Row, ps *domain.PaymentSession) error {
	return row.Scan(
		&ps.ID, &ps.CheckoutIntentID, &ps.ClientID, &ps.Amount, &ps.Currency,
		&ps.Status, &ps.PaymentMethod, &ps.ProviderRef, &ps.DshBaseURL,
		&ps.IdempotencyKey, &ps.FailureReason,
		&ps.CreatedAt, &ps.ExpiresAt, &ps.ConfirmedAt, &ps.FailedAt,
	)
}

// ─── Refunds ─────────────────────────────────────────────────────────────────

func (r *PostgresRepository) CreateRefund(ctx context.Context, req domain.CreateRefundRequest) (domain.Refund, error) {
	if req.Currency == "" {
		req.Currency = "YER"
	}

	existing, ok, err := r.GetRefundByIdempotency(ctx, req.IdempotencyKey)
	if err != nil {
		return domain.Refund{}, err
	}
	if ok {
		return existing, nil
	}

	id := pgNewID("ref")
	n := time.Now().UTC()

	const q = `
INSERT INTO wlt_refunds
  (id, order_id, payment_session_id, client_id, amount, currency, reason,
   status, trigger_ref, dsh_base_url, idempotency_key, created_at, updated_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12)
RETURNING id, order_id, payment_session_id, client_id, amount, currency, reason,
          status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
          failure_reason, created_at, updated_at, completed_at`

	var ref domain.Refund
	row := r.pool.QueryRow(ctx, q,
		id, req.OrderID, req.PaymentSessionID, req.ClientID, req.Amount, req.Currency,
		req.Reason, domain.RefundStatusPending, req.TriggerRef,
		req.DshBaseURL, req.IdempotencyKey, n,
	)
	if err := scanRefund(row, &ref); err != nil {
		return domain.Refund{}, fmt.Errorf("wlt postgres: create refund: %w", err)
	}
	return ref, nil
}

func (r *PostgresRepository) GetRefund(ctx context.Context, id string) (domain.Refund, error) {
	const q = `
SELECT id, order_id, payment_session_id, client_id, amount, currency, reason,
       status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
       failure_reason, created_at, updated_at, completed_at
FROM wlt_refunds WHERE id = $1`

	var ref domain.Refund
	if err := scanRefund(r.pool.QueryRow(ctx, q, id), &ref); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Refund{}, fmt.Errorf("refund not found")
		}
		return domain.Refund{}, fmt.Errorf("wlt postgres: get refund: %w", err)
	}
	return ref, nil
}

func (r *PostgresRepository) GetRefundByIdempotency(ctx context.Context, key string) (domain.Refund, bool, error) {
	const q = `
SELECT id, order_id, payment_session_id, client_id, amount, currency, reason,
       status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
       failure_reason, created_at, updated_at, completed_at
FROM wlt_refunds WHERE idempotency_key = $1`

	var ref domain.Refund
	if err := scanRefund(r.pool.QueryRow(ctx, q, key), &ref); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Refund{}, false, nil
		}
		return domain.Refund{}, false, fmt.Errorf("wlt postgres: get refund by idempotency: %w", err)
	}
	return ref, true, nil
}

func (r *PostgresRepository) ProcessRefund(ctx context.Context, id string) (domain.Refund, error) {
	const q = `
UPDATE wlt_refunds SET status = $1, updated_at = $2
WHERE id = $3 AND status = 'PENDING'
RETURNING id, order_id, payment_session_id, client_id, amount, currency, reason,
          status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
          failure_reason, created_at, updated_at, completed_at`
	var ref domain.Refund
	if err := scanRefund(r.pool.QueryRow(ctx, q, domain.RefundStatusProcessing, time.Now().UTC(), id), &ref); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Refund{}, fmt.Errorf("refund not found or not in PENDING state")
		}
		return domain.Refund{}, fmt.Errorf("wlt postgres: process refund: %w", err)
	}
	return ref, nil
}

func (r *PostgresRepository) ConfirmRefund(ctx context.Context, id string) (domain.Refund, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return domain.Refund{}, err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	n := time.Now().UTC()
	const q = `
UPDATE wlt_refunds SET status = $1, updated_at = $2, completed_at = $2
WHERE id = $3 AND status = 'PROCESSING'
RETURNING id, order_id, payment_session_id, client_id, amount, currency, reason,
          status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
          failure_reason, created_at, updated_at, completed_at`
	var ref domain.Refund
	if err := scanRefund(tx.QueryRow(ctx, q, domain.RefundStatusConfirmed, n, id), &ref); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Refund{}, fmt.Errorf("refund not found or not in PROCESSING state")
		}
		return domain.Refund{}, fmt.Errorf("wlt postgres: confirm refund: %w", err)
	}

	var walletID string
	var currentBalance float64
	err = tx.QueryRow(ctx, `
		INSERT INTO wlt_wallets (id, subject, actor_type, balance, currency, created_at, updated_at)
		VALUES ($1, $2, 'client', 0, 'YER', $3, $3)
		ON CONFLICT (subject) DO UPDATE SET updated_at = EXCLUDED.updated_at
		RETURNING id, balance`, pgNewID("wal"), ref.ClientID, n).Scan(&walletID, &currentBalance)
	if err != nil {
		return domain.Refund{}, fmt.Errorf("get/create wallet for refund: %w", err)
	}

	newBalance := currentBalance + ref.Amount
	_, err = tx.Exec(ctx, `UPDATE wlt_wallets SET balance = $1, updated_at = $2 WHERE id = $3`, newBalance, n, walletID)
	if err != nil {
		return domain.Refund{}, fmt.Errorf("update wallet balance: %w", err)
	}

	ledgerID := pgNewID("led")
	_, err = tx.Exec(ctx, `
		INSERT INTO wlt_ledger
		  (id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
		   order_id, description, status, created_at, completed_at)
		VALUES ($1, $2, $3, 'CREDIT', $4, $5, 'refund', $6, $7, $8, 'COMPLETED', $9, $9)`,
		ledgerID, walletID, ref.ClientID, ref.Amount, ref.Currency, ref.ID, ref.OrderID, "Refund for order: "+ref.OrderID, n)
	if err != nil {
		return domain.Refund{}, fmt.Errorf("create refund ledger entry: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.Refund{}, fmt.Errorf("commit refund transaction: %w", err)
	}

	return ref, nil
}

func (r *PostgresRepository) FailRefund(ctx context.Context, id string, reason string) (domain.Refund, error) {
	n := time.Now().UTC()
	const q = `
UPDATE wlt_refunds SET status = $1, updated_at = $2, failure_reason = $3
WHERE id = $4
RETURNING id, order_id, payment_session_id, client_id, amount, currency, reason,
          status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
          failure_reason, created_at, updated_at, completed_at`
	var ref domain.Refund
	if err := scanRefund(r.pool.QueryRow(ctx, q, domain.RefundStatusFailed, n, reason, id), &ref); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Refund{}, fmt.Errorf("refund not found")
		}
		return domain.Refund{}, fmt.Errorf("wlt postgres: fail refund: %w", err)
	}
	return ref, nil
}

func (r *PostgresRepository) MarkRefundCallbackSent(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE wlt_refunds SET dsh_callback_sent_at = $1 WHERE id = $2`,
		time.Now().UTC(), id,
	)
	return err
}

func (r *PostgresRepository) ListRefunds(ctx context.Context, q domain.ListRefundsQuery) (domain.ListRefundsResponse, error) {
	if q.Limit <= 0 {
		q.Limit = 50
	}
	if q.Limit > 200 {
		q.Limit = 200
	}

	countQ := `SELECT COUNT(*) FROM wlt_refunds WHERE ($1 = '' OR status = $1) AND ($2 = '' OR client_id = $2) AND ($3 = '' OR order_id = $3)`
	var total int
	if err := r.pool.QueryRow(ctx, countQ, q.Status, q.ClientID, q.OrderID).Scan(&total); err != nil {
		return domain.ListRefundsResponse{}, fmt.Errorf("wlt postgres: list refunds count: %w", err)
	}

	listQ := `
SELECT id, order_id, payment_session_id, client_id, amount, currency, reason,
       status, trigger_ref, dsh_base_url, dsh_callback_sent_at, idempotency_key,
       failure_reason, created_at, updated_at, completed_at
FROM wlt_refunds
WHERE ($1 = '' OR status = $1) AND ($2 = '' OR client_id = $2) AND ($3 = '' OR order_id = $3)
ORDER BY created_at DESC
LIMIT $4 OFFSET $5`

	rows, err := r.pool.Query(ctx, listQ, q.Status, q.ClientID, q.OrderID, q.Limit, q.Offset)
	if err != nil {
		return domain.ListRefundsResponse{}, fmt.Errorf("wlt postgres: list refunds: %w", err)
	}
	defer rows.Close()

	var refunds []domain.Refund
	for rows.Next() {
		var ref domain.Refund
		if err := rows.Scan(
			&ref.ID, &ref.OrderID, &ref.PaymentSessionID, &ref.ClientID,
			&ref.Amount, &ref.Currency, &ref.Reason, &ref.Status,
			&ref.TriggerRef, &ref.DshBaseURL, &ref.DshCallbackSentAt,
			&ref.IdempotencyKey, &ref.FailureReason,
			&ref.CreatedAt, &ref.UpdatedAt, &ref.CompletedAt,
		); err != nil {
			return domain.ListRefundsResponse{}, fmt.Errorf("wlt postgres: list refunds scan: %w", err)
		}
		refunds = append(refunds, ref)
	}
	return domain.ListRefundsResponse{Refunds: refunds, Total: total}, nil
}

func scanRefund(row pgx.Row, ref *domain.Refund) error {
	return row.Scan(
		&ref.ID, &ref.OrderID, &ref.PaymentSessionID, &ref.ClientID,
		&ref.Amount, &ref.Currency, &ref.Reason, &ref.Status,
		&ref.TriggerRef, &ref.DshBaseURL, &ref.DshCallbackSentAt,
		&ref.IdempotencyKey, &ref.FailureReason,
		&ref.CreatedAt, &ref.UpdatedAt, &ref.CompletedAt,
	)
}

// ─── Settlements ─────────────────────────────────────────────────────────────

func (r *PostgresRepository) CreateSettlement(ctx context.Context, req domain.CreateSettlementRequest) (domain.Settlement, error) {
	if req.Currency == "" {
		req.Currency = "YER"
	}

	existing, ok, err := r.GetSettlementByIdempotency(ctx, req.IdempotencyKey)
	if err != nil {
		return domain.Settlement{}, err
	}
	if ok {
		return existing, nil
	}

	platformFee := req.GrossAmount * req.PlatformFeeRate
	captainPayout := req.GrossAmount * req.CaptainFeeRate
	partnerPayout := req.GrossAmount - platformFee - captainPayout

	id := pgNewID("set")
	n := time.Now().UTC()

	const q = `
INSERT INTO wlt_settlements
  (id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
   captain_payout, currency, status, idempotency_key, dsh_base_url, created_at, updated_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$13)
RETURNING id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
          captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
          failure_reason, created_at, updated_at, completed_at`

	var s domain.Settlement
	row := r.pool.QueryRow(ctx, q,
		id, req.OrderID, req.PartnerID, req.CaptainID,
		req.GrossAmount, platformFee, partnerPayout, captainPayout,
		req.Currency, domain.SettlementStatusPending, req.IdempotencyKey,
		req.DshBaseURL, n,
	)
	if err := scanSettlement(row, &s); err != nil {
		return domain.Settlement{}, fmt.Errorf("wlt postgres: create settlement: %w", err)
	}
	return s, nil
}

func (r *PostgresRepository) GetSettlement(ctx context.Context, id string) (domain.Settlement, error) {
	const q = `
SELECT id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
       captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
       failure_reason, created_at, updated_at, completed_at
FROM wlt_settlements WHERE id = $1`
	var s domain.Settlement
	if err := scanSettlement(r.pool.QueryRow(ctx, q, id), &s); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Settlement{}, fmt.Errorf("settlement not found")
		}
		return domain.Settlement{}, fmt.Errorf("wlt postgres: get settlement: %w", err)
	}
	return s, nil
}

func (r *PostgresRepository) GetSettlementByIdempotency(ctx context.Context, key string) (domain.Settlement, bool, error) {
	const q = `
SELECT id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
       captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
       failure_reason, created_at, updated_at, completed_at
FROM wlt_settlements WHERE idempotency_key = $1`
	var s domain.Settlement
	if err := scanSettlement(r.pool.QueryRow(ctx, q, key), &s); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Settlement{}, false, nil
		}
		return domain.Settlement{}, false, fmt.Errorf("wlt postgres: get settlement by idempotency: %w", err)
	}
	return s, true, nil
}

func (r *PostgresRepository) ListSettlements(ctx context.Context, q domain.ListSettlementsQuery) (domain.ListSettlementsResponse, error) {
	if q.Limit <= 0 {
		q.Limit = 50
	}
	if q.Limit > 200 {
		q.Limit = 200
	}

	countQ := `SELECT COUNT(*) FROM wlt_settlements WHERE ($1 = '' OR status = $1) AND ($2 = '' OR partner_id = $2) AND ($3 = '' OR captain_id = $3)`
	var total int
	if err := r.pool.QueryRow(ctx, countQ, q.Status, q.PartnerID, q.CaptainID).Scan(&total); err != nil {
		return domain.ListSettlementsResponse{}, fmt.Errorf("wlt postgres: list settlements count: %w", err)
	}

	listQ := `
SELECT id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
       captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
       failure_reason, created_at, updated_at, completed_at
FROM wlt_settlements
WHERE ($1 = '' OR status = $1) AND ($2 = '' OR partner_id = $2) AND ($3 = '' OR captain_id = $3)
ORDER BY created_at DESC
LIMIT $4 OFFSET $5`

	rows, err := r.pool.Query(ctx, listQ, q.Status, q.PartnerID, q.CaptainID, q.Limit, q.Offset)
	if err != nil {
		return domain.ListSettlementsResponse{}, fmt.Errorf("wlt postgres: list settlements: %w", err)
	}
	defer rows.Close()

	var settlements []domain.Settlement
	for rows.Next() {
		var s domain.Settlement
		if err := scanSettlementRow(rows, &s); err != nil {
			return domain.ListSettlementsResponse{}, fmt.Errorf("wlt postgres: list settlements scan: %w", err)
		}
		settlements = append(settlements, s)
	}
	return domain.ListSettlementsResponse{Settlements: settlements, Total: total}, nil
}

func (r *PostgresRepository) ProcessSettlement(ctx context.Context, id string) (domain.Settlement, error) {
	const q = `
UPDATE wlt_settlements SET status = $1, updated_at = $2
WHERE id = $3 AND status = 'PENDING'
RETURNING id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
          captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
          failure_reason, created_at, updated_at, completed_at`
	var s domain.Settlement
	if err := scanSettlement(r.pool.QueryRow(ctx, q, domain.SettlementStatusProcessing, time.Now().UTC(), id), &s); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Settlement{}, fmt.Errorf("settlement not found or not in PENDING state")
		}
		return domain.Settlement{}, fmt.Errorf("wlt postgres: process settlement: %w", err)
	}
	return s, nil
}

func (r *PostgresRepository) CompleteSettlement(ctx context.Context, id string) (domain.Settlement, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return domain.Settlement{}, err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	n := time.Now().UTC()
	const q = `
UPDATE wlt_settlements SET status = $1, updated_at = $2, completed_at = $2
WHERE id = $3 AND status = 'PROCESSING'
RETURNING id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
          captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
          failure_reason, created_at, updated_at, completed_at`

	var s domain.Settlement
	if err := scanSettlement(tx.QueryRow(ctx, q, domain.SettlementStatusCompleted, n, id), &s); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Settlement{}, fmt.Errorf("settlement not found or not in PROCESSING state")
		}
		return domain.Settlement{}, fmt.Errorf("wlt postgres: complete settlement: %w", err)
	}

	if s.PartnerPayout > 0 {
		var walletID string
		var currentBalance float64
		err = tx.QueryRow(ctx, `
			INSERT INTO wlt_wallets (id, subject, actor_type, balance, currency, created_at, updated_at)
			VALUES ($1, $2, 'partner', 0, 'YER', $3, $3)
			ON CONFLICT (subject) DO UPDATE SET updated_at = EXCLUDED.updated_at
			RETURNING id, balance`, pgNewID("wal"), s.PartnerID, n).Scan(&walletID, &currentBalance)
		if err != nil {
			return domain.Settlement{}, fmt.Errorf("get/create partner wallet: %w", err)
		}

		newBalance := currentBalance + s.PartnerPayout
		_, err = tx.Exec(ctx, `UPDATE wlt_wallets SET balance = $1, updated_at = $2 WHERE id = $3`, newBalance, n, walletID)
		if err != nil {
			return domain.Settlement{}, fmt.Errorf("update partner wallet balance: %w", err)
		}

		ledgerID := pgNewID("led")
		_, err = tx.Exec(ctx, `
			INSERT INTO wlt_ledger
			  (id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
			   order_id, description, status, created_at, completed_at)
			VALUES ($1, $2, $3, 'CREDIT', $4, $5, 'settlement', $6, $7, $8, 'COMPLETED', $9, $9)`,
			ledgerID, walletID, s.PartnerID, s.PartnerPayout, s.Currency, s.ID, s.OrderID, "Partner settlement payout for order: "+s.OrderID, n)
		if err != nil {
			return domain.Settlement{}, fmt.Errorf("create partner settlement ledger entry: %w", err)
		}
	}

	if s.CaptainID != nil && *s.CaptainID != "" && s.CaptainPayout > 0 {
		var walletID string
		var currentBalance float64
		err = tx.QueryRow(ctx, `
			INSERT INTO wlt_wallets (id, subject, actor_type, balance, currency, created_at, updated_at)
			VALUES ($1, $2, 'captain', 0, 'YER', $3, $3)
			ON CONFLICT (subject) DO UPDATE SET updated_at = EXCLUDED.updated_at
			RETURNING id, balance`, pgNewID("wal"), *s.CaptainID, n).Scan(&walletID, &currentBalance)
		if err != nil {
			return domain.Settlement{}, fmt.Errorf("get/create captain wallet: %w", err)
		}

		newBalance := currentBalance + s.CaptainPayout
		_, err = tx.Exec(ctx, `UPDATE wlt_wallets SET balance = $1, updated_at = $2 WHERE id = $3`, newBalance, n, walletID)
		if err != nil {
			return domain.Settlement{}, fmt.Errorf("update captain wallet balance: %w", err)
		}

		ledgerID := pgNewID("led")
		_, err = tx.Exec(ctx, `
			INSERT INTO wlt_ledger
			  (id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
			   order_id, description, status, created_at, completed_at)
			VALUES ($1, $2, $3, 'CREDIT', $4, $5, 'settlement', $6, $7, $8, 'COMPLETED', $9, $9)`,
			ledgerID, walletID, *s.CaptainID, s.CaptainPayout, s.Currency, s.ID, s.OrderID, "Captain settlement payout for order: "+s.OrderID, n)
		if err != nil {
			return domain.Settlement{}, fmt.Errorf("create captain settlement ledger entry: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.Settlement{}, fmt.Errorf("commit settlement transaction: %w", err)
	}

	return s, nil
}

func (r *PostgresRepository) FailSettlement(ctx context.Context, id string, reason string) (domain.Settlement, error) {
	n := time.Now().UTC()
	const q = `
UPDATE wlt_settlements SET status = $1, updated_at = $2, failure_reason = $3
WHERE id = $4
RETURNING id, order_id, partner_id, captain_id, gross_amount, platform_fee, partner_payout,
          captain_payout, currency, status, idempotency_key, dsh_base_url, dsh_callback_sent_at,
          failure_reason, created_at, updated_at, completed_at`
	var s domain.Settlement
	if err := scanSettlement(r.pool.QueryRow(ctx, q, domain.SettlementStatusFailed, n, reason, id), &s); err != nil {
		if err == pgx.ErrNoRows {
			return domain.Settlement{}, fmt.Errorf("settlement not found")
		}
		return domain.Settlement{}, fmt.Errorf("wlt postgres: fail settlement: %w", err)
	}
	return s, nil
}

func (r *PostgresRepository) MarkSettlementCallbackSent(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE wlt_settlements SET dsh_callback_sent_at = $1 WHERE id = $2`,
		time.Now().UTC(), id,
	)
	return err
}

func scanSettlement(row pgx.Row, s *domain.Settlement) error {
	return row.Scan(
		&s.ID, &s.OrderID, &s.PartnerID, &s.CaptainID,
		&s.GrossAmount, &s.PlatformFee, &s.PartnerPayout, &s.CaptainPayout,
		&s.Currency, &s.Status, &s.IdempotencyKey, &s.DshBaseURL, &s.DshCallbackSentAt,
		&s.FailureReason, &s.CreatedAt, &s.UpdatedAt, &s.CompletedAt,
	)
}

func scanSettlementRow(row pgx.Rows, s *domain.Settlement) error {
	return row.Scan(
		&s.ID, &s.OrderID, &s.PartnerID, &s.CaptainID,
		&s.GrossAmount, &s.PlatformFee, &s.PartnerPayout, &s.CaptainPayout,
		&s.Currency, &s.Status, &s.IdempotencyKey, &s.DshBaseURL, &s.DshCallbackSentAt,
		&s.FailureReason, &s.CreatedAt, &s.UpdatedAt, &s.CompletedAt,
	)
}

// ─── Wallets ─────────────────────────────────────────────────────────────────

func (r *PostgresRepository) GetOrCreateWallet(ctx context.Context, subject, actorType string) (domain.Wallet, error) {
	n := time.Now().UTC()
	id := pgNewID("wal")
	const q = `
INSERT INTO wlt_wallets (id, subject, actor_type, balance, currency, created_at, updated_at)
VALUES ($1,$2,$3,0,'YER',$4,$4)
ON CONFLICT (subject) DO UPDATE SET updated_at = EXCLUDED.updated_at
RETURNING id, subject, actor_type, balance, currency, created_at, updated_at`
	var w domain.Wallet
	err := r.pool.QueryRow(ctx, q, id, subject, actorType, n).Scan(
		&w.ID, &w.Subject, &w.ActorType, &w.Balance, &w.Currency, &w.CreatedAt, &w.UpdatedAt,
	)
	if err != nil {
		return domain.Wallet{}, fmt.Errorf("wlt postgres: get or create wallet: %w", err)
	}
	return w, nil
}

func (r *PostgresRepository) GetWalletSummary(ctx context.Context, subject string) (domain.WalletSummary, error) {
	const walletQ = `SELECT id, subject, actor_type, balance, currency FROM wlt_wallets WHERE subject = $1`
	var w domain.Wallet
	err := r.pool.QueryRow(ctx, walletQ, subject).Scan(&w.ID, &w.Subject, &w.ActorType, &w.Balance, &w.Currency)
	if err != nil {
		if err == pgx.ErrNoRows {
			return domain.WalletSummary{}, fmt.Errorf("wallet not found")
		}
		return domain.WalletSummary{}, fmt.Errorf("wlt postgres: get wallet: %w", err)
	}

	const statsQ = `
SELECT
  COALESCE(SUM(CASE WHEN transaction_type='CREDIT' AND status='COMPLETED' THEN amount ELSE 0 END),0) AS total_credit,
  COALESCE(SUM(CASE WHEN transaction_type='DEBIT'  AND status='COMPLETED' THEN amount ELSE 0 END),0) AS total_debit,
  COALESCE(SUM(CASE WHEN transaction_type='CREDIT' AND status='PENDING'   THEN amount ELSE 0 END),0) AS pending_credit,
  COALESCE(SUM(CASE WHEN transaction_type='DEBIT'  AND status='PENDING'   THEN amount ELSE 0 END),0) AS pending_debit,
  COUNT(*) AS tx_count
FROM wlt_ledger WHERE subject = $1`

	var summary domain.WalletSummary
	err = r.pool.QueryRow(ctx, statsQ, subject).Scan(
		&summary.TotalCredit, &summary.TotalDebit,
		&summary.PendingCredit, &summary.PendingDebit,
		&summary.TransactionCount,
	)
	if err != nil {
		return domain.WalletSummary{}, fmt.Errorf("wlt postgres: wallet stats: %w", err)
	}

	summary.Subject = w.Subject
	summary.ActorType = w.ActorType
	summary.Balance = w.Balance
	summary.Currency = w.Currency
	return summary, nil
}

// ─── Ledger ──────────────────────────────────────────────────────────────────

func (r *PostgresRepository) CreateLedgerEntry(ctx context.Context, entry domain.LedgerEntry) (domain.LedgerEntry, error) {
	if entry.ID == "" {
		entry.ID = pgNewID("led")
	}
	if entry.CreatedAt.IsZero() {
		entry.CreatedAt = time.Now().UTC()
	}

	const q = `
INSERT INTO wlt_ledger
  (id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
   order_id, description, status, created_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
RETURNING id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
          order_id, description, status, created_at, completed_at`

	err := r.pool.QueryRow(ctx, q,
		entry.ID, entry.WalletID, entry.Subject, entry.TransactionType,
		entry.Amount, entry.Currency, entry.ReferenceType, entry.ReferenceID,
		entry.OrderID, entry.Description, entry.Status, entry.CreatedAt,
	).Scan(
		&entry.ID, &entry.WalletID, &entry.Subject, &entry.TransactionType,
		&entry.Amount, &entry.Currency, &entry.ReferenceType, &entry.ReferenceID,
		&entry.OrderID, &entry.Description, &entry.Status,
		&entry.CreatedAt, &entry.CompletedAt,
	)
	if err != nil {
		return domain.LedgerEntry{}, fmt.Errorf("wlt postgres: create ledger entry: %w", err)
	}
	return entry, nil
}

func (r *PostgresRepository) ListLedger(ctx context.Context, q domain.ListLedgerQuery) (domain.ListLedgerResponse, error) {
	if q.Limit <= 0 {
		q.Limit = 50
	}
	if q.Limit > 200 {
		q.Limit = 200
	}

	countQ := `SELECT COUNT(*) FROM wlt_ledger WHERE ($1 = '' OR subject = $1)`
	var total int
	if err := r.pool.QueryRow(ctx, countQ, q.Subject).Scan(&total); err != nil {
		return domain.ListLedgerResponse{}, fmt.Errorf("wlt postgres: ledger count: %w", err)
	}

	listQ := `
SELECT id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id,
       order_id, description, status, created_at, completed_at
FROM wlt_ledger
WHERE ($1 = '' OR subject = $1)
ORDER BY created_at DESC
LIMIT $2 OFFSET $3`

	rows, err := r.pool.Query(ctx, listQ, q.Subject, q.Limit, q.Offset)
	if err != nil {
		return domain.ListLedgerResponse{}, fmt.Errorf("wlt postgres: list ledger: %w", err)
	}
	defer rows.Close()

	var entries []domain.LedgerEntry
	for rows.Next() {
		var e domain.LedgerEntry
		if err := rows.Scan(
			&e.ID, &e.WalletID, &e.Subject, &e.TransactionType,
			&e.Amount, &e.Currency, &e.ReferenceType, &e.ReferenceID,
			&e.OrderID, &e.Description, &e.Status,
			&e.CreatedAt, &e.CompletedAt,
		); err != nil {
			return domain.ListLedgerResponse{}, fmt.Errorf("wlt postgres: ledger scan: %w", err)
		}
		entries = append(entries, e)
	}
	return domain.ListLedgerResponse{Entries: entries, Total: total}, nil
}

// ─── Health ──────────────────────────────────────────────────────────────────

func (r *PostgresRepository) Ping(ctx context.Context) error {
	return r.pool.Ping(ctx)
}

// ─── Operator Features ───────────────────────────────────────────────────

func (r *PostgresRepository) RunReconciliation(ctx context.Context, idempotencyKey string) (domain.ReconciliationRun, error) {
	if idempotencyKey != "" {
		existing, ok, err := r.GetReconciliationRunByIdempotency(ctx, idempotencyKey)
		if err != nil {
			return domain.ReconciliationRun{}, err
		}
		if ok {
			return existing, nil
		}
	}

	const calcQ = `
		SELECT
			COUNT(*),
			COALESCE(SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END), 0)
		FROM wlt_ledger
		WHERE status = 'COMPLETED'`

	var entryCount int
	var totalDebit, totalCredit float64
	err := r.pool.QueryRow(ctx, calcQ).Scan(&entryCount, &totalDebit, &totalCredit)
	if err != nil {
		return domain.ReconciliationRun{}, fmt.Errorf("wlt postgres: calculate reconciliation totals: %w", err)
	}

	status := "failed"
	if totalDebit == totalCredit {
		status = "passed"
	}

	run := domain.ReconciliationRun{
		ID:          pgNewID("rec"),
		Status:      status,
		EntryCount:  entryCount,
		TotalDebit:  totalDebit,
		TotalCredit: totalCredit,
		CreatedAt:   time.Now().UTC(),
	}
	if idempotencyKey != "" {
		run.IdempotencyKey = &idempotencyKey
	}

	err = r.CreateReconciliationRun(ctx, run)
	if err != nil {
		return domain.ReconciliationRun{}, err
	}
	return run, nil
}

func (r *PostgresRepository) ListReconciliationRuns(ctx context.Context) ([]domain.ReconciliationRun, error) {
	const q = `SELECT id, idempotency_key, status, entry_count, total_debit, total_credit, created_at FROM wlt_reconciliation_runs ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("wlt postgres: list reconciliation runs: %w", err)
	}
	defer rows.Close()

	var runs []domain.ReconciliationRun
	for rows.Next() {
		var run domain.ReconciliationRun
		if err := rows.Scan(&run.ID, &run.IdempotencyKey, &run.Status, &run.EntryCount, &run.TotalDebit, &run.TotalCredit, &run.CreatedAt); err != nil {
			return nil, fmt.Errorf("wlt postgres: reconciliation run scan: %w", err)
		}
		runs = append(runs, run)
	}
	return runs, nil
}

func (r *PostgresRepository) CreateReconciliationRun(ctx context.Context, run domain.ReconciliationRun) error {
	if run.ID == "" {
		run.ID = pgNewID("rec")
	}
	if run.CreatedAt.IsZero() {
		run.CreatedAt = time.Now().UTC()
	}
	const q = `INSERT INTO wlt_reconciliation_runs (id, idempotency_key, status, entry_count, total_debit, total_credit, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.pool.Exec(ctx, q, run.ID, run.IdempotencyKey, run.Status, run.EntryCount, run.TotalDebit, run.TotalCredit, run.CreatedAt)
	if err != nil {
		return fmt.Errorf("wlt postgres: create reconciliation run: %w", err)
	}
	return nil
}

func (r *PostgresRepository) GetReconciliationRunByIdempotency(ctx context.Context, key string) (domain.ReconciliationRun, bool, error) {
	const q = `SELECT id, idempotency_key, status, entry_count, total_debit, total_credit, created_at FROM wlt_reconciliation_runs WHERE idempotency_key = $1`
	var run domain.ReconciliationRun
	err := r.pool.QueryRow(ctx, q, key).Scan(&run.ID, &run.IdempotencyKey, &run.Status, &run.EntryCount, &run.TotalDebit, &run.TotalCredit, &run.CreatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return domain.ReconciliationRun{}, false, nil
		}
		return domain.ReconciliationRun{}, false, fmt.Errorf("wlt postgres: get reconciliation run by idem: %w", err)
	}
	return run, true, nil
}

func (r *PostgresRepository) CreatePayoutDecision(ctx context.Context, req domain.CreatePayoutDecisionRequest) (domain.PayoutDecision, error) {
	existing, ok, err := r.GetPayoutDecisionByIdempotency(ctx, req.IdempotencyKey)
	if err != nil {
		return domain.PayoutDecision{}, err
	}
	if ok {
		return existing, nil
	}

	id := pgNewID("po")
	n := time.Now().UTC()
	const q = `
INSERT INTO wlt_payout_decisions (id, owner_id, owner_kind, settlement_cycle_id, amount, currency, status, idempotency_key, created_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING id, owner_id, owner_kind, settlement_cycle_id, amount, currency, status, idempotency_key, created_at`

	var pd domain.PayoutDecision
	var idemKey *string
	if req.IdempotencyKey != "" {
		idemKey = &req.IdempotencyKey
	}
	err = r.pool.QueryRow(ctx, q, id, req.OwnerID, req.OwnerKind, req.SettlementCycleID, req.Amount, "YER", "approved", idemKey, n).Scan(
		&pd.ID, &pd.OwnerID, &pd.OwnerKind, &pd.SettlementCycleID, &pd.Amount, &pd.Currency, &pd.Status, &pd.IdempotencyKey, &pd.CreatedAt,
	)
	if err != nil {
		return domain.PayoutDecision{}, fmt.Errorf("wlt postgres: create payout decision: %w", err)
	}
	return pd, nil
}

func (r *PostgresRepository) GetPayoutDecisionByIdempotency(ctx context.Context, key string) (domain.PayoutDecision, bool, error) {
	if key == "" {
		return domain.PayoutDecision{}, false, nil
	}
	const q = `SELECT id, owner_id, owner_kind, settlement_cycle_id, amount, currency, status, idempotency_key, created_at FROM wlt_payout_decisions WHERE idempotency_key = $1`
	var pd domain.PayoutDecision
	err := r.pool.QueryRow(ctx, q, key).Scan(&pd.ID, &pd.OwnerID, &pd.OwnerKind, &pd.SettlementCycleID, &pd.Amount, &pd.Currency, &pd.Status, &pd.IdempotencyKey, &pd.CreatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return domain.PayoutDecision{}, false, nil
		}
		return domain.PayoutDecision{}, false, fmt.Errorf("wlt postgres: get payout decision by idem: %w", err)
	}
	return pd, true, nil
}

func (r *PostgresRepository) GetFinanceClose(ctx context.Context, businessDate string) (domain.FinanceClose, bool, error) {
	const q = `SELECT id, business_date, status, reconciliation_run_id, closed_at, created_at FROM wlt_finance_close WHERE business_date = $1`
	var fc domain.FinanceClose
	err := r.pool.QueryRow(ctx, q, businessDate).Scan(&fc.ID, &fc.BusinessDate, &fc.Status, &fc.ReconciliationRunID, &fc.ClosedAt, &fc.CreatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return domain.FinanceClose{}, false, nil
		}
		return domain.FinanceClose{}, false, fmt.Errorf("wlt postgres: get finance close: %w", err)
	}
	return fc, true, nil
}

func (r *PostgresRepository) GetLatestFinanceClose(ctx context.Context) (domain.FinanceClose, bool, error) {
	const q = `SELECT id, business_date, status, reconciliation_run_id, closed_at, created_at FROM wlt_finance_close ORDER BY created_at DESC LIMIT 1`
	var fc domain.FinanceClose
	err := r.pool.QueryRow(ctx, q).Scan(&fc.ID, &fc.BusinessDate, &fc.Status, &fc.ReconciliationRunID, &fc.ClosedAt, &fc.CreatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return domain.FinanceClose{}, false, nil
		}
		return domain.FinanceClose{}, false, fmt.Errorf("wlt postgres: get latest finance close: %w", err)
	}
	return fc, true, nil
}

func (r *PostgresRepository) UpsertFinanceClose(ctx context.Context, fc domain.FinanceClose) error {
	if fc.ID == "" {
		fc.ID = pgNewID("close")
	}
	if fc.CreatedAt.IsZero() {
		fc.CreatedAt = time.Now().UTC()
	}
	const q = `
INSERT INTO wlt_finance_close (id, business_date, status, reconciliation_run_id, closed_at, created_at)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (business_date) DO UPDATE
SET status = EXCLUDED.status, reconciliation_run_id = EXCLUDED.reconciliation_run_id, closed_at = EXCLUDED.closed_at`
	_, err := r.pool.Exec(ctx, q, fc.ID, fc.BusinessDate, fc.Status, fc.ReconciliationRunID, fc.ClosedAt, fc.CreatedAt)
	if err != nil {
		return fmt.Errorf("wlt postgres: upsert finance close: %w", err)
	}
	return nil
}

func (r *PostgresRepository) ListAuditEvents(ctx context.Context) ([]domain.CallbackEvent, error) {
	const q = `SELECT id, idempotency_key, target, payload, created_at FROM wlt_callback_events ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("wlt postgres: list callback events: %w", err)
	}
	defer rows.Close()

	var events []domain.CallbackEvent
	for rows.Next() {
		var ev domain.CallbackEvent
		if err := rows.Scan(&ev.EventID, &ev.IdempotencyKey, &ev.Target, &ev.Payload, &ev.CreatedAt); err != nil {
			return nil, fmt.Errorf("wlt postgres: callback event scan: %w", err)
		}
		events = append(events, ev)
	}
	return events, nil
}

func (r *PostgresRepository) CreateCallbackEvent(ctx context.Context, event domain.CallbackEvent) error {
	if event.EventID == "" {
		event.EventID = pgNewID("evt")
	}
	if event.CreatedAt.IsZero() {
		event.CreatedAt = time.Now().UTC()
	}
	const q = `INSERT INTO wlt_callback_events (id, idempotency_key, target, payload, created_at) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.pool.Exec(ctx, q, event.EventID, event.IdempotencyKey, event.Target, event.Payload, event.CreatedAt)
	if err != nil {
		return fmt.Errorf("wlt postgres: create callback event: %w", err)
	}
	return nil
}

// ─── Reporting and Accounting Methods ─────────────────────────────────────────

func (r *PostgresRepository) GetControlPanelFinanceCenter(ctx context.Context) (domain.ControlPanelFinanceCenter, error) {
	var totalPayments, totalRefunds float64
	var totalSettled float64
	var openSettlements int

	// Sum payment sessions (confirmed only)
	_ = r.pool.QueryRow(ctx, `SELECT COALESCE(SUM(amount), 0) FROM wlt_payment_sessions WHERE status = 'CONFIRMED'`).Scan(&totalPayments)
	// Sum refunds (confirmed only)
	_ = r.pool.QueryRow(ctx, `SELECT COALESCE(SUM(amount), 0) FROM wlt_refunds WHERE status = 'CONFIRMED'`).Scan(&totalRefunds)
	// Sum settlements (completed only)
	_ = r.pool.QueryRow(ctx, `SELECT COALESCE(SUM(partner_payout + captain_payout), 0) FROM wlt_settlements WHERE status = 'COMPLETED'`).Scan(&totalSettled)
	// Count open settlements
	_ = r.pool.QueryRow(ctx, `SELECT COUNT(*) FROM wlt_settlements WHERE status = 'PENDING' OR status = 'PROCESSING'`).Scan(&openSettlements)

	return domain.ControlPanelFinanceCenter{
		BusinessDate:  time.Now().UTC().Format("2006-01-02"),
		Currency:      "YER",
		ContractState: "CONTRACT_SCAFFOLD_PREVIEW_ONLY",
		Sections: []map[string]any{
			{
				"name":                    "ملخص اليوم المالي",
				"totalPaymentsMinorUnits": totalPayments,
				"totalRefundsMinorUnits":  totalRefunds,
				"totalSettledMinorUnits":  totalSettled,
				"openSettlements":         openSettlements,
			},
		},
	}, nil
}

func (r *PostgresRepository) ListStoreSettlementStatements(ctx context.Context, partnerID string) ([]domain.StoreSettlementStatement, error) {
	var q string
	var rows pgx.Rows
	var err error

	if partnerID != "" {
		q = `SELECT id, order_id, partner_id, gross_amount, platform_fee, partner_payout, status, created_at FROM wlt_settlements WHERE partner_id = $1 ORDER BY created_at DESC`
		rows, err = r.pool.Query(ctx, q, partnerID)
	} else {
		q = `SELECT id, order_id, partner_id, gross_amount, platform_fee, partner_payout, status, created_at FROM wlt_settlements ORDER BY created_at DESC`
		rows, err = r.pool.Query(ctx, q)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.StoreSettlementStatement
	for rows.Next() {
		var id, orderID, partID, status string
		var grossAmount, platformFee, partnerPayout float64
		var createdAt time.Time
		if err := rows.Scan(&id, &orderID, &partID, &grossAmount, &platformFee, &partnerPayout, &status, &createdAt); err != nil {
			return nil, err
		}

		list = append(list, domain.StoreSettlementStatement{
			StatementID:        id,
			StoreID:            partID,
			StoreName:          "متجر " + partID,
			SettlementCycleID:  id,
			Frequency:          "biweekly",
			PeriodStart:        createdAt.Format("2006-01-02"),
			PeriodEnd:          createdAt.Format("2006-01-02"),
			ExpectedPayoutDate: createdAt.Add(7 * 24 * time.Hour).Format("2006-01-02"),
			NetPayable: domain.MoneyAmount{
				AmountMinorUnits: partnerPayout,
				Currency:         "YER",
			},
			Orders:        []domain.StoreSettlementOrderRow{},
			ContractState: "CONTRACT_SCAFFOLD_PREVIEW_ONLY",
		})
	}
	return list, nil
}

func (r *PostgresRepository) ListControlPanelAccountStatements(ctx context.Context, actorKind string) ([]domain.AccountStatement, error) {
	q := `SELECT id, wallet_id, subject, transaction_type, amount, currency, reference_type, reference_id, description, status, created_at FROM wlt_ledger ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	grouped := make(map[string]*domain.AccountStatement)
	for rows.Next() {
		var id, walletID, subject, txType, currency, refType, refID, desc, status string
		var amount float64
		var createdAt time.Time
		if err := rows.Scan(&id, &walletID, &subject, &txType, &amount, &currency, &refType, &refID, &desc, &status, &createdAt); err != nil {
			return nil, err
		}

		actorType := ""
		if strings.HasPrefix(subject, "partner") {
			actorType = "partner"
		} else if strings.HasPrefix(subject, "captain") {
			actorType = "captain"
		} else if strings.HasPrefix(subject, "field") {
			actorType = "field_agent"
		} else {
			actorType = "customer_wallet"
		}

		if actorKind != "" && actorType != actorKind {
			continue
		}

		stmt, ok := grouped[subject]
		if !ok {
			stmt = &domain.AccountStatement{
				StatementID: "stmt-" + subject,
				Actor:       actorType,
				ActorID:     subject,
				PeriodStart: time.Now().Add(-30 * 24 * time.Hour).Format("2006-01-02"),
				PeriodEnd:   time.Now().Format("2006-01-02"),
				OpeningBalance: domain.MoneyAmount{
					AmountMinorUnits: 0,
					Currency:         currency,
				},
				ClosingBalance: domain.MoneyAmount{
					AmountMinorUnits: 0,
					Currency:         currency,
				},
				Lines:         []domain.AccountStatementLine{},
				ContractState: "CONTRACT_SCAFFOLD_PREVIEW_ONLY",
			}
			grouped[subject] = stmt
		}

		line := domain.AccountStatementLine{
			LineID:      id,
			Date:        createdAt.Format("2006-01-02"),
			SourceType:  refType,
			SourceID:    refID,
			Description: desc,
			RunningBalance: domain.MoneyAmount{
				AmountMinorUnits: 0,
				Currency:         currency,
			},
			Status: "posted_preview",
		}

		amt := domain.MoneyAmount{
			AmountMinorUnits: amount,
			Currency:         currency,
		}

		if txType == "DEBIT" {
			line.Debit = &amt
			if stmt.PeriodDebit != nil {
				stmt.PeriodDebit.AmountMinorUnits += amount
			} else {
				stmt.PeriodDebit = &domain.MoneyAmount{AmountMinorUnits: amount, Currency: currency}
			}
		} else {
			line.Credit = &amt
			if stmt.PeriodCredit != nil {
				stmt.PeriodCredit.AmountMinorUnits += amount
			} else {
				stmt.PeriodCredit = &domain.MoneyAmount{AmountMinorUnits: amount, Currency: currency}
			}
		}
		stmt.Lines = append(stmt.Lines, line)
	}

	var list []domain.AccountStatement
	for _, stmt := range grouped {
		list = append(list, *stmt)
	}
	return list, nil
}

func (r *PostgresRepository) ListChartOfAccounts(ctx context.Context) ([]domain.ChartOfAccount, error) {
	return []domain.ChartOfAccount{
		{AccountCode: "1100", AccountName: "محافظ العملاء", AccountType: "asset", NormalBalance: "debit", Currency: "YER"},
		{AccountCode: "2100", AccountName: "مستحقات الكباتن (COD)", AccountType: "liability", NormalBalance: "credit", Currency: "YER"},
		{AccountCode: "2200", AccountName: "مستحقات الشركاء", AccountType: "liability", NormalBalance: "credit", Currency: "YER"},
		{AccountCode: "2300", AccountName: "مستحقات المناديب", AccountType: "liability", NormalBalance: "credit", Currency: "YER"},
		{AccountCode: "3100", AccountName: "إيرادات المنصة", AccountType: "revenue", NormalBalance: "credit", Currency: "YER"},
		{AccountCode: "4100", AccountName: "استردادات العملاء", AccountType: "expense", NormalBalance: "debit", Currency: "YER"},
	}, nil
}

func (r *PostgresRepository) ListSubledgerBalances(ctx context.Context) ([]domain.SubledgerBalance, error) {
	const q = `
		SELECT reference_type, currency,
		       COALESCE(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END), 0) as credit_sum,
		       COALESCE(SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END), 0) as debit_sum
		FROM wlt_ledger
		GROUP BY reference_type, currency`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.SubledgerBalance
	for rows.Next() {
		var refType, currency string
		var creditSum, debitSum float64
		if err := rows.Scan(&refType, &currency, &creditSum, &debitSum); err != nil {
			return nil, err
		}

		balance := creditSum - debitSum
		list = append(list, domain.SubledgerBalance{
			SubledgerID:        "sub-" + refType,
			ControlAccountCode: "1100",
			Balance: domain.MoneyAmount{
				AmountMinorUnits: balance,
				Currency:         currency,
			},
			CloseGateImpact: "none",
		})
	}
	return list, nil
}

func (r *PostgresRepository) ListPostingRules(ctx context.Context) ([]domain.PostingRule, error) {
	return []domain.PostingRule{
		{EventKind: "payment_captured", DebitAccountCode: "1100", CreditAccountCode: "3100", StatementImpact: "debit customer, credit platform", SettlementImpact: "none"},
		{EventKind: "refund_confirmed", DebitAccountCode: "4100", CreditAccountCode: "1100", StatementImpact: "debit refunds, credit customer", SettlementImpact: "none"},
		{EventKind: "partner_settlement", DebitAccountCode: "3100", CreditAccountCode: "2200", StatementImpact: "debit platform, credit partner", SettlementImpact: "payout"},
		{EventKind: "captain_payout", DebitAccountCode: "3100", CreditAccountCode: "2100", StatementImpact: "debit platform, credit captain", SettlementImpact: "payout"},
	}, nil
}

func (r *PostgresRepository) GetTrialBalance(ctx context.Context) (domain.TrialBalance, error) {
	const q = `
		SELECT
			COALESCE(SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END), 0) as debit_sum,
			COALESCE(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END), 0) as credit_sum
		FROM wlt_ledger`

	var debitSum, creditSum float64
	err := r.pool.QueryRow(ctx, q).Scan(&debitSum, &creditSum)
	if err != nil {
		return domain.TrialBalance{}, err
	}

	return domain.TrialBalance{
		BusinessDate: time.Now().UTC().Format("2006-01-02"),
		TotalDebit: domain.MoneyAmount{
			AmountMinorUnits: debitSum,
			Currency:         "YER",
		},
		TotalCredit: domain.MoneyAmount{
			AmountMinorUnits: creditSum,
			Currency:         "YER",
		},
		IsBalanced:    debitSum == creditSum,
		ContractState: "CONTRACT_SCAFFOLD_PREVIEW_ONLY",
	}, nil
}

func (r *PostgresRepository) ListSettlementCalendar(ctx context.Context) ([]domain.SettlementCalendarCycle, error) {
	const q = `SELECT id, gross_amount, platform_fee, partner_payout, status, created_at FROM wlt_settlements ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.SettlementCalendarCycle
	for rows.Next() {
		var id, status string
		var grossAmount, platformFee, partnerPayout float64
		var createdAt time.Time
		if err := rows.Scan(&id, &grossAmount, &platformFee, &partnerPayout, &status, &createdAt); err != nil {
			return nil, err
		}

		list = append(list, domain.SettlementCalendarCycle{
			CycleID:            id,
			OwnerKind:          "partner",
			Frequency:          "biweekly",
			PeriodStart:        createdAt.Format("2006-01-02"),
			PeriodEnd:          createdAt.Format("2006-01-02"),
			CutoffDate:         createdAt.Format("2006-01-02"),
			ExpectedPayoutDate: createdAt.Add(7 * 24 * time.Hour).Format("2006-01-02"),
			Status:             "open_preview",
			NetPayable: domain.MoneyAmount{
				AmountMinorUnits: partnerPayout,
				Currency:         "YER",
			},
		})
	}
	return list, nil
}

func (r *PostgresRepository) ListRefundLedger(ctx context.Context) ([]domain.RefundLedgerCase, error) {
	const q = `SELECT id, order_id, client_id, amount, status FROM wlt_refunds ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.RefundLedgerCase
	for rows.Next() {
		var id, orderID, clientID, status string
		var amount float64
		if err := rows.Scan(&id, &orderID, &clientID, &amount, &status); err != nil {
			return nil, err
		}

		list = append(list, domain.RefundLedgerCase{
			RefundCaseID: id,
			OrderID:      orderID,
			CustomerID:   clientID,
			StoreID:      "store-demo",
			OriginalAmount: domain.MoneyAmount{
				AmountMinorUnits: amount,
				Currency:         "YER",
			},
			Status:           "approved_preview",
			LedgerImpact:     "debit",
			WalletImpact:     "credit",
			SettlementImpact: "hold",
		})
	}
	return list, nil
}

func (r *PostgresRepository) GetAuditPack(ctx context.Context) (domain.AuditPack, error) {
	const q = `SELECT id, target, created_at FROM wlt_callback_events ORDER BY created_at DESC LIMIT 50`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return domain.AuditPack{}, err
	}
	defer rows.Close()

	var events []domain.AuditEvent
	for rows.Next() {
		var id, target string
		var createdAt time.Time
		if err := rows.Scan(&id, &target, &createdAt); err != nil {
			return domain.AuditPack{}, err
		}
		events = append(events, domain.AuditEvent{
			ID:        id,
			EventType: target,
			ActorID:   "system",
			CreatedAt: createdAt,
		})
	}

	return domain.AuditPack{
		AuditPackID:   pgNewID("audit"),
		Status:        "passed",
		Events:        events,
		ContractState: "CONTRACT_SCAFFOLD_PREVIEW_ONLY",
	}, nil
}

func (r *PostgresRepository) GetStoreDeliveryFinanceSummary(ctx context.Context, captainID string) (domain.StoreDeliveryFinanceSummary, error) {
	const q = `SELECT COALESCE(SUM(captain_payout), 0) FROM wlt_settlements WHERE captain_id = $1`
	var earned float64
	err := r.pool.QueryRow(ctx, q, captainID).Scan(&earned)
	if err != nil {
		return domain.StoreDeliveryFinanceSummary{}, err
	}

	return domain.StoreDeliveryFinanceSummary{
		TotalEarningsMinorUnits: earned,
		Currency:                "YER",
		PeriodDate:              time.Now().UTC().Format("2006-01-02"),
		Deliveries:              []domain.FieldCommission{},
	}, nil
}
