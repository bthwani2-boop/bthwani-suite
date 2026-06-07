package httpapi

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

const (
	defaultLimit = 20
	maxLimit     = 100
)

type StoresHandler struct {
	repository store.Repository
	mux        *http.ServeMux
}

func NewStoresHandler(repository store.Repository) *StoresHandler {
	handler := &StoresHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}

	// Register internal routes for dispatching
	handler.mux.HandleFunc("GET /stores", handler.ListStores)
	handler.mux.HandleFunc("GET /stores/{id}", handler.GetStore)
	handler.mux.HandleFunc("POST /stores", handler.CreateFieldStore)
	handler.mux.HandleFunc("POST /stores/{id}/field-visits", handler.CreateFieldVisit)
	handler.mux.HandleFunc("POST /stores/{id}/documents", handler.CreateFieldDocument)
	handler.mux.HandleFunc("PATCH /stores/{id}/partner-readiness", handler.UpdatePartnerReadiness)
	handler.mux.HandleFunc("PATCH /stores/{id}/catalog-approval", handler.UpdateCatalogApproval)
	handler.mux.HandleFunc("PATCH /stores/{id}/marketing-visibility", handler.UpdateMarketingVisibility)

	return handler
}

func RegisterRoutes(mux *http.ServeMux, repository store.Repository) {
	handler := NewStoresHandler(repository)
	mux.Handle("GET /stores", handler)
	mux.Handle("GET /stores/{id}", handler)
	mux.Handle("POST /stores", handler)
	mux.Handle("POST /stores/{id}/field-visits", handler)
	mux.Handle("POST /stores/{id}/documents", handler)
	mux.Handle("PATCH /stores/{id}/partner-readiness", handler)
	mux.Handle("PATCH /stores/{id}/catalog-approval", handler)
	mux.Handle("PATCH /stores/{id}/marketing-visibility", handler)
}

func (handler *StoresHandler) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")

	if request.Method == http.MethodOptions {
		writer.WriteHeader(http.StatusOK)
		return
	}

	handler.mux.ServeHTTP(writer, request)
}

func (handler *StoresHandler) ListStores(writer http.ResponseWriter, request *http.Request) {
	log.Printf("dsh-api: received GET /stores request from app-client")
	if request.Method != http.MethodGet {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	query, err := parseStoreDiscoveryQuery(request)
	if err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	response, err := handler.repository.ListStores(request.Context(), query)
	if err != nil {
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, "unable to list stores")
		return
	}

	writeJSON(writer, http.StatusOK, response)
}

func (handler *StoresHandler) GetStore(writer http.ResponseWriter, request *http.Request) {
	id := request.PathValue("id")
	log.Printf("dsh-api: received GET /stores/%s request from app-client", id)
	if request.Method != http.MethodGet {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	if id == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store id")
		return
	}

	response, err := handler.repository.GetStore(request.Context(), id)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(writer, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(writer, http.StatusOK, response)
}

func (handler *StoresHandler) UpdatePartnerReadiness(writer http.ResponseWriter, request *http.Request) {
	clientID := requireClientIdentity(writer, request)
	if clientID == "" {
		return
	}
	if !HasRole(request, "operator") {
		writeError(writer, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	id := request.PathValue("id")
	log.Printf("dsh-api: received PATCH %s/partner-readiness request (ID: %s)", request.URL.Path, id)
	if request.Method != http.MethodPatch {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	if id == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store id")
		return
	}

	var req domain.PartnerReadinessUpdateRequest
	if err := json.NewDecoder(request.Body).Decode(&req); err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	status := strings.ToLower(strings.TrimSpace(req.Status))
	if status != "ready" && status != "not_ready" && status != "paused" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be ready, not_ready, or paused")
		return
	}

	response, err := handler.repository.UpdatePartnerReadiness(request.Context(), id, status)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(writer, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(writer, http.StatusOK, response)
}

func (handler *StoresHandler) UpdateCatalogApproval(writer http.ResponseWriter, request *http.Request) {
	clientID := requireClientIdentity(writer, request)
	if clientID == "" {
		return
	}
	if !HasRole(request, "operator") {
		writeError(writer, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	log.Printf("dsh-api: received PATCH /stores/{id}/catalog-approval request")
	if request.Method != http.MethodPatch {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	id := request.PathValue("id")
	if id == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store id")
		return
	}

	var req domain.CatalogApprovalUpdateRequest
	if err := json.NewDecoder(request.Body).Decode(&req); err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	qualityStatus := strings.ToLower(strings.TrimSpace(req.QualityStatus))
	if qualityStatus != "approved" && qualityStatus != "pending" && qualityStatus != "rejected" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "quality_status must be approved, pending, or rejected")
		return
	}

	pricingStatus := strings.ToLower(strings.TrimSpace(req.PricingStatus))
	if pricingStatus != "approved" && pricingStatus != "pending" && pricingStatus != "rejected" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "pricing_status must be approved, pending, or rejected")
		return
	}

	response, err := handler.repository.UpdateCatalogApproval(request.Context(), id, qualityStatus, pricingStatus)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(writer, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(writer, http.StatusOK, response)
}

func (handler *StoresHandler) UpdateMarketingVisibility(writer http.ResponseWriter, request *http.Request) {
	clientID := requireClientIdentity(writer, request)
	if clientID == "" {
		return
	}
	if !HasRole(request, "operator") {
		writeError(writer, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	log.Printf("dsh-api: received PATCH /stores/{id}/marketing-visibility request")
	if request.Method != http.MethodPatch {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	id := request.PathValue("id")
	if id == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store id")
		return
	}

	var req domain.MarketingVisibilityUpdateRequest
	if err := json.NewDecoder(request.Body).Decode(&req); err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	status := strings.ToLower(strings.TrimSpace(req.Status))
	if status != "active" && status != "inactive" && status != "paused" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be active, inactive, or paused")
		return
	}

	response, err := handler.repository.UpdateMarketingVisibility(request.Context(), id, status)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(writer, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(writer, http.StatusOK, response)
}

func parseStoreDiscoveryQuery(request *http.Request) (domain.StoreDiscoveryQuery, error) {
	values := request.URL.Query()
	filter := strings.TrimSpace(values.Get("filter"))
	if filter == "" {
		filter = string(domain.StoreDiscoveryFilterAll)
	}

	parsedFilter := domain.StoreDiscoveryFilter(filter)
	if !validFilter(parsedFilter) {
		return domain.StoreDiscoveryQuery{}, errors.New("filter must be one of all, favorites, nearest, new, offers")
	}

	limit := defaultLimit
	if rawLimit := strings.TrimSpace(values.Get("limit")); rawLimit != "" {
		parsedLimit, err := strconv.Atoi(rawLimit)
		if err != nil || parsedLimit < 1 || parsedLimit > maxLimit {
			return domain.StoreDiscoveryQuery{}, errors.New("limit must be an integer between 1 and 100")
		}
		limit = parsedLimit
	}

	offset := 0
	if rawOffset := strings.TrimSpace(values.Get("offset")); rawOffset != "" {
		parsedOffset, err := strconv.Atoi(rawOffset)
		if err != nil || parsedOffset < 0 {
			return domain.StoreDiscoveryQuery{}, errors.New("offset must be an integer greater than or equal to 0")
		}
		offset = parsedOffset
	}

	return domain.StoreDiscoveryQuery{
		CategoryID: strings.TrimSpace(values.Get("category_id")),
		Query:      strings.TrimSpace(values.Get("query")),
		Filter:     parsedFilter,
		Limit:      limit,
		Offset:     offset,
	}, nil
}

func validFilter(filter domain.StoreDiscoveryFilter) bool {
	switch filter {
	case domain.StoreDiscoveryFilterAll,
		domain.StoreDiscoveryFilterFavorites,
		domain.StoreDiscoveryFilterNearest,
		domain.StoreDiscoveryFilterNew,
		domain.StoreDiscoveryFilterOffers:
		return true
	default:
		return false
	}
}

// CreateFieldStore handles POST /stores — field agent submits a new store for review (J-006A).
func (handler *StoresHandler) CreateFieldStore(writer http.ResponseWriter, request *http.Request) {
	clientID := requireClientIdentity(writer, request)
	if clientID == "" {
		return
	}
	if !HasRole(request, "field") {
		writeError(writer, http.StatusForbidden, domain.ErrorCodeForbidden, "field role required")
		return
	}

	log.Printf("dsh-api: received POST /stores from app-field")
	if request.Method != http.MethodPost {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	var req domain.CreateFieldStoreRequest
	if err := json.NewDecoder(request.Body).Decode(&req); err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if strings.TrimSpace(req.Name) == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "name is required")
		return
	}
	if strings.TrimSpace(req.Address) == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "address is required")
		return
	}

	res, err := handler.repository.CreateFieldStore(request.Context(), req)
	if err != nil {
		log.Printf("dsh-api: create field store error: %v", err)
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, "failed to create store")
		return
	}

	writeJSON(writer, http.StatusCreated, res)
}

func (handler *StoresHandler) CreateFieldVisit(writer http.ResponseWriter, request *http.Request) {
	clientID := requireClientIdentity(writer, request)
	if clientID == "" {
		return
	}
	if !HasRole(request, "field") {
		writeError(writer, http.StatusForbidden, domain.ErrorCodeForbidden, "field role required")
		return
	}

	id := request.PathValue("id")
	log.Printf("dsh-api: received POST /stores/%s/field-visits from app-field", id)
	if request.Method != http.MethodPost {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	if strings.TrimSpace(id) == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store id")
		return
	}

	var req domain.CreateFieldVisitRequest
	if err := json.NewDecoder(request.Body).Decode(&req); err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if strings.TrimSpace(req.VisitSummary) == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "visit_summary is required")
		return
	}
	if strings.TrimSpace(req.FollowUpAction) == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "follow_up_action is required")
		return
	}

	res, err := handler.repository.CreateFieldVisit(request.Context(), id, req)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(writer, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		log.Printf("dsh-api: create field visit error: %v", err)
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, "failed to create field visit")
		return
	}

	writeJSON(writer, http.StatusCreated, res)
}

func (handler *StoresHandler) CreateFieldDocument(writer http.ResponseWriter, request *http.Request) {
	clientID := requireClientIdentity(writer, request)
	if clientID == "" {
		return
	}
	if !HasRole(request, "field") {
		writeError(writer, http.StatusForbidden, domain.ErrorCodeForbidden, "field role required")
		return
	}

	id := request.PathValue("id")
	log.Printf("dsh-api: received POST /stores/%s/documents from app-field", id)
	if request.Method != http.MethodPost {
		writeError(writer, http.StatusMethodNotAllowed, domain.ErrorCodeInvalidParameter, "method not allowed")
		return
	}

	if strings.TrimSpace(id) == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing store id")
		return
	}

	var req domain.CreateFieldDocumentRequest
	if err := json.NewDecoder(request.Body).Decode(&req); err != nil {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	kind := strings.TrimSpace(req.DocumentKind)
	if kind == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "document_kind is required")
		return
	}

	mediaKey := strings.TrimSpace(req.MediaKey)
	if mediaKey == "" {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "media_key is required")
		return
	}

	validKinds := map[string]bool{
		"commercial_registration": true,
		"tax_certificate":         true,
		"identity_proof":          true,
		"storefront_photo":        true,
		"interior_photo":          true,
	}
	if !validKinds[kind] {
		writeError(writer, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid document_kind")
		return
	}

	res, err := handler.repository.CreateFieldDocument(request.Context(), id, req)
	if err != nil {
		if err.Error() == "store not found" {
			writeError(writer, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "store not found")
			return
		}
		log.Printf("dsh-api: create field document error: %v", err)
		writeError(writer, http.StatusInternalServerError, domain.ErrorCodeInternalError, "failed to create field document")
		return
	}

	writeJSON(writer, http.StatusCreated, res)
}


func writeError(writer http.ResponseWriter, status int, code domain.ErrorCode, message string) {
	writeJSON(writer, status, domain.ErrorResponse{
		Code:    code,
		Message: message,
	})
}

func writeJSON(writer http.ResponseWriter, status int, body any) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	_ = json.NewEncoder(writer).Encode(body)
}
