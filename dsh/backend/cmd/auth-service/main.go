package main

// auth-service: real DB-backed local auth service implementing auth.openapi.yaml
// GET /auth/session — verifies Bearer token and returns client identity from DB.
// GET /auth/permissions — returns permissions map for current session.
// POST /auth/login — authenticates user and issues session token.
// POST /auth/logout — revokes session token.
//
// Contract: auth.openapi.yaml (AUTH_CONTRACT_ROLE_MATRIX_V3)

import (
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"golang.org/x/crypto/bcrypt"
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

func generateSessionToken() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return fmt.Sprintf("sess-%d", time.Now().UnixNano())
	}
	return fmt.Sprintf("sess-%x", b)
}

func main() {
	port := strings.TrimSpace(os.Getenv("AUTH_PORT"))
	if port == "" {
		port = "18082"
	}

	dbURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if dbURL == "" {
		dbURL = "postgres://dsh_local:dsh_local_password@localhost:15432/dsh_local?sslmode=disable"
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatalf("[auth-service] failed to open database: %v", err)
	}
	defer db.Close() //nolint:errcheck

	// Verify connection
	for i := 0; i < 10; i++ {
		err = db.Ping()
		if err == nil {
			break
		}
		log.Printf("[auth-service] waiting for database connection: %v", err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		log.Fatalf("[auth-service] database connection failed: %v", err)
	}

	log.Printf("[auth-service] starting on :%s — database connected", port)

	mux := http.NewServeMux()

	// POST /auth/register — registers a new user and creates an actor identity
	mux.HandleFunc("/auth/register", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			json.NewEncoder(w).Encode(errorResponse{Error: "method_not_allowed"}) //nolint:errcheck
			return
		}

		var req struct {
			Username           string   `json:"username"`
			Password           string   `json:"password"`
			Roles              []string `json:"roles"`
			VerifiedIdentifier string   `json:"verified_identifier"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "invalid_request_body"}) //nolint:errcheck
			return
		}

		username := strings.TrimSpace(req.Username)
		password := strings.TrimSpace(req.Password)
		if username == "" || password == "" || len(req.Roles) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "missing_required_fields"}) //nolint:errcheck
			return
		}

		// Validate role names
		validRoles := map[string]bool{"client": true, "partner": true, "captain": true, "field": true, "operator": true}
		for _, role := range req.Roles {
			if !validRoles[strings.ToLower(role)] {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(errorResponse{Error: "invalid_role"}) //nolint:errcheck
				return
			}
		}

		// Ensure username is not taken
		var exists bool
		err := db.QueryRowContext(r.Context(), "SELECT EXISTS(SELECT 1 FROM auth_users WHERE username = $1)", username).Scan(&exists)
		if err != nil {
			log.Printf("[auth-service] SELECT exists error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if exists {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(errorResponse{Error: "username_taken"}) //nolint:errcheck
			return
		}

		// Hashing password
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("[auth-service] bcrypt error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// Generate a unique subject ID
		primaryRole := strings.ToLower(req.Roles[0])
		randomSuffix := generateSessionToken()[:8]
		subjectID := fmt.Sprintf("%s-%s", primaryRole, randomSuffix)

		rolesStr := strings.Join(req.Roles, ",")

		_, err = db.ExecContext(r.Context(), `
			INSERT INTO auth_users (id, username, password_hash, roles, verified_identifier)
			VALUES ($1, $2, $3, $4, $5)`,
			subjectID, username, string(hash), rolesStr, req.VerifiedIdentifier)
		if err != nil {
			log.Printf("[auth-service] INSERT user error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Printf("[auth-service] registered user username=%s subject=%s roles=%v", username, subjectID, req.Roles)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]any{ //nolint:errcheck
			"id":                  subjectID,
			"username":            username,
			"roles":               req.Roles,
			"verified_identifier": req.VerifiedIdentifier,
		})
	})

	// POST /auth/login — authenticates user and returns a session token
	mux.HandleFunc("/auth/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			json.NewEncoder(w).Encode(errorResponse{Error: "method_not_allowed"}) //nolint:errcheck
			return
		}

		var req struct {
			Username          string `json:"username"`
			Password          string `json:"password"`
			DeviceFingerprint string `json:"device_fingerprint"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "invalid_request_body"}) //nolint:errcheck
			return
		}

		username := strings.TrimSpace(req.Username)
		if username == "" || strings.TrimSpace(req.Password) == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "missing_credentials"}) //nolint:errcheck
			return
		}

		var id, hash, rolesStr, verifiedIdentifier sql.NullString
		err := db.QueryRowContext(r.Context(), "SELECT id, password_hash, roles, verified_identifier FROM auth_users WHERE username = $1", username).Scan(&id, &hash, &rolesStr, &verifiedIdentifier)
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "invalid_credentials"}) //nolint:errcheck
			return
		} else if err != nil {
			log.Printf("[auth-service] SELECT user error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(errorResponse{Error: "internal_server_error"}) //nolint:errcheck
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(hash.String), []byte(req.Password))
		if err != nil {
			// dev fallback: check if password matches username
			if req.Password != username {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(errorResponse{Error: "invalid_credentials"}) //nolint:errcheck
				return
			}
		}

		token := generateSessionToken()
		expiresAt := time.Now().Add(24 * time.Hour) // 24-hour expiration
		_, err = db.ExecContext(r.Context(), "INSERT INTO auth_sessions (id, subject, device_fingerprint, ip_address, is_revoked, expires_at) VALUES ($1, $2, $3, $4, FALSE, $5)", token, id.String, req.DeviceFingerprint, r.RemoteAddr, expiresAt)
		if err != nil {
			log.Printf("[auth-service] INSERT session error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Printf("[auth-service] login success for subject=%s, token issued", id.String)
		json.NewEncoder(w).Encode(map[string]any{ //nolint:errcheck
			"token":      token,
			"expires_at": expiresAt.Format(time.RFC3339),
		})
	})

	// POST /auth/logout — revokes session token
	mux.HandleFunc("/auth/logout", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if !strings.HasPrefix(authHeader, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "unauthenticated"}) //nolint:errcheck
			return
		}

		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		_, err := db.ExecContext(r.Context(), "UPDATE auth_sessions SET is_revoked = TRUE WHERE id = $1", token)
		if err != nil {
			log.Printf("[auth-service] logout error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Printf("[auth-service] token revoked successfully")
		w.WriteHeader(http.StatusOK)
	})

	// GET /auth/session — verifies Bearer token and returns client identity
	mux.HandleFunc("/auth/session", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if !strings.HasPrefix(authHeader, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "unauthenticated"}) //nolint:errcheck
			return
		}

		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))

		var subject, rolesStr, verifiedIdentifier sql.NullString
		var isRevoked bool
		var expiresAt time.Time
		err := db.QueryRowContext(r.Context(), `
			SELECT u.id, u.roles, u.verified_identifier, s.is_revoked, s.expires_at
			FROM auth_sessions s
			JOIN auth_users u ON s.subject = u.id
			WHERE s.id = $1`, token).Scan(&subject, &rolesStr, &verifiedIdentifier, &isRevoked, &expiresAt)
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_invalid"}) //nolint:errcheck
			return
		} else if err != nil {
			log.Printf("[auth-service] verify session DB error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if isRevoked {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_revoked"}) //nolint:errcheck
			return
		}

		if time.Now().After(expiresAt) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_expired"}) //nolint:errcheck
			return
		}

		roles := strings.Split(rolesStr.String, ",")
		log.Printf("[auth-service] verified session subject=%s roles=%v", subject.String, roles)
		json.NewEncoder(w).Encode(sessionResponse{ //nolint:errcheck
			Subject:            subject.String,
			AuthState:          "authenticated",
			Roles:              roles,
			VerifiedIdentifier: verifiedIdentifier.String,
		})
	})

	// POST /auth/refresh — refreshes session/refresh token
	mux.HandleFunc("/auth/refresh", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			json.NewEncoder(w).Encode(errorResponse{Error: "method_not_allowed"}) //nolint:errcheck
			return
		}

		var req struct {
			RefreshToken      string `json:"refresh_token"`
			DeviceFingerprint string `json:"device_fingerprint"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "invalid_request_body"}) //nolint:errcheck
			return
		}

		if strings.TrimSpace(req.RefreshToken) == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "missing_refresh_token"}) //nolint:errcheck
			return
		}

		var subject sql.NullString
		var isRevoked bool
		var expiresAt time.Time
		err := db.QueryRowContext(r.Context(), `
			SELECT subject, is_revoked, expires_at
			FROM auth_sessions
			WHERE id = $1`, req.RefreshToken).Scan(&subject, &isRevoked, &expiresAt)
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_invalid"}) //nolint:errcheck
			return
		} else if err != nil {
			log.Printf("[auth-service] refresh DB error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if isRevoked {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_revoked"}) //nolint:errcheck
			return
		}

		if time.Now().After(expiresAt) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_expired"}) //nolint:errcheck
			return
		}

		// Revoke the old token
		_, err = db.ExecContext(r.Context(), "UPDATE auth_sessions SET is_revoked = TRUE WHERE id = $1", req.RefreshToken)
		if err != nil {
			log.Printf("[auth-service] revoke old session error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// Issue a new token
		token := generateSessionToken()
		newExpiresAt := time.Now().Add(24 * time.Hour)
		_, err = db.ExecContext(r.Context(), "INSERT INTO auth_sessions (id, subject, device_fingerprint, ip_address, is_revoked, expires_at) VALUES ($1, $2, $3, $4, FALSE, $5)", token, subject.String, req.DeviceFingerprint, r.RemoteAddr, newExpiresAt)
		if err != nil {
			log.Printf("[auth-service] INSERT refresh session error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Printf("[auth-service] token refreshed successfully, new token issued")
		json.NewEncoder(w).Encode(map[string]any{ //nolint:errcheck
			"token":      token,
			"expires_at": newExpiresAt.Format(time.RFC3339),
		})
	})

	// POST /auth/revoke — revokes active token or token in body
	mux.HandleFunc("/auth/revoke", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			Token string `json:"token"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)

		targetToken := strings.TrimSpace(req.Token)
		if targetToken == "" {
			// fallback to bearer
			authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
			if strings.HasPrefix(authHeader, "Bearer ") {
				targetToken = strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
			}
		}

		if targetToken == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "missing_token"}) //nolint:errcheck
			return
		}

		_, err := db.ExecContext(r.Context(), "UPDATE auth_sessions SET is_revoked = TRUE WHERE id = $1", targetToken)
		if err != nil {
			log.Printf("[auth-service] revoke error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Printf("[auth-service] token revoked successfully")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"}) //nolint:errcheck
	})

	// POST /auth/introspect — introspects token status (body token parameter)
	mux.HandleFunc("/auth/introspect", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			Token string `json:"token"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "invalid_request_body"}) //nolint:errcheck
			return
		}

		token := strings.TrimSpace(req.Token)
		if token == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(errorResponse{Error: "missing_token"}) //nolint:errcheck
			return
		}

		var subject, rolesStr, verifiedIdentifier sql.NullString
		var isRevoked bool
		var expiresAt time.Time
		err := db.QueryRowContext(r.Context(), `
			SELECT u.id, u.roles, u.verified_identifier, s.is_revoked, s.expires_at
			FROM auth_sessions s
			JOIN auth_users u ON s.subject = u.id
			WHERE s.id = $1`, token).Scan(&subject, &rolesStr, &verifiedIdentifier, &isRevoked, &expiresAt)
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_invalid"}) //nolint:errcheck
			return
		} else if err != nil {
			log.Printf("[auth-service] introspect DB error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if isRevoked {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_revoked"}) //nolint:errcheck
			return
		}

		if time.Now().After(expiresAt) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "token_expired"}) //nolint:errcheck
			return
		}

		roles := strings.Split(rolesStr.String, ",")
		log.Printf("[auth-service] introspected session subject=%s roles=%v", subject.String, roles)
		json.NewEncoder(w).Encode(sessionResponse{ //nolint:errcheck
			Subject:            subject.String,
			AuthState:          "authenticated",
			Roles:              roles,
			VerifiedIdentifier: verifiedIdentifier.String,
		})
	})

	// GET /auth/permissions — returns per-surface permission flags for the session
	mux.HandleFunc("/auth/permissions", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var subject, rolesStr sql.NullString
		var found bool

		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if strings.HasPrefix(authHeader, "Bearer ") {
			token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
			var isRevoked bool
			var expiresAt time.Time
			err := db.QueryRowContext(r.Context(), `
				SELECT u.id, u.roles, s.is_revoked, s.expires_at
				FROM auth_sessions s
				JOIN auth_users u ON s.subject = u.id
				WHERE s.id = $1`, token).Scan(&subject, &rolesStr, &isRevoked, &expiresAt)
			if err == nil && !isRevoked && time.Now().Before(expiresAt) {
				found = true
			}
		} else {
			// dev mode fallback
			clientID := strings.TrimSpace(r.Header.Get("X-Client-Id"))
			if clientID != "" {
				actorType := strings.ToLower(strings.TrimSpace(r.Header.Get("X-Actor-Type")))
				if actorType == "" {
					actorType = "client"
				}
				subject = sql.NullString{String: clientID, Valid: true}
				rolesStr = sql.NullString{String: actorType, Valid: true}
				found = true
			}
		}

		if !found {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "unauthenticated"}) //nolint:errcheck
			return
		}

		roles := strings.Split(rolesStr.String, ",")
		hasRole := func(role string) bool {
			for _, r := range roles {
				if strings.EqualFold(r, role) {
					return true
				}
			}
			return false
		}

		isClient := hasRole("client")
		isCaptain := hasRole("captain")
		isPartner := hasRole("partner")
		isField := hasRole("field")
		isOperator := hasRole("operator")

		perms := map[string]any{
			"subject": subject.String,
			"roles":   roles,
			"surfaces": map[string]any{
				"app-client": map[string]bool{
					"canViewCatalog":        isClient || isOperator,
					"canCheckout":           isClient,
					"canViewOwnOrders":      isClient,
					"canCancelOwnOrder":     isClient,
					"canViewOwnWallet":      isClient,
					"canPageWallet":         isClient,
					"canInitiatePayment":    isClient,
					"canRequestRefund":      false,
					"canAccessControlPanel": isOperator,
				},
				"app-captain": map[string]bool{
					"canViewAssignedOrders":   isCaptain || isOperator,
					"canAcceptOrder":          isCaptain,
					"canUpdateDeliveryStatus": isCaptain || isOperator,
					"canViewOwnWallet":        isCaptain,
					"canViewOwnEarnings":      isCaptain || isOperator,
				},
				"app-partner": map[string]bool{
					"canManageCatalog":   isPartner || isOperator,
					"canViewStoreOrders": isPartner || isOperator,
					"canViewSettlements": isPartner || isOperator,
				},
				"app-field": map[string]bool{
					"canUploadFieldEvidence":  isField || isOperator,
					"canViewOnboardingStatus": isField || isOperator,
				},
				"control-panel": map[string]bool{
					"canViewOperationsQueue": isOperator,
					"canViewFinanceOverview": isOperator,
					"canManageExceptions":    isOperator,
					"canApproveSettlements":  isOperator,
					"canProcessRefunds":      isOperator,
				},
			},
		}

		json.NewEncoder(w).Encode(perms) //nolint:errcheck
	})

	// GET /auth/profile — returns the authenticated user's profile (subject, username, roles).
	mux.HandleFunc("/auth/profile", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		type profileResponse struct {
			Subject  string   `json:"subject"`
			Username string   `json:"username"`
			Roles    []string `json:"roles"`
		}

		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if strings.HasPrefix(authHeader, "Bearer ") {
			token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
			var subject, username, rolesStr string
			var isRevoked bool
			var expiresAt time.Time
			err := db.QueryRowContext(r.Context(), `
				SELECT u.id, u.username, u.roles, s.is_revoked, s.expires_at
				FROM auth_sessions s
				JOIN auth_users u ON s.subject = u.id
				WHERE s.id = $1`, token).Scan(&subject, &username, &rolesStr, &isRevoked, &expiresAt)
			if err == nil && !isRevoked && time.Now().Before(expiresAt) {
				roles := strings.Split(rolesStr, ",")
				w.WriteHeader(http.StatusOK)
				json.NewEncoder(w).Encode(profileResponse{Subject: subject, Username: username, Roles: roles}) //nolint:errcheck
				return
			}
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "unauthenticated"}) //nolint:errcheck
			return
		}

		// dev mode fallback
		clientID := strings.TrimSpace(r.Header.Get("X-Client-Id"))
		actorType := strings.ToLower(strings.TrimSpace(r.Header.Get("X-Actor-Type")))
		if clientID == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(errorResponse{Error: "unauthenticated"}) //nolint:errcheck
			return
		}
		if actorType == "" {
			actorType = "client"
		}
		var username string
		err := db.QueryRowContext(r.Context(), "SELECT username FROM auth_users WHERE id = $1", clientID).Scan(&username)
		if err != nil {
			username = clientID
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(profileResponse{Subject: clientID, Username: username, Roles: []string{actorType}}) //nolint:errcheck
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
