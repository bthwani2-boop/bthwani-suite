CREATE TABLE IF NOT EXISTS dsh_store_discovery_stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  category_id TEXT,
  image_url TEXT,
  logo_image_url TEXT,
  rating NUMERIC(3, 2),
  distance_label TEXT NOT NULL,
  delivery_label TEXT NOT NULL,
  service_label TEXT NOT NULL,
  status_label TEXT NOT NULL,
  status_tone TEXT NOT NULL CHECK (status_tone IN ('open', 'closed')),
  has_offer BOOLEAN NOT NULL DEFAULT FALSE,
  offer_label TEXT,
  publish_stage TEXT NOT NULL,
  supports_pickup BOOLEAN NOT NULL DEFAULT FALSE,
  supports_partner_delivery BOOLEAN NOT NULL DEFAULT FALSE,
  search_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsh_store_discovery_category
  ON dsh_store_discovery_stores (category_id);

CREATE INDEX IF NOT EXISTS idx_dsh_store_discovery_status
  ON dsh_store_discovery_stores (publish_stage, status_tone, has_offer);
