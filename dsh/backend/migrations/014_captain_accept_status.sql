-- Alter status check constraint on dsh_orders to include ACCEPTED_BY_CAPTAIN
ALTER TABLE dsh_orders DROP CONSTRAINT IF EXISTS dsh_orders_status_check;
ALTER TABLE dsh_orders ADD CONSTRAINT dsh_orders_status_check CHECK (status IN ('CREATED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'ACCEPTED_BY_CAPTAIN'));
