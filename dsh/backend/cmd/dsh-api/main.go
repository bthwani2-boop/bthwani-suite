package main

import (
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
	httpapi.RegisterRoutes(mux, store.NewMemoryRepository())

	log.Printf("dsh-api listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
