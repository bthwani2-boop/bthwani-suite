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

type ReadinessHandler struct {
	repository store.Repository
	mux        *http.ServeMux
}

func NewReadinessHandler(repository store.Repository) *ReadinessHandler {
	h := &ReadinessHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}

	// J-006D: Escalations
	h.mux.HandleFunc("POST /stores/{id}/readiness-escalations", h.CreateReadinessEscalation)
	h.mux.HandleFunc("GET /readiness-escalations", h.ListReadinessEscalations)
	h.mux.HandleFunc("PATCH /readiness-escalations/{id}", h.UpdateReadinessEscalation)

	// J-006E: Approvals
	h.mux.HandleFunc("POST /stores/{id}/readiness-approvals", h.CreateReadinessApproval)
	h.mux.HandleFunc("GET /stores/{id}/readiness-approvals/latest", h.GetLatestReadinessApproval)

	return h
}

func RegisterReadinessRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewReadinessHandler(repository)
	mux.Handle("POST /stores/{id}/readiness-escalations", h)
	mux.Handle("GET /readiness-escalations", h)
	mux.Handle("PATCH /readiness-escalations/{id}", h)
	mux.Handle("POST /stores/{id}/readiness-approvals", h)
	mux.Handle("GET /stores/{id}/readiness-approvals/latest", h)
}

func (h *ReadinessHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// POST /stores/{id}/readiness-escalations
func (h *ReadinessHandler) CreateReadinessEscalation(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("id")
	log.Printf("dsh-api: POST /stores/%s/readiness-escalations", storeID)

	var req domain.CreateFieldReadinessEscalationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	rec, err := h.repository.CreateFieldReadinessEscalation(r.Context(), storeID, req)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		log.Printf("dsh-api: create readiness escalation error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, rec)
}

// GET /readiness-escalations
func (h *ReadinessHandler) ListReadinessEscalations(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /readiness-escalations")

	status := r.URL.Query().Get("status")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 20
	if limitStr != "" {
		if val, err := strconv.Atoi(limitStr); err == nil && val > 0 {
			limit = val
		}
	}

	offset := 0
	if offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil && val >= 0 {
			offset = val
		}
	}

	query := domain.ListFieldReadinessEscalationsQuery{
		Status: status,
		Limit:  limit,
		Offset: offset,
	}

	res, err := h.repository.ListFieldReadinessEscalations(r.Context(), query)
	if err != nil {
		log.Printf("dsh-api: list readiness escalations error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "failed to list escalations")
		return
	}

	writeJSON(w, http.StatusOK, res)
}

// PATCH /readiness-escalations/{id}
func (h *ReadinessHandler) UpdateReadinessEscalation(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: PATCH /readiness-escalations/%s", id)

	var req domain.UpdateFieldReadinessEscalationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	rec, err := h.repository.UpdateFieldReadinessEscalation(r.Context(), id, req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: update readiness escalation error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, rec)
}

// POST /stores/{id}/readiness-approvals
func (h *ReadinessHandler) CreateReadinessApproval(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("id")
	log.Printf("dsh-api: POST /stores/%s/readiness-approvals", storeID)

	var req domain.CreateFieldReadinessApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	rec, err := h.repository.CreateFieldReadinessApproval(r.Context(), storeID, req)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		log.Printf("dsh-api: create readiness approval error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, rec)
}

// GET /stores/{id}/readiness-approvals/latest
func (h *ReadinessHandler) GetLatestReadinessApproval(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("id")
	log.Printf("dsh-api: GET /stores/%s/readiness-approvals/latest", storeID)

	rec, err := h.repository.GetLatestFieldReadinessApproval(r.Context(), storeID)
	if err != nil {
		if strings.Contains(err.Error(), "no approval found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: get latest readiness approval error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, rec)
}
