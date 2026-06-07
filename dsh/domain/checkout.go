package domain

import "time"

// Checkout intent statuses — J-003
const (
	CheckoutStatusPendingPayment   = "pending_payment"
	CheckoutStatusPaymentConfirmed = "payment_confirmed"
	CheckoutStatusPaymentFailed    = "payment_failed"
	CheckoutStatusCancelled        = "cancelled"
	CheckoutStatusExpired          = "expired"
)

// WLT failure reason codes — mirror of wlt.openapi.yaml PaymentSession.failureReason
const (
	FailureReasonInsufficientBalance = "insufficient_balance"
	FailureReasonPolicyBlock         = "policy_block"
	FailureReasonFraudHold           = "fraud_hold"
	FailureReasonExpired             = "expired"
)

// CartServiceabilityQuery — 003A
type CartServiceabilityQuery struct {
	StoreID string
	ItemIDs []string
}

// CartServiceabilityResponse — 003A
type CartServiceabilityResponse struct {
	Serviceable          bool     `json:"serviceable"`
	StoreID              string   `json:"store_id"`
	ReasonCode           string   `json:"reason_code,omitempty"`
	UnavailableItemIDs   []string `json:"unavailable_item_ids,omitempty"`
}

// CheckoutIntentItem — 003B request
type CheckoutIntentItem struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

// CheckoutIntentRequest — 003B
type CheckoutIntentRequest struct {
	StoreID          string               `json:"store_id"`
	Items            []CheckoutIntentItem `json:"items"`
	DeliveryAddress  string               `json:"delivery_address"`
	DeliveryTimeSlot string               `json:"delivery_time_slot,omitempty"`
	ClientNote       string               `json:"client_note,omitempty"`
}

// CheckoutIntentRecord — stored record
type CheckoutIntentRecord struct {
	ID                       string     `json:"intent_id"`
	ClientID                 string     `json:"client_id"`
	StoreID                  string     `json:"store_id"`
	Status                   string     `json:"status"`
	SessionToken             string     `json:"session_token"`
	// Non-authoritative display snapshot. WLT owns final amount, ledger, settlement.
	RequestedAmountSnapshotMinorUnits int64 `json:"requested_amount_snapshot_minor_units"`
	WltPaymentRefID          *string    `json:"wlt_payment_ref_id,omitempty"`
	WltCallbackEventID       string     `json:"wlt_callback_event_id,omitempty"`
	FailureReason            *string    `json:"failure_reason,omitempty"`
	ExpiresAt                time.Time  `json:"expires_at"`
	CreatedAt                time.Time  `json:"created_at"`
	UpdatedAt                time.Time  `json:"updated_at"`
}

// CheckoutIntentResponse — 003B response
type CheckoutIntentResponse struct {
	IntentID     string    `json:"intent_id"`
	SessionToken string    `json:"session_token"`
	Status       string    `json:"status"`
	ExpiresAt    time.Time `json:"expires_at"`
	// Non-authoritative display snapshots. WLT owns final amounts.
	ItemsSubtotalMinorUnits int64 `json:"items_subtotal_minor_units"`
	DeliveryFeeMinorUnits   int64 `json:"delivery_fee_minor_units"`
	TotalAmountMinorUnits   int64 `json:"total_amount_minor_units"`
}

// CancelCheckoutIntentResponse — 003E
type CancelCheckoutIntentResponse struct {
	IntentID      string `json:"intent_id"`
	Status        string `json:"status"`
	CartPreserved bool   `json:"cart_preserved"`
}

// PaymentCallbackRequest — 003C (from WLT)
type PaymentCallbackRequest struct {
	IntentID        string  `json:"intent_id"`
	WltPaymentRefID string  `json:"wlt_payment_ref_id"`
	Status          string  `json:"status"`
	FailureReason   *string `json:"failure_reason,omitempty"`
	// CallbackEventID is the value of X-WLT-Event-Id header; used for replay protection.
	// Repository MUST reject a request if the same event_id was already processed.
	CallbackEventID string `json:"-"`
}

// PaymentCallbackResponse — 003C
type PaymentCallbackResponse struct {
	Acknowledged bool   `json:"acknowledged"`
	IntentID     string `json:"intent_id"`
	NextAction   string `json:"next_action"`
}
