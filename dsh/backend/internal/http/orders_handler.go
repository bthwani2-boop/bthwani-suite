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
	h.mux.HandleFunc("POST /orders/{id}/refund-callback", h.RefundOrderCallback)
	h.mux.HandleFunc("POST /orders/{id}/assign-captain", h.AssignCaptain)
	h.mux.HandleFunc("POST /orders/{id}/accept-task", h.AcceptTask)
	h.mux.HandleFunc("POST /orders/{id}/decline-task", h.DeclineTask)
	h.mux.HandleFunc("POST /orders/{id}/pickup", h.ConfirmPickup)
	h.mux.HandleFunc("POST /orders/{id}/location", h.UpdateCaptainLocation)
	h.mux.HandleFunc("GET /orders/{id}/location", h.GetCaptainLocation)
	h.mux.HandleFunc("POST /orders/{id}/deliver", h.DeliverOrder)
	h.mux.HandleFunc("POST /orders/{id}/fail-delivery", h.FailDelivery)
	h.mux.HandleFunc("POST /orders/{id}/confirm-return", h.ConfirmReturn)
	h.mux.HandleFunc("GET /wlt/wallet-summary", h.GetWltWalletSummary)
	h.mux.HandleFunc("POST /settlement/candidates", h.SubmitSettlementCandidates)
	h.mux.HandleFunc("POST /wlt/settlement-callback", h.PostWltSettlementCallback)
	h.mux.HandleFunc("GET /settlements", h.GetSettlements)
	return h
}

func RegisterOrderRoutes(mux *http.ServeMux, repository store.Repository) {
	h := NewOrdersHandler(repository)
	mux.Handle("POST /orders", h)
	mux.Handle("GET /orders/{id}", h)
	mux.Handle("PATCH /orders/{id}/status", h)
	mux.Handle("POST /orders/{id}/cancel", h)
	mux.Handle("POST /orders/{id}/refund-callback", h)
	mux.Handle("POST /orders/{id}/assign-captain", h)
	mux.Handle("POST /orders/{id}/accept-task", h)
	mux.Handle("POST /orders/{id}/decline-task", h)
	mux.Handle("POST /orders/{id}/pickup", h)
	mux.Handle("POST /orders/{id}/location", h)
	mux.Handle("GET /orders/{id}/location", h)
	mux.Handle("POST /orders/{id}/deliver", h)
	mux.Handle("POST /orders/{id}/fail-delivery", h)
	mux.Handle("POST /orders/{id}/confirm-return", h)
	mux.Handle("GET /wlt/wallet-summary", h)
	mux.Handle("POST /settlement/candidates", h)
	mux.Handle("POST /wlt/settlement-callback", h)
	mux.Handle("GET /settlements", h)
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
		status != domain.StatusCancelled &&
		status != domain.StatusRefunded {
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

func (h *OrdersHandler) RefundOrderCallback(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/refund-callback", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req struct {
		RefundRefID string  `json:"refund_ref_id"`
		Amount      float64 `json:"amount"`
		Status      string  `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.RefundRefID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "refund_ref_id is required")
		return
	}
	if req.Amount <= 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "amount must be greater than zero")
		return
	}
	status := strings.ToUpper(strings.TrimSpace(req.Status))
	if status != "CONFIRMED" && status != "FAILED" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be CONFIRMED or FAILED")
		return
	}

	order, err := h.repository.UpdateOrderRefund(r.Context(), id, req.RefundRefID, req.Amount, status)
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

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
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

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
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

// DeliverOrder handles POST /orders/{id}/deliver (DSH-SLICE-005E).
// Captain submits proof-of-delivery; order transitions ARRIVED → DELIVERED.
// WLT BOUNDARY: this endpoint does NOT trigger payout or any financial mutation.
// Payout is WLT responsibility after the DELIVERED event is observed by WLT.
func (h *OrdersHandler) DeliverOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	log.Printf("dsh-api: POST /orders/%s/deliver", id)

	if id == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing order id")
		return
	}

	var req domain.DeliverOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.CaptainID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "captain_id is required")
		return
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

// GetWltWalletSummary handles GET /wlt/wallet-summary.
// WLT BOUNDARY: DSH reads only; returns a mocked WLT wallet balance snapshot.
// No DB mutation or financial status updates are performed.
func (h *OrdersHandler) GetWltWalletSummary(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /wlt/wallet-summary")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		// requireClientIdentity already wrote 401 Unauthorized via writeError
		return
	}

	// WLT-owned wallet balance snapshot mock.
	response := struct {
		BalanceMinorUnits int64  `json:"balanceMinorUnits"`
		Currency          string `json:"currency"`
		Linked            bool   `json:"linked"`
		FrozenMinorUnits  int64  `json:"frozenMinorUnits"`
		UpdatedAt         string `json:"updatedAt"`
	}{
		BalanceMinorUnits: 1000000, // 10,000 YER in minor units
		Currency:          "YER",
		Linked:            true,
		FrozenMinorUnits:  0,
		UpdatedAt:         "2026-06-05T06:00:00Z",
	}

	writeJSON(w, http.StatusOK, response)
}

// SubmitSettlementCandidates handles POST /settlement/candidates.
func (h *OrdersHandler) SubmitSettlementCandidates(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /settlement/candidates")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	var req struct {
		OrderIDs []string `json:"order_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if len(req.OrderIDs) == 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order_ids is required and cannot be empty")
		return
	}

	orders, err := h.repository.SubmitSettlementCandidates(r.Context(), req.OrderIDs)
	if err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, orders)
}

// PostWltSettlementCallback handles POST /wlt/settlement-callback.
func (h *OrdersHandler) PostWltSettlementCallback(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /wlt/settlement-callback")

	var req struct {
		SettlementRefID string   `json:"settlement_ref_id"`
		OrderIDs        []string `json:"order_ids"`
		Amount          float64  `json:"amount"`
		Status          string   `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	if req.SettlementRefID == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "settlement_ref_id is required")
		return
	}
	if len(req.OrderIDs) == 0 {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "order_ids is required and cannot be empty")
		return
	}
	if req.Status != "CONFIRMED" && req.Status != "FAILED" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "status must be CONFIRMED or FAILED")
		return
	}

	orders, err := h.repository.ProcessSettlementCallback(r.Context(), req.SettlementRefID, req.OrderIDs, req.Amount, req.Status)
	if err != nil {
		writeError(w, http.StatusNotFound, domain.ErrorCodeInvalidParameter, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, orders)
}

// GetSettlements handles GET /settlements.
func (h *OrdersHandler) GetSettlements(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /settlements")

	clientID := requireClientIdentity(w, r)
	if clientID == "" {
		return
	}

	orders, err := h.repository.ListSettlements(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, orders)
}
