CREATE TABLE IF NOT EXISTS dsh_catalog_approvals (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'needs-fix')),
  note TEXT,
  operator_id TEXT NOT NULL DEFAULT 'operator-1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_catalog_approvals_item ON dsh_catalog_approvals (item_id);
