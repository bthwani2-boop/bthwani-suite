-- Migration 017: Proof of Delivery (DSH-SLICE-005E)
-- Adds pod_media_key column to dsh_orders for proof-of-delivery media reference.
-- Status constraint already includes DELIVERED from migration 009.
-- This migration is additive-only; no existing data is modified.

-- Add proof-of-delivery media key column (nullable; populated only on delivery)
ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS pod_media_key TEXT;
