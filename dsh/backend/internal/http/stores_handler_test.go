package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

func TestStoresHandlerSuccess(t *testing.T) {
	response := getStores(t, "/stores?limit=2")

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var body domain.DiscoveryStoresResponse
	decodeBody(t, response, &body)

	if len(body.Stores) != 2 {
		t.Fatalf("expected 2 stores, got %d", len(body.Stores))
	}
	if body.Pagination.Limit != 2 || body.Pagination.Offset != 0 || body.Pagination.Total != 3 {
		t.Fatalf("unexpected pagination: %+v", body.Pagination)
	}
}

func TestStoresHandlerEmptySearch(t *testing.T) {
	response := getStores(t, "/stores?query=not-found")

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var body domain.DiscoveryStoresResponse
	decodeBody(t, response, &body)

	if len(body.Stores) != 0 {
		t.Fatalf("expected empty store list, got %d", len(body.Stores))
	}
	if body.Pagination.Total != 0 {
		t.Fatalf("expected total 0, got %d", body.Pagination.Total)
	}
}

func TestStoresHandlerInvalidLimit(t *testing.T) {
	response := getStores(t, "/stores?limit=0")

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
	}

	var body domain.ErrorResponse
	decodeBody(t, response, &body)

	if body.Code != domain.ErrorCodeInvalidParameter {
		t.Fatalf("expected code %s, got %s", domain.ErrorCodeInvalidParameter, body.Code)
	}
}

func getStores(t *testing.T, target string) *httptest.ResponseRecorder {
	t.Helper()

	repository := store.NewMemoryRepository()
	handler := NewStoresHandler(repository)
	request := httptest.NewRequest(http.MethodGet, target, nil)
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	return response
}

func decodeBody(t *testing.T, response *httptest.ResponseRecorder, body any) {
	t.Helper()

	if err := json.NewDecoder(response.Body).Decode(body); err != nil {
		t.Fatalf("decode response body: %v", err)
	}
}
