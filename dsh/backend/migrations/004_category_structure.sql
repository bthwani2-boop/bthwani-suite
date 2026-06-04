CREATE TABLE IF NOT EXISTS dsh_catalog_categories (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES dsh_catalog_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_categories_store_id ON dsh_catalog_categories (store_id);
CREATE INDEX IF NOT EXISTS idx_dsh_catalog_categories_parent_id ON dsh_catalog_categories (parent_id);

-- Seed category referenced by existing products
INSERT INTO dsh_catalog_categories (id, store_id, name, description)
VALUES ('cat-beverages-water', 'store-1001', 'Water & Beverages', 'Drinking water and beverages')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE dsh_catalog_products
  ADD CONSTRAINT fk_dsh_catalog_products_category
  FOREIGN KEY (category_id) REFERENCES dsh_catalog_categories(id)
  ON DELETE SET NULL;
