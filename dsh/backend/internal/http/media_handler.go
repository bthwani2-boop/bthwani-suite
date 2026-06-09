package httpapi

// DEV_FIXTURE_ADAPTER: manifest-key-based media attach/delete for seeding only.
// Routes: POST /dev-fixtures/product-media and DELETE /dev-fixtures/product-media/{id}
// Gated by DSH_ENABLE_DEV_FIXTURE_MEDIA=true (default false in Docker runtime).
// Runtime upload goes to POST /media/upload-intents (media_runtime_handler.go).
// Runtime delete goes to DELETE /media/{media_id} (media_runtime_handler.go).

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type MediaHandler struct {
	repository store.CatalogRepository
	mux        *http.ServeMux
}

func NewMediaHandler(repository store.CatalogRepository) *MediaHandler {
	h := &MediaHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("POST /dev-fixtures/product-media", h.CreateMedia)
	h.mux.HandleFunc("DELETE /dev-fixtures/product-media/{id}", h.DeleteMedia)
	return h
}

// RegisterMediaRoutes registers dev-fixture media routes only when DSH_ENABLE_DEV_FIXTURE_MEDIA=true.
// Default: disabled in Docker runtime. Never register in production.
func RegisterMediaRoutes(mux *http.ServeMux, repository store.CatalogRepository) {
	if strings.ToLower(strings.TrimSpace(os.Getenv("DSH_ENABLE_DEV_FIXTURE_MEDIA"))) != "true" {
		log.Print("dsh-api: dev-fixture media routes disabled (DSH_ENABLE_DEV_FIXTURE_MEDIA!=true)")
		return
	}
	log.Print("dsh-api: DEV_ONLY dev-fixture media routes enabled")
	h := NewMediaHandler(repository)
	mux.Handle("POST /dev-fixtures/product-media", h)
	mux.Handle("DELETE /dev-fixtures/product-media/{id}", h)
}

func (h *MediaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *MediaHandler) CreateMedia(w http.ResponseWriter, r *http.Request) {
	log.Print("dsh-api: POST /dev-fixtures/product-media [DEV_ONLY]")

	operatorID := requireClientIdentity(w, r)
	if operatorID == "" {
		return
	}
	if !HasRole(r, "operator") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	var req domain.UploadProductMediaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	req.ProductID = strings.TrimSpace(req.ProductID)
	req.MediaKey = strings.TrimSpace(req.MediaKey)

	if req.ProductID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "product_id is required")
		return
	}
	if req.MediaKey == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media_key is required")
		return
	}

	url := store.GetMediaURL(req.MediaKey)
	if url == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media key is not registered in manifest")
		return
	}

	record, err := h.repository.CreateProductMedia(r.Context(), req)
	if err != nil {
		log.Printf("dsh-api: create product media error: %v", err)
		if strings.Contains(err.Error(), "violates foreign key constraint") || strings.Contains(err.Error(), "product not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to create product media")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *MediaHandler) DeleteMedia(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: DELETE /dev-fixtures/product-media/%s [DEV_ONLY]", id)

	operatorID := requireClientIdentity(w, r)
	if operatorID == "" {
		return
	}
	if !HasRole(r, "operator") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing media id")
		return
	}

	err := h.repository.DeleteProductMedia(r.Context(), id)
	if err != nil {
		log.Printf("dsh-api: delete media error: %v", err)
		if strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "media record not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to delete media")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
