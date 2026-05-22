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
| Current Decision | `DSH_UIUX_FLOW_LOGICALLY_READY_FOR_VISUAL_REVIEW` |
| Current Status | `DSH_VISUAL_REVIEW_PENDING_HUMAN_REVIEW` |
| Live Closure Truth | `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts` + `dsh/frontend/shared/dsh-flow-registry.ts` |
| Historic Runtime Baseline | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |

### Surface Status

| Surface | Status | Note |
|---|---|---|
| `app-client` | `needs-visual-evidence` | discovery, cart/checkout, and tracking/support are logically wired and now wait on human visual review |
| `app-partner` | `needs-visual-evidence` | intake and catalog readiness are logically wired and now wait on human visual review |
| `app-captain` | `needs-visual-evidence` | pickup, delivery, and PoD surfaces are logically wired and now wait on human visual review |
| `app-field` | `needs-visual-evidence` | onboarding and visit/readiness surfaces are logically wired and now wait on human visual review |
| `control-panel operations` | `needs-visual-evidence` | operations routing and screens are live; screenshots and runtime intervention proof are still missing |
| `control-panel finance` | `blocked-by-wlt` | finance remains a read-only WLT bridge and not a DSH-owned money surface |

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

- `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md`
- `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md`
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/CLOSURE_DECISION_LOG.md`
- `dsh/docs/DSH_VISUAL_REVIEW.md`

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
| UI/UX flow matrix | `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | human-readable closure summary |
| Screen/API matrix | `dsh/docs/SCREEN_API_MATRIX.md` | API-readiness freeze |
| Runtime evidence matrix | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | runtime blocker summary |
| Closure decision log | `dsh/docs/CLOSURE_DECISION_LOG.md` | append-only closure decisions |
| Client + WLT roadmap | `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` | app-client + WLT boundary plan |
| Control-panel owner decision | `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` | section and shared ownership |
| Visual review system | `dsh/docs/DSH_VISUAL_REVIEW.md` | screenshot-led visual evidence only |
| OpenAPI contract | `dsh/dsh.openapi.yaml` | contract remains blocked for implementation |

---

## 6. Binding, Runtime, Backend State

| Gate | Status |
|---|---|
| UI / UX / Flow | `DSH_UIUX_FLOW_LOGICALLY_READY_FOR_VISUAL_REVIEW` |
| Visual Review | `PENDING_HUMAN_REVIEW` |
| Binding | `NEEDS_BINDING_LATER` |
| Runtime | `RUNTIME_UNPROVEN` |
| Backend / OpenAPI | `OUT_OF_SCOPE / NOT_CLAIMED` |
| WLT Finance Ownership | `WLT_ONLY` |
| TypeScript | `TARGETED_REVALIDATION_PENDING` |
| Production Readiness | `NOT_CLAIMED` |

Single next action:
attach trusted current-branch screenshots for all five DSH surfaces without inflating runtime or backend claims.

---

## 7. Update Protocol

1. Read the relevant governance files.
2. Read this file.
3. Inspect current live service files before editing.
4. Apply the smallest safe change.
5. Run `pnpm -w exec tsc --noEmit` and `git diff --check`.
6. Add or update evidence only when the change actually creates new proof.
7. No `CLOSED` claim without route proof, screen proof, required states, visual proof, and runtime proof together.
