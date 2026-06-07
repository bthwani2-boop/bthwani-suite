package store

import (
	"context"
	"fmt"
	"math/rand"
	"sync"
	"time"

	"bthwani.local/wlt/domain"
)

// MemoryRepository is the in-memory WLT store for dev/test.
// All state is lost on restart. Thread-safe.
type MemoryRepository struct {
	mu                   sync.RWMutex
	payments             map[string]domain.PaymentSession  // id → session
	paymentByIdem        map[string]string                 // idempotency_key → id
	refunds              map[string]domain.Refund          // id → refund
	refundByIdem         map[string]string                 // idempotency_key → id
	settlements          map[string]domain.Settlement      // id → settlement
	settlementByIdem     map[string]string                 // idempotency_key → id
	wallets              map[string]domain.Wallet          // subject → wallet
	ledger               []domain.LedgerEntry
	reconciliations      []domain.ReconciliationRun
	reconciliationByIdem map[string]domain.ReconciliationRun
	payoutDecisions      map[string]domain.PayoutDecision
	payoutByIdem         map[string]string
	financeCloses        map[string]domain.FinanceClose
	callbackEvents       []domain.CallbackEvent
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		payments:             make(map[string]domain.PaymentSession),
		paymentByIdem:        make(map[string]string),
		refunds:              make(map[string]domain.Refund),
		refundByIdem:         make(map[string]string),
		settlements:          make(map[string]domain.Settlement),
		settlementByIdem:     make(map[string]string),
		wallets:              make(map[string]domain.Wallet),
		ledger:               nil,
		reconciliationByIdem: make(map[string]domain.ReconciliationRun),
		payoutDecisions:      make(map[string]domain.PayoutDecision),
		payoutByIdem:         make(map[string]string),
		financeCloses:        make(map[string]domain.FinanceClose),
	}
}

func newID(prefix string) string {
	return fmt.Sprintf("%s-%d-%04d", prefix, time.Now().UnixMilli(), rand.Intn(9999)) //nolint:gosec
}

func now() time.Time { return time.Now().UTC() }

// ─── Payment Sessions ─────────────────────────────────────────────────────────

func (r *MemoryRepository) CreatePaymentSession(_ context.Context, req domain.CreatePaymentSessionRequest) (domain.PaymentSession, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if req.CheckoutIntentID == "" || req.ClientID == "" || req.Amount <= 0 || req.IdempotencyKey == "" {
		return domain.PaymentSession{}, fmt.Errorf("checkout_intent_id, client_id, amount > 0, and idempotency_key are required")
	}
	if req.Currency == "" {
		req.Currency = "YER"
	}
	if req.PaymentMethod == "" {
		req.PaymentMethod = "wallet"
	}

	if id, ok := r.paymentByIdem[req.IdempotencyKey]; ok {
		return r.payments[id], nil
	}

	n := now()
	ps := domain.PaymentSession{
		ID:               newID("pay"),
		CheckoutIntentID: req.CheckoutIntentID,
		ClientID:         req.ClientID,
		Amount:           req.Amount,
		Currency:         req.Currency,
		Status:           domain.PaymentStatusPending,
		PaymentMethod:    req.PaymentMethod,
		DshBaseURL:       req.DshBaseURL,
		IdempotencyKey:   req.IdempotencyKey,
		CreatedAt:        n,
		ExpiresAt:        n.Add(15 * time.Minute),
	}
	r.payments[ps.ID] = ps
	r.paymentByIdem[req.IdempotencyKey] = ps.ID
	return ps, nil
}

func (r *MemoryRepository) GetPaymentSession(_ context.Context, id string) (domain.PaymentSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	ps, ok := r.payments[id]
	if !ok {
		return domain.PaymentSession{}, fmt.Errorf("payment session not found")
	}
	return ps, nil
}

func (r *MemoryRepository) GetPaymentSessionByIdempotency(_ context.Context, key string) (domain.PaymentSession, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	id, ok := r.paymentByIdem[key]
	if !ok {
		return domain.PaymentSession{}, false, nil
	}
	return r.payments[id], true, nil
}

func (r *MemoryRepository) ConfirmPaymentSession(_ context.Context, id string, req domain.ConfirmPaymentRequest) (domain.PaymentSession, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	ps, ok := r.payments[id]
	if !ok {
		return domain.PaymentSession{}, fmt.Errorf("payment session not found")
	}
	if ps.Status != domain.PaymentStatusPending {
		return domain.PaymentSession{}, fmt.Errorf("payment session is not in PENDING state: current=%s", ps.Status)
	}
	n := now()
	ps.Status = domain.PaymentStatusConfirmed
	ps.ConfirmedAt = &n
	if req.ProviderRef != "" {
		ps.ProviderRef = &req.ProviderRef
	}
	r.payments[id] = ps
	return ps, nil
}

func (r *MemoryRepository) FailPaymentSession(_ context.Context, id string, reason string) (domain.PaymentSession, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	ps, ok := r.payments[id]
	if !ok {
		return domain.PaymentSession{}, fmt.Errorf("payment session not found")
	}
	if ps.Status != domain.PaymentStatusPending {
		return domain.PaymentSession{}, fmt.Errorf("payment session is not in PENDING state: current=%s", ps.Status)
	}
	n := now()
	ps.Status = domain.PaymentStatusFailed
	ps.FailedAt = &n
	ps.FailureReason = &reason
	r.payments[id] = ps
	return ps, nil
}

// ─── Refunds ─────────────────────────────────────────────────────────────────

func (r *MemoryRepository) CreateRefund(_ context.Context, req domain.CreateRefundRequest) (domain.Refund, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if req.OrderID == "" || req.ClientID == "" || req.Amount <= 0 || req.IdempotencyKey == "" {
		return domain.Refund{}, fmt.Errorf("order_id, client_id, amount > 0, and idempotency_key are required")
	}
	if req.Currency == "" {
		req.Currency = "YER"
	}

	if id, ok := r.refundByIdem[req.IdempotencyKey]; ok {
		return r.refunds[id], nil
	}

	n := now()
	ref := domain.Refund{
		ID:               newID("ref"),
		OrderID:          req.OrderID,
		PaymentSessionID: req.PaymentSessionID,
		ClientID:         req.ClientID,
		Amount:           req.Amount,
		Currency:         req.Currency,
		Reason:           req.Reason,
		Status:           domain.RefundStatusPending,
		TriggerRef:       req.TriggerRef,
		DshBaseURL:       req.DshBaseURL,
		IdempotencyKey:   req.IdempotencyKey,
		CreatedAt:        n,
		UpdatedAt:        n,
	}
	r.refunds[ref.ID] = ref
	r.refundByIdem[req.IdempotencyKey] = ref.ID
	return ref, nil
}

func (r *MemoryRepository) GetRefund(_ context.Context, id string) (domain.Refund, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	ref, ok := r.refunds[id]
	if !ok {
		return domain.Refund{}, fmt.Errorf("refund not found")
	}
	return ref, nil
}

func (r *MemoryRepository) GetRefundByIdempotency(_ context.Context, key string) (domain.Refund, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	id, ok := r.refundByIdem[key]
	if !ok {
		return domain.Refund{}, false, nil
	}
	return r.refunds[id], true, nil
}

func (r *MemoryRepository) ListRefunds(_ context.Context, q domain.ListRefundsQuery) (domain.ListRefundsResponse, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if q.Limit <= 0 {
		q.Limit = 50
	}
	if q.Limit > 200 {
		q.Limit = 200
	}

	var all []domain.Refund
	for _, ref := range r.refunds {
		if q.Status != "" && ref.Status != q.Status {
			continue
		}
		if q.ClientID != "" && ref.ClientID != q.ClientID {
			continue
		}
		if q.OrderID != "" && ref.OrderID != q.OrderID {
			continue
		}
		all = append(all, ref)
	}

	total := len(all)
	start := q.Offset
	if start > total {
		start = total
	}
	end := start + q.Limit
	if end > total {
		end = total
	}

	return domain.ListRefundsResponse{
		Refunds: all[start:end],
		Total:   total,
	}, nil
}

func (r *MemoryRepository) ProcessRefund(_ context.Context, id string) (domain.Refund, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	ref, ok := r.refunds[id]
	if !ok {
		return domain.Refund{}, fmt.Errorf("refund not found")
	}
	if ref.Status != domain.RefundStatusPending {
		return domain.Refund{}, fmt.Errorf("refund is not in PENDING state: current=%s", ref.Status)
	}
	ref.Status = domain.RefundStatusProcessing
	ref.UpdatedAt = now()
	r.refunds[id] = ref
	return ref, nil
}

func (r *MemoryRepository) ConfirmRefund(_ context.Context, id string) (domain.Refund, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	ref, ok := r.refunds[id]
	if !ok {
		return domain.Refund{}, fmt.Errorf("refund not found")
	}
	if ref.Status != domain.RefundStatusProcessing {
		return domain.Refund{}, fmt.Errorf("refund is not in PROCESSING state: current=%s", ref.Status)
	}
	n := now()
	ref.Status = domain.RefundStatusConfirmed
	ref.UpdatedAt = n
	ref.CompletedAt = &n
	r.refunds[id] = ref
	return ref, nil
}

func (r *MemoryRepository) FailRefund(_ context.Context, id string, reason string) (domain.Refund, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	ref, ok := r.refunds[id]
	if !ok {
		return domain.Refund{}, fmt.Errorf("refund not found")
	}
	n := now()
	ref.Status = domain.RefundStatusFailed
	ref.UpdatedAt = n
	ref.FailureReason = &reason
	r.refunds[id] = ref
	return ref, nil
}

func (r *MemoryRepository) MarkRefundCallbackSent(_ context.Context, id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	ref, ok := r.refunds[id]
	if !ok {
		return fmt.Errorf("refund not found")
	}
	n := now()
	ref.DshCallbackSentAt = &n
	r.refunds[id] = ref
	return nil
}

// ─── Settlements ─────────────────────────────────────────────────────────────

func (r *MemoryRepository) CreateSettlement(_ context.Context, req domain.CreateSettlementRequest) (domain.Settlement, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if req.OrderID == "" || req.PartnerID == "" || req.GrossAmount <= 0 || req.IdempotencyKey == "" {
		return domain.Settlement{}, fmt.Errorf("order_id, partner_id, gross_amount > 0, and idempotency_key are required")
	}
	if req.Currency == "" {
		req.Currency = "YER"
	}
	if req.PlatformFeeRate < 0 || req.PlatformFeeRate > 1 {
		return domain.Settlement{}, fmt.Errorf("platform_fee_rate must be between 0 and 1")
	}
	if req.CaptainFeeRate < 0 || req.CaptainFeeRate > 1 {
		return domain.Settlement{}, fmt.Errorf("captain_fee_rate must be between 0 and 1")
	}

	if id, ok := r.settlementByIdem[req.IdempotencyKey]; ok {
		return r.settlements[id], nil
	}

	platformFee := req.GrossAmount * req.PlatformFeeRate
	captainPayout := req.GrossAmount * req.CaptainFeeRate
	partnerPayout := req.GrossAmount - platformFee - captainPayout

	n := now()
	s := domain.Settlement{
		ID:             newID("set"),
		OrderID:        req.OrderID,
		PartnerID:      req.PartnerID,
		CaptainID:      req.CaptainID,
		GrossAmount:    req.GrossAmount,
		PlatformFee:    platformFee,
		PartnerPayout:  partnerPayout,
		CaptainPayout:  captainPayout,
		Currency:       req.Currency,
		Status:         domain.SettlementStatusPending,
		IdempotencyKey: req.IdempotencyKey,
		DshBaseURL:     req.DshBaseURL,
		CreatedAt:      n,
		UpdatedAt:      n,
	}
	r.settlements[s.ID] = s
	r.settlementByIdem[req.IdempotencyKey] = s.ID
	return s, nil
}

func (r *MemoryRepository) GetSettlement(_ context.Context, id string) (domain.Settlement, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	s, ok := r.settlements[id]
	if !ok {
		return domain.Settlement{}, fmt.Errorf("settlement not found")
	}
	return s, nil
}

func (r *MemoryRepository) GetSettlementByIdempotency(_ context.Context, key string) (domain.Settlement, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	id, ok := r.settlementByIdem[key]
	if !ok {
		return domain.Settlement{}, false, nil
	}
	return r.settlements[id], true, nil
}

func (r *MemoryRepository) ListSettlements(_ context.Context, q domain.ListSettlementsQuery) (domain.ListSettlementsResponse, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if q.Limit <= 0 {
		q.Limit = 50
	}
	if q.Limit > 200 {
		q.Limit = 200
	}

	var all []domain.Settlement
	for _, s := range r.settlements {
		if q.Status != "" && s.Status != q.Status {
			continue
		}
		if q.PartnerID != "" && s.PartnerID != q.PartnerID {
			continue
		}
		if q.CaptainID != "" && (s.CaptainID == nil || *s.CaptainID != q.CaptainID) {
			continue
		}
		all = append(all, s)
	}

	total := len(all)
	start := q.Offset
	if start > total {
		start = total
	}
	end := start + q.Limit
	if end > total {
		end = total
	}

	return domain.ListSettlementsResponse{
		Settlements: all[start:end],
		Total:       total,
	}, nil
}

func (r *MemoryRepository) ProcessSettlement(_ context.Context, id string) (domain.Settlement, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	s, ok := r.settlements[id]
	if !ok {
		return domain.Settlement{}, fmt.Errorf("settlement not found")
	}
	if s.Status != domain.SettlementStatusPending {
		return domain.Settlement{}, fmt.Errorf("settlement is not in PENDING state: current=%s", s.Status)
	}
	s.Status = domain.SettlementStatusProcessing
	s.UpdatedAt = now()
	r.settlements[id] = s
	return s, nil
}

func (r *MemoryRepository) CompleteSettlement(_ context.Context, id string) (domain.Settlement, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	s, ok := r.settlements[id]
	if !ok {
		return domain.Settlement{}, fmt.Errorf("settlement not found")
	}
	if s.Status != domain.SettlementStatusProcessing {
		return domain.Settlement{}, fmt.Errorf("settlement is not in PROCESSING state: current=%s", s.Status)
	}
	n := now()
	s.Status = domain.SettlementStatusCompleted
	s.UpdatedAt = n
	s.CompletedAt = &n
	r.settlements[id] = s
	return s, nil
}

func (r *MemoryRepository) FailSettlement(_ context.Context, id string, reason string) (domain.Settlement, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	s, ok := r.settlements[id]
	if !ok {
		return domain.Settlement{}, fmt.Errorf("settlement not found")
	}
	n := now()
	s.Status = domain.SettlementStatusFailed
	s.UpdatedAt = n
	s.FailureReason = &reason
	r.settlements[id] = s
	return s, nil
}

func (r *MemoryRepository) MarkSettlementCallbackSent(_ context.Context, id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	s, ok := r.settlements[id]
	if !ok {
		return fmt.Errorf("settlement not found")
	}
	n := now()
	s.DshCallbackSentAt = &n
	r.settlements[id] = s
	return nil
}

// ─── Wallets ─────────────────────────────────────────────────────────────────

func (r *MemoryRepository) GetOrCreateWallet(_ context.Context, subject, actorType string) (domain.Wallet, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if w, ok := r.wallets[subject]; ok {
		return w, nil
	}
	n := now()
	w := domain.Wallet{
		ID:        newID("wal"),
		Subject:   subject,
		ActorType: actorType,
		Balance:   0,
		Currency:  "YER",
		CreatedAt: n,
		UpdatedAt: n,
	}
	r.wallets[subject] = w
	return w, nil
}

func (r *MemoryRepository) GetWalletSummary(_ context.Context, subject string) (domain.WalletSummary, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	w, ok := r.wallets[subject]
	if !ok {
		return domain.WalletSummary{}, fmt.Errorf("wallet not found")
	}

	var totalCredit, totalDebit, pendingCredit, pendingDebit float64
	var count int
	for _, e := range r.ledger {
		if e.Subject != subject {
			continue
		}
		count++
		switch e.TransactionType {
		case domain.TxTypeCredit:
			if e.Status == domain.TxStatusCompleted {
				totalCredit += e.Amount
			} else if e.Status == domain.TxStatusPending {
				pendingCredit += e.Amount
			}
		case domain.TxTypeDebit:
			if e.Status == domain.TxStatusCompleted {
				totalDebit += e.Amount
			} else if e.Status == domain.TxStatusPending {
				pendingDebit += e.Amount
			}
		}
	}

	return domain.WalletSummary{
		Subject:          w.Subject,
		ActorType:        w.ActorType,
		Balance:          w.Balance,
		Currency:         w.Currency,
		TotalCredit:      totalCredit,
		TotalDebit:       totalDebit,
		PendingCredit:    pendingCredit,
		PendingDebit:     pendingDebit,
		TransactionCount: count,
	}, nil
}

// ─── Ledger ──────────────────────────────────────────────────────────────────

func (r *MemoryRepository) CreateLedgerEntry(_ context.Context, entry domain.LedgerEntry) (domain.LedgerEntry, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if entry.ID == "" {
		entry.ID = newID("led")
	}
	if entry.CreatedAt.IsZero() {
		entry.CreatedAt = now()
	}
	r.ledger = append(r.ledger, entry)
	return entry, nil
}

func (r *MemoryRepository) ListLedger(_ context.Context, q domain.ListLedgerQuery) (domain.ListLedgerResponse, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if q.Limit <= 0 {
		q.Limit = 50
	}
	if q.Limit > 200 {
		q.Limit = 200
	}

	var filtered []domain.LedgerEntry
	for _, e := range r.ledger {
		if q.Subject != "" && e.Subject != q.Subject {
			continue
		}
		filtered = append(filtered, e)
	}

	total := len(filtered)
	start := q.Offset
	if start > total {
		start = total
	}
	end := start + q.Limit
	if end > total {
		end = total
	}

	return domain.ListLedgerResponse{
		Entries: filtered[start:end],
		Total:   total,
	}, nil
}

// ─── Health ──────────────────────────────────────────────────────────────────

func (r *MemoryRepository) Ping(_ context.Context) error { return nil }

// ─── Operator Features ───────────────────────────────────────────────────

func (r *MemoryRepository) RunReconciliation(ctx context.Context, idempotencyKey string) (domain.ReconciliationRun, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if idempotencyKey != "" {
		if run, ok := r.reconciliationByIdem[idempotencyKey]; ok {
			return run, nil
		}
	}

	var totalDebit, totalCredit float64
	var count int
	for _, e := range r.ledger {
		if e.Status == domain.TxStatusCompleted {
			count++
			if e.TransactionType == domain.TxTypeDebit {
				totalDebit += e.Amount
			} else if e.TransactionType == domain.TxTypeCredit {
				totalCredit += e.Amount
			}
		}
	}

	status := "failed"
	if totalDebit == totalCredit {
		status = "passed"
	}

	run := domain.ReconciliationRun{
		ID:          newID("rec"),
		Status:      status,
		EntryCount:  count,
		TotalDebit:  totalDebit,
		TotalCredit: totalCredit,
		CreatedAt:   now(),
	}
	if idempotencyKey != "" {
		run.IdempotencyKey = &idempotencyKey
	}

	r.reconciliations = append(r.reconciliations, run)
	if idempotencyKey != "" {
		r.reconciliationByIdem[idempotencyKey] = run
	}
	return run, nil
}

func (r *MemoryRepository) ListReconciliationRuns(_ context.Context) ([]domain.ReconciliationRun, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	runs := make([]domain.ReconciliationRun, len(r.reconciliations))
	copy(runs, r.reconciliations)
	return runs, nil
}

func (r *MemoryRepository) CreateReconciliationRun(_ context.Context, run domain.ReconciliationRun) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if run.ID == "" {
		run.ID = newID("rec")
	}
	if run.CreatedAt.IsZero() {
		run.CreatedAt = now()
	}
	r.reconciliations = append(r.reconciliations, run)
	if run.IdempotencyKey != nil && *run.IdempotencyKey != "" {
		r.reconciliationByIdem[*run.IdempotencyKey] = run
	}
	return nil
}

func (r *MemoryRepository) GetReconciliationRunByIdempotency(_ context.Context, key string) (domain.ReconciliationRun, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	run, ok := r.reconciliationByIdem[key]
	return run, ok, nil
}

func (r *MemoryRepository) CreatePayoutDecision(_ context.Context, req domain.CreatePayoutDecisionRequest) (domain.PayoutDecision, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if req.OwnerID == "" || req.SettlementCycleID == "" || req.Amount <= 0 {
		return domain.PayoutDecision{}, fmt.Errorf("owner_id, settlement_cycle_id, and amount are required")
	}

	if id, ok := r.payoutByIdem[req.IdempotencyKey]; ok {
		return r.payoutDecisions[id], nil
	}

	pd := domain.PayoutDecision{
		ID:                newID("po"),
		OwnerID:           req.OwnerID,
		OwnerKind:         req.OwnerKind,
		SettlementCycleID: req.SettlementCycleID,
		Amount:            req.Amount,
		Currency:          "YER",
		Status:            "approved",
		CreatedAt:         now(),
	}
	if req.IdempotencyKey != "" {
		pd.IdempotencyKey = &req.IdempotencyKey
	}

	r.payoutDecisions[pd.ID] = pd
	if req.IdempotencyKey != "" {
		r.payoutByIdem[req.IdempotencyKey] = pd.ID
	}
	return pd, nil
}

func (r *MemoryRepository) GetPayoutDecisionByIdempotency(_ context.Context, key string) (domain.PayoutDecision, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	id, ok := r.payoutByIdem[key]
	if !ok {
		return domain.PayoutDecision{}, false, nil
	}
	return r.payoutDecisions[id], true, nil
}

func (r *MemoryRepository) GetFinanceClose(_ context.Context, businessDate string) (domain.FinanceClose, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	fc, ok := r.financeCloses[businessDate]
	return fc, ok, nil
}

func (r *MemoryRepository) GetLatestFinanceClose(_ context.Context) (domain.FinanceClose, bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var latest domain.FinanceClose
	var found bool
	for _, fc := range r.financeCloses {
		if !found || fc.CreatedAt.After(latest.CreatedAt) {
			latest = fc
			found = true
		}
	}
	return latest, found, nil
}

func (r *MemoryRepository) UpsertFinanceClose(_ context.Context, fc domain.FinanceClose) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if fc.ID == "" {
		fc.ID = newID("close")
	}
	if fc.CreatedAt.IsZero() {
		fc.CreatedAt = now()
	}
	r.financeCloses[fc.BusinessDate] = fc
	return nil
}

func (r *MemoryRepository) ListAuditEvents(_ context.Context) ([]domain.CallbackEvent, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	events := make([]domain.CallbackEvent, len(r.callbackEvents))
	copy(events, r.callbackEvents)
	return events, nil
}

func (r *MemoryRepository) CreateCallbackEvent(_ context.Context, event domain.CallbackEvent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if event.EventID == "" {
		event.EventID = newID("evt")
	}
	if event.CreatedAt.IsZero() {
		event.CreatedAt = now()
	}
	r.callbackEvents = append(r.callbackEvents, event)
	return nil
}
