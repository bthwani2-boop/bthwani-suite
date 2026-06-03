package store

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"bthwani.local/dsh/domain"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type PostgresRepository struct {
	db *sql.DB
}

func NewPostgresRepository(ctx context.Context, databaseURL string) (*PostgresRepository, error) {
	databaseURL = strings.TrimSpace(databaseURL)
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, err
	}

	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, err
	}

	return &PostgresRepository{db: db}, nil
}

func (repo *PostgresRepository) Close() error {
	return repo.db.Close()
}

func (repo *PostgresRepository) ListStores(ctx context.Context, query domain.StoreDiscoveryQuery) (domain.DiscoveryStoresResponse, error) {
	where := []string{
		"publish_stage = 'published'",
		"status_tone = 'open'",
		"(supports_pickup OR supports_partner_delivery)",
		"NULLIF(TRIM(service_label), '') IS NOT NULL",
		"NULLIF(TRIM(delivery_label), '') IS NOT NULL",
		"partner_readiness_status = 'ready'",
		"catalog_quality_status = 'approved'",
		"catalog_pricing_status = 'approved'",
		"marketing_visibility_status = 'active'",
	}
	args := []any{}

	if strings.TrimSpace(query.CategoryID) != "" {
		args = append(args, query.CategoryID)
		where = append(where, fmt.Sprintf("category_id = $%d", len(args)))
	}

	if strings.TrimSpace(query.Query) != "" {
		args = append(args, "%"+strings.ToLower(strings.TrimSpace(query.Query))+"%")
		where = append(where, fmt.Sprintf(`LOWER(CONCAT_WS(' ', id, name, address, category_id, delivery_label, service_label, status_label, offer_label, search_text)) LIKE $%d`, len(args)))
	}

	switch query.Filter {
	case domain.StoreDiscoveryFilterOffers:
		where = append(where, "has_offer = TRUE")
	case domain.StoreDiscoveryFilterFavorites:
		where = append(where, "FALSE")
	}

	args = append(args, query.Limit)
	limitPlaceholder := len(args)
	args = append(args, query.Offset)
	offsetPlaceholder := len(args)

	statement := fmt.Sprintf(`
SELECT
  id,
  name,
  address,
  category_id,
  image_url,
  logo_image_url,
  rating,
  distance_label,
  delivery_label,
  service_label,
  status_label,
  status_tone,
  has_offer,
  offer_label,
  publish_stage,
  COUNT(*) OVER() AS total
FROM dsh_store_discovery_stores
WHERE %s
ORDER BY id ASC
LIMIT $%d OFFSET $%d
`, strings.Join(where, " AND "), limitPlaceholder, offsetPlaceholder)

	rows, err := repo.db.QueryContext(ctx, statement, args...)
	if err != nil {
		return domain.DiscoveryStoresResponse{}, err
	}
	defer rows.Close()

	stores := []domain.StoreSummary{}
	total := 0
	for rows.Next() {
		store, rowTotal, err := scanStoreSummary(rows)
		if err != nil {
			return domain.DiscoveryStoresResponse{}, err
		}
		stores = append(stores, store)
		total = rowTotal
	}
	if err := rows.Err(); err != nil {
		return domain.DiscoveryStoresResponse{}, err
	}

	return domain.DiscoveryStoresResponse{
		Stores: stores,
		Pagination: domain.Pagination{
			Limit:  query.Limit,
			Offset: query.Offset,
			Total:  total,
		},
	}, nil
}

func scanStoreSummary(rows *sql.Rows) (domain.StoreSummary, int, error) {
	var store domain.StoreSummary
	var categoryID sql.NullString
	var imageURL sql.NullString
	var logoImageURL sql.NullString
	var rating sql.NullFloat64
	var statusTone string
	var offerLabel sql.NullString
	var total int

	err := rows.Scan(
		&store.ID,
		&store.Name,
		&store.Address,
		&categoryID,
		&imageURL,
		&logoImageURL,
		&rating,
		&store.DistanceLabel,
		&store.DeliveryLabel,
		&store.ServiceLabel,
		&store.StatusLabel,
		&statusTone,
		&store.HasOffer,
		&offerLabel,
		&store.PublishStage,
		&total,
	)
	if err != nil {
		return domain.StoreSummary{}, 0, err
	}

	store.CategoryID = nullableString(categoryID)
	store.ImageURL = nullableString(imageURL)
	store.LogoImageURL = nullableString(logoImageURL)
	if rating.Valid {
		store.Rating = &rating.Float64
	}
	store.StatusTone = domain.StoreStatusTone(statusTone)
	store.OfferLabel = nullableString(offerLabel)

	return store, total, nil
}

func nullableString(value sql.NullString) string {
	if !value.Valid {
		return ""
	}
	return value.String
}

func (repo *PostgresRepository) UpdatePartnerReadiness(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error) {
	statement := `
UPDATE dsh_store_discovery_stores
SET partner_readiness_status = $1,
    visibility_updated_at = NOW(),
    updated_at = NOW()
WHERE id = $2
RETURNING
  id,
  partner_readiness_status,
  catalog_quality_status,
  catalog_pricing_status,
  marketing_visibility_status,
  publish_stage,
  status_tone,
  supports_pickup,
  supports_partner_delivery,
  service_label,
  delivery_label,
  visibility_updated_at
`
	var storeID string
	var partnerReadiness string
	var catalogQuality string
	var catalogPricing string
	var marketingVisibility string
	var publishStage string
	var statusTone string
	var supportsPickup bool
	var supportsPartnerDelivery bool
	var serviceLabel string
	var deliveryLabel string
	var visibilityUpdatedAt time.Time

	err := repo.db.QueryRowContext(ctx, statement, status, id).Scan(
		&storeID,
		&partnerReadiness,
		&catalogQuality,
		&catalogPricing,
		&marketingVisibility,
		&publishStage,
		&statusTone,
		&supportsPickup,
		&supportsPartnerDelivery,
		&serviceLabel,
		&deliveryLabel,
		&visibilityUpdatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.StoreVisibilityGateResponse{}, fmt.Errorf("store not found")
	}
	if err != nil {
		return domain.StoreVisibilityGateResponse{}, err
	}

	clientVisible := domain.VisibilityServiceabilityInput{
		PublishStage:              publishStage,
		StoreOpen:                 statusTone == "open",
		SupportsPickup:            supportsPickup,
		SupportsPartnerDelivery:   supportsPartnerDelivery,
		ServiceLabel:              serviceLabel,
		DeliveryLabel:             deliveryLabel,
		PartnerReadinessStatus:    partnerReadiness,
		CatalogQualityStatus:      catalogQuality,
		CatalogPricingStatus:      catalogPricing,
		MarketingVisibilityStatus: marketingVisibility,
	}.ClientVisible()

	return domain.StoreVisibilityGateResponse{
		StoreID:                   storeID,
		PartnerReadinessStatus:    partnerReadiness,
		CatalogQualityStatus:      catalogQuality,
		CatalogPricingStatus:      catalogPricing,
		MarketingVisibilityStatus: marketingVisibility,
		ClientVisible:             clientVisible,
		UpdatedAt:                 visibilityUpdatedAt,
	}, nil
}

func (repo *PostgresRepository) UpdateCatalogApproval(ctx context.Context, id string, qualityStatus string, pricingStatus string) (domain.StoreVisibilityGateResponse, error) {
	statement := `
UPDATE dsh_store_discovery_stores
SET catalog_quality_status = $1,
    catalog_pricing_status = $2,
    visibility_updated_at = NOW(),
    updated_at = NOW()
WHERE id = $3
RETURNING
  id,
  partner_readiness_status,
  catalog_quality_status,
  catalog_pricing_status,
  marketing_visibility_status,
  publish_stage,
  status_tone,
  supports_pickup,
  supports_partner_delivery,
  service_label,
  delivery_label,
  visibility_updated_at
`
	var storeID string
	var partnerReadiness string
	var catalogQuality string
	var catalogPricing string
	var marketingVisibility string
	var publishStage string
	var statusTone string
	var supportsPickup bool
	var supportsPartnerDelivery bool
	var serviceLabel string
	var deliveryLabel string
	var visibilityUpdatedAt time.Time

	err := repo.db.QueryRowContext(ctx, statement, qualityStatus, pricingStatus, id).Scan(
		&storeID,
		&partnerReadiness,
		&catalogQuality,
		&catalogPricing,
		&marketingVisibility,
		&publishStage,
		&statusTone,
		&supportsPickup,
		&supportsPartnerDelivery,
		&serviceLabel,
		&deliveryLabel,
		&visibilityUpdatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.StoreVisibilityGateResponse{}, fmt.Errorf("store not found")
	}
	if err != nil {
		return domain.StoreVisibilityGateResponse{}, err
	}

	clientVisible := domain.VisibilityServiceabilityInput{
		PublishStage:              publishStage,
		StoreOpen:                 statusTone == "open",
		SupportsPickup:            supportsPickup,
		SupportsPartnerDelivery:   supportsPartnerDelivery,
		ServiceLabel:              serviceLabel,
		DeliveryLabel:             deliveryLabel,
		PartnerReadinessStatus:    partnerReadiness,
		CatalogQualityStatus:      catalogQuality,
		CatalogPricingStatus:      catalogPricing,
		MarketingVisibilityStatus: marketingVisibility,
	}.ClientVisible()

	return domain.StoreVisibilityGateResponse{
		StoreID:                   storeID,
		PartnerReadinessStatus:    partnerReadiness,
		CatalogQualityStatus:      catalogQuality,
		CatalogPricingStatus:      catalogPricing,
		MarketingVisibilityStatus: marketingVisibility,
		ClientVisible:             clientVisible,
		UpdatedAt:                 visibilityUpdatedAt,
	}, nil
}

func (repo *PostgresRepository) UpdateMarketingVisibility(ctx context.Context, id string, status string) (domain.StoreVisibilityGateResponse, error) {
	statement := `
UPDATE dsh_store_discovery_stores
SET marketing_visibility_status = $1,
    visibility_updated_at = NOW(),
    updated_at = NOW()
WHERE id = $2
RETURNING
  id,
  partner_readiness_status,
  catalog_quality_status,
  catalog_pricing_status,
  marketing_visibility_status,
  publish_stage,
  status_tone,
  supports_pickup,
  supports_partner_delivery,
  service_label,
  delivery_label,
  visibility_updated_at
`
	var storeID string
	var partnerReadiness string
	var catalogQuality string
	var catalogPricing string
	var marketingVisibility string
	var publishStage string
	var statusTone string
	var supportsPickup bool
	var supportsPartnerDelivery bool
	var serviceLabel string
	var deliveryLabel string
	var visibilityUpdatedAt time.Time

	err := repo.db.QueryRowContext(ctx, statement, status, id).Scan(
		&storeID,
		&partnerReadiness,
		&catalogQuality,
		&catalogPricing,
		&marketingVisibility,
		&publishStage,
		&statusTone,
		&supportsPickup,
		&supportsPartnerDelivery,
		&serviceLabel,
		&deliveryLabel,
		&visibilityUpdatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.StoreVisibilityGateResponse{}, fmt.Errorf("store not found")
	}
	if err != nil {
		return domain.StoreVisibilityGateResponse{}, err
	}

	clientVisible := domain.VisibilityServiceabilityInput{
		PublishStage:              publishStage,
		StoreOpen:                 statusTone == "open",
		SupportsPickup:            supportsPickup,
		SupportsPartnerDelivery:   supportsPartnerDelivery,
		ServiceLabel:              serviceLabel,
		DeliveryLabel:             deliveryLabel,
		PartnerReadinessStatus:    partnerReadiness,
		CatalogQualityStatus:      catalogQuality,
		CatalogPricingStatus:      catalogPricing,
		MarketingVisibilityStatus: marketingVisibility,
	}.ClientVisible()

	return domain.StoreVisibilityGateResponse{
		StoreID:                   storeID,
		PartnerReadinessStatus:    partnerReadiness,
		CatalogQualityStatus:      catalogQuality,
		CatalogPricingStatus:      catalogPricing,
		MarketingVisibilityStatus: marketingVisibility,
		ClientVisible:             clientVisible,
		UpdatedAt:                 visibilityUpdatedAt,
	}, nil
}

func (repo *PostgresRepository) GetStore(ctx context.Context, id string) (domain.StoreDetail, error) {
	statement := `
SELECT
  id,
  name,
  address,
  category_id,
  image_url,
  logo_image_url,
  rating,
  distance_label,
  delivery_label,
  service_label,
  status_label,
  status_tone,
  has_offer,
  offer_label,
  publish_stage,
  partner_readiness_status,
  catalog_quality_status,
  catalog_pricing_status,
  marketing_visibility_status,
  contact_number,
  opening_hours,
  catalog_summary
FROM dsh_store_discovery_stores
WHERE id = $1
`
	var store domain.StoreDetail
	var categoryID sql.NullString
	var imageURL sql.NullString
	var logoImageURL sql.NullString
	var rating sql.NullFloat64
	var statusTone string
	var offerLabel sql.NullString
	var contactNumber sql.NullString
	var openingHours sql.NullString
	var catalogSummary sql.NullString

	err := repo.db.QueryRowContext(ctx, statement, id).Scan(
		&store.ID,
		&store.Name,
		&store.Address,
		&categoryID,
		&imageURL,
		&logoImageURL,
		&rating,
		&store.DistanceLabel,
		&store.DeliveryLabel,
		&store.ServiceLabel,
		&store.StatusLabel,
		&statusTone,
		&store.HasOffer,
		&offerLabel,
		&store.PublishStage,
		&store.PartnerReadinessStatus,
		&store.CatalogQualityStatus,
		&store.CatalogPricingStatus,
		&store.MarketingVisibilityStatus,
		&contactNumber,
		&openingHours,
		&catalogSummary,
	)
	if err == sql.ErrNoRows {
		return domain.StoreDetail{}, fmt.Errorf("store not found")
	}
	if err != nil {
		return domain.StoreDetail{}, err
	}

	store.CategoryID = nullableString(categoryID)
	store.ImageURL = nullableString(imageURL)
	store.LogoImageURL = nullableString(logoImageURL)
	if rating.Valid {
		store.Rating = &rating.Float64
	}
	store.StatusTone = domain.StoreStatusTone(statusTone)
	store.OfferLabel = nullableString(offerLabel)
	store.ContactNumber = nullableString(contactNumber)
	store.OpeningHours = nullableString(openingHours)
	store.CatalogSummary = nullableString(catalogSummary)

	return store, nil
}
