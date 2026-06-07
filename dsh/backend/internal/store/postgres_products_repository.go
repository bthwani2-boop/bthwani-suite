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
SELECT p.id, p.store_id, p.name, p.sku, p.gtin, p.barcode, p.description, p.base_price_label, p.category_id, p.approval_status, p.created_at, p.updated_at,
       o.price_override, o.stock_override, o.available_override
FROM dsh_catalog_products p
LEFT JOIN dsh_catalog_overrides o ON p.store_id = o.store_id AND p.id = o.product_id
WHERE p.id = $1`

	row := repo.db.QueryRowContext(ctx, query, productID)
	record, err := scanProductRowWithOverrides(row)
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

func (repo *PostgresRepository) ListProducts(ctx context.Context, storeID string, approvalStatus string, limit int, offset int) (domain.ListProductsResponse, error) {
	where := []string{"store_id = $1"}
	args := []any{storeID}

	if approvalStatus != "" {
		args = append(args, approvalStatus)
		where = append(where, fmt.Sprintf("approval_status = $%d", len(args)))
	}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM dsh_catalog_products WHERE %s`, strings.Join(where, " AND "))
	var total int
	if err := repo.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return domain.ListProductsResponse{}, err
	}

	args = append(args, limit)
	limitPlaceholder := len(args)
	args = append(args, offset)
	offsetPlaceholder := len(args)

	query := fmt.Sprintf(`
SELECT p.id, p.store_id, p.name, p.sku, p.gtin, p.barcode, p.description, p.base_price_label, p.category_id, p.approval_status, p.created_at, p.updated_at,
       o.price_override, o.stock_override, o.available_override
FROM dsh_catalog_products p
LEFT JOIN dsh_catalog_overrides o ON p.store_id = o.store_id AND p.id = o.product_id
WHERE p.%s
ORDER BY p.created_at DESC
LIMIT $%d OFFSET $%d`, strings.Join(where, " AND p."), limitPlaceholder, offsetPlaceholder)

	rows, err := repo.db.QueryContext(ctx, query, args...)
	if err != nil {
		return domain.ListProductsResponse{}, err
	}
	defer rows.Close()

	products := []domain.ProductRecord{}
	productIDs := []string{}
	for rows.Next() {
		record, err := scanProductRowColumnsWithOverrides(rows)
		if err != nil {
			return domain.ListProductsResponse{}, err
		}
		products = append(products, record)
		productIDs = append(productIDs, record.ID)
	}
	if err := rows.Err(); err != nil {
		return domain.ListProductsResponse{}, err
	}
	if mediaByProductID, err := repo.listProductMediaByProductIDs(ctx, productIDs); err == nil {
		for i := range products {
			products[i].Media = mediaByProductID[products[i].ID]
		}
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

func (repo *PostgresRepository) listProductMediaByProductIDs(ctx context.Context, productIDs []string) (map[string][]domain.ProductMediaRecord, error) {
	result := make(map[string][]domain.ProductMediaRecord, len(productIDs))
	if len(productIDs) == 0 {
		return result, nil
	}

	args := make([]any, 0, len(productIDs))
	placeholders := make([]string, 0, len(productIDs))
	for i, id := range productIDs {
		args = append(args, id)
		placeholders = append(placeholders, fmt.Sprintf("$%d", i+1))
	}

	query := fmt.Sprintf(`
SELECT id, product_id, media_key, url, created_at
FROM dsh_catalog_product_media
WHERE product_id IN (%s)
ORDER BY product_id ASC, created_at ASC`, strings.Join(placeholders, ", "))

	rows, err := repo.db.QueryContext(ctx, query, args...)
	if err != nil {
		return result, err
	}
	defer rows.Close()

	for rows.Next() {
		var rec domain.ProductMediaRecord
		if err := rows.Scan(&rec.ID, &rec.ProductID, &rec.MediaKey, &rec.URL, &rec.CreatedAt); err != nil {
			return result, err
		}
		result[rec.ProductID] = append(result[rec.ProductID], rec)
	}
	return result, rows.Err()
}

func (repo *PostgresRepository) UpdateCatalogOverrides(ctx context.Context, storeID string, req domain.UpdateCatalogOverridesRequest) (domain.UpdateCatalogOverridesResponse, error) {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.UpdateCatalogOverridesResponse{}, err
	}
	defer tx.Rollback()

	var records []domain.CatalogOverrideRecord
	updatedCount := 0

	for _, item := range req.Overrides {
		query := `
INSERT INTO dsh_catalog_overrides (store_id, product_id, price_override, stock_override, available_override, updated_at)
VALUES ($1, $2, $3, $4, $5, NOW())
ON CONFLICT (store_id, product_id)
DO UPDATE SET
  price_override = COALESCE(EXCLUDED.price_override, dsh_catalog_overrides.price_override),
  stock_override = COALESCE(EXCLUDED.stock_override, dsh_catalog_overrides.stock_override),
  available_override = COALESCE(EXCLUDED.available_override, dsh_catalog_overrides.available_override),
  updated_at = NOW()
RETURNING store_id, product_id, price_override, stock_override, available_override, updated_at`

		row := tx.QueryRowContext(ctx, query,
			storeID, item.ProductID,
			item.PriceOverride, item.StockOverride, item.AvailableOverride,
		)

		var rec domain.CatalogOverrideRecord
		var price sql.NullString
		var stock sql.NullInt64
		var avail sql.NullBool
		if err := row.Scan(&rec.StoreID, &rec.ProductID, &price, &stock, &avail, &rec.UpdatedAt); err != nil {
			return domain.UpdateCatalogOverridesResponse{}, err
		}

		if price.Valid {
			rec.PriceOverride = &price.String
		}
		if stock.Valid {
			val := int(stock.Int64)
			rec.StockOverride = &val
		}
		if avail.Valid {
			val := avail.Bool
			rec.AvailableOverride = &val
		}

		// Conflict Detection and Generation
		var prodName string
		var basePrice string
		err = tx.QueryRowContext(ctx, "SELECT name, base_price_label FROM dsh_catalog_products WHERE id = $1", item.ProductID).Scan(&prodName, &basePrice)
		if err != nil {
			return domain.UpdateCatalogOverridesResponse{}, err
		}

		// Handle Price Override Conflict
		if item.PriceOverride != nil {
			pOverride := *item.PriceOverride
			if pOverride != basePrice {
				conflictID := fmt.Sprintf("conflict-%s-%s-price", storeID, item.ProductID)
				conflictQuery := `
INSERT INTO dsh_catalog_conflicts (id, store_id, product_id, conflict_type, central_value, override_value, status, created_at)
VALUES ($1, $2, $3, 'price_divergence', $4, $5, 'pending', NOW())
ON CONFLICT (id) DO UPDATE SET
  override_value = EXCLUDED.override_value,
  status = 'pending',
  resolved_at = NULL`
				_, err = tx.ExecContext(ctx, conflictQuery, conflictID, storeID, item.ProductID, basePrice, pOverride)
				if err != nil {
					return domain.UpdateCatalogOverridesResponse{}, err
				}
			} else {
				_, err = tx.ExecContext(ctx, `
UPDATE dsh_catalog_conflicts
SET status = 'resolved_reverted', resolved_at = NOW()
WHERE store_id = $1 AND product_id = $2 AND conflict_type = 'price_divergence' AND status = 'pending'`,
					storeID, item.ProductID)
				if err != nil {
					return domain.UpdateCatalogOverridesResponse{}, err
				}
			}
		}

		// Handle Availability Override Conflict
		if item.AvailableOverride != nil {
			availOverride := *item.AvailableOverride
			if !availOverride {
				conflictID := fmt.Sprintf("conflict-%s-%s-availability", storeID, item.ProductID)
				conflictQuery := `
INSERT INTO dsh_catalog_conflicts (id, store_id, product_id, conflict_type, central_value, override_value, status, created_at)
VALUES ($1, $2, $3, 'availability_divergence', 'true', 'false', 'pending', NOW())
ON CONFLICT (id) DO UPDATE SET
  override_value = EXCLUDED.override_value,
  status = 'pending',
  resolved_at = NULL`
				_, err = tx.ExecContext(ctx, conflictQuery, conflictID, storeID, item.ProductID)
				if err != nil {
					return domain.UpdateCatalogOverridesResponse{}, err
				}
			} else {
				_, err = tx.ExecContext(ctx, `
UPDATE dsh_catalog_conflicts
SET status = 'resolved_reverted', resolved_at = NOW()
WHERE store_id = $1 AND product_id = $2 AND conflict_type = 'availability_divergence' AND status = 'pending'`,
					storeID, item.ProductID)
				if err != nil {
					return domain.UpdateCatalogOverridesResponse{}, err
				}
			}
		}

		records = append(records, rec)
		updatedCount++
	}

	if err := tx.Commit(); err != nil {
		return domain.UpdateCatalogOverridesResponse{}, err
	}

	return domain.UpdateCatalogOverridesResponse{
		StoreID:      storeID,
		UpdatedCount: updatedCount,
		Overrides:    records,
	}, nil
}

func (repo *PostgresRepository) GetCatalogOverrides(ctx context.Context, storeID string) ([]domain.CatalogOverrideRecord, error) {
	query := `
SELECT store_id, product_id, price_override, stock_override, available_override, updated_at
FROM dsh_catalog_overrides
WHERE store_id = $1`

	rows, err := repo.db.QueryContext(ctx, query, storeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.CatalogOverrideRecord
	for rows.Next() {
		var rec domain.CatalogOverrideRecord
		var price sql.NullString
		var stock sql.NullInt64
		var avail sql.NullBool
		if err := rows.Scan(&rec.StoreID, &rec.ProductID, &price, &stock, &avail, &rec.UpdatedAt); err != nil {
			return nil, err
		}

		if price.Valid {
			rec.PriceOverride = &price.String
		}
		if stock.Valid {
			val := int(stock.Int64)
			rec.StockOverride = &val
		}
		if avail.Valid {
			val := avail.Bool
			rec.AvailableOverride = &val
		}
		list = append(list, rec)
	}
	return list, rows.Err()
}

func scanProductRowWithOverrides(row *sql.Row) (domain.ProductRecord, error) {
	var r domain.ProductRecord
	var sku, gtin, barcode, description, categoryID sql.NullString
	var priceOverride sql.NullString
	var stockOverride sql.NullInt64
	var availableOverride sql.NullBool
	err := row.Scan(
		&r.ID, &r.StoreID, &r.Name,
		&sku, &gtin, &barcode, &description,
		&r.BasePriceLabel, &categoryID,
		&r.ApprovalStatus,
		&r.CreatedAt, &r.UpdatedAt,
		&priceOverride, &stockOverride, &availableOverride,
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
	if priceOverride.Valid {
		r.PriceOverride = &priceOverride.String
	}
	if stockOverride.Valid {
		val := int(stockOverride.Int64)
		r.StockOverride = &val
	}
	if availableOverride.Valid {
		val := availableOverride.Bool
		r.AvailableOverride = &val
	}
	return r, nil
}

func scanProductRowColumnsWithOverrides(rows *sql.Rows) (domain.ProductRecord, error) {
	var r domain.ProductRecord
	var sku, gtin, barcode, description, categoryID sql.NullString
	var priceOverride sql.NullString
	var stockOverride sql.NullInt64
	var availableOverride sql.NullBool
	err := rows.Scan(
		&r.ID, &r.StoreID, &r.Name,
		&sku, &gtin, &barcode, &description,
		&r.BasePriceLabel, &categoryID,
		&r.ApprovalStatus,
		&r.CreatedAt, &r.UpdatedAt,
		&priceOverride, &stockOverride, &availableOverride,
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
	if priceOverride.Valid {
		r.PriceOverride = &priceOverride.String
	}
	if stockOverride.Valid {
		val := int(stockOverride.Int64)
		r.StockOverride = &val
	}
	if availableOverride.Valid {
		val := availableOverride.Bool
		r.AvailableOverride = &val
	}
	return r, nil
}

func (repo *PostgresRepository) CreateCatalogApproval(ctx context.Context, operatorID string, req domain.UpdateCatalogApprovalRequest) (domain.CatalogApprovalRecord, error) {
	var productStatus string
	switch req.Action {
	case "approve":
		productStatus = "catalog_adopted"
	case "reject":
		productStatus = "rejected"
	case "needs-fix":
		productStatus = "needs_fix"
	default:
		return domain.CatalogApprovalRecord{}, fmt.Errorf("invalid action: %s", req.Action)
	}

	if operatorID == "" {
		operatorID = "operator-1"
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.CatalogApprovalRecord{}, err
	}
	defer tx.Rollback()

	// Check if product exists in dsh_catalog_products
	var prodID string
	err = tx.QueryRowContext(ctx, "SELECT id FROM dsh_catalog_products WHERE id = $1", req.ItemID).Scan(&prodID)
	if err == nil {
		// Product exists, update its status
		_, err = tx.ExecContext(ctx, "UPDATE dsh_catalog_products SET approval_status = $1, updated_at = NOW() WHERE id = $2", productStatus, req.ItemID)
		if err != nil {
			return domain.CatalogApprovalRecord{}, fmt.Errorf("failed to update product approval status: %w", err)
		}
	} else if err != sql.ErrNoRows {
		return domain.CatalogApprovalRecord{}, fmt.Errorf("failed to check product existence: %w", err)
	}

	// Insert approval record
	approvalID := fmt.Sprintf("appr-%d", time.Now().UnixNano())
	var rec domain.CatalogApprovalRecord
	var note sql.NullString
	if req.Note != "" {
		note.String = req.Note
		note.Valid = true
	}

	query := `
INSERT INTO dsh_catalog_approvals (id, item_id, action, note, operator_id, created_at)
VALUES ($1, $2, $3, $4, $5, NOW())
RETURNING id, item_id, action, note, operator_id, created_at`

	row := tx.QueryRowContext(ctx, query, approvalID, req.ItemID, req.Action, note, operatorID)
	var dbNote sql.NullString
	if err := row.Scan(&rec.ID, &rec.ItemID, &rec.Action, &dbNote, &rec.OperatorID, &rec.CreatedAt); err != nil {
		return domain.CatalogApprovalRecord{}, fmt.Errorf("failed to insert approval record: %w", err)
	}
	if dbNote.Valid {
		rec.Note = dbNote.String
	}

	if err := tx.Commit(); err != nil {
		return domain.CatalogApprovalRecord{}, err
	}

	return rec, nil
}

func (repo *PostgresRepository) ListConflicts(ctx context.Context, storeID string, status string, limit int, offset int) (domain.ListConflictsResponse, error) {
	where := []string{"1 = 1"}
	args := []any{}

	if storeID != "" {
		args = append(args, storeID)
		where = append(where, fmt.Sprintf("c.store_id = $%d", len(args)))
	}

	if status != "" {
		args = append(args, status)
		where = append(where, fmt.Sprintf("c.status = $%d", len(args)))
	}

	countQuery := fmt.Sprintf(`
SELECT COUNT(*) FROM dsh_catalog_conflicts c
WHERE %s`, strings.Join(where, " AND "))

	var total int
	if err := repo.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return domain.ListConflictsResponse{}, err
	}

	args = append(args, limit)
	limitPlaceholder := len(args)
	args = append(args, offset)
	offsetPlaceholder := len(args)

	query := fmt.Sprintf(`
SELECT c.id, c.store_id, c.product_id, p.name, c.conflict_type, c.central_value, c.override_value, c.status, c.resolved_at, c.created_at
FROM dsh_catalog_conflicts c
JOIN dsh_catalog_products p ON c.product_id = p.id
WHERE %s
ORDER BY c.created_at DESC
LIMIT $%d OFFSET $%d`, strings.Join(where, " AND "), limitPlaceholder, offsetPlaceholder)

	rows, err := repo.db.QueryContext(ctx, query, args...)
	if err != nil {
		return domain.ListConflictsResponse{}, err
	}
	defer rows.Close()

	var conflicts []domain.CatalogConflict
	for rows.Next() {
		var c domain.CatalogConflict
		var resolvedAt sql.NullTime
		if err := rows.Scan(&c.ID, &c.StoreID, &c.ProductID, &c.ProductName, &c.ConflictType, &c.CentralValue, &c.OverrideValue, &c.Status, &resolvedAt, &c.CreatedAt); err != nil {
			return domain.ListConflictsResponse{}, err
		}
		if resolvedAt.Valid {
			c.ResolvedAt = &resolvedAt.Time
		}
		conflicts = append(conflicts, c)
	}

	return domain.ListConflictsResponse{
		Conflicts: conflicts,
		Limit:     limit,
		Offset:    offset,
		Total:     total,
	}, nil
}

func (repo *PostgresRepository) ResolveConflict(ctx context.Context, id string, req domain.ResolveConflictRequest) (domain.ResolveConflictResponse, error) {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.ResolveConflictResponse{}, err
	}
	defer tx.Rollback()

	var storeID string
	var productID string
	var conflictType string
	var status string
	err = tx.QueryRowContext(ctx, `
SELECT store_id, product_id, conflict_type, status
FROM dsh_catalog_conflicts
WHERE id = $1`, id).Scan(&storeID, &productID, &conflictType, &status)
	if err == sql.ErrNoRows {
		return domain.ResolveConflictResponse{}, fmt.Errorf("conflict not found")
	}
	if err != nil {
		return domain.ResolveConflictResponse{}, err
	}

	if status != "pending" {
		return domain.ResolveConflictResponse{}, fmt.Errorf("conflict is already resolved")
	}

	dbStatus := ""
	if req.Resolution == "accept_local" {
		dbStatus = "resolved_accept_local"
	} else if req.Resolution == "revert_to_central" {
		dbStatus = "resolved_reverted"
		if conflictType == "price_divergence" {
			_, err = tx.ExecContext(ctx, `
UPDATE dsh_catalog_overrides
SET price_override = NULL, updated_at = NOW()
WHERE store_id = $1 AND product_id = $2`, storeID, productID)
		} else if conflictType == "availability_divergence" {
			_, err = tx.ExecContext(ctx, `
UPDATE dsh_catalog_overrides
SET available_override = NULL, updated_at = NOW()
WHERE store_id = $1 AND product_id = $2`, storeID, productID)
		}
		if err != nil {
			return domain.ResolveConflictResponse{}, err
		}
	} else {
		return domain.ResolveConflictResponse{}, fmt.Errorf("invalid resolution")
	}

	_, err = tx.ExecContext(ctx, `
UPDATE dsh_catalog_conflicts
SET status = $1, resolved_at = NOW()
WHERE id = $2`, dbStatus, id)
	if err != nil {
		return domain.ResolveConflictResponse{}, err
	}

	if err := tx.Commit(); err != nil {
		return domain.ResolveConflictResponse{}, err
	}

	return domain.ResolveConflictResponse{
		ConflictID: id,
		Status:     dbStatus,
	}, nil
}
