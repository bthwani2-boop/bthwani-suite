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

func scanOrderRecord(row interface{ Scan(dest ...any) error }, order *domain.OrderRecord) error {
	var wltPay sql.NullString
	var wltRef sql.NullString
	var refAmt sql.NullFloat64
	var capID sql.NullString
	var lat sql.NullFloat64
	var lng sql.NullFloat64
	var lifeStatus sql.NullString
	var podKey sql.NullString
	var failReason sql.NullString
	var wltRefundTrigger sql.NullString
	var wltSettlement sql.NullString
	var setStatus sql.NullString
	var setAmt sql.NullFloat64

	err := row.Scan(
		&order.ID, &order.StoreID, &order.ClientID, &order.Status, &order.TotalPrice,
		&wltPay, &wltRef, &refAmt, &capID, &lat, &lng, &lifeStatus, &podKey,
		&failReason, &wltRefundTrigger,
		&wltSettlement, &setStatus, &setAmt,
		&order.CreatedAt, &order.UpdatedAt,
	)
	if err != nil {
		return err
	}

	if wltPay.Valid {
		order.WltPaymentRefID = &wltPay.String
	}
	if wltRef.Valid {
		order.WltRefundRefID = &wltRef.String
	}
	if refAmt.Valid {
		order.RefundAmount = &refAmt.Float64
	}
	if capID.Valid {
		order.CaptainID = &capID.String
	}
	if lat.Valid {
		order.CaptainLatitude = &lat.Float64
	}
	if lng.Valid {
		order.CaptainLongitude = &lng.Float64
	}
	if lifeStatus.Valid {
		order.CaptainLifecycleStatus = &lifeStatus.String
	}
	if podKey.Valid {
		order.PodMediaKey = &podKey.String
	}
	if failReason.Valid {
		order.DeliveryFailureReason = &failReason.String
	}
	if wltRefundTrigger.Valid {
		order.WltRefundTriggerRef = &wltRefundTrigger.String
	}
	if wltSettlement.Valid {
		order.WltSettlementRefID = &wltSettlement.String
	}
	if setStatus.Valid {
		order.SettlementStatus = setStatus.String
	}
	if setAmt.Valid {
		order.SettlementAmount = &setAmt.Float64
	}
	return nil
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
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	var order domain.OrderRecord
	row := tx.QueryRowContext(ctx, orderQuery,
		orderID, storeID, req.ClientID, domain.StatusCreated, req.TotalPrice, req.WltPaymentRefID,
	)
	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, nil, fmt.Errorf("failed to create order: %w", err)
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

func (repo *PostgresRepository) ListOrders(ctx context.Context, query domain.ListOrdersQuery) (domain.ListOrdersResponse, error) {
	limit := query.Limit
	if limit <= 0 {
		limit = 50
	}
	if limit > 200 {
		limit = 200
	}
	offset := query.Offset
	if offset < 0 {
		offset = 0
	}

	var countRow *sql.Row
	var rows *sql.Rows
	var err error

	const selectCols = `id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	if query.Status != "" {
		countRow = repo.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM dsh_orders WHERE status = $1`, query.Status)
		rows, err = repo.db.QueryContext(ctx,
			`SELECT `+selectCols+` FROM dsh_orders WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
			query.Status, limit, offset,
		)
	} else {
		countRow = repo.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM dsh_orders`)
		rows, err = repo.db.QueryContext(ctx,
			`SELECT `+selectCols+` FROM dsh_orders ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
			limit, offset,
		)
	}

	var total int
	if scanErr := countRow.Scan(&total); scanErr != nil {
		return domain.ListOrdersResponse{}, fmt.Errorf("failed to count orders: %w", scanErr)
	}

	if err != nil {
		return domain.ListOrdersResponse{}, fmt.Errorf("failed to list orders: %w", err)
	}
	defer rows.Close()

	var orders []domain.OrderRecord
	for rows.Next() {
		var o domain.OrderRecord
		if scanErr := scanOrderRecord(rows, &o); scanErr != nil {
			return domain.ListOrdersResponse{}, fmt.Errorf("failed to scan order: %w", scanErr)
		}
		orders = append(orders, o)
	}
	if err := rows.Err(); err != nil {
		return domain.ListOrdersResponse{}, err
	}
	if orders == nil {
		orders = []domain.OrderRecord{}
	}
	return domain.ListOrdersResponse{Orders: orders, Total: total}, nil
}

func (repo *PostgresRepository) GetOrder(ctx context.Context, orderID string) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	orderQuery := `
SELECT id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at
FROM dsh_orders
WHERE id = $1`

	var order domain.OrderRecord
	row := repo.db.QueryRowContext(ctx, orderQuery, orderID)
	err := scanOrderRecord(row, &order)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, nil, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, nil, err
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
		status != domain.StatusCancelled &&
		status != domain.StatusRefunded &&
		status != domain.StatusAcceptedByCaptain &&
		status != domain.StatusPickedUp &&
		status != domain.StatusEnRoute &&
		status != domain.StatusArrived {
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
		row := tx.QueryRowContext(ctx, `
SELECT id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at
FROM dsh_orders WHERE id = $1`, orderID)
		err = scanOrderRecord(row, &order)
		if err != nil {
			return domain.OrderRecord{}, err
		}
		return order, nil
	}

	// Update order status
	var order domain.OrderRecord
	updateQuery := `
UPDATE dsh_orders
SET status = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	row := tx.QueryRowContext(ctx, updateQuery, status, orderID)
	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to update order status: %w", err)
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

func (repo *PostgresRepository) UpdateOrderRefund(ctx context.Context, orderID string, refundRefID string, amount float64, status string) (domain.OrderRecord, error) {
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

	var order domain.OrderRecord
	var updateQuery string
	var toStatus string
	var note string

	if status == "CONFIRMED" {
		toStatus = "REFUNDED"
		updateQuery = `
UPDATE dsh_orders
SET status = 'REFUNDED', wlt_refund_ref_id = $1, refund_amount = $2, updated_at = NOW()
WHERE id = $3
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`
		row := tx.QueryRowContext(ctx, updateQuery, refundRefID, amount, orderID)
		err = scanOrderRecord(row, &order)
		note = fmt.Sprintf("Refund of %.2f processed, ref: %s", amount, refundRefID)
	} else {
		toStatus = currentStatus
		updateQuery = `
UPDATE dsh_orders
SET wlt_refund_ref_id = $1, refund_amount = $2, updated_at = NOW()
WHERE id = $3
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`
		row := tx.QueryRowContext(ctx, updateQuery, refundRefID, amount, orderID)
		err = scanOrderRecord(row, &order)
		note = fmt.Sprintf("Refund of %.2f failed, ref: %s", amount, refundRefID)
	}

	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to update order refund: %w", err)
	}

	// Create event
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'system', $3, $4, $5, NOW())`

	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, currentStatus, toStatus, note)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

func (repo *PostgresRepository) AssignCaptain(ctx context.Context, orderID string, captainID string) (domain.OrderRecord, error) {
	if orderID == "" {
		return domain.OrderRecord{}, fmt.Errorf("order ID is required")
	}
	if captainID == "" {
		return domain.OrderRecord{}, fmt.Errorf("captain ID is required")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Get current order status and verification
	var currentStatus string
	err = tx.QueryRowContext(ctx, "SELECT status FROM dsh_orders WHERE id = $1 FOR UPDATE", orderID).Scan(&currentStatus)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}

	// Update captain_id
	var order domain.OrderRecord
	updateQuery := `
UPDATE dsh_orders
SET captain_id = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	row := tx.QueryRowContext(ctx, updateQuery, captainID, orderID)
	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to assign captain: %w", err)
	}

	// Create event
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'operator', $3, $4, $5, NOW())`

	note := fmt.Sprintf("Captain assigned: %s", captainID)
	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, currentStatus, order.Status, note)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

func (repo *PostgresRepository) AcceptTask(ctx context.Context, orderID string, captainID string) (domain.OrderRecord, error) {
	if orderID == "" {
		return domain.OrderRecord{}, fmt.Errorf("order ID is required")
	}
	if captainID == "" {
		return domain.OrderRecord{}, fmt.Errorf("captain ID is required")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Get current order status and verification
	var currentStatus string
	var currentCaptain sql.NullString
	err = tx.QueryRowContext(ctx, "SELECT status, captain_id FROM dsh_orders WHERE id = $1 FOR UPDATE", orderID).Scan(&currentStatus, &currentCaptain)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptain.Valid || currentCaptain.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("captain ID mismatch or not assigned")
	}

	// Update order status to ACCEPTED_BY_CAPTAIN
	var order domain.OrderRecord
	updateQuery := `
UPDATE dsh_orders
SET status = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	row := tx.QueryRowContext(ctx, updateQuery, domain.StatusAcceptedByCaptain, orderID)
	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to accept task: %w", err)
	}

	// Create event
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`

	note := fmt.Sprintf("Accepted by captain: %s", captainID)
	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, currentStatus, order.Status, note)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

func (repo *PostgresRepository) DeclineTask(ctx context.Context, orderID string, captainID string, reason string) (domain.OrderRecord, error) {
	if orderID == "" {
		return domain.OrderRecord{}, fmt.Errorf("order ID is required")
	}
	if captainID == "" {
		return domain.OrderRecord{}, fmt.Errorf("captain ID is required")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Get current order status and verification
	var currentStatus string
	var currentCaptain sql.NullString
	err = tx.QueryRowContext(ctx, "SELECT status, captain_id FROM dsh_orders WHERE id = $1 FOR UPDATE", orderID).Scan(&currentStatus, &currentCaptain)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptain.Valid || currentCaptain.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("captain ID mismatch or not assigned")
	}

	// Update order status back to READY_FOR_PICKUP and captain_id to NULL
	var order domain.OrderRecord
	updateQuery := `
UPDATE dsh_orders
SET captain_id = NULL, status = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	row := tx.QueryRowContext(ctx, updateQuery, domain.StatusReadyForPickup, orderID)
	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to decline task: %w", err)
	}

	// Create event
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`

	note := fmt.Sprintf("Declined by captain: %s, reason: %s", captainID, reason)
	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, currentStatus, order.Status, note)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

func (repo *PostgresRepository) ConfirmPickup(ctx context.Context, orderID string, captainID string) (domain.OrderRecord, error) {
	if orderID == "" {
		return domain.OrderRecord{}, fmt.Errorf("order ID is required")
	}
	if captainID == "" {
		return domain.OrderRecord{}, fmt.Errorf("captain ID is required")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Get current order status and verification
	var currentStatus string
	var currentCaptain sql.NullString
	err = tx.QueryRowContext(ctx, "SELECT status, captain_id FROM dsh_orders WHERE id = $1 FOR UPDATE", orderID).Scan(&currentStatus, &currentCaptain)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptain.Valid || currentCaptain.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("captain ID mismatch or not assigned")
	}
	if currentStatus != domain.StatusAcceptedByCaptain {
		return domain.OrderRecord{}, fmt.Errorf("order status must be ACCEPTED_BY_CAPTAIN to be picked up")
	}

	// Update order status to PICKED_UP
	var order domain.OrderRecord
	updateQuery := `
UPDATE dsh_orders
SET status = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

	row := tx.QueryRowContext(ctx, updateQuery, domain.StatusPickedUp, orderID)
	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to confirm pickup: %w", err)
	}

	// Create event
	eventID := generateStatusEventID()
	eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`

	note := fmt.Sprintf("Picked up by captain: %s", captainID)
	_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, currentStatus, order.Status, note)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

func (repo *PostgresRepository) UpdateCaptainLocation(ctx context.Context, orderID string, captainID string, lat float64, lng float64, lifecycleStatus string, orderStatus string) (domain.OrderRecord, error) {
	if orderID == "" {
		return domain.OrderRecord{}, fmt.Errorf("order ID is required")
	}
	if captainID == "" {
		return domain.OrderRecord{}, fmt.Errorf("captain ID is required")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Get current order status and verification
	var currentStatus string
	var currentCaptain sql.NullString
	err = tx.QueryRowContext(ctx, "SELECT status, captain_id FROM dsh_orders WHERE id = $1 FOR UPDATE", orderID).Scan(&currentStatus, &currentCaptain)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptain.Valid || currentCaptain.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("captain ID mismatch or not assigned")
	}

	// Update order status if provided, update location and lifecycle_status
	var order domain.OrderRecord

	// If orderStatus is not empty, update the order status
	var updateQuery string
	var row *sql.Row
	if orderStatus != "" {
		updateQuery = `
UPDATE dsh_orders
SET status = $1, captain_latitude = $2, captain_longitude = $3, captain_lifecycle_status = $4, updated_at = NOW()
WHERE id = $5
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`
		row = tx.QueryRowContext(ctx, updateQuery, orderStatus, lat, lng, lifecycleStatus, orderID)
	} else {
		updateQuery = `
UPDATE dsh_orders
SET captain_latitude = $1, captain_longitude = $2, captain_lifecycle_status = $3, updated_at = NOW()
WHERE id = $4
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`
		row = tx.QueryRowContext(ctx, updateQuery, lat, lng, lifecycleStatus, orderID)
	}

	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to update captain location: %w", err)
	}

	// Create event if status transitions
	if orderStatus != "" && orderStatus != currentStatus {
		eventID := generateStatusEventID()
		eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`

		note := fmt.Sprintf("Captain changed order status to %s at location (%.6f, %.6f)", orderStatus, lat, lng)
		_, err = tx.ExecContext(ctx, eventQuery, eventID, orderID, currentStatus, order.Status, note)
		if err != nil {
			return domain.OrderRecord{}, fmt.Errorf("failed to log status event: %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

// DeliverOrder — DSH-SLICE-005E: Proof of Delivery.
// Validates that:
//   - the order exists and is owned by the given captainID
//   - current status is ARRIVED (captain must have reached client before submitting PoD)
// Updates status to DELIVERED, records pod_media_key, logs status event.
// WLT BOUNDARY: no financial mutation here. Payout is WLT responsibility triggered externally.
func (repo *PostgresRepository) DeliverOrder(ctx context.Context, orderID string, captainID string, podMediaKey *string) (domain.OrderRecord, error) {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Verify order exists, belongs to captain, and is in ARRIVED state
	var currentCaptainID sql.NullString
	var currentStatus string
	err = tx.QueryRowContext(ctx,
		`SELECT captain_id, status FROM dsh_orders WHERE id = $1`,
		orderID,
	).Scan(&currentCaptainID, &currentStatus)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptainID.Valid || currentCaptainID.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("order not assigned to this captain")
	}
	if currentStatus != domain.StatusArrived {
		return domain.OrderRecord{}, fmt.Errorf("order must be in ARRIVED state before delivery proof can be submitted; current: %s", currentStatus)
	}

	// Update order to DELIVERED, set pod_media_key
	var order domain.OrderRecord
	row := tx.QueryRowContext(ctx, `
UPDATE dsh_orders
SET status = $1, pod_media_key = $2, updated_at = NOW()
WHERE id = $3
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`,
		domain.StatusDelivered, podMediaKey, orderID)

	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to mark order as delivered: %w", err)
	}

	// Log ARRIVED → DELIVERED status event
	eventID := generateStatusEventID()
	note := "Proof of delivery submitted by captain"
	if podMediaKey != nil && *podMediaKey != "" {
		note = fmt.Sprintf("Proof of delivery submitted by captain; pod_media_key=%s", *podMediaKey)
	}
	_, err = tx.ExecContext(ctx, `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`,
		eventID, orderID, domain.StatusArrived, domain.StatusDelivered, note)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log delivery event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

// FailDelivery — DSH-SLICE-005F: report delivery failure.
// Validates: order in ARRIVED state, captain matches, failure_reason non-empty.
// Transitions ARRIVED → FAILED_DELIVERY. Optionally sets RETURNING_TO_STORE if return_required.
// WLT BOUNDARY: wlt_refund_trigger_ref is stored as a bridge reference only.
// DSH does NOT execute refunds; WLT (004E) owns refund execution.
func (repo *PostgresRepository) FailDelivery(ctx context.Context, orderID string, captainID string, failureReason string, wltRefundTriggerRef *string, returnRequired bool) (domain.OrderRecord, error) {
	if failureReason == "" {
		return domain.OrderRecord{}, fmt.Errorf("failure_reason is required")
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	// Validate captain + current status
	var currentCaptainID sql.NullString
	var currentStatus string
	err = tx.QueryRowContext(ctx,
		`SELECT captain_id, status FROM dsh_orders WHERE id = $1`,
		orderID,
	).Scan(&currentCaptainID, &currentStatus)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptainID.Valid || currentCaptainID.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("order not assigned to this captain")
	}
	if currentStatus != domain.StatusArrived {
		return domain.OrderRecord{}, fmt.Errorf("order must be in ARRIVED state to report failure; current: %s", currentStatus)
	}

	// Determine target status: if return required → RETURNING_TO_STORE, else → FAILED_DELIVERY
	newStatus := domain.StatusFailedDelivery
	if returnRequired {
		newStatus = domain.StatusReturningToStore
	}

	// Update order status, record failure reason, and wlt_refund_trigger_ref (bridge ref only)
	var order domain.OrderRecord
	row := tx.QueryRowContext(ctx, `
UPDATE dsh_orders
SET status = $1, delivery_failure_reason = $2, wlt_refund_trigger_ref = $3, updated_at = NOW()
WHERE id = $4
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`,
		newStatus, failureReason, wltRefundTriggerRef, orderID)

	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to record delivery failure: %w", err)
	}

	// Log ARRIVED → newStatus event
	eventID := generateStatusEventID()
	eventNote := fmt.Sprintf("Delivery failed: %s", failureReason)
	if wltRefundTriggerRef != nil && *wltRefundTriggerRef != "" {
		eventNote += fmt.Sprintf("; wlt_refund_trigger_ref=%s (WLT executes refund)", *wltRefundTriggerRef)
	}
	_, err = tx.ExecContext(ctx, `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`,
		eventID, orderID, domain.StatusArrived, newStatus, eventNote)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log failure event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

// ConfirmReturn — DSH-SLICE-005F: captain confirms item returned to store.
// Validates: order in RETURNING_TO_STORE, captain matches.
// Transitions RETURNING_TO_STORE → RETURNED.
// WLT BOUNDARY: no financial mutation. Refund already bridged via FailDelivery.
func (repo *PostgresRepository) ConfirmReturn(ctx context.Context, orderID string, captainID string, note string) (domain.OrderRecord, error) {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.OrderRecord{}, err
	}
	defer tx.Rollback()

	var currentCaptainID sql.NullString
	var currentStatus string
	err = tx.QueryRowContext(ctx,
		`SELECT captain_id, status FROM dsh_orders WHERE id = $1`,
		orderID,
	).Scan(&currentCaptainID, &currentStatus)
	if err == sql.ErrNoRows {
		return domain.OrderRecord{}, fmt.Errorf("order not found")
	}
	if err != nil {
		return domain.OrderRecord{}, err
	}
	if !currentCaptainID.Valid || currentCaptainID.String != captainID {
		return domain.OrderRecord{}, fmt.Errorf("order not assigned to this captain")
	}
	if currentStatus != domain.StatusReturningToStore {
		return domain.OrderRecord{}, fmt.Errorf("order must be in RETURNING_TO_STORE state to confirm return; current: %s", currentStatus)
	}

	var order domain.OrderRecord
	row := tx.QueryRowContext(ctx, `
UPDATE dsh_orders
SET status = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`,
		domain.StatusReturned, orderID)

	err = scanOrderRecord(row, &order)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to confirm return: %w", err)
	}

	eventID := generateStatusEventID()
	eventNote := "Item returned to store by captain"
	if note != "" {
		eventNote = fmt.Sprintf("Item returned to store: %s", note)
	}
	_, err = tx.ExecContext(ctx, `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'captain', $3, $4, $5, NOW())`,
		eventID, orderID, domain.StatusReturningToStore, domain.StatusReturned, eventNote)
	if err != nil {
		return domain.OrderRecord{}, fmt.Errorf("failed to log return event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return domain.OrderRecord{}, err
	}

	return order, nil
}

// SubmitSettlementCandidates — DSH-SLICE-010B: submits eligible delivered orders as candidates.
func (repo *PostgresRepository) SubmitSettlementCandidates(ctx context.Context, orderIDs []string) ([]domain.OrderRecord, error) {
	if len(orderIDs) == 0 {
		return nil, fmt.Errorf("no order IDs provided")
	}
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var orders []domain.OrderRecord
	for _, id := range orderIDs {
		var currentStatus string
		var currentSetStatus string
		err = tx.QueryRowContext(ctx, "SELECT status, settlement_status FROM dsh_orders WHERE id = $1 FOR UPDATE", id).Scan(&currentStatus, &currentSetStatus)
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("order not found: %s", id)
		}
		if err != nil {
			return nil, err
		}
		if currentStatus != domain.StatusDelivered && currentStatus != domain.StatusReturned {
			return nil, fmt.Errorf("order %s is not in DELIVERED or RETURNED status (current: %s)", id, currentStatus)
		}
		if currentSetStatus == domain.SettlementStatusPending || currentSetStatus == domain.SettlementStatusSettled {
			return nil, fmt.Errorf("order %s settlement is already %s", id, currentSetStatus)
		}

		var order domain.OrderRecord
		query := `
UPDATE dsh_orders
SET settlement_status = 'SETTLEMENT_PENDING', updated_at = NOW()
WHERE id = $1
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`
		row := tx.QueryRowContext(ctx, query, id)
		err = scanOrderRecord(row, &order)
		if err != nil {
			return nil, err
		}

		// Log status event
		eventID := generateStatusEventID()
		eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'system', $3, $3, 'Submitted as WLT settlement candidate', NOW())`
		_, err = tx.ExecContext(ctx, eventQuery, eventID, id, currentStatus)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return orders, nil
}

// ProcessSettlementCallback — DSH-SLICE-010B: processes callback from WLT settlement.
func (repo *PostgresRepository) ProcessSettlementCallback(ctx context.Context, settlementRefID string, orderIDs []string, amount float64, status string) ([]domain.OrderRecord, error) {
	if len(orderIDs) == 0 {
		return nil, fmt.Errorf("no order IDs provided")
	}
	if status != "CONFIRMED" && status != "FAILED" {
		return nil, fmt.Errorf("invalid settlement callback status: %s", status)
	}

	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var orders []domain.OrderRecord
	for _, id := range orderIDs {
		var currentStatus string
		var currentSetStatus string
		err = tx.QueryRowContext(ctx, "SELECT status, settlement_status FROM dsh_orders WHERE id = $1 FOR UPDATE", id).Scan(&currentStatus, &currentSetStatus)
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("order not found: %s", id)
		}
		if err != nil {
			return nil, err
		}

		var targetSetStatus string
		var note string
		if status == "CONFIRMED" {
			targetSetStatus = domain.SettlementStatusSettled
			note = fmt.Sprintf("WLT Settlement confirmed (ref: %s, amount: %.2f)", settlementRefID, amount)
		} else {
			targetSetStatus = domain.SettlementStatusFailed
			note = fmt.Sprintf("WLT Settlement failed (ref: %s)", settlementRefID)
		}

		var order domain.OrderRecord
		query := `
UPDATE dsh_orders
SET settlement_status = $1, wlt_settlement_ref_id = $2, settlement_amount = $3, updated_at = NOW()
WHERE id = $4
RETURNING id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at`

		var amtVal *float64
		if status == "CONFIRMED" {
			amtVal = &amount
		}
		row := tx.QueryRowContext(ctx, query, targetSetStatus, settlementRefID, amtVal, id)
		err = scanOrderRecord(row, &order)
		if err != nil {
			return nil, err
		}

		// Log status event
		eventID := generateStatusEventID()
		eventQuery := `
INSERT INTO dsh_order_status_events (id, order_id, actor, from_status, to_status, note, created_at)
VALUES ($1, $2, 'system', $3, $3, $4, NOW())`
		_, err = tx.ExecContext(ctx, eventQuery, eventID, id, currentStatus, note)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return orders, nil
}

// ListSettlements — DSH-SLICE-010B: returns read-only settlements bridged from WLT.
func (repo *PostgresRepository) ListSettlements(ctx context.Context) ([]domain.OrderRecord, error) {
	query := `
SELECT id, store_id, client_id, status, total_price, wlt_payment_ref_id, wlt_refund_ref_id, refund_amount, captain_id, captain_latitude, captain_longitude, captain_lifecycle_status, pod_media_key, delivery_failure_reason, wlt_refund_trigger_ref, wlt_settlement_ref_id, settlement_status, settlement_amount, created_at, updated_at
FROM dsh_orders
WHERE settlement_status IN ('SETTLEMENT_PENDING', 'SETTLED', 'SETTLEMENT_FAILED')
ORDER BY updated_at DESC`

	rows, err := repo.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []domain.OrderRecord
	for rows.Next() {
		var order domain.OrderRecord
		err := scanOrderRecord(rows, &order)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return orders, nil
}
