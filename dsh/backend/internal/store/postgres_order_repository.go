package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"bthwani.local/dsh/domain"
)

func generateOrderID() string {
	return fmt.Sprintf("ord-%d", time.Now().UnixNano())
}

func generateOrderItemID() string {
	return fmt.Sprintf("item-%d", time.Now().UnixNano())
}

func generateStatusEventID() string {
	return fmt.Sprintf("evt-%d", time.Now().UnixNano())
}

func generateSupportEscalationID() string {
	return fmt.Sprintf("esc-%d", time.Now().UnixNano())
}

func (repo *PostgresRepository) CreateOrder(ctx context.Context, storeID string, req domain.CreateOrderRequest) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	if storeID == "" {
		return domain.OrderRecord{}, nil, fmt.Errorf("store ID is required")
	}
	if req.ClientID == "" {
		return domain.OrderRecord{}, nil, fmt.Errorf("client ID is required")
	}
	if len(req.Items) == 0 {
		return domain.OrderRecord{}, nil, fmt.Errorf("order must have at least one item")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, nil, err
	}
	defer tx.Rollback()

	// Verify store exists
	var stExists bool
	err = tx.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)", storeID).Scan(&stExists)
	if err != nil {
		return domain.OrderRecord{}, nil, fmt.Errorf("failed to verify store: %w", err)
	}
	if !stExists {
		return domain.OrderRecord{}, nil, fmt.Errorf("store with ID %s not found", storeID)
	}

	orderID := generateOrderID()
	orderQuery := `
INSERT INTO dsh_orders (id, store_id, client_id, status, total_price, wlt_payment_ref_id, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, created_at, updated_at`

	var order domain.OrderRecord
	var wltPay sql.NullString
	err = tx.QueryRowContext(ctx, orderQuery,
		orderID, storeID, req.ClientID, domain.StatusCreated, req.TotalPrice, req.WltPaymentRefID,
	).Scan(
		&order.ID, &order.StoreID, &order.ClientID, &order.Status, &order.TotalPrice, &wltPay, &order.CreatedAt, &order.UpdatedAt,
	)
	if err != nil {
		return domain.OrderRecord{}, nil, fmt.Errorf("failed to create order: %w", err)
	}
	if wltPay.Valid {
		order.WltPaymentRefID = &wltPay.String
	}

	var items []domain.OrderItemRecord
	itemQuery := `
INSERT INTO dsh_order_items (id, order_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, order_id, product_id, quantity, price`

	for _, it := range req.Items {
		// Verify product exists and belongs to the store
		var prodExists bool
		err = tx.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM dsh_catalog_products WHERE id = $1 AND store_id = $2)", it.ProductID, storeID).Scan(&prodExists)
		if err != nil {
			return domain.OrderRecord{}, nil, fmt.Errorf("failed to verify product: %w", err)
		}
		if !prodExists {
			return domain.OrderRecord{}, nil, fmt.Errorf("product %s not found or does not belong to store %s", it.ProductID, storeID)
		}

		itemID := generateOrderItemID()
		var item domain.OrderItemRecord
		err = tx.QueryRowContext(ctx, itemQuery,
			itemID, orderID, it.ProductID, it.Quantity, it.Price,
		).Scan(
			&item.ID, &item.OrderID, &item.ProductID, &item.Quantity, &item.Price,
		)
		if err != nil {
			return domain.OrderRecord{}, nil, fmt.Errorf("failed to create order item: %w", err)
		}
		items = append(items, item)
	}

	// Insert initial event status
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'system', 'NONE', $3, 'Order initialized', NOW())`
	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, domain.StatusCreated)
	if err != nil {
		return domain.OrderRecord{}, nil, fmt.Errorf("failed to create initial status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, nil, err
	}

	return order, items, nil
}

func (repo *PostgresRepository) GetOrder(ctx context.Context, orderID string) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	orderQuery := `
SELECT id, store_id, client_id, status, total_price, wlt_payment_ref_id, created_at, updated_at
FROM dsh_orders
WHERE id = $1`

	var order domain.OrderRecord
	var wltPay sql.NullString
	err := repo.db.QueryRowContext(ctx, orderQuery, orderID).Scan(
		&order.ID, &order.StoreID, &order.ClientID, &order.Status, &order.TotalPrice, &wltPay, &order.CreatedAt, &order.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, nil, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, nil, err
	}
	if wltPay.Valid {
		order.WltPaymentRefID = &wltPay.String
	}

	itemsQuery := `
SELECT id, order_id, product_id, quantity, price
FROM dsh_order_items
WHERE order_id = $1`

	rows, err := repo.db.QueryContext(ctx, itemsQuery, orderID)
	if err != nil {
		return domain.OrderRecord{}, nil, err
	}
	defer rows.Close()

	var items []domain.OrderItemRecord
	for rows.Next() {
		var item domain.OrderItemRecord
		err := rows.Scan(&item.ID, &item.OrderID, &item.ProductID, &item.Quantity, &item.Price)
		if err != nil {
			return domain.OrderRecord{}, nil, err
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return domain.OrderRecord{}, nil, err
	}

	return order, items, nil
}

func (repo *PostgresRepository) UpdateOrderStatus(ctx context.Context, orderID string, actor string, status string, note *string) (domain.OrderRecord, error) {
	if status != domain.StatusCreated &&
		status != domain.StatusAccepted &&
		status != domain.StatusReadyForPickup &&
		status != domain.StatusDelivered &&
		status != domain.StatusCancelled {
		return domain.OrderRecord{}, fmt.Errorf("invalid status: %s", status)
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Get current order status
	var currentStatus string
	err = tx.QueryRowContext(ctx, "SELECT status FROM dsh_orders WHERE id = $1 FOR UPDATE", orderID).Scan(&currentStatus)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}

	if currentStatus == status {
		// No transition needed, return order as is
		var order domain.OrderRecord
		var wltPay sql.NullString
		err = tx.QueryRowContext(ctx, `
SELECT id, store_id, client_id, status, total_price, wlt_payment_ref_id, created_at, updated_at
FROM dsh_orders WHERE id = $1`, orderID).Scan(
			&order.ID, &order.StoreID, &order.ClientID, &order.Status, &order.TotalPrice, &wltPay, &order.CreatedAt, &order.UpdatedAt,
		)
		if err != nil {
			return domain.OrderRecord{}, err
		}
		if wltPay.Valid {
			order.WltPaymentRefID = &wltPay.String
		}
		return order, nil
	}

	// Update order status
	var order domain.OrderRecord
	var wltPay sql.NullString
	updateQuery := `
UPDATE dsh_orders
SET status = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, created_at, updated_at`

	err = tx.QueryRowContext(ctx, updateQuery, status, orderID).Scan(
		&order.ID, &order.StoreID, &order.ClientID, &order.Status, &order.TotalPrice, &wltPay, &order.CreatedAt, &order.UpdatedAt,
	)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to update order status: %w", err)
	}
	if wltPay.Valid {
		order.WltPaymentRefID = &wltPay.String
	}

	// Create event
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, $3, $4, $5, $6, NOW())`

	var noteVal sql.NullString
	if note != nil {
		noteVal.String = *note
		noteVal.Valid = true
	}

	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, actor, currentStatus, status, noteVal)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

func (repo *PostgresRepository) CreateSupportEscalation(ctx context.Context, req domain.CreateSupportEscalationRequest) (domain.SupportEscalationRecord, error) {
	if req.OrderID == "" {
		return domain.SupportEscalationRecord{}, fmt.Errorf("order ID is required")
	}
	if req.Actor == "" {
		return domain.SupportEscalationRecord{}, fmt.Errorf("actor is required")
	}
	if req.IssueType == "" {
		return domain.SupportEscalationRecord{}, fmt.Errorf("issue type is required")
	}
	if req.Description == "" {
		return domain.SupportEscalationRecord{}, fmt.Errorf("description is required")
	}

	// Verify order exists
	var orderExists bool
	err := repo.db.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM dsh_orders WHERE id = $1)", req.OrderID).Scan(&orderExists)
	if err != nil {
		return domain.SupportEscalationRecord{}, err
	}
	if !orderExists {
		return domain.SupportEscalationRecord{}, fmt.Errorf("order %s not found", req.OrderID)
	}

	id := generateSupportEscalationID()
	query := `
INSERT INTO dsh_support_escalations (id, order_id, actor, issue_type, description, status, created_at, resolved_at)
VALUES ($1, $2, $3, $4, $5, 'open', NOW(), NULL)
RETURNING id, order_id, actor, issue_type, description, status, created_at, resolved_at`

	var rec domain.SupportEscalationRecord
	var resolvedAt sql.NullTime
	err = repo.db.QueryRowContext(ctx, query,
		id, req.OrderID, req.Actor, req.IssueType, req.Description,
	).Scan(
		&rec.ID, &rec.OrderID, &rec.Actor, &rec.IssueType, &rec.Description, &rec.Status, &rec.CreatedAt, &resolvedAt,
	)
	if err != nil {
		return domain.SupportEscalationRecord{}, err
	}
	if resolvedAt.Valid {
		rec.ResolvedAt = &resolvedAt.Time
	}

	return rec, nil
}

func (repo *PostgresRepository) ListOrderStatusEvents(ctx context.Context, orderID string) ([]domain.OrderStatusEventRecord, error) {
	// Verify order exists
	var orderExists bool
	err := repo.db.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM dsh_orders WHERE id = $1)", orderID).Scan(&orderExists)
	if err != nil {
		return nil, err
	}
	if !orderExists {
		return nil, fmt.Errorf("order %s not found", orderID)
	}

	query := `
SELECT id, order_id, actor, from_status, to_status, note, created_at
FROM dsh_order_status_events
WHERE order_id = $1
ORDER BY created_at ASC`

	rows, err := repo.db.QueryContext(ctx, query, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []domain.OrderStatusEventRecord
	for rows.Next() {
		var ev domain.OrderStatusEventRecord
		var note sql.NullString
		err := rows.Scan(&ev.ID, &ev.OrderID, &ev.Actor, &ev.FromStatus, &ev.ToStatus, &note, &ev.CreatedAt)
		if err != nil {
			return nil, err
		}
		if note.Valid {
			ev.Note = &note.String
		}
		events = append(events, ev)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}

func (repo *PostgresRepository) ListSupportEscalations(ctx context.Context, orderID string) ([]domain.SupportEscalationRecord, error) {
	// Verify order exists
	var orderExists bool
	err := repo.db.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM dsh_orders WHERE id = $1)", orderID).Scan(&orderExists)
	if err != nil {
		return nil, err
	}
	if !orderExists {
		return nil, fmt.Errorf("order %s not found", orderID)
	}

	query := `
SELECT id, order_id, actor, issue_type, description, status, created_at, resolved_at
FROM dsh_support_escalations
WHERE order_id = $1
ORDER BY created_at ASC`

	rows, err := repo.db.QueryContext(ctx, query, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var escalations []domain.SupportEscalationRecord
	for rows.Next() {
		var esc domain.SupportEscalationRecord
		var resolvedAt sql.NullTime
		err := rows.Scan(&esc.ID, &esc.OrderID, &esc.Actor, &esc.IssueType, &esc.Description, &esc.Status, &esc.CreatedAt, &resolvedAt)
		if err != nil {
			return nil, err
		}
		if resolvedAt.Valid {
			esc.ResolvedAt = &resolvedAt.Time
		}
		escalations = append(escalations, esc)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return escalations, nil
}
