package httpapi

import (
	"log"
	"net/http"
	"os"
	"strings"
)

// RegisterPlatformRoutes registers GET /platform/vars for J-008.
// Returns runtime platform configuration readable by the control panel and app surfaces.
func RegisterPlatformRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /platform/vars", handleGetPlatformVars)
}

// handleGetPlatformVars returns non-secret runtime platform configuration.
// WLT BOUNDARY: no financial data is returned here.
// Returns only DSH surface configuration and feature toggles.
func handleGetPlatformVars(w http.ResponseWriter, r *http.Request) {
	log.Println("dsh-api: GET /platform/vars")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Client-Id, X-Actor-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	enableMediaFixtures := strings.ToLower(strings.TrimSpace(os.Getenv("DSH_ENABLE_MEDIA_FIXTURES"))) == "true"
	enableDevFixtureMedia := strings.ToLower(strings.TrimSpace(os.Getenv("DSH_ENABLE_DEV_FIXTURE_MEDIA"))) == "true"

	mediaPublicBaseURL := strings.TrimSpace(os.Getenv("DSH_MEDIA_PUBLIC_BASE_URL"))
	if mediaPublicBaseURL == "" {
		mediaPublicBaseURL = ""
	}

	vars := map[string]interface{}{
		"platform": map[string]interface{}{
			"service":     "dsh",
			"environment": resolveEnv(),
		},
		"media": map[string]interface{}{
			"enable_media_fixtures":    enableMediaFixtures,
			"enable_dev_fixture_media": enableDevFixtureMedia,
			"public_base_url":          mediaPublicBaseURL,
		},
		"feature_flags": map[string]interface{}{
			"awnak_enabled":       getEnvBool("DSH_FEATURE_AWNAK_ENABLED", false),
			"shein_enabled":       getEnvBool("DSH_FEATURE_SHEIN_ENABLED", false),
			"loyalty_enabled":     getEnvBool("DSH_FEATURE_LOYALTY_ENABLED", false),
			"marketing_enabled":   getEnvBool("DSH_FEATURE_MARKETING_ENABLED", true),
			"subscriptions_enabled": getEnvBool("DSH_FEATURE_SUBSCRIPTIONS_ENABLED", false),
		},
		"runtime": map[string]interface{}{
			"wlt_base_url":     strings.TrimSpace(os.Getenv("WLT_BASE_URL")),
			"auth_base_url":    strings.TrimSpace(os.Getenv("AUTH_BASE_URL")),
		},
	}

	writeJSON(w, http.StatusOK, vars)
}

func resolveEnv() string {
	e := strings.ToLower(strings.TrimSpace(os.Getenv("DSH_ENV")))
	switch e {
	case "production", "prod":
		return "production"
	case "staging":
		return "staging"
	default:
		return "development"
	}
}

func getEnvBool(key string, defaultVal bool) bool {
	v := strings.ToLower(strings.TrimSpace(os.Getenv(key)))
	if v == "true" || v == "1" {
		return true
	}
	if v == "false" || v == "0" {
		return false
	}
	return defaultVal
}
