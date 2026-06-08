package httpapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"bthwani.local/wlt/backend/internal/store"
	"bthwani.local/wlt/domain"
)

func TestWltE2EJourney(t *testing.T) {
	repo := store.NewMemoryRepository()
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

	// 1. Check wallet balance initially (should not exist / default is 0)
	req, _ := http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-dev-001")
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

	// 2. Create Top-up Payment Session (checkout_intent_id starts with "topup")
	topupReq := map[string]any{
		"checkout_intent_id": "topup-intent-001",
		"client_id":          "client-dev-001",
		"amount":             15000.0,
		"currency":           "YER",
		"payment_method":     "official-wallet",
		"idempotency_key":    "topup-idem-key-001",
	}
	bodyBytes, _ := json.Marshal(topupReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/payment/sessions", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "client-dev-001")
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
		t.Fatalf("failed to decode topup payment session: %v", err)
	}

	// 3. Confirm Top-up (CREDIT transaction on client wallet)
	confirmReq := map[string]any{
		"provider_ref": "provider-tx-topup-001",
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

	// 4. Verify wallet balance is 15000 YER
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-dev-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet after topup: %v", err)
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary after topup: %v", err)
	}
	if summary.Balance != 15000.0 {
		t.Fatalf("expected balance to be 15000, got %f", summary.Balance)
	}

	// 5. Create Order Payment Session using client wallet (amount = 4500 YER)
	orderPayReq := map[string]any{
		"checkout_intent_id": "order-intent-1001",
		"client_id":          "client-dev-001",
		"amount":             4500.0,
		"currency":           "YER",
		"payment_method":     "wallet",
		"idempotency_key":    "order-pay-idem-key-1001",
	}
	bodyBytes, _ = json.Marshal(orderPayReq)
	req, _ = http.NewRequest(http.MethodPost, server.URL+"/payment/sessions", bytes.NewReader(bodyBytes))
	req.Header.Set("X-Client-Id", "client-dev-001")
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
		t.Fatalf("failed to decode order payment session: %v", err)
	}

	// 6. Confirm Order Payment (DEBIT transaction on client wallet)
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

	// 7. Verify balance is now 10500 YER (15000 - 4500)
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-dev-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet after order payment: %v", err)
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary after order payment: %v", err)
	}
	if summary.Balance != 10500.0 {
		t.Fatalf("expected balance to be 10500, got %f", summary.Balance)
	}

	// 8. Create Settlement (Gross: 4500, partner receives remaining payout)
	settleReq := map[string]any{
		"order_id":             "order-1001",
		"partner_id":           "partner-dev-001",
		"captain_id":           "captain-dev-001",
		"gross_amount":         4500.0,
		"platform_fee_rate":   0.10,
		"captain_fee_rate":    0.15,
		"currency":             "YER",
		"idempotency_key":      "settle-idem-key-1001",
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

	// 9. Process Settlement (PENDING -> PROCESSING)
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

	// 10. Complete Settlement (PROCESSING -> COMPLETED)
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

	// Verify partner wallet received their payout: 4500 * (1 - 0.10 - 0.15) = 4500 * 0.75 = 3375
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/partner-dev-001/summary", nil)
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
	if partnerSummary.Balance != 3375.0 {
		t.Fatalf("expected partner balance to be 3375, got %f", partnerSummary.Balance)
	}

	// Verify captain wallet received their payout: 4500 * 0.15 = 675
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/captain-dev-001/summary", nil)
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
	if captainSummary.Balance != 675.0 {
		t.Fatalf("expected captain balance to be 675, got %f", captainSummary.Balance)
	}

	// 11. Create Refund (disputed order-1001, refund amount = 1000 YER)
	refundReq := map[string]any{
		"order_id":        "order-1001",
		"client_id":       "client-dev-001",
		"amount":          1000.0,
		"currency":        "YER",
		"reason":          "damaged item",
		"idempotency_key": "refund-idem-key-1001",
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

	// 12. Process Refund (PENDING -> PROCESSING)
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

	// 13. Confirm Refund (PROCESSING -> CONFIRMED, CREDIT to client wallet)
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

	// 14. Verify client balance is 11500 YER (10500 + 1000)
	req, _ = http.NewRequest(http.MethodGet, server.URL+"/wallets/client-dev-001/summary", nil)
	req.Header.Set("X-Client-Id", "client-dev-001")
	req.Header.Set("X-Actor-Type", "client")
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("failed to query wallet after refund: %v", err)
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("failed to decode wallet summary after refund: %v", err)
	}
	if summary.Balance != 11500.0 {
		t.Fatalf("expected balance to be 11500, got %f", summary.Balance)
	}
}
