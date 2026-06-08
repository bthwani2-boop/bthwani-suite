package domain

import "time"

const (
	StatusCreated           = "CREATED"
	StatusAccepted          = "ACCEPTED"
	StatusReadyForPickup    = "READY_FOR_PICKUP"
	StatusDelivered         = "DELIVERED"
	StatusCancelled         = "CANCELLED"
	StatusRefunded          = "REFUNDED"
	StatusAcceptedByCaptain = "ACCEPTED_BY_CAPTAIN"
	StatusPickedUp          = "PICKED_UP"
	StatusEnRoute           = "EN_ROUTE"
	StatusArrived           = "ARRIVED"
	// DSH-SLICE-005F: delivery failure states.
	// WLT BOUNDARY: refund execution is WLT responsibility (004E). DSH records reference only.
	StatusFailedDelivery   = "FAILED_DELIVERY"
	StatusReturningToStore = "RETURNING_TO_STORE"
	StatusReturned         = "RETURNED"
)

// Settlement status values for OrderRecord.SettlementStatus.
// WLT BOUNDARY: DSH records the status as a read-only bridge value.
// All settlement computation and ledger mutation belong to WLT (J-010).
const (
	SettlementStatusNotSettled        = "NOT_SETTLED"
	SettlementStatusSettlementPending = "SETTLEMENT_PENDING"
	SettlementStatusSettled           = "SETTLED"
	SettlementStatusSettlementFailed  = "SETTLEMENT_FAILED"
)

type OrderRecord struct {
	ID                     string   `json:"id"`
	StoreID                string   `json:"store_id"`
	ClientID               string   `json:"client_id"`
	Status                 string   `json:"status"`
	TotalPrice             float64  `json:"total_price"`
	WltPaymentRefID        *string  `json:"wlt_payment_ref_id,omitempty"`
	WltRefundRefID         *string  `json:"wlt_refund_ref_id,omitempty"`
	CheckoutIntentID       *string  `json:"checkout_intent_id,omitempty"`
	CaptainID              *string  `json:"captain_id,omitempty"`
	CaptainLatitude        *float64 `json:"captain_latitude,omitempty"`
	CaptainLongitude       *float64 `json:"captain_longitude,omitempty"`
	CaptainLifecycleStatus *string  `json:"captain_lifecycle_status,omitempty"`
	PodMediaKey            *string  `json:"pod_media_key,omitempty"`
	// DSH-SLICE-005F: delivery failure fields.
	// WltRefundTriggerRef is a bridge reference for WLT to execute refund — DSH does NOT mutate finances.
	DeliveryFailureReason *string `json:"delivery_failure_reason,omitempty"`
	WltRefundTriggerRef   *string `json:"wlt_refund_trigger_ref,omitempty"`
	// Settlement bridge fields (J-010). WLT owns all settlement computation.
	// DSH records the WLT settlement ID and the current settlement status as read-only bridge values.
	WltSettlementRefID *string   `json:"wlt_settlement_ref_id,omitempty"`
	SettlementStatus   string    `json:"settlement_status,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type OrderItemRecord struct {
	ID        string  `json:"id"`
	OrderID   string  `json:"order_id"`
	ProductID string  `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type OrderStatusEventRecord struct {
	ID         string    `json:"id"`
	OrderID    string    `json:"order_id"`
	Actor      string    `json:"actor"`
	FromStatus string    `json:"from_status"`
	ToStatus   string    `json:"to_status"`
	Note       *string   `json:"note,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

type SupportEscalationRecord struct {
	ID          string     `json:"id"`
	OrderID     string     `json:"order_id"`
	Actor       string     `json:"actor"`
	IssueType   string     `json:"issue_type"`
	Description string     `json:"description"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
	ResolvedAt  *time.Time `json:"resolved_at,omitempty"`
}

type OrderItemInput struct {
	ProductID string  `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type CreateOrderRequest struct {
	StoreID          string           `json:"store_id"`
	ClientID         string           `json:"client_id"`
	TotalPrice       float64          `json:"total_price"`
	WltPaymentRefID  *string          `json:"wlt_payment_ref_id,omitempty"`
	CheckoutIntentID string           `json:"checkout_intent_id"`
	Items            []OrderItemInput `json:"items"`
}

type UpdateOrderStatusRequest struct {
	Actor  string  `json:"actor"`
	Status string  `json:"status"`
	Note   *string `json:"note,omitempty"`
}

// DeliverOrderRequest — PoD submission (DSH-SLICE-005E).
// PodMediaKey is a reference to the media-fixtures key; DSH never stores raw binaries.
// WLT payout is NOT triggered here; payout is WLT responsibility after DELIVERED event.
type DeliverOrderRequest struct {
	CaptainID   string  `json:"captain_id"`
	PodMediaKey *string `json:"pod_media_key,omitempty"`
}

// FailDeliveryRequest — delivery failure reporting (DSH-SLICE-005F).
// Captain reports why delivery failed (client unreachable, wrong address, refused, etc.).
// DSH transitions ARRIVED → FAILED_DELIVERY and records the reason.
// WLT BOUNDARY: refund execution belongs to WLT (004E). DSH sends WltRefundTriggerRef
// as a reference ID for WLT to act on — DSH does NOT mutate wallet/ledger/refund amounts.
// ReturnRequired indicates captain must return item to the store (RETURNING_TO_STORE path).
type FailDeliveryRequest struct {
	CaptainID           string  `json:"captain_id"`
	FailureReason       string  `json:"failure_reason"`                   // required: reason for failure
	WltRefundTriggerRef *string `json:"wlt_refund_trigger_ref,omitempty"` // WLT bridge ref; DSH stores only
	ReturnRequired      bool    `json:"return_required"`
}

// ConfirmReturnRequest — captain confirms item returned to store (RETURNING_TO_STORE → RETURNED).
type ConfirmReturnRequest struct {
	CaptainID string `json:"captain_id"`
	Note      string `json:"note,omitempty"`
}

type CreateSupportEscalationRequest struct {
	OrderID     string `json:"order_id"`
	Actor       string `json:"actor"`
	IssueType   string `json:"issue_type"`
	Description string `json:"description"`
}

type OrderDetailsResponse struct {
	Order          OrderRecord               `json:"order"`
	Items          []OrderItemRecord         `json:"items"`
	StatusEvents   []OrderStatusEventRecord  `json:"status_events"`
	SupportTickets []SupportEscalationRecord `json:"support_tickets"`
}

// ListOrdersQuery — operations queue filter (control-panel, dispatch, exceptions).
// Limit is capped at 200 in the handler; default 50.
type ListOrdersQuery struct {
	ClientID string
	StoreID  string
	Status   string
	Limit    int
	Offset   int
}

type ListOrdersResponse struct {
	Orders []OrderRecord `json:"orders"`
	Total  int           `json:"total"`
}

// UpdateSupportEscalationRequest — operator updates escalation status (J-009C / DSH-SLICE-009C).
// Valid status values: "in-review", "resolved".
type UpdateSupportEscalationRequest struct {
	Status string `json:"status"`
}

// ListAllSupportEscalationsQuery — query parameters for global escalation list.
type ListAllSupportEscalationsQuery struct {
	Status string
	Limit  int
	Offset int
}

// ListAllSupportEscalationsResponse — paginated list of all support escalations.
type ListAllSupportEscalationsResponse struct {
	Tickets []SupportEscalationRecord `json:"tickets"`
	Total   int                       `json:"total"`
}
