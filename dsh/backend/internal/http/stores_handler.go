package httpapi

import (
	"encoding/json"
	"errors"
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
}

func NewStoresHandler(repository store.Repository) *StoresHandler {
	return &StoresHandler{repository: repository}
}

func RegisterRoutes(mux *http.ServeMux, repository store.Repository) {
	mux.Handle("/stores", NewStoresHandler(repository))
}

func (handler *StoresHandler) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
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
