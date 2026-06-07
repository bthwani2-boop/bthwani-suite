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
