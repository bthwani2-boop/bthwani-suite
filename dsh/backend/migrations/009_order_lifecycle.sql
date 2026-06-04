CREATE TABLE IF NOT EXISTS dsh_orders (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES dsh_store_discovery_stores(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('CREATED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED')),
  total_price NUMERIC(10, 2) NOT NULL,
  wlt_payment_ref_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dsh_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES dsh_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES dsh_catalog_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS dsh_order_status_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES dsh_orders(id) ON DELETE CASCADE,
  actor TEXT NOT NULL CHECK (actor IN ('client', 'partner', 'captain', 'operator', 'system')),
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dsh_support_escalations (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES dsh_orders(id) ON DELETE CASCADE,
  actor TEXT NOT NULL CHECK (actor IN ('client', 'partner')),
  issue_type TEXT NOT NULL CHECK (issue_type IN ('delayed_delivery', 'wrong_items', 'missing_items', 'payment_issue', 'other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in-review', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_dsh_orders_store_id ON dsh_orders (store_id);
CREATE INDEX IF NOT EXISTS idx_dsh_orders_status ON dsh_orders (status);
CREATE INDEX IF NOT EXISTS idx_dsh_order_items_order_id ON dsh_order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_dsh_order_status_events_order_id ON dsh_order_status_events (order_id);
CREATE INDEX IF NOT EXISTS idx_dsh_support_escalations_order_id ON dsh_support_escalations (order_id);
CREATE INDEX IF NOT EXISTS idx_dsh_support_escalations_status ON dsh_support_escalations (status);
