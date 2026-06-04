-- J-003 Checkout Intent tables
-- DSH owns the operational session; WLT owns the financial decision.
-- wlt_payment_ref_id is stored as operational reference only — no financial mutation in DSH.

CREATE TABLE IF NOT EXISTS dsh_checkout_intents (
  id                        TEXT PRIMARY KEY,
  client_id                 TEXT NOT NULL,
  store_id                  TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id),
  delivery_address          TEXT NOT NULL,
  delivery_time_slot        TEXT,
  client_note               TEXT,
  status                    TEXT NOT NULL CHECK (status IN (
                              'pending_payment',
                              'payment_confirmed',
                              'payment_failed',
                              'cancelled',
                              'expired'
                            )),
  session_token             TEXT NOT NULL UNIQUE,
  requested_amount_minor_units BIGINT NOT NULL DEFAULT 0,
  wlt_payment_ref_id        TEXT,
  failure_reason            TEXT CHECK (failure_reason IN (
                              'insufficient_balance',
                              'policy_block',
                              'fraud_hold',
                              'expired',
                              NULL
                            )),
  expires_at                TIMESTAMPTZ NOT NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dsh_checkout_intent_items (
  id         TEXT PRIMARY KEY,
  intent_id  TEXT NOT NULL REFERENCES dsh_checkout_intents(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_checkout_intents_client
  ON dsh_checkout_intents (client_id, status);
CREATE INDEX IF NOT EXISTS idx_dsh_checkout_intents_token
  ON dsh_checkout_intents (session_token);
CREATE INDEX IF NOT EXISTS idx_dsh_checkout_intents_store
  ON dsh_checkout_intents (store_id);
CREATE INDEX IF NOT EXISTS idx_dsh_checkout_intent_items_intent
  ON dsh_checkout_intent_items (intent_id);
