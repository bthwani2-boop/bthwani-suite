-- Migration 025: Remove financial columns from DSH orders table.
-- Drops refund_amount and settlement_amount columns since financial ownership is fully in WLT.

ALTER TABLE dsh_orders DROP COLUMN IF EXISTS refund_amount;
ALTER TABLE dsh_orders DROP COLUMN IF EXISTS settlement_amount;
