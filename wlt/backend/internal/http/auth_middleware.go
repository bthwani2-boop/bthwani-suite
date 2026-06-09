package httpapi

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"bthwani.local/wlt/domain"
)

// authMode returns "production" when WLT_AUTH_MODE=production, else "dev".
func authMode() string {
	if m := strings.ToLower(strings.TrimSpace(os.Getenv("WLT_AUTH_MODE"))); m == "production" {
		return "production"
	}
	return "dev"
}

// authServiceURL returns the auth service base URL.
// WLT_AUTH_SERVICE_URL must be set in production; dev defaults to localhost:18082.
func authServiceURL() string {
	if u := strings.TrimRight(strings.TrimSpace(os.Getenv("WLT_AUTH_SERVICE_URL")), "/"); u != "" {
		return u
	}
	if authMode() == "production" {
		return ""
	}
	return "http://localhost:18082"
}

// wltCallbackSecret returns the shared secret WLT uses to authenticate callbacks to DSH.
// DEV_ONLY default: "dev-secret". Production: WLT_CALLBACK_SECRET env var.
func wltCallbackSecret() string {
	if s := strings.TrimSpace(os.Getenv("WLT_CALLBACK_SECRET")); s != "" {
		return s
	}
	return "dev-secret"
}

// dshBaseURL returns the DSH service base URL for sending callbacks.
// WLT_DSH_BASE_URL env var. Dev default: http://localhost:8080.
func dshBaseURL() string {
	if u := strings.TrimRight(strings.TrimSpace(os.Getenv("WLT_DSH_BASE_URL")), "/"); u != "" {
		return u
	}
	return "http://localhost:8080"
}

type authSessionResponse struct {
	Subject   string   `json:"subject"`
	AuthState string   `json:"authState"`
	Roles     []string `json:"roles"`
}

type authContextKey string

const authSessionKey authContextKey = "wlt_auth_session"

// AuthSession is the verified identity attached to each request context.
type AuthSession struct {
	Subject string
	Roles   []string
}

// GetAuthSession returns the session from the request context, or nil.
func GetAuthSession(r *http.Request) *AuthSession {
	if s, ok := r.Context().Value(authSessionKey).(*AuthSession); ok {
		return s
	}
	return nil
}

// HasRole checks whether the request's session has the given role.
func HasRole(r *http.Request, role string) bool {
	s := GetAuthSession(r)
	if s == nil {
		return false
	}
	for _, rr := range s.Roles {
		if strings.EqualFold(rr, role) {
			return true
		}
	}
	return false
}

func verifyBearerTokenSession(ctx context.Context, token string) *AuthSession {
	base := authServiceURL()
	if base == "" {
		return nil
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, base+"/auth/session", nil)
	if err != nil {
		return nil
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		if resp != nil {
			resp.Body.Close() //nolint:errcheck
		}
		return nil
	}
	defer resp.Body.Close() //nolint:errcheck

	var session authSessionResponse
	if err := json.NewDecoder(resp.Body).Decode(&session); err != nil || session.AuthState != "authenticated" {
		return nil
	}
	subject := strings.TrimSpace(session.Subject)
	if subject == "" {
		subject = fmt.Sprintf("sub:%s", token[:min(16, len(token))])
	}
	return &AuthSession{Subject: subject, Roles: session.Roles}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// resolveIdentity extracts and verifies the caller's identity.
// Dev mode: X-Client-Id + optional X-Actor-Type headers.
// Production: Bearer token verified against auth service.
func resolveIdentity(r *http.Request) *AuthSession {
	if authMode() == "production" {
		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return nil
		}
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if token == "" {
			return nil
		}
		sess := verifyBearerTokenSession(r.Context(), token)
		if sess != nil {
			ctx := context.WithValue(r.Context(), authSessionKey, sess)
			*r = *r.WithContext(ctx)
		}
		return sess
	}

	// DEV_ONLY fallback
	subject := strings.TrimSpace(r.Header.Get("X-Client-Id"))
	if subject == "" {
		return nil
	}
	actorType := strings.ToLower(strings.TrimSpace(r.Header.Get("X-Actor-Type")))
	roles := []string{}
	if actorType != "" {
		roles = append(roles, actorType)
	} else {
		roles = []string{"operator", "system"}
	}
	sess := &AuthSession{Subject: subject, Roles: roles}
	ctx := context.WithValue(r.Context(), authSessionKey, sess)
	*r = *r.WithContext(ctx)
	return sess
}

// requireIdentity is a guard that writes 401 and returns nil when identity cannot be resolved.
func requireIdentity(w http.ResponseWriter, r *http.Request) *AuthSession {
	sess := resolveIdentity(r)
	if sess == nil {
		if authMode() == "production" {
			writeError(w, http.StatusUnauthorized, domain.ErrorCodeUnauthenticated, "Bearer token required")
		} else {
			writeError(w, http.StatusUnauthorized, domain.ErrorCodeUnauthenticated, "X-Client-Id header required")
		}
	}
	return sess
}
