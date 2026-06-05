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

	// Checkout (J-003A / 003B / 003C / 003E)
	CheckCartServiceability(ctx context.Context, query domain.CartServiceabilityQuery) (domain.CartServiceabilityResponse, error)
	CreateCheckoutIntent(ctx context.Context, clientID string, req domain.CheckoutIntentRequest) (domain.CheckoutIntentResponse, error)
	CancelCheckoutIntent(ctx context.Context, intentID string, clientID string) (domain.CancelCheckoutIntentResponse, error)
	ProcessPaymentCallback(ctx context.Context, req domain.PaymentCallbackRequest) (domain.PaymentCallbackResponse, error)

	// Order lifecycle (J-003D / J-004)
	CreateOrder(ctx context.Context, storeID string, req domain.CreateOrderRequest) (domain.OrderRecord, []domain.OrderItemRecord, error)
	GetOrder(ctx context.Context, orderID string) (domain.OrderRecord, []domain.OrderItemRecord, error)
	UpdateOrderStatus(ctx context.Context, orderID string, actor string, status string, note *string) (domain.OrderRecord, error)
	UpdateOrderRefund(ctx context.Context, orderID string, refundRefID string, amount float64, status string) (domain.OrderRecord, error)
	AssignCaptain(ctx context.Context, orderID string, captainID string) (domain.OrderRecord, error)
	AcceptTask(ctx context.Context, orderID string, captainID string) (domain.OrderRecord, error)
	DeclineTask(ctx context.Context, orderID string, captainID string, reason string) (domain.OrderRecord, error)
	ConfirmPickup(ctx context.Context, orderID string, captainID string) (domain.OrderRecord, error)
	UpdateCaptainLocation(ctx context.Context, orderID string, captainID string, lat float64, lng float64, lifecycleStatus string, orderStatus string) (domain.OrderRecord, error)
	// DeliverOrder (J-005 / DSH-SLICE-005E) — marks order DELIVERED, stores PoD media key. WLT payout is external.
	DeliverOrder(ctx context.Context, orderID string, captainID string, podMediaKey *string) (domain.OrderRecord, error)
	// FailDelivery (J-005 / DSH-SLICE-005F) — reports delivery failure (ARRIVED → FAILED_DELIVERY or RETURNING_TO_STORE).
	// WLT BOUNDARY: wltRefundTriggerRef is a bridge reference only; DSH does NOT execute refunds.
	FailDelivery(ctx context.Context, orderID string, captainID string, failureReason string, wltRefundTriggerRef *string, returnRequired bool) (domain.OrderRecord, error)
	// ConfirmReturn (J-005 / DSH-SLICE-005F) — confirms item returned to store (RETURNING_TO_STORE → RETURNED).
	// WLT BOUNDARY: no financial mutation.
	ConfirmReturn(ctx context.Context, orderID string, captainID string, note string) (domain.OrderRecord, error)
	CreateSupportEscalation(ctx context.Context, req domain.CreateSupportEscalationRequest) (domain.SupportEscalationRecord, error)
	ListOrderStatusEvents(ctx context.Context, orderID string) ([]domain.OrderStatusEventRecord, error)
	ListSupportEscalations(ctx context.Context, orderID string) ([]domain.SupportEscalationRecord, error)

	// DSH-SLICE-010B: Settlement Candidate repository methods
	SubmitSettlementCandidates(ctx context.Context, orderIDs []string) ([]domain.OrderRecord, error)
	ProcessSettlementCallback(ctx context.Context, settlementRefID string, orderIDs []string, amount float64, status string) ([]domain.OrderRecord, error)
	ListSettlements(ctx context.Context) ([]domain.OrderRecord, error)
}
