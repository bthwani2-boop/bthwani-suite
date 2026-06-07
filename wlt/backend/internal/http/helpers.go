package httpapi

import (
	"encoding/json"
	"net/http"

	"bthwani.local/wlt/domain"
)

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v) //nolint:errcheck
}

type errorBody struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, errorBody{Error: code, Message: message})
}

func notFound(w http.ResponseWriter) {
	writeError(w, http.StatusNotFound, domain.ErrorCodeNotFound, "not found")
}
