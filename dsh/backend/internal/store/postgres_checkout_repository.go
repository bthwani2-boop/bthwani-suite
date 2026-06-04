package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"bthwani.local/dsh/domain"
)

func (repo *PostgresRepository) CheckCartServiceability(ctx context.Context, query domain.CartServiceabilityQuery) (domain.CartServiceabilityResponse, error) {
	var statusTone, partnerReadiness string
	err := repo.db.QueryRowContext(ctx, `
SELECT status_tone, partner_readiness_status
FROM dsh_store_discovery_stores
WHERE id = $1`, query.StoreID).Scan(&statusTone, &partnerReadiness)
	if err == sql.ErrNoRows {
		return domain.CartServiceabilityResponse{}, fmt.Errorf("store not found")
	}
	if err != nil {
		return domain.CartServiceabilityResponse{}, err
	}

	if statusTone != "open" {
		return domain.CartServiceabilityResponse{
			Serviceable: false,
			StoreID:     query.StoreID,
			ReasonCode:  "store_closed",
		}, nil
	}
	if partnerReadiness != "ready" {
		return domain.CartServiceabilityResponse{
			Serviceable: false,
			StoreID:     query.StoreID,
			ReasonCode:  "partner_not_ready",
		}, nil
	}

	// Check item availability if provided
	if len(query.ItemIDs) > 0 {
		var unavailable []string
		for _, itemID := range query.ItemIDs {
			var exists bool
			err := repo.db.QueryRowContext(ctx, `
SELECT EXISTS(
  SELECT 1 FROM dsh_catalog_products
  WHERE id = $1 AND store_id = $2
  AND (available_override IS NULL OR available_override = TRUE)
)`, itemID, query.StoreID).Scan(&exists)
			if err != nil {
				return domain.CartServiceabilityResponse{}, err
			}
			if !exists {
				unavailable = append(unavailable, itemID)
			}
		}
		if len(unavailable) > 0 {
			return domain.CartServiceabilityResponse{
				Serviceable:        false,
				StoreID:            query.StoreID,
				ReasonCode:         "items_unavailable",
				UnavailableItemIDs: unavailable,
			}, nil
		}
	}

	return domain.CartServiceabilityResponse{
		Serviceable: true,
		StoreID:     query.StoreID,
	}, nil
}

func (repo *PostgresRepository) CreateCheckoutIntent(ctx context.Context, clientID string, req domain.CheckoutIntentRequest) (domain.CheckoutIntentResponse, error) {
	// Reject if active intent already exists for this client+store
	var activeCount int
	err := repo.db.QueryRowContext(ctx, `
SELECT COUNT(*) FROM dsh_checkout_intents
WHERE client_id = $1 AND store_id = $2
  AND status = 'pending_payment'
  AND expires_at > NOW()`, clientID, req.StoreID).Scan(&activeCount)
	if err != nil {
		return domain.CheckoutIntentResponse{}, err
	}
	if activeCount > 0 {
		return domain.CheckoutIntentResponse{}, fmt.Errorf("active checkout session already exists")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.CheckoutIntentResponse{}, err
	}
	defer tx.Rollback()

	// Verify store exists
	var storeExists bool
	err = tx.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)", req.StoreID).Scan(&storeExists)
	if err != nil {
		return domain.CheckoutIntentResponse{}, err
	}
	if !storeExists {
		return domain.CheckoutIntentResponse{}, fmt.Errorf("store not found")
	}

	intentID := fmt.Sprintf("intent-%d", time.Now().UnixNano())
	sessionToken := fmt.Sprintf("sess-%d", time.Now().UnixNano())
	expiresAt := time.Now().Add(15 * time.Minute)

	var intent struct {
		ID           string
		SessionToken string
		Status       string
		ExpiresAt    time.Time
	}
	err = tx.QueryRowContext(ctx, `
INSERT INTO dsh_checkout_intents
  (id, client_id, store_id, delivery_address, delivery_time_slot, client_note,
   status, session_token, requested_amount_snapshot_minor_units, expires_at, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, 'pending_payment', $7, 0, $8, NOW(), NOW())
RETURNING id, session_token, status, expires_at`,
			intentID, clientID, req.StoreID, req.DeliveryAddress,
		toNullString(req.DeliveryTimeSlot), toNullString(req.ClientNote),
		sessionToken, expiresAt,
	).Scan(&intent.ID, &intent.SessionToken, &intent.Status, &intent.ExpiresAt)
	if err != nil {
		return domain.CheckoutIntentResponse{}, fmt.Errorf("failed to create checkout intent: %w", err)
	}

	// Insert items
	for _, item := range req.Items {
		itemID := fmt.Sprintf("ci-item-%d", time.Now().UnixNano())
		_, err = tx.ExecContext(ctx, `
INSERT INTO dsh_checkout_intent_items (id, intent_id, product_id, quantity, created_at)
VALUES ($1, $2, $3, $4, NOW())`,
			itemID, intentID, item.ProductID, item.Quantity)
		if err != nil {
			return domain.CheckoutIntentResponse{}, fmt.Errorf("failed to insert intent item: %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return domain.CheckoutIntentResponse{}, err
	}

	return domain.CheckoutIntentResponse{
		IntentID:     intent.ID,
		SessionToken: intent.SessionToken,
		Status:       intent.Status,
		ExpiresAt:    intent.ExpiresAt,
	}, nil
}

func (repo *PostgresRepository) CancelCheckoutIntent(ctx context.Context, intentID string, clientID string) (domain.CancelCheckoutIntentResponse, error) {
	var currentStatus string
	err := repo.db.QueryRowContext(ctx, `
SELECT status FROM dsh_checkout_intents
WHERE id = $1 AND client_id = $2`, intentID, clientID).Scan(&currentStatus)
	if err == sql.ErrNoRows {
		return domain.CancelCheckoutIntentResponse{}, fmt.Errorf("intent not found")
	}
	if err != nil {
		return domain.CancelCheckoutIntentResponse{}, err
	}
	if currentStatus == domain.CheckoutStatusPaymentConfirmed {
		return domain.CancelCheckoutIntentResponse{}, fmt.Errorf("cannot cancel a confirmed payment intent")
	}

	_, err = repo.db.ExecContext(ctx, `
UPDATE dsh_checkout_intents
SET status = 'cancelled', updated_at = NOW()
WHERE id = $1 AND client_id = $2`, intentID, clientID)
	if err != nil {
		return domain.CancelCheckoutIntentResponse{}, err
	}

	return domain.CancelCheckoutIntentResponse{
		IntentID:      intentID,
		Status:        domain.CheckoutStatusCancelled,
		CartPreserved: true,
	}, nil
}

func (repo *PostgresRepository) ProcessPaymentCallback(ctx context.Context, req domain.PaymentCallbackRequest) (domain.PaymentCallbackResponse, error) {
	var currentStatus string
	var storedIntentID string
	err := repo.db.QueryRowContext(ctx, `
SELECT id, status FROM dsh_checkout_intents WHERE id = $1`, req.IntentID).Scan(&storedIntentID, &currentStatus)
	if err == sql.ErrNoRows {
		return domain.PaymentCallbackResponse{}, fmt.Errorf("intent not found")
	}
	if err != nil {
		return domain.PaymentCallbackResponse{}, err
	}

	var newStatus, nextAction string
	if req.Status == "confirmed" {
		newStatus = domain.CheckoutStatusPaymentConfirmed
		nextAction = "create_order"
		_, err = repo.db.ExecContext(ctx, `
UPDATE dsh_checkout_intents
SET status = $1, wlt_payment_ref_id = $2, updated_at = NOW()
WHERE id = $3`, newStatus, req.WltPaymentRefID, req.IntentID)
	} else {
		newStatus = domain.CheckoutStatusPaymentFailed
		nextAction = "show_failure"
		var fr sql.NullString
		if req.FailureReason != nil {
			fr.String = *req.FailureReason
			fr.Valid = true
		}
		_, err = repo.db.ExecContext(ctx, `
UPDATE dsh_checkout_intents
SET status = $1, failure_reason = $2, updated_at = NOW()
WHERE id = $3`, newStatus, fr, req.IntentID)
	}
	if err != nil {
		return domain.PaymentCallbackResponse{}, fmt.Errorf("failed to update intent: %w", err)
	}

	return domain.PaymentCallbackResponse{
		Acknowledged: true,
		IntentID:     req.IntentID,
		NextAction:   nextAction,
	}, nil
}

// toNullString converts an empty string to a sql NULL.
func toNullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: s, Valid: true}
}
