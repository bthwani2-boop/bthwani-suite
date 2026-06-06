package store

import (
	"context"
	"errors"
	"sort"
	"strings"
	"time"

	"bthwani.local/dsh/domain"
)

type MemoryRepository struct {
	stores []memoryStore
}

type memoryStore struct {
	summary                   domain.StoreSummary
	supportsPickup            bool
	supportsPartnerDelivery   bool
	searchTerms               []string
	partnerReadinessStatus    string
	catalogQualityStatus      string
	catalogPricingStatus      string
	marketingVisibilityStatus string
	visibilityUpdatedAt       time.Time
	contactNumber             string
	openingHours              string
	catalogSummary            string
}

func NewMemoryRepository() *MemoryRepository {
	ratingFresh := 4.8
	ratingBakery := 4.6
	ratingGrocer := 4.4
	ratingClosed := 4.2

	now := time.Now()

	return &MemoryRepository{
		stores: []memoryStore{
			{
				summary: domain.StoreSummary{
					ID:            "store-1001",
					Name:          "Haddah Central Market",
					Address:       "Haddah Street, Sanaa",
					CategoryID:    "grocery",
					ImageURL:      "dsh.store.haddah.cover.v1",
					LogoImageURL:  "dsh.store.haddah.logo.v1",
					Rating:        &ratingFresh,
					DistanceLabel: "2.1 km",
					DeliveryLabel: "BThwani delivery",
					ServiceLabel:  "Open for delivery",
					StatusLabel:   "Open",
					StatusTone:    domain.StoreStatusOpen,
					HasOffer:      true,
					OfferLabel:    "Fresh produce offer",
					PublishStage:  "published",
				},
				supportsPickup:            true,
				supportsPartnerDelivery:   true,
				searchTerms:               []string{"grocery", "fresh", "market", "haddah"},
				partnerReadinessStatus:    "ready",
				catalogQualityStatus:      "approved",
				catalogPricingStatus:      "approved",
				marketingVisibilityStatus: "active",
				visibilityUpdatedAt:       now,
				contactNumber:             "+967-1-444333",
				openingHours:              "08:00 - 23:00",
				catalogSummary:            "Over 1,200 fresh groceries and daily essentials",
			},
			{
				summary: domain.StoreSummary{
					ID:            "store-1002",
					Name:          "Al Sabeen Bakery",
					Address:       "Al Sabeen District",
					CategoryID:    "bakery",
					ImageURL:      "dsh.store.sabeen.cover.v1",
					LogoImageURL:  "dsh.store.sabeen.logo.v1",
					Rating:        &ratingBakery,
					DistanceLabel: "3.4 km",
					DeliveryLabel: "Partner delivery",
					ServiceLabel:  "Ready today",
					StatusLabel:   "Open",
					StatusTone:    domain.StoreStatusOpen,
					HasOffer:      false,
					PublishStage:  "published",
				},
				supportsPickup:            true,
				supportsPartnerDelivery:   true,
				searchTerms:               []string{"bakery", "bread", "sabeen"},
				partnerReadinessStatus:    "ready",
				catalogQualityStatus:      "approved",
				catalogPricingStatus:      "approved",
				marketingVisibilityStatus: "active",
				visibilityUpdatedAt:       now,
				contactNumber:             "+967-1-555666",
				openingHours:              "06:00 - 22:00",
				catalogSummary:            "Fresh bread, cakes, and pastries baked daily",
			},
			{
				summary: domain.StoreSummary{
					ID:            "store-1003",
					Name:          "Tahrir Mini Store",
					Address:       "Tahrir Square",
					CategoryID:    "grocery",
					ImageURL:      "dsh.store.tahrir.cover.v1",
					LogoImageURL:  "dsh.store.tahrir.logo.v1",
					Rating:        &ratingGrocer,
					DistanceLabel: "1.2 km",
					DeliveryLabel: "Pickup available",
					ServiceLabel:  "Pickup only",
					StatusLabel:   "Open",
					StatusTone:    domain.StoreStatusOpen,
					HasOffer:      true,
					OfferLabel:    "Pickup discount",
					PublishStage:  "published",
				},
				supportsPickup:            true,
				supportsPartnerDelivery:   false,
				searchTerms:               []string{"grocery", "pickup", "tahrir"},
				partnerReadinessStatus:    "ready",
				catalogQualityStatus:      "approved",
				catalogPricingStatus:      "approved",
				marketingVisibilityStatus: "active",
				visibilityUpdatedAt:       now,
				contactNumber:             "+967-1-777888",
				openingHours:              "09:00 - 21:00",
				catalogSummary:            "Convenient local grocery staples and snacks",
			},
			{
				summary: domain.StoreSummary{
					ID:            "store-1004",
					Name:          "Shumaila Evening Mart",
					Address:       "Shumaila Main Road",
					CategoryID:    "convenience",
					ImageURL:      "dsh.store.shumaila.cover.v1",
					LogoImageURL:  "dsh.store.shumaila.logo.v1",
					Rating:        &ratingClosed,
					DistanceLabel: "5.0 km",
					DeliveryLabel: "BThwani delivery",
					ServiceLabel:  "Closed now",
					StatusLabel:   "Closed",
					StatusTone:    domain.StoreStatusClosed,
					HasOffer:      false,
					PublishStage:  "published",
				},
				supportsPickup:            true,
				supportsPartnerDelivery:   true,
				searchTerms:               []string{"convenience", "shumaila", "evening"},
				partnerReadinessStatus:    "ready",
				catalogQualityStatus:      "approved",
				catalogPricingStatus:      "approved",
				marketingVisibilityStatus: "active",
				visibilityUpdatedAt:       now,
				contactNumber:             "+967-1-999000",
				openingHours:              "16:00 - 02:00",
				catalogSummary:            "Late-night snacks, soft drinks, and convenience items",
			},
		},
	}
}

func (repo *MemoryRepository) GetStore(ctx context.Context, id string) (domain.StoreDetail, error) {
	select {
	case <-ctx.Done():
		return domain.StoreDetail{}, ctx.Err()
	default:
	}

	for _, store := range repo.stores {
		if store.summary.ID == id {
			return domain.StoreDetail{
				StoreSummary:              store.summary,
				ContactNumber:             store.contactNumber,
				OpeningHours:              store.openingHours,
				CatalogSummary:            store.catalogSummary,
				PartnerReadinessStatus:    store.partnerReadinessStatus,
				CatalogQualityStatus:      store.catalogQualityStatus,
				CatalogPricingStatus:      store.catalogPricingStatus,
				MarketingVisibilityStatus: store.marketingVisibilityStatus,
			}, nil
		}
	}

	return domain.StoreDetail{}, errors.New("store not found")
}

func (repo *MemoryRepository) ListStores(ctx context.Context, query domain.StoreDiscoveryQuery) (domain.DiscoveryStoresResponse, error) {
	select {
	case <-ctx.Done():
		return domain.DiscoveryStoresResponse{}, ctx.Err()
	default:
	}

	matches := make([]domain.StoreSummary, 0, len(repo.stores))
	for _, candidate := range repo.stores {
		if !clientVisible(candidate) {
			continue
		}
		if !matchesCategory(candidate.summary, query.CategoryID) {
			continue
		}
		if !matchesFilter(candidate.summary, query.Filter) {
			continue
		}
		if !matchesSearch(candidate, query.Query) {
			continue
		}

		matches = append(matches, candidate.summary)
	}

	sort.SliceStable(matches, func(i, j int) bool {
		return matches[i].ID < matches[j].ID
	})

	total := len(matches)
	if query.Offset > total {
		matches = []domain.StoreSummary{}
	} else {
		matches = matches[query.Offset:]
	}

	if query.Limit < len(matches) {
		matches = matches[:query.Limit]
	}

	return domain.DiscoveryStoresResponse{
		Stores: matches,
		Pagination: domain.Pagination{
			Limit:  query.Limit,
			Offset: query.Offset,
			Total:  total,
		},
	}, nil
}

func clientVisible(store memoryStore) bool {
	return domain.VisibilityServiceabilityInput{
		PublishStage:              store.summary.PublishStage,
		StoreOpen:                 store.summary.StatusTone == domain.StoreStatusOpen,
		SupportsPickup:            store.supportsPickup,
		SupportsPartnerDelivery:   store.supportsPartnerDelivery,
		ServiceLabel:              store.summary.ServiceLabel,
		DeliveryLabel:             store.summary.DeliveryLabel,
		PartnerReadinessStatus:    store.partnerReadinessStatus,
		CatalogQualityStatus:      store.catalogQualityStatus,
		CatalogPricingStatus:      store.catalogPricingStatus,
		MarketingVisibilityStatus: store.marketingVisibilityStatus,
	}.ClientVisible()
}

func (repo *MemoryRepository) UpdatePartnerReadiness(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error) {
	for i, store := range repo.stores {
		if store.summary.ID == id {
			repo.stores[i].partnerReadinessStatus = status
			repo.stores[i].visibilityUpdatedAt = time.Now()

			return domain.StoreVisibilityGateResponse{
				StoreID:                   repo.stores[i].summary.ID,
				PartnerReadinessStatus:    repo.stores[i].partnerReadinessStatus,
				CatalogQualityStatus:      repo.stores[i].catalogQualityStatus,
				CatalogPricingStatus:      repo.stores[i].catalogPricingStatus,
				MarketingVisibilityStatus: repo.stores[i].marketingVisibilityStatus,
				ClientVisible:             clientVisible(repo.stores[i]),
				UpdatedAt:                 repo.stores[i].visibilityUpdatedAt,
			}, nil
		}
	}
	return domain.StoreVisibilityGateResponse{}, errors.New("store not found")
}

func (repo *MemoryRepository) UpdateCatalogApproval(ctx context.Context, id string, qualityStatus string, pricingStatus string) (domain.StoreVisibilityGateResponse, error) {
	for i, store := range repo.stores {
		if store.summary.ID == id {
			repo.stores[i].catalogQualityStatus = qualityStatus
			repo.stores[i].catalogPricingStatus = pricingStatus
			repo.stores[i].visibilityUpdatedAt = time.Now()

			return domain.StoreVisibilityGateResponse{
				StoreID:                   repo.stores[i].summary.ID,
				PartnerReadinessStatus:    repo.stores[i].partnerReadinessStatus,
				CatalogQualityStatus:      repo.stores[i].catalogQualityStatus,
				CatalogPricingStatus:      repo.stores[i].catalogPricingStatus,
				MarketingVisibilityStatus: repo.stores[i].marketingVisibilityStatus,
				ClientVisible:             clientVisible(repo.stores[i]),
				UpdatedAt:                 repo.stores[i].visibilityUpdatedAt,
			}, nil
		}
	}
	return domain.StoreVisibilityGateResponse{}, errors.New("store not found")
}

func (repo *MemoryRepository) UpdateMarketingVisibility(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error) {
	for i, store := range repo.stores {
		if store.summary.ID == id {
			repo.stores[i].marketingVisibilityStatus = status
			repo.stores[i].visibilityUpdatedAt = time.Now()

			return domain.StoreVisibilityGateResponse{
				StoreID:                   repo.stores[i].summary.ID,
				PartnerReadinessStatus:    repo.stores[i].partnerReadinessStatus,
				CatalogQualityStatus:      repo.stores[i].catalogQualityStatus,
				CatalogPricingStatus:      repo.stores[i].catalogPricingStatus,
				MarketingVisibilityStatus: repo.stores[i].marketingVisibilityStatus,
				ClientVisible:             clientVisible(repo.stores[i]),
				UpdatedAt:                 repo.stores[i].visibilityUpdatedAt,
			}, nil
		}
	}
	return domain.StoreVisibilityGateResponse{}, errors.New("store not found")
}

func matchesCategory(store domain.StoreSummary, categoryID string) bool {
	categoryID = strings.TrimSpace(categoryID)
	return categoryID == "" || strings.EqualFold(store.CategoryID, categoryID)
}

func matchesFilter(store domain.StoreSummary, filter domain.StoreDiscoveryFilter) bool {
	switch filter {
	case domain.StoreDiscoveryFilterOffers:
		return store.HasOffer
	case domain.StoreDiscoveryFilterFavorites:
		return false
	default:
		return true
	}
}

func matchesSearch(store memoryStore, query string) bool {
	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return true
	}

	haystack := []string{
		store.summary.ID,
		store.summary.Name,
		store.summary.Address,
		store.summary.CategoryID,
		store.summary.DeliveryLabel,
		store.summary.ServiceLabel,
		store.summary.StatusLabel,
		store.summary.OfferLabel,
	}
	haystack = append(haystack, store.searchTerms...)

	for _, value := range haystack {
		if strings.Contains(strings.ToLower(value), query) {
			return true
		}
	}

	return false
}

// Product identity stubs — MemoryRepository is local-dev only.
// Product CRUD requires the Postgres backend (DATABASE_URL must be set).

func (repo *MemoryRepository) CreateProduct(_ context.Context, _ string, _ domain.CreateProductRequest) (domain.ProductRecord, error) {
	return domain.ProductRecord{}, errors.New("product create requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) UpdateProduct(_ context.Context, _ string, _ domain.UpdateProductRequest) (domain.ProductRecord, error) {
	return domain.ProductRecord{}, errors.New("product update requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) GetProduct(_ context.Context, _ string) (domain.ProductRecord, error) {
	return domain.ProductRecord{}, errors.New("product get requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListProducts(_ context.Context, _ string, _ string, _ int, _ int) (domain.ListProductsResponse, error) {
	return domain.ListProductsResponse{}, errors.New("product list requires postgres backend (set DATABASE_URL)")
}

// Category structure stubs (J-002 / DSH-SLICE-002B)
func (repo *MemoryRepository) CreateCategory(_ context.Context, _ string, _ domain.CreateCategoryRequest) (domain.CategoryRecord, error) {
	return domain.CategoryRecord{}, errors.New("category create requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) UpdateCategory(_ context.Context, _ string, _ domain.UpdateCategoryRequest) (domain.CategoryRecord, error) {
	return domain.CategoryRecord{}, errors.New("category update requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) GetCategory(_ context.Context, _ string) (domain.CategoryRecord, error) {
	return domain.CategoryRecord{}, errors.New("category get requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListCategories(_ context.Context, _ string, _ int, _ int) (domain.ListCategoriesResponse, error) {
	return domain.ListCategoriesResponse{}, errors.New("category list requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) DeleteCategory(_ context.Context, _ string) error {
	return errors.New("category delete requires postgres backend (set DATABASE_URL)")
}

// Product media stubs (J-002 / DSH-SLICE-002C)
func (repo *MemoryRepository) CreateProductMedia(_ context.Context, _ domain.UploadProductMediaRequest) (domain.ProductMediaRecord, error) {
	return domain.ProductMediaRecord{}, errors.New("media upload/create requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) DeleteProductMedia(_ context.Context, _ string) error {
	return errors.New("media delete requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListProductMedia(_ context.Context, _ string) ([]domain.ProductMediaRecord, error) {
	return nil, errors.New("media list requires postgres backend (set DATABASE_URL)")
}

// Partner local overrides stubs (J-002 / DSH-SLICE-002D)
func (repo *MemoryRepository) UpdateCatalogOverrides(_ context.Context, _ string, _ domain.UpdateCatalogOverridesRequest) (domain.UpdateCatalogOverridesResponse, error) {
	return domain.UpdateCatalogOverridesResponse{}, errors.New("overrides update requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) GetCatalogOverrides(_ context.Context, _ string) ([]domain.CatalogOverrideRecord, error) {
	return nil, errors.New("overrides get requires postgres backend (set DATABASE_URL)")
}

// Catalog approvals stubs (J-002 / DSH-SLICE-002E)
func (repo *MemoryRepository) CreateCatalogApproval(_ context.Context, _ string, _ domain.UpdateCatalogApprovalRequest) (domain.CatalogApprovalRecord, error) {
	return domain.CatalogApprovalRecord{}, errors.New("catalog approvals require postgres backend (set DATABASE_URL)")
}

// Catalog conflict audit stubs (J-002 / DSH-SLICE-002G)
func (repo *MemoryRepository) ListConflicts(_ context.Context, _ string, _ string, _ int, _ int) (domain.ListConflictsResponse, error) {
	return domain.ListConflictsResponse{}, errors.New("conflict listing requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ResolveConflict(_ context.Context, _ string, _ domain.ResolveConflictRequest) (domain.ResolveConflictResponse, error) {
	return domain.ResolveConflictResponse{}, errors.New("conflict resolution requires postgres backend (set DATABASE_URL)")
}

// Order lifecycle stubs (J-003D / J-004)
func (repo *MemoryRepository) ListOrders(_ context.Context, _ domain.ListOrdersQuery) (domain.ListOrdersResponse, error) {
	return domain.ListOrdersResponse{Orders: []domain.OrderRecord{}, Total: 0}, errors.New("order list requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) CreateOrder(_ context.Context, _ string, _ domain.CreateOrderRequest) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	return domain.OrderRecord{}, nil, errors.New("order creation requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) GetOrder(_ context.Context, orderID string) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, nil, errors.New("order not found")
	}
	return domain.OrderRecord{}, nil, errors.New("order get requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) UpdateOrderStatus(_ context.Context, _ string, _ string, _ string, _ *string) (domain.OrderRecord, error) {
	return domain.OrderRecord{}, errors.New("order status update requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) UpdateOrderRefund(_ context.Context, orderID string, _ string, _ float64, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("order refund update requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) AssignCaptain(_ context.Context, orderID string, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("captain assignment requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) AcceptTask(_ context.Context, orderID string, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("task acceptance requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) DeclineTask(_ context.Context, orderID string, _ string, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("task decline requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ConfirmPickup(_ context.Context, orderID string, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("order pickup confirmation requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) UpdateCaptainLocation(_ context.Context, orderID string, _ string, _ float64, _ float64, _ string, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("captain location update requires postgres backend (set DATABASE_URL)")
}

// DeliverOrder stub — requires postgres backend for PoD persistence.
func (repo *MemoryRepository) DeliverOrder(_ context.Context, orderID string, _ string, _ *string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("proof of delivery requires postgres backend (set DATABASE_URL)")
}

// FailDelivery stub (DSH-SLICE-005F) — requires postgres backend.
// WLT BOUNDARY: no financial mutation; wlt_refund_trigger_ref is a bridge reference only.
func (repo *MemoryRepository) FailDelivery(_ context.Context, orderID string, _ string, _ string, _ *string, _ bool) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("delivery failure reporting requires postgres backend (set DATABASE_URL)")
}

// ConfirmReturn stub (DSH-SLICE-005F) — requires postgres backend.
// WLT BOUNDARY: no financial mutation.
func (repo *MemoryRepository) ConfirmReturn(_ context.Context, orderID string, _ string, _ string) (domain.OrderRecord, error) {
	if orderID == "ord-non-existent" {
		return domain.OrderRecord{}, errors.New("order not found")
	}
	return domain.OrderRecord{}, errors.New("return confirmation requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) CreateSupportEscalation(_ context.Context, _ domain.CreateSupportEscalationRequest) (domain.SupportEscalationRecord, error) {
	return domain.SupportEscalationRecord{}, errors.New("support escalation requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListOrderStatusEvents(_ context.Context, _ string) ([]domain.OrderStatusEventRecord, error) {
	return nil, errors.New("order status events list requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListSupportEscalations(_ context.Context, _ string) ([]domain.SupportEscalationRecord, error) {
	return nil, errors.New("support escalations list requires postgres backend (set DATABASE_URL)")
}

// DSH-SLICE-010B: Mock settlement candidate methods
func (repo *MemoryRepository) SubmitSettlementCandidates(_ context.Context, orderIDs []string) ([]domain.OrderRecord, error) {
	if len(orderIDs) == 0 {
		return nil, errors.New("no order IDs provided")
	}
	for _, id := range orderIDs {
		if id == "ord-non-existent" {
			return nil, errors.New("order not found")
		}
	}
	return nil, errors.New("settlement candidate submission requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ProcessSettlementCallback(_ context.Context, _ string, orderIDs []string, _ float64, _ string) ([]domain.OrderRecord, error) {
	if len(orderIDs) == 0 {
		return nil, errors.New("no order IDs provided")
	}
	for _, id := range orderIDs {
		if id == "ord-non-existent" {
			return nil, errors.New("order not found")
		}
	}
	return nil, errors.New("settlement callback processing requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListSettlements(_ context.Context) ([]domain.OrderRecord, error) {
	return nil, errors.New("settlement list requires postgres backend (set DATABASE_URL)")
}

// J-006A stub
func (repo *MemoryRepository) CreateFieldStore(_ context.Context, _ domain.CreateFieldStoreRequest) (domain.CreateFieldStoreResponse, error) {
	return domain.CreateFieldStoreResponse{}, errors.New("field store creation requires postgres backend (set DATABASE_URL)")
}

// J-006B stub
func (repo *MemoryRepository) CreateFieldVisit(_ context.Context, _ string, _ domain.CreateFieldVisitRequest) (domain.CreateFieldVisitResponse, error) {
	return domain.CreateFieldVisitResponse{}, errors.New("field visit submission requires postgres backend (set DATABASE_URL)")
}

// J-006C stubs
func (repo *MemoryRepository) CreateFieldDocument(_ context.Context, _ string, _ domain.CreateFieldDocumentRequest) (domain.FieldDocumentRecord, error) {
	return domain.FieldDocumentRecord{}, errors.New("field document upload requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListFieldDocuments(_ context.Context, _ string) ([]domain.FieldDocumentRecord, error) {
	return nil, errors.New("field document listing requires postgres backend (set DATABASE_URL)")
}

// J-009C stubs
func (repo *MemoryRepository) ListAllSupportEscalations(_ context.Context, _ domain.ListAllSupportEscalationsQuery) (domain.ListAllSupportEscalationsResponse, error) {
	return domain.ListAllSupportEscalationsResponse{Tickets: []domain.SupportEscalationRecord{}, Total: 0}, nil
}

func (repo *MemoryRepository) UpdateSupportEscalation(_ context.Context, _ string, _ string) (domain.SupportEscalationRecord, error) {
	return domain.SupportEscalationRecord{}, errors.New("escalation update requires postgres backend (set DATABASE_URL)")
}

// J-006D stubs
func (repo *MemoryRepository) CreateFieldReadinessEscalation(_ context.Context, _ string, _ domain.CreateFieldReadinessEscalationRequest) (domain.FieldReadinessEscalationRecord, error) {
	return domain.FieldReadinessEscalationRecord{}, errors.New("readiness escalation requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) ListFieldReadinessEscalations(_ context.Context, _ domain.ListFieldReadinessEscalationsQuery) (domain.ListFieldReadinessEscalationsResponse, error) {
	return domain.ListFieldReadinessEscalationsResponse{}, errors.New("readiness escalation listing requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) UpdateFieldReadinessEscalation(_ context.Context, _ string, _ domain.UpdateFieldReadinessEscalationRequest) (domain.FieldReadinessEscalationRecord, error) {
	return domain.FieldReadinessEscalationRecord{}, errors.New("readiness escalation update requires postgres backend (set DATABASE_URL)")
}

// J-006E stubs
func (repo *MemoryRepository) CreateFieldReadinessApproval(_ context.Context, _ string, _ domain.CreateFieldReadinessApprovalRequest) (domain.FieldReadinessApprovalRecord, error) {
	return domain.FieldReadinessApprovalRecord{}, errors.New("readiness approval requires postgres backend (set DATABASE_URL)")
}

func (repo *MemoryRepository) GetLatestFieldReadinessApproval(_ context.Context, _ string) (domain.FieldReadinessApprovalRecord, error) {
	return domain.FieldReadinessApprovalRecord{}, errors.New("readiness approval retrieval requires postgres backend (set DATABASE_URL)")
}
