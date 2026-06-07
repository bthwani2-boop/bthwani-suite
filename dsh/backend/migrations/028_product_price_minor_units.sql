-- 028: Add numeric price columns to products, overrides, and stores
-- Rationale: base_price_label is a display string only; checkout total computation
-- requires a machine-readable integer amount. WLT owns financial truth;
-- these columns are non-authoritative snapshots used for checkout intent pricing.

ALTER TABLE dsh_catalog_products
  ADD COLUMN IF NOT EXISTS base_price_minor_units BIGINT NOT NULL DEFAULT 0;

-- price_override_minor_units: numeric override, takes precedence over base_price_minor_units
-- when set. NULL means "no numeric override — use base".
ALTER TABLE dsh_catalog_overrides
  ADD COLUMN IF NOT EXISTS price_override_minor_units BIGINT;

-- delivery_fee_minor_units: per-store delivery fee default (1500 YER).
-- For future: stores may negotiate different delivery fees.
ALTER TABLE dsh_store_discovery_stores
  ADD COLUMN IF NOT EXISTS delivery_fee_minor_units BIGINT NOT NULL DEFAULT 1500;

COMMENT ON COLUMN dsh_catalog_products.base_price_minor_units
  IS 'Display-only price snapshot in YER minor units (1 unit = 1 YER). Non-authoritative — WLT owns financial truth.';

COMMENT ON COLUMN dsh_catalog_overrides.price_override_minor_units
  IS 'Numeric price override in YER minor units. NULL = use base_price_minor_units.';

COMMENT ON COLUMN dsh_store_discovery_stores.delivery_fee_minor_units
  IS 'Default delivery fee in YER minor units for bthwani_delivery mode. 0 for pickup.';
