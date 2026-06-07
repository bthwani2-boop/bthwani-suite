package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"bthwani.local/dsh/domain"
)

func requireWltCallbackToken(w http.ResponseWriter, r *http.Request) bool {
	callbackToken := strings.TrimSpace(r.Header.Get("X-WLT-Callback-Token"))
	if callbackToken == "" || callbackToken != wltCallbackSecret() {
		writeError(w, http.StatusUnauthorized, domain.ErrorCodeInvalidParameter, "missing or invalid X-WLT-Callback-Token")
		return false
	}
	return true
}

// GetWltWalletSummary handles GET /wlt/wallet-summary.
// WLT BOUNDARY: DSH reads only; returns a mocked WLT wallet balance snapshot.
// No DB mutation or financial status updates are performed.
func (h *OrdersHandler) GetWltWalletSummary(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /wlt/wallet-summary")

	if requireClientIdentity(w, r) == "" {
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
// WLT BOUNDARY: DSH only marks eligible delivered orders as candidates; WLT owns settlement execution.
func (h *OrdersHandler) SubmitSettlementCandidates(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /settlement/candidates")

	if requireClientIdentity(w, r) == "" {
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
// WLT BOUNDARY: WLT owns the final financial decision; DSH records callback references only.
func (h *OrdersHandler) PostWltSettlementCallback(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: POST /wlt/settlement-callback")

	if !requireWltCallbackToken(w, r) {
		return
	}

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
// WLT BOUNDARY: DSH exposes a read-only bridge view.
func (h *OrdersHandler) GetSettlements(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /settlements")

	if requireClientIdentity(w, r) == "" {
		return
	}

	orders, err := h.repository.ListSettlements(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, orders)
}
