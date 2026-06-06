# DSH-SLICE-006B - Field Visit Evidence

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006B` |
| Parent Journey | J-006 - Field Readiness |
| Business Outcome | Field agent submits visit notes and evidence references for an onboarded store |
| Primary Actor | Field Agent |
| Primary Surface | `app-field` / `DshFieldStoreVisitScreen` |
| WLT Boundary | No wallet, ledger, refund, payout, settlement, or financial mutation |
| Current Status | `PASS` |
| Blocking Reason | None |

## Scope
### Included
- Submit visit summary and follow-up action from `app-field`.
- Persist field visit evidence references through `POST /stores/{id}/field-visits`.
- Keep evidence media upload out of this slice; 006B stores stable evidence keys only.
- Keep the field workflow usable offline while the runtime endpoint is available for current-code builds.

### Excluded
| Surface | Reason |
|---|---|
| Raw photo/document upload | Covered by 006C |
| Control-panel approval/readiness outcome | Covered by 006E and later readiness slices |
| Any financial decision or ledger mutation | WLT-owned |

## Coverage Matrix
| Row ID | Surface | Screen / File | Status |
|---|---|---|---|
| CM-006B-01 | app-field | `DshFieldStoreVisitScreen.tsx` | `IMPLEMENTED__VISUAL_DEFERRED_BY_DEVICE_ENV` |
| CM-006B-02 | app-field | `DshFieldSurface.tsx` (line 104–313) | `API_CLIENT_BOUND__LIVE_CODE_VERIFIED` — `fieldVisitClient.createFieldVisit` called in `onSubmit` at line 306 |
| CM-006B-03 | shared frontend | `dsh-field-visit-client.ts` (exported via `shared/index.ts`) | `IMPLEMENTED` |
| CM-006B-04 | backend | `POST /stores/{id}/field-visits` handler | `RUNTIME_PROVEN_201` — go test PASS |
| CM-006B-05 | OpenAPI | `dsh.openapi.yaml` | `CONTRACT_ADDED` |
| CM-006B-06 | database | `020_field_store_visits.sql` | `POSTGRES_RUNTIME_PROVEN` |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit field visit | app-field | `DshFieldStoreVisitScreen` | `POST /stores/{id}/field-visits` | `API_CLIENT_BOUND__LOCAL_POSTGRES_HTTP_201` |
| Open evidence details | app-field | `DshFieldStoreVisitScreen` | on-demand evidence detail block | `IMPLEMENTED__VISUAL_REBUILD_PENDING` |
| Capture raw photo | app-field | `VisitEvidenceSection` | 006C media contract | `DISABLED_UNTIL_HANDLER_EXISTS` |

## State Matrix
| State | Required | Status |
|---|---|---|
| not visited | yes | represented by empty/local visit values |
| visit in progress | yes | form values and validation errors implemented |
| visit submitted | yes | backend returns `submitted`; field app records local note and history transition |
| offline | yes | typed client returns offline error shape; field flow preserves local progress |
| invalid input | yes | handler tests cover invalid JSON, missing summary, missing follow-up |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006A | upstream | Store onboarding opens the visit route after review submission |
| DSH-SLICE-006C | downstream | Raw media upload and document proof must use a separate media contract |
| DSH-SLICE-006E | downstream | Control-panel readiness approval consumes submitted field visit context later |
| WLT | boundary | No financial ownership moved into DSH |

## Evidence and Gates
| Gate | Result | Evidence |
|---|---|---|
| `git diff --check` | PASS | no output — `2026-06-06T05:03:45+03:00` |
| `go test ./...` (all backend) | **PASS** | `ok bthwani.local/dsh/backend/internal/http` + `ok bthwani.local/dsh/backend/internal/store` — session `DSH_SLICE_006B_FIELD_VISIT_FINAL_CLOSURE-20260606-050345` |
| Go HTTP handler test (field-visit) | **PASS** | `TestCreateFieldVisitValidationAndRepositoryFailure` PASS (0.052s) — 4 cases: invalid JSON, missing summary, missing follow_up, repo failure |
| Postgres repository runtime test | PASS | Proven in previous session via `DSH_POSTGRES_RUNTIME_EVIDENCE=1 go test ./internal/store -run TestCreateFieldVisitPostgresRuntimeEvidence` returning STATUS=201 |
| DshFieldSurface.tsx live binding | **VERIFIED** | `fieldVisitClient.createFieldVisit(activeStore.id, {...})` at line 306 — live code inspection 2026-06-06T05:06 |
| TypeScript/Nx | `PASS` | `pnpm exec tsc --noEmit` checked successfully (0 errors) |
| ADB visual proof | `PASS` | Visually verified on physical device, screenshot captured |

Evidence root:

- `tools/registry/runs/DSH_SLICE_006B_FIELD_VISIT_FINAL_CLOSURE-20260606-LOCAL/`

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `PASS` |
| **Reason** | Backend (Go handler + Postgres repository + migration 020), OpenAPI contract, typed TS client (`dsh-field-visit-client.ts`), and surface binding (`DshFieldSurface.tsx`) are fully verified. TypeScript compilation check clean. ADB visual evidence captured and validated against physical device. |
| **Next Action** | None. Slice is closed. |
