package httpapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// PaymentHandler handles payment session lifecycle.
// POST   /payment/sessions                    — create (DSH or frontend)
// GET    /payment/sessions/{id}               — status
// POST   /payment/sessions/{id}/confirm       — provider webhook: payment confirmed
// POST   /payment/sessions/{id}/fail          — provider webhook: payment failed
type PaymentHandler struct {
	repo store.Repository
	mux  *http.ServeMux
}

func NewPaymentHandler(repo store.Repository) *PaymentHandler {
	h := &PaymentHandler{repo: repo, mux: http.NewServeMux()}
	h.mux.HandleFunc("POST /payment/sessions", h.Create)
	h.mux.HandleFunc("GET /payment/sessions/{id}", h.Get)
	h.mux.HandleFunc("POST /payment/sessions/{id}/confirm", h.Confirm)
	h.mux.HandleFunc("POST /payment/sessions/{id}/fail", h.Fail)
	return h
}

func RegisterPaymentRoutes(mux *http.ServeMux, repo store.Repository) {
	h := NewPaymentHandler(repo)
	mux.Handle("POST /payment/sessions", h)
	mux.Handle("GET /payment/sessions/{id}", h)
	mux.Handle("POST /payment/sessions/{id}/confirm", h)
	mux.Handle("POST /payment/sessions/{id}/fail", h)
}

func (h *PaymentHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// Create — POST /payment/sessions
// Called by DSH checkout flow (or mobile frontend via DSH proxy) when client confirms cart.
func (h *PaymentHandler) Create(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	var req domain.CreatePaymentSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CheckoutIntentID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "checkout_intent_id is required")
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

	log.Printf("wlt-api: POST /payment/sessions intent=%s client=%s amount=%.2f",
		req.CheckoutIntentID, req.ClientID, req.Amount)

	ps, err := h.repo.CreatePaymentSession(r.Context(), req)
	if err != nil {
		log.Printf("wlt-api: create payment session error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, ps)
}

// Get — GET /payment/sessions/{id}
func (h *PaymentHandler) Get(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	id := r.PathValue("id")
	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing payment session id")
		return
	}

	ps, err := h.repo.GetPaymentSession(r.Context(), id)
	if err != nil {
		if err.Error() == "payment session not found" {
			notFound(w)
			return
		}
		log.Printf("wlt-api: get payment session error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		if ps.ClientID != sess.Subject {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another subject's payment session")
			return
		}
	}

	writeJSON(w, http.StatusOK, ps)
}

// Confirm — POST /payment/sessions/{id}/confirm
// Called by payment provider webhook when payment is confirmed.
// WLT then calls DSH POST /checkout/payment-callback.
func (h *PaymentHandler) Confirm(w http.ResponseWriter, r *http.Request) {
	// Provider webhooks must carry WLT callback token for internal calls,
	// or system role for operator-triggered test confirms.
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
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing payment session id")
		return
	}

	var req domain.ConfirmPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	log.Printf("wlt-api: POST /payment/sessions/%s/confirm provider_ref=%s", id, req.ProviderRef)

	ps, err := h.repo.ConfirmPaymentSession(r.Context(), id, req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: confirm payment session error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	// Send callback to DSH asynchronously so we respond to the provider quickly.
	go func() {
		if err := sendPaymentCallbackToDSH(ps); err != nil {
			log.Printf("wlt-api: DSH payment callback failed for session=%s: %v", ps.ID, err)
		}
	}()

	writeJSON(w, http.StatusOK, ps)
}

// Fail — POST /payment/sessions/{id}/fail
// Called by payment provider when payment fails.
func (h *PaymentHandler) Fail(w http.ResponseWriter, r *http.Request) {
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
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing payment session id")
		return
	}

	var req domain.FailPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}
	if req.FailureReason == "" {
		req.FailureReason = domain.FailureReasonProviderError
	}

	log.Printf("wlt-api: POST /payment/sessions/%s/fail reason=%s", id, req.FailureReason)

	ps, err := h.repo.FailPaymentSession(r.Context(), id, req.FailureReason)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			notFound(w)
			return
		}
		log.Printf("wlt-api: fail payment session error: %v", err)
		writeError(w, http.StatusUnprocessableEntity, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	go func() {
		if err := sendPaymentCallbackToDSH(ps); err != nil {
			log.Printf("wlt-api: DSH payment fail-callback failed for session=%s: %v", ps.ID, err)
		}
	}()

	writeJSON(w, http.StatusOK, ps)
}

// sendPaymentCallbackToDSH calls DSH POST /checkout/payment-callback.
// Contract: DSH checkout_handler.go ReceivePaymentCallback.
func sendPaymentCallbackToDSH(ps domain.PaymentSession) error {
	baseURL := ps.DshBaseURL
	if baseURL == "" {
		baseURL = dshBaseURL()
	}

	status := "confirmed"
	if ps.Status == domain.PaymentStatusFailed {
		status = "failed"
	}

	eventID := fmt.Sprintf("wlt-pay-%s-%d", ps.ID, time.Now().UnixMilli())

	payload := map[string]any{
		"intent_id":        ps.CheckoutIntentID,
		"wlt_payment_ref_id": ps.ID,
		"status":           status,
	}
	if ps.FailureReason != nil {
		payload["failure_reason"] = *ps.FailureReason
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal callback payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, baseURL+"/checkout/payment-callback", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build callback request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", wltCallbackSecret())
	req.Header.Set("X-WLT-Event-Id", eventID)
	req.Header.Set("Idempotency-Key", ps.IdempotencyKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send callback: %w", err)
	}
	defer resp.Body.Close() //nolint:errcheck

	if resp.StatusCode >= 300 {
		return fmt.Errorf("DSH payment callback returned status %d", resp.StatusCode)
	}
	log.Printf("wlt-api: DSH payment callback delivered session=%s status=%s dsh_status=%d",
		ps.ID, status, resp.StatusCode)
	return nil
}

// sendSettlementCallbackToDSH calls DSH POST /orders/{order_id}/settlement-callback.
// Contract: DSH orders_handler.go SettlementCallback.
func sendSettlementCallbackToDSH(s domain.Settlement) error {
	baseURL := s.DshBaseURL
	if baseURL == "" {
		baseURL = dshBaseURL()
	}

	payload := map[string]string{
		"settlement_ref_id": s.ID,
		"status":            s.Status,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal settlement callback payload: %w", err)
	}

	url := fmt.Sprintf("%s/orders/%s/settlement-callback", baseURL, s.OrderID)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build settlement callback request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", wltCallbackSecret())

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send settlement callback: %w", err)
	}
	defer resp.Body.Close() //nolint:errcheck

	if resp.StatusCode >= 300 {
		return fmt.Errorf("DSH settlement callback returned status %d", resp.StatusCode)
	}
	log.Printf("wlt-api: DSH settlement callback delivered settlement=%s order=%s dsh_status=%d",
		s.ID, s.OrderID, resp.StatusCode)
	return nil
}

func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers",
		"Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type, Idempotency-Key")
}
