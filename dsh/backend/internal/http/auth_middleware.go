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
// In production mode DSH_AUTH_SERVICE_URL MUST be set; returns empty string if missing
// so that verifyBearerToken rejects all requests rather than accidentally hitting a
// local process (e.g. Metro bundler) that may happen to be on the fallback port.
func authServiceURL() string {
	if u := strings.TrimRight(strings.TrimSpace(os.Getenv("DSH_AUTH_SERVICE_URL")), "/"); u != "" {
		return u
	}
	// DEV_ONLY fallback — never used when DSH_AUTH_MODE=production
	if authMode() == "production" {
		return ""
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
	base := authServiceURL()
	if base == "" {
		// Production mode with no DSH_AUTH_SERVICE_URL set — deny all rather than
		// accidentally forwarding tokens to a local process on the default port.
		return ""
	}
	reqURL := base + "/auth/session"
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
//   Calls verifyBearerToken → DSH_AUTH_SERVICE_URL/auth/session.
//   DSH_AUTH_SERVICE_URL MUST be set in production; if unset all requests denied.
//   REMAINING GATE before 003A/003B PASS: real auth service + runtime proof.
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
