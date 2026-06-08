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

func TestCreateCatalogApprovalValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewApprovalsHandler(repository)
	// DEV mode: supply operator identity via X-Client-Id + X-Actor-Type
	t.Setenv("DSH_AUTH_MODE", "dev")

	// Case 1: Missing item_id
	body, _ := json.Marshal(domain.UpdateCatalogApprovalRequest{
		Action: "approve",
	})
	req := httptest.NewRequest(http.MethodPost, "/catalog-approvals", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "operator-dev-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	var errResp domain.ErrorResponse
	if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
		t.Fatal(err)
	}
	if errResp.Code != domain.ErrorCodeInvalidParameter {
		t.Fatalf("expected error code %s, got %s", domain.ErrorCodeInvalidParameter, errResp.Code)
	}

	// Case 2: Invalid action
	body, _ = json.Marshal(domain.UpdateCatalogApprovalRequest{
		ItemID: "prod-1",
		Action: "invalid-action",
	})
	req = httptest.NewRequest(http.MethodPost, "/catalog-approvals", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "operator-dev-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}

	// Case 3: Missing note for reject/needs-fix
	body, _ = json.Marshal(domain.UpdateCatalogApprovalRequest{
		ItemID: "prod-1",
		Action: "reject",
	})
	req = httptest.NewRequest(http.MethodPost, "/catalog-approvals", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "operator-dev-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp = httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected code %d, got %d", http.StatusBadRequest, resp.Code)
	}
}

func TestCreateCatalogApproval_NoAuth_Returns401(t *testing.T) {
	t.Setenv("DSH_AUTH_MODE", "dev")
	handler := NewApprovalsHandler(store.NewMemoryRepository())

	body, _ := json.Marshal(domain.UpdateCatalogApprovalRequest{
		ItemID: "prod-1",
		Action: "approve",
	})
	req := httptest.NewRequest(http.MethodPost, "/catalog-approvals", bytes.NewBuffer(body))
	// No X-Client-Id → should 401
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 without auth, got %d", resp.Code)
	}
}

func TestCreateCatalogApproval_ClientRole_Returns403(t *testing.T) {
	t.Setenv("DSH_AUTH_MODE", "dev")
	handler := NewApprovalsHandler(store.NewMemoryRepository())

	body, _ := json.Marshal(domain.UpdateCatalogApprovalRequest{
		ItemID: "prod-1",
		Action: "approve",
	})
	req := httptest.NewRequest(http.MethodPost, "/catalog-approvals", bytes.NewBuffer(body))
	req.Header.Set("X-Client-Id", "client-dev-001")
	req.Header.Set("X-Actor-Type", "client") // wrong role
	resp := httptest.NewRecorder()
	handler.ServeHTTP(resp, req)

	if resp.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for client role, got %d", resp.Code)
	}
}
