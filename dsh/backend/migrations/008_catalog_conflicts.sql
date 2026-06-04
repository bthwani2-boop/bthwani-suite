CREATE TABLE IF NOT EXISTS dsh_catalog_conflicts (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES dsh_catalog_products(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('price_divergence', 'availability_divergence')),
  central_value TEXT NOT NULL,
  override_value TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'resolved_accept_local', 'resolved_reverted')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_conflicts_store ON dsh_catalog_conflicts (store_id);
CREATE INDEX IF NOT EXISTS idx_dsh_catalog_conflicts_status ON dsh_catalog_conflicts (status);
