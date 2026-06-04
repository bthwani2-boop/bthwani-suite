package store

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"bthwani.local/dsh/domain"
)

// generateProductID generates a simple time-based product ID.
func generateProductID() string {
	return fmt.Sprintf("prod-%d", time.Now().UnixNano())
}

func (repo *PostgresRepository) CreateProduct(ctx context.Context, storeID string, req domain.CreateProductRequest) (domain.ProductRecord, error) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return domain.ProductRecord{}, fmt.Errorf("product name is required")
	}

	id := generateProductID()

	query := `
INSERT INTO dsh_catalog_products
  (id, store_id, name, sku, gtin, barcode, description, base_price_label, category_id, approval_status, created_at, updated_at)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'partner_submitted', NOW(), NOW())
RETURNING id, store_id, name, sku, gtin, barcode, description, base_price_label, category_id, approval_status, created_at, updated_at`

	row := repo.db.QueryRowContext(ctx, query,
		id, storeID, name,
		req.SKU, req.GTIN, req.Barcode, req.Description,
		strings.TrimSpace(req.BasePriceLabel),
		req.CategoryID,
	)

	return scanProductRow(row)
}

func (repo *PostgresRepository) UpdateProduct(ctx context.Context, productID string, req domain.UpdateProductRequest) (domain.ProductRecord, error) {
	sets := []string{"updated_at = NOW()"}
	args := []any{}

	if req.Name != nil {
		trimmed := strings.TrimSpace(*req.Name)
		if trimmed == "" {
			return domain.ProductRecord{}, fmt.Errorf("product name cannot be empty")
		}
		args = append(args, trimmed)
		sets = append(sets, fmt.Sprintf("name = $%d", len(args)))
	}
	if req.SKU != nil {
		args = append(args, req.SKU)
		sets = append(sets, fmt.Sprintf("sku = $%d", len(args)))
	}
	if req.GTIN != nil {
		args = append(args, req.GTIN)
		sets = append(sets, fmt.Sprintf("gtin = $%d", len(args)))
	}
	if req.Barcode != nil {
		args = append(args, req.Barcode)
		sets = append(sets, fmt.Sprintf("barcode = $%d", len(args)))
	}
	if req.Description != nil {
		args = append(args, req.Description)
		sets = append(sets, fmt.Sprintf("description = $%d", len(args)))
	}
	if req.BasePriceLabel != nil {
		args = append(args, strings.TrimSpace(*req.BasePriceLabel))
		sets = append(sets, fmt.Sprintf("base_price_label = $%d", len(args)))
	}
	if req.CategoryID != nil {
		args = append(args, req.CategoryID)
		sets = append(sets, fmt.Sprintf("category_id = $%d", len(args)))
	}

	args = append(args, productID)
	idPlaceholder := len(args)

	query := fmt.Sprintf(`
UPDATE dsh_catalog_products SET %s
WHERE id = $%d
RETURNING id, store_id, name, sku, gtin, barcode, description, base_price_label, category_id, approval_status, created_at, updated_at`,
		strings.Join(sets, ", "), idPlaceholder)

	row := repo.db.QueryRowContext(ctx, query, args...)
	record, err := scanProductRow(row)
	if err == sql.ErrNoRows {
		return domain.ProductRecord{}, fmt.Errorf("product not found")
	}
	return record, err
}

func (repo *PostgresRepository) GetProduct(ctx context.Context, productID string) (domain.ProductRecord, error) {
	query := `
SELECT id, store_id, name, sku, gtin, barcode, description, base_price_label, category_id, approval_status, created_at, updated_at
FROM dsh_catalog_products
WHERE id = $1`

	row := repo.db.QueryRowContext(ctx, query, productID)
	record, err := scanProductRow(row)
	if err == sql.ErrNoRows {
		return domain.ProductRecord{}, fmt.Errorf("product not found")
	}
	return record, err
}

func (repo *PostgresRepository) ListProducts(ctx context.Context, storeID string, limit int, offset int) (domain.ListProductsResponse, error) {
	countQuery := `SELECT COUNT(*) FROM dsh_catalog_products WHERE store_id = $1`
	var total int
	if err := repo.db.QueryRowContext(ctx, countQuery, storeID).Scan(&total); err != nil {
		return domain.ListProductsResponse{}, err
	}

	query := `
SELECT id, store_id, name, sku, gtin, barcode, description, base_price_label, category_id, approval_status, created_at, updated_at
FROM dsh_catalog_products
WHERE store_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3`

	rows, err := repo.db.QueryContext(ctx, query, storeID, limit, offset)
	if err != nil {
		return domain.ListProductsResponse{}, err
	}
	defer rows.Close()

	products := []domain.ProductRecord{}
	for rows.Next() {
		record, err := scanProductRowColumns(rows)
		if err != nil {
			return domain.ListProductsResponse{}, err
		}
		products = append(products, record)
	}
	if err := rows.Err(); err != nil {
		return domain.ListProductsResponse{}, err
	}

	return domain.ListProductsResponse{
		Products: products,
		Pagination: domain.Pagination{
			Limit:  limit,
			Offset: offset,
			Total:  total,
		},
	}, nil
}

// scanProductRow scans a *sql.Row into a ProductRecord.
func scanProductRow(row *sql.Row) (domain.ProductRecord, error) {
	var r domain.ProductRecord
	var sku, gtin, barcode, description, categoryID sql.NullString
	err := row.Scan(
		&r.ID, &r.StoreID, &r.Name,
		&sku, &gtin, &barcode, &description,
		&r.BasePriceLabel, &categoryID,
		&r.ApprovalStatus,
		&r.CreatedAt, &r.UpdatedAt,
	)
	if err != nil {
		return domain.ProductRecord{}, err
	}
	if sku.Valid {
		r.SKU = &sku.String
	}
	if gtin.Valid {
		r.GTIN = &gtin.String
	}
	if barcode.Valid {
		r.Barcode = &barcode.String
	}
	if description.Valid {
		r.Description = &description.String
	}
	if categoryID.Valid {
		r.CategoryID = &categoryID.String
	}
	return r, nil
}

// scanProductRowColumns scans a *sql.Rows into a ProductRecord.
func scanProductRowColumns(rows *sql.Rows) (domain.ProductRecord, error) {
	var r domain.ProductRecord
	var sku, gtin, barcode, description, categoryID sql.NullString
	err := rows.Scan(
		&r.ID, &r.StoreID, &r.Name,
		&sku, &gtin, &barcode, &description,
		&r.BasePriceLabel, &categoryID,
		&r.ApprovalStatus,
		&r.CreatedAt, &r.UpdatedAt,
	)
	if err != nil {
		return domain.ProductRecord{}, err
	}
	if sku.Valid {
		r.SKU = &sku.String
	}
	if gtin.Valid {
		r.GTIN = &gtin.String
	}
	if barcode.Valid {
		r.Barcode = &barcode.String
	}
	if description.Valid {
		r.Description = &description.String
	}
	if categoryID.Valid {
		r.CategoryID = &categoryID.String
	}
	return r, nil
}
