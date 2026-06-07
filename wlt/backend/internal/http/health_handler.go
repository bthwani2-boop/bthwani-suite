package httpapi

import (
	"net/http"

	"bthwani.local/wlt/backend/internal/store"
)

func RegisterHealthRoutes(mux *http.ServeMux, repo store.Repository) {
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		status := "ok"
		httpStatus := http.StatusOK
		if err := repo.Ping(r.Context()); err != nil {
			status = "degraded"
			httpStatus = http.StatusServiceUnavailable
		}
		writeJSON(w, httpStatus, map[string]string{
			"status":  status,
			"service": "wlt-api",
		})
	})
}
