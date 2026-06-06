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
| Current Status | `IMPLEMENTED_RUNTIME_PROVEN__FINAL_VISUAL_AND_TS_BLOCKED` |
| Blocking Reason | The local ADB app is not running the updated field build, and sandboxed Node/Nx/TypeScript reads are blocked by Windows `EPERM` on `node_modules`. |

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
| CM-006B-01 | app-field | `DshFieldStoreVisitScreen.tsx` | `IMPLEMENTED__DEVICE_REBUILD_REQUIRED_FOR_VISUAL_PROOF` |
| CM-006B-02 | app-field | `DshFieldSurface.tsx` | `API_CLIENT_BOUND` |
| CM-006B-03 | shared frontend | `dsh-field-visit-client.ts` | `IMPLEMENTED` |
| CM-006B-04 | backend | `POST /stores/{id}/field-visits` | `RUNTIME_PROVEN_201` |
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
| `git diff --check` | PASS | no output |
| Go HTTP handler test | PASS | `go test ./internal/http` |
| Postgres repository runtime test | PASS | `DSH_POSTGRES_RUNTIME_EVIDENCE=1 go test ./internal/store -run TestCreateFieldVisitPostgresRuntimeEvidence -count=1 -v` |
| HTTP runtime proof | PASS | `tools/registry/runs/DSH_SLICE_006B_FIELD_VISIT_EVIDENCE_FINAL_CLOSURE-20260606-LOCAL/post-field-visit-runtime.txt` returned `STATUS=201` |
| TypeScript/Nx | BLOCKED_BY_ENV | `pnpm exec tsc --noEmit` and `pnpm nx show project app-field` failed with Windows `EPERM` reading `node_modules` binaries |
| ADB visual proof | BLOCKED_BY_INSTALLED_BUILD | device is connected, but installed `com.bthwani.field.dev` remains on pre-existing onboarding state and does not display the updated 006B screen |

Evidence root:

- `tools/registry/runs/DSH_SLICE_006B_FIELD_VISIT_EVIDENCE_FINAL_CLOSURE-20260606-LOCAL/`

## Decision
| Field | Value |
|---|---|
| Slice Decision | `IMPLEMENTED_RUNTIME_PROVEN__NOT_FINAL_CLOSED` |
| Reason | Backend, OpenAPI, typed client, field binding, Postgres persistence, and local HTTP 201 proof are implemented. Final closure is not claimed because visual proof from the updated app build and TypeScript verification are blocked by the local environment. |
| Next Action | Rebuild/install `app-field` with current code, rerun TypeScript outside the EPERM sandbox or after fixing node_modules ACLs, then capture `DshFieldStoreVisitScreen` and evidence-detail screenshots. |
