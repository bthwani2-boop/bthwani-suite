-- DSH-SLICE-006D: Field Readiness Escalation
-- Tracks escalations raised by field agents for incomplete/blocked store readiness submissions.
-- CP operator reviews and resolves escalations; no financial mutation (WLT boundary).
CREATE TABLE IF NOT EXISTS dsh_field_readiness_escalations (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  field_agent_id TEXT,
  reason TEXT NOT NULL,
  target_team TEXT NOT NULL CHECK (target_team IN ('partner-management', 'control-panel', 'marketing')),
  status TEXT NOT NULL CHECK (status IN ('escalated', 'info_requested', 'resolved', 'rejected')),
  operator_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_field_readiness_escalations_store
  ON dsh_field_readiness_escalations (store_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dsh_field_readiness_escalations_status
  ON dsh_field_readiness_escalations (status, created_at DESC);
