package httpapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// RefundHandler handles the refund lifecycle.
// POST /refunds                     — initiate refund (operator)
// GET  /refunds/{id}                — status
// POST /refunds/{id}/process        — move PENDING → PROCESSING (operator approval)
// POST /refunds/{id}/confirm        — move PROCESSING → CONFIRMED (operator/provider)
// POST /refunds/{id}/fail           — move any → FAILED (operator)
type RefundHandler struct {
	repo store.Repository
	mux  *http.ServeMux
}

func NewRefundHandler(repo store.Repository) *RefundHandler {
	h := &RefundHandler{repo: repo, mux: http.NewServeMux()}
	h.mux.HandleFunc("GET /refunds", h.List)
	h.mux.HandleFunc("POST /refunds", h.Create)
	h.mux.HandleFunc("GET /refunds/{id}", h.Get)
	h.mux.HandleFunc("POST /refunds/{id}/process", h.Process)
	h.mux.HandleFunc("POST /refunds/{id}/confirm", h.Confirm)
	h.mux.HandleFunc("POST /refunds/{id}/fail", h.Fail)
	return h
}

func RegisterRefundRoutes(mux *http.ServeMux, repo store.Repository) {
	h := NewRefundHandler(repo)
	mux.Handle("GET /refunds", h)
	mux.Handle("POST /refunds", h)
	mux.Handle("GET /refunds/{id}", h)
	mux.Handle("POST /refunds/{id}/process", h)
	mux.Handle("POST /refunds/{id}/confirm", h)
	mux.Handle("POST /refunds/{id}/fail", h)
}

func (h *RefundHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// List — GET /refunds?status=PENDING&client_id=xxx&order_id=xxx&limit=50&offset=0
func (h *RefundHandler) List(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	q := r.URL.Query()
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
	clientID := q.Get("client_id")
	orderID := q.Get("order_id")
	status := strings.ToUpper(strings.TrimSpace(q.Get("status")))

	// Non-operators may only list their own refunds.
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		if clientID == "" {
			clientID = sess.Subject
		} else if clientID != sess.Subject {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot list another subject's refunds")
			return
		}
	}

	resp, err := h.repo.ListRefunds(r.Context(), domain.ListRefundsQuery{
		Status:   status,
		ClientID: clientID,
		OrderID:  orderID,
		Limit:    limit,
		Offset:   offset,
	})
	if err != nil {
		log.Printf("wlt-api: list refunds error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// Create — POST /refunds
func (h *RefundHandler) Create(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	var req domain.CreateRefundRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.OrderID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order_id is required")
		return
	}
	if req.ClientID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "client_id is required")
		return
	}
	if req.Amount <= 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "amount must be greater than 0")
		return
	}
	if req.IdempotencyKey == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "idempotency_key is required")
		return
	}
	if req.DshBaseURL == "" {
		req.DshBaseURL = dshBaseURL()
	}

	log.Printf("wlt-api: POST /refunds order=%s client=%s amount=%.2f", req.OrderID, req.ClientID, req.Amount)

	ref, err := h.repo.CreateRefund(r.Context(), req)
	if err != nil {
		log.Printf("wlt-api: create refund error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, ref)
}

// Get — GET /refunds/{id}
func (h *RefundHandler) Get(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing refund id")
		return
	}

	ref, err := h.repo.GetRefund(r.Context(), id)
	if err != nil {
		if err.Error() == "refund not found" {
			notFound(w)
			return
		}
		log.Printf("wlt-api: get refund error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		if ref.ClientID != sess.Subject {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another subject's refund")
			return
		}
	}

	writeJSON(w, http.StatusOK, ref)
}

// Process — POST /refunds/{id}/process
// Operator approves the refund, moving it PENDING → PROCESSING.
func (h *RefundHandler) Process(w http.ResponseWriter, r *http.Request) {
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
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing refund id")
		return
	}

	log.Printf("wlt-api: POST /refunds/%s/process", id)

	ref, err := h.repo.ProcessRefund(r.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: process refund error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, ref)
}

// Confirm — POST /refunds/{id}/confirm
// Operator or provider confirms refund execution, moving PROCESSING → CONFIRMED.
// WLT then calls DSH POST /orders/{order_id}/refund-callback.
func (h *RefundHandler) Confirm(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing refund id")
		return
	}

	log.Printf("wlt-api: POST /refunds/%s/confirm", id)

	ref, err := h.repo.ConfirmRefund(r.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: confirm refund error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	go func() {
		if cbErr := sendRefundCallbackToDSH(ref); cbErr != nil {
			log.Printf("wlt-api: DSH refund callback failed for refund=%s: %v", ref.ID, cbErr)
		} else {
			if markErr := h.repo.MarkRefundCallbackSent(r.Context(), ref.ID); markErr != nil {
				log.Printf("wlt-api: mark refund callback sent error: %v", markErr)
			}
		}
	}()

	writeJSON(w, http.StatusOK, ref)
}

// Fail — POST /refunds/{id}/fail
func (h *RefundHandler) Fail(w http.ResponseWriter, r *http.Request) {
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
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing refund id")
		return
	}

	var body struct {
		Reason string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Reason == "" {
		body.Reason = "operator_rejected"
	}

	log.Printf("wlt-api: POST /refunds/%s/fail reason=%s", id, body.Reason)

	ref, err := h.repo.FailRefund(r.Context(), id, body.Reason)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: fail refund error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	// Notify DSH that refund failed so order can be updated accordingly.
	go func() {
		if cbErr := sendRefundCallbackToDSH(ref); cbErr != nil {
			log.Printf("wlt-api: DSH refund-fail callback error: %v", cbErr)
		}
	}()

	writeJSON(w, http.StatusOK, ref)
}

// sendRefundCallbackToDSH calls DSH POST /orders/{order_id}/refund-callback.
// Contract: DSH orders_handler.go RefundOrderCallback.
func sendRefundCallbackToDSH(ref domain.Refund) error {
	baseURL := ref.DshBaseURL
	if baseURL == "" {
		baseURL = dshBaseURL()
	}

	status := "CONFIRMED"
	if ref.Status == domain.RefundStatusFailed {
		status = "FAILED"
	}

	payload := map[string]string{
		"refund_ref_id": ref.ID,
		"status":        status,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal refund callback payload: %w", err)
	}

	url := fmt.Sprintf("%s/orders/%s/refund-callback", baseURL, ref.OrderID)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build refund callback request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", wltCallbackSecret())

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send refund callback: %w", err)
	}
	defer resp.Body.Close() //nolint:errcheck

	if resp.StatusCode >= 300 {
		return fmt.Errorf("DSH refund callback returned status %d", resp.StatusCode)
	}
	log.Printf("wlt-api: DSH refund callback delivered refund=%s order=%s status=%s dsh_status=%d",
		ref.ID, ref.OrderID, status, resp.StatusCode)
	return nil
}
