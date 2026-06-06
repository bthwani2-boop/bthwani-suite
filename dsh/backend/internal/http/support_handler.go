package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type SupportHandler struct {
	repository store.Repository
	mux        *http.ServeMux
}

func NewSupportHandler(repository store.Repository) *SupportHandler {
	h := &SupportHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("POST /support/escalations", h.CreateSupportEscalation)
	h.mux.HandleFunc("GET /support/escalations", h.ListAllSupportEscalations)
	h.mux.HandleFunc("PATCH /support/escalations/{id}", h.UpdateSupportEscalation)
	return h
}

func RegisterSupportRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewSupportHandler(repository)
	mux.Handle("POST /support/escalations", h)
	mux.Handle("GET /support/escalations", h)
	mux.Handle("PATCH /support/escalations/{id}", h)
}

func (h *SupportHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *SupportHandler) CreateSupportEscalation(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /support/escalations")

	var req domain.CreateSupportEscalationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.OrderID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order_id is required")
		return
	}

	actor := strings.ToLower(strings.TrimSpace(req.Actor))
	if actor != "client" && actor != "partner" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "actor must be client or partner")
		return
	}

	issueType := strings.ToLower(strings.TrimSpace(req.IssueType))
	if issueType != "delayed_delivery" &&
		issueType != "wrong_items" &&
		issueType != "missing_items" &&
		issueType != "payment_issue" &&
		issueType != "other" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid issue_type")
		return
	}

	if strings.TrimSpace(req.Description) == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "description is required")
		return
	}

	record, err := h.repository.CreateSupportEscalation(r.Context(), req)
	if err != nil {
		if err.Error() == "order not found" || strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: create support escalation error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

// ListAllSupportEscalations handles GET /support/escalations — CP operator view (J-009C).
func (h *SupportHandler) ListAllSupportEscalations(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /support/escalations")
	if r.Method != http.MethodGet {
		writeSupportError(w, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	q := r.URL.Query()
	status := strings.TrimSpace(q.Get("status"))

	limit := 50
	if l := q.Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 && v <= 100 {
			limit = v
		}
	}
	offset := 0
	if o := q.Get("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = v
		}
	}

	res, err := h.repository.ListAllSupportEscalations(r.Context(), domain.ListAllSupportEscalationsQuery{
		Status: status,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		log.Printf("dsh-api: list all support escalations error: %v", err)
		writeSupportError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "failed to list escalations")
		return
	}

	writeJSON(w, http.StatusOK, res)
}

// UpdateSupportEscalation handles PATCH /support/escalations/{id} — operator updates status (J-009C).
func (h *SupportHandler) UpdateSupportEscalation(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: PATCH /support/escalations/%s", id)
	if r.Method != http.MethodPatch {
		writeSupportError(w, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}
	if strings.TrimSpace(id) == "" {
		writeSupportError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "escalation id is required")
		return
	}

	var req domain.UpdateSupportEscalationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeSupportError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	status := strings.ToLower(strings.TrimSpace(req.Status))
	if status != "in-review" && status != "resolved" {
		writeSupportError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be 'in-review' or 'resolved'")
		return
	}

	rec, err := h.repository.UpdateSupportEscalation(r.Context(), id, status)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			writeSupportError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: update support escalation error: %v", err)
		writeSupportError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "failed to update escalation")
		return
	}

	writeJSON(w, http.StatusOK, rec)
}

func writeSupportError(w http.ResponseWriter, status int, code domain.ErrorCode, message string) {
	writeJSON(w, status, domain.ErrorResponse{Code: code, Message: message})
}
