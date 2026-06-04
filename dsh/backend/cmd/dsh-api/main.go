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

	if databaseURL := os.Getenv("DATABASE_URL"); databaseURL != "" {
		postgresRepository, err := store.NewPostgresRepository(context.Background(), databaseURL)
		if err != nil {
			log.Fatal(err)
		}
		defer func() {
			if err := postgresRepository.Close(); err != nil {
				log.Printf("dsh-api postgres close error: %v", err)
			}
		}()
		repository = postgresRepository
		log.Print("dsh-api using postgres repository")
	} else {
		log.Print("dsh-api using memory repository")
	}

	httpapi.RegisterRoutes(mux, repository)
	httpapi.RegisterProductRoutes(mux, repository)
	httpapi.RegisterCategoryRoutes(mux, repository)
	httpapi.RegisterMediaRoutes(mux, repository)
	httpapi.RegisterOverridesRoutes(mux, repository)
	httpapi.RegisterApprovalsRoutes(mux, repository)
	httpapi.RegisterConflictsRoutes(mux, repository)
	httpapi.RegisterOrderRoutes(mux, repository)
	httpapi.RegisterSupportRoutes(mux, repository)
	httpapi.RegisterWltRoutes(mux)

	// Serve static media fixtures under /media-fixtures/
	mediaFixturesDir := "../frontend/media-fixtures"
	if _, err := os.Stat(mediaFixturesDir); os.IsNotExist(err) {
		mediaFixturesDir = "dsh/frontend/media-fixtures"
	}
	mux.Handle("GET /media-fixtures/", http.StripPrefix("/media-fixtures/", http.FileServer(http.Dir(mediaFixturesDir))))

	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
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
