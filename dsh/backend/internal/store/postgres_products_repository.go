package store

import (
	"bufio"
	"context"
	"database/sql"
	"fmt"
	"os"
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
	if err != nil {
		return domain.ProductRecord{}, err
	}
	media, err := repo.ListProductMedia(ctx, productID)
	if err == nil {
		record.Media = media
	}
	return record, nil
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
		media, err := repo.ListProductMedia(ctx, record.ID)
		if err == nil {
			record.Media = media
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

var manifestMap map[string]string

func loadManifest() map[string]string {
	if manifestMap != nil {
		return manifestMap
	}
	paths := []string{
		"../frontend/media-fixtures/MANIFEST.local-required.tsv",
		"../../frontend/media-fixtures/MANIFEST.local-required.tsv",
		"dsh/frontend/media-fixtures/MANIFEST.local-required.tsv",
		"frontend/media-fixtures/MANIFEST.local-required.tsv",
		"media-fixtures/MANIFEST.local-required.tsv",
	}
	var file *os.File
	var err error
	for _, p := range paths {
		file, err = os.Open(p)
		if err == nil {
			break
		}
	}
	if err != nil {
		return make(map[string]string)
	}
	defer file.Close()

	m := make(map[string]string)
	scanner := bufio.NewScanner(file)
	if scanner.Scan() {
		for scanner.Scan() {
			line := scanner.Text()
			parts := strings.Split(line, "\t")
			if len(parts) >= 2 {
				m[parts[0]] = parts[1]
			}
		}
	}
	manifestMap = m
	return manifestMap
}

func GetMediaURL(mediaKey string) string {
	m := loadManifest()
	relPath, exists := m[mediaKey]
	if !exists {
		return ""
	}
	return "/media-fixtures/" + relPath
}

func (repo *PostgresRepository) CreateProductMedia(ctx context.Context, req domain.UploadProductMediaRequest) (domain.ProductMediaRecord, error) {
	id := fmt.Sprintf("med-%d", time.Now().UnixNano())
	url := GetMediaURL(req.MediaKey)
	if url == "" {
		return domain.ProductMediaRecord{}, fmt.Errorf("invalid or unregistered media key: %s", req.MediaKey)
	}

	query := `
INSERT INTO dsh_catalog_product_media (id, product_id, media_key, url, created_at)
VALUES ($1, $2, $3, $4, NOW())
RETURNING id, product_id, media_key, url, created_at`

	row := repo.db.QueryRowContext(ctx, query, id, req.ProductID, req.MediaKey, url)
	var rec domain.ProductMediaRecord
	err := row.Scan(&rec.ID, &rec.ProductID, &rec.MediaKey, &rec.URL, &rec.CreatedAt)
	return rec, err
}

func (repo *PostgresRepository) DeleteProductMedia(ctx context.Context, id string) error {
	query := `DELETE FROM dsh_catalog_product_media WHERE id = $1`
	res, err := repo.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("media record not found")
	}
	return nil
}

func (repo *PostgresRepository) ListProductMedia(ctx context.Context, productID string) ([]domain.ProductMediaRecord, error) {
	query := `
SELECT id, product_id, media_key, url, created_at
FROM dsh_catalog_product_media
WHERE product_id = $1
ORDER BY created_at ASC`

	rows, err := repo.db.QueryContext(ctx, query, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.ProductMediaRecord
	for rows.Next() {
		var rec domain.ProductMediaRecord
		if err := rows.Scan(&rec.ID, &rec.ProductID, &rec.MediaKey, &rec.URL, &rec.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, rec)
	}
	return list, rows.Err()
}
