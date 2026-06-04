package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type CheckoutHandler struct {
	repository store.Repository
	mux        *http.ServeMux
}

func NewCheckoutHandler(repository store.Repository) *CheckoutHandler {
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

func RegisterCheckoutRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewCheckoutHandler(repository)
	mux.Handle("GET /cart/serviceability", h)
	mux.Handle("POST /checkout/intent", h)
	mux.Handle("DELETE /checkout/intent/{id}", h)
	mux.Handle("POST /checkout/payment-callback", h)
}

func (h *CheckoutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// clientIDFromRequest extracts client identity from X-Client-Id header.
// In production this will be replaced by auth.openapi.yaml GET /auth/session verification.
func clientIDFromRequest(r *http.Request) string {
	return strings.TrimSpace(r.Header.Get("X-Client-Id"))
}

// GetCartServiceability — DSH-SLICE-003A
// GET /cart/serviceability?store_id=...&item_ids=...
func (h *CheckoutHandler) GetCartServiceability(w http.ResponseWriter, r *http.Request) {
	clientID := clientIDFromRequest(r)
	if clientID == "" {
		writeError(w, http.StatusUnauthorized, domain.ErrorCodeInvalidParameter, "X-Client-Id header required")
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
	clientID := clientIDFromRequest(r)
	if clientID == "" {
		writeError(w, http.StatusUnauthorized, domain.ErrorCodeInvalidParameter, "X-Client-Id header required")
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
	clientID := clientIDFromRequest(r)
	if clientID == "" {
		writeError(w, http.StatusUnauthorized, domain.ErrorCodeInvalidParameter, "X-Client-Id header required")
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
// Called by WLT service after payment decision.
// DSH stores wlt_payment_ref_id as reference only — no financial mutation.
func (h *CheckoutHandler) ReceivePaymentCallback(w http.ResponseWriter, r *http.Request) {
	var req domain.PaymentCallbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid callback payload")
		return
	}

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

	log.Printf("dsh-api: POST /checkout/payment-callback intent=%s status=%s wlt_ref=%s",
		req.IntentID, req.Status, req.WltPaymentRefID)

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

	writeJSON(w, http.StatusOK, resp)
}
