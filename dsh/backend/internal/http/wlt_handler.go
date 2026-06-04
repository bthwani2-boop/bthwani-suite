package httpapi

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

// WltHandler simulates the WLT service.
// It maintains thread-safe simulated wallet balance and payment intents.
type WltHandler struct {
	mu      sync.Mutex
	balance int // in minor units
	linked  bool
	frozen  int
	intents map[string]*PaymentIntentResponse
}

type PaymentIntentResponse struct {
	ID               string `json:"id"`
	OrderID          string `json:"orderId"`
	AmountMinorUnits int    `json:"amountMinorUnits"`
	Currency         string `json:"currency"`
	Status           string `json:"status"`
}

type WalletBalanceResponse struct {
	BalanceMinorUnits int       `json:"balanceMinorUnits"`
	Currency          string    `json:"currency"`
	Linked            bool      `json:"linked"`
	FrozenMinorUnits  int       `json:"frozenMinorUnits"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type PaymentIntentRequest struct {
	OrderID          string `json:"orderId"`
	AmountMinorUnits int    `json:"amountMinorUnits"`
	Currency         string `json:"currency"`
}

type TopUpIntentRequest struct {
	AmountMinorUnits int    `json:"amountMinorUnits"`
	Currency         string `json:"currency"`
}

type TopUpIntentResponse struct {
	ID               string `json:"id"`
	AmountMinorUnits int    `json:"amountMinorUnits"`
	Currency         string `json:"currency"`
	Status           string `json:"status"`
	RedirectURL      string `json:"redirectUrl"`
}

func NewWltHandler() *WltHandler {
	return &WltHandler{
		balance: 50000, // Initialize client wallet balance to 50,000 YER minor units
		linked:  true,
		frozen:  0,
		intents: make(map[string]*PaymentIntentResponse),
	}
}

func RegisterWltRoutes(mux *http.ServeMux) {
	h := NewWltHandler()

	// Client wallet endpoints
	mux.HandleFunc("GET /wlt/dsh/client/wallet/summary", h.GetWalletSummary)
	mux.HandleFunc("POST /wlt/dsh/client/payment-intents", h.CreatePaymentIntent)
	mux.HandleFunc("POST /wlt/dsh/client/top-up-intents", h.CreateTopUpIntent)

	// Captain eligibility and finance stubs
	mux.HandleFunc("GET /wlt/dsh/captain/eligibility", h.GetCaptainEligibility)
	mux.HandleFunc("GET /wlt/dsh/captain/cod-liabilities", h.GetCaptainCodLiabilities)
	mux.HandleFunc("GET /wlt/dsh/captain/earnings", h.GetCaptainEarnings)
	mux.HandleFunc("POST /wlt/dsh/captain/top-up-intents", h.CreateCaptainTopUpIntent)

	// Partner settlement stubs
	mux.HandleFunc("GET /wlt/dsh/partner/settlement-cycles", h.GetPartnerSettlementCycles)

	// Field commission stubs
	mux.HandleFunc("GET /wlt/dsh/field/commissions", h.GetFieldCommissions)

	// Control panel stubs
	mux.HandleFunc("GET /wlt/dsh/control-panel/finance/overview", h.GetFinanceOverview)
	mux.HandleFunc("GET /wlt/dsh/control-panel/reconciliation-runs", h.GetReconciliationRuns)
	mux.HandleFunc("POST /wlt/dsh/control-panel/reconciliation-runs", h.TriggerReconciliationRun)
}

func (h *WltHandler) GetWalletSummary(w http.ResponseWriter, r *http.Request) {
	h.mu.Lock()
	defer h.mu.Unlock()

	writeJSON(w, http.StatusOK, WalletBalanceResponse{
		BalanceMinorUnits: h.balance,
		Currency:          "YER",
		Linked:            h.linked,
		FrozenMinorUnits:  h.frozen,
		UpdatedAt:         time.Now(),
	})
}

func (h *WltHandler) CreatePaymentIntent(w http.ResponseWriter, r *http.Request) {
	var req PaymentIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	intentID := "tx-" + time.Now().Format("20060102150405")
	status := "captured"

	if h.balance < req.AmountMinorUnits {
		status = "failed"
	} else {
		h.balance -= req.AmountMinorUnits
	}

	intent := &PaymentIntentResponse{
		ID:               intentID,
		OrderID:          req.OrderID,
		AmountMinorUnits: req.AmountMinorUnits,
		Currency:         "YER",
		Status:           status,
	}

	h.intents[intentID] = intent
	writeJSON(w, http.StatusCreated, intent)
}

func (h *WltHandler) CreateTopUpIntent(w http.ResponseWriter, r *http.Request) {
	var req TopUpIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	h.mu.Lock()
	h.balance += req.AmountMinorUnits
	h.mu.Unlock()

	topupID := "topup-" + time.Now().Format("20060102150405")
	writeJSON(w, http.StatusCreated, TopUpIntentResponse{
		ID:               topupID,
		AmountMinorUnits: req.AmountMinorUnits,
		Currency:         "YER",
		Status:           "completed",
		RedirectURL:      "https://wlt.bthwani.local/redirect",
	})
}

func (h *WltHandler) GetCaptainEligibility(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"eligible":                  true,
		"balanceMinorUnits":         25000,
		"currency":                  "YER",
		"minimumRequiredMinorUnits": 5000,
		"note":                      "الكابتن مؤهل للعمل والتحصيل",
	})
}

func (h *WltHandler) GetCaptainCodLiabilities(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, []any{
		map[string]any{
			"id":               "cod-101",
			"orderId":          "ord-10021",
			"amountMinorUnits": 4500,
			"currency":         "YER",
			"status":           "outstanding",
			"dueAt":            time.Now().Add(-2 * time.Hour),
		},
	})
}

func (h *WltHandler) GetCaptainEarnings(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, []any{
		map[string]any{
			"id":          "earn-201",
			"type":        "settlement",
			"amount":      map[string]any{"amountMinorUnits": 12000, "currency": "YER"},
			"referenceId": "ord-10021",
			"note":        "أرباح توصيل الطلب",
			"createdAt":   time.Now().Add(-1 * time.Hour),
		},
	})
}

func (h *WltHandler) CreateCaptainTopUpIntent(w http.ResponseWriter, r *http.Request) {
	var req TopUpIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{
		"id":               "topup-cap-" + time.Now().Format("20060102150405"),
		"amountMinorUnits": req.AmountMinorUnits,
		"currency":         "YER",
		"status":           "completed",
	})
}

func (h *WltHandler) GetPartnerSettlementCycles(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, []any{
		map[string]any{
			"id":                  "cycle-401",
			"periodStart":         "2026-06-01",
			"periodEnd":           "2026-06-07",
			"netAmountMinorUnits": 85000,
			"currency":            "YER",
			"status":              "pending",
		},
	})
}

func (h *WltHandler) GetFieldCommissions(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, []any{
		map[string]any{
			"id":               "comm-501",
			"storeId":          "store-1001",
			"amountMinorUnits": 1500,
			"currency":         "YER",
			"status":           "approved",
			"earnedAt":         time.Now().Add(-24 * time.Hour),
		},
	})
}

func (h *WltHandler) GetFinanceOverview(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"amountMinorUnits": 1584000,
		"currency":         "YER",
		"displayLabel":     "1,584,000 ر.ي",
	})
}

func (h *WltHandler) GetReconciliationRuns(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, []any{
		map[string]any{
			"id":                      "recon-901",
			"status":                  "completed",
			"periodStart":             "2026-06-03",
			"periodEnd":               "2026-06-03",
			"varianceTotalMinorUnits": 0,
			"evidenceComplete":        true,
			"createdAt":               time.Now().Add(-12 * time.Hour),
		},
	})
}

func (h *WltHandler) TriggerReconciliationRun(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusCreated, map[string]any{
		"id":                      "recon-" + time.Now().Format("20060102150405"),
		"status":                  "completed",
		"periodStart":             "2026-06-04",
		"periodEnd":               "2026-06-04",
		"varianceTotalMinorUnits": 0,
		"evidenceComplete":        true,
		"createdAt":               time.Now(),
	})
}
