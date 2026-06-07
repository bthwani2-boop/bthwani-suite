INSERT INTO dsh_catalog_categories (id, store_id, name, description)
VALUES ('cat-beverages-water', 'store-1001', 'Water & Beverages', 'Drinking water and beverages')
ON CONFLICT (id) DO NOTHING;
