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
	RequestedAmountMinorUnits int64     `json:"requested_amount_minor_units"`
	WltPaymentRefID          *string    `json:"wlt_payment_ref_id,omitempty"`
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
}

// CancelCheckoutIntentResponse — 003E
type CancelCheckoutIntentResponse struct {
	IntentID      string `json:"intent_id"`
	Status        string `json:"status"`
	CartPreserved bool   `json:"cart_preserved"`
}

// PaymentCallbackRequest — 003C (from WLT)
type PaymentCallbackRequest struct {
	IntentID         string  `json:"intent_id"`
	WltPaymentRefID  string  `json:"wlt_payment_ref_id"`
	Status           string  `json:"status"`
	FailureReason    *string `json:"failure_reason,omitempty"`
}

// PaymentCallbackResponse — 003C
type PaymentCallbackResponse struct {
	Acknowledged bool   `json:"acknowledged"`
	IntentID     string `json:"intent_id"`
	NextAction   string `json:"next_action"`
}
