package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// SettlementHandler handles financial clearing for completed orders.
// POST /settlements                   — create settlement (operator)
// GET  /settlements                   — list settlements (operator)
// GET  /settlements/{id}              — get settlement detail
// POST /settlements/{id}/process      — PENDING → PROCESSING
// POST /settlements/{id}/complete     — PROCESSING → COMPLETED
// POST /settlements/{id}/fail         — any → FAILED
type SettlementHandler struct {
	repo store.Repository
	mux  *http.ServeMux
}

func NewSettlementHandler(repo store.Repository) *SettlementHandler {
	h := &SettlementHandler{repo: repo, mux: http.NewServeMux()}
	h.mux.HandleFunc("POST /settlements", h.Create)
	h.mux.HandleFunc("GET /settlements", h.List)
	h.mux.HandleFunc("GET /settlements/{id}", h.Get)
	h.mux.HandleFunc("POST /settlements/{id}/process", h.Process)
	h.mux.HandleFunc("POST /settlements/{id}/complete", h.Complete)
	h.mux.HandleFunc("POST /settlements/{id}/fail", h.Fail)
	return h
}

func RegisterSettlementRoutes(mux *http.ServeMux, repo store.Repository) {
	h := NewSettlementHandler(repo)
	mux.Handle("POST /settlements", h)
	mux.Handle("GET /settlements", h)
	mux.Handle("GET /settlements/{id}", h)
	mux.Handle("POST /settlements/{id}/process", h)
	mux.Handle("POST /settlements/{id}/complete", h)
	mux.Handle("POST /settlements/{id}/fail", h)
}

func (h *SettlementHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// Create — POST /settlements
func (h *SettlementHandler) Create(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	var req domain.CreateSettlementRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.OrderID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order_id is required")
		return
	}
	if req.PartnerID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "partner_id is required")
		return
	}
	if req.GrossAmount <= 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "gross_amount must be greater than 0")
		return
	}
	if req.PlatformFeeRate < 0 || req.PlatformFeeRate > 1 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "platform_fee_rate must be between 0 and 1")
		return
	}
	if req.CaptainFeeRate < 0 || req.CaptainFeeRate > 1 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_fee_rate must be between 0 and 1")
		return
	}
	if req.IdempotencyKey == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "idempotency_key is required")
		return
	}

	log.Printf("wlt-api: POST /settlements order=%s partner=%s gross=%.2f", req.OrderID, req.PartnerID, req.GrossAmount)

	s, err := h.repo.CreateSettlement(r.Context(), req)
	if err != nil {
		log.Printf("wlt-api: create settlement error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, s)
}

// List — GET /settlements?status=PENDING&limit=50&offset=0
func (h *SettlementHandler) List(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	q := r.URL.Query()
	status := strings.ToUpper(strings.TrimSpace(q.Get("status")))
	partnerID := q.Get("partner_id")
	captainID := q.Get("captain_id")
	limit := 50
	if raw := q.Get("limit"); raw != "" {
		if v, err := strconv.Atoi(raw); err == nil && v > 0 {
			limit = v
		}
	}
	offset := 0
	if raw := q.Get("offset"); raw != "" {
		if v, err := strconv.Atoi(raw); err == nil && v >= 0 {
			offset = v
		}
	}

	resp, err := h.repo.ListSettlements(r.Context(), domain.ListSettlementsQuery{
		Status:    status,
		PartnerID: partnerID,
		CaptainID: captainID,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		log.Printf("wlt-api: list settlements error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// Get — GET /settlements/{id}
func (h *SettlementHandler) Get(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing settlement id")
		return
	}

	s, err := h.repo.GetSettlement(r.Context(), id)
	if err != nil {
		if err.Error() == "settlement not found" {
			notFound(w)
			return
		}
		log.Printf("wlt-api: get settlement error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		isPartner := s.PartnerID == sess.Subject
		isCaptain := s.CaptainID != nil && *s.CaptainID == sess.Subject
		if !isPartner && !isCaptain {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another subject's settlement")
			return
		}
	}

	writeJSON(w, http.StatusOK, s)
}

// Process — POST /settlements/{id}/process
func (h *SettlementHandler) Process(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing settlement id")
		return
	}

	log.Printf("wlt-api: POST /settlements/%s/process", id)

	s, err := h.repo.ProcessSettlement(r.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: process settlement error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, s)
}

// Complete — POST /settlements/{id}/complete
// Transitions PROCESSING → COMPLETED and delivers POST /orders/{order_id}/settlement-callback to DSH.
func (h *SettlementHandler) Complete(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing settlement id")
		return
	}

	log.Printf("wlt-api: POST /settlements/%s/complete", id)

	s, err := h.repo.CompleteSettlement(r.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: complete settlement error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	// Notify DSH asynchronously so operator receives the response immediately.
	go func() {
		if cbErr := sendSettlementCallbackToDSH(s); cbErr != nil {
			log.Printf("wlt-api: DSH settlement callback failed for settlement=%s: %v", s.ID, cbErr)
		} else {
			if markErr := h.repo.MarkSettlementCallbackSent(r.Context(), s.ID); markErr != nil {
				log.Printf("wlt-api: mark settlement callback sent error: %v", markErr)
			}
		}
	}()

	writeJSON(w, http.StatusOK, s)
}

// Fail — POST /settlements/{id}/fail
func (h *SettlementHandler) Fail(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing settlement id")
		return
	}

	var body struct {
		Reason string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Reason == "" {
		body.Reason = "operator_rejected"
	}

	log.Printf("wlt-api: POST /settlements/%s/fail reason=%s", id, body.Reason)

	s, err := h.repo.FailSettlement(r.Context(), id, body.Reason)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: fail settlement error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, s)
}
