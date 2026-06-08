CREATE TABLE IF NOT EXISTS dsh_field_store_documents (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  document_kind TEXT NOT NULL CHECK (document_kind IN ('commercial_registration', 'tax_certificate', 'identity_proof', 'storefront_photo', 'interior_photo')),
  media_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_field_store_documents_store
  ON dsh_field_store_documents (store_id, created_at DESC);
