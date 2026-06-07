package httpapi

import (
	"net/http"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// ReportingHandler handles control-panel reporting and accounting features.
type ReportingHandler struct {
	repo store.Repository
	mux  *http.ServeMux
}

func NewReportingHandler(repo store.Repository) *ReportingHandler {
	h := &ReportingHandler{repo: repo, mux: http.NewServeMux()}

	// Register routes with and without /wlt/dsh prefix for robustness and backward compatibility

	// 1. Finance Center
	h.mux.HandleFunc("GET /control-panel/finance-center", h.GetControlPanelFinanceCenter)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/finance-center", h.GetControlPanelFinanceCenter)

	// 2. Store Settlement Statements
	h.mux.HandleFunc("GET /control-panel/store-settlement-statements", h.ListStoreSettlementStatements)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/store-settlement-statements", h.ListStoreSettlementStatements)

	// 3. Account Statements
	h.mux.HandleFunc("GET /control-panel/account-statements", h.ListControlPanelAccountStatements)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/account-statements", h.ListControlPanelAccountStatements)

	// 4. Chart of Accounts
	h.mux.HandleFunc("GET /control-panel/chart-of-accounts", h.ListChartOfAccounts)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/chart-of-accounts", h.ListChartOfAccounts)

	// 5. Subledger Balances
	h.mux.HandleFunc("GET /control-panel/subledger-balances", h.ListSubledgerBalances)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/subledger-balances", h.ListSubledgerBalances)

	// 6. Posting Rules
	h.mux.HandleFunc("GET /control-panel/posting-rules", h.ListPostingRules)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/posting-rules", h.ListPostingRules)

	// 7. Trial Balance
	h.mux.HandleFunc("GET /control-panel/trial-balance", h.GetTrialBalance)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/trial-balance", h.GetTrialBalance)

	// 8. Settlement Calendar
	h.mux.HandleFunc("GET /control-panel/settlement-calendar", h.ListSettlementCalendar)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/settlement-calendar", h.ListSettlementCalendar)

	// 9. Refund Ledger
	h.mux.HandleFunc("GET /control-panel/refund-ledger", h.ListRefundLedger)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/refund-ledger", h.ListRefundLedger)

	// 10. Audit Pack
	h.mux.HandleFunc("GET /control-panel/audit-pack", h.GetAuditPack)
	h.mux.HandleFunc("GET /wlt/dsh/control-panel/audit-pack", h.GetAuditPack)

	// 11. Store Delivery Finance Summary
	h.mux.HandleFunc("GET /store-delivery/finance-summary", h.GetStoreDeliveryFinanceSummary)
	h.mux.HandleFunc("GET /wlt/dsh/store-delivery/finance-summary", h.GetStoreDeliveryFinanceSummary)

	return h
}

func RegisterReportingRoutes(mux *http.ServeMux, repo store.Repository) {
	h := NewReportingHandler(repo)

	// Register handlers on the parent ServeMux
	mux.Handle("GET /control-panel/finance-center", h)
	mux.Handle("GET /wlt/dsh/control-panel/finance-center", h)

	mux.Handle("GET /control-panel/store-settlement-statements", h)
	mux.Handle("GET /wlt/dsh/control-panel/store-settlement-statements", h)

	mux.Handle("GET /control-panel/account-statements", h)
	mux.Handle("GET /wlt/dsh/control-panel/account-statements", h)

	mux.Handle("GET /control-panel/chart-of-accounts", h)
	mux.Handle("GET /wlt/dsh/control-panel/chart-of-accounts", h)

	mux.Handle("GET /control-panel/subledger-balances", h)
	mux.Handle("GET /wlt/dsh/control-panel/subledger-balances", h)

	mux.Handle("GET /control-panel/posting-rules", h)
	mux.Handle("GET /wlt/dsh/control-panel/posting-rules", h)

	mux.Handle("GET /control-panel/trial-balance", h)
	mux.Handle("GET /wlt/dsh/control-panel/trial-balance", h)

	mux.Handle("GET /control-panel/settlement-calendar", h)
	mux.Handle("GET /wlt/dsh/control-panel/settlement-calendar", h)

	mux.Handle("GET /control-panel/refund-ledger", h)
	mux.Handle("GET /wlt/dsh/control-panel/refund-ledger", h)

	mux.Handle("GET /control-panel/audit-pack", h)
	mux.Handle("GET /wlt/dsh/control-panel/audit-pack", h)

	mux.Handle("GET /store-delivery/finance-summary", h)
	mux.Handle("GET /wlt/dsh/store-delivery/finance-summary", h)
}

func (h *ReportingHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

func requireOperatorOrSystem(w http.ResponseWriter, r *http.Request) *AuthSession {
	sess := requireIdentity(w, r)
	if sess == nil {
		return nil
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return nil
	}
	return sess
}

// GET /control-panel/finance-center
func (h *ReportingHandler) GetControlPanelFinanceCenter(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.GetControlPanelFinanceCenter(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/store-settlement-statements
func (h *ReportingHandler) ListStoreSettlementStatements(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	partnerID := r.URL.Query().Get("partnerId")
	if partnerID == "" {
		partnerID = r.URL.Query().Get("partner_id")
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		// Non-operators can only view their own partner statements
		if sess.Subject != partnerID {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another partner's statements")
			return
		}
	}

	statements, err := h.repo.ListStoreSettlementStatements(r.Context(), partnerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if statements == nil {
		statements = []domain.StoreSettlementStatement{}
	}
	writeJSON(w, http.StatusOK, statements)
}

// GET /control-panel/account-statements
func (h *ReportingHandler) ListControlPanelAccountStatements(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	actorKind := r.URL.Query().Get("actorKind")
	if actorKind == "" {
		actorKind = r.URL.Query().Get("actor_kind")
	}

	statements, err := h.repo.ListControlPanelAccountStatements(r.Context(), actorKind)
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if statements == nil {
		statements = []domain.AccountStatement{}
	}
	writeJSON(w, http.StatusOK, statements)
}

// GET /control-panel/chart-of-accounts
func (h *ReportingHandler) ListChartOfAccounts(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.ListChartOfAccounts(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if res == nil {
		res = []domain.ChartOfAccount{}
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/subledger-balances
func (h *ReportingHandler) ListSubledgerBalances(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.ListSubledgerBalances(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if res == nil {
		res = []domain.SubledgerBalance{}
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/posting-rules
func (h *ReportingHandler) ListPostingRules(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.ListPostingRules(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if res == nil {
		res = []domain.PostingRule{}
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/trial-balance
func (h *ReportingHandler) GetTrialBalance(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.GetTrialBalance(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/settlement-calendar
func (h *ReportingHandler) ListSettlementCalendar(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.ListSettlementCalendar(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if res == nil {
		res = []domain.SettlementCalendarCycle{}
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/refund-ledger
func (h *ReportingHandler) ListRefundLedger(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.ListRefundLedger(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	if res == nil {
		res = []domain.RefundLedgerCase{}
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /control-panel/audit-pack
func (h *ReportingHandler) GetAuditPack(w http.ResponseWriter, r *http.Request) {
	if requireOperatorOrSystem(w, r) == nil {
		return
	}
	res, err := h.repo.GetAuditPack(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, res)
}

// GET /store-delivery/finance-summary
func (h *ReportingHandler) GetStoreDeliveryFinanceSummary(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	captainID := r.URL.Query().Get("captainId")
	if captainID == "" {
		captainID = r.URL.Query().Get("captain_id")
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		// Non-operators can only view their own captain ID
		if sess.Subject != captainID {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another captain's finance summary")
			return
		}
	}

	summary, err := h.repo.GetStoreDeliveryFinanceSummary(r.Context(), captainID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, summary)
}
