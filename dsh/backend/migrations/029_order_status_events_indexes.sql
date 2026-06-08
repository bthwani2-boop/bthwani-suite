-- Migration 029: Performance indexes for order status events table.
--
-- Rationale:
--   GET /orders/{id}/events and UpdateOrderStatus query by order_id, sorted by created_at.
--   Adding idx_dsh_order_status_events_order_id helps avoid full table scans.
--

CREATE INDEX IF NOT EXISTS idx_dsh_order_status_events_order_id
  ON dsh_order_status_events (order_id);

CREATE INDEX IF NOT EXISTS idx_dsh_order_status_events_created_at
  ON dsh_order_status_events (order_id, created_at ASC);
