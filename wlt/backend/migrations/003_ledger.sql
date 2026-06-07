-- Migration 003: WLT ledger
-- Immutable financial event log. One row per financial event.
-- WLT is the sole writer; DSH and other services are read-only consumers via WLT API.

CREATE TABLE IF NOT EXISTS wlt_ledger (
  id               TEXT PRIMARY KEY,
  wallet_id        TEXT NOT NULL REFERENCES wlt_wallets (id),
  subject          TEXT NOT NULL,
  transaction_type TEXT NOT NULL,   -- CREDIT | DEBIT
  amount           DOUBLE PRECISION NOT NULL CHECK (amount > 0),
  currency         TEXT NOT NULL DEFAULT 'YER',
  reference_type   TEXT NOT NULL,   -- payment_session | refund | settlement
  reference_id     TEXT NOT NULL,
  order_id         TEXT,            -- DSH order reference (nullable)
  description      TEXT NOT NULL DEFAULT '',
  status           TEXT NOT NULL DEFAULT 'PENDING',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  CONSTRAINT wlt_ledger_tx_type_check CHECK (
    transaction_type IN ('CREDIT', 'DEBIT')
  ),
  CONSTRAINT wlt_ledger_status_check CHECK (
    status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')
  )
);

CREATE INDEX IF NOT EXISTS idx_wlt_ledger_subject      ON wlt_ledger (subject);
CREATE INDEX IF NOT EXISTS idx_wlt_ledger_wallet_id    ON wlt_ledger (wallet_id);
CREATE INDEX IF NOT EXISTS idx_wlt_ledger_reference_id ON wlt_ledger (reference_id);
CREATE INDEX IF NOT EXISTS idx_wlt_ledger_order_id     ON wlt_ledger (order_id);
CREATE INDEX IF NOT EXISTS idx_wlt_ledger_created_at   ON wlt_ledger (created_at DESC);
