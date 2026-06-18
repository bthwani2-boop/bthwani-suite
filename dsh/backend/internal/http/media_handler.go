package httpapi

// Retired manifest-key-based media attach/delete endpoints.
// Runtime upload goes to POST /media/upload-intents (media_runtime_handler.go).
// Runtime delete goes to DELETE /media/{media_id} (media_runtime_handler.go).

import (
	"encoding/json"
	"log"
	"net/http"
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

// RegisterMediaRoutes keeps legacy dev-fixture media endpoints retired.
func RegisterMediaRoutes(mux *http.ServeMux, repository store.CatalogRepository) {
	log.Print("dsh-api: legacy dev-fixture media routes retired; use /media/upload-intents and /media/{media_id}")
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
	log.Print("dsh-api: POST /dev-fixtures/product-media [RETIRED]")

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

	writeError(w, http.StatusGone, domain.ErrorCodeInvalidParameter, "legacy media_key fixture upload is retired; use /media/upload-intents")
	return
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
