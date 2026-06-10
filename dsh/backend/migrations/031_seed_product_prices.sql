-- 031: Seed base_price_minor_units for all dev-seeded catalog products
-- Rationale: migration 028 added the column with DEFAULT 0; this populates
-- the numeric values so checkout intent subtotals and order total_price are correct.
-- YER has no sub-unit in practice; 1 minor_unit = 1 YER (not sub-divided).

UPDATE dsh_catalog_products SET base_price_minor_units = 1800 WHERE id = 'item-apple-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 700  WHERE id = 'item-bread-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 3400 WHERE id = 'item-chicken-2';
UPDATE dsh_catalog_products SET base_price_minor_units = 1400 WHERE id = 'item-choco-2';
UPDATE dsh_catalog_products SET base_price_minor_units = 900  WHERE id = 'item-croissant-2';
UPDATE dsh_catalog_products SET base_price_minor_units = 1100 WHERE id = 'item-milk-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 2100 WHERE id = 'item-salad-2';
UPDATE dsh_catalog_products SET base_price_minor_units = 800  WHERE id = 'item-yogurt-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 1300 WHERE id = 'item-bagel-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 1600 WHERE id = 'item-cake-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 900  WHERE id = 'item-croissant-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 3400 WHERE id = 'item-chicken-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 2900 WHERE id = 'item-pasta-1';
UPDATE dsh_catalog_products SET base_price_minor_units = 2100 WHERE id = 'item-salad-1';
