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

func TestReadinessHandlerValidation(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewReadinessHandler(repository)

	// Since memory repository is used, any valid call to Create/List/Update will trigger
	// the expected "requires postgres backend" error. This is a good way to verify the handler
	// forwards queries properly to repository.

	t.Run("POST /stores/{id}/readiness-escalations validation", func(t *testing.T) {
		body, _ := json.Marshal(domain.CreateFieldReadinessEscalationRequest{
			Reason:     "Missing document proof",
			TargetTeam: "partner-management",
		})
		req := httptest.NewRequest(http.MethodPost, "/stores/store-1/readiness-escalations", bytes.NewBuffer(body))
		req.SetPathValue("id", "store-1")
		req.Header.Set("X-Client-Id", "field-1")
		req.Header.Set("X-Actor-Type", "field")
		resp := httptest.NewRecorder()
		handler.ServeHTTP(resp, req)

		// Expected response since we are using memory repository stub: 500 Internal Server Error (contains the stub error message)
		if resp.Code != http.StatusInternalServerError {
			t.Fatalf("expected code %d, got %d", http.StatusInternalServerError, resp.Code)
		}

		var errResp domain.ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			t.Fatal(err)
		}
		if errResp.Message != "readiness escalation requires postgres backend (set DATABASE_URL)" {
			t.Fatalf("expected memory repo error, got: %s", errResp.Message)
		}
	})

	t.Run("GET /readiness-escalations validation", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/readiness-escalations?status=escalated", nil)
		req.Header.Set("X-Client-Id", "operator-1")
		req.Header.Set("X-Actor-Type", "operator")
		resp := httptest.NewRecorder()
		handler.ServeHTTP(resp, req)

		if resp.Code != http.StatusInternalServerError {
			t.Fatalf("expected code %d, got %d", http.StatusInternalServerError, resp.Code)
		}
	})

	t.Run("PATCH /readiness-escalations/{id} validation", func(t *testing.T) {
		body, _ := json.Marshal(domain.UpdateFieldReadinessEscalationRequest{
			Status:       "resolved",
			OperatorNote: "Resolved via dashboard",
		})
		req := httptest.NewRequest(http.MethodPatch, "/readiness-escalations/esc-1", bytes.NewBuffer(body))
		req.SetPathValue("id", "esc-1")
		req.Header.Set("X-Client-Id", "operator-1")
		req.Header.Set("X-Actor-Type", "operator")
		resp := httptest.NewRecorder()
		handler.ServeHTTP(resp, req)

		if resp.Code != http.StatusInternalServerError {
			t.Fatalf("expected code %d, got %d", http.StatusInternalServerError, resp.Code)
		}
	})

	t.Run("POST /stores/{id}/readiness-approvals validation", func(t *testing.T) {
		body, _ := json.Marshal(domain.CreateFieldReadinessApprovalRequest{
			Decision: "approved",
			Reason:   "All OK",
		})
		req := httptest.NewRequest(http.MethodPost, "/stores/store-1/readiness-approvals", bytes.NewBuffer(body))
		req.SetPathValue("id", "store-1")
		req.Header.Set("X-Client-Id", "operator-1")
		req.Header.Set("X-Actor-Type", "operator")
		resp := httptest.NewRecorder()
		handler.ServeHTTP(resp, req)

		if resp.Code != http.StatusInternalServerError {
			t.Fatalf("expected code %d, got %d", http.StatusInternalServerError, resp.Code)
		}
	})

	t.Run("GET /stores/{id}/readiness-approvals/latest validation", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/stores/store-1/readiness-approvals/latest", nil)
		req.SetPathValue("id", "store-1")
		req.Header.Set("X-Client-Id", "operator-1")
		req.Header.Set("X-Actor-Type", "operator")
		resp := httptest.NewRecorder()
		handler.ServeHTTP(resp, req)

		if resp.Code != http.StatusInternalServerError {
			t.Fatalf("expected code %d, got %d", http.StatusInternalServerError, resp.Code)
		}
	})
}
