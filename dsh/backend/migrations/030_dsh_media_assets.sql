-- DSH_MEDIA_ASSETS: Canonical media metadata store.
-- Binary files live in MinIO/S3-compatible object storage (bthwani-media-local bucket).
-- PostgreSQL stores metadata + object references only — never binary content.
-- WLT boundary: WLT stores media_id references only (in wlt schema), never copies rows here.

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
