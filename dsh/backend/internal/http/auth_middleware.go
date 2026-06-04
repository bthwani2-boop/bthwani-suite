package httpapi

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"bthwani.local/dsh/domain"
)

// authMode returns the current authentication mode.
// Production: set DSH_AUTH_MODE=production to enforce BearerAuth verification.
// DEV (default): accepts X-Client-Id header.
func authMode() string {
	if m := strings.ToLower(strings.TrimSpace(os.Getenv("DSH_AUTH_MODE"))); m == "production" {
		return "production"
	}
	return "dev"
}

// authServiceURL returns the auth service base URL.
// Set DSH_AUTH_SERVICE_URL to the auth service base (e.g. https://auth.bthwani.local).
// Defaults to http://localhost:8081 for local development.
func authServiceURL() string {
	if u := strings.TrimRight(strings.TrimSpace(os.Getenv("DSH_AUTH_SERVICE_URL")), "/"); u != "" {
		return u
	}
	return "http://localhost:8081"
}

// authSessionResponse mirrors auth.openapi.yaml GET /auth/session response.
type authSessionResponse struct {
	Subject             string   `json:"subject"`
	AuthState           string   `json:"authState"`
	Roles               []string `json:"roles"`
	VerifiedIdentifier  string   `json:"verifiedIdentifier"`
}

// verifyBearerToken calls auth service GET /auth/session with the provided token.
// Returns the subject (clientId) on success, or empty string on any auth failure.
// Contract: auth.openapi.yaml GET /auth/session (AUTH_CONTRACT_MINIMAL_FOR_DSH_CHECKOUT).
func verifyBearerToken(ctx context.Context, token string) string {
	reqURL := authServiceURL() + "/auth/session"
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return ""
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close() //nolint:errcheck

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	var session authSessionResponse
	if err := json.NewDecoder(resp.Body).Decode(&session); err != nil {
		return ""
	}
	if session.AuthState != "authenticated" {
		return ""
	}
	subject := strings.TrimSpace(session.Subject)
	if subject == "" {
		subject = fmt.Sprintf("sub:%s", token[:min(16, len(token))])
	}
	return subject
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// resolveClientIdentity extracts the client identity from the request.
//
// DEV mode (DSH_AUTH_MODE not set or != production):
//   Accepts X-Client-Id header as a temporary DEV_ONLY identity mechanism.
//   Returns empty string if the header is absent.
//
// Production mode (DSH_AUTH_MODE=production):
//   Requires a Bearer token in the Authorization header.
//   Token format: "Bearer <token>" where <token> is a JWT or opaque session token.
//   In production this should call auth.openapi.yaml GET /auth/session to validate
//   the token and return the subject/clientId from the session response.
//   Current implementation: extracts the token value as-is (not verified).
//   TODO: wire to actual auth service before 003A/003B PASS.
func resolveClientIdentity(r *http.Request) string {
	if authMode() == "production" {
		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return ""
		}
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if token == "" {
			return ""
		}
		return verifyBearerToken(r.Context(), token)
	}
	// DEV_ONLY fallback
	return strings.TrimSpace(r.Header.Get("X-Client-Id"))
}

// requireClientIdentity is a guard that returns the client identity or writes
// a 401 and returns empty string. Callers must check for empty return.
func requireClientIdentity(w http.ResponseWriter, r *http.Request) string {
	id := resolveClientIdentity(r)
	if id == "" {
		if authMode() == "production" {
			writeError(w, http.StatusUnauthorized, domain.ErrorCodeUnauthenticated, "Bearer token required")
		} else {
			writeError(w, http.StatusUnauthorized, domain.ErrorCodeUnauthenticated, "X-Client-Id header required")
		}
		return ""
	}
	return id
}
