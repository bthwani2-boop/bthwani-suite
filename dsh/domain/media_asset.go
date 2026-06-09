package domain

import "time"

// MediaAsset is the canonical runtime media record stored in dsh_media_assets.
// Binary files live in MinIO/S3; this struct holds metadata + object reference only.
type MediaAsset struct {
	ID              string     `json:"id"`
	OwnerService    string     `json:"owner_service"`
	OwnerType       string     `json:"owner_type"`
	OwnerID         string     `json:"owner_id"`
	MediaType       string     `json:"media_type"`
	Purpose         string     `json:"purpose"`
	StorageProvider string     `json:"storage_provider"`
	Bucket          string     `json:"bucket"`
	StorageKey      string     `json:"storage_key"`
	PublicURL       *string    `json:"public_url,omitempty"`
	ThumbnailURL    *string    `json:"thumbnail_url,omitempty"`
	MimeType        *string    `json:"mime_type,omitempty"`
	FileSizeBytes   *int64     `json:"file_size_bytes,omitempty"`
	Width           *int       `json:"width,omitempty"`
	Height          *int       `json:"height,omitempty"`
	DurationSeconds *float64   `json:"duration_seconds,omitempty"`
	ChecksumSHA256  *string    `json:"checksum_sha256,omitempty"`
	Status          string     `json:"status"`
	UploadedBy      *string    `json:"uploaded_by,omitempty"`
	ApprovedBy      *string    `json:"approved_by,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty"`
}

type CreateMediaUploadIntentRequest struct {
	OwnerService    string   `json:"owner_service"`
	OwnerType       string   `json:"owner_type"`
	OwnerID         string   `json:"owner_id"`
	MediaType       string   `json:"media_type"`
	Purpose         string   `json:"purpose"`
	Filename        string   `json:"filename"`
	MimeType        string   `json:"mime_type"`
	FileSizeBytes   *int64   `json:"file_size_bytes,omitempty"`
	ChecksumSHA256  *string  `json:"checksum_sha256,omitempty"`
	Width           *int     `json:"width,omitempty"`
	Height          *int     `json:"height,omitempty"`
	DurationSeconds *float64 `json:"duration_seconds,omitempty"`
	ActorID         string   `json:"actor_id"`
}

type MediaUploadIntent struct {
	MediaID    string `json:"media_id"`
	UploadURL  string `json:"upload_url"`
	StorageKey string `json:"storage_key"`
	ExpiresIn  int    `json:"expires_in_seconds"`
}

type CompleteMediaUploadRequest struct {
	ActorID string `json:"actor_id"`
}

type ListMediaQuery struct {
	OwnerType string
	OwnerID   string
	Purpose   string
	Status    string
}

// MediaOwnerType enumerates valid owner types for DSH media.
// WLT boundary: WLT media_id references use the wlt schema, never this table.
const (
	MediaOwnerTypeProduct      = "product"
	MediaOwnerTypeStore        = "store"
	MediaOwnerTypeBanner       = "banner"
	MediaOwnerTypeCampaign     = "campaign"
	MediaOwnerTypeOrder        = "order"
	MediaOwnerTypeFieldVisit   = "field_visit"
	MediaOwnerTypeSupportTicket = "support_ticket"
	MediaOwnerTypeDispute      = "dispute"
)

const (
	MediaPurposePrimary          = "primary"
	MediaPurposeGallery          = "gallery"
	MediaPurposeThumbnail        = "thumbnail"
	MediaPurposeLogo             = "logo"
	MediaPurposeCover            = "cover"
	MediaPurposePickupProof      = "pickup_proof"
	MediaPurposeDeliveryProof    = "delivery_proof"
	MediaPurposeIssueProof       = "issue_proof"
	MediaPurposeInspection       = "inspection"
	MediaPurposeQuality          = "quality"
	MediaPurposeAttachment       = "attachment"
	MediaPurposeEvidence         = "evidence"
)

const (
	MediaStatusPendingUpload = "pending_upload"
	MediaStatusUploaded      = "uploaded"
	MediaStatusProcessing    = "processing"
	MediaStatusActive        = "active"
	MediaStatusRejected      = "rejected"
	MediaStatusDeleted       = "deleted"
)
