package main

// auth-service: minimal local auth service implementing auth.openapi.yaml
// GET /auth/session — verifies Bearer token and returns client identity.
//
// Contract: auth.openapi.yaml (AUTH_CONTRACT_MINIMAL_FOR_DSH_CHECKOUT)
// Tokens are managed via AUTH_TOKENS env var (comma-separated subject:token pairs).
// Default dev token: "dev-client-token-001" → subject "client-dev-001"
//
// Usage:
//   go run ./cmd/auth-service                    (port 8082, dev tokens)
//   AUTH_PORT=8082 AUTH_TOKENS="client-1:tok-abc,client-2:tok-xyz" go run ./cmd/auth-service
//
// DSH integration:
//   DSH_AUTH_MODE=production DSH_AUTH_SERVICE_URL=http://localhost:8082 go run ./cmd/dsh-api/...

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
)

type sessionResponse struct {
	Subject            string   `json:"subject"`
	AuthState          string   `json:"authState"`
	Roles              []string `json:"roles"`
	VerifiedIdentifier string   `json:"verifiedIdentifier,omitempty"`
}

type errorResponse struct {
	Error string `json:"error"`
}

// tokenMap builds a map[token]subject from AUTH_TOKENS env var.
// Format: "subject1:token1,subject2:token2"
// Default: "client-dev-001:dev-client-token-001"
func buildTokenMap() map[string]string {
	m := map[string]string{
		"dev-client-token-001": "client-dev-001",
		"dev-client-token-002": "client-dev-002",
	}
	raw := strings.TrimSpace(os.Getenv("AUTH_TOKENS"))
	if raw == "" {
		return m
	}
	pairs := strings.Split(raw, ",")
	for _, p := range pairs {
		parts := strings.SplitN(strings.TrimSpace(p), ":", 2)
		if len(parts) == 2 {
			subject := strings.TrimSpace(parts[0])
			token := strings.TrimSpace(parts[1])
			if subject != "" && token != "" {
				m[token] = subject
			}
		}
	}
	return m
}

func main() {
	port := strings.TrimSpace(os.Getenv("AUTH_PORT"))
	if port == "" {
		port = "8082"
	}

	tokens := buildTokenMap()
	log.Printf("[auth-service] starting on :%s — %d tokens configured", port, len(tokens))
	log.Printf("[auth-service] contract: auth.openapi.yaml (AUTH_CONTRACT_MINIMAL_FOR_DSH_CHECKOUT)")

	mux := http.NewServeMux()

	// GET /auth/session — mirrors auth.openapi.yaml
	mux.HandleFunc("/auth/session", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if !strings.HasPrefix(authHeader, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "unauthenticated"}) //nolint:errcheck
			return
		}

		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		subject, ok := tokens[token]
		if !ok {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_invalid"}) //nolint:errcheck
			return
		}

		log.Printf("[auth-service] GET /auth/session → subject=%s", subject)
		json.NewEncoder(w).Encode(sessionResponse{ //nolint:errcheck
			Subject:   subject,
			AuthState: "authenticated",
			Roles:     []string{"client"},
		})
	})

	// GET /health — service liveness probe
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "auth-service"}) //nolint:errcheck
	})

	addr := ":" + port
	log.Printf("[auth-service] listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("[auth-service] fatal: %v", err)
	}
}
