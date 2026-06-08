package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// OperatorHandler handles control-panel operator features.
type OperatorHandler struct {
	repo store.Repository
	mux  *http.ServeMux
}

func NewOperatorHandler(repo store.Repository) *OperatorHandler {
	h := &OperatorHandler{repo: repo, mux: http.NewServeMux()}
	h.mux.HandleFunc("GET /control-panel/reconciliation-runs", h.ListReconciliationRuns)
	h.mux.HandleFunc("POST /control-panel/reconciliation-runs", h.TriggerReconciliationRun)
	h.mux.HandleFunc("POST /control-panel/payout-decisions", h.CreatePayoutDecision)
	h.mux.HandleFunc("GET /control-panel/reconciliation-close-status", h.GetReconciliationCloseStatus)
	h.mux.HandleFunc("GET /control-panel/audit-events", h.ListAuditEvents)
	h.mux.HandleFunc("POST /control-panel/daily-close", h.SubmitDailyClose)
	return h
}

func RegisterOperatorRoutes(mux *http.ServeMux, repo store.Repository) {
	h := NewOperatorHandler(repo)
	mux.Handle("GET /control-panel/reconciliation-runs", h)
	mux.Handle("POST /control-panel/reconciliation-runs", h)
	mux.Handle("POST /control-panel/payout-decisions", h)
	mux.Handle("GET /control-panel/reconciliation-close-status", h)
	mux.Handle("GET /control-panel/audit-events", h)
	mux.Handle("POST /control-panel/daily-close", h)
}

func (h *OperatorHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// GET /control-panel/reconciliation-runs
func (h *OperatorHandler) ListReconciliationRuns(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	runs, err := h.repo.ListReconciliationRuns(r.Context())
	if err != nil {
		log.Printf("wlt-api: ListReconciliationRuns error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	// Avoid null response in JSON if slice is empty
	if runs == nil {
		runs = []domain.ReconciliationRun{}
	}
	writeJSON(w, http.StatusOK, runs)
}

// POST /control-panel/reconciliation-runs
func (h *OperatorHandler) TriggerReconciliationRun(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	idempKey := r.Header.Get("Idempotency-Key")
	run, err := h.repo.RunReconciliation(r.Context(), idempKey)
	if err != nil {
		log.Printf("wlt-api: TriggerReconciliationRun error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, run)
}

// POST /control-panel/payout-decisions
func (h *OperatorHandler) CreatePayoutDecision(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	var req domain.CreatePayoutDecisionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "invalid request body")
		return
	}

	idempKey := r.Header.Get("Idempotency-Key")
	if req.IdempotencyKey == "" {
		req.IdempotencyKey = idempKey
	}

	pd, err := h.repo.CreatePayoutDecision(r.Context(), req)
	if err != nil {
		log.Printf("wlt-api: CreatePayoutDecision error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, pd)
}

// GET /control-panel/reconciliation-close-status
func (h *OperatorHandler) GetReconciliationCloseStatus(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	fc, ok, err := h.repo.GetLatestFinanceClose(r.Context())
	if err != nil {
		log.Printf("wlt-api: GetReconciliationCloseStatus error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if !ok {
		// Default closed stub when no runs exist
		writeJSON(w, http.StatusOK, map[string]any{
			"id":     "WLT-DSH-CLOSE-000000",
			"status": "open",
		})
		return
	}

	writeJSON(w, http.StatusOK, fc)
}

// GET /control-panel/audit-events
func (h *OperatorHandler) ListAuditEvents(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	events, err := h.repo.ListAuditEvents(r.Context())
	if err != nil {
		log.Printf("wlt-api: ListAuditEvents error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	if events == nil {
		events = []domain.CallbackEvent{}
	}
	writeJSON(w, http.StatusOK, events)
}

// POST /control-panel/daily-close
func (h *OperatorHandler) SubmitDailyClose(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	var req struct {
		BusinessDate string `json:"businessDate"`
	}
	// Decode request body if present
	_ = json.NewDecoder(r.Body).Decode(&req)

	if req.BusinessDate == "" {
		req.BusinessDate = time.Now().UTC().Format("2006-01-02")
	}

	// Check if already closed
	existing, ok, err := h.repo.GetFinanceClose(r.Context(), req.BusinessDate)
	if err == nil && ok && existing.Status == "closed" {
		writeJSON(w, http.StatusOK, existing)
		return
	}

	// Trigger reconciliation run
	idempKey := "daily-close-" + req.BusinessDate
	run, err := h.repo.RunReconciliation(r.Context(), idempKey)
	if err != nil {
		log.Printf("wlt-api: SubmitDailyClose run reconciliation error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	status := "failed"
	if run.Status == "passed" {
		status = "closed"
	}

	n := time.Now().UTC()
	fc := domain.FinanceClose{
		BusinessDate:        req.BusinessDate,
		Status:              status,
		ReconciliationRunID: &run.ID,
		ClosedAt:            &n,
		CreatedAt:           n,
	}

	err = h.repo.UpsertFinanceClose(r.Context(), fc)
	if err != nil {
		log.Printf("wlt-api: SubmitDailyClose upsert finance close error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, fc)
}
