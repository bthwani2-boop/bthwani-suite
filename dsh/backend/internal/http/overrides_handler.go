package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type OverridesHandler struct {
	repository store.CatalogRepository
	mux        *http.ServeMux
}

func NewOverridesHandler(repository store.CatalogRepository) *OverridesHandler {
	h := &OverridesHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("PATCH /stores/{store_id}/catalog-overrides", h.UpdateOverrides)
	return h
}

func RegisterOverridesRoutes(mux *http.ServeMux, repository store.CatalogRepository) {
	h := NewOverridesHandler(repository)
	mux.Handle("PATCH /stores/{store_id}/catalog-overrides", h)
}

func (h *OverridesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *OverridesHandler) UpdateOverrides(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("store_id")
	log.Printf("dsh-api: PATCH /stores/%s/catalog-overrides", storeID)

	if storeID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store_id")
		return
	}

	var req domain.UpdateCatalogOverridesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	for i, item := range req.Overrides {
		req.Overrides[i].ProductID = strings.TrimSpace(item.ProductID)
		if req.Overrides[i].ProductID == "" {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "product_id is required for all overrides")
			return
		}
	}

	resp, err := h.repository.UpdateCatalogOverrides(r.Context(), storeID, req)
	if err != nil {
		log.Printf("dsh-api: update catalog overrides error: %v", err)
		if strings.Contains(err.Error(), "violates foreign key constraint") || strings.Contains(err.Error(), "product not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "one or more products not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to update catalog overrides")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}
