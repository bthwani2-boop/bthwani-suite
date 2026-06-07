package store

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"bthwani.local/dsh/domain"
)

// In-memory checkout state — not thread-safe under concurrent load,
// but sufficient for local development without a Postgres instance.
var (
	memCheckoutMu      sync.Mutex
	memCheckoutIntents []domain.CheckoutIntentRecord
	memCheckoutSeq     atomic.Uint64
)

func generateIntentID() string {
	return fmt.Sprintf("intent-%d-%d", time.Now().UnixNano(), memCheckoutSeq.Add(1))
}

func generateSessionToken() string {
	return fmt.Sprintf("sess-%d-%d", time.Now().UnixNano(), memCheckoutSeq.Add(1))
}

func (repo *MemoryRepository) CheckCartServiceability(_ context.Context, query domain.CartServiceabilityQuery) (domain.CartServiceabilityResponse, error) {
	for _, s := range repo.stores {
		if s.summary.ID != query.StoreID {
			continue
		}
		if s.summary.StatusTone != domain.StoreStatusOpen {
			return domain.CartServiceabilityResponse{
				Serviceable: false,
				StoreID:     query.StoreID,
				ReasonCode:  "store_closed",
			}, nil
		}
		if s.partnerReadinessStatus != "ready" {
			return domain.CartServiceabilityResponse{
				Serviceable: false,
				StoreID:     query.StoreID,
				ReasonCode:  "partner_not_ready",
			}, nil
		}
		return domain.CartServiceabilityResponse{
			Serviceable: true,
			StoreID:     query.StoreID,
		}, nil
	}
	return domain.CartServiceabilityResponse{}, fmt.Errorf("store not found")
}

func (repo *MemoryRepository) CreateCheckoutIntent(_ context.Context, clientID string, req domain.CheckoutIntentRequest) (domain.CheckoutIntentResponse, error) {
	memCheckoutMu.Lock()
	defer memCheckoutMu.Unlock()

	// Check no active intent for this client+store
	for _, intent := range memCheckoutIntents {
		if intent.ClientID == clientID && intent.StoreID == req.StoreID &&
			intent.Status == domain.CheckoutStatusPendingPayment &&
			time.Now().Before(intent.ExpiresAt) {
			return domain.CheckoutIntentResponse{}, fmt.Errorf("active checkout session already exists")
		}
	}

	now := time.Now()
	intent := domain.CheckoutIntentRecord{
		ID:           generateIntentID(),
		ClientID:     clientID,
		StoreID:      req.StoreID,
		Status:       domain.CheckoutStatusPendingPayment,
		SessionToken: generateSessionToken(),
		ExpiresAt:    now.Add(15 * time.Minute),
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	memCheckoutIntents = append(memCheckoutIntents, intent)

	// In-memory mode has no product catalog — amounts are zero.
	// When connected to Postgres, CreateCheckoutIntent computes amounts from real product prices.
	return domain.CheckoutIntentResponse{
		IntentID:                intent.ID,
		SessionToken:            intent.SessionToken,
		Status:                  intent.Status,
		ExpiresAt:               intent.ExpiresAt,
		ItemsSubtotalMinorUnits: 0,
		DeliveryFeeMinorUnits:   0,
		TotalAmountMinorUnits:   0,
	}, nil
}

func (repo *MemoryRepository) CancelCheckoutIntent(_ context.Context, intentID string, clientID string) (domain.CancelCheckoutIntentResponse, error) {
	memCheckoutMu.Lock()
	defer memCheckoutMu.Unlock()

	for i, intent := range memCheckoutIntents {
		if intent.ID != intentID {
			continue
		}
		if intent.ClientID != clientID {
			return domain.CancelCheckoutIntentResponse{}, fmt.Errorf("intent not found")
		}
		if intent.Status == domain.CheckoutStatusPaymentConfirmed {
			return domain.CancelCheckoutIntentResponse{}, fmt.Errorf("cannot cancel a confirmed payment intent")
		}
		memCheckoutIntents[i].Status = domain.CheckoutStatusCancelled
		memCheckoutIntents[i].UpdatedAt = time.Now()
		return domain.CancelCheckoutIntentResponse{
			IntentID:      intentID,
			Status:        domain.CheckoutStatusCancelled,
			CartPreserved: true,
		}, nil
	}
	return domain.CancelCheckoutIntentResponse{}, fmt.Errorf("intent not found")
}

func (repo *MemoryRepository) ProcessPaymentCallback(_ context.Context, req domain.PaymentCallbackRequest) (domain.PaymentCallbackResponse, error) {
	memCheckoutMu.Lock()
	defer memCheckoutMu.Unlock()

	for i, intent := range memCheckoutIntents {
		if intent.ID != req.IntentID {
			continue
		}
		// Replay protection: same event_id already processed — return idempotent ack.
		if intent.WltCallbackEventID != "" && intent.WltCallbackEventID == req.CallbackEventID {
			nextAction := "create_order"
			if intent.Status == domain.CheckoutStatusPaymentFailed {
				nextAction = "show_failure"
			}
			return domain.PaymentCallbackResponse{
				Acknowledged: true,
				IntentID:     req.IntentID,
				NextAction:   nextAction,
			}, nil
		}
		if req.Status == "confirmed" {
			memCheckoutIntents[i].Status = domain.CheckoutStatusPaymentConfirmed
			memCheckoutIntents[i].WltPaymentRefID = &req.WltPaymentRefID
			memCheckoutIntents[i].WltCallbackEventID = req.CallbackEventID
			memCheckoutIntents[i].UpdatedAt = time.Now()
			return domain.PaymentCallbackResponse{
				Acknowledged: true,
				IntentID:     req.IntentID,
				NextAction:   "create_order",
			}, nil
		}
		memCheckoutIntents[i].Status = domain.CheckoutStatusPaymentFailed
		memCheckoutIntents[i].FailureReason = req.FailureReason
		memCheckoutIntents[i].WltCallbackEventID = req.CallbackEventID
		memCheckoutIntents[i].UpdatedAt = time.Now()
		return domain.PaymentCallbackResponse{
			Acknowledged: true,
			IntentID:     req.IntentID,
			NextAction:   "show_failure",
		}, nil
	}
	return domain.PaymentCallbackResponse{}, fmt.Errorf("intent not found")
}
