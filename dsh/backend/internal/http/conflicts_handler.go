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

type ConflictsHandler struct {
	repository store.CatalogRepository
	mux        *http.ServeMux
}

func NewConflictsHandler(repository store.CatalogRepository) *ConflictsHandler {
	h := &ConflictsHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("GET /catalog-conflicts", h.ListConflicts)
	h.mux.HandleFunc("POST /catalog-conflicts/{id}/resolve", h.ResolveConflict)
	return h
}

func RegisterConflictsRoutes(mux *http.ServeMux, repository store.CatalogRepository) {
	h := NewConflictsHandler(repository)
	mux.Handle("GET /catalog-conflicts", h)
	mux.Handle("POST /catalog-conflicts/{id}/resolve", h)
}

func (h *ConflictsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *ConflictsHandler) ListConflicts(w http.ResponseWriter, r *http.Request) {
	log.Print("dsh-api: GET /catalog-conflicts")

	storeID := strings.TrimSpace(r.URL.Query().Get("store_id"))
	status := strings.TrimSpace(r.URL.Query().Get("status"))

	limit := 20
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	offset := 0
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	resp, err := h.repository.ListConflicts(r.Context(), storeID, status, limit, offset)
	if err != nil {
		log.Printf("dsh-api: list conflicts error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to list conflicts")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *ConflictsHandler) ResolveConflict(w http.ResponseWriter, r *http.Request) {
	conflictID := r.PathValue("id")
	log.Printf("dsh-api: POST /catalog-conflicts/%s/resolve", conflictID)

	if conflictID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing conflict id")
		return
	}

	var req domain.ResolveConflictRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	req.Resolution = strings.TrimSpace(req.Resolution)
	if req.Resolution != "accept_local" && req.Resolution != "revert_to_central" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "resolution must be 'accept_local' or 'revert_to_central'")
		return
	}

	resp, err := h.repository.ResolveConflict(r.Context(), conflictID, req)
	if err != nil {
		log.Printf("dsh-api: resolve conflict error: %v", err)
		if strings.Contains(err.Error(), "conflict not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "conflict not found")
			return
		}
		if strings.Contains(err.Error(), "already resolved") {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "conflict is already resolved")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to resolve conflict")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}
