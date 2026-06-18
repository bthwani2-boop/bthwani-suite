package store_test

// WLT_REFERENCE_ONLY_MEDIA_GUARD
// Verifies that the WLT service does not own or copy DSH media assets.
// WLT boundary: stores media_id references only when there is a financial impact.
// Binary files and metadata live in DSH (dsh_media_assets table + MinIO).
// WLT never reads DSH Postgres directly.

import (
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// wltSourceRoot points to the wlt/backend Go source tree relative to this test file.
// Adjusted to walk from wlt/backend root.
func wltSourceRoot(t *testing.T) string {
	t.Helper()
	// This file lives at wlt/backend/internal/store/
	// Walk up 3 levels to reach wlt/backend/
	dir, err := filepath.Abs("../../../")
	if err != nil {
		t.Fatalf("wlt source root: %v", err)
	}
	return dir
}

func TestWLT_ReferenceOnly_NoMediaAssetTable(t *testing.T) {
	root := wltSourceRoot(t)
	forbidden := []string{
		"dsh_media_assets",
		"real-media-runtime",
		"media_fixtures",
	}

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		if !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return nil // only check production code, not test files
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		text := string(content)
		for _, pattern := range forbidden {
			if strings.Contains(text, pattern) {
				t.Errorf("WLT_REFERENCE_ONLY_MEDIA_GUARD VIOLATION: %s contains %q (DSH media table/fixture reference not allowed in WLT)", path, pattern)
			}
		}
		return nil
	})
	if err != nil {
		t.Fatalf("walk error: %v", err)
	}
}

func TestWLT_ReferenceOnly_NoDSHPostgresURL(t *testing.T) {
	root := wltSourceRoot(t)

	// Ensure no hardcoded DSH postgres connection string in non-test WLT source.
	// WLT_AUTH_SERVICE_URL and WLT_DSH_BASE_URL are allowed (HTTP only).
	// These string fragments are searched in production code only; test files are excluded.
	dshPostgresUser := "dsh" + "_local_password"           // split to avoid self-match
	dshPostgresHost := "dsh" + "-postgres:" + "5432"       // split to avoid self-match
	dshPostgresPort := "1" + "5432"                         // split to avoid self-match

	forbidden := []string{dshPostgresUser, dshPostgresHost, dshPostgresPort}

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		if !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return nil // only check production code, not test files
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		text := string(content)
		for _, pattern := range forbidden {
			if strings.Contains(text, pattern) {
				t.Errorf("WLT_REFERENCE_ONLY_MEDIA_GUARD VIOLATION: %s contains %q (direct DSH Postgres access not allowed in WLT)", path, pattern)
			}
		}
		return nil
	})
	if err != nil {
		t.Fatalf("walk error: %v", err)
	}
}

func TestWLT_ReferenceOnly_NoIndependentPublicURL(t *testing.T) {
	root := wltSourceRoot(t)
	fset := token.NewFileSet()

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return err
		}
		if !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
			return nil
		}

		f, err := parser.ParseFile(fset, path, nil, parser.AllErrors)
		if err != nil {
			return nil // skip unparseable files
		}

		ast.Inspect(f, func(n ast.Node) bool {
			// Look for struct fields named PublicURL that aren't references
			if field, ok := n.(*ast.Field); ok {
				for _, name := range field.Names {
					if name.Name == "PublicURL" || name.Name == "ImageURL" || name.Name == "LogoImageURL" {
						pos := fset.Position(name.Pos())
						t.Logf("WLT_REFERENCE_ONLY_MEDIA_GUARD INFO: %s:%d has field %q — verify it is a DSH reference, not a WLT-owned media URL", pos.Filename, pos.Line, name.Name)
					}
				}
			}
			return true
		})
		return nil
	})
	if err != nil {
		t.Fatalf("walk error: %v", err)
	}
}
