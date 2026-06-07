-- Migration 004: WLT refunds
-- Initiated by operator or triggered by DSH delivery-failure event.
-- WLT owns refund decision and ledger mutation; DSH records wlt_refund_ref_id only.

CREATE TABLE IF NOT EXISTS wlt_refunds (
  id                    TEXT PRIMARY KEY,
  order_id              TEXT NOT NULL,               -- DSH order reference
  payment_session_id    TEXT NOT NULL DEFAULT '',    -- source payment session
  client_id             TEXT NOT NULL,
  amount                DOUBLE PRECISION NOT NULL CHECK (amount > 0),
  currency              TEXT NOT NULL DEFAULT 'YER',
  reason                TEXT NOT NULL DEFAULT '',
  status                TEXT NOT NULL DEFAULT 'PENDING',
  trigger_ref           TEXT,                        -- WltRefundTriggerRef from DSH (if delivery-failure path)
  dsh_base_url          TEXT NOT NULL DEFAULT '',    -- DSH base URL for callback delivery
  dsh_callback_sent_at  TIMESTAMPTZ,
  idempotency_key       TEXT NOT NULL UNIQUE,
  failure_reason        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at          TIMESTAMPTZ,
  CONSTRAINT wlt_refunds_status_check CHECK (
    status IN ('PENDING', 'PROCESSING', 'CONFIRMED', 'FAILED')
  )
);

CREATE INDEX IF NOT EXISTS idx_wlt_refunds_order_id   ON wlt_refunds (order_id);
CREATE INDEX IF NOT EXISTS idx_wlt_refunds_client_id  ON wlt_refunds (client_id);
CREATE INDEX IF NOT EXISTS idx_wlt_refunds_status     ON wlt_refunds (status);
