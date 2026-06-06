-- DSH-SLICE-006E: Field Readiness Approval
-- CP operator formally approves (or rejects) a store's readiness package.
-- Approval triggers eligibility for partner-readiness gate toggle (J-001C).
-- No financial mutation (WLT boundary).
CREATE TABLE IF NOT EXISTS dsh_field_readiness_approvals (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  operator_id TEXT,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_field_readiness_approvals_store
  ON dsh_field_readiness_approvals (store_id, created_at DESC);
