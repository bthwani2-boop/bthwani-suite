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

func TestCreateFieldDocumentPostgresRuntimeEvidence(t *testing.T) {
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

	for _, filename := range []string{"001_store_discovery.sql", "021_field_store_documents.sql"} {
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

	// Clean up documents for store-1001 to ensure a clean slate
	if _, err := db.ExecContext(ctx, `DELETE FROM dsh_field_store_documents WHERE store_id = 'store-1001'`); err != nil {
		t.Fatalf("failed to clean up documents: %v", err)
	}

	doc, err := repository.CreateFieldDocument(ctx, "store-1001", domain.CreateFieldDocumentRequest{
		DocumentKind: "commercial_registration",
		MediaKey:     "field.doc.commercial_registration.v1",
	})
	if err != nil {
		t.Fatalf("failed to create field document: %v", err)
	}

	if doc.StoreID != "store-1001" {
		t.Fatalf("expected store-1001, got %s", doc.StoreID)
	}
	if doc.DocumentKind != "commercial_registration" {
		t.Fatalf("expected commercial_registration, got %s", doc.DocumentKind)
	}
	if doc.MediaKey != "field.doc.commercial_registration.v1" {
		t.Fatalf("expected media key, got %s", doc.MediaKey)
	}
	if doc.Status != "pending" {
		t.Fatalf("expected status pending, got %s", doc.Status)
	}

	// Verify ListFieldDocuments
	docs, err := repository.ListFieldDocuments(ctx, "store-1001")
	if err != nil {
		t.Fatalf("failed to list field documents: %v", err)
	}

	if len(docs) != 1 {
		t.Fatalf("expected 1 document, got %d", len(docs))
	}
	if docs[0].ID != doc.ID {
		t.Fatalf("expected document ID %s, got %s", doc.ID, docs[0].ID)
	}
}
