package httpapi

import (
	"net/http"
	"os"
	"strings"

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
		// TODO (production): call GET /auth/session with this token,
		// return session.subject as clientId.
		// For now: use token value directly as DEV stand-in.
		return token
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
