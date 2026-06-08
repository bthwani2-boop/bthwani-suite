package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type CheckoutHandler struct {
	repository store.CheckoutRepository
	mux        *http.ServeMux
}

func NewCheckoutHandler(repository store.CheckoutRepository) *CheckoutHandler {
	h := &CheckoutHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("GET /cart/serviceability", h.GetCartServiceability)
	h.mux.HandleFunc("POST /checkout/intent", h.CreateCheckoutIntent)
	h.mux.HandleFunc("DELETE /checkout/intent/{id}", h.CancelCheckoutIntent)
	h.mux.HandleFunc("POST /checkout/payment-callback", h.ReceivePaymentCallback)
	return h
}

func RegisterCheckoutRoutes(mux *http.ServeMux, repository store.CheckoutRepository) {
	h := NewCheckoutHandler(repository)
	mux.Handle("GET /cart/serviceability", h)
	mux.Handle("POST /checkout/intent", h)
	mux.Handle("DELETE /checkout/intent/{id}", h)
	mux.Handle("POST /checkout/payment-callback", h)
}

func (h *CheckoutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-WLT-Callback-Token, X-WLT-Event-Id, Idempotency-Key")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// wltCallbackSecret is the shared secret for WLT callback authentication.
// DEV_ONLY: accepts "dev-secret". Production: must be set via WLT_CALLBACK_SECRET env var.
func wltCallbackSecret() string {
	if s := strings.TrimSpace(os.Getenv("WLT_CALLBACK_SECRET")); s != "" {
		return s
	}
	return "dev-secret"
}

// GetCartServiceability — DSH-SLICE-003A
// GET /cart/serviceability?store_id=...&item_ids=...
func (h *CheckoutHandler) GetCartServiceability(w http.ResponseWriter, r *http.Request) {
	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	storeID := strings.TrimSpace(r.URL.Query().Get("store_id"))
	if storeID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "store_id query parameter is required")
		return
	}

	itemIDs := r.URL.Query()["item_ids"]

	log.Printf("dsh-api: GET /cart/serviceability store=%s client=%s items=%v", storeID, clientID, itemIDs)

	result, err := h.repository.CheckCartServiceability(r.Context(), domain.CartServiceabilityQuery{
		StoreID: storeID,
		ItemIDs: itemIDs,
	})
	if err != nil {
		if err.Error() == "store not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		log.Printf("dsh-api: serviceability error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, result)
}

// CreateCheckoutIntent — DSH-SLICE-003B
// POST /checkout/intent
func (h *CheckoutHandler) CreateCheckoutIntent(w http.ResponseWriter, r *http.Request) {
	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	var req domain.CheckoutIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.StoreID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "store_id is required")
		return
	}
	if req.DeliveryAddress == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "delivery_address is required")
		return
	}
	if len(req.Items) == 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "items are required")
		return
	}
	for _, item := range req.Items {
		if item.ProductID == "" || item.Quantity < 1 {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "each item requires product_id and quantity >= 1")
			return
		}
	}

	log.Printf("dsh-api: POST /checkout/intent store=%s client=%s", req.StoreID, clientID)

	resp, err := h.repository.CreateCheckoutIntent(r.Context(), clientID, req)
	if err != nil {
		if err.Error() == "active checkout session already exists" {
			writeError(w, http.StatusConflict, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		if err.Error() == "store not found" {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		log.Printf("dsh-api: create checkout intent error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, resp)
}

// CancelCheckoutIntent — DSH-SLICE-003E
// DELETE /checkout/intent/{id}
func (h *CheckoutHandler) CancelCheckoutIntent(w http.ResponseWriter, r *http.Request) {
	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	intentID := r.PathValue("id")
	if intentID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing intent id")
		return
	}

	log.Printf("dsh-api: DELETE /checkout/intent/%s client=%s", intentID, clientID)

	resp, err := h.repository.CancelCheckoutIntent(r.Context(), intentID, clientID)
	if err != nil {
		switch err.Error() {
		case "intent not found":
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "intent not found")
		case "cannot cancel a confirmed payment intent":
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
		default:
			log.Printf("dsh-api: cancel checkout intent error: %v", err)
			writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		}
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// ReceivePaymentCallback — DSH-SLICE-003C
// POST /checkout/payment-callback
// Called by WLT service after payment decision (primary flow; polling is fallback only).
// DSH stores wlt_payment_ref_id as reference only — no financial mutation in DSH.
// 003D (order creation) is a SEPARATE subsequent step, not triggered here.
func (h *CheckoutHandler) ReceivePaymentCallback(w http.ResponseWriter, r *http.Request) {
	// Security: validate WLT callback token
	// DEV_ONLY: accepts "dev-secret". Production: WLT_CALLBACK_SECRET env var.
	callbackToken := strings.TrimSpace(r.Header.Get("X-WLT-Callback-Token"))
	if callbackToken == "" || callbackToken != wltCallbackSecret() {
		writeError(w, http.StatusUnauthorized, domain.ErrorCodeInvalidParameter, "missing or invalid X-WLT-Callback-Token")
		return
	}

	// Idempotency: X-WLT-Event-Id must be present (replay protection)
	eventID := strings.TrimSpace(r.Header.Get("X-WLT-Event-Id"))
	if eventID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "X-WLT-Event-Id header required for idempotency")
		return
	}

	idempotencyKey := strings.TrimSpace(r.Header.Get("Idempotency-Key"))
	if idempotencyKey == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "Idempotency-Key header required for callback/payment-session correlation")
		return
	}

	var req domain.PaymentCallbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid callback payload")
		return
	}
	req.CallbackEventID = eventID

	if req.IntentID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "intent_id is required")
		return
	}
	if req.WltPaymentRefID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "wlt_payment_ref_id is required")
		return
	}
	if req.Status != "confirmed" && req.Status != "failed" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be confirmed or failed")
		return
	}

	log.Printf("dsh-api: POST /checkout/payment-callback intent=%s status=%s event=%s",
		req.IntentID, req.Status, eventID)

	resp, err := h.repository.ProcessPaymentCallback(r.Context(), req)
	if err != nil {
		if err.Error() == "intent not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "intent not found")
			return
		}
		log.Printf("dsh-api: payment callback error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	// 003C completes here: intent status updated, wlt_payment_ref_id stored.
	// 003D (order creation via POST /orders) is a separate step owned by a
	// separate trigger — DSH does NOT create the order inside this callback.
	// next_action in the response signals what the caller should do next.
	writeJSON(w, http.StatusOK, resp)
}
