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
			},
		},
	}
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
