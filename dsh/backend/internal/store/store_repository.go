package store

import (
	"context"

	"bthwani.local/dsh/domain"
)

type Repository interface {
	ListStores(ctx context.Context, query domain.StoreDiscoveryQuery) (domain.DiscoveryStoresResponse, error)
	UpdatePartnerReadiness(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error)
	UpdateCatalogApproval(ctx context.Context, id string, qualityStatus string, pricingStatus string) (domain.StoreVisibilityGateResponse, error)
	UpdateMarketingVisibility(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error)
	GetStore(ctx context.Context, id string) (domain.StoreDetail, error)
	// Product identity (J-002 / DSH-SLICE-002A)
	CreateProduct(ctx context.Context, storeID string, req domain.CreateProductRequest) (domain.ProductRecord, error)
	UpdateProduct(ctx context.Context, productID string, req domain.UpdateProductRequest) (domain.ProductRecord, error)
	GetProduct(ctx context.Context, productID string) (domain.ProductRecord, error)
	ListProducts(ctx context.Context, storeID string, limit int, offset int) (domain.ListProductsResponse, error)
}
