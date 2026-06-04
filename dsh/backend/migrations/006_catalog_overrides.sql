CREATE TABLE IF NOT EXISTS dsh_catalog_overrides (
  store_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES dsh_catalog_products(id) ON DELETE CASCADE,
  price_override TEXT,
  stock_override INTEGER,
  available_override BOOLEAN,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (store_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_overrides_store ON dsh_catalog_overrides (store_id);
