-- Migration 026: Performance indexes for high-frequency filter columns.
--
-- Gaps addressed:
--   client_id       — ListOrders filters by client_id on every client request.
--   captain_id      — Delivery queries (accept/pickup/deliver) filter by captain_id.
--   created_at DESC — All paginated list queries ORDER BY created_at DESC.
--   checkout_intent_id — CreateOrder idempotency check (already UNIQUE via column, adding for scan speed).
--   wlt_settlement_ref_id — SettlementCallback looks up orders by settlement ref.
--   (client_id, status) — Composite covers the common pattern: client sees own orders by status.
--
-- All indexes use IF NOT EXISTS — safe to re-run.

-- dsh_orders: missing filter + sort indexes
CREATE INDEX IF NOT EXISTS idx_dsh_orders_client_id       ON dsh_orders (client_id);
CREATE INDEX IF NOT EXISTS idx_dsh_orders_captain_id      ON dsh_orders (captain_id);
CREATE INDEX IF NOT EXISTS idx_dsh_orders_created_at_desc ON dsh_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dsh_orders_settlement_ref  ON dsh_orders (wlt_settlement_ref_id) WHERE wlt_settlement_ref_id IS NOT NULL;

-- Composite: client viewing own orders filtered by status (app-client list pattern)
CREATE INDEX IF NOT EXISTS idx_dsh_orders_client_status ON dsh_orders (client_id, status);

-- dsh_support_escalations: operator filtering across orders by created_at (J-009C list)
CREATE INDEX IF NOT EXISTS idx_dsh_support_escalations_created_at ON dsh_support_escalations (created_at DESC);

-- dsh_field_readiness_escalations: status + store filter (J-006D CP view)
CREATE INDEX IF NOT EXISTS idx_dsh_field_readiness_esc_created ON dsh_field_readiness_escalations (created_at DESC);
