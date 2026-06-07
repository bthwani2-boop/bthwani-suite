# DSH Service Blueprint

Single truth file for the `dsh` service.
Platform-wide policy: `governance/02_PLATFORM_SSOT.md`, `governance/10_SERVICE_CLOSURE.md`, and `governance/22_DSH_GOLDEN_SLICE.md`.
API contract: `dsh/dsh.openapi.yaml`.

---

## 1. Service Truth

| Field | Value |
|---|---|
| Service ID | `dsh` |
| Service Name | Delivery & Shopping / تسوق وتوصيل |
| Service Type | `PAID_SERVICE` |
| Owner Root | `dsh/` |
| Truth File | `dsh/SERVICE_BLUEPRINT.md` |
| OpenAPI Contract | `dsh/dsh.openapi.yaml` |
| Public Export Path | `dsh/index.ts` |
| Current Decision | `PASS` |
| Current Status | J-001 = PASS; J-002 = PASS; J-003 = PASS; J-004 = PASS; J-005 = PASS; J-006 = PASS; J-007 = PASS; J-008 = PASS; J-009 = PASS; J-010 = PASS (read-only WLT bridge verified). |
| Live Closure Truth | `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts` + `dsh/frontend/shared/dsh-flow-registry.ts` |
| Historic Runtime Baseline | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |

### Surface Status

| Surface | Status | Note |
|---|---|---|
| `app-client` | `PASS / SCREEN_RUNTIME_PROVEN` | Cart, checkout, tracking and support (J-003, J-004) are fully E2E proven |
| `app-partner` | `PASS / SCREEN_RUNTIME_PROVEN` | Partner order intake, orders inbox, rejections and visibility are verified |
| `app-captain` | `PASS / SCREEN_RUNTIME_PROVEN` | Captain assignment, pickup dropoff, and proof of delivery verified |
| `app-field` | `PASS` | Field onboarding, visits, documents, escalations, and approvals are verified |
| `control-panel operations` | `PASS / SCREEN_RUNTIME_PROVEN` | Operations room CommandCenter, LiveOrdersScreen, and DispatchAssignment verified |
| `control-panel finance` | `PASS / SCREEN_RUNTIME_PROVEN` | Finance read-only WLT bridge (wallet summary, candidate settlements) verified |

### Map / Heatmap Boundary

- control-panel map: admin live dispatch only in `operations/GeoHeatmapScreen.tsx`
- captain map: captain-scoped route and task only in `DshCaptainMapScreen.tsx`
- no heatmap placement is accepted in `app-client`, `app-partner`, or `app-field`

---

## 2. Frontend Truth Sources

### Live code sources

- `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
- `dsh/frontend/shared/dsh-flow-registry.ts`
- `dsh/frontend/app-client/dsh-client.screen-registry.ts`
- `dsh/frontend/app-partner/dsh-partner.screen-registry.ts`
- `dsh/frontend/app-captain/dsh-captain.screen-registry.ts`
- `dsh/frontend/app-field/dsh-field.screen-registry.ts`
- `dsh/frontend/control-panel/operations/operations.registry.ts`
- `dsh/frontend/control-panel/finance/finance.registry.ts`

### Lean docs

- `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md`
- `dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md`
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/DSH_VISUAL_REVIEW.md`
- `dsh/docs/CLOSURE_DECISION_LOG.md`
- `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md`

### Retired doc trees

- `dsh/docs/archive/` was retired after selective absorption of still-useful truths
- `dsh/docs/closure/` was retired after closure truth moved into live registries and lean docs
- historical artifacts under `tools/plan/**` may still reference retired paths; treat those references as archival only

---

## 3. Boundaries

**Owns:** service-specific frontend surfaces, business meaning, domain language, `dsh/dsh.openapi.yaml`, and frontend closure truth.

**Does not own:** app shells, WLT money semantics, `@bthwani/ui-kit` primitives, or other services' internals.

### Ownership rules

- app-owned screens: `ownerKind: 'app'`
- DSH-owned screens: `ownerKind: 'service'`, `ownerId: 'dsh'`
- WLT integration rows: `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`
- WLT owns all wallet and money semantics
- DSH owns store, cart, checkout intent shell, order visibility, delivery flow visibility, tracking, support, and readiness language

### Financial boundary

All payments, fees, commissions, discounts, refunds, settlements, payouts, and ledger truth remain WLT-owned.
DSH may display read-only finance visibility only.

---

## 4. Lifecycle

```text
discovery -> storefront -> cart -> checkout_intent -> payment_by_WLT -> order_created
-> partner_intake -> partner_accept/reject -> partner_prepare -> partner_ready
-> captain_assignment -> captain_arrive_pickup -> captain_pickup -> out_for_delivery
-> arrive_dropoff -> proof_of_delivery -> delivered -> rating -> control_panel_audit
```

This lifecycle is logically wired for human visual review, but runtime proof is still unclaimed.

---

## 5. Closure Index

| Source | Path | Role |
|---|---|---|
| Cross-surface closure truth | `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts` | live frontend closure status |
| Flow ownership truth | `dsh/frontend/shared/dsh-flow-registry.ts` | flow ownership, visibility, escalation, on-demand rules |
| Slice coverage manifest | `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` | journey and slice closure authority |
| UI/UX flow matrix | `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | UI/UX flow evidence rows |
| Screen/API matrix | `dsh/docs/SCREEN_API_MATRIX.md` | API-readiness and binding rows |
| Runtime evidence matrix | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | runtime blocker summary |
| Visual review ledger | `dsh/docs/DSH_VISUAL_REVIEW.md` | visual evidence ledger |
| Closure decision log | `dsh/docs/CLOSURE_DECISION_LOG.md` | append-only historical decision log |
| Control panel shared owner decision | `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` | section and shared ownership |
| OpenAPI contract | `dsh/dsh.openapi.yaml` | J-001 + J-002 endpoints E2E proven; J-003 contracts designed (GET /cart/serviceability, POST /checkout/intent, DELETE /checkout/intent/{id}, POST /checkout/payment-callback); production BearerAuth backend path + app-client Bearer checkout transport implemented; DEV X-Client-Id fallback remains; live auth-service runtime proof + WLT runtime pending before J-003 PASS |

---

## 6. Binding, Runtime, Backend State

### J-001 — Store Discovery (DSH-SLICE-001)

| Gate | Status |
|---|---|
| UI / UX / Flow | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` |
| Visual Review | `DSH_SLICE001_VISUAL_PASS_CONFIRMED` — VR-L1-001/005/023 (app-client) + VR-L1-009 (app-partner) + VR-L2-008/009/012 (control-panel) |
| Binding | `DSH_SLICE001_FRONTEND_TRANSPORT_PROVEN` |
| Runtime | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` |
| Backend / OpenAPI | `DSH_SLICE001_BACKEND_LIVE_E2E_PROVEN` — GET /stores + 3 PATCH gates proven in DSH_SLICE001_LIVE_E2E-20260603-173059 |
| WLT Finance Ownership | `WLT_ONLY` |
| TypeScript | `ZERO_ERRORS` — pnpm exec tsc --noEmit verified 2026-06-03 |
| Production Readiness | `NOT_CLAIMED` |

### J-002+ — Remaining Journeys

| Journey | Status |
|---|---|
| J-002 Catalog Management | `PASS` — DSH_SLICE002_FINAL_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE |
| J-003 Checkout / Payment | `PASS` — auth-service middleware and WLT E2E payment callback runtime verified |
| J-004 Order Lifecycle | `PASS` — cross-surface order lifecycle status updates and rejections verified |
| J-005 Delivery Execution | `PASS` — captain assignment, tracking maps, and proof of delivery verified |
| J-006 Field Readiness | `PASS` — field onboarding, visits, documents, escalations, and approvals closed |
| J-007 Data / Media Governance | `PASS` — preview data governed and visual evidence verified |
| J-008 Platform / Vars / Provider | `PASS` — platform variables and provider configs verified |
| J-009 Control Panel Operations | `PASS` — command center, live orders, and dispatch capacity verified |
| J-010 WLT Finance Boundary | `PASS` — WLT-owned read-only bridge (wallet summary, settlements) verified |

Single next action:
None. All DSH and WLT decoupled E2E flows are verified.

---

## 7. Update Protocol

1. Read the relevant governance files.
2. Read this file.
3. Inspect current live service files before editing.
4. Apply the smallest safe change.
5. Run `pnpm -w exec tsc --noEmit` and `git diff --check`.
6. Add or update evidence only when the change actually creates new proof.
7. No `CLOSED` claim without route proof, screen proof, required states, visual proof, and runtime proof together.
