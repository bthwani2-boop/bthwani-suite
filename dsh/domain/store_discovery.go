package domain

import "strings"

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
	PublishStage            string
	StoreOpen               bool
	SupportsPickup          bool
	SupportsPartnerDelivery bool
	ServiceLabel            string
	DeliveryLabel           string
}

func (input VisibilityServiceabilityInput) ClientVisible() bool {
	return strings.EqualFold(input.PublishStage, "published") &&
		input.StoreOpen &&
		(input.SupportsPickup || input.SupportsPartnerDelivery) &&
		strings.TrimSpace(input.ServiceLabel) != "" &&
		strings.TrimSpace(input.DeliveryLabel) != ""
}
