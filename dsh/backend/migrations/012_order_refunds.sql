-- Alter status check constraint on dsh_orders to include REFUNDED
ALTER TABLE dsh_orders DROP CONSTRAINT IF EXISTS dsh_orders_status_check;
ALTER TABLE dsh_orders ADD CONSTRAINT dsh_orders_status_check CHECK (status IN ('CREATED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED', 'REFUNDED'));

-- Add refund tracking columns
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS wlt_refund_ref_id TEXT;
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10, 2);
