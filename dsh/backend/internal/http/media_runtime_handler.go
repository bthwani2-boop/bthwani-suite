package httpapi

// BTHWANI_MEDIA_RUNTIME: Upload-intent/complete/get/list/delete for dsh_media_assets.
// Uses MinIO/S3-compatible presigned PUT URLs — no binary stored in PostgreSQL.
// WLT boundary: WLT does not call these endpoints; it stores media_id references only.
// DEV_FIXTURE_ADAPTER: fixture-based POST /media (media_handler.go) remains for dev-only use.

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type MediaRuntimeHandler struct {
	repo store.PostgresMediaRepository
	cfg  store.MediaStorageConfig
	mux  *http.ServeMux
}

func NewMediaRuntimeHandler(repo store.PostgresMediaRepository, cfg store.MediaStorageConfig) *MediaRuntimeHandler {
	h := &MediaRuntimeHandler{repo: repo, cfg: cfg, mux: http.NewServeMux()}
	h.mux.HandleFunc("POST /media/upload-intents", h.CreateUploadIntent)
	h.mux.HandleFunc("POST /media/{media_id}/complete", h.CompleteUpload)
	h.mux.HandleFunc("GET /media/{media_id}", h.GetMedia)
	h.mux.HandleFunc("GET /media", h.ListMedia)
	h.mux.HandleFunc("DELETE /media/{media_id}", h.DeleteMedia)
	return h
}

func (h *MediaRuntimeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// RegisterMediaRuntimeRoutes wires the runtime media handler when PostgreSQL repo is available.
// Registers under separate patterns from the dev-fixture POST /media handler.
func RegisterMediaRuntimeRoutes(mux *http.ServeMux, repo store.PostgresMediaRepository, cfg store.MediaStorageConfig) {
	h := NewMediaRuntimeHandler(repo, cfg)
	mux.Handle("POST /media/upload-intents", h)
	mux.Handle("POST /media/{media_id}/complete", h)
	mux.Handle("GET /media/{media_id}", h)
	mux.Handle("GET /media", h)
	// DELETE /media/{media_id} is handled by media_handler.go for fixture-delete compatibility.
	// Runtime soft-delete is separate: registered as DELETE /media/{media_id}/soft-delete.
	mux.Handle("DELETE /media/{media_id}/soft-delete", h)
}

// POST /media/upload-intents
func (h *MediaRuntimeHandler) CreateUploadIntent(w http.ResponseWriter, r *http.Request) {
	log.Print("dsh-api: POST /media/upload-intents")

	actorID := requireClientIdentity(w, r)
	if actorID == "" {
		return
	}

	var req domain.CreateMediaUploadIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	req.OwnerType = strings.TrimSpace(req.OwnerType)
	req.OwnerID = strings.TrimSpace(req.OwnerID)
	req.Purpose = strings.TrimSpace(req.Purpose)
	req.Filename = strings.TrimSpace(req.Filename)

	if req.OwnerType == "" || req.OwnerID == "" || req.Purpose == "" || req.Filename == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "owner_type, owner_id, purpose, filename are required")
		return
	}
	if req.MediaType != "image" && req.MediaType != "video" && req.MediaType != "document" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media_type must be image, video, or document")
		return
	}
	if req.ActorID == "" {
		req.ActorID = actorID
	}

	// Scope guard: partner role limited to their own scope; operator unrestricted.
	if HasRole(r, "partner") && !HasRole(r, "operator") {
		allowed := ownerScopeAllowed(req.OwnerType)
		if !allowed {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "partner may only upload media for store or product owner types")
			return
		}
	}

	asset, intent, err := h.repo.CreateMediaUploadIntent(r.Context(), req, h.cfg)
	if err != nil {
		log.Printf("dsh-api: create upload intent error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to create upload intent")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"asset":  asset,
		"intent": intent,
	})
}

// POST /media/{media_id}/complete
func (h *MediaRuntimeHandler) CompleteUpload(w http.ResponseWriter, r *http.Request) {
	mediaID := r.PathValue("media_id")
	log.Printf("dsh-api: POST /media/%s/complete", mediaID)

	actorID := requireClientIdentity(w, r)
	if actorID == "" {
		return
	}
	if mediaID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media_id is required")
		return
	}

	asset, err := h.repo.CompleteMediaUpload(r.Context(), mediaID, h.cfg, actorID)
	if err != nil {
		log.Printf("dsh-api: complete upload error %s: %v", mediaID, err)
		if strings.Contains(err.Error(), "no rows") || strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "media asset not found")
			return
		}
		if strings.Contains(err.Error(), "cannot complete media in status") {
			writeError(w, http.StatusConflict, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to complete upload")
		return
	}

	writeJSON(w, http.StatusOK, asset)
}

// GET /media/{media_id}
func (h *MediaRuntimeHandler) GetMedia(w http.ResponseWriter, r *http.Request) {
	mediaID := r.PathValue("media_id")
	log.Printf("dsh-api: GET /media/%s", mediaID)

	if mediaID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media_id is required")
		return
	}

	asset, err := h.repo.GetMediaAsset(r.Context(), mediaID)
	if err != nil {
		if strings.Contains(err.Error(), "no rows") || strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "media asset not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to get media asset")
		return
	}

	writeJSON(w, http.StatusOK, asset)
}

// GET /media?owner_type=&owner_id=&purpose=&status=
func (h *MediaRuntimeHandler) ListMedia(w http.ResponseWriter, r *http.Request) {
	log.Print("dsh-api: GET /media")
	q := domain.ListMediaQuery{
		OwnerType: r.URL.Query().Get("owner_type"),
		OwnerID:   r.URL.Query().Get("owner_id"),
		Purpose:   r.URL.Query().Get("purpose"),
		Status:    r.URL.Query().Get("status"),
	}

	assets, err := h.repo.ListMediaAssets(r.Context(), q)
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to list media assets")
		return
	}
	if assets == nil {
		assets = []domain.MediaAsset{}
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": assets, "total": len(assets)})
}

// DELETE /media/{media_id}/soft-delete
func (h *MediaRuntimeHandler) DeleteMedia(w http.ResponseWriter, r *http.Request) {
	mediaID := r.PathValue("media_id")
	log.Printf("dsh-api: DELETE /media/%s/soft-delete (runtime)", mediaID)

	actorID := requireClientIdentity(w, r)
	if actorID == "" {
		return
	}
	if !HasRole(r, "operator") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required for media delete")
		return
	}
	if mediaID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media_id is required")
		return
	}

	if err := h.repo.SoftDeleteMediaAsset(r.Context(), mediaID); err != nil {
		if strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "media asset not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to delete media asset")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func ownerScopeAllowed(ownerType string) bool {
	return ownerType == "store" || ownerType == "product"
}
