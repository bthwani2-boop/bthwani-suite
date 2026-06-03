ALTER TABLE dsh_store_discovery_stores
  ADD COLUMN partner_readiness_status TEXT NOT NULL DEFAULT 'ready' CHECK (partner_readiness_status IN ('ready', 'not_ready', 'paused')),
  ADD COLUMN catalog_quality_status TEXT NOT NULL DEFAULT 'approved' CHECK (catalog_quality_status IN ('approved', 'pending', 'rejected')),
  ADD COLUMN catalog_pricing_status TEXT NOT NULL DEFAULT 'approved' CHECK (catalog_pricing_status IN ('approved', 'pending', 'rejected')),
  ADD COLUMN marketing_visibility_status TEXT NOT NULL DEFAULT 'active' CHECK (marketing_visibility_status IN ('active', 'inactive', 'paused')),
  ADD COLUMN visibility_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
