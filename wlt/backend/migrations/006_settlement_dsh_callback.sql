-- Migration 006: Settlement DSH callback tracking
-- Adds dsh_base_url and dsh_callback_sent_at to wlt_settlements so WLT can
-- deliver POST /orders/{order_id}/settlement-callback when a settlement completes.
-- Contract: wlt/domain/wallet.go Settlement.DshBaseURL / DshCallbackSentAt

ALTER TABLE wlt_settlements ADD COLUMN IF NOT EXISTS dsh_base_url        TEXT NOT NULL DEFAULT '';
ALTER TABLE wlt_settlements ADD COLUMN IF NOT EXISTS dsh_callback_sent_at TIMESTAMPTZ;
