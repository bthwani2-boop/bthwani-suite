package domain

import "time"

// CategoryRecord represents the category entity.
type CategoryRecord struct {
	ID          string    `json:"id"`
	StoreID     string    `json:"store_id"`
	ParentID    *string   `json:"parent_id,omitempty"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateCategoryRequest is the body for POST /stores/{store_id}/categories.
type CreateCategoryRequest struct {
	ParentID    *string `json:"parent_id,omitempty"`
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
}

// UpdateCategoryRequest is the body for PATCH /categories/{id}.
type UpdateCategoryRequest struct {
	ParentID    *string `json:"parent_id,omitempty"`
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
}

// ListCategoriesResponse is the response for GET /stores/{store_id}/categories.
type ListCategoriesResponse struct {
	Categories []CategoryRecord `json:"categories"`
	Pagination Pagination       `json:"pagination"`
}
