package domain

import "time"

type UpdateCatalogApprovalRequest struct {
	ItemID string `json:"item_id"`
	Action string `json:"action"` // approve, reject, needs-fix
	Note   string `json:"note,omitempty"`
}

type CatalogApprovalRecord struct {
	ID         string    `json:"id"`
	ItemID     string    `json:"item_id"`
	Action     string    `json:"action"`
	Note       string    `json:"note,omitempty"`
	OperatorID string    `json:"operator_id"`
	CreatedAt  time.Time `json:"created_at"`
}
