package store

import (
	"context"
	"database/sql"
	"os"
	"path/filepath"
	"testing"

	"bthwani.local/dsh/domain"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func TestFieldReadinessPostgresRuntimeEvidence(t *testing.T) {
	if os.Getenv("DSH_POSTGRES_RUNTIME_EVIDENCE") != "1" {
		t.Skip("set DSH_POSTGRES_RUNTIME_EVIDENCE=1 to run local postgres runtime evidence")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://dsh_local:dsh_local_password@localhost:15432/dsh_local?sslmode=disable"
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()
	if err := db.PingContext(ctx); err != nil {
		t.Fatalf("failed to ping database: %v", err)
	}

	// Apply migrations
	for _, filename := range []string{
		"001_store_discovery.sql",
		"021_field_store_documents.sql",
		"022_field_readiness_escalation.sql",
		"023_field_readiness_approval.sql",
	} {
		content, err := os.ReadFile(filepath.Join("../../migrations", filename))
		if err != nil {
			t.Fatalf("failed to read migration %s: %v", filename, err)
		}
		if _, err := db.ExecContext(ctx, string(content)); err != nil {
			t.Fatalf("failed to apply migration %s: %v", filename, err)
		}
	}

	// Seed store-1001
	if _, err := db.ExecContext(ctx, `
INSERT INTO dsh_store_discovery_stores (
	id, name, address, distance_label, delivery_label, service_label, status_label, status_tone, publish_stage, partner_readiness_status
) VALUES (
	'store-1001', 'Runtime Field Visit Store', 'Runtime Address', '1.2 km', '15 min', 'Standard', 'Open', 'open', 'approved', 'not_ready'
) ON CONFLICT (id) DO NOTHING;`); err != nil {
		t.Fatalf("failed to seed store-1001: %v", err)
	}

	repository, err := NewPostgresRepository(ctx, dbURL)
	if err != nil {
		t.Fatalf("failed to create postgres repository: %v", err)
	}
	defer repository.Close()

	// Clean up previous runs
	if _, err := db.ExecContext(ctx, `DELETE FROM dsh_field_readiness_escalations WHERE store_id = 'store-1001'`); err != nil {
		t.Fatalf("failed to clean up escalations: %v", err)
	}
	if _, err := db.ExecContext(ctx, `DELETE FROM dsh_field_readiness_approvals WHERE store_id = 'store-1001'`); err != nil {
		t.Fatalf("failed to clean up approvals: %v", err)
	}

	// ─── Test J-006D: Escalation ───
	esc, err := repository.CreateFieldReadinessEscalation(ctx, "store-1001", domain.CreateFieldReadinessEscalationRequest{
		FieldAgentID: "agent-1",
		Reason:       "Missing commercial registration document",
		TargetTeam:   "partner-management",
	})
	if err != nil {
		t.Fatalf("failed to create readiness escalation: %v", err)
	}

	if esc.StoreID != "store-1001" {
		t.Fatalf("expected store-1001, got %s", esc.StoreID)
	}
	if esc.Status != "escalated" {
		t.Fatalf("expected status 'escalated', got %s", esc.Status)
	}

	// List escalations
	listRes, err := repository.ListFieldReadinessEscalations(ctx, domain.ListFieldReadinessEscalationsQuery{
		Status: "escalated",
	})
	if err != nil {
		t.Fatalf("failed to list readiness escalations: %v", err)
	}
	if len(listRes.Escalations) < 1 {
		t.Fatalf("expected at least 1 escalation, got %d", len(listRes.Escalations))
	}

	// Update escalation
	updatedEsc, err := repository.UpdateFieldReadinessEscalation(ctx, esc.ID, domain.UpdateFieldReadinessEscalationRequest{
		Status:       "resolved",
		OperatorNote: "Document uploaded, verified and resolved",
	})
	if err != nil {
		t.Fatalf("failed to update escalation: %v", err)
	}
	if updatedEsc.Status != "resolved" {
		t.Fatalf("expected status 'resolved', got %s", updatedEsc.Status)
	}

	// ─── Test J-006E: Approval ───
	approval, err := repository.CreateFieldReadinessApproval(ctx, "store-1001", domain.CreateFieldReadinessApprovalRequest{
		OperatorID: "op-1",
		Decision:   "approved",
		Reason:     "All field requirements and compliance checks met",
	})
	if err != nil {
		t.Fatalf("failed to create readiness approval: %v", err)
	}
	if approval.Decision != "approved" {
		t.Fatalf("expected decision 'approved', got %s", approval.Decision)
	}

	// Check that store partner_readiness_status is updated to 'ready'
	var readinessStatus string
	err = db.QueryRowContext(ctx, "SELECT partner_readiness_status FROM dsh_store_discovery_stores WHERE id = 'store-1001'").Scan(&readinessStatus)
	if err != nil {
		t.Fatalf("failed to scan readiness status: %v", err)
	}
	if readinessStatus != "ready" {
		t.Fatalf("expected store readiness status to be promoted to 'ready', got '%s'", readinessStatus)
	}

	// Get latest approval
	latest, err := repository.GetLatestFieldReadinessApproval(ctx, "store-1001")
	if err != nil {
		t.Fatalf("failed to get latest field readiness approval: %v", err)
	}
	if latest.ID != approval.ID {
		t.Fatalf("expected approval ID %s, got %s", approval.ID, latest.ID)
	}
}
