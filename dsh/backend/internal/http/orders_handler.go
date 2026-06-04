package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type OrdersHandler struct {
	repository store.Repository
	mux        *http.ServeMux
}

func NewOrdersHandler(repository store.Repository) *OrdersHandler {
	h := &OrdersHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("POST /orders", h.CreateOrder)
	h.mux.HandleFunc("GET /orders/{id}", h.GetOrder)
	h.mux.HandleFunc("PATCH /orders/{id}/status", h.UpdateOrderStatus)
	h.mux.HandleFunc("POST /orders/{id}/cancel", h.CancelOrder)
	return h
}

func RegisterOrderRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewOrdersHandler(repository)
	mux.Handle("POST /orders", h)
	mux.Handle("GET /orders/{id}", h)
	mux.Handle("PATCH /orders/{id}/status", h)
	mux.Handle("POST /orders/{id}/cancel", h)
}

func (h *OrdersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func (h *OrdersHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /orders")

	var req domain.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.StoreID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "store_id is required")
		return
	}
	if req.ClientID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "client_id is required")
		return
	}
	if len(req.Items) == 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order items are required")
		return
	}

	order, items, err := h.repository.CreateOrder(r.Context(), req.StoreID, req)
	if err != nil {
		log.Printf("dsh-api: create order error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	response := struct {
		Order OrderResponse `json:"order"`
	}{
		Order: OrderResponse{
			OrderRecord: order,
			Items:       items,
		},
	}

	writeJSON(w, http.StatusCreated, response)
}

type OrderResponse struct {
	domain.OrderRecord
	Items []domain.OrderItemRecord `json:"items"`
}

func (h *OrdersHandler) GetOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: GET /orders/%s", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	order, items, err := h.repository.GetOrder(r.Context(), id)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: get order error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	events, err := h.repository.ListOrderStatusEvents(r.Context(), id)
	if err != nil {
		log.Printf("dsh-api: list order status events error: %v", err)
		// non-blocking
		events = []domain.OrderStatusEventRecord{}
	}

	escalations, err := h.repository.ListSupportEscalations(r.Context(), id)
	if err != nil {
		log.Printf("dsh-api: list support escalations error: %v", err)
		// non-blocking
		escalations = []domain.SupportEscalationRecord{}
	}

	response := domain.OrderDetailsResponse{
		Order:          order,
		Items:          items,
		StatusEvents:   events,
		SupportTickets: escalations,
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *OrdersHandler) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: PATCH /orders/%s/status", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req domain.UpdateOrderStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	actor := strings.ToLower(strings.TrimSpace(req.Actor))
	if actor != "client" && actor != "partner" && actor != "captain" && actor != "operator" && actor != "system" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "actor must be client, partner, captain, operator, or system")
		return
	}

	status := strings.ToUpper(strings.TrimSpace(req.Status))
	if status != domain.StatusCreated &&
		status != domain.StatusAccepted &&
		status != domain.StatusReadyForPickup &&
		status != domain.StatusDelivered &&
		status != domain.StatusCancelled {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid status")
		return
	}

	order, err := h.repository.UpdateOrderStatus(r.Context(), id, actor, status, req.Note)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: update order status error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) CancelOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/cancel", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	// Read optional details from body
	var req struct {
		Actor string  `json:"actor"`
		Note  *string `json:"note,omitempty"`
	}

	// Body is optional, default to client
	req.Actor = "client"
	_ = json.NewDecoder(r.Body).Decode(&req)

	actor := strings.ToLower(strings.TrimSpace(req.Actor))
	if actor != "client" && actor != "partner" && actor != "operator" && actor != "system" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "actor must be client, partner, operator, or system")
		return
	}

	order, err := h.repository.UpdateOrderStatus(r.Context(), id, actor, domain.StatusCancelled, req.Note)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: cancel order error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}
