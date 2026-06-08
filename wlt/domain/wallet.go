package domain

import "time"

// Actor types — mirror DSH convention.
const (
	ActorClient   = "client"
	ActorCaptain  = "captain"
	ActorPartner  = "partner"
	ActorField    = "field"
	ActorOperator = "operator"
	ActorSystem   = "system"
)

// ─── Wallet ───────────────────────────────────────────────────────────────────

// Wallet is the financial account for a platform actor.
// Clients: voucher/credit balance. Captains/Partners: earnings balance.
type Wallet struct {
	ID        string    `json:"id"`
	Subject   string    `json:"subject"`    // actor identity (e.g. "client-dev-001")
	ActorType string    `json:"actor_type"` // client | captain | partner
	Balance   float64   `json:"balance"`    // current balance in platform currency
	Currency  string    `json:"currency"`   // "YER"
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// WalletSummary is the read-model served to frontend wallet screens.
type WalletSummary struct {
	Subject          string  `json:"subject"`
	ActorType        string  `json:"actor_type"`
	Balance          float64 `json:"balance"`
	Currency         string  `json:"currency"`
	TotalCredit      float64 `json:"total_credit"`
	TotalDebit       float64 `json:"total_debit"`
	PendingCredit    float64 `json:"pending_credit"`
	PendingDebit     float64 `json:"pending_debit"`
	TransactionCount int     `json:"transaction_count"`
}

// ─── Ledger ───────────────────────────────────────────────────────────────────

const (
	TxTypeCredit = "CREDIT"
	TxTypeDebit  = "DEBIT"

	TxStatusPending   = "PENDING"
	TxStatusCompleted = "COMPLETED"
	TxStatusFailed    = "FAILED"
	TxStatusReversed  = "REVERSED"
)

// LedgerEntry is an immutable financial event record.
type LedgerEntry struct {
	ID              string     `json:"id"`
	WalletID        string     `json:"wallet_id"`
	Subject         string     `json:"subject"`
	TransactionType string     `json:"transaction_type"` // CREDIT | DEBIT
	Amount          float64    `json:"amount"`
	Currency        string     `json:"currency"`
	ReferenceType   string     `json:"reference_type"` // payment_session | refund | settlement
	ReferenceID     string     `json:"reference_id"`
	OrderID         *string    `json:"order_id,omitempty"`
	Description     string     `json:"description"`
	Status          string     `json:"status"`
	CreatedAt       time.Time  `json:"created_at"`
	CompletedAt     *time.Time `json:"completed_at,omitempty"`
}

// ListLedgerQuery is the paginated query for ledger entries.
type ListLedgerQuery struct {
	Subject string
	Limit   int
	Offset  int
}

// ListLedgerResponse is the paginated response.
type ListLedgerResponse struct {
	Entries []LedgerEntry `json:"entries"`
	Total   int           `json:"total"`
}

// ─── Payment Session ──────────────────────────────────────────────────────────

// Payment session failure reason codes — referenced by DSH domain checkout.go.
const (
	FailureReasonInsufficientBalance = "insufficient_balance"
	FailureReasonPolicyBlock         = "policy_block"
	FailureReasonFraudHold           = "fraud_hold"
	FailureReasonExpired             = "expired"
	FailureReasonProviderError       = "provider_error"
)

const (
	PaymentStatusPending   = "PENDING"
	PaymentStatusConfirmed = "CONFIRMED"
	PaymentStatusFailed    = "FAILED"
	PaymentStatusExpired   = "EXPIRED"
	PaymentStatusCancelled = "CANCELLED"
)

// PaymentSession is the WLT record for a checkout payment request from DSH.
// DSH provides checkout_intent_id; WLT generates the session ID (wlt_payment_ref_id in DSH).
type PaymentSession struct {
	ID               string     `json:"id"`
	CheckoutIntentID string     `json:"checkout_intent_id"` // DSH checkout intent
	ClientID         string     `json:"client_id"`
	Amount           float64    `json:"amount"`
	Currency         string     `json:"currency"`
	Status           string     `json:"status"`
	PaymentMethod    string     `json:"payment_method"`
	ProviderRef      *string    `json:"provider_ref,omitempty"`
	DshBaseURL       string     `json:"dsh_base_url"`       // DSH base for callback delivery
	IdempotencyKey   string     `json:"idempotency_key"`
	FailureReason    *string    `json:"failure_reason,omitempty"`
	CreatedAt        time.Time  `json:"created_at"`
	ExpiresAt        time.Time  `json:"expires_at"`
	ConfirmedAt      *time.Time `json:"confirmed_at,omitempty"`
	FailedAt         *time.Time `json:"failed_at,omitempty"`
}

// CreatePaymentSessionRequest is sent by DSH (or frontend via DSH proxy) to WLT.
type CreatePaymentSessionRequest struct {
	CheckoutIntentID string  `json:"checkout_intent_id"`
	ClientID         string  `json:"client_id"`
	Amount           float64 `json:"amount"`
	Currency         string  `json:"currency"`
	PaymentMethod    string  `json:"payment_method"`
	DshBaseURL       string  `json:"dsh_base_url"`
	IdempotencyKey   string  `json:"idempotency_key"`
}

// ConfirmPaymentRequest is sent by the payment provider webhook to WLT.
type ConfirmPaymentRequest struct {
	ProviderRef string `json:"provider_ref"`
}

// FailPaymentRequest is sent by the payment provider webhook to WLT on failure.
type FailPaymentRequest struct {
	FailureReason string `json:"failure_reason"`
}

// ─── Refund ───────────────────────────────────────────────────────────────────

const (
	RefundStatusPending    = "PENDING"
	RefundStatusProcessing = "PROCESSING"
	RefundStatusConfirmed  = "CONFIRMED"
	RefundStatusFailed     = "FAILED"
)

// Refund is the WLT record for a refund request. Initiated by operator or triggered
// by a DSH delivery-failure event (via WltRefundTriggerRef handoff).
// WLT owns the decision and the ledger mutation; DSH records the ref only.
type Refund struct {
	ID                string     `json:"id"`
	OrderID           string     `json:"order_id"` // DSH order reference
	PaymentSessionID  string     `json:"payment_session_id"`
	ClientID          string     `json:"client_id"`
	Amount            float64    `json:"amount"`
	Currency          string     `json:"currency"`
	Reason            string     `json:"reason"`
	Status            string     `json:"status"`
	TriggerRef        *string    `json:"trigger_ref,omitempty"` // WltRefundTriggerRef from DSH
	DshBaseURL        string     `json:"dsh_base_url"`          // DSH base for callback delivery
	DshCallbackSentAt *time.Time `json:"dsh_callback_sent_at,omitempty"`
	IdempotencyKey    string     `json:"idempotency_key"`
	FailureReason     *string    `json:"failure_reason,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
	CompletedAt       *time.Time `json:"completed_at,omitempty"`
}

// CreateRefundRequest is sent by operator to WLT to initiate a refund.
type CreateRefundRequest struct {
	OrderID          string  `json:"order_id"`
	PaymentSessionID string  `json:"payment_session_id"`
	ClientID         string  `json:"client_id"`
	Amount           float64 `json:"amount"`
	Currency         string  `json:"currency"`
	Reason           string  `json:"reason"`
	TriggerRef       *string `json:"trigger_ref,omitempty"`
	DshBaseURL       string  `json:"dsh_base_url"`
	IdempotencyKey   string  `json:"idempotency_key"`
}

// ─── Settlement ───────────────────────────────────────────────────────────────

const (
	SettlementStatusPending    = "PENDING"
	SettlementStatusProcessing = "PROCESSING"
	SettlementStatusCompleted  = "COMPLETED"
	SettlementStatusFailed     = "FAILED"
)

// Settlement is the WLT record for financial clearing after a successful delivery.
// Captain payout + partner revenue are computed here; DSH records wlt_settlement_ref_id only.
// On COMPLETED, WLT sends POST {DshBaseURL}/orders/{order_id}/settlement-callback.
type Settlement struct {
	ID                  string     `json:"id"`
	OrderID             string     `json:"order_id"` // DSH order reference
	PartnerID           string     `json:"partner_id"`
	CaptainID           *string    `json:"captain_id,omitempty"`
	GrossAmount         float64    `json:"gross_amount"`
	PlatformFee         float64    `json:"platform_fee"`
	PartnerPayout       float64    `json:"partner_payout"`
	CaptainPayout       float64    `json:"captain_payout"`
	Currency            string     `json:"currency"`
	Status              string     `json:"status"`
	IdempotencyKey      string     `json:"idempotency_key"`
	DshBaseURL          string     `json:"dsh_base_url"`                    // DSH base for callback delivery
	DshCallbackSentAt   *time.Time `json:"dsh_callback_sent_at,omitempty"` // set after successful callback
	FailureReason       *string    `json:"failure_reason,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
	CompletedAt         *time.Time `json:"completed_at,omitempty"`
}

// CreateSettlementRequest is sent by operator to WLT to record and process a settlement.
// PlatformFeeRate and CaptainFeeRate are fractions (0.0–1.0).
// DshBaseURL is the DSH service base URL for the settlement-completion callback.
type CreateSettlementRequest struct {
	OrderID         string  `json:"order_id"`
	PartnerID       string  `json:"partner_id"`
	CaptainID       *string `json:"captain_id,omitempty"`
	GrossAmount     float64 `json:"gross_amount"`
	PlatformFeeRate float64 `json:"platform_fee_rate"` // e.g. 0.10 = 10%
	CaptainFeeRate  float64 `json:"captain_fee_rate"`  // fraction of gross for captain
	Currency        string  `json:"currency"`
	DshBaseURL      string  `json:"dsh_base_url"`
	IdempotencyKey  string  `json:"idempotency_key"`
}

// ListSettlementsQuery filters for the settlements list endpoint.
type ListSettlementsQuery struct {
	Status    string
	PartnerID string
	CaptainID string
	Limit     int
	Offset    int
}

// ListRefundsQuery filters for the refunds list endpoint.
type ListRefundsQuery struct {
	Status   string
	ClientID string
	OrderID  string
	Limit    int
	Offset   int
}

// ListRefundsResponse is the paginated response.
type ListRefundsResponse struct {
	Refunds []Refund `json:"refunds"`
	Total   int      `json:"total"`
}

// ListSettlementsResponse is the paginated response.
type ListSettlementsResponse struct {
	Settlements []Settlement `json:"settlements"`
	Total       int          `json:"total"`
}

// ─── Operator Features ────────────────────────────────────────────────────────

type ReconciliationRun struct {
	ID             string    `json:"id"`
	IdempotencyKey *string   `json:"idempotency_key,omitempty"`
	Status         string    `json:"status"` // passed | failed
	EntryCount     int       `json:"entry_count"`
	TotalDebit     float64   `json:"total_debit"`
	TotalCredit    float64   `json:"total_credit"`
	CreatedAt      time.Time `json:"created_at"`
}

type PayoutDecision struct {
	ID                string    `json:"id"`
	OwnerID           string    `json:"owner_id"`
	OwnerKind         string    `json:"owner_kind"`
	SettlementCycleID string    `json:"settlement_cycle_id"`
	Amount            float64   `json:"amount"`
	Currency          string    `json:"currency"`
	Status            string    `json:"status"` // approved
	IdempotencyKey    *string   `json:"idempotency_key,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
}

type CreatePayoutDecisionRequest struct {
	OwnerID           string  `json:"owner_id"`
	OwnerKind         string  `json:"owner_kind"`
	SettlementCycleID string  `json:"settlement_cycle_id"`
	Amount            float64 `json:"amount"`
	Currency          string  `json:"currency"`
	IdempotencyKey    string  `json:"idempotency_key"`
}

type FinanceClose struct {
	ID                  string     `json:"id"`
	BusinessDate        string     `json:"business_date"`
	Status              string     `json:"status"` // open | closed | failed
	ReconciliationRunID *string    `json:"reconciliation_run_id,omitempty"`
	ClosedAt            *time.Time `json:"closed_at,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
}

type CallbackEvent struct {
	EventID        string    `json:"eventId"`
	IdempotencyKey *string   `json:"idempotency_key,omitempty"`
	Target         string    `json:"target"`
	Payload        string    `json:"payload"` // raw JSON string
	CreatedAt      time.Time `json:"createdAt"`
}

// ─── Error codes ─────────────────────────────────────────────────────────────

const (
	ErrorCodeInternalError    = "internal_error"
	ErrorCodeInvalidParameter = "invalid_parameter"
	ErrorCodeNotFound         = "not_found"
	ErrorCodeForbidden        = "forbidden"
	ErrorCodeConflict         = "conflict"
	ErrorCodeUnauthorized     = "unauthorized"
	ErrorCodeUnauthenticated  = "unauthenticated"
)

// ─── Reporting and Accounting Models ─────────────────────────────────────────

type MoneyAmount struct {
	AmountMinorUnits float64 `json:"amountMinorUnits"`
	Currency         string  `json:"currency"`
	DisplayLabel     string  `json:"displayLabel,omitempty"`
}

type ControlPanelFinanceCenter struct {
	BusinessDate  string           `json:"businessDate"`
	Currency      string           `json:"currency"`
	Sections      []map[string]any `json:"sections,omitempty"`
	ContractState string           `json:"contractState"` // "CONTRACT_SCAFFOLD_PREVIEW_ONLY"
}

type StoreSettlementOrderRow struct {
	OrderID             string       `json:"orderId"`
	OrderDate           string       `json:"orderDate"`
	DeliveryDate        string       `json:"deliveryDate"`
	PaymentMethod       string       `json:"paymentMethod"` // "wallet" | "cod" | "card" | "manual"
	OrderGross          MoneyAmount  `json:"orderGross"`
	DeliveryFee         *MoneyAmount `json:"deliveryFee,omitempty"`
	PlatformCommission  *MoneyAmount `json:"platformCommission,omitempty"`
	Discount            *MoneyAmount `json:"discount,omitempty"`
	RefundAmount        *MoneyAmount `json:"refundAmount,omitempty"`
	NetSettlementImpact MoneyAmount  `json:"netSettlementImpact"`
	IncludedInCycle     *bool        `json:"includedInCycle,omitempty"`
	SettlementStatus    string       `json:"settlementStatus"` // "included" | "held" | "next_cycle" | "disputed"
	EvidenceRef         *string      `json:"evidenceRef,omitempty"`
}

type StoreSettlementStatement struct {
	StatementID             string                    `json:"statementId"`
	StoreID                 string                    `json:"storeId"`
	StoreName               string                    `json:"storeName"`
	SettlementCycleID       string                    `json:"settlementCycleId"`
	Frequency               string                    `json:"frequency"` // "biweekly"
	PeriodStart             string                    `json:"periodStart"`
	PeriodEnd               string                    `json:"periodEnd"`
	CutoffDate              *string                   `json:"cutoffDate,omitempty"`
	ExpectedPayoutDate      string                    `json:"expectedPayoutDate"`
	Status                  *string                   `json:"status,omitempty"` // "draft_preview" | "ready_for_review" | "held_by_wlt" | "paid_preview"
	GrossOrdersTotal        *MoneyAmount              `json:"grossOrdersTotal,omitempty"`
	DeliveryFeesTotal       *MoneyAmount              `json:"deliveryFeesTotal,omitempty"`
	PlatformCommissionTotal *MoneyAmount              `json:"platformCommissionTotal,omitempty"`
	DiscountsTotal          *MoneyAmount              `json:"discountsTotal,omitempty"`
	RefundsTotal            *MoneyAmount              `json:"refundsTotal,omitempty"`
	HoldsTotal              *MoneyAmount              `json:"holdsTotal,omitempty"`
	NetPayable              MoneyAmount               `json:"netPayable"`
	PaidToDate              *MoneyAmount              `json:"paidToDate,omitempty"`
	RemainingPayable        *MoneyAmount              `json:"remainingPayable,omitempty"`
	Orders                  []StoreSettlementOrderRow `json:"orders"`
	ContractState           string                    `json:"contractState"` // "CONTRACT_SCAFFOLD_PREVIEW_ONLY"
}

type AccountStatementLine struct {
	LineID         string       `json:"lineId"`
	Date           string       `json:"date"`
	SourceType     string       `json:"sourceType"` // "order" | "settlement" | "refund" | "payout" | "commission" | "wallet" | "adjustment"
	SourceID       string       `json:"sourceId"`
	Description    string       `json:"description"`
	Debit          *MoneyAmount `json:"debit,omitempty"`
	Credit         *MoneyAmount `json:"credit,omitempty"`
	RunningBalance MoneyAmount  `json:"runningBalance"`
	Status         string       `json:"status"` // "posted_preview" | "pending_wlt" | "held" | "disputed"
	EvidenceRef    *string      `json:"evidenceRef,omitempty"`
}

type AccountStatement struct {
	StatementID    string                 `json:"statementId"`
	Actor          string                 `json:"actor"` // "store" | "captain" | "store_courier" | "field_agent" | "customer_wallet" | "platform"
	ActorID        string                 `json:"actorId"`
	PeriodStart    string                 `json:"periodStart"`
	PeriodEnd      string                 `json:"periodEnd"`
	OpeningBalance MoneyAmount            `json:"openingBalance"`
	PeriodDebit    *MoneyAmount           `json:"periodDebit,omitempty"`
	PeriodCredit   *MoneyAmount           `json:"periodCredit,omitempty"`
	Adjustments    *MoneyAmount           `json:"adjustments,omitempty"`
	Holds          *MoneyAmount           `json:"holds,omitempty"`
	Releases       *MoneyAmount           `json:"releases,omitempty"`
	Refunds        *MoneyAmount           `json:"refunds,omitempty"`
	Payouts        *MoneyAmount           `json:"payouts,omitempty"`
	ClosingBalance MoneyAmount            `json:"closingBalance"`
	Lines          []AccountStatementLine `json:"lines"`
	ContractState  string                 `json:"contractState"` // "CONTRACT_SCAFFOLD_PREVIEW_ONLY"
}

type ChartOfAccount struct {
	AccountCode     string  `json:"accountCode"`
	AccountName     string  `json:"accountName"`
	AccountNameEn   *string `json:"accountNameEn,omitempty"`
	AccountType     string  `json:"accountType"`     // "asset" | "liability" | "revenue" | "expense" | "clearing" | "equity"
	NormalBalance   string  `json:"normalBalance"`   // "debit" | "credit"
	ControlAccount  *bool   `json:"controlAccount,omitempty"`
	ParentAccountId *string `json:"parentAccountId,omitempty"`
	Currency        string  `json:"currency"`
}

type SubledgerBalance struct {
	SubledgerID        string      `json:"subledgerId"`
	Domain             *string     `json:"domain,omitempty"`
	ControlAccountCode string      `json:"controlAccountCode"`
	ActorType          *string     `json:"actorType,omitempty"`
	SourceEvents       []string    `json:"sourceEvents,omitempty"`
	Balance            MoneyAmount `json:"balance"`
	CloseGateImpact    string      `json:"closeGateImpact"`
}

type PostingRule struct {
	EventKind            string  `json:"eventKind"`
	DebitAccountCode     string  `json:"debitAccountCode"`
	CreditAccountCode    string  `json:"creditAccountCode"`
	AmountSource         *string `json:"amountSource,omitempty"`
	Actor                *string `json:"actor,omitempty"`
	StatementImpact      string  `json:"statementImpact"`
	SettlementImpact     string  `json:"settlementImpact"`
	ReconciliationImpact *string `json:"reconciliationImpact,omitempty"`
}

type TrialBalance struct {
	BusinessDate  string           `json:"businessDate"`
	TotalDebit    MoneyAmount      `json:"totalDebit"`
	TotalCredit   MoneyAmount      `json:"totalCredit"`
	IsBalanced    bool             `json:"isBalanced"`
	Lines         []map[string]any `json:"lines,omitempty"`
	ContractState string           `json:"contractState"` // "CONTRACT_SCAFFOLD_PREVIEW_ONLY"
}

type SettlementCalendarCycle struct {
	CycleID            string       `json:"cycleId"`
	OwnerKind          string       `json:"ownerKind"` // "store" | "captain" | "field_agent" | "store_courier"
	Frequency          string       `json:"frequency"` // "biweekly" | "weekly" | "monthly"
	PeriodStart        string       `json:"periodStart"`
	PeriodEnd          string       `json:"periodEnd"`
	CutoffDate         string       `json:"cutoffDate"`
	ExpectedPayoutDate string       `json:"expectedPayoutDate"`
	ActualPayoutDate   *string      `json:"actualPayoutDate,omitempty"`
	Status             string       `json:"status"` // "open_preview" | "cutoff_locked" | "wlt_review" | "paid_preview" | "held"
	IncludedOrderCount *int         `json:"includedOrderCount,omitempty"`
	ExcludedOrderCount *int         `json:"excludedOrderCount,omitempty"`
	NetPayable         MoneyAmount  `json:"netPayable"`
	HoldAmount         *MoneyAmount `json:"holdAmount,omitempty"`
	ReleasePolicy      *string      `json:"releasePolicy,omitempty"`
}

type RefundLedgerCase struct {
	RefundCaseID     string       `json:"refundCaseId"`
	OrderID          string       `json:"orderId"`
	CustomerID       string       `json:"customerId"`
	StoreID          string       `json:"storeId"`
	OriginalAmount   MoneyAmount  `json:"originalAmount"`
	ApprovedAmount   *MoneyAmount `json:"approvedAmount,omitempty"`
	RejectedAmount   *MoneyAmount `json:"rejectedAmount,omitempty"`
	Reason           *string      `json:"reason,omitempty"`
	Evidence         []string     `json:"evidence,omitempty"`
	Status           string       `json:"status"` // "pending_wlt_review" | "approved_preview" | "rejected_preview" | "disputed"
	LedgerImpact     string       `json:"ledgerImpact"`
	WalletImpact     string       `json:"walletImpact"`
	SettlementImpact string       `json:"settlementImpact"`
}

type AuditEvent struct {
	ID          string         `json:"id"`
	EventType   string         `json:"eventType"`
	ActorID     string         `json:"actorId"`
	ActorRole   *string        `json:"actorRole,omitempty"`
	ReferenceID *string        `json:"referenceId,omitempty"`
	Payload     map[string]any `json:"payload,omitempty"`
	CreatedAt   time.Time      `json:"createdAt"`
}

type AuditPack struct {
	AuditPackID   string           `json:"auditPackId"`
	Status        string           `json:"status"`
	Events        []AuditEvent     `json:"events,omitempty"`
	Evidence      []map[string]any `json:"evidence,omitempty"`
	Approvals     []map[string]any `json:"approvals,omitempty"`
	ContractState string           `json:"contractState"` // "CONTRACT_SCAFFOLD_PREVIEW_ONLY"
}

type FieldCommission struct {
	ID               string     `json:"id"`
	StoreID          *string    `json:"storeId,omitempty"`
	AmountMinorUnits float64    `json:"amountMinorUnits"`
	Currency         string     `json:"currency"`
	Status           string     `json:"status"` // "pending" | "approved" | "paid"
	EarnedAt         *time.Time `json:"earnedAt,omitempty"`
}

type StoreDeliveryFinanceSummary struct {
	TotalEarningsMinorUnits float64           `json:"totalEarningsMinorUnits"`
	Currency                string            `json:"currency"`
	PendingCount            *int              `json:"pendingCount,omitempty"`
	PeriodDate              string            `json:"periodDate"`
	Deliveries              []FieldCommission `json:"deliveries,omitempty"`
}
