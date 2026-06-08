package httpapi

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

// WalletHandler provides read access to wallet state and the ledger.
// GET /wallets/{subject}/summary      — balance + stats for a subject
// GET /wallets/{subject}/transactions — paginated ledger entries
type WalletHandler struct {
	repo store.Repository
	mux  *http.ServeMux
}

func NewWalletHandler(repo store.Repository) *WalletHandler {
	h := &WalletHandler{repo: repo, mux: http.NewServeMux()}
	h.mux.HandleFunc("GET /wallets/{subject}/summary", h.Summary)
	h.mux.HandleFunc("GET /wallets/{subject}/transactions", h.Transactions)
	h.mux.HandleFunc("GET /ledger", h.LedgerAll)
	return h
}

func RegisterWalletRoutes(mux *http.ServeMux, repo store.Repository) {
	h := NewWalletHandler(repo)
	mux.Handle("GET /wallets/{subject}/summary", h)
	mux.Handle("GET /wallets/{subject}/transactions", h)
	mux.Handle("GET /ledger", h)
}

func (h *WalletHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	h.mux.ServeHTTP(w, r)
}

// Summary — GET /wallets/{subject}/summary
// Returns balance + aggregated credit/debit stats for the subject.
// Access rule: operator can query any subject; client/captain/partner can only query own subject.
func (h *WalletHandler) Summary(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	subject := r.PathValue("subject")
	if subject == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing subject")
		return
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		// Non-operators can only view their own wallet.
		if sess.Subject != subject {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another subject's wallet")
			return
		}
	}

	// Auto-detect actor type from session roles for wallet creation.
	actorType := actorTypeFromSession(sess)

	// Ensure wallet exists (creates it on first access with zero balance).
	if _, err := h.repo.GetOrCreateWallet(r.Context(), subject, actorType); err != nil {
		log.Printf("wlt-api: get or create wallet error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	summary, err := h.repo.GetWalletSummary(r.Context(), subject)
	if err != nil {
		if err.Error() == "wallet not found" {
			notFound(w)
			return
		}
		log.Printf("wlt-api: wallet summary error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, summary)
}

// Transactions — GET /wallets/{subject}/transactions?limit=50&offset=0
func (h *WalletHandler) Transactions(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}

	subject := r.PathValue("subject")
	if subject == "" {
		writeError(w, http.StatusBadRequest, domain.ErrorCodeInvalidParameter, "missing subject")
		return
	}

	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		if sess.Subject != subject {
			writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "cannot view another subject's transactions")
			return
		}
	}

	q := r.URL.Query()
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

	resp, err := h.repo.ListLedger(r.Context(), domain.ListLedgerQuery{
		Subject: subject,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		log.Printf("wlt-api: list ledger error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// LedgerAll — GET /ledger?subject=&limit=50&offset=0  (operator only)
// Returns ledger entries across all subjects when subject is empty, or for a specific subject.
func (h *WalletHandler) LedgerAll(w http.ResponseWriter, r *http.Request) {
	sess := requireIdentity(w, r)
	if sess == nil {
		return
	}
	if !HasRole(r, domain.ActorOperator) && !HasRole(r, domain.ActorSystem) {
		writeError(w, http.StatusForbidden, domain.ErrorCodeForbidden, "operator or system role required")
		return
	}

	q := r.URL.Query()
	subject := q.Get("subject")
	limit := 100
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

	resp, err := h.repo.ListLedger(r.Context(), domain.ListLedgerQuery{
		Subject: subject,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		log.Printf("wlt-api: ledger all error: %v", err)
		writeError(w, http.StatusInternalServerError, domain.ErrorCodeInternalError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// actorTypeFromSession returns the first recognised actor type from the session roles.
func actorTypeFromSession(sess *AuthSession) string {
	priority := []string{
		domain.ActorClient,
		domain.ActorCaptain,
		domain.ActorPartner,
		domain.ActorField,
		domain.ActorOperator,
	}
	for _, p := range priority {
		for _, r := range sess.Roles {
			if strings.EqualFold(r, p) {
				return p
			}
		}
	}
	return "unknown"
}
