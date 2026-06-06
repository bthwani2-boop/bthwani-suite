package domain

import (
	"strings"
	"time"
)

type StoreStatusTone string

const (
	StoreStatusOpen   StoreStatusTone = "open"
	StoreStatusClosed StoreStatusTone = "closed"
)

type StoreDiscoveryFilter string

const (
	StoreDiscoveryFilterAll       StoreDiscoveryFilter = "all"
	StoreDiscoveryFilterFavorites StoreDiscoveryFilter = "favorites"
	StoreDiscoveryFilterNearest   StoreDiscoveryFilter = "nearest"
	StoreDiscoveryFilterNew       StoreDiscoveryFilter = "new"
	StoreDiscoveryFilterOffers    StoreDiscoveryFilter = "offers"
)

type ErrorCode string

const (
	ErrorCodeInvalidParameter ErrorCode = "INVALID_PARAMETER"
	ErrorCodeInternalError    ErrorCode = "INTERNAL_ERROR"
	ErrorCodeUnauthenticated  ErrorCode = "UNAUTHENTICATED"
)

type StoreSummary struct {
	ID            string          `json:"id"`
	Name          string          `json:"name"`
	Address       string          `json:"address"`
	CategoryID    string          `json:"category_id,omitempty"`
	ImageURL      string          `json:"image_url,omitempty"`
	LogoImageURL  string          `json:"logo_image_url,omitempty"`
	Rating        *float64        `json:"rating,omitempty"`
	DistanceLabel string          `json:"distance_label"`
	DeliveryLabel string          `json:"delivery_label"`
	ServiceLabel  string          `json:"service_label"`
	StatusLabel   string          `json:"status_label"`
	StatusTone    StoreStatusTone `json:"status_tone"`
	HasOffer      bool            `json:"has_offer"`
	OfferLabel    string          `json:"offer_label,omitempty"`
	PublishStage  string          `json:"publish_stage"`
}

type StoreDiscoveryQuery struct {
	CategoryID string
	Query      string
	Filter     StoreDiscoveryFilter
	Limit      int
	Offset     int
}

type Pagination struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
	Total  int `json:"total"`
}

type DiscoveryStoresResponse struct {
	Stores     []StoreSummary `json:"stores"`
	Pagination Pagination     `json:"pagination"`
}

type ErrorResponse struct {
	Code    ErrorCode `json:"code"`
	Message string    `json:"message"`
}

type VisibilityServiceabilityInput struct {
	PublishStage              string
	StoreOpen                 bool
	SupportsPickup            bool
	SupportsPartnerDelivery   bool
	ServiceLabel              string
	DeliveryLabel             string
	PartnerReadinessStatus    string
	CatalogQualityStatus      string
	CatalogPricingStatus      string
	MarketingVisibilityStatus string
}

func (input VisibilityServiceabilityInput) ClientVisible() bool {
	return strings.EqualFold(input.PublishStage, "published") &&
		input.StoreOpen &&
		(input.SupportsPickup || input.SupportsPartnerDelivery) &&
		strings.TrimSpace(input.ServiceLabel) != "" &&
		strings.TrimSpace(input.DeliveryLabel) != "" &&
		input.PartnerReadinessStatus == "ready" &&
		input.CatalogQualityStatus == "approved" &&
		input.CatalogPricingStatus == "approved" &&
		input.MarketingVisibilityStatus == "active"
}

type PartnerReadinessUpdateRequest struct {
	Status string `json:"status"`
}

type CatalogApprovalUpdateRequest struct {
	QualityStatus string `json:"quality_status"`
	PricingStatus string `json:"pricing_status"`
}

type MarketingVisibilityUpdateRequest struct {
	Status string `json:"status"`
}

type StoreVisibilityGateResponse struct {
	StoreID                   string    `json:"store_id"`
	PartnerReadinessStatus    string    `json:"partner_readiness_status"`
	CatalogQualityStatus      string    `json:"catalog_quality_status"`
	CatalogPricingStatus      string    `json:"catalog_pricing_status"`
	MarketingVisibilityStatus string    `json:"marketing_visibility_status"`
	ClientVisible             bool      `json:"client_visible"`
	UpdatedAt                 time.Time `json:"updated_at"`
}

type StoreDetail struct {
	StoreSummary
	ContactNumber             string `json:"contact_number,omitempty"`
	OpeningHours              string `json:"opening_hours,omitempty"`
	CatalogSummary            string `json:"catalog_summary,omitempty"`
	PartnerReadinessStatus    string `json:"partner_readiness_status"`
	CatalogQualityStatus      string `json:"catalog_quality_status"`
	CatalogPricingStatus      string `json:"catalog_pricing_status"`
	MarketingVisibilityStatus string `json:"marketing_visibility_status"`
}

// CreateFieldStoreRequest — field agent submits a new store for review (J-006A / DSH-SLICE-006A).
// After creation the store is in publish_stage='pending_review' and status_tone='closed'.
// CP approval (J-006E) is required before the store becomes visible to clients.
type CreateFieldStoreRequest struct {
	Name                    string `json:"name"`
	Address                 string `json:"address"`
	CategoryID              string `json:"category_id,omitempty"`
	SupportsPickup          bool   `json:"supports_pickup"`
	SupportsPartnerDelivery bool   `json:"supports_partner_delivery"`
}

// CreateFieldStoreResponse — returned after a successful POST /stores.
type CreateFieldStoreResponse struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Address      string    `json:"address"`
	CategoryID   string    `json:"category_id,omitempty"`
	PublishStage string    `json:"publish_stage"`
	CreatedAt    time.Time `json:"created_at"`
}

// CreateFieldVisitRequest — field agent submits visit evidence references for an onboarded store (J-006B).
// Evidence media keys are references only; raw media upload and document governance stay in J-006C.
type CreateFieldVisitRequest struct {
	FieldAgentID       string   `json:"field_agent_id,omitempty"`
	VisitSummary       string   `json:"visit_summary"`
	FollowUpAction     string   `json:"follow_up_action"`
	EvidenceMediaKeys  []string `json:"evidence_media_keys,omitempty"`
	LocationConfidence string   `json:"location_confidence,omitempty"`
}

// CreateFieldVisitResponse — returned after a successful POST /stores/{id}/field-visits.
type CreateFieldVisitResponse struct {
	ID                 string    `json:"id"`
	StoreID            string    `json:"store_id"`
	FieldAgentID       string    `json:"field_agent_id,omitempty"`
	VisitSummary       string    `json:"visit_summary"`
	FollowUpAction     string    `json:"follow_up_action"`
	EvidenceMediaKeys  []string  `json:"evidence_media_keys,omitempty"`
	LocationConfidence string    `json:"location_confidence,omitempty"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
}

// CreateFieldDocumentRequest — field agent uploads a document reference for a store (J-006C).
type CreateFieldDocumentRequest struct {
	DocumentKind string `json:"document_kind"`
	MediaKey     string `json:"media_key"`
}

// FieldDocumentRecord — represents a persistent document record.
type FieldDocumentRecord struct {
	ID           string    `json:"id"`
	StoreID      string    `json:"store_id"`
	DocumentKind string    `json:"document_kind"`
	MediaKey     string    `json:"media_key"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// ─── J-006D: Field Readiness Escalation ──────────────────────────────────────

// CreateFieldReadinessEscalationRequest — field agent escalates an incomplete readiness
// submission to a specific team for review. No financial mutation (WLT boundary).
type CreateFieldReadinessEscalationRequest struct {
	FieldAgentID string `json:"field_agent_id,omitempty"`
	Reason       string `json:"reason"`
	TargetTeam   string `json:"target_team"` // partner-management | control-panel | marketing
}

// FieldReadinessEscalationRecord — persisted escalation record.
type FieldReadinessEscalationRecord struct {
	ID           string    `json:"id"`
	StoreID      string    `json:"store_id"`
	FieldAgentID string    `json:"field_agent_id,omitempty"`
	Reason       string    `json:"reason"`
	TargetTeam   string    `json:"target_team"`
	Status       string    `json:"status"` // escalated | info_requested | resolved | rejected
	OperatorNote string    `json:"operator_note,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// UpdateFieldReadinessEscalationRequest — CP operator updates escalation status.
type UpdateFieldReadinessEscalationRequest struct {
	Status       string `json:"status"`        // info_requested | resolved | rejected
	OperatorNote string `json:"operator_note,omitempty"`
}

// ListFieldReadinessEscalationsResponse — paginated list for CP operator view.
type ListFieldReadinessEscalationsResponse struct {
	Escalations []FieldReadinessEscalationRecord `json:"escalations"`
	Pagination  Pagination                        `json:"pagination"`
}

// ListFieldReadinessEscalationsQuery — filter params for CP queue.
type ListFieldReadinessEscalationsQuery struct {
	Status string
	Limit  int
	Offset int
}

// ─── J-006E: Field Readiness Approval ────────────────────────────────────────

// CreateFieldReadinessApprovalRequest — CP operator formally approves or rejects
// a store's readiness package. Approval makes partner-readiness gate eligible (J-001C).
// No financial mutation (WLT boundary).
type CreateFieldReadinessApprovalRequest struct {
	OperatorID string `json:"operator_id,omitempty"`
	Decision   string `json:"decision"` // approved | rejected
	Reason     string `json:"reason,omitempty"`
}

// FieldReadinessApprovalRecord — persisted approval record.
type FieldReadinessApprovalRecord struct {
	ID         string    `json:"id"`
	StoreID    string    `json:"store_id"`
	OperatorID string    `json:"operator_id,omitempty"`
	Decision   string    `json:"decision"` // approved | rejected
	Reason     string    `json:"reason,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}
