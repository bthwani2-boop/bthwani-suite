package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bthwani.local/dsh/backend/internal/store"
)

// ─── helpers ─────────────────────────────────────────────────────────────────

// mockAuthServer returns a test server that mimics auth.openapi.yaml GET /auth/session.
// validToken is accepted; any other token returns 401.
func mockAuthServer(t *testing.T, validToken, subject string) *httptest.Server {
	t.Helper()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/auth/session" || r.Method != http.MethodGet {
			http.NotFound(w, r)
			return
		}
		auth := r.Header.Get("Authorization")
		if auth != "Bearer "+validToken {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "unauthenticated"}) //nolint:errcheck
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(authSessionResponse{ //nolint:errcheck
			Subject:   subject,
			AuthState: "authenticated",
			Roles:     []string{"client"},
		})
	}))
	return srv
}

// withProductionAuth sets DSH_AUTH_MODE=production and DSH_AUTH_SERVICE_URL for the test,
// restoring original values on cleanup.
func withProductionAuth(t *testing.T, authServiceURL string) {
	t.Helper()
	t.Setenv("DSH_AUTH_MODE", "production")
	t.Setenv("DSH_AUTH_SERVICE_URL", authServiceURL)
}

// ─── authMode ────────────────────────────────────────────────────────────────

func TestAuthMode_DefaultIsDev(t *testing.T) {
	t.Setenv("DSH_AUTH_MODE", "")
	if authMode() != "dev" {
		t.Fatalf("expected dev, got %s", authMode())
	}
}

func TestAuthMode_ProductionSet(t *testing.T) {
	t.Setenv("DSH_AUTH_MODE", "production")
	if authMode() != "production" {
		t.Fatalf("expected production, got %s", authMode())
	}
}

// ─── verifyBearerToken ───────────────────────────────────────────────────────

func TestVerifyBearerToken_ValidToken(t *testing.T) {
	srv := mockAuthServer(t, "valid-jwt-token", "client-9f3a1b")
	defer srv.Close()

	t.Setenv("DSH_AUTH_SERVICE_URL", srv.URL)

	subject := verifyBearerToken(t.Context(), "valid-jwt-token")
	if subject != "client-9f3a1b" {
		t.Fatalf("expected client-9f3a1b, got %q", subject)
	}
}

func TestVerifyBearerToken_InvalidToken(t *testing.T) {
	srv := mockAuthServer(t, "valid-jwt-token", "client-9f3a1b")
	defer srv.Close()

	t.Setenv("DSH_AUTH_SERVICE_URL", srv.URL)

	subject := verifyBearerToken(t.Context(), "wrong-token")
	if subject != "" {
		t.Fatalf("expected empty subject for invalid token, got %q", subject)
	}
}

func TestVerifyBearerToken_AuthServiceDown(t *testing.T) {
	t.Setenv("DSH_AUTH_SERVICE_URL", "http://127.0.0.1:1") // unreachable

	subject := verifyBearerToken(t.Context(), "any-token")
	if subject != "" {
		t.Fatalf("expected empty subject when auth service is unreachable, got %q", subject)
	}
}

func TestVerifyBearerToken_UnauthenticatedState(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(authSessionResponse{ //nolint:errcheck
			Subject:   "ghost",
			AuthState: "guest",
		})
	}))
	defer srv.Close()
	t.Setenv("DSH_AUTH_SERVICE_URL", srv.URL)

	subject := verifyBearerToken(t.Context(), "any-token")
	if subject != "" {
		t.Fatalf("expected empty subject for non-authenticated state, got %q", subject)
	}
}

// ─── production mode: checkout endpoints ─────────────────────────────────────

func TestGetCartServiceability_ProductionMode_MissingBearer(t *testing.T) {
	srv := mockAuthServer(t, "valid-token", "client-1")
	defer srv.Close()
	withProductionAuth(t, srv.URL)

	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability?store_id=store-1001", nil)
	// No Authorization header
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.Code)
	}
}

func TestGetCartServiceability_ProductionMode_InvalidBearer(t *testing.T) {
	srv := mockAuthServer(t, "valid-token", "client-1")
	defer srv.Close()
	withProductionAuth(t, srv.URL)

	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability?store_id=store-1001", nil)
	req.Header.Set("Authorization", "Bearer wrong-token")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.Code)
	}
}

func TestGetCartServiceability_ProductionMode_ValidBearer(t *testing.T) {
	srv := mockAuthServer(t, "valid-token", "client-prod-1")
	defer srv.Close()
	withProductionAuth(t, srv.URL)

	h := NewCheckoutHandler(store.NewMemoryRepository())
	req := httptest.NewRequest(http.MethodGet, "/cart/serviceability?store_id=store-1001", nil)
	req.Header.Set("Authorization", "Bearer valid-token")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", resp.Code, resp.Body.String())
	}
}

func TestCreateCheckoutIntent_ProductionMode_ValidBearer(t *testing.T) {
	srv := mockAuthServer(t, "valid-token", "client-prod-1")
	defer srv.Close()
	withProductionAuth(t, srv.URL)

	h := NewCheckoutHandler(store.NewMemoryRepository())
	body, _ := json.Marshal(map[string]interface{}{
		"store_id":         "store-1001",
		"delivery_address": "شارع الجمهورية",
		"items":            []map[string]interface{}{{"product_id": "prod-1", "quantity": 1}},
	})
	req := httptest.NewRequest(http.MethodPost, "/checkout/intent", mustReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer valid-token")
	resp := httptest.NewRecorder()
	h.ServeHTTP(resp, req)

	if resp.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", resp.Code, resp.Body.String())
	}
}

// ─── wltCallbackSecret ────────────────────────────────────────────────────────

func TestWltCallbackSecret_DefaultDevSecret(t *testing.T) {
	t.Setenv("WLT_CALLBACK_SECRET", "")
	if wltCallbackSecret() != "dev-secret" {
		t.Fatalf("expected dev-secret, got %s", wltCallbackSecret())
	}
}

func TestWltCallbackSecret_CustomSecret(t *testing.T) {
	t.Setenv("WLT_CALLBACK_SECRET", "prod-hmac-key-xyz")
	if wltCallbackSecret() != "prod-hmac-key-xyz" {
		t.Fatalf("expected prod-hmac-key-xyz, got %s", wltCallbackSecret())
	}
}

// ─── helpers ─────────────────────────────────────────────────────────────────

func mustReader(b []byte) *bytesReader { return &bytesReader{data: b, pos: 0} }

type bytesReader struct {
	data []byte
	pos  int
}

func (r *bytesReader) Read(p []byte) (int, error) {
	if r.pos >= len(r.data) {
		return 0, nil
	}
	n := copy(p, r.data[r.pos:])
	r.pos += n
	return n, nil
}
