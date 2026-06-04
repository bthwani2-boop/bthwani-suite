package domain

import "time"

type CatalogConflict struct {
	ID            string     `json:"id"`
	StoreID       string     `json:"store_id"`
	ProductID     string     `json:"product_id"`
	ProductName   string     `json:"product_name"`
	ConflictType  string     `json:"conflict_type"` // 'price_divergence', 'availability_divergence'
	CentralValue  string     `json:"central_value"`
	OverrideValue string     `json:"override_value"`
	Status        string     `json:"status"` // 'pending', 'resolved_accept_local', 'resolved_reverted'
	ResolvedAt    *time.Time `json:"resolved_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
}

type ResolveConflictRequest struct {
	Resolution string `json:"resolution"` // 'accept_local' or 'revert_to_central'
}

type ResolveConflictResponse struct {
	ConflictID string `json:"conflict_id"`
	Status     string `json:"status"`
}

type ListConflictsResponse struct {
	Conflicts  []CatalogConflict `json:"conflicts"`
	Limit      int               `json:"limit"`
	Offset     int               `json:"offset"`
	Total      int               `json:"total"`
}
