package main

import (
	"context"
	"log"
	"net/http"
	"os"

	httpapi "bthwani.local/dsh/backend/internal/http"
	"bthwani.local/dsh/backend/internal/store"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	repository := store.Repository(store.NewMemoryRepository())

	var postgresRepo *store.PostgresRepository
	if databaseURL := os.Getenv("DATABASE_URL"); databaseURL != "" {
		pr, err := store.NewPostgresRepository(context.Background(), databaseURL)
		if err != nil {
			log.Fatal(err)
		}
		defer func() {
			if err := pr.Close(); err != nil {
				log.Printf("dsh-api postgres close error: %v", err)
			}
		}()
		repository = pr
		postgresRepo = pr
		log.Print("dsh-api using postgres repository")
	} else {
		log.Print("dsh-api using memory repository")
	}

	httpapi.RegisterRoutes(mux, repository)
	httpapi.RegisterReadinessRoutes(mux, repository)
	httpapi.RegisterProductRoutes(mux, repository)
	httpapi.RegisterCategoryRoutes(mux, repository)
	// DEV_FIXTURE_ADAPTER: POST /media and DELETE /media/{id} use manifest-based keys.
	// These remain for dev fixture seeding only. Runtime upload goes to /media/upload-intents.
	httpapi.RegisterMediaRoutes(mux, repository)
	httpapi.RegisterOverridesRoutes(mux, repository)
	httpapi.RegisterApprovalsRoutes(mux, repository)
	httpapi.RegisterConflictsRoutes(mux, repository)
	httpapi.RegisterOrderRoutes(mux, repository)
	httpapi.RegisterSupportRoutes(mux, repository)
	httpapi.RegisterCheckoutRoutes(mux, repository)
	// WLT routes are NOT registered here — DSH backend does not own wallet state.
	// Financial operations are delegated to WLT service via payment session handoff.

	// Runtime media upload routes — only available when PostgreSQL is configured.
	if postgresRepo != nil {
		mediaCfg := store.MediaStorageConfigFromEnv()
		httpapi.RegisterMediaRuntimeRoutes(mux, postgresRepo, mediaCfg)
		if mediaCfg.IsConfigured() {
			log.Printf("dsh-api media storage: provider=%s endpoint=%s bucket=%s", mediaCfg.Provider, mediaCfg.Endpoint, mediaCfg.Bucket)
		} else {
			log.Print("dsh-api media storage: DSH_MEDIA_S3_ENDPOINT not set — upload-intent URLs will be empty")
		}
	}

	// DEV_ONLY_MEDIA_FIXTURES: static file server for local seed images.
	// NOT served in production. Used only for dev fixture seeding and preview rendering.
	// Runtime media is served from MinIO (DSH_MEDIA_PUBLIC_BASE_URL).
	mediaFixturesDir := "../frontend/media-fixtures"
	if _, err := os.Stat(mediaFixturesDir); os.IsNotExist(err) {
		mediaFixturesDir = "dsh/frontend/media-fixtures"
	}
	mux.Handle("GET /media-fixtures/", http.StripPrefix("/media-fixtures/", http.FileServer(http.Dir(mediaFixturesDir))))

	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type, X-WLT-Callback-Token, X-WLT-Event-Id, Idempotency-Key")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		mux.ServeHTTP(w, r)
	})

	log.Printf("dsh-api listening on :%s", port)
	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatal(err)
	}
}
