package store

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"bthwani.local/dsh/domain"
)

// generateCategoryID generates a simple time-based category ID.
func generateCategoryID() string {
	return fmt.Sprintf("cat-%d", time.Now().UnixNano())
}

func (repo *PostgresRepository) CreateCategory(ctx context.Context, storeID string, req domain.CreateCategoryRequest) (domain.CategoryRecord, error) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return domain.CategoryRecord{}, fmt.Errorf("category name is required")
	}

	id := generateCategoryID()

	query := `
INSERT INTO dsh_catalog_categories
  (id, store_id, parent_id, name, description, created_at, updated_at)
VALUES
  ($1, $2, $3, $4, $5, NOW(), NOW())
RETURNING id, store_id, parent_id, name, description, created_at, updated_at`

	row := repo.db.QueryRowContext(ctx, query,
		id, storeID, req.ParentID, name, req.Description,
	)

	return scanCategoryRow(row)
}

func (repo *PostgresRepository) UpdateCategory(ctx context.Context, categoryID string, req domain.UpdateCategoryRequest) (domain.CategoryRecord, error) {
	sets := []string{"updated_at = NOW()"}
	args := []any{}

	if req.Name != nil {
		trimmed := strings.TrimSpace(*req.Name)
		if trimmed == "" {
			return domain.CategoryRecord{}, fmt.Errorf("category name cannot be empty")
		}
		args = append(args, trimmed)
		sets = append(sets, fmt.Sprintf("name = $%d", len(args)))
	}
	if req.ParentID != nil {
		args = append(args, req.ParentID)
		sets = append(sets, fmt.Sprintf("parent_id = $%d", len(args)))
	}
	if req.Description != nil {
		args = append(args, req.Description)
		sets = append(sets, fmt.Sprintf("description = $%d", len(args)))
	}

	args = append(args, categoryID)
	idPlaceholder := len(args)

	query := fmt.Sprintf(`
UPDATE dsh_catalog_categories SET %s
WHERE id = $%d
RETURNING id, store_id, parent_id, name, description, created_at, updated_at`,
		strings.Join(sets, ", "), idPlaceholder)

	row := repo.db.QueryRowContext(ctx, query, args...)
	record, err := scanCategoryRow(row)
	if err == sql.ErrNoRows {
		return domain.CategoryRecord{}, fmt.Errorf("category not found")
	}
	return record, err
}

func (repo *PostgresRepository) GetCategory(ctx context.Context, categoryID string) (domain.CategoryRecord, error) {
	query := `
SELECT id, store_id, parent_id, name, description, created_at, updated_at
FROM dsh_catalog_categories
WHERE id = $1`

	row := repo.db.QueryRowContext(ctx, query, categoryID)
	record, err := scanCategoryRow(row)
	if err == sql.ErrNoRows {
		return domain.CategoryRecord{}, fmt.Errorf("category not found")
	}
	return record, err
}

func (repo *PostgresRepository) ListCategories(ctx context.Context, storeID string, limit int, offset int) (domain.ListCategoriesResponse, error) {
	countQuery := `SELECT COUNT(*) FROM dsh_catalog_categories WHERE store_id = $1`
	var total int
	if err := repo.db.QueryRowContext(ctx, countQuery, storeID).Scan(&total); err != nil {
		return domain.ListCategoriesResponse{}, err
	}

	query := `
SELECT id, store_id, parent_id, name, description, created_at, updated_at
FROM dsh_catalog_categories
WHERE store_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3`

	rows, err := repo.db.QueryContext(ctx, query, storeID, limit, offset)
	if err != nil {
		return domain.ListCategoriesResponse{}, err
	}
	defer rows.Close()

	categories := []domain.CategoryRecord{}
	for rows.Next() {
		record, err := scanCategoryRowColumns(rows)
		if err != nil {
			return domain.ListCategoriesResponse{}, err
		}
		categories = append(categories, record)
	}
	if err := rows.Err(); err != nil {
		return domain.ListCategoriesResponse{}, err
	}

	return domain.ListCategoriesResponse{
		Categories: categories,
		Pagination: domain.Pagination{
			Limit:  limit,
			Offset: offset,
			Total:  total,
		},
	}, nil
}

func (repo *PostgresRepository) DeleteCategory(ctx context.Context, categoryID string) error {
	query := `DELETE FROM dsh_catalog_categories WHERE id = $1`
	res, err := repo.db.ExecContext(ctx, query, categoryID)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("category not found")
	}
	return nil
}

// scanCategoryRow scans a *sql.Row into a CategoryRecord.
func scanCategoryRow(row *sql.Row) (domain.CategoryRecord, error) {
	var r domain.CategoryRecord
	var parentID, description sql.NullString
	err := row.Scan(
		&r.ID, &r.StoreID, &parentID, &r.Name, &description,
		&r.CreatedAt, &r.UpdatedAt,
	)
	if err != nil {
		return domain.CategoryRecord{}, err
	}
	if parentID.Valid {
		r.ParentID = &parentID.String
	}
	if description.Valid {
		r.Description = &description.String
	}
	return r, nil
}

// scanCategoryRowColumns scans a *sql.Rows into a CategoryRecord.
func scanCategoryRowColumns(rows *sql.Rows) (domain.CategoryRecord, error) {
	var r domain.CategoryRecord
	var parentID, description sql.NullString
	err := rows.Scan(
		&r.ID, &r.StoreID, &parentID, &r.Name, &description,
		&r.CreatedAt, &r.UpdatedAt,
	)
	if err != nil {
		return domain.CategoryRecord{}, err
	}
	if parentID.Valid {
		r.ParentID = &parentID.String
	}
	if description.Valid {
		r.Description = &description.String
	}
	return r, nil
}
