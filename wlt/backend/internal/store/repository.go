package store

import (
	"context"

	"bthwani.local/wlt/domain"
)

// HealthRepository owns connection checking.
type HealthRepository interface {
	Ping(ctx context.Context) error
}

// PaymentRepository owns payment sessions lifecycle.
type PaymentRepository interface {
	CreatePaymentSession(ctx context.Context, req domain.CreatePaymentSessionRequest) (domain.PaymentSession, error)
	GetPaymentSession(ctx context.Context, id string) (domain.PaymentSession, error)
	GetPaymentSessionByIdempotency(ctx context.Context, key string) (domain.PaymentSession, bool, error)
	ConfirmPaymentSession(ctx context.Context, id string, req domain.ConfirmPaymentRequest) (domain.PaymentSession, error)
	FailPaymentSession(ctx context.Context, id string, reason string) (domain.PaymentSession, error)
}

// RefundRepository owns refund processing.
type RefundRepository interface {
	CreateRefund(ctx context.Context, req domain.CreateRefundRequest) (domain.Refund, error)
	GetRefund(ctx context.Context, id string) (domain.Refund, error)
	GetRefundByIdempotency(ctx context.Context, key string) (domain.Refund, bool, error)
	ListRefunds(ctx context.Context, q domain.ListRefundsQuery) (domain.ListRefundsResponse, error)
	ProcessRefund(ctx context.Context, id string) (domain.Refund, error)
	ConfirmRefund(ctx context.Context, id string) (domain.Refund, error)
	FailRefund(ctx context.Context, id string, reason string) (domain.Refund, error)
	MarkRefundCallbackSent(ctx context.Context, id string) error
}

// SettlementRepository owns store/partner settlements.
type SettlementRepository interface {
	CreateSettlement(ctx context.Context, req domain.CreateSettlementRequest) (domain.Settlement, error)
	GetSettlement(ctx context.Context, id string) (domain.Settlement, error)
	GetSettlementByIdempotency(ctx context.Context, key string) (domain.Settlement, bool, error)
	ListSettlements(ctx context.Context, q domain.ListSettlementsQuery) (domain.ListSettlementsResponse, error)
	ProcessSettlement(ctx context.Context, id string) (domain.Settlement, error)
	CompleteSettlement(ctx context.Context, id string) (domain.Settlement, error)
	FailSettlement(ctx context.Context, id string, reason string) (domain.Settlement, error)
	MarkSettlementCallbackSent(ctx context.Context, id string) error
}

// WalletRepository owns wallet creation and retrieval.
type WalletRepository interface {
	GetOrCreateWallet(ctx context.Context, subject, actorType string) (domain.Wallet, error)
	GetWalletSummary(ctx context.Context, subject string) (domain.WalletSummary, error)
}

// LedgerRepository owns ledger operations.
type LedgerRepository interface {
	CreateLedgerEntry(ctx context.Context, entry domain.LedgerEntry) (domain.LedgerEntry, error)
	ListLedger(ctx context.Context, q domain.ListLedgerQuery) (domain.ListLedgerResponse, error)
}

// OperatorRepository owns operator functions, reconciliation, and closes.
type OperatorRepository interface {
	RunReconciliation(ctx context.Context, idempotencyKey string) (domain.ReconciliationRun, error)
	ListReconciliationRuns(ctx context.Context) ([]domain.ReconciliationRun, error)
	CreateReconciliationRun(ctx context.Context, run domain.ReconciliationRun) error
	GetReconciliationRunByIdempotency(ctx context.Context, key string) (domain.ReconciliationRun, bool, error)
	CreatePayoutDecision(ctx context.Context, req domain.CreatePayoutDecisionRequest) (domain.PayoutDecision, error)
	GetPayoutDecisionByIdempotency(ctx context.Context, key string) (domain.PayoutDecision, bool, error)
	GetFinanceClose(ctx context.Context, businessDate string) (domain.FinanceClose, bool, error)
	GetLatestFinanceClose(ctx context.Context) (domain.FinanceClose, bool, error)
	UpsertFinanceClose(ctx context.Context, close domain.FinanceClose) error
	ListAuditEvents(ctx context.Context) ([]domain.CallbackEvent, error)
	CreateCallbackEvent(ctx context.Context, event domain.CallbackEvent) error
}

// Repository is the composed WLT data access interface.
type Repository interface {
	HealthRepository
	PaymentRepository
	RefundRepository
	SettlementRepository
	WalletRepository
	LedgerRepository
	OperatorRepository
}
