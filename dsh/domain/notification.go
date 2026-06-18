package domain

import "time"

type NotificationRecord struct {
	ID            string     `json:"id"`
	RecipientID   string     `json:"recipient_id"`
	RecipientRole string     `json:"recipient_role"`
	Kind          string     `json:"kind"`
	Title         string     `json:"title"`
	Subtitle      *string    `json:"subtitle,omitempty"`
	EntityID      *string    `json:"entity_id,omitempty"`
	EntityType    *string    `json:"entity_type,omitempty"`
	Priority      string     `json:"priority"`
	IsRead        bool       `json:"is_read"`
	ActionRoute   *string    `json:"action_route,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
}

type ListNotificationsQuery struct {
	RecipientID   string
	RecipientRole string
	UnreadOnly    bool
	Limit         int
	Offset        int
}

type ListNotificationsResponse struct {
	Notifications []NotificationRecord `json:"notifications"`
	Total         int                  `json:"total"`
}
