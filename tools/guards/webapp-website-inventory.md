# BThwani UI Identity Drift Inventory — Phase 8 (Webapp & Website Readiness)

**Generated At:** 2026-06-09T16:28:58.454Z
**Total Webapp/Website Violations Documented:** 8

## Summary of Violations
| Guard | Severity | Count |
|---|---|---|
| ALL | FAIL | 0 |
| ALL | WARN | 2 |
| ALL | INFO | 6 |

## Detailed Drift Catalog (webapp & website)
| File | Guard | Severity | Rule/Message | Evidence | Suggested Action |
|---|---|---|---|---|---|
| `webapp/shell/shims/expo-vector-icons.tsx` | GUARD_UI_KIT_CENTRAL_DESIGN_OWNERSHIP | **WARN** | Potential direct typography property usage outside ui-kit. Prefer central ui-kit Text roles. | `line 37: lineHeight = 1` | Centralize reusable visual assets and/or use approved @bthwani/ui-kit exports. |
| `website/shell/shims/expo-vector-icons.tsx` | GUARD_UI_KIT_CENTRAL_DESIGN_OWNERSHIP | **WARN** | Potential direct typography property usage outside ui-kit. Prefer central ui-kit Text roles. | `line 37: lineHeight = 1` | Centralize reusable visual assets and/or use approved @bthwani/ui-kit exports. |
| `webapp/runtime/app/page.tsx` | GUARD_UIUX_RATCHET_V3 | **INFO** | weak_state_coverage_signal | `Screen/workspace may miss state coverage: loading, empty, error, success, offline, disabled.` | Do not claim UI flow closure until states are mapped or intentionally N/A. |
| `webapp/runtime/app/settings/page.tsx` | GUARD_UIUX_RATCHET_V3 | **INFO** | weak_state_coverage_signal | `Screen/workspace may miss state coverage: loading, empty, error, success, offline, disabled.` | Do not claim UI flow closure until states are mapped or intentionally N/A. |
| `webapp/shell/WebAppAppearanceSettingsScreen.tsx` | GUARD_UIUX_RATCHET_V3 | **INFO** | weak_state_coverage_signal | `Screen/workspace may miss state coverage: loading, empty, error, success, offline, disabled.` | Do not claim UI flow closure until states are mapped or intentionally N/A. |
| `website/runtime/app/page.tsx` | GUARD_UIUX_RATCHET_V3 | **INFO** | weak_state_coverage_signal | `Screen/workspace may miss state coverage: loading, empty, error, success, offline, disabled.` | Do not claim UI flow closure until states are mapped or intentionally N/A. |
| `website/runtime/app/settings/page.tsx` | GUARD_UIUX_RATCHET_V3 | **INFO** | weak_state_coverage_signal | `Screen/workspace may miss state coverage: loading, empty, error, success, offline, disabled.` | Do not claim UI flow closure until states are mapped or intentionally N/A. |
| `website/shell/WebsiteAppearanceSettingsScreen.tsx` | GUARD_UIUX_RATCHET_V3 | **INFO** | weak_state_coverage_signal | `Screen/workspace may miss state coverage: loading, empty, error, success, offline, disabled.` | Do not claim UI flow closure until states are mapped or intentionally N/A. |
