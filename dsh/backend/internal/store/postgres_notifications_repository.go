package store

import (
	"context"
	"database/sql"
	"fmt"

	"bthwani.local/dsh/domain"
)

// ListNotifications (J-013): returns notifications for a recipient, paginated, optionally unread-only.
func (repo *PostgresRepository) ListNotifications(ctx context.Context, query domain.ListNotificationsQuery) (domain.ListNotificationsResponse, error) {
	args := []any{query.RecipientID, query.RecipientRole}
	where := []string{"recipient_id = $1", "recipient_role = $2"}

	if query.UnreadOnly {
		where = append(where, "is_read = false")
	}

	whereClause := "WHERE " + where[0]
	for _, w := range where[1:] {
		whereClause += " AND " + w
	}

	limit := query.Limit
	if limit <= 0 || limit > 100 {
		limit = 30
	}
	offset := query.Offset
	if offset < 0 {
		offset = 0
	}

	countArgs := append([]any{}, args...)
	var total int
	countQ := fmt.Sprintf("SELECT COUNT(*) FROM dsh_notifications %s", whereClause)
	if err := repo.db.QueryRowContext(ctx, countQ, countArgs...).Scan(&total); err != nil {
		return domain.ListNotificationsResponse{}, err
	}

	args = append(args, limit, offset)
	listQ := fmt.Sprintf(`
SELECT id, recipient_id, recipient_role, kind, title, subtitle, entity_id, entity_type,
       priority, is_read, action_route, created_at
FROM dsh_notifications %s
ORDER BY created_at DESC
LIMIT $%d OFFSET $%d`, whereClause, len(args)-1, len(args))

	rows, err := repo.db.QueryContext(ctx, listQ, args...)
	if err != nil {
		return domain.ListNotificationsResponse{}, err
	}
	defer rows.Close()

	var records []domain.NotificationRecord
	for rows.Next() {
		var n domain.NotificationRecord
		var subtitle, entityID, entityType, actionRoute sql.NullString
		if err := rows.Scan(
			&n.ID, &n.RecipientID, &n.RecipientRole, &n.Kind, &n.Title,
			&subtitle, &entityID, &entityType,
			&n.Priority, &n.IsRead, &actionRoute, &n.CreatedAt,
		); err != nil {
			return domain.ListNotificationsResponse{}, err
		}
		if subtitle.Valid {
			n.Subtitle = &subtitle.String
		}
		if entityID.Valid {
			n.EntityID = &entityID.String
		}
		if entityType.Valid {
			n.EntityType = &entityType.String
		}
		if actionRoute.Valid {
			n.ActionRoute = &actionRoute.String
		}
		records = append(records, n)
	}
	if err := rows.Err(); err != nil {
		return domain.ListNotificationsResponse{}, err
	}
	if records == nil {
		records = []domain.NotificationRecord{}
	}
	return domain.ListNotificationsResponse{Notifications: records, Total: total}, nil
}

// MarkNotificationRead (J-013): marks a notification as read (idempotent — safe to call multiple times).
func (repo *PostgresRepository) MarkNotificationRead(ctx context.Context, id string, recipientID string) error {
	_, err := repo.db.ExecContext(ctx,
		`UPDATE dsh_notifications SET is_read = true WHERE id = $1 AND recipient_id = $2`,
		id, recipientID,
	)
	return err
}
