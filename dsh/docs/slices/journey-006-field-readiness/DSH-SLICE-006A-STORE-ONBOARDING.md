# DSH-SLICE-006A - Store Onboarding

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006A` |
| Parent Journey | J-006 - Field Readiness |
| Business Outcome | A field agent can create and submit a new store onboarding file into DSH review without financial mutation |
| Primary Actor | Field Agent |
| Primary Surface | `app-field` / `DshFieldStoresScreen.tsx` + `DshFieldStoreOnboardingScreen.tsx` |
| Backend Surface | `POST /stores` |
| WLT Boundary | No wallet, ledger, refund, payout, settlement, fee, commission, or money mutation. WLT remains the only owner of financial logic. |
| Current Status | PASS |
| Blocking Reason | none for 006A; field visit, media/documents, readiness approval, and visibility promotion remain downstream slices |

## Scope
### Included
- Field store intake list and onboarding form.
- Typed app-field API binding for `POST /stores`.
- OpenAPI contract for `createFieldStore`.
- Backend handler validation for store creation request shape.
- Initial backend lifecycle state: `publish_stage = pending_review`.
- Offline-resilient UI flow: local field workflow remains usable when API transport is unavailable.

### Excluded
| Surface | Reason |
|---|---|
| Field visit evidence | Covered in 006B |
| Documents and media | Covered in 006C |
| Readiness decision and escalation completion | Covered in later J-006 readiness slices |
| Client visibility gates | Covered in J-001 |
| Any money movement | WLT-owned only |

## Coverage Matrix
| Row ID | Surface | Screen / Module | Status |
|---|---|---|---|
| CM-006A-01 | app-field | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | PASS |
| CM-006A-02 | app-field binding | `DshFieldSurface.tsx` -> `createDshFieldStoreOnboardingHttpClient` | PASS |
| CM-006A-03 | shared API client | `dsh/frontend/shared/dsh-field-store-onboarding-client.ts` | PASS |
| CM-006A-04 | backend | `POST /stores` -> `CreateFieldStore` | PASS |
| CM-006A-05 | OpenAPI | `/stores.post` + `CreateFieldStoreRequest/Response` | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit store onboarding | app-field | `DshFieldStoreOnboardingScreen` via `DshFieldSurface` | `POST /stores` | PASS |
| Continue field workflow | app-field | `DshFieldStoreOnboardingScreen` | local route to visit | PASS for navigation handoff only; visit closure remains 006B |
| Escalate blocker | app-field | `DshFieldStoreOnboardingScreen` | readiness escalation route | OUT_OF_SCOPE for 006A final approval |

## State Matrix
| State | Required | Status |
|---|---|---|
| form entry | yes | PASS |
| local draft/offline workflow | yes | PASS |
| submitted | yes | PASS |
| `pending_review` backend state | yes | PASS |
| validation error | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006B | downstream | field visit starts after onboarding handoff |
| DSH-SLICE-006C | downstream | documents/media remain separate readiness proof |
| Control-panel approvals | downstream | review and promotion remain outside 006A |
| J-001 | downstream | client visibility gates only apply after review/promotion |
| WLT | boundary | no DSH financial ownership introduced |

## Evidence and Gates

- Code diff: typed client added, direct screen `fetch` removed, OpenAPI POST contract added, targeted backend tests added.
- Runtime API proof: `tools/registry/runs/DSH_SLICE_006A_STORE_ONBOARDING_FINAL_CLOSURE-20260606-LOCAL/post-stores-runtime.txt` returned `STATUS=201` and `publish_stage":"pending_review"` from `POST http://127.0.0.1:18080/stores`.
- Device visual proof: `tools/registry/runs/DSH_SLICE_006A_STORE_ONBOARDING_FINAL_CLOSURE-20260606-LOCAL/j006a_app_field_launch.png`.
- Device visual proof: `tools/registry/runs/DSH_SLICE_006A_STORE_ONBOARDING_FINAL_CLOSURE-20260606-LOCAL/j006a_app_field_onboarding.png`.
- Backend verification: `go test ./internal/http` passed.
- Frontend/type verification: `pnpm exec tsc --noEmit` passed.
- Diff hygiene: `git --no-pager diff --check` passed.

## Decision
| Field | Value |
|---|---|
| Slice Decision | PASS |
| Reason | 006A is bound from app-field UI to typed shared client, OpenAPI, Go handler, and live local runtime proof for `POST /stores` creating a `pending_review` store. |
| Residual Scope | 006B/006C/later readiness approval and control-panel promotion remain separate slices. |
| Next Action | Proceed to DSH-SLICE-006B - Field Visit Evidence. |
