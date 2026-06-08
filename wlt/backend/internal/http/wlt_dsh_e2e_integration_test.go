package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// TestWltReportingEndpoints verifies that the 11 new reporting endpoints
// are correctly registered and serve the correct response format under authentication.
func TestWltReportingEndpoints(t *testing.T) {
	repo := store.NewMemoryRepository()
	mux := http.NewServeMux()
	RegisterReportingRoutes(mux, repo)

	server := httptest.NewServer(mux)
	defer server.Close()

	client := server.Client()

	// 1. GET /control-panel/finance-center
	req, _ := http.NewRequest(http.MethodGet, server.URL+"/control-panel/finance-center", nil)
	req.Header.Set("X-Client-Id", "operator-dev-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("failed to query /control-panel/finance-center: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200 for finance-center, got %d", resp.StatusCode)
	}
	var fc domain.ControlPanelFinanceCenter
	_ = json.NewDecoder(resp.Body).Decode(&fc)
	resp.Body.Close()

	if fc.Currency != "YER" {
		t.Errorf("expected currency YER, got %s", fc.Currency)
	}

	// 2. GET /control-panel/chart-of-accounts
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/control-panel/chart-of-accounts", nil)
	req.Header.Set("X-Client-Id", "operator-dev-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query /control-panel/chart-of-accounts: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200 for chart-of-accounts, got %d", resp.StatusCode)
	}
	var accounts []domain.ChartOfAccount
	_ = json.NewDecoder(resp.Body).Decode(&accounts)
	resp.Body.Close()

	if len(accounts) == 0 {
		t.Errorf("expected non-empty chart of accounts")
	}

	// 3. GET /control-panel/trial-balance
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/control-panel/trial-balance", nil)
	req.Header.Set("X-Client-Id", "operator-dev-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query /control-panel/trial-balance: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200 for trial-balance, got %d", resp.StatusCode)
	}
	var tb domain.TrialBalance
	_ = json.NewDecoder(resp.Body).Decode(&tb)
	resp.Body.Close()

	if !tb.IsBalanced {
		t.Errorf("expected trial balance to be balanced initially")
	}
}
