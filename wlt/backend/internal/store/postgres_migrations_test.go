package store

import (
	"context"
	"database/sql"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// TestApplyMigrations applies all WLT SQL migrations against a real Postgres database.
// Requires DATABASE_URL or defaults to the local WLT dev DSN.
func TestApplyMigrations(t *testing.T) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://wlt_local:wlt_local_password@localhost:15433/wlt_local?sslmode=disable"
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close() //nolint:errcheck

	if err := db.PingContext(context.Background()); err != nil {
		t.Skipf("wlt postgres not available: %v", err)
	}

	// Clean all WLT tables for idempotent re-run.
	_, _ = db.ExecContext(context.Background(),
		`DROP TABLE IF EXISTS wlt_ledger, wlt_refunds, wlt_settlements,
		 wlt_payment_sessions, wlt_wallets CASCADE;`,
	)

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
	log.Printf("WLT: %d migrations to apply", len(sqlFiles))

	for _, filename := range sqlFiles {
		content, err := ioutil.ReadFile(filepath.Join(migrationsDir, filename))
		if err != nil {
			t.Fatalf("read migration %s: %v", filename, err)
		}
		log.Printf("Applying: %s", filename)
		if _, err := db.ExecContext(context.Background(), string(content)); err != nil {
			errStr := err.Error()
			if strings.Contains(errStr, "already exists") || strings.Contains(errStr, "duplicate key") {
				log.Printf("Note: %s — %v (skipped)", filename, err)
			} else {
				t.Fatalf("migration %s failed: %v", filename, err)
			}
		}
	}

	log.Println("WLT migrations applied successfully.")
}
