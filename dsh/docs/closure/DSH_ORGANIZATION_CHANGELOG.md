# DSH Organization Changelog — Loop 5

Status: DONE_LOCAL / NEEDS_NEXT_LOOP
Loop: 5 — Organize After Coverage
Date: 2026-05-15

---

## Archive moves (16 files → `dsh/docs/archive/`)

All moves are non-destructive. Files remain accessible in `dsh/docs/archive/`.
DO_NOT_TOUCH files were not moved.

| File | From | Reason |
| --- | --- | --- |
| `DSH_PHASE_3R_MANUAL_DESIGN_WORK_ORDER.md` | `dsh/docs/` | Pre-Loop-3 design work order; superseded by closure docs |
| `DSH_PHASE_3R_OPERATING_LOGIC_MODEL.md` | `dsh/docs/` | Pre-Loop-3 operating logic model; superseded by screen inventory |
| `DSH_PHASE_3R_PREVIEW_SCENARIOS.md` | `dsh/docs/` | Pre-Loop-3 preview scenarios; superseded by route/state/CTA matrix |
| `DSH_PHASE_3R_SCREEN_GAP_INVENTORY.md` | `dsh/docs/` | Pre-Loop-3 gap inventory; superseded by DSH_MISSING_LOGIC_AND_UI_GAPS.csv |
| `DSH_FORENSIC_INVENTORY.md` | `dsh/docs/` | Pre-Loop-3 forensic inventory; superseded by DSH_SCREEN_INVENTORY.csv |
| `DSH_MOBILE_APPS_FINAL_CLOSURE.md` | `dsh/docs/` | Mobile closure gate report; evidence absorbed into Loop 4 evidence |
| `DSH_MOBILE_APPS_FINAL_CLOSURE_RUNBOOK.md` | `dsh/docs/` | Mobile closure runbook; process complete |
| `DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md` | `dsh/docs/` | Scope standardization narrative; key facts embedded in SERVICE_BLUEPRINT.md |
| `DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md` | `dsh/docs/` | Runbook for completed standardization work |
| `DSH_PARTNER_APP_SCOPE_STANDARDIZATION.md` | `dsh/docs/` | Scope standardization narrative; key facts embedded in SERVICE_BLUEPRINT.md |
| `DSH_PARTNER_APP_SCOPE_STANDARDIZATION_RUNBOOK.md` | `dsh/docs/` | Runbook for completed standardization work |
| `GATE_REPORT_DSH_FRONTEND_CLOSURE_FINAL_20260510.md` | `dsh/docs/` | Gate report from 2026-05-10; superseded by current Loop 4 evidence |
| `dsh-captain-final-classification.csv` | `dsh/docs/` | Final classification CSV; superseded by DSH_SCREEN_INVENTORY.csv |
| `dsh-client-final-classification.csv` | `dsh/docs/` | Final classification CSV; superseded by DSH_SCREEN_INVENTORY.csv |
| `dsh-field-final-classification.csv` | `dsh/docs/` | Final classification CSV; superseded by DSH_SCREEN_INVENTORY.csv |
| `dsh-partner-final-classification.csv` | `dsh/docs/` | Final classification CSV; superseded by DSH_SCREEN_INVENTORY.csv |

---

## SERVICE_BLUEPRINT.md — shortened to index

| Metric | Before | After |
| --- | --- | --- |
| Lines | 538 | ~115 |
| Embedded scope-standardization sections | 2 | 0 (archived; key rules preserved inline) |
| Closure docs index | absent | Section 4 added (14 entries) |
| Inline narrative sections | 15 | 6 |

Removed: embedded `DSH_CLIENT_APP_SCOPE_STANDARDIZATION` and `DSH_PARTNER_APP_SCOPE_STANDARDIZATION` comment-fenced sections.
Kept: service truth table, surface status, map/heatmap boundary, ownership rules, lifecycle, closure docs index, binding/runtime/backend state, update protocol.

---

## DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.csv — TBD resolutions

| Row | Old classification | New classification | Evidence |
| --- | --- | --- | --- |
| NOISE-018 (`fixture-locations.ts`) | TBD (needs_human_review) | FIXTURE_PREVIEW_DATA | Grep confirmed DshCaptainMapScreen does NOT import fixture-locations.ts |
| NOISE-027 (`loyaltyCommerceData.ts`) | TBD | FIXTURE_PREVIEW_DATA | Content verified: pure UI view model, no WLT money logic |
| NOISE-039 (`dshFinancePreviewModel.ts`) | TBD | FIXTURE_PREVIEW_DATA | Content verified: amountHalalas is optional/non-accounting; no WLT semantics |
| GAP-001 (`DshCaptainMapScreen.tsx`) | TBD | RESOLVED | Registered in Loop 4 (ML-025) |
| GAP-002 (`resolve-dev-media-url.ts`) | TBD | NOT_DEAD_KEEP | Grep confirmed import by `get-dsh-category-icon-url.ts` |

---

## TypeScript preview data files — decision (NOISE-001..NOISE-038)

**Decision**: CSV classification updated to FIXTURE_PREVIEW_DATA only. Files NOT moved.

**Reason**: All 38 NOISE files are actively imported by screen components via relative paths. Moving them to `preview-fixtures/` subdirectories would require updating all relative imports across the entire DSH frontend — a broad refactor forbidden by Loop 5 rules. The classification in the CSV is the authoritative record. Physical relocation is deferred to a dedicated import-graph-safe cleanup loop.

---

## DO_NOT_TOUCH files — confirmed untouched

| File | Status |
| --- | --- |
| `dsh/docs/MIGRATION.md` | NOT TOUCHED |
| `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` | NOT TOUCHED |
| `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | NOT TOUCHED |
| `dsh/docs/SCREEN_API_MATRIX.md` | NOT TOUCHED |
| `dsh/docs/CLOSURE_DECISION_LOG.md` | NOT TOUCHED |
| `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | NOT TOUCHED |
| `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` | NOT TOUCHED |
| `wlt/frontend/**` | NOT TOUCHED |

```text
DONE_LOCAL / NEEDS_NEXT_LOOP
```
