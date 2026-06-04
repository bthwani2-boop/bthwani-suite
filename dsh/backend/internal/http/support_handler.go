package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
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
	return h
}

func RegisterSupportRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewSupportHandler(repository)
	mux.Handle("POST /support/escalations", h)
}

func (h *SupportHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
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
