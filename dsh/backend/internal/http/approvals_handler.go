package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type ApprovalsHandler struct {
	repository store.CatalogRepository
	mux        *http.ServeMux
}

func NewApprovalsHandler(repository store.CatalogRepository) *ApprovalsHandler {
	h := &ApprovalsHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("POST /catalog-approvals", h.CreateApproval)
	return h
}

func RegisterApprovalsRoutes(mux *http.ServeMux, repository store.CatalogRepository) {
	h := NewApprovalsHandler(repository)
	mux.Handle("POST /catalog-approvals", h)
}

func (h *ApprovalsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *ApprovalsHandler) CreateApproval(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /catalog-approvals")

	operatorID := requireClientIdentity(w, r)
	if operatorID == "" {
		return
	}
	if !HasRole(r, "operator") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	var req domain.UpdateCatalogApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	req.ItemID = strings.TrimSpace(req.ItemID)
	req.Action = strings.TrimSpace(req.Action)
	req.Note = strings.TrimSpace(req.Note)

	if req.ItemID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "item_id is required")
		return
	}

	if req.Action == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "action is required")
		return
	}

	if req.Action != "approve" && req.Action != "reject" && req.Action != "needs-fix" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid action (must be approve, reject, or needs-fix)")
		return
	}

	if (req.Action == "reject" || req.Action == "needs-fix") && req.Note == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "note/evidence is required for reject or needs-fix actions")
		return
	}

	rec, err := h.repository.CreateCatalogApproval(r.Context(), operatorID, req)
	if err != nil {
		log.Printf("dsh-api: create catalog approval error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to record catalog approval")
		return
	}

	writeJSON(w, http.StatusOK, rec)
}
