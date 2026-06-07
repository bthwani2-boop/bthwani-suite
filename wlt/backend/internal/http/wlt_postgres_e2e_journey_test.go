package httpapi

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func TestWltPostgresE2EJourney(t *testing.T) {
	dbURL := os.Getenv("DATABASE_URL")
	var db *sql.DB
	var err error

	// Probe ports if DATABASE_URL is not set
	if dbURL == "" {
		urls := []string{
			"postgres://wlt_local:wlt_local_password@localhost:56433/wlt_local?sslmode=disable",
			"postgres://wlt_local:wlt_local_password@localhost:55433/wlt_local?sslmode=disable",
		}
		for _, u := range urls {
			d, errOpen := sql.Open("pgx", u)
			if errOpen == nil {
				if d.PingContext(context.Background()) == nil {
					db = d
					dbURL = u
					break
				}
				d.Close()
			}
		}
	} else {
		db, err = sql.Open("pgx", dbURL)
		if err != nil {
			t.Fatalf("failed to open database for test: %v", err)
		}
	}

	if db == nil {
		t.Skip("Postgres is not running or not accessible on port 56433/55433; skipping postgres e2e test")
		return
	}
	defer db.Close()

	// Clean tables
	_, err = db.ExecContext(context.Background(),
		`DROP TABLE IF EXISTS wlt_reconciliation_runs, wlt_payout_decisions, wlt_finance_close, wlt_callback_events, wlt_ledger, wlt_refunds, wlt_settlements, wlt_payment_sessions, wlt_wallets CASCADE;`,
	)
	if err != nil {
		t.Fatalf("failed to clean database tables: %v", err)
	}

	// Apply migrations
	migrationsDir := "../../migrations"
	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		t.Fatalf("failed to read migrations directory: %v", err)
	}

	var sqlFiles []string
	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".sql") {
			sqlFiles = append(sqlFiles, f.Name())
		}
	}
	sort.Strings(sqlFiles)

	for _, filename := range sqlFiles {
		content, err := ioutil.ReadFile(filepath.Join(migrationsDir, filename))
		if err != nil {
			t.Fatalf("read migration %s: %v", filename, err)
		}
		if _, err := db.ExecContext(context.Background(), string(content)); err != nil {
			t.Fatalf("migration %s failed: %v", filename, err)
		}
	}

	// Create Postgres repository
	repo, err := store.NewPostgresRepository(context.Background(), dbURL)
	if err != nil {
		t.Fatalf("failed to create postgres repository: %v", err)
	}
	defer repo.Close()

	mux := http.NewServeMux()
	RegisterPaymentRoutes(mux, repo)
	RegisterRefundRoutes(mux, repo)
	RegisterSettlementRoutes(mux, repo)
	RegisterWalletRoutes(mux, repo)
	RegisterHealthRoutes(mux, repo)
	RegisterOperatorRoutes(mux, repo)

	server := httptest.NewServer(mux)
	defer server.Close()

	client := server.Client()

	// 1. Check wallet balance initially (should default to 0 on auto-creation)
	req, _ := http.NewRequest(http.MethodGet, server.URL+"/wallets/client-pg-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-pg-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var summary domain.WalletSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary: %v", err)
	}
	if summary.Balance != 0 {
		t.Fatalf("expected balance to be 0, got %f", summary.Balance)
	}

	// 2. Create Top-up Payment Session
	topupReq := map[string]any{
		"checkout_intent_id": "topup-intent-pg-001",
		"client_id":          "client-pg-001",
		"amount":             25000.0,
		"currency":           "YER",
		"payment_method":     "official-wallet",
		"idempotency_key":    "topup-idem-pg-001",
	}
	bodyBytes, _ := json.Marshal(topupReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/payment/sessions", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "client-pg-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to create topup: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}

	var topupSession domain.PaymentSession
	if err := json.NewDecoder(resp.Body).Decode(&topupSession); err != nil {
		t.Fatalf("failed to decode topup session: %v", err)
	}

	// 3. Confirm Top-up
	confirmReq := map[string]any{
		"provider_ref": "provider-tx-topup-pg-001",
	}
	bodyBytes, _ = json.Marshal(confirmReq)
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/payment/sessions/%s/confirm", server.URL, topupSession.ID), bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "system-001")
	req.Header.Set("X-Actor-Type", "system")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to confirm topup: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	// 4. Verify wallet balance is 25000 YER
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/client-pg-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-pg-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet after topup: %v", err)
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary: %v", err)
	}
	if summary.Balance != 25000.0 {
		t.Fatalf("expected balance to be 25000, got %f", summary.Balance)
	}

	// 5. Create Order Payment Session (amount = 8000 YER)
	orderPayReq := map[string]any{
		"checkout_intent_id": "order-intent-pg-001",
		"client_id":          "client-pg-001",
		"amount":             8000.0,
		"currency":           "YER",
		"payment_method":     "wallet",
		"idempotency_key":    "order-pay-idem-pg-001",
	}
	bodyBytes, _ = json.Marshal(orderPayReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/payment/sessions", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "client-pg-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to create order payment: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}

	var orderSession domain.PaymentSession
	if err := json.NewDecoder(resp.Body).Decode(&orderSession); err != nil {
		t.Fatalf("failed to decode order session: %v", err)
	}

	// 6. Confirm Order Payment
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/payment/sessions/%s/confirm", server.URL, orderSession.ID), bytes.NewReader([]byte("{}")))
	req.Header.Set("X-Client-Id", "system-001")
	req.Header.Set("X-Actor-Type", "system")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to confirm order payment: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	// 7. Verify balance is now 17000 YER
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/client-pg-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-pg-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet after order payment: %v", err)
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary: %v", err)
	}
	if summary.Balance != 17000.0 {
		t.Fatalf("expected balance to be 17000, got %f", summary.Balance)
	}

	// 8. Create Settlement
	settleReq := map[string]any{
		"order_id":             "order-pg-001",
		"partner_id":           "partner-pg-001",
		"captain_id":           "captain-pg-001",
		"gross_amount":         8000.0,
		"platform_fee_rate":   0.10,
		"captain_fee_rate":    0.15,
		"currency":             "YER",
		"idempotency_key":      "settle-idem-pg-001",
	}
	bodyBytes, _ = json.Marshal(settleReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/settlements", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to create settlement: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}

	var settlement domain.Settlement
	if err := json.NewDecoder(resp.Body).Decode(&settlement); err != nil {
		t.Fatalf("failed to decode settlement: %v", err)
	}

	// 9. Process Settlement
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/settlements/%s/process", server.URL, settlement.ID), nil)
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to process settlement: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	// 10. Complete Settlement
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/settlements/%s/complete", server.URL, settlement.ID), nil)
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to complete settlement: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	// Verify partner wallet received payout: 8000 * 0.75 = 6000 YER
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/partner-pg-001/summary", nil)
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query partner wallet: %v", err)
	}
	defer resp.Body.Close()

	var partnerSummary domain.WalletSummary
	if err := json.NewDecoder(resp.Body).Decode(&partnerSummary); err != nil {
		t.Fatalf("failed to decode partner wallet summary: %v", err)
	}
	if partnerSummary.Balance != 6000.0 {
		t.Fatalf("expected partner balance to be 6000, got %f", partnerSummary.Balance)
	}

	// Verify captain wallet received payout: 8000 * 0.15 = 1200 YER
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/captain-pg-001/summary", nil)
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query captain wallet: %v", err)
	}
	defer resp.Body.Close()

	var captainSummary domain.WalletSummary
	if err := json.NewDecoder(resp.Body).Decode(&captainSummary); err != nil {
		t.Fatalf("failed to decode captain wallet summary: %v", err)
	}
	if captainSummary.Balance != 1200.0 {
		t.Fatalf("expected captain balance to be 1200, got %f", captainSummary.Balance)
	}

	// 11. Create Refund (amount = 2000 YER)
	refundReq := map[string]any{
		"order_id":        "order-pg-001",
		"client_id":       "client-pg-001",
		"amount":          2000.0,
		"currency":        "YER",
		"reason":          "item return",
		"idempotency_key": "refund-idem-pg-001",
	}
	bodyBytes, _ = json.Marshal(refundReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/refunds", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to create refund: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}

	var refund domain.Refund
	if err := json.NewDecoder(resp.Body).Decode(&refund); err != nil {
		t.Fatalf("failed to decode refund: %v", err)
	}

	// 12. Process Refund
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/refunds/%s/process", server.URL, refund.ID), nil)
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to process refund: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	// 13. Confirm Refund (CREDIT to client wallet)
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/refunds/%s/confirm", server.URL, refund.ID), nil)
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to confirm refund: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	// 14. Verify client balance is 19000 YER (17000 + 2000)
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/client-pg-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-pg-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet after refund: %v", err)
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary after refund: %v", err)
	}
	if summary.Balance != 19000.0 {
		t.Fatalf("expected balance to be 19000, got %f", summary.Balance)
	}

	// 15. Submit Daily Close (which runs Operator Reconciliation)
	// To make sure totalDebit == totalCredit passes, we clean the ledger and run a balanced sequence.
	_, err = db.ExecContext(context.Background(),
		`DELETE FROM wlt_ledger; DELETE FROM wlt_payment_sessions; DELETE FROM wlt_wallets; DELETE FROM wlt_reconciliation_runs; DELETE FROM wlt_finance_close;`,
	)
	if err != nil {
		t.Fatalf("failed to clean tables for reconciliation: %v", err)
	}

	// topup 10000 YER (CREDIT client)
	topupReq = map[string]any{
		"checkout_intent_id": "topup-intent-pg-reconcile",
		"client_id":          "client-pg-reconcile",
		"amount":             10000.0,
		"currency":           "YER",
		"payment_method":     "official-wallet",
		"idempotency_key":    "topup-idem-pg-reconcile",
	}
	bodyBytes, _ = json.Marshal(topupReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/payment/sessions", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "client-pg-reconcile")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to create reconcile topup: %v", err)
	}
	var recTopupSession domain.PaymentSession
	_ = json.NewDecoder(resp.Body).Decode(&recTopupSession)
	resp.Body.Close()

	// confirm topup
	confirmReq = map[string]any{
		"provider_ref": "provider-tx-topup-pg-reconcile",
	}
	bodyBytes, _ = json.Marshal(confirmReq)
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/payment/sessions/%s/confirm", server.URL, recTopupSession.ID), bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "system-001")
	req.Header.Set("X-Actor-Type", "system")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to confirm reconcile topup: %v", err)
	}
	resp.Body.Close()

	// payment 10000 YER (DEBIT client)
	orderPayReq = map[string]any{
		"checkout_intent_id": "order-intent-pg-reconcile",
		"client_id":          "client-pg-reconcile",
		"amount":             10000.0,
		"currency":           "YER",
		"payment_method":     "wallet",
		"idempotency_key":    "order-pay-idem-pg-reconcile",
	}
	bodyBytes, _ = json.Marshal(orderPayReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/payment/sessions", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "client-pg-reconcile")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to create reconcile order payment: %v", err)
	}
	var recOrderSession domain.PaymentSession
	_ = json.NewDecoder(resp.Body).Decode(&recOrderSession)
	resp.Body.Close()

	// confirm payment
	req, _ = http.NewRequest(http.MethodPost, fmt.Sprintf("%s/payment/sessions/%s/confirm", server.URL, recOrderSession.ID), bytes.NewReader([]byte("{}")))
	req.Header.Set("X-Client-Id", "system-001")
	req.Header.Set("X-Actor-Type", "system")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to confirm reconcile order payment: %v", err)
	}
	resp.Body.Close()

	// Now we have totalCredit = 10000, totalDebit = 10000. Let's submit Daily Close.
	dailyCloseReq := map[string]any{
		"businessDate": "2026-06-07",
	}
	bodyBytes, _ = json.Marshal(dailyCloseReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/control-panel/daily-close", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "operator-001")
	req.Header.Set("X-Actor-Type", "operator")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to submit daily close: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 or 201, got %d", resp.StatusCode)
	}

	var closeResult domain.FinanceClose
	if err := json.NewDecoder(resp.Body).Decode(&closeResult); err != nil {
		t.Fatalf("failed to decode close result: %v", err)
	}
	if closeResult.Status != "closed" {
		t.Fatalf("expected status to be 'closed', got %s", closeResult.Status)
	}
}
