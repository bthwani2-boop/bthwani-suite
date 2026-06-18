package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type NotificationsHandler struct {
	repository store.NotificationRepository
	mux        *http.ServeMux
}

func NewNotificationsHandler(repository store.NotificationRepository) *NotificationsHandler {
	h := &NotificationsHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("GET /notifications", h.ListNotifications)
	h.mux.HandleFunc("POST /notifications/{id}/read", h.MarkNotificationRead)
	return h
}

func RegisterNotificationsRoutes(mux *http.ServeMux, repository store.NotificationRepository) {
	h := NewNotificationsHandler(repository)
	mux.Handle("GET /notifications", h)
	mux.Handle("POST /notifications/{id}/read", h)
}

func (h *NotificationsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Dev-Client-Id")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *NotificationsHandler) ListNotifications(w http.ResponseWriter, r *http.Request) {
	recipientID := r.Header.Get("X-Dev-Client-Id")
	recipientRole := r.URL.Query().Get("recipient_role")
	if recipientID == "" {
		recipientID = "dev-client-001"
	}
	if recipientRole == "" {
		recipientRole = "client"
	}

	unreadOnly := false
	if r.URL.Query().Get("unread_only") == "true" {
		unreadOnly = true
	}

	limit := 30
	if lStr := r.URL.Query().Get("limit"); lStr != "" {
		if l, err := strconv.Atoi(lStr); err == nil && l > 0 {
			limit = l
		}
	}
	offset := 0
	if oStr := r.URL.Query().Get("offset"); oStr != "" {
		if o, err := strconv.Atoi(oStr); err == nil && o >= 0 {
			offset = o
		}
	}

	resp, err := h.repository.ListNotifications(r.Context(), domain.ListNotificationsQuery{
		RecipientID:   recipientID,
		RecipientRole: recipientRole,
		UnreadOnly:    unreadOnly,
		Limit:         limit,
		Offset:        offset,
	})
	if err != nil {
		log.Printf("ListNotifications error: %v", err)
		http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Printf("ListNotifications encode error: %v", err)
	}
}

func (h *NotificationsHandler) MarkNotificationRead(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, `{"error":"missing_id"}`, http.StatusBadRequest)
		return
	}

	recipientID := r.Header.Get("X-Dev-Client-Id")
	if recipientID == "" {
		recipientID = "dev-client-001"
	}

	if err := h.repository.MarkNotificationRead(r.Context(), id, recipientID); err != nil {
		log.Printf("MarkNotificationRead error: %v", err)
		http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ok":true}`))
}
