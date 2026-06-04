package domain

import "time"

// ProductApprovalStatus represents the catalog approval pipeline stage.
type ProductApprovalStatus string

const (
	ProductApprovalFieldDraft        ProductApprovalStatus = "field_draft"
	ProductApprovalPartnerSubmitted  ProductApprovalStatus = "partner_submitted"
	ProductApprovalPartnerReview     ProductApprovalStatus = "partner_review"
	ProductApprovalPartnerApproved   ProductApprovalStatus = "partner_approved"
	ProductApprovalMarketingReview   ProductApprovalStatus = "marketing_review"
	ProductApprovalMarketingApproved ProductApprovalStatus = "marketing_approved"
	ProductApprovalCatalogAdopted    ProductApprovalStatus = "catalog_adopted"
	ProductApprovalClientVisible     ProductApprovalStatus = "client_visible"
	ProductApprovalNeedsFix          ProductApprovalStatus = "needs_fix"
	ProductApprovalRejected          ProductApprovalStatus = "rejected"
)

// ProductRecord is the canonical product identity record returned by the API.
type ProductRecord struct {
	ID                string                `json:"id"`
	StoreID           string                `json:"store_id"`
	Name              string                `json:"name"`
	SKU               *string               `json:"sku,omitempty"`
	GTIN              *string               `json:"gtin,omitempty"`
	Barcode           *string               `json:"barcode,omitempty"`
	Description       *string               `json:"description,omitempty"`
	BasePriceLabel    string                `json:"base_price_label"`
	CategoryID        *string               `json:"category_id,omitempty"`
	ApprovalStatus    ProductApprovalStatus `json:"approval_status"`
	Media             []ProductMediaRecord  `json:"media,omitempty"`
	PriceOverride     *string               `json:"price_override,omitempty"`
	StockOverride     *int                  `json:"stock_override,omitempty"`
	AvailableOverride *bool                 `json:"available_override,omitempty"`
	CreatedAt         time.Time             `json:"created_at"`
	UpdatedAt         time.Time             `json:"updated_at"`
}

// CreateProductRequest is the body for POST /stores/{store_id}/products.
type CreateProductRequest struct {
	Name           string  `json:"name"`
	SKU            *string `json:"sku,omitempty"`
	GTIN           *string `json:"gtin,omitempty"`
	Barcode        *string `json:"barcode,omitempty"`
	Description    *string `json:"description,omitempty"`
	BasePriceLabel string  `json:"base_price_label"`
	CategoryID     *string `json:"category_id,omitempty"`
}

// UpdateProductRequest is the body for PATCH /products/{id}.
type UpdateProductRequest struct {
	Name           *string `json:"name,omitempty"`
	SKU            *string `json:"sku,omitempty"`
	GTIN           *string `json:"gtin,omitempty"`
	Barcode        *string `json:"barcode,omitempty"`
	Description    *string `json:"description,omitempty"`
	BasePriceLabel *string `json:"base_price_label,omitempty"`
	CategoryID     *string `json:"category_id,omitempty"`
}

// ListProductsResponse is the response for GET /stores/{store_id}/products.
type ListProductsResponse struct {
	Products   []ProductRecord `json:"products"`
	Pagination Pagination      `json:"pagination"`
}
