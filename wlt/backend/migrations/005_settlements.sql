-- Migration 005: WLT settlements
-- Financial clearing after a successful delivery: captain payout + partner revenue.
-- WLT computes all amounts; DSH records wlt_settlement_ref_id and settlement_status only.

CREATE TABLE IF NOT EXISTS wlt_settlements (
  id              TEXT PRIMARY KEY,
  order_id        TEXT NOT NULL UNIQUE,            -- DSH order reference (one settlement per order)
  partner_id      TEXT NOT NULL,
  captain_id      TEXT,
  gross_amount    DOUBLE PRECISION NOT NULL CHECK (gross_amount > 0),
  platform_fee    DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
  partner_payout  DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (partner_payout >= 0),
  captain_payout  DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (captain_payout >= 0),
  currency        TEXT NOT NULL DEFAULT 'YER',
  status          TEXT NOT NULL DEFAULT 'PENDING',
  idempotency_key TEXT NOT NULL UNIQUE,
  failure_reason  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  CONSTRAINT wlt_settlements_status_check CHECK (
    status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')
  )
);

CREATE INDEX IF NOT EXISTS idx_wlt_settlements_partner_id ON wlt_settlements (partner_id);
CREATE INDEX IF NOT EXISTS idx_wlt_settlements_captain_id ON wlt_settlements (captain_id);
CREATE INDEX IF NOT EXISTS idx_wlt_settlements_status     ON wlt_settlements (status);
CREATE INDEX IF NOT EXISTS idx_wlt_settlements_created_at ON wlt_settlements (created_at DESC);
