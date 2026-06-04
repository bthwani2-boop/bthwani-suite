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

// ProductsHandler handles product identity CRUD for J-002 / DSH-SLICE-002A.
// Routes:
//   POST   /stores/{store_id}/products         — create product
//   GET    /stores/{store_id}/products         — list products for a store
//   GET    /products/{id}                      — get single product
//   PATCH  /products/{id}                      — update product identity

type ProductsHandler struct {
	repository store.Repository
	mux        *http.ServeMux
}

func NewProductsHandler(repository store.Repository) *ProductsHandler {
	h := &ProductsHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("POST /stores/{store_id}/products", h.CreateProduct)
	h.mux.HandleFunc("GET /stores/{store_id}/products", h.ListProducts)
	h.mux.HandleFunc("GET /products/{id}", h.GetProduct)
	h.mux.HandleFunc("PATCH /products/{id}", h.UpdateProduct)
	return h
}

func RegisterProductRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewProductsHandler(repository)
	mux.Handle("POST /stores/{store_id}/products", h)
	mux.Handle("GET /stores/{store_id}/products", h)
	mux.Handle("GET /products/{id}", h)
	mux.Handle("PATCH /products/{id}", h)
}

func (h *ProductsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *ProductsHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("store_id")
	log.Printf("dsh-api: POST /stores/%s/products", storeID)

	if storeID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store_id")
		return
	}

	var req domain.CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if strings.TrimSpace(req.Name) == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "name is required")
		return
	}

	record, err := h.repository.CreateProduct(r.Context(), storeID, req)
	if err != nil {
		log.Printf("dsh-api: create product error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to create product")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *ProductsHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	storeID := r.PathValue("store_id")
	log.Printf("dsh-api: GET /stores/%s/products", storeID)

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

	approvalStatus := strings.TrimSpace(r.URL.Query().Get("approval_status"))

	resp, err := h.repository.ListProducts(r.Context(), storeID, approvalStatus, limit, offset)
	if err != nil {
		log.Printf("dsh-api: list products error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to list products")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *ProductsHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: GET /products/%s", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing product id")
		return
	}

	record, err := h.repository.GetProduct(r.Context(), id)
	if err != nil {
		if err.Error() == "product not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *ProductsHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: PATCH /products/%s", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing product id")
		return
	}

	var req domain.UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	// Validate name if provided
	if req.Name != nil && strings.TrimSpace(*req.Name) == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "name cannot be empty")
		return
	}

	record, err := h.repository.UpdateProduct(r.Context(), id, req)
	if err != nil {
		if err.Error() == "product not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, record)
}
