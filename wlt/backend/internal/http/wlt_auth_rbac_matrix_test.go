package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bthwani.local/wlt/backend/internal/store"
)

type mockAuthService struct {
	validToken string
	subject    string
	roles      []string
}

func (m *mockAuthService) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth != "Bearer "+m.validToken {
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "unauthenticated"})
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(authSessionResponse{
		Subject:   m.subject,
		AuthState: "authenticated",
		Roles:     m.roles,
	})
}

func TestWltAuthRbacMatrix(t *testing.T) {
	repo := store.NewMemoryRepository()
	mux := http.NewServeMux()

	RegisterPaymentRoutes(mux, repo)
	RegisterRefundRoutes(mux, repo)
	RegisterSettlementRoutes(mux, repo)
	RegisterWalletRoutes(mux, repo)
	RegisterHealthRoutes(mux, repo)
	RegisterOperatorRoutes(mux, repo)

	server := httptest.NewServer(mux)
	defer server.Close()

	// 1. Test GET /ledger - Operator only
	t.Run("LedgerOperatorAllowed", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "operator-jwt", subject: "operator-dev-001", roles: []string{"operator"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("WLT_AUTH_MODE", "production")
		t.Setenv("WLT_AUTH_SERVICE_URL", authServer.URL)

		req, _ := http.NewRequest(http.MethodGet, server.URL+"/ledger", nil)
		req.Header.Set("Authorization", "Bearer operator-jwt")
		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatalf("failed request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d", resp.StatusCode)
		}
	})

	t.Run("LedgerClientForbidden", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "client-jwt", subject: "client-dev-001", roles: []string{"client"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("WLT_AUTH_MODE", "production")
		t.Setenv("WLT_AUTH_SERVICE_URL", authServer.URL)

		req, _ := http.NewRequest(http.MethodGet, server.URL+"/ledger", nil)
		req.Header.Set("Authorization", "Bearer client-jwt")
		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatalf("failed request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusForbidden {
			t.Fatalf("expected 403 Forbidden, got %d", resp.StatusCode)
		}
	})

	// 2. Test GET /wallets/{subject}/summary - client (own only), operator (any)
	t.Run("SummaryClientOwnAllowed", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "client-jwt", subject: "client-dev-001", roles: []string{"client"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("WLT_AUTH_MODE", "production")
		t.Setenv("WLT_AUTH_SERVICE_URL", authServer.URL)

		req, _ := http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-001/summary", nil)
		req.Header.Set("Authorization", "Bearer client-jwt")
		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatalf("failed request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d", resp.StatusCode)
		}
	})

	t.Run("SummaryClientOtherForbidden", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "client-jwt", subject: "client-dev-001", roles: []string{"client"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("WLT_AUTH_MODE", "production")
		t.Setenv("WLT_AUTH_SERVICE_URL", authServer.URL)

		req, _ := http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-002/summary", nil)
		req.Header.Set("Authorization", "Bearer client-jwt")
		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatalf("failed request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusForbidden {
			t.Fatalf("expected 403 Forbidden, got %d", resp.StatusCode)
		}
	})

	t.Run("SummaryOperatorOtherAllowed", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "operator-jwt", subject: "operator-dev-001", roles: []string{"operator"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("WLT_AUTH_MODE", "production")
		t.Setenv("WLT_AUTH_SERVICE_URL", authServer.URL)

		req, _ := http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-002/summary", nil)
		req.Header.Set("Authorization", "Bearer operator-jwt")
		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatalf("failed request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d", resp.StatusCode)
		}
	})

	// 3. Test Dev Mode fallback
	t.Run("DevModeFallbackHeaders", func(t *testing.T) {
		t.Setenv("WLT_AUTH_MODE", "dev")

		req, _ := http.NewRequest(http.MethodGet, server.URL+"/ledger", nil)
		req.Header.Set("X-Client-Id", "client-dev-001")
		req.Header.Set("X-Actor-Type", "operator") // dev override
		resp, err := server.Client().Do(req)
		if err != nil {
			t.Fatalf("failed request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d", resp.StatusCode)
		}
	})
}
