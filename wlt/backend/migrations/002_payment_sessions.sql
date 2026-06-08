-- Migration 002: WLT payment sessions
-- Created by DSH checkout intent flow. WLT owns payment state;
-- DSH receives wlt_payment_ref_id (= session id) via callback.

CREATE TABLE IF NOT EXISTS wlt_payment_sessions (
  id                 TEXT PRIMARY KEY,
  checkout_intent_id TEXT NOT NULL,              -- DSH checkout intent reference
  client_id          TEXT NOT NULL,
  amount             DOUBLE PRECISION NOT NULL CHECK (amount > 0),
  currency           TEXT NOT NULL DEFAULT 'YER',
  status             TEXT NOT NULL DEFAULT 'PENDING',
  payment_method     TEXT NOT NULL DEFAULT 'wallet',
  provider_ref       TEXT,                       -- payment provider external reference
  dsh_base_url       TEXT NOT NULL DEFAULT '',   -- DSH base URL for callback delivery
  idempotency_key    TEXT NOT NULL UNIQUE,
  failure_reason     TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at         TIMESTAMPTZ NOT NULL,
  confirmed_at       TIMESTAMPTZ,
  failed_at          TIMESTAMPTZ,
  CONSTRAINT wlt_payment_sessions_status_check CHECK (
    status IN ('PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED', 'CANCELLED')
  )
);

CREATE INDEX IF NOT EXISTS idx_wlt_payment_sessions_checkout_intent
  ON wlt_payment_sessions (checkout_intent_id);
CREATE INDEX IF NOT EXISTS idx_wlt_payment_sessions_client
  ON wlt_payment_sessions (client_id);
CREATE INDEX IF NOT EXISTS idx_wlt_payment_sessions_status
  ON wlt_payment_sessions (status);
