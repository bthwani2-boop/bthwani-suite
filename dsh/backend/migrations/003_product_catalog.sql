CREATE TABLE IF NOT EXISTS dsh_catalog_products (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  gtin TEXT,
  barcode TEXT,
  description TEXT,
  base_price_label TEXT NOT NULL DEFAULT '',
  category_id TEXT,
  approval_status TEXT NOT NULL DEFAULT 'partner_submitted'
    CHECK (approval_status IN (
      'field_draft',
      'partner_submitted',
      'partner_review',
      'partner_approved',
      'marketing_review',
      'marketing_approved',
      'catalog_adopted',
      'client_visible',
      'needs_fix',
      'rejected'
    )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_products_store_id
  ON dsh_catalog_products (store_id);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_products_approval_status
  ON dsh_catalog_products (approval_status);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_products_sku
  ON dsh_catalog_products (sku) WHERE sku IS NOT NULL;
