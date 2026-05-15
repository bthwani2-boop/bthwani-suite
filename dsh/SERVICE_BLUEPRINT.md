# DSH Service Blueprint

Single truth file for the `dsh` service. Platform-wide policy: `governance/PLATFORM_BLUEPRINT.md`. API contract: `dsh/dsh.openapi.yaml`.

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
| Current Decision | `DSH_FINAL_REALITY_LOCK_CLOSED_PREVIEW_ONLY` |
| Current Status | `NEEDS_VISUAL_EVIDENCE` |
| Evidence Root | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |

### Surface Status

| Surface | Status | Note |
|---|---|---|
| app-client | `UI_PREVIEW_ONLY` | Discovery → checkout → tracking → support → rating — preview-only |
| app-partner | `UI_PREVIEW_ONLY` | Intake → acceptance → preparation → handoff — preview-only |
| app-captain | `UI_PREVIEW_ONLY` | Assignment → pickup → delivery → PoD — preview-only |
| app-field | `UI_PREVIEW_ONLY` | Store onboarding → field visit — preview-only |
| control-panel | `UI_PREVIEW_ONLY` | Ops → partners → finance → support — preview-only |

### Map / Heatmap Boundary

- CP map: Admin live dispatch only (`operations/GeoHeatmapScreen.tsx`).
- Captain map: Captain-scoped route/task only (`DshCaptainMapScreen.tsx`).
- No heatmap in `app-client`, `app-partner`, or `app-field`.

---

## 2. Boundaries

**Owns**: service-specific frontend surfaces, business meaning, domain models, `dsh/dsh.openapi.yaml`, closure status.
**Does not own**: app shells, WLT money semantics, `@bthwani/ui-kit` primitives, other services' internals.

### Ownership Rules (client surface)

- App-owned screens: `ownerKind: 'app'`, `ownerId: 'app-client'`.
- DSH-owned screens: `ownerKind: 'service'`, `ownerId: 'dsh'`, `serviceId: 'dsh'`.
- WLT integration: `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, `linkedServiceId: 'dsh'`.
- WLT owns all money semantics and wallet semantics.
- DSH owns store, cart, checkout intent, order, delivery, tracking, support, DSH delivery preferences.

### Financial Boundary

All payments, fees, commissions, discounts, refunds, settlements, and financial closures must pass through WLT only.

---

## 3. Lifecycle

```text
discovery → storefront → cart → checkout_intent → payment_by_WLT → order_created
→ partner_intake → partner_accept/reject → partner_prepare → partner_ready
→ captain_assignment → captain_arrive_pickup → captain_pickup → out_for_delivery
→ arrive_dropoff → proof_of_delivery → delivered → rating → control_panel_audit
```

---

## 4. Closure Docs Index

| Doc | Path | Status |
|---|---|---|
| Screen Inventory | `dsh/docs/closure/DSH_SCREEN_INVENTORY.csv` | DONE_LOCAL |
| Route/State/CTA Matrix | `dsh/docs/closure/DSH_ROUTE_STATE_CTA_MATRIX.csv` | DONE_LOCAL |
| Missing Logic & UI Gaps | `dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv` | DONE_LOCAL |
| Duplicate/Dead/Noise | `dsh/docs/closure/DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.csv` | DONE_LOCAL |
| UI Review Queue | `dsh/docs/closure/DSH_UI_REVIEW_QUEUE.md` | DONE_LOCAL |
| Loop 4 Evidence | `dsh/docs/closure/DSH_LOOP_4_EVIDENCE.md` | DONE_LOCAL |
| Loop 5 Evidence | `dsh/docs/closure/DSH_LOOP_5_EVIDENCE.md` | DONE_LOCAL |
| Visual Review Readiness | `dsh/docs/closure/DSH_VISUAL_REVIEW_READINESS_CHECKLIST.md` | DONE_LOCAL |
| UI/UX Flow Closure Matrix | `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | DO_NOT_TOUCH |
| Screen/API Matrix | `dsh/docs/SCREEN_API_MATRIX.md` | DO_NOT_TOUCH |
| Runtime Evidence Matrix | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | DO_NOT_TOUCH |
| Closure Decision Log | `dsh/docs/CLOSURE_DECISION_LOG.md` | DO_NOT_TOUCH |
| WLT Roadmap | `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` | DO_NOT_TOUCH |
| CP Ownership Decision | `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` | DO_NOT_TOUCH |
| OpenAPI Contract | `dsh/dsh.openapi.yaml` | CONTRACT_TBD |
| Stale Archived Docs | `dsh/docs/archive/` | Pre-Loop-3, archived Loop 5 |

---

## 5. Binding, Runtime, Backend State

| Gate | Status |
|---|---|
| UI / UX / Flow | `NEEDS_VISUAL_EVIDENCE` |
| Binding | `NEEDS_BINDING_LATER` |
| Runtime | `RUNTIME_UNPROVEN` |
| Backend | `NOT_READY_FOR_API` |
| TypeScript | `PASS` |
| Production Readiness | `BLOCKED` |

**Single next action**: Attach trusted current-branch screenshots for all five DSH surfaces to exit `NEEDS_VISUAL_EVIDENCE`.

---

## 6. Update Protocol

1. Read `governance/PLATFORM_BLUEPRINT.md`.
2. Read this file.
3. Inspect current service files before editing.
4. Apply the smallest safe change.
5. Run `pnpm -w exec tsc --noEmit` and `git diff --check`.
6. Create evidence under `tools/registry/runs/{SESSION_ID}`.
7. No `CLOSED` claim without all gates passing.
