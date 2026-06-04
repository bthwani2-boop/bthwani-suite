package domain

import "time"

const (
	StatusCreated        = "CREATED"
	StatusAccepted       = "ACCEPTED"
	StatusReadyForPickup = "READY_FOR_PICKUP"
	StatusDelivered      = "DELIVERED"
	StatusCancelled      = "CANCELLED"
)

type OrderRecord struct {
	ID               string    `json:"id"`
	StoreID          string    `json:"store_id"`
	ClientID         string    `json:"client_id"`
	Status           string    `json:"status"`
	TotalPrice       float64   `json:"total_price"`
	WltPaymentRefID  *string   `json:"wlt_payment_ref_id,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
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
	StoreID         string           `json:"store_id"`
	ClientID        string           `json:"client_id"`
	TotalPrice      float64          `json:"total_price"`
	WltPaymentRefID *string          `json:"wlt_payment_ref_id,omitempty"`
	Items           []OrderItemInput `json:"items"`
}

type UpdateOrderStatusRequest struct {
	Actor string  `json:"actor"`
	Status string `json:"status"`
	Note  *string `json:"note,omitempty"`
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
