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
	ListProducts(ctx context.Context, storeID string, approvalStatus string, limit int, offset int) (domain.ListProductsResponse, error)
	// Category structure (J-002 / DSH-SLICE-002B)
	CreateCategory(ctx context.Context, storeID string, req domain.CreateCategoryRequest) (domain.CategoryRecord, error)
	UpdateCategory(ctx context.Context, categoryID string, req domain.UpdateCategoryRequest) (domain.CategoryRecord, error)
	GetCategory(ctx context.Context, categoryID string) (domain.CategoryRecord, error)
	ListCategories(ctx context.Context, storeID string, limit int, offset int) (domain.ListCategoriesResponse, error)
	DeleteCategory(ctx context.Context, categoryID string) error

	// Product media (J-002 / DSH-SLICE-002C)
	CreateProductMedia(ctx context.Context, req domain.UploadProductMediaRequest) (domain.ProductMediaRecord, error)
	DeleteProductMedia(ctx context.Context, id string) error
	ListProductMedia(ctx context.Context, productID string) ([]domain.ProductMediaRecord, error)

	// Partner local overrides (J-002 / DSH-SLICE-002D)
	UpdateCatalogOverrides(ctx context.Context, storeID string, req domain.UpdateCatalogOverridesRequest) (domain.UpdateCatalogOverridesResponse, error)
	GetCatalogOverrides(ctx context.Context, storeID string) ([]domain.CatalogOverrideRecord, error)

	// Catalog approvals (J-002 / DSH-SLICE-002E)
	CreateCatalogApproval(ctx context.Context, operatorID string, req domain.UpdateCatalogApprovalRequest) (domain.CatalogApprovalRecord, error)

	// Catalog conflict audit (J-002 / DSH-SLICE-002G)
	ListConflicts(ctx context.Context, storeID string, status string, limit int, offset int) (domain.ListConflictsResponse, error)
	ResolveConflict(ctx context.Context, id string, req domain.ResolveConflictRequest) (domain.ResolveConflictResponse, error)

	// Order lifecycle (J-003D / J-004)
	CreateOrder(ctx context.Context, storeID string, req domain.CreateOrderRequest) (domain.OrderRecord, []domain.OrderItemRecord, error)
	GetOrder(ctx context.Context, orderID string) (domain.OrderRecord, []domain.OrderItemRecord, error)
	UpdateOrderStatus(ctx context.Context, orderID string, actor string, status string, note *string) (domain.OrderRecord, error)
	CreateSupportEscalation(ctx context.Context, req domain.CreateSupportEscalationRequest) (domain.SupportEscalationRecord, error)
	ListOrderStatusEvents(ctx context.Context, orderID string) ([]domain.OrderStatusEventRecord, error)
	ListSupportEscalations(ctx context.Context, orderID string) ([]domain.SupportEscalationRecord, error)
}
