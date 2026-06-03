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

	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS")
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
