package main

import (
	"context"
	"log"
	"net/http"
	"os"

	httpapi "bthwani.local/wlt/backend/internal/http"
	"bthwani.local/wlt/backend/internal/store"
)

// wlt-api: BThwani Wallet & Ledger Transaction service.
//
// Financial boundary: WLT owns all wallet state, payment sessions, refunds,
// settlements, and ledger entries. DSH records WLT reference IDs only.
//
// Env vars:
//   PORT                  HTTP listen port (default 8083)
//   DATABASE_URL          Postgres DSN; omit to use in-memory store
//   WLT_AUTH_MODE         "production" to require Bearer tokens (default: dev)
//   WLT_AUTH_SERVICE_URL  Auth service base URL (default http://localhost:18082)
//   WLT_CALLBACK_SECRET   Shared secret for DSH callbacks (default "dev-secret")
//   WLT_DSH_BASE_URL      DSH base URL for outbound callbacks (default http://localhost:8080)
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	mux := http.NewServeMux()
	var repo store.Repository = store.NewMemoryRepository()

	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		pgRepo, err := store.NewPostgresRepository(context.Background(), dbURL)
		if err != nil {
			log.Fatalf("wlt-api: postgres connect: %v", err)
		}
		defer pgRepo.Close() //nolint:errcheck
		repo = pgRepo
		log.Print("wlt-api: using postgres repository")
	} else {
		log.Print("wlt-api: using memory repository")
	}

	httpapi.RegisterPaymentRoutes(mux, repo)
	httpapi.RegisterRefundRoutes(mux, repo)
	httpapi.RegisterSettlementRoutes(mux, repo)
	httpapi.RegisterWalletRoutes(mux, repo)
	httpapi.RegisterHealthRoutes(mux, repo)
	httpapi.RegisterOperatorRoutes(mux, repo)
	httpapi.RegisterReportingRoutes(mux, repo)

	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type, Idempotency-Key")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		mux.ServeHTTP(w, r)
	})

	log.Printf("wlt-api: listening on :%s", port)
	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatalf("wlt-api: fatal: %v", err)
	}
}
