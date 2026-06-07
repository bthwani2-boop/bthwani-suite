package httpapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

func TestCreateOrderValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing store_id
	body, _ := json.Marshal(domain.CreateOrderRequest{
		ClientID: "client-1",
		Items:    []domain.OrderItemInput{{ProductID: "prod-1", Quantity: 1, Price: 10.0}},
	})
	req := httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "client-1")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: client_id body mismatch with authenticated identity
	body, _ = json.Marshal(domain.CreateOrderRequest{
		StoreID:  "store-1",
		ClientID: "client-from-body",
		Items:    []domain.OrderItemInput{{ProductID: "prod-1", Quantity: 1, Price: 10.0}},
	})
	req = httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "client-from-header")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusForbidden {
		t.Fatalf("expected code %d, got %d", http.StatusForbidden, resp.Code)
	}

	// Case 3: Empty items
	body, _ = json.Marshal(domain.CreateOrderRequest{
		StoreID:  "store-1",
		ClientID: "client-1",
		Items:    []domain.OrderItemInput{},
	})
	req = httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "client-1")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}
}

func TestUpdateOrderStatusValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Invalid status
	body, _ := json.Marshal(domain.UpdateOrderStatusRequest{
		Actor:  "client",
		Status: "INVALID_STATUS",
	})
	req := httptest.NewRequest(http.MethodPatch, "/orders/ord-123/status", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Invalid actor
	body, _ = json.Marshal(domain.UpdateOrderStatusRequest{
		Actor:  "invalid-actor",
		Status: "ACCEPTED",
	})
	req = httptest.NewRequest(http.MethodPatch, "/orders/ord-123/status", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}
}

func TestAssignCaptainValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing captain_id in body
	body, _ := json.Marshal(struct {
		CaptainID string `json:"captain_id"`
	}{
		CaptainID: "",
	})
	req := httptest.NewRequest(http.MethodPost, "/orders/ord-123/assign-captain", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Order not found
	body, _ = json.Marshal(struct {
		CaptainID string `json:"captain_id"`
	}{
		CaptainID: "captain-1",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-non-existent/assign-captain", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-non-existent")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestAcceptTaskValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing captain_id in body
	body, _ := json.Marshal(struct {
		CaptainID string `json:"captain_id"`
	}{
		CaptainID: "",
	})
	req := httptest.NewRequest(http.MethodPost, "/orders/ord-123/accept-task", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Order not found
	body, _ = json.Marshal(struct {
		CaptainID string `json:"captain_id"`
	}{
		CaptainID: "captain-1",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-non-existent/accept-task", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-non-existent")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestDeclineTaskValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing captain_id in body
	body, _ := json.Marshal(struct {
		CaptainID string `json:"captain_id"`
		Reason    string `json:"reason"`
	}{
		CaptainID: "",
		Reason:    "too_far",
	})
	req := httptest.NewRequest(http.MethodPost, "/orders/ord-123/decline-task", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Missing reason in body
	body, _ = json.Marshal(struct {
		CaptainID string `json:"captain_id"`
		Reason    string `json:"reason"`
	}{
		CaptainID: "captain-1",
		Reason:    "",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-123/decline-task", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 3: Order not found
	body, _ = json.Marshal(struct {
		CaptainID string `json:"captain_id"`
		Reason    string `json:"reason"`
	}{
		CaptainID: "captain-1",
		Reason:    "too_far",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-non-existent/decline-task", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-non-existent")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestConfirmPickupValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing captain_id in body
	body, _ := json.Marshal(struct {
		CaptainID string `json:"captain_id"`
	}{
		CaptainID: "",
	})
	req := httptest.NewRequest(http.MethodPost, "/orders/ord-123/pickup", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Order not found
	body, _ = json.Marshal(struct {
		CaptainID string `json:"captain_id"`
	}{
		CaptainID: "captain-1",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-non-existent/pickup", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-non-existent")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestUpdateCaptainLocationValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing captain_id
	body, _ := json.Marshal(struct {
		CaptainID       string  `json:"captain_id"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		LifecycleStatus string  `json:"lifecycle_status"`
		OrderStatus     string  `json:"order_status"`
	}{
		CaptainID:       "",
		Latitude:        15.3234,
		Longitude:       44.1234,
		LifecycleStatus: "MOVING",
		OrderStatus:     "EN_ROUTE",
	})
	req := httptest.NewRequest(http.MethodPost, "/orders/ord-123/location", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Missing lifecycle_status
	body, _ = json.Marshal(struct {
		CaptainID       string  `json:"captain_id"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		LifecycleStatus string  `json:"lifecycle_status"`
		OrderStatus     string  `json:"order_status"`
	}{
		CaptainID:       "captain-1",
		Latitude:        15.3234,
		Longitude:       44.1234,
		LifecycleStatus: "",
		OrderStatus:     "EN_ROUTE",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-123/location", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 3: Invalid order status
	body, _ = json.Marshal(struct {
		CaptainID       string  `json:"captain_id"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		LifecycleStatus string  `json:"lifecycle_status"`
		OrderStatus     string  `json:"order_status"`
	}{
		CaptainID:       "captain-1",
		Latitude:        15.3234,
		Longitude:       44.1234,
		LifecycleStatus: "MOVING",
		OrderStatus:     "INVALID",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-123/location", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 4: Order not found
	body, _ = json.Marshal(struct {
		CaptainID       string  `json:"captain_id"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		LifecycleStatus string  `json:"lifecycle_status"`
		OrderStatus     string  `json:"order_status"`
	}{
		CaptainID:       "captain-1",
		Latitude:        15.3234,
		Longitude:       44.1234,
		LifecycleStatus: "MOVING",
		OrderStatus:     "EN_ROUTE",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-non-existent/location", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-non-existent")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestGetCaptainLocationValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Order not found
	req := httptest.NewRequest(http.MethodGet, "/orders/ord-non-existent/location", nil)
	req.SetPathValue("id", "ord-non-existent")
	req.Header.Set("X-Client-Id", "client-1")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestRefundOrderCallbackValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing refund_ref_id
	body, _ := json.Marshal(struct {
		RefundRefID string  `json:"refund_ref_id"`
		Amount      float64 `json:"amount"`
		Status      string  `json:"status"`
	}{
		RefundRefID: "",
		Amount:      10.0,
		Status:      "CONFIRMED",
	})
	req := httptest.NewRequest(http.MethodPost, "/orders/ord-123/refund-callback", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Invalid amount (<=0)
	body, _ = json.Marshal(struct {
		RefundRefID string  `json:"refund_ref_id"`
		Amount      float64 `json:"amount"`
		Status      string  `json:"status"`
	}{
		RefundRefID: "ref-123",
		Amount:      0.0,
		Status:      "CONFIRMED",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-123/refund-callback", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 3: Invalid status
	body, _ = json.Marshal(struct {
		RefundRefID string  `json:"refund_ref_id"`
		Amount      float64 `json:"amount"`
		Status      string  `json:"status"`
	}{
		RefundRefID: "ref-123",
		Amount:      10.0,
		Status:      "INVALID",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-123/refund-callback", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-123")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 4: Order not found (ord-non-existent)
	body, _ = json.Marshal(struct {
		RefundRefID string  `json:"refund_ref_id"`
		Amount      float64 `json:"amount"`
		Status      string  `json:"status"`
	}{
		RefundRefID: "ref-123",
		Amount:      10.0,
		Status:      "CONFIRMED",
	})
	req = httptest.NewRequest(http.MethodPost, "/orders/ord-non-existent/refund-callback", bytes.NewBuffer(body))
	req.SetPathValue("id", "ord-non-existent")
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected code %d, got %d", http.StatusNotFound, resp.Code)
	}
}

func TestGetWltWalletSummaryValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing authentication/client identity (no X-Client-Id header)
	req := httptest.NewRequest(http.MethodGet, "/wlt/wallet-summary", nil)
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected code %d, got %d", http.StatusUnauthorized, resp.Code)
	}

	// Case 2: Authenticated request (with X-Client-Id header)
	req = httptest.NewRequest(http.MethodGet, "/wlt/wallet-summary", nil)
	req.Header.Set("X-Client-Id", "client-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected code %d, got %d", http.StatusOK, resp.Code)
	}

	var balance struct {
		BalanceMinorUnits int64  `json:"balanceMinorUnits"`
		Currency          string `json:"currency"`
		Linked            bool   `json:"linked"`
		FrozenMinorUnits  int64  `json:"frozenMinorUnits"`
		UpdatedAt         string `json:"updatedAt"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&balance); err != nil {
		t.Fatalf("failed to decode response body: %v", err)
	}

	if balance.BalanceMinorUnits != 1000000 {
		t.Fatalf("expected balance 1000000, got %d", balance.BalanceMinorUnits)
	}
	if balance.Currency != "YER" {
		t.Fatalf("expected currency YER, got %s", balance.Currency)
	}
	if !balance.Linked {
		t.Fatalf("expected linked true, got false")
	}
}

func TestGetWltSettlementValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: GET /settlements without X-Client-Id -> 401
	req := httptest.NewRequest(http.MethodGet, "/settlements", nil)
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)
	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected code %d, got %d", http.StatusUnauthorized, resp.Code)
	}

	// Case 2: POST /settlement/candidates without X-Client-Id -> 401
	req = httptest.NewRequest(http.MethodPost, "/settlement/candidates", nil)
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)
	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected code %d, got %d", http.StatusUnauthorized, resp.Code)
	}

	// Case 3: POST /settlement/candidates with X-Client-Id but invalid body -> 400
	req = httptest.NewRequest(http.MethodPost, "/settlement/candidates", strings.NewReader("invalid json"))
	req.Header.Set("X-Client-Id", "client-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)
	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 4: POST /settlement/candidates with X-Client-Id but empty order_ids -> 400
	req = httptest.NewRequest(http.MethodPost, "/settlement/candidates", strings.NewReader(`{"order_ids": []}`))
	req.Header.Set("X-Client-Id", "client-123")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)
	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 5: POST /wlt/settlement-callback with missing parameters -> 400
	req = httptest.NewRequest(http.MethodPost, "/wlt/settlement-callback", strings.NewReader(`{"status": "CONFIRMED"}`))
	req.Header.Set("X-WLT-Callback-Token", "dev-secret")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)
	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}
}
