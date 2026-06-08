-- Migration 018: Delivery Failure & Return (DSH-SLICE-005F)
-- Extends dsh_orders status constraint to include delivery failure and return states.
-- Adds wlt_refund_trigger_ref column: a WLT bridge reference stored by DSH only.
-- DSH does NOT execute refunds — WLT owns refund execution (004E).

-- Extend status constraint to include 005F states
ALTER TABLE dsh_orders DROP CONSTRAINT IF EXISTS dsh_orders_status_check;
ALTER TABLE dsh_orders ADD CONSTRAINT dsh_orders_status_check CHECK (
  status IN (
    'CREATED', 'ACCEPTED', 'READY_FOR_PICKUP',
    'DELIVERED', 'CANCELLED', 'REFUNDED',
    'ACCEPTED_BY_CAPTAIN', 'PICKED_UP',
    'EN_ROUTE', 'ARRIVED',
    'FAILED_DELIVERY', 'RETURNING_TO_STORE', 'RETURNED'
  )
);

-- Add failure reason column (set on FAILED_DELIVERY; NULL otherwise)
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS delivery_failure_reason TEXT;

-- Add WLT refund trigger reference (DSH stores bridge ref only; no financial mutation)
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS wlt_refund_trigger_ref TEXT;
