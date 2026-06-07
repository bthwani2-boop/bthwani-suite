package store

import (
	"context"

	"bthwani.local/dsh/domain"
)

type StoreRepository interface {
	ListStores(ctx context.Context, query domain.StoreDiscoveryQuery) (domain.DiscoveryStoresResponse, error)
	UpdatePartnerReadiness(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error)
	UpdateCatalogApproval(ctx context.Context, id string, qualityStatus string, pricingStatus string) (domain.StoreVisibilityGateResponse, error)
	UpdateMarketingVisibility(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error)
	GetStore(ctx context.Context, id string) (domain.StoreDetail, error)
}

type CatalogRepository interface {
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
}

type CheckoutRepository interface {
	// Checkout (J-003A / 003B / 003C / 003E)
	CheckCartServiceability(ctx context.Context, query domain.CartServiceabilityQuery) (domain.CartServiceabilityResponse, error)
	CreateCheckoutIntent(ctx context.Context, clientID string, req domain.CheckoutIntentRequest) (domain.CheckoutIntentResponse, error)
	CancelCheckoutIntent(ctx context.Context, intentID string, clientID string) (domain.CancelCheckoutIntentResponse, error)
	ProcessPaymentCallback(ctx context.Context, req domain.PaymentCallbackRequest) (domain.PaymentCallbackResponse, error)
}

type OrderRepository interface {
	// Order lifecycle (J-003D / J-004)
	ListOrders(ctx context.Context, query domain.ListOrdersQuery) (domain.ListOrdersResponse, error)
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
	ListOrderStatusEvents(ctx context.Context, orderID string) ([]domain.OrderStatusEventRecord, error)
}

type SupportRepository interface {
	CreateSupportEscalation(ctx context.Context, req domain.CreateSupportEscalationRequest) (domain.SupportEscalationRecord, error)
	ListSupportEscalations(ctx context.Context, orderID string) ([]domain.SupportEscalationRecord, error)
	// ListAllSupportEscalations (J-009C): returns escalations across all orders for CP operator view.
	ListAllSupportEscalations(ctx context.Context, query domain.ListAllSupportEscalationsQuery) (domain.ListAllSupportEscalationsResponse, error)
	// UpdateSupportEscalation (J-009C): operator updates status to "in-review" or "resolved".
	UpdateSupportEscalation(ctx context.Context, id string, status string) (domain.SupportEscalationRecord, error)
}

type FieldRepository interface {
	// CreateFieldStore (J-006A): field agent submits a new store for review.
	// publish_stage is set to 'pending_review'; CP approval required before client visibility.
	CreateFieldStore(ctx context.Context, req domain.CreateFieldStoreRequest) (domain.CreateFieldStoreResponse, error)
	// CreateFieldVisit (J-006B): field agent submits visit notes and evidence media references.
	// Raw media upload and document governance remain J-006C.
	CreateFieldVisit(ctx context.Context, storeID string, req domain.CreateFieldVisitRequest) (domain.CreateFieldVisitResponse, error)
	// CreateFieldDocument (J-006C): field agent uploads a document reference for a store.
	CreateFieldDocument(ctx context.Context, storeID string, req domain.CreateFieldDocumentRequest) (domain.FieldDocumentRecord, error)
	// ListFieldDocuments (J-006C): lists documents associated with a store.
	ListFieldDocuments(ctx context.Context, storeID string) ([]domain.FieldDocumentRecord, error)

	// CreateFieldReadinessEscalation (J-006D): field agent escalates incomplete readiness to a team.
	// No financial mutation (WLT boundary). status starts as 'escalated'.
	CreateFieldReadinessEscalation(ctx context.Context, storeID string, req domain.CreateFieldReadinessEscalationRequest) (domain.FieldReadinessEscalationRecord, error)
	// ListFieldReadinessEscalations (J-006D): CP operator view of all escalations, filterable by status.
	ListFieldReadinessEscalations(ctx context.Context, query domain.ListFieldReadinessEscalationsQuery) (domain.ListFieldReadinessEscalationsResponse, error)
	// UpdateFieldReadinessEscalation (J-006D): CP operator updates escalation status (info_requested / resolved / rejected).
	UpdateFieldReadinessEscalation(ctx context.Context, id string, req domain.UpdateFieldReadinessEscalationRequest) (domain.FieldReadinessEscalationRecord, error)

	// CreateFieldReadinessApproval (J-006E): CP operator formally approves or rejects store readiness package.
	// Approval makes the store eligible for partner-readiness gate toggle (J-001C). No financial mutation.
	CreateFieldReadinessApproval(ctx context.Context, storeID string, req domain.CreateFieldReadinessApprovalRequest) (domain.FieldReadinessApprovalRecord, error)
	// GetLatestFieldReadinessApproval (J-006E): returns the latest approval record for a store (for CP review).
	GetLatestFieldReadinessApproval(ctx context.Context, storeID string) (domain.FieldReadinessApprovalRecord, error)
}

type WltBridgeRepository interface {
	// DSH-SLICE-010B: Settlement Candidate repository methods.
	// WLT owns wallet, ledger, payout, refund execution, and final settlement accounting.
	SubmitSettlementCandidates(ctx context.Context, orderIDs []string) ([]domain.OrderRecord, error)
	ProcessSettlementCallback(ctx context.Context, settlementRefID string, orderIDs []string, amount float64, status string) ([]domain.OrderRecord, error)
	ListSettlements(ctx context.Context) ([]domain.OrderRecord, error)
}

type Repository interface {
	StoreRepository
	CatalogRepository
	CheckoutRepository
	OrderRepository
	SupportRepository
	FieldRepository
	WltBridgeRepository
}
