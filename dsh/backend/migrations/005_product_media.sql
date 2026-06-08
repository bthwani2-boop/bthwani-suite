CREATE TABLE IF NOT EXISTS dsh_catalog_product_media (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES dsh_catalog_products(id) ON DELETE CASCADE,
  media_key TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_product_media_product_id
  ON dsh_catalog_product_media (product_id);
