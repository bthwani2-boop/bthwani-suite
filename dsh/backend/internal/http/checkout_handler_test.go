package httpapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

// ─── GET /cart/serviceability ─────────────────────────────────────────────────

func TestGetCartServiceability_MissingClientID(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability?store_id=store-1001", nil)
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.Code)
	}
}

func TestGetCartServiceability_MissingStoreID(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability", nil)
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestGetCartServiceability_StoreNotFound(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability?store_id=nonexistent", nil)
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", resp.Code)
	}
}

func TestGetCartServiceability_OpenStore(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability?store_id=store-1001", nil)
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", resp.Code, resp.Body.String())
	}

	var result domain.CartServiceabilityResponse
	if err := json.Unmarshal(resp.Body.Bytes(), &result); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if result.StoreID != "store-1001" {
		t.Fatalf("expected store_id=store-1001, got %s", result.StoreID)
	}
}

// ─── POST /checkout/intent ───────────────────────────────────────────────────

func TestCreateCheckoutIntent_MissingClientID(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.Code)
	}
}

func TestCreateCheckoutIntent_MissingStoreID(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestCreateCheckoutIntent_MissingDeliveryAddress(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID: "store-1001",
		Items:   []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestCreateCheckoutIntent_EmptyItems(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{},
		DeliveryAddress: "شارع الجمهورية",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestCreateCheckoutIntent_InvalidItemQuantity(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 0}},
		DeliveryAddress: "شارع الجمهورية",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestCreateCheckoutIntent_Success(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 2}},
		DeliveryAddress: "شارع الجمهورية",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", resp.Code, resp.Body.String())
	}

	var result domain.CheckoutIntentResponse
	if err := json.Unmarshal(resp.Body.Bytes(), &result); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if result.IntentID == "" {
		t.Fatal("expected non-empty intent_id")
	}
	if result.SessionToken == "" {
		t.Fatal("expected non-empty session_token")
	}
	if result.Status != domain.CheckoutStatusPendingPayment {
		t.Fatalf("expected status=%s, got %s", domain.CheckoutStatusPendingPayment, result.Status)
	}
}

func TestCreateCheckoutIntent_DuplicateConflict(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})

	// First request — must succeed
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-conflict-test")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)
	if resp.Code != http.StatusCreated {
		t.Fatalf("first intent: expected 201, got %d", resp.Code)
	}

	// Second identical request — must return 409
	body, _ = json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	req = httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-conflict-test")
	resp = httptest.NewRecorder()
	h.ServeHTTP(resp, req)
	if resp.Code != http.StatusConflict {
		t.Fatalf("duplicate intent: expected 409, got %d body=%s", resp.Code, resp.Body.String())
	}
}

// ─── DELETE /checkout/intent/{id} ────────────────────────────────────────────

func TestCancelCheckoutIntent_NotFound(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodDelete, "/checkout/intent/nonexistent", nil)
	req.Header.Set("X-Client-Id", "client-101")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", resp.Code)
	}
}

func TestCancelCheckoutIntent_MissingClientID(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodDelete, "/checkout/intent/some-id", nil)
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.Code)
	}
}

func TestCancelCheckoutIntent_Success(t *testing.T) {
	repo := store.NewMemoryRepository()
	h := NewCheckoutHandler(repo)

	// Create intent first
	createBody, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(createBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Id", "client-cancel-test")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)
	if resp.Code != http.StatusCreated {
		t.Fatalf("create: expected 201, got %d", resp.Code)
	}

	var created domain.CheckoutIntentResponse
	json.Unmarshal(resp.Body.Bytes(), &created)

	// Now cancel it
	req = httptest.NewRequest(http.MethodDelete, "/checkout/intent/"+created.IntentID, nil)
	req.Header.Set("X-Client-Id", "client-cancel-test")
	resp = httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("cancel: expected 200, got %d body=%s", resp.Code, resp.Body.String())
	}

	var result domain.CancelCheckoutIntentResponse
	if err := json.Unmarshal(resp.Body.Bytes(), &result); err != nil {
		t.Fatalf("decode cancel response: %v", err)
	}
	if result.Status != domain.CheckoutStatusCancelled {
		t.Fatalf("expected status=cancelled, got %s", result.Status)
	}
	if !result.CartPreserved {
		t.Fatal("expected cart_preserved=true")
	}
}

// ─── POST /checkout/payment-callback ─────────────────────────────────────────

func TestReceivePaymentCallback_MissingToken(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        "intent-1",
		WltPaymentRefID: "wlt-ref-1",
		Status:          "confirmed",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.Code)
	}
}

func TestReceivePaymentCallback_MissingEventID(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        "intent-1",
		WltPaymentRefID: "wlt-ref-1",
		Status:          "confirmed",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	req.Header.Set("Idempotency-Key", "idem-missing-event")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestReceivePaymentCallback_MissingIdempotencyKey(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        "intent-1",
		WltPaymentRefID: "wlt-ref-1",
		Status:          "confirmed",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	req.Header.Set("X-WLT-Event-Id", "evt-missing-idem")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestReceivePaymentCallback_InvalidStatus(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        "intent-1",
		WltPaymentRefID: "wlt-ref-1",
		Status:          "unknown",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	req.Header.Set("X-WLT-Event-Id", "evt-001")
	req.Header.Set("Idempotency-Key", "idem-invalid-status")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestReceivePaymentCallback_IntentNotFound(t *testing.T) {
	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        "nonexistent-intent",
		WltPaymentRefID: "wlt-ref-1",
		Status:          "confirmed",
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	req.Header.Set("X-WLT-Event-Id", "evt-001")
	req.Header.Set("Idempotency-Key", "idem-intent-not-found")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", resp.Code)
	}
}

func TestReceivePaymentCallback_ConfirmedFlow(t *testing.T) {
	repo := store.NewMemoryRepository()
	h := NewCheckoutHandler(repo)

	// Create intent
	createBody, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	createReq := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(createBody))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("X-Client-Id", "client-cb-test")
	createResp := httptest.NewRecorder()
	h.ServeHTTP(createResp, createReq)
	if createResp.Code != http.StatusCreated {
		t.Fatalf("create intent: expected 201, got %d", createResp.Code)
	}
	var created domain.CheckoutIntentResponse
	json.Unmarshal(createResp.Body.Bytes(), &created)

	// Send confirmed callback
	cbBody, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        created.IntentID,
		WltPaymentRefID: "wlt-sess-confirmed-001",
		Status:          "confirmed",
	})
	cbReq := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(cbBody))
	cbReq.Header.Set("Content-Type", "application/json")
	cbReq.Header.Set("X-WLT-Callback-Token", "dev-secret")
	cbReq.Header.Set("X-WLT-Event-Id", "evt-confirmed-001")
	cbReq.Header.Set("Idempotency-Key", "idem-confirmed-001")
	cbResp := httptest.NewRecorder()
	h.ServeHTTP(cbResp, cbReq)

	if cbResp.Code != http.StatusOK {
		t.Fatalf("callback: expected 200, got %d body=%s", cbResp.Code, cbResp.Body.String())
	}
	var result domain.PaymentCallbackResponse
	if err := json.Unmarshal(cbResp.Body.Bytes(), &result); err != nil {
		t.Fatalf("decode callback response: %v", err)
	}
	if !result.Acknowledged {
		t.Fatal("expected acknowledged=true")
	}
	if result.NextAction != "create_order" {
		t.Fatalf("expected next_action=create_order, got %s", result.NextAction)
	}
}

func TestReceivePaymentCallback_DuplicateEventIDReturnsIdempotentAck(t *testing.T) {
	repo := store.NewMemoryRepository()
	h := NewCheckoutHandler(repo)

	createBody, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	createReq := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(createBody))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("X-Client-Id", "client-cb-replay-test")
	createResp := httptest.NewRecorder()
	h.ServeHTTP(createResp, createReq)
	if createResp.Code != http.StatusCreated {
		t.Fatalf("create intent: expected 201, got %d", createResp.Code)
	}
	var created domain.CheckoutIntentResponse
	json.Unmarshal(createResp.Body.Bytes(), &created)

	cbBody, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        created.IntentID,
		WltPaymentRefID: "wlt-sess-replay-001",
		Status:          "confirmed",
	})
	for i := 0; i < 2; i++ {
		cbReq := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(cbBody))
		cbReq.Header.Set("Content-Type", "application/json")
		cbReq.Header.Set("X-WLT-Callback-Token", "dev-secret")
		cbReq.Header.Set("X-WLT-Event-Id", "evt-replay-001")
		cbReq.Header.Set("Idempotency-Key", "idem-replay-001")
		cbResp := httptest.NewRecorder()
		h.ServeHTTP(cbResp, cbReq)

		if cbResp.Code != http.StatusOK {
			t.Fatalf("callback attempt %d: expected 200, got %d body=%s", i+1, cbResp.Code, cbResp.Body.String())
		}
		var result domain.PaymentCallbackResponse
		if err := json.Unmarshal(cbResp.Body.Bytes(), &result); err != nil {
			t.Fatalf("decode callback attempt %d: %v", i+1, err)
		}
		if !result.Acknowledged || result.NextAction != "create_order" {
			t.Fatalf("callback attempt %d: unexpected response %+v", i+1, result)
		}
	}
}

func TestReceivePaymentCallback_FailedFlow(t *testing.T) {
	repo := store.NewMemoryRepository()
	h := NewCheckoutHandler(repo)

	// Create intent
	createBody, _ := json.Marshal(domain.CheckoutIntentRequest{
		StoreID:         "store-1001",
		Items:           []domain.CheckoutIntentItem{{ProductID: "prod-1", Quantity: 1}},
		DeliveryAddress: "شارع الجمهورية",
	})
	createReq := httptest.NewRequest(http.MethodPost, "/checkout/intent", bytes.NewBuffer(createBody))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("X-Client-Id", "client-fail-test")
	createResp := httptest.NewRecorder()
	h.ServeHTTP(createResp, createReq)
	var created domain.CheckoutIntentResponse
	json.Unmarshal(createResp.Body.Bytes(), &created)

	// Send failed callback
	reason := "insufficient_balance"
	cbBody, _ := json.Marshal(domain.PaymentCallbackRequest{
		IntentID:        created.IntentID,
		WltPaymentRefID: "wlt-sess-failed-001",
		Status:          "failed",
		FailureReason:   &reason,
	})
	cbReq := httptest.NewRequest(http.MethodPost, "/checkout/payment-callback", bytes.NewBuffer(cbBody))
	cbReq.Header.Set("Content-Type", "application/json")
	cbReq.Header.Set("X-WLT-Callback-Token", "dev-secret")
	cbReq.Header.Set("X-WLT-Event-Id", "evt-failed-001")
	cbReq.Header.Set("Idempotency-Key", "idem-failed-001")
	cbResp := httptest.NewRecorder()
	h.ServeHTTP(cbResp, cbReq)

	if cbResp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", cbResp.Code)
	}
	var result domain.PaymentCallbackResponse
	json.Unmarshal(cbResp.Body.Bytes(), &result)
	if result.NextAction != "show_failure" {
		t.Fatalf("expected next_action=show_failure, got %s", result.NextAction)
	}
}
