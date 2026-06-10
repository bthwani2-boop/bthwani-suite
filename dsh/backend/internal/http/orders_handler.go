package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"bthwani.local/dsh/backend/internal/store"
	"bthwani.local/dsh/domain"
)

type OrderDeliveryRepository interface {
	store.OrderRepository
	store.DeliveryRepository
	store.SupportRepository
}

type OrdersHandler struct {
	repository OrderDeliveryRepository
	mux        *http.ServeMux
}

func NewOrdersHandler(repository OrderDeliveryRepository) *OrdersHandler {
	h := &OrdersHandler{
		repository: repository,
		mux:        http.NewServeMux(),
	}
	h.mux.HandleFunc("GET /orders", h.ListOrders)
	h.mux.HandleFunc("POST /orders", h.CreateOrder)
	h.mux.HandleFunc("GET /orders/{id}", h.GetOrder)
	h.mux.HandleFunc("PATCH /orders/{id}/status", h.UpdateOrderStatus)
	h.mux.HandleFunc("POST /orders/{id}/cancel", h.CancelOrder)
	h.mux.HandleFunc("POST /orders/{id}/refund-callback", h.RefundOrderCallback)
	h.mux.HandleFunc("POST /orders/{id}/settlement-callback", h.SettlementCallback)
	h.mux.HandleFunc("POST /orders/{id}/assign-captain", h.AssignCaptain)
	h.mux.HandleFunc("POST /orders/{id}/accept-task", h.AcceptTask)
	h.mux.HandleFunc("POST /orders/{id}/decline-task", h.DeclineTask)
	h.mux.HandleFunc("POST /orders/{id}/pickup", h.ConfirmPickup)
	h.mux.HandleFunc("POST /orders/{id}/location", h.UpdateCaptainLocation)
	h.mux.HandleFunc("GET /orders/{id}/location", h.GetCaptainLocation)
	h.mux.HandleFunc("POST /orders/{id}/deliver", h.DeliverOrder)
	h.mux.HandleFunc("POST /orders/{id}/fail-delivery", h.FailDelivery)
	h.mux.HandleFunc("POST /orders/{id}/confirm-return", h.ConfirmReturn)
	return h
}

func RegisterOrderRoutes(mux *http.ServeMux, repository OrderDeliveryRepository) {
	h := NewOrdersHandler(repository)
	mux.Handle("GET /orders", h)
	mux.Handle("POST /orders", h)
	mux.Handle("GET /orders/{id}", h)
	mux.Handle("PATCH /orders/{id}/status", h)
	mux.Handle("POST /orders/{id}/cancel", h)
	mux.Handle("POST /orders/{id}/refund-callback", h)
	mux.Handle("POST /orders/{id}/settlement-callback", h)
	mux.Handle("POST /orders/{id}/assign-captain", h)
	mux.Handle("POST /orders/{id}/accept-task", h)
	mux.Handle("POST /orders/{id}/decline-task", h)
	mux.Handle("POST /orders/{id}/pickup", h)
	mux.Handle("POST /orders/{id}/location", h)
	mux.Handle("GET /orders/{id}/location", h)
	mux.Handle("POST /orders/{id}/deliver", h)
	mux.Handle("POST /orders/{id}/fail-delivery", h)
	mux.Handle("POST /orders/{id}/confirm-return", h)
}

func (h *OrdersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type, X-WLT-Callback-Token, X-WLT-Event-Id, Idempotency-Key")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// ListOrders handles GET /orders — operations queue for control-panel.
// Supports ?status=CREATED&limit=50&offset=0. Limit capped at 200.
func (h *OrdersHandler) ListOrders(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /orders")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "client") && !HasRole(r, "partner") && !HasRole(r, "captain") && !HasRole(r, "operator") && !HasRole(r, "system") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized role")
		return
	}

	actor := orderActorType(r)

	q := r.URL.Query()
	status := strings.ToUpper(strings.TrimSpace(q.Get("status")))
	queryClientID := strings.TrimSpace(q.Get("client_id"))
	queryStoreID := strings.TrimSpace(q.Get("store_id"))

	if actor == "client" {
		if queryClientID != "" && queryClientID != clientID {
			writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "client_id must match authenticated identity")
			return
		}
		queryClientID = clientID
	} else if actor == "partner" {
		partnerStore := getPartnerStoreID(clientID)
		if partnerStore == "" {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "partner has no assigned store")
			return
		}
		if queryStoreID != "" && queryStoreID != partnerStore {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized store access")
			return
		}
		queryStoreID = partnerStore
	}

	limit := 50
	if raw := q.Get("limit"); raw != "" {
		if v, err := strconv.Atoi(raw); err == nil && v > 0 {
			limit = v
		}
	}

	offset := 0
	if raw := q.Get("offset"); raw != "" {
		if v, err := strconv.Atoi(raw); err == nil && v >= 0 {
			offset = v
		}
	}

	resp, err := h.repository.ListOrders(r.Context(), domain.ListOrdersQuery{
		ClientID: queryClientID,
		StoreID:  queryStoreID,
		Status:   status,
		Limit:    limit,
		Offset:   offset,
	})
	if err != nil {
		log.Printf("dsh-api: list orders error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *OrdersHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /orders")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "client") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "client role required")
		return
	}

	var req domain.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.StoreID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "store_id is required")
		return
	}
	if req.ClientID != "" && req.ClientID != clientID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "client_id must match authenticated identity")
		return
	}
	req.ClientID = clientID
	if req.CheckoutIntentID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "checkout_intent_id is required")
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

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "client") && !HasRole(r, "partner") && !HasRole(r, "captain") && !HasRole(r, "operator") && !HasRole(r, "system") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized role")
		return
	}

	actor := orderActorType(r)

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
	if !canAccessOrder(actor, clientID, order) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "order is not visible to authenticated identity")
		return
	}

	events, err := h.repository.ListOrderStatusEvents(r.Context(), id)
	if err != nil {
		log.Printf("dsh-api: list order status events error: %v", err)
		events = []domain.OrderStatusEventRecord{}
	}

	escalations, err := h.repository.ListSupportEscalations(r.Context(), id)
	if err != nil {
		log.Printf("dsh-api: list support escalations error: %v", err)
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

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

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

	if !HasRole(r, actor) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "role mismatch with requested actor")
		return
	}
	status := strings.ToUpper(strings.TrimSpace(req.Status))
	if status != domain.StatusCreated &&
		status != domain.StatusAccepted &&
		status != domain.StatusReadyForPickup &&
		status != domain.StatusDelivered &&
		status != domain.StatusCancelled &&
		status != domain.StatusRefunded &&
		status != domain.StatusAcceptedByCaptain &&
		status != domain.StatusPickedUp &&
		status != domain.StatusEnRoute &&
		status != domain.StatusArrived &&
		status != domain.StatusFailedDelivery &&
		status != domain.StatusReturningToStore &&
		status != domain.StatusReturned {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid status")
		return
	}

	order, _, err := h.repository.GetOrder(r.Context(), id)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if !canAccessOrder(actor, clientID, order) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized to update status of this order")
		return
	}

	updatedOrder, err := h.repository.UpdateOrderStatus(r.Context(), id, actor, status, req.Note)
	if err != nil {
		log.Printf("dsh-api: update order status error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, updatedOrder)
}

func (h *OrdersHandler) CancelOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/cancel", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}
	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	var req struct {
		Actor string  `json:"actor"`
		Note  *string `json:"note,omitempty"`
	}

	req.Actor = "client"
	_ = json.NewDecoder(r.Body).Decode(&req)

	actor := strings.ToLower(strings.TrimSpace(req.Actor))
	if actor != "client" && actor != "partner" && actor != "operator" && actor != "system" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "actor must be client, partner, operator, or system")
		return
	}

	if !HasRole(r, actor) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "role mismatch with requested actor")
		return
	}

	order, _, err := h.repository.GetOrder(r.Context(), id)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if !canAccessOrder(actor, clientID, order) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "order is not visible to authenticated identity")
		return
	}

	// State guard: only allow cancellation from pre-delivery states.
	// Clients and partners cannot cancel DELIVERED, REFUNDED, CANCELLED, or terminal states.
	// Operators and system retain the ability to cancel any non-terminal state for admin overrides.
	if actor == "client" || actor == "partner" {
		if !isCancellableStatus(order.Status) {
			writeError(w, http.StatusConflict, domain.ErrorCodeInvalidParameter,
				"order cannot be cancelled in status: "+order.Status)
			return
		}
	}

	updatedOrder, err := h.repository.UpdateOrderStatus(r.Context(), id, actor, domain.StatusCancelled, req.Note)
	if err != nil {
		log.Printf("dsh-api: cancel order error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, updatedOrder)
}

func isCancellableStatus(status string) bool {
	switch status {
	case domain.StatusCreated, domain.StatusAccepted, domain.StatusReadyForPickup:
		return true
	default:
		return false
	}
}

func (h *OrdersHandler) RefundOrderCallback(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/refund-callback", id)

	if !requireWltCallbackToken(w, r) {
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req struct {
		RefundRefID string `json:"refund_ref_id"`
		Status      string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.RefundRefID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "refund_ref_id is required")
		return
	}
	status := strings.ToUpper(strings.TrimSpace(req.Status))
	if status != "CONFIRMED" && status != "FAILED" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be CONFIRMED or FAILED")
		return
	}

	order, err := h.repository.UpdateOrderRefund(r.Context(), id, req.RefundRefID, status)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: refund callback error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) AssignCaptain(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/assign-captain", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "operator") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator role required")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req struct {
		CaptainID string `json:"captain_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	order, err := h.repository.AssignCaptain(r.Context(), id, req.CaptainID)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: assign captain error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) AcceptTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/accept-task", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	var req struct {
		CaptainID string `json:"captain_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	order, err := h.repository.AcceptTask(r.Context(), id, req.CaptainID)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		if err.Error() == "captain ID mismatch or not assigned" {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: accept task error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) DeclineTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/decline-task", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	var req struct {
		CaptainID string `json:"captain_id"`
		Reason    string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}
	if req.Reason == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "reason is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	order, err := h.repository.DeclineTask(r.Context(), id, req.CaptainID, req.Reason)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		if err.Error() == "captain ID mismatch or not assigned" {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: decline task error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) ConfirmPickup(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/pickup", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	var req struct {
		CaptainID string `json:"captain_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	order, err := h.repository.ConfirmPickup(r.Context(), id, req.CaptainID)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		if err.Error() == "captain ID mismatch or not assigned" || strings.Contains(err.Error(), "order status must be") {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: confirm pickup error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) UpdateCaptainLocation(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/location", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	var req struct {
		CaptainID       string  `json:"captain_id"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		LifecycleStatus string  `json:"lifecycle_status"`
		OrderStatus     string  `json:"order_status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	if req.LifecycleStatus == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "lifecycle_status is required")
		return
	}
	if req.OrderStatus != "" && req.OrderStatus != domain.StatusEnRoute && req.OrderStatus != domain.StatusArrived {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order_status must be EN_ROUTE or ARRIVED")
		return
	}

	order, err := h.repository.UpdateCaptainLocation(r.Context(), id, req.CaptainID, req.Latitude, req.Longitude, req.LifecycleStatus, req.OrderStatus)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		if err.Error() == "captain ID mismatch or not assigned" {
			writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
			return
		}
		log.Printf("dsh-api: update captain location error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func (h *OrdersHandler) GetCaptainLocation(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: GET /orders/%s/location", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "client") && !HasRole(r, "operator") && !HasRole(r, "system") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "unauthorized role")
		return
	}

	actor := orderActorType(r)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	order, _, err := h.repository.GetOrder(r.Context(), id)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: get order location error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if !canAccessOrder(actor, clientID, order) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "order is not visible to authenticated identity")
		return
	}

	if order.CaptainLatitude == nil || order.CaptainLongitude == nil || order.CaptainLifecycleStatus == nil {
		writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "captain location not found")
		return
	}

	response := struct {
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		LifecycleStatus string  `json:"lifecycle_status"`
		OrderStatus     string  `json:"order_status"`
	}{
		Latitude:        *order.CaptainLatitude,
		Longitude:       *order.CaptainLongitude,
		LifecycleStatus: *order.CaptainLifecycleStatus,
		OrderStatus:     order.Status,
	}

	writeJSON(w, http.StatusOK, response)
}

func orderActorType(r *http.Request) string {
	sess := GetAuthSession(r)
	if sess == nil {
		return "client"
	}
	for _, role := range sess.Roles {
		switch strings.ToLower(role) {
		case "operator", "system":
			return "operator"
		case "partner":
			return "partner"
		case "captain":
			return "captain"
		}
	}
	return "client"
}

func getPartnerStoreID(subject string) string {
	if subject == "partner-dev-001" {
		return "store-1001"
	}
	if strings.HasPrefix(subject, "partner-dev-") {
		return "store-" + strings.TrimPrefix(subject, "partner-dev-")
	}
	if subject == "partner_001" {
		return "store-1001"
	}
	return ""
}

func canAccessOrder(actor, subject string, order domain.OrderRecord) bool {
	switch actor {
	case "operator", "system":
		return true
	case "captain":
		return order.CaptainID != nil && *order.CaptainID == subject
	case "partner":
		storeID := getPartnerStoreID(subject)
		return storeID != "" && order.StoreID == storeID
	default:
		return order.ClientID == subject
	}
}

// DeliverOrder handles POST /orders/{id}/deliver (DSH-SLICE-005E).
// Captain submits proof-of-delivery; order transitions ARRIVED → DELIVERED.
// WLT BOUNDARY: this endpoint does NOT trigger payout or any financial mutation.
// Payout is WLT responsibility after the DELIVERED event is observed by WLT.
func (h *OrdersHandler) DeliverOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/deliver", id)

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req domain.DeliverOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	req.CaptainID = strings.TrimSpace(req.CaptainID)
	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	if req.PodMediaKey != nil {
		podMediaKey := strings.TrimSpace(*req.PodMediaKey)
		if podMediaKey == "" {
			req.PodMediaKey = nil
		} else {
			if store.GetMediaURL(podMediaKey) == "" {
				writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "pod_media_key is not registered in manifest")
				return
			}
			req.PodMediaKey = &podMediaKey
		}
	}

	order, err := h.repository.DeliverOrder(r.Context(), id, req.CaptainID, req.PodMediaKey)
	if err != nil {
		msg := err.Error()
		switch {
		case strings.Contains(msg, "order not found"):
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
		case strings.Contains(msg, "not assigned to this captain"):
			writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "order not assigned to this captain")
		case strings.Contains(msg, "must be in ARRIVED state"):
			writeError(w, http.StatusConflict, domain.ErrorCodeInvalidParameter, msg)
		default:
			log.Printf("dsh-api: deliver order error: %v", err)
			writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		}
		return
	}

	writeJSON(w, http.StatusOK, order)
}

// FailDelivery handles POST /orders/{id}/fail-delivery (DSH-SLICE-005F).
// Validates: ARRIVED state, captain match, non-empty failure_reason.
// Transitions ARRIVED → FAILED_DELIVERY or RETURNING_TO_STORE.
// WLT BOUNDARY: wlt_refund_trigger_ref is stored as bridge reference only.
// DSH does NOT execute refunds; WLT (004E) owns refund execution.
func (h *OrdersHandler) FailDelivery(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order id is required")
		return
	}

	var req domain.FailDeliveryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	if req.FailureReason == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "failure_reason is required")
		return
	}

	order, err := h.repository.FailDelivery(r.Context(), id, req.CaptainID, req.FailureReason, req.WltRefundTriggerRef, req.ReturnRequired)
	if err != nil {
		msg := err.Error()
		switch {
		case strings.Contains(msg, "order not found"):
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
		case strings.Contains(msg, "not assigned to this captain"):
			writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "order not assigned to this captain")
		case strings.Contains(msg, "must be in ARRIVED state"):
			writeError(w, http.StatusConflict, domain.ErrorCodeInvalidParameter, msg)
		default:
			log.Printf("dsh-api: fail delivery error: %v", err)
			writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		}
		return
	}

	writeJSON(w, http.StatusOK, order)
}

// ConfirmReturn handles POST /orders/{id}/confirm-return (DSH-SLICE-005F).
// Validates: RETURNING_TO_STORE state, captain match.
// Transitions RETURNING_TO_STORE → RETURNED.
// WLT BOUNDARY: no financial mutation. Refund bridge was set in fail-delivery.
func (h *OrdersHandler) ConfirmReturn(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	if !HasRole(r, "captain") {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain role required")
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order id is required")
		return
	}

	var req domain.ConfirmReturnRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
	}

	if clientID != req.CaptainID {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "captain ID mismatch with authenticated identity")
		return
	}

	order, err := h.repository.ConfirmReturn(r.Context(), id, req.CaptainID, req.Note)
	if err != nil {
		msg := err.Error()
		switch {
		case strings.Contains(msg, "order not found"):
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
		case strings.Contains(msg, "not assigned to this captain"):
			writeError(w, http.StatusForbidden, domain.ErrorCodeInvalidParameter, "order not assigned to this captain")
		case strings.Contains(msg, "must be in RETURNING_TO_STORE state"):
			writeError(w, http.StatusConflict, domain.ErrorCodeInvalidParameter, msg)
		default:
			log.Printf("dsh-api: confirm return error: %v", err)
			writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		}
		return
	}

	writeJSON(w, http.StatusOK, order)
}

// SettlementCallback handles POST /orders/{id}/settlement-callback (J-010 / DSH-SLICE-010B).
// Called exclusively by WLT after a settlement transitions to COMPLETED or FAILED.
// WLT BOUNDARY: DSH records the settlement ref and status bridge values only.
// No financial amounts are processed or stored here.
func (h *OrdersHandler) SettlementCallback(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/settlement-callback", id)

	if !requireWltCallbackToken(w, r) {
		return
	}

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req struct {
		SettlementRefID string `json:"settlement_ref_id"`
		Status          string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.SettlementRefID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "settlement_ref_id is required")
		return
	}

	var settlementStatus string
	switch strings.ToUpper(strings.TrimSpace(req.Status)) {
	case "COMPLETED":
		settlementStatus = domain.SettlementStatusSettled
	case "FAILED":
		settlementStatus = domain.SettlementStatusSettlementFailed
	default:
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be COMPLETED or FAILED")
		return
	}

	order, err := h.repository.UpdateOrderSettlement(r.Context(), id, req.SettlementRefID, settlementStatus)
	if err != nil {
		if err.Error() == "order not found" {
			writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, "order not found")
			return
		}
		log.Printf("dsh-api: settlement callback error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, order)
}

func requireWltCallbackToken(w http.ResponseWriter, r *http.Request) bool {
	callbackToken := strings.TrimSpace(r.Header.Get("X-WLT-Callback-Token"))
	if callbackToken == "" || callbackToken != wltCallbackSecret() {
		writeError(w, http.StatusUnauthorized, domain.ErrorCodeInvalidParameter, "missing or invalid X-WLT-Callback-Token")
		return false
	}
	return true
}
