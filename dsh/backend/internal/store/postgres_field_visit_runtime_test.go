package store

import (
	"context"
	"database/sql"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"bthwani.local/dsh/domain"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func TestCreateFieldVisitPostgresRuntimeEvidence(t *testing.T) {
	if os.Getenv("DSH_POSTGRES_RUNTIME_EVIDENCE") != "1" {
		t.Skip("set DSH_POSTGRES_RUNTIME_EVIDENCE=1 to run local postgres runtime evidence")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"
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

	for _, filename := range []string{"001_store_discovery.sql", "020_field_store_visits.sql"} {
		content, err := ioutil.ReadFile(filepath.Join("../../migrations", filename))
		if err != nil {
			t.Fatalf("failed to read migration %s: %v", filename, err)
		}
		if _, err := db.ExecContext(ctx, string(content)); err != nil {
			t.Fatalf("failed to apply migration %s: %v", filename, err)
		}
	}

	if _, err := db.ExecContext(ctx, `
INSERT INTO dsh_store_discovery_stores (
	id, name, address, distance_label, delivery_label, service_label, status_label, status_tone, publish_stage
) VALUES (
	'store-1001', 'Runtime Field Visit Store', 'Runtime Address', '1.2 km', '15 min', 'Standard', 'Open', 'open', 'approved'
) ON CONFLICT (id) DO NOTHING;`); err != nil {
		t.Fatalf("failed to seed store-1001: %v", err)
	}

	repository, err := NewPostgresRepository(ctx, dbURL)
	if err != nil {
		t.Fatalf("failed to create postgres repository: %v", err)
	}
	defer repository.Close()

	response, err := repository.CreateFieldVisit(ctx, "store-1001", domain.CreateFieldVisitRequest{
		FieldAgentID:       "field-local",
		VisitSummary:       "Store front and owner availability confirmed",
		FollowUpAction:     "Confirm owner approval and continue document proof",
		EvidenceMediaKeys:  []string{"field.visit.front-signage.v1", "field.visit.owner-availability.v1"},
		LocationConfidence: "manual_confirmed",
	})
	if err != nil {
		t.Fatalf("failed to create field visit: %v", err)
	}

	if response.StoreID != "store-1001" {
		t.Fatalf("expected store-1001, got %s", response.StoreID)
	}
	if response.Status != "submitted" {
		t.Fatalf("expected submitted status, got %s", response.Status)
	}
	if len(response.EvidenceMediaKeys) != 2 {
		t.Fatalf("expected 2 evidence keys, got %d", len(response.EvidenceMediaKeys))
	}
}
