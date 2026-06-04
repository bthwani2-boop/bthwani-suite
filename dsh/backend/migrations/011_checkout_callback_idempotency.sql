-- J-003 / DSH-SLICE-003C: WLT callback replay protection
-- wlt_callback_event_id stores the X-WLT-Event-Id header value from the first
-- accepted callback. The UNIQUE constraint ensures that a duplicate event_id
-- (replay attack or WLT retry) is rejected at the DB level.
-- The column is NULL until the first callback is processed for an intent.

ALTER TABLE dsh_checkout_intents
  ADD COLUMN IF NOT EXISTS wlt_callback_event_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dsh_checkout_intents_callback_event_id
  ON dsh_checkout_intents (wlt_callback_event_id)
  WHERE wlt_callback_event_id IS NOT NULL;
