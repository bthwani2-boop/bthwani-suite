-- Migration 024: Link orders with checkout intent and enforce idempotency.
-- Adds checkout_intent_id to dsh_orders with UNIQUE constraint to prevent duplicate order creation.

ALTER TABLE dsh_orders ADD COLUMN IF NOT EXISTS checkout_intent_id TEXT UNIQUE REFERENCES dsh_checkout_intents(id);
