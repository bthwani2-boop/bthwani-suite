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

// CategoriesHandler handles category CRUD for J-002 / DSH-SLICE-002B.
// Routes:
//   POST   /stores/{store_id}/categories       — create category
//   GET    /stores/{store_id}/categories       — list categories for a store
//   GET    /categories/{id}                    — get single category
//   PATCH  /categories/{id}                    — update category
//   DELETE /categories/{id}                    — delete category

type CategoriesHandler struct {
	repository store.CatalogRepository
	mux        *http.ServeMux
}

func NewCategoriesHandler(repository store.CatalogRepository) *CategoriesHandler {
	h := &CategoriesHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("POST /stores/{store_id}/categories", h.CreateCategory)
	h.mux.HandleFunc("GET /stores/{store_id}/categories", h.ListCategories)
	h.mux.HandleFunc("GET /categories/{id}", h.GetCategory)
	h.mux.HandleFunc("PATCH /categories/{id}", h.UpdateCategory)
	h.mux.HandleFunc("DELETE /categories/{id}", h.DeleteCategory)
	return h
}

func RegisterCategoryRoutes(mux *http.ServeMux, repository store.CatalogRepository) {
	h := NewCategoriesHandler(repository)
	mux.Handle("POST /stores/{store_id}/categories", h)
	mux.Handle("GET /stores/{store_id}/categories", h)
	mux.Handle("GET /categories/{id}", h)
	mux.Handle("PATCH /categories/{id}", h)
	mux.Handle("DELETE /categories/{id}", h)
}

func (h *CategoriesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *CategoriesHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("store_id")
	log.Printf("dsh-api: POST /stores/%s/categories", storeID)

	operatorID := requireClientIdentity(w, r)
	if operatorID == "" {
		return
	}
	if !HasRole(r, "partner") && !HasRole(r, "operator") && !HasRole(r, "system") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized role")
		return
	}
	if HasRole(r, "partner") {
		partnerStore := getPartnerStoreID(operatorID)
		if partnerStore == "" || partnerStore != storeID {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized store access")
			return
		}
	}

	if storeID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store_id")
		return
	}

	var req domain.CreateCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if strings.TrimSpace(req.Name) == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "name is required")
		return
	}

	record, err := h.repository.CreateCategory(r.Context(), storeID, req)
	if err != nil {
		log.Printf("dsh-api: create category error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, record)
}


func (h *CategoriesHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("store_id")
	log.Printf("dsh-api: GET /stores/%s/categories", storeID)

	if storeID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store_id")
		return
	}

	limit := defaultLimit
	if rawLimit := strings.TrimSpace(r.URL.Query().Get("limit")); rawLimit != "" {
		parsed, err := strconv.Atoi(rawLimit)
		if err != nil || parsed < 1 || parsed > maxLimit {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "limit must be between 1 and 100")
			return
		}
		limit = parsed
	}

	offset := 0
	if rawOffset := strings.TrimSpace(r.URL.Query().Get("offset")); rawOffset != "" {
		parsed, err := strconv.Atoi(rawOffset)
		if err != nil || parsed < 0 {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "offset must be >= 0")
			return
		}
		offset = parsed
	}

	resp, err := h.repository.ListCategories(r.Context(), storeID, limit, offset)
	if err != nil {
		log.Printf("dsh-api: list categories error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *CategoriesHandler) GetCategory(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: GET /categories/%s", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing category id")
		return
	}

	record, err := h.repository.GetCategory(r.Context(), id)
	if err != nil {
		if err.Error() == "category not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "category not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *CategoriesHandler) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: PATCH /categories/%s", id)

	operatorID := requireClientIdentity(w, r)
	if operatorID == "" {
		return
	}
	if !HasRole(r, "partner") && !HasRole(r, "operator") && !HasRole(r, "system") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized role")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing category id")
		return
	}

	// Fetch category first to verify store ownership for partner
	record, err := h.repository.GetCategory(r.Context(), id)
	if err != nil {
		if err.Error() == "category not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "category not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if HasRole(r, "partner") {
		partnerStore := getPartnerStoreID(operatorID)
		if partnerStore == "" || partnerStore != record.StoreID {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized store access")
			return
		}
	}

	var req domain.UpdateCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.Name != nil && strings.TrimSpace(*req.Name) == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "name cannot be empty")
		return
	}

	record, err = h.repository.UpdateCategory(r.Context(), id, req)
	if err != nil {
		if err.Error() == "category not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "category not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *CategoriesHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: DELETE /categories/%s", id)

	operatorID := requireClientIdentity(w, r)
	if operatorID == "" {
		return
	}
	if !HasRole(r, "partner") && !HasRole(r, "operator") && !HasRole(r, "system") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized role")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing category id")
		return
	}

	// Fetch category first to verify store ownership for partner
	record, err := h.repository.GetCategory(r.Context(), id)
	if err != nil {
		if err.Error() == "category not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "category not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if HasRole(r, "partner") {
		partnerStore := getPartnerStoreID(operatorID)
		if partnerStore == "" || partnerStore != record.StoreID {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized store access")
			return
		}
	}

	err = h.repository.DeleteCategory(r.Context(), id)
	if err != nil {
		if err.Error() == "category not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "category not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
