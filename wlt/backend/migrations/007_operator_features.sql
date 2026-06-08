-- Migration 007: WLT Operator features
-- Includes reconciliation runs, payout decisions, daily close, and callback/audit events.

CREATE TABLE IF NOT EXISTS wlt_reconciliation_runs (
  id              TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'passed',
  entry_count     INTEGER NOT NULL DEFAULT 0,
  total_debit     DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  total_credit    DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wlt_payout_decisions (
  id                  TEXT PRIMARY KEY,
  owner_id            TEXT NOT NULL,
  owner_kind          TEXT NOT NULL,          -- partner | captain | field
  settlement_cycle_id TEXT NOT NULL,
  amount              DOUBLE PRECISION NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'YER',
  status              TEXT NOT NULL DEFAULT 'approved',
  idempotency_key     TEXT UNIQUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wlt_finance_close (
  id                    TEXT PRIMARY KEY,
  business_date         TEXT NOT NULL UNIQUE,
  status                TEXT NOT NULL DEFAULT 'open',
  reconciliation_run_id TEXT REFERENCES wlt_reconciliation_runs(id),
  closed_at             TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wlt_callback_events (
  id              TEXT PRIMARY KEY,
  idempotency_key TEXT,
  target          TEXT NOT NULL,
  payload         TEXT NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wlt_reconciliation_runs_created ON wlt_reconciliation_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wlt_payout_decisions_owner ON wlt_payout_decisions(owner_id, owner_kind);
CREATE INDEX IF NOT EXISTS idx_wlt_finance_close_date ON wlt_finance_close(business_date);
CREATE INDEX IF NOT EXISTS idx_wlt_callback_events_created ON wlt_callback_events(created_at DESC);
