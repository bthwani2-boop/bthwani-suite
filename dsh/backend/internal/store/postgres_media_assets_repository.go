package store

import (
	"context"
	"database/sql"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"bthwani.local/dsh/domain"
)

func newMediaAssetID() string {
	return fmt.Sprintf("media-%d", time.Now().UnixNano())
}

func extFromFilename(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg":
		return ext
	case ".mp4", ".mov", ".webm":
		return ext
	case ".pdf":
		return ext
	default:
		return ".bin"
	}
}

// CreateMediaUploadIntent inserts a pending_upload record and returns a presigned PUT URL.
func (repo *PostgresRepository) CreateMediaUploadIntent(
	ctx context.Context,
	req domain.CreateMediaUploadIntentRequest,
	cfg MediaStorageConfig,
) (domain.MediaAsset, domain.MediaUploadIntent, error) {
	id := newMediaAssetID()
	ext := extFromFilename(req.Filename)
	ownerService := req.OwnerService
	if ownerService == "" {
		ownerService = "dsh"
	}
	storageKey := CanonicalStorageKey(req.OwnerType, req.OwnerID, req.Purpose, id, ext)

	now := time.Now().UTC()
	var uploadURL string
	var presignErr error
	if cfg.IsConfigured() {
		uploadURL, presignErr = cfg.PresignPutURL(storageKey, req.MimeType, now)
		if presignErr != nil {
			return domain.MediaAsset{}, domain.MediaUploadIntent{}, fmt.Errorf("presign failed: %w", presignErr)
		}
	}

	query := `
INSERT INTO dsh_media_assets (
    id, owner_service, owner_type, owner_id, media_type, purpose,
    storage_provider, bucket, storage_key, mime_type,
    file_size_bytes, width, height, duration_seconds, checksum_sha256,
    status, uploaded_by, created_at, updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10,
    $11, $12, $13, $14, $15,
    'pending_upload', $16, NOW(), NOW()
)
RETURNING id, owner_service, owner_type, owner_id, media_type, purpose,
          storage_provider, bucket, storage_key, mime_type,
          file_size_bytes, width, height, duration_seconds, checksum_sha256,
          status, uploaded_by, approved_by, created_at, updated_at, deleted_at`

	var mimeType, uploadedBy sql.NullString
	if req.MimeType != "" {
		mimeType = sql.NullString{String: req.MimeType, Valid: true}
	}
	if req.ActorID != "" {
		uploadedBy = sql.NullString{String: req.ActorID, Valid: true}
	}

	row := repo.db.QueryRowContext(ctx, query,
		id, ownerService, req.OwnerType, req.OwnerID, req.MediaType, req.Purpose,
		cfg.Provider, cfg.Bucket, storageKey, mimeType,
		req.FileSizeBytes, req.Width, req.Height, req.DurationSeconds, req.ChecksumSHA256,
		uploadedBy,
	)

	asset, err := scanMediaAsset(row)
	if err != nil {
		return domain.MediaAsset{}, domain.MediaUploadIntent{}, fmt.Errorf("insert media asset: %w", err)
	}

	intent := domain.MediaUploadIntent{
		MediaID:    id,
		UploadURL:  uploadURL,
		StorageKey: storageKey,
		ExpiresIn:  cfg.PresignTTL,
	}
	return asset, intent, nil
}

// CompleteMediaUpload transitions status to uploaded and sets public_url.
func (repo *PostgresRepository) CompleteMediaUpload(
	ctx context.Context,
	mediaID string,
	cfg MediaStorageConfig,
	actorID string,
) (domain.MediaAsset, error) {
	// Fetch current record
	asset, err := repo.GetMediaAsset(ctx, mediaID)
	if err != nil {
		return domain.MediaAsset{}, err
	}
	if asset.Status != domain.MediaStatusPendingUpload && asset.Status != domain.MediaStatusUploaded {
		return domain.MediaAsset{}, fmt.Errorf("cannot complete media in status %s", asset.Status)
	}

	publicURL := cfg.PublicURLForKey(asset.StorageKey)

	query := `
UPDATE dsh_media_assets
SET status = 'uploaded', public_url = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING id, owner_service, owner_type, owner_id, media_type, purpose,
          storage_provider, bucket, storage_key, public_url, thumbnail_url, mime_type,
          file_size_bytes, width, height, duration_seconds, checksum_sha256,
          status, uploaded_by, approved_by, created_at, updated_at, deleted_at`

	row := repo.db.QueryRowContext(ctx, query, mediaID, publicURL)
	return scanMediaAssetFull(row)
}

// GetMediaAsset fetches a single media asset by ID.
func (repo *PostgresRepository) GetMediaAsset(ctx context.Context, mediaID string) (domain.MediaAsset, error) {
	query := `
SELECT id, owner_service, owner_type, owner_id, media_type, purpose,
       storage_provider, bucket, storage_key, public_url, thumbnail_url, mime_type,
       file_size_bytes, width, height, duration_seconds, checksum_sha256,
       status, uploaded_by, approved_by, created_at, updated_at, deleted_at
FROM dsh_media_assets
WHERE id = $1 AND deleted_at IS NULL`

	row := repo.db.QueryRowContext(ctx, query, mediaID)
	return scanMediaAssetFull(row)
}

// ListMediaAssets lists media assets filtered by owner/purpose/status.
func (repo *PostgresRepository) ListMediaAssets(ctx context.Context, q domain.ListMediaQuery) ([]domain.MediaAsset, error) {
	where := []string{"deleted_at IS NULL"}
	args := []any{}
	i := 1
	if q.OwnerType != "" {
		where = append(where, fmt.Sprintf("owner_type = $%d", i))
		args = append(args, q.OwnerType)
		i++
	}
	if q.OwnerID != "" {
		where = append(where, fmt.Sprintf("owner_id = $%d", i))
		args = append(args, q.OwnerID)
		i++
	}
	if q.Purpose != "" {
		where = append(where, fmt.Sprintf("purpose = $%d", i))
		args = append(args, q.Purpose)
		i++
	}
	if q.Status != "" {
		where = append(where, fmt.Sprintf("status = $%d", i))
		args = append(args, q.Status)
	}

	query := fmt.Sprintf(`
SELECT id, owner_service, owner_type, owner_id, media_type, purpose,
       storage_provider, bucket, storage_key, public_url, thumbnail_url, mime_type,
       file_size_bytes, width, height, duration_seconds, checksum_sha256,
       status, uploaded_by, approved_by, created_at, updated_at, deleted_at
FROM dsh_media_assets
WHERE %s
ORDER BY created_at DESC
LIMIT 100`, strings.Join(where, " AND "))

	rows, err := repo.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list media assets: %w", err)
	}
	defer rows.Close()

	var result []domain.MediaAsset
	for rows.Next() {
		asset, err := scanMediaAssetFull(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, asset)
	}
	return result, rows.Err()
}

// SoftDeleteMediaAsset marks an asset deleted without removing the DB row.
func (repo *PostgresRepository) SoftDeleteMediaAsset(ctx context.Context, mediaID string) error {
	res, err := repo.db.ExecContext(ctx, `
UPDATE dsh_media_assets SET status = 'deleted', deleted_at = NOW(), updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL`, mediaID)
	if err != nil {
		return fmt.Errorf("soft delete media: %w", err)
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return fmt.Errorf("media asset not found: %s", mediaID)
	}
	return nil
}

// scanMediaAsset scans a row from INSERT RETURNING (no public_url/thumbnail_url columns).
func scanMediaAsset(row *sql.Row) (domain.MediaAsset, error) {
	var a domain.MediaAsset
	var mimeType, uploadedBy, approvedBy sql.NullString
	var fileSize sql.NullInt64
	var width, height sql.NullInt32
	var duration sql.NullFloat64
	var checksum sql.NullString
	var deletedAt sql.NullTime

	err := row.Scan(
		&a.ID, &a.OwnerService, &a.OwnerType, &a.OwnerID, &a.MediaType, &a.Purpose,
		&a.StorageProvider, &a.Bucket, &a.StorageKey, &mimeType,
		&fileSize, &width, &height, &duration, &checksum,
		&a.Status, &uploadedBy, &approvedBy, &a.CreatedAt, &a.UpdatedAt, &deletedAt,
	)
	if err != nil {
		return domain.MediaAsset{}, fmt.Errorf("scan media asset: %w", err)
	}
	if mimeType.Valid {
		a.MimeType = &mimeType.String
	}
	if uploadedBy.Valid {
		a.UploadedBy = &uploadedBy.String
	}
	if approvedBy.Valid {
		a.ApprovedBy = &approvedBy.String
	}
	if fileSize.Valid {
		v := fileSize.Int64
		a.FileSizeBytes = &v
	}
	if width.Valid {
		v := int(width.Int32)
		a.Width = &v
	}
	if height.Valid {
		v := int(height.Int32)
		a.Height = &v
	}
	if duration.Valid {
		a.DurationSeconds = &duration.Float64
	}
	if checksum.Valid {
		a.ChecksumSHA256 = &checksum.String
	}
	if deletedAt.Valid {
		a.DeletedAt = &deletedAt.Time
	}
	return a, nil
}

// scanMediaAssetFull scans a full SELECT row (includes public_url, thumbnail_url).
type scannable interface {
	Scan(dest ...any) error
}

func scanMediaAssetFull(row scannable) (domain.MediaAsset, error) {
	var a domain.MediaAsset
	var publicURL, thumbnailURL, mimeType, uploadedBy, approvedBy, checksum sql.NullString
	var fileSize sql.NullInt64
	var width, height sql.NullInt32
	var duration sql.NullFloat64
	var deletedAt sql.NullTime

	err := row.Scan(
		&a.ID, &a.OwnerService, &a.OwnerType, &a.OwnerID, &a.MediaType, &a.Purpose,
		&a.StorageProvider, &a.Bucket, &a.StorageKey, &publicURL, &thumbnailURL, &mimeType,
		&fileSize, &width, &height, &duration, &checksum,
		&a.Status, &uploadedBy, &approvedBy, &a.CreatedAt, &a.UpdatedAt, &deletedAt,
	)
	if err != nil {
		return domain.MediaAsset{}, fmt.Errorf("scan media asset full: %w", err)
	}
	if publicURL.Valid {
		a.PublicURL = &publicURL.String
	}
	if thumbnailURL.Valid {
		a.ThumbnailURL = &thumbnailURL.String
	}
	if mimeType.Valid {
		a.MimeType = &mimeType.String
	}
	if uploadedBy.Valid {
		a.UploadedBy = &uploadedBy.String
	}
	if approvedBy.Valid {
		a.ApprovedBy = &approvedBy.String
	}
	if fileSize.Valid {
		v := fileSize.Int64
		a.FileSizeBytes = &v
	}
	if width.Valid {
		v := int(width.Int32)
		a.Width = &v
	}
	if height.Valid {
		v := int(height.Int32)
		a.Height = &v
	}
	if duration.Valid {
		a.DurationSeconds = &duration.Float64
	}
	if checksum.Valid {
		a.ChecksumSHA256 = &checksum.String
	}
	if deletedAt.Valid {
		a.DeletedAt = &deletedAt.Time
	}
	return a, nil
}
