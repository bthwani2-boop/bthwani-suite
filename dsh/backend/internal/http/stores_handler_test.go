package httpapi

import (
	"bytes"
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

func TestStoresHandlerVisibilityGates(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewStoresHandler(repository)

	// Step 1: Initial list returns store-1001 (Haddah Central Market)
	getReq := httptest.NewRequest(http.MethodGet, "/stores", nil)
	getResp := httptest.NewRecorder()
	handler.ServeHTTP(getResp, getReq)

	if getResp.Code != http.StatusOK {
		t.Fatalf("expected GET /stores status 200, got %d", getResp.Code)
	}
	var initStores domain.DiscoveryStoresResponse
	decodeBody(t, getResp, &initStores)

	found1001 := false
	for _, s := range initStores.Stores {
		if s.ID == "store-1001" {
			found1001 = true
			break
		}
	}
	if !found1001 {
		t.Fatal("expected store-1001 to be visible initially")
	}

	// Step 2: Patch partner readiness to paused
	patchBody := domain.PartnerReadinessUpdateRequest{Status: "paused"}
	resp := patchStore(t, handler, "PATCH", "/stores/store-1001/partner-readiness", patchBody)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected PATCH readiness status 200, got %d", resp.Code)
	}

	var gateResp domain.StoreVisibilityGateResponse
	decodeBody(t, resp, &gateResp)
	if gateResp.PartnerReadinessStatus != "paused" || gateResp.ClientVisible {
		t.Fatalf("unexpected gate response: %+v", gateResp)
	}

	// Step 3: Verify store-1001 is now hidden
	getReq = httptest.NewRequest(http.MethodGet, "/stores", nil)
	getResp = httptest.NewRecorder()
	handler.ServeHTTP(getResp, getReq)
	var hiddenStores domain.DiscoveryStoresResponse
	decodeBody(t, getResp, &hiddenStores)

	for _, s := range hiddenStores.Stores {
		if s.ID == "store-1001" {
			t.Fatal("expected store-1001 to be hidden after setting readiness to paused")
		}
	}

	// Step 4: Patch readiness back to ready
	patchBody = domain.PartnerReadinessUpdateRequest{Status: "ready"}
	resp = patchStore(t, handler, "PATCH", "/stores/store-1001/partner-readiness", patchBody)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected PATCH readiness status 200, got %d", resp.Code)
	}
	decodeBody(t, resp, &gateResp)
	if gateResp.PartnerReadinessStatus != "ready" || !gateResp.ClientVisible {
		t.Fatalf("unexpected gate response after restore: %+v", gateResp)
	}

	// Step 5: Patch catalog approval to rejected (quality)
	catBody := domain.CatalogApprovalUpdateRequest{QualityStatus: "rejected", PricingStatus: "approved"}
	resp = patchStore(t, handler, "PATCH", "/stores/store-1001/catalog-approval", catBody)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected PATCH catalog status 200, got %d", resp.Code)
	}
	decodeBody(t, resp, &gateResp)
	if gateResp.CatalogQualityStatus != "rejected" || gateResp.ClientVisible {
		t.Fatalf("expected client visible false after catalog quality reject, got %+v", gateResp)
	}

	// Verify hidden again
	getReq = httptest.NewRequest(http.MethodGet, "/stores", nil)
	getResp = httptest.NewRecorder()
	handler.ServeHTTP(getResp, getReq)
	decodeBody(t, getResp, &hiddenStores)
	for _, s := range hiddenStores.Stores {
		if s.ID == "store-1001" {
			t.Fatal("expected store-1001 to be hidden after catalog quality reject")
		}
	}

	// Restore catalog approval
	catBody = domain.CatalogApprovalUpdateRequest{QualityStatus: "approved", PricingStatus: "approved"}
	resp = patchStore(t, handler, "PATCH", "/stores/store-1001/catalog-approval", catBody)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected PATCH status 200, got %d", resp.Code)
	}

	// Step 6: Patch marketing visibility to inactive
	mktBody := domain.MarketingVisibilityUpdateRequest{Status: "inactive"}
	resp = patchStore(t, handler, "PATCH", "/stores/store-1001/marketing-visibility", mktBody)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected PATCH marketing status 200, got %d", resp.Code)
	}
	decodeBody(t, resp, &gateResp)
	if gateResp.MarketingVisibilityStatus != "inactive" || gateResp.ClientVisible {
		t.Fatalf("expected client visible false after marketing visibility inactive, got %+v", gateResp)
	}

	// Verify hidden again
	getReq = httptest.NewRequest(http.MethodGet, "/stores", nil)
	getResp = httptest.NewRecorder()
	handler.ServeHTTP(getResp, getReq)
	decodeBody(t, getResp, &hiddenStores)
	for _, s := range hiddenStores.Stores {
		if s.ID == "store-1001" {
			t.Fatal("expected store-1001 to be hidden after marketing visibility inactive")
		}
	}

	// Restore marketing visibility
	mktBody = domain.MarketingVisibilityUpdateRequest{Status: "active"}
	resp = patchStore(t, handler, "PATCH", "/stores/store-1001/marketing-visibility", mktBody)
	if resp.Code != http.StatusOK {
		t.Fatalf("expected PATCH marketing status 200, got %d", resp.Code)
	}
}

func TestStoresHandlerValidationAndErrorCases(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewStoresHandler(repository)

	// Case 1: Invalid status for partner readiness (returns 400)
	badBody := domain.PartnerReadinessUpdateRequest{Status: "invalid-status"}
	resp := patchStore(t, handler, "PATCH", "/stores/store-1001/partner-readiness", badBody)
	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request, got %d", resp.Code)
	}
	var errResp domain.ErrorResponse
	decodeBody(t, resp, &errResp)
	if errResp.Code != domain.ErrorCodeInvalidParameter {
		t.Fatalf("expected invalid parameter error code, got %s", errResp.Code)
	}

	// Case 2: Unknown store ID (returns 404)
	okBody := domain.PartnerReadinessUpdateRequest{Status: "paused"}
	resp = patchStore(t, handler, "PATCH", "/stores/store-9999/partner-readiness", okBody)
	if resp.Code != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found for unknown store, got %d", resp.Code)
	}

	// Case 3: Unsupported HTTP methods (returns 405 Method Not Allowed)
	// Note: Because we register specific methods on serve mux:
	// GET /stores/{id}/partner-readiness should return 405 or 404.
	// Let's call the endpoint directly with GET.
	getReq := httptest.NewRequest(http.MethodGet, "/stores/store-1001/partner-readiness", nil)
	getResp := httptest.NewRecorder()
	handler.ServeHTTP(getResp, getReq)
	if getResp.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 Method Not Allowed, got %d", getResp.Code)
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

func patchStore(t *testing.T, handler *StoresHandler, method string, path string, body any) *httptest.ResponseRecorder {
	t.Helper()

	bodyBytes, err := json.Marshal(body)
	if err != nil {
		t.Fatalf("marshal body: %v", err)
	}

	request := httptest.NewRequest(method, path, bytes.NewReader(bodyBytes))
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)
	return response
}

func decodeBody(t *testing.T, response *httptest.ResponseRecorder, body any) {
	t.Helper()

	if err := json.NewDecoder(response.Body).Decode(body); err != nil {
		t.Fatalf("decode response body: %v. Body was: %s", err, response.Body.String())
	}
}

func TestGetStoreDetail(t *testing.T) {
	repository := store.NewMemoryRepository()
	handler := NewStoresHandler(repository)

	// Case 1: Get store-1001 details successfully
	request := httptest.NewRequest(http.MethodGet, "/stores/store-1001", nil)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}

	var body domain.StoreDetail
	decodeBody(t, response, &body)

	if body.ID != "store-1001" {
		t.Fatalf("expected store ID store-1001, got %s", body.ID)
	}
	if body.ContactNumber != "+967-1-444333" {
		t.Fatalf("expected contact number +967-1-444333, got %s", body.ContactNumber)
	}
	if body.OpeningHours != "08:00 - 23:00" {
		t.Fatalf("expected opening hours 08:00 - 23:00, got %s", body.OpeningHours)
	}
	if body.CatalogSummary != "Over 1,200 fresh groceries and daily essentials" {
		t.Fatalf("expected catalog summary, got %s", body.CatalogSummary)
	}
	if body.PartnerReadinessStatus != "ready" || body.CatalogQualityStatus != "approved" {
		t.Fatalf("unexpected visibility statuses: %+v", body)
	}

	// Case 2: Store not found (returns 404)
	requestNotFound := httptest.NewRequest(http.MethodGet, "/stores/store-9999", nil)
	responseNotFound := httptest.NewRecorder()
	handler.ServeHTTP(responseNotFound, requestNotFound)

	if responseNotFound.Code != http.StatusNotFound {
		t.Fatalf("expected status 404, got %d", responseNotFound.Code)
	}
}
