package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"bthwani.local/dsh/domain"
)

type mockAuthService struct {
	validToken string
	subject    string
	roles      []string
}

func (m *mockAuthService) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth != "Bearer "+m.validToken {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "unauthenticated"}) //nolint:errcheck
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(authSessionResponse{
		Subject:   m.subject,
		AuthState: "authenticated",
		Roles:     m.roles,
	}) //nolint:errcheck
}

type mockSupportOrderRepository struct {
	orders      map[string]domain.OrderRecord
	escalations map[string]domain.SupportEscalationRecord
}

func (m *mockSupportOrderRepository) GetOrder(ctx context.Context, orderID string) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	ord, ok := m.orders[orderID]
	if !ok {
		return domain.OrderRecord{}, nil, errors.New("order not found")
	}
	return ord, nil, nil
}

func (m *mockSupportOrderRepository) CreateSupportEscalation(ctx context.Context, req domain.CreateSupportEscalationRequest) (domain.SupportEscalationRecord, error) {
	rec := domain.SupportEscalationRecord{
		ID:          "esc-123",
		OrderID:     req.OrderID,
		Actor:       req.Actor,
		IssueType:   req.IssueType,
		Description: req.Description,
		Status:      "escalated",
	}
	m.escalations[rec.ID] = rec
	return rec, nil
}

func (m *mockSupportOrderRepository) ListAllSupportEscalations(ctx context.Context, query domain.ListAllSupportEscalationsQuery) (domain.ListAllSupportEscalationsResponse, error) {
	tickets := []domain.SupportEscalationRecord{}
	for _, esc := range m.escalations {
		tickets = append(tickets, esc)
	}
	return domain.ListAllSupportEscalationsResponse{
		Tickets: tickets,
		Total:   len(tickets),
	}, nil
}

func (m *mockSupportOrderRepository) ListSupportEscalations(ctx context.Context, orderID string) ([]domain.SupportEscalationRecord, error) {
	return nil, nil
}

func (m *mockSupportOrderRepository) UpdateSupportEscalation(ctx context.Context, id string, status string) (domain.SupportEscalationRecord, error) {
	esc, ok := m.escalations[id]
	if !ok {
		return domain.SupportEscalationRecord{}, errors.New("escalation not found")
	}
	esc.Status = status
	m.escalations[id] = esc
	return esc, nil
}

func (m *mockSupportOrderRepository) ListOrders(ctx context.Context, query domain.ListOrdersQuery) (domain.ListOrdersResponse, error) {
	return domain.ListOrdersResponse{}, nil
}

func (m *mockSupportOrderRepository) CreateOrder(ctx context.Context, storeID string, req domain.CreateOrderRequest) (domain.OrderRecord, []domain.OrderItemRecord, error) {
	return domain.OrderRecord{}, nil, nil
}

func (m *mockSupportOrderRepository) UpdateOrderStatus(ctx context.Context, orderID string, actor string, status string, note *string) (domain.OrderRecord, error) {
	return domain.OrderRecord{}, nil
}

func (m *mockSupportOrderRepository) UpdateOrderRefund(ctx context.Context, orderID string, refundRefID string, status string) (domain.OrderRecord, error) {
	return domain.OrderRecord{}, nil
}

func (m *mockSupportOrderRepository) UpdateOrderSettlement(ctx context.Context, orderID string, settlementRefID string, settlementStatus string) (domain.OrderRecord, error) {
	return domain.OrderRecord{}, nil
}

func (m *mockSupportOrderRepository) ListOrderStatusEvents(ctx context.Context, orderID string) ([]domain.OrderStatusEventRecord, error) {
	return nil, nil
}

func TestAuthRbacMatrix_SupportEscalations(t *testing.T) {
	repo := &mockSupportOrderRepository{
		orders: map[string]domain.OrderRecord{
			"order-1001": {
				ID:       "order-1001",
				ClientID: "client-dev-001",
				StoreID:  "store-1001",
			},
		},
		escalations: make(map[string]domain.SupportEscalationRecord),
	}
	h := NewSupportHandler(repo)

	// Test Case 1: Client role can create escalation for their own order
	t.Run("ClientAllowedToCreateOwnEscalation", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "client-jwt", subject: "client-dev-001", roles: []string{"client"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("DSH_AUTH_MODE", "production")
		t.Setenv("DSH_AUTH_SERVICE_URL", authServer.URL)

		body := `{"order_id":"order-1001","actor":"client","issue_type":"delayed_delivery","description":"Delayed delivery test"}`
		req := httptest.NewRequest(http.MethodPost, "/support/escalations", strings.NewReader(body))
		req.Header.Set("Authorization", "Bearer client-jwt")
		req.Header.Set("Content-Type", "application/json")
		resp := httptest.NewRecorder()

		h.ServeHTTP(resp, req)
		if resp.Code != http.StatusCreated {
			t.Fatalf("expected 201 Created, got %d. Body: %s", resp.Code, resp.Body.String())
		}
	})

	// Test Case 2: Client role is forbidden from listing escalations (403 Forbidden)
	t.Run("ClientForbiddenFromListingEscalations", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "client-jwt", subject: "client-dev-001", roles: []string{"client"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("DSH_AUTH_MODE", "production")
		t.Setenv("DSH_AUTH_SERVICE_URL", authServer.URL)

		req := httptest.NewRequest(http.MethodGet, "/support/escalations", nil)
		req.Header.Set("Authorization", "Bearer client-jwt")
		resp := httptest.NewRecorder()

		h.ServeHTTP(resp, req)
		if resp.Code != http.StatusForbidden {
			t.Fatalf("expected 403 Forbidden, got %d", resp.Code)
		}
	})

	// Test Case 3: Operator role is allowed to list escalations (200 OK)
	t.Run("OperatorAllowedToListEscalations", func(t *testing.T) {
		authMock := &mockAuthService{validToken: "operator-jwt", subject: "operator-dev-001", roles: []string{"operator"}}
		authServer := httptest.NewServer(authMock)
		defer authServer.Close()

		t.Setenv("DSH_AUTH_MODE", "production")
		t.Setenv("DSH_AUTH_SERVICE_URL", authServer.URL)

		req := httptest.NewRequest(http.MethodGet, "/support/escalations", nil)
		req.Header.Set("Authorization", "Bearer operator-jwt")
		resp := httptest.NewRecorder()

		h.ServeHTTP(resp, req)
		if resp.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d. Body: %s", resp.Code, resp.Body.String())
		}
	})
}
