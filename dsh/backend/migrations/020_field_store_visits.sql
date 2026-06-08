CREATE TABLE IF NOT EXISTS dsh_field_store_visits (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  field_agent_id TEXT,
  visit_summary TEXT NOT NULL,
  follow_up_action TEXT NOT NULL,
  evidence_media_keys TEXT NOT NULL DEFAULT '',
  location_confidence TEXT,
  status TEXT NOT NULL CHECK (status IN ('submitted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_field_store_visits_store
  ON dsh_field_store_visits (store_id, created_at DESC);
