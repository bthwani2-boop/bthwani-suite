package domain

import "time"

type CatalogOverrideInput struct {
	ProductID         string  `json:"product_id"`
	PriceOverride     *string `json:"price_override,omitempty"`
	StockOverride     *int    `json:"stock_override,omitempty"`
	AvailableOverride *bool   `json:"available_override,omitempty"`
}

type UpdateCatalogOverridesRequest struct {
	Overrides []CatalogOverrideInput `json:"overrides"`
}

type CatalogOverrideRecord struct {
	StoreID           string    `json:"store_id"`
	ProductID         string    `json:"product_id"`
	PriceOverride     *string   `json:"price_override,omitempty"`
	StockOverride     *int      `json:"stock_override,omitempty"`
	AvailableOverride *bool     `json:"available_override,omitempty"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type UpdateCatalogOverridesResponse struct {
	StoreID      string                  `json:"store_id"`
	UpdatedCount int                     `json:"updated_count"`
	Overrides    []CatalogOverrideRecord `json:"overrides"`
}
