package store

import (
	"context"

	"bthwani.local/dsh/domain"
)

// PostgresMediaRepository is the runtime media contract.
// Satisfied only by *PostgresRepository — not by MemoryRepository.
// Media upload requires persistent storage; in-memory mode does not support it.
type PostgresMediaRepository interface {
	CreateMediaUploadIntent(ctx context.Context, req domain.CreateMediaUploadIntentRequest, cfg MediaStorageConfig) (domain.MediaAsset, domain.MediaUploadIntent, error)
	CompleteMediaUpload(ctx context.Context, mediaID string, cfg MediaStorageConfig, actorID string) (domain.MediaAsset, error)
	GetMediaAsset(ctx context.Context, mediaID string) (domain.MediaAsset, error)
	ListMediaAssets(ctx context.Context, q domain.ListMediaQuery) ([]domain.MediaAsset, error)
	SoftDeleteMediaAsset(ctx context.Context, mediaID string) error
}
