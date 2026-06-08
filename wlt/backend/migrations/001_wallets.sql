-- Migration 001: WLT wallets
-- Financial accounts for platform actors (client, captain, partner).
-- WLT owns balance; DSH records ref IDs only.

CREATE TABLE IF NOT EXISTS wlt_wallets (
  id          TEXT PRIMARY KEY,
  subject     TEXT NOT NULL UNIQUE,     -- actor identity (matches DSH client_id / captain_id / partner_id)
  actor_type  TEXT NOT NULL,            -- client | captain | partner | field
  balance     DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (balance >= 0),
  currency    TEXT NOT NULL DEFAULT 'YER',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wlt_wallets_subject ON wlt_wallets (subject);
