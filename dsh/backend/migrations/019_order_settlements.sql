-- Migration 019: Order Settlements (DSH-SLICE-010B)
-- Adds settlement status, settlement ref ID and settlement amount to dsh_orders.
-- DSH does NOT compute or execute settlements; WLT owns final accounting and mutations.

ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS wlt_settlement_ref_id TEXT;
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS settlement_status TEXT DEFAULT 'NOT_SETTLED';
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS settlement_amount DOUBLE PRECISION;

-- Add check constraint for settlement status
ALTER TABLE dsh_orders DROP CONSTRAINT IF EXISTS dsh_orders_settlement_status_check;
ALTER TABLE dsh_orders ADD CONSTRAINT dsh_orders_settlement_status_check CHECK (
  settlement_status IN ('NOT_SETTLED', 'SETTLEMENT_PENDING', 'SETTLED', 'SETTLEMENT_FAILED')
);
