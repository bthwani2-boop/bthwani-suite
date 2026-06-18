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

	repo := &PostgresRepository{db: db}
	if err := repo.ensureMediaAssetsTable(ctx); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("media assets migration: %w", err)
	}

	return repo, nil
}

// ensureMediaAssetsTable applies 030_dsh_media_assets.sql idempotently on existing volumes.
// Uses IF NOT EXISTS — safe to run on any volume state without data loss.
func (repo *PostgresRepository) ensureMediaAssetsTable(ctx context.Context) error {
	_, err := repo.db.ExecContext(ctx, `
CREATE TABLE IF NOT EXISTS dsh_media_assets (
    id                 TEXT        PRIMARY KEY,
    owner_service      TEXT        NOT NULL DEFAULT 'dsh',
    owner_type         TEXT        NOT NULL,
    owner_id           TEXT        NOT NULL,
    media_type         TEXT        NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
    purpose            TEXT        NOT NULL,
    storage_provider   TEXT        NOT NULL DEFAULT 'minio',
    bucket             TEXT        NOT NULL DEFAULT 'bthwani-media-local',
    storage_key        TEXT        NOT NULL UNIQUE,
    public_url         TEXT,
    thumbnail_url      TEXT,
    mime_type          TEXT,
    file_size_bytes    BIGINT,
    width              INT,
    height             INT,
    duration_seconds   NUMERIC(10,3),
    checksum_sha256    TEXT,
    status             TEXT        NOT NULL DEFAULT 'pending_upload'
                         CHECK (status IN ('pending_upload','uploaded','processing','active','rejected','deleted')),
    uploaded_by        TEXT,
    approved_by        TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at         TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_dsh_media_assets_owner
    ON dsh_media_assets (owner_service, owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_dsh_media_assets_status
    ON dsh_media_assets (status);
CREATE INDEX IF NOT EXISTS idx_dsh_media_assets_purpose
    ON dsh_media_assets (purpose);
CREATE INDEX IF NOT EXISTS idx_dsh_media_assets_created_at
    ON dsh_media_assets (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dsh_media_assets_owner_purpose_status
    ON dsh_media_assets (owner_type, owner_id, purpose, status);
`)
	return err
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
  supports_pickup,
  supports_partner_delivery,
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
		&store.SupportsPickup,
		&store.SupportsPartnerDelivery,
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

// generateStoreID produces a time-based store ID consistent with the repo pattern.
func generateStoreID() string {
	return fmt.Sprintf("store-%d", time.Now().UnixNano())
}

func generateFieldVisitID() string {
	return fmt.Sprintf("field-visit-%d", time.Now().UnixNano())
}

// CreateFieldStore — field agent submits a new store for review (J-006A).
// The store is created with publish_stage='pending_review' and status_tone='closed'
// so it is not visible to clients until the CP operator approves it (J-006E).
func (repo *PostgresRepository) CreateFieldStore(ctx context.Context, req domain.CreateFieldStoreRequest) (domain.CreateFieldStoreResponse, error) {
	if strings.TrimSpace(req.Name) == "" {
		return domain.CreateFieldStoreResponse{}, fmt.Errorf("name is required")
	}
	if strings.TrimSpace(req.Address) == "" {
		return domain.CreateFieldStoreResponse{}, fmt.Errorf("address is required")
	}

	id := generateStoreID()
	var categoryID sql.NullString
	if req.CategoryID != "" {
		categoryID = sql.NullString{String: req.CategoryID, Valid: true}
	}

	query := `
INSERT INTO dsh_store_discovery_stores (
  id, name, address, category_id,
  distance_label, delivery_label, service_label, status_label,
  status_tone, has_offer, publish_stage,
  supports_pickup, supports_partner_delivery,
  contact_number, opening_hours, catalog_summary,
  search_text, created_at, updated_at
) VALUES (
  $1, $2, $3, $4,
  '—', '—', '—', 'قيد المراجعة',
  'closed', FALSE, 'pending_review',
  $5, $6,
  NULLIF($7, ''), NULLIF($8, ''), NULLIF($9, ''),
  $10, NOW(), NOW()
)
RETURNING id, name, address, category_id, publish_stage, created_at`

	searchText := strings.ToLower(req.Name + " " + req.Address)
	var res domain.CreateFieldStoreResponse
	var catIDResult sql.NullString
	err := repo.db.QueryRowContext(ctx, query,
		id, req.Name, req.Address, categoryID,
		req.SupportsPickup, req.SupportsPartnerDelivery,
		req.ContactNumber, req.OpeningHours, req.CatalogSummary,
		searchText,
	).Scan(&res.ID, &res.Name, &res.Address, &catIDResult, &res.PublishStage, &res.CreatedAt)
	if err != nil {
		return domain.CreateFieldStoreResponse{}, err
	}
	if catIDResult.Valid {
		res.CategoryID = catIDResult.String
	}
	return res, nil
}

// ListPendingStores returns all stores in the pending_review stage for control panel review queue.
func (repo *PostgresRepository) ListPendingStores(ctx context.Context) ([]domain.CreateFieldStoreResponse, error) {
	query := `
SELECT id, name, address, category_id, publish_stage, created_at
FROM dsh_store_discovery_stores
WHERE publish_stage = 'pending_review'
ORDER BY created_at DESC`

	rows, err := repo.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []domain.CreateFieldStoreResponse
	for rows.Next() {
		var res domain.CreateFieldStoreResponse
		var catID sql.NullString
		err := rows.Scan(&res.ID, &res.Name, &res.Address, &catID, &res.PublishStage, &res.CreatedAt)
		if err != nil {
			return nil, err
		}
		if catID.Valid {
			res.CategoryID = catID.String
		}
		result = append(result, res)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}


// CreateFieldVisit — field agent submits visit notes and evidence media references (J-006B).
// Raw media upload/document handling remains J-006C; this stores references only.
func (repo *PostgresRepository) CreateFieldVisit(ctx context.Context, storeID string, req domain.CreateFieldVisitRequest) (domain.CreateFieldVisitResponse, error) {
	storeID = strings.TrimSpace(storeID)
	if storeID == "" {
		return domain.CreateFieldVisitResponse{}, fmt.Errorf("store id is required")
	}
	if strings.TrimSpace(req.VisitSummary) == "" {
		return domain.CreateFieldVisitResponse{}, fmt.Errorf("visit_summary is required")
	}
	if strings.TrimSpace(req.FollowUpAction) == "" {
		return domain.CreateFieldVisitResponse{}, fmt.Errorf("follow_up_action is required")
	}

	var storeExists bool
	if err := repo.db.QueryRowContext(ctx, `SELECT EXISTS (SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)`, storeID).Scan(&storeExists); err != nil {
		return domain.CreateFieldVisitResponse{}, err
	}
	if !storeExists {
		return domain.CreateFieldVisitResponse{}, fmt.Errorf("store not found")
	}

	id := generateFieldVisitID()
	fieldAgentID := strings.TrimSpace(req.FieldAgentID)
	evidenceMediaKeys := strings.Join(normalizeEvidenceMediaKeys(req.EvidenceMediaKeys), ",")
	locationConfidence := strings.TrimSpace(req.LocationConfidence)

	query := `
INSERT INTO dsh_field_store_visits (
  id, store_id, field_agent_id, visit_summary, follow_up_action,
  evidence_media_keys, location_confidence, status, created_at, updated_at
) VALUES (
  $1, $2, NULLIF($3, ''), $4, $5,
  $6, NULLIF($7, ''), 'submitted', NOW(), NOW()
)
RETURNING id, store_id, field_agent_id, visit_summary, follow_up_action, evidence_media_keys, location_confidence, status, created_at`

	var res domain.CreateFieldVisitResponse
	var resFieldAgentID sql.NullString
	var resEvidenceMediaKeys string
	var resLocationConfidence sql.NullString
	err := repo.db.QueryRowContext(ctx, query,
		id,
		storeID,
		fieldAgentID,
		strings.TrimSpace(req.VisitSummary),
		strings.TrimSpace(req.FollowUpAction),
		evidenceMediaKeys,
		locationConfidence,
	).Scan(
		&res.ID,
		&res.StoreID,
		&resFieldAgentID,
		&res.VisitSummary,
		&res.FollowUpAction,
		&resEvidenceMediaKeys,
		&resLocationConfidence,
		&res.Status,
		&res.CreatedAt,
	)
	if err != nil {
		return domain.CreateFieldVisitResponse{}, err
	}
	res.FieldAgentID = nullableString(resFieldAgentID)
	res.EvidenceMediaKeys = splitEvidenceMediaKeys(resEvidenceMediaKeys)
	res.LocationConfidence = nullableString(resLocationConfidence)
	return res, nil
}

func normalizeEvidenceMediaKeys(values []string) []string {
	seen := map[string]struct{}{}
	keys := []string{}
	for _, value := range values {
		key := strings.TrimSpace(value)
		if key == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		keys = append(keys, key)
	}
	return keys
}

func splitEvidenceMediaKeys(value string) []string {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	parts := strings.Split(value, ",")
	return normalizeEvidenceMediaKeys(parts)
}

func generateFieldDocumentID() string {
	return fmt.Sprintf("field-doc-%d", time.Now().UnixNano())
}

// CreateFieldDocument (J-006C): field agent uploads a document reference for a store.
func (repo *PostgresRepository) CreateFieldDocument(ctx context.Context, storeID string, req domain.CreateFieldDocumentRequest) (domain.FieldDocumentRecord, error) {
	storeID = strings.TrimSpace(storeID)
	if storeID == "" {
		return domain.FieldDocumentRecord{}, fmt.Errorf("store id is required")
	}
	kind := strings.TrimSpace(req.DocumentKind)
	if kind == "" {
		return domain.FieldDocumentRecord{}, fmt.Errorf("document_kind is required")
	}
	mediaKey := strings.TrimSpace(req.MediaKey)
	if mediaKey == "" {
		return domain.FieldDocumentRecord{}, fmt.Errorf("media_key is required")
	}

	validKinds := map[string]bool{
		"commercial_registration": true,
		"tax_certificate":         true,
		"identity_proof":          true,
		"storefront_photo":        true,
		"interior_photo":          true,
	}
	if !validKinds[kind] {
		return domain.FieldDocumentRecord{}, fmt.Errorf("invalid document_kind: %s", kind)
	}

	var storeExists bool
	if err := repo.db.QueryRowContext(ctx, `SELECT EXISTS (SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)`, storeID).Scan(&storeExists); err != nil {
		return domain.FieldDocumentRecord{}, err
	}
	if !storeExists {
		return domain.FieldDocumentRecord{}, fmt.Errorf("store not found")
	}

	id := generateFieldDocumentID()

	query := `
INSERT INTO dsh_field_store_documents (
  id, store_id, document_kind, media_key, status, created_at, updated_at
) VALUES (
  $1, $2, $3, $4, 'pending', NOW(), NOW()
)
RETURNING id, store_id, document_kind, media_key, status, created_at, updated_at`

	var res domain.FieldDocumentRecord
	err := repo.db.QueryRowContext(ctx, query,
		id,
		storeID,
		kind,
		mediaKey,
	).Scan(
		&res.ID,
		&res.StoreID,
		&res.DocumentKind,
		&res.MediaKey,
		&res.Status,
		&res.CreatedAt,
		&res.UpdatedAt,
	)
	if err != nil {
		return domain.FieldDocumentRecord{}, err
	}
	return res, nil
}

// ListFieldDocuments (J-006C): lists documents associated with a store.
func (repo *PostgresRepository) ListFieldDocuments(ctx context.Context, storeID string) ([]domain.FieldDocumentRecord, error) {
	storeID = strings.TrimSpace(storeID)
	if storeID == "" {
		return nil, fmt.Errorf("store id is required")
	}

	var storeExists bool
	if err := repo.db.QueryRowContext(ctx, `SELECT EXISTS (SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)`, storeID).Scan(&storeExists); err != nil {
		return nil, err
	}
	if !storeExists {
		return nil, fmt.Errorf("store not found")
	}

	query := `
SELECT id, store_id, document_kind, media_key, status, created_at, updated_at
FROM dsh_field_store_documents
WHERE store_id = $1
ORDER BY created_at DESC`

	rows, err := repo.db.QueryContext(ctx, query, storeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var docs []domain.FieldDocumentRecord
	for rows.Next() {
		var doc domain.FieldDocumentRecord
		err := rows.Scan(
			&doc.ID,
			&doc.StoreID,
			&doc.DocumentKind,
			&doc.MediaKey,
			&doc.Status,
			&doc.CreatedAt,
			&doc.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return docs, nil
}
