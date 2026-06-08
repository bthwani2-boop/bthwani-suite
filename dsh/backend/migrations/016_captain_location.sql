-- Alter status check constraint on dsh_orders to include EN_ROUTE and ARRIVED
ALTER TABLE dsh_orders DROP CONSTRAINT IF EXISTS dsh_orders_status_check;
ALTER TABLE dsh_orders ADD CONSTRAINT dsh_orders_status_check CHECK (status IN ('CREATED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'ACCEPTED_BY_CAPTAIN', 'PICKED_UP', 'EN_ROUTE', 'ARRIVED'));

-- Add location tracking columns to dsh_orders
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS captain_latitude DOUBLE PRECISION;
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS captain_longitude DOUBLE PRECISION;
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS captain_lifecycle_status TEXT;
