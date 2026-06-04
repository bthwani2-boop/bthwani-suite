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

func TestCreateSupportEscalationValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewSupportHandler(repository)

	// Case 1: Missing order_id
	body, _ := json.Marshal(domain.CreateSupportEscalationRequest{
		Actor:       "client",
		IssueType:   "delayed_delivery",
		Description: "Order delayed",
	})
	req := httptest.NewRequest(http.MethodPost, "/support/escalations", bytes.NewBuffer(body))
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 2: Invalid actor
	body, _ = json.Marshal(domain.CreateSupportEscalationRequest{
		OrderID:     "ord-123",
		Actor:       "invalid-actor",
		IssueType:   "delayed_delivery",
		Description: "Order delayed",
	})
	req = httptest.NewRequest(http.MethodPost, "/support/escalations", bytes.NewBuffer(body))
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 3: Invalid issue_type
	body, _ = json.Marshal(domain.CreateSupportEscalationRequest{
		OrderID:     "ord-123",
		Actor:       "client",
		IssueType:   "invalid-issue",
		Description: "Order delayed",
	})
	req = httptest.NewRequest(http.MethodPost, "/support/escalations", bytes.NewBuffer(body))
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 4: Missing description
	body, _ = json.Marshal(domain.CreateSupportEscalationRequest{
		OrderID:     "ord-123",
		Actor:       "client",
		IssueType:   "delayed_delivery",
		Description: "",
	})
	req = httptest.NewRequest(http.MethodPost, "/support/escalations", bytes.NewBuffer(body))
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}
}
