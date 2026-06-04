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

func TestCreateOrderValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewOrdersHandler(repository)

	// Case 1: Missing store_id
	body, _ := json.Marshal(domain.CreateOrderRequest{
		ClientID: "client-1",
		Items:    []domain.OrderItemInput{{ProductID: "prod-1", Quantity: 1, Price: 10.0}},
	})
	req := httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBuffer(body))
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Missing client_id
	body, _ = json.Marshal(domain.CreateOrderRequest{
		StoreID: "store-1",
		Items:   []domain.OrderItemInput{{ProductID: "prod-1", Quantity: 1, Price: 10.0}},
	})
	req = httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBuffer(body))
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 3: Empty items
	body, _ = json.Marshal(domain.CreateOrderRequest{
		StoreID:  "store-1",
		ClientID: "client-1",
		Items:    []domain.OrderItemInput{},
	})
	req = httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBuffer(body))
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
