-- Add captain_id column to orders table for J-005 Delivery Execution
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS captain_id TEXT;
