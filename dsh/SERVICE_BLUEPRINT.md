# DSH Service Blueprint

This file is the single truth file for the `dsh` service only.

It must apply the rules from `governance/PLATFORM_BLUEPRINT.md` without duplicating platform-wide policy.

This file owns service-specific facts only: purpose, boundaries, capabilities, surfaces, flows, contracts, status, evidence, risks, and closure.

For platform-wide rules, read:

```text
governance/PLATFORM_BLUEPRINT.md
```

For API contract truth, read:

```text
dsh/dsh.openapi.yaml
```

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

### Surface Status Summary (Reality Lock 2026-05-12)

| Surface | Status | Evidence Path | Note |
|---|---|---|---|
| app-client | `UI_PREVIEW_ONLY` | `dsh/frontend/app-client/` | Scoped preview closure only; discovery, storefront, cart, checkout, tracking, support, and rating still require visual/runtime proof. |
| app-partner | `UI_PREVIEW_ONLY` | `dsh/frontend/app-partner/` | Scoped preview closure only; inbox, preparation, promotions, support, and WLT bridge remain preview-backed. |
| app-captain | `UI_PREVIEW_ONLY` | `dsh/frontend/app-captain/` | Scoped preview closure only; assignment, pickup/dropoff, map, support, and finance bridge remain preview-backed. |
| app-field | `UI_PREVIEW_ONLY` | `dsh/frontend/app-field/` | Scoped preview closure only; stores, onboarding, visit, history, profile, and finance bridge remain preview-backed. |
| control-panel | `UI_PREVIEW_ONLY` | `dsh/frontend/control-panel/` | Scoped preview closure only; operations, marketing, partner eligibility, and finance preview remain preview-backed. |

### Map and Heatmap Boundary Contract

- **Control Panel Map**: Allowed only for **Admin live dispatch preview** (`operations/GeoHeatmapScreen.tsx`).
- **App Captain Map**: Allowed only for **Captain-scoped route/task view** (`DshCaptainMapScreen.tsx`).
- **Forbidden Heatmaps**: No heatmap placement is allowed in `app-client`, `app-partner`, or `app-field`.


### Blueprint Metadata

id: dsh
name: Delivery & Shopping
owner: dsh/
public_export_path: dsh/index.ts
screens_matrix: NEEDS_VISUAL_EVIDENCE
flow_matrix: NEEDS_VISUAL_EVIDENCE
evidence_root: tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336
closure_decision: DSH_FINAL_REALITY_LOCK_CLOSED_PREVIEW_ONLY

### Service Purpose

خدمة التسوق والتوصيل: المتاجر، المنتجات، السلة، الدفع عبر WLT، الطلب، تجهيز الشريك، التوصيل، التتبع، الدعم، والتقييم.

<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->
## DSH Client App-Scope Standardization

This section standardizes how DSH closes inside `app-client` as a service-owned customer surface while preserving app-shell ownership and WLT financial ownership.

### Scope Rings

1. `dsh/frontend/app-client/**`
2. `wlt/frontend/app-client/dsh/**`
3. `wlt/frontend/shared/finance/**`
4. `app-client/composition/**`
5. `app-client/shell/**`
6. `dsh/frontend/shared/**`

### Ownership Rules

- No service named `core` exists in this surface.
- App-owned screens use `ownerKind: 'app'` and `ownerId: 'app-client'`.
- DSH-owned screens use `ownerKind: 'service'`, `ownerId: 'dsh'`, and `serviceId: 'dsh'`.
- WLT-owned DSH integration uses `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, and `linkedServiceId: 'dsh'`.
- WLT owns money semantics and wallet semantics.
- DSH owns store, cart, checkout intent, order, delivery, tracking, support, and DSH-only delivery preferences.

### Canonical Client Structure

```text
dsh/frontend/app-client/
├─ index.ts
├─ DshClientSurface.tsx
├─ dsh-client.routes.ts
├─ dsh-client.screen-registry.ts
├─ dsh-client.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/
```

### WLT DSH Bridge

The app-client DSH checkout boundary may consume WLT only through a public bridge/contract path. Preview-only payment values must remain explicitly non-accounting and non-runtime.

### Current Standardization Status

- `DshClientSurface` is the app-client-facing surface boundary, with legacy host compatibility preserved at the app-shell route layer.
- `dsh-client.routes.ts` and `dsh-client.screen-registry.ts` are introduced as the passive route/screen metadata layer.
- `PreferencesScreen` is introduced for DSH-only delivery preferences with extracted `preferences.preview-data.ts`.
- WLT bridge standardization is complete with consolidation into `wlt-dsh-client.parts.tsx`.
- Public API in `dsh/frontend/app-client/index.ts` is trimmed to essential exports only.
<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->

---

## 2. Ownership and Boundaries

### Owns

- Service-specific business meaning.
- Service-specific frontend surfaces when present under this service root.
- Service-specific backend scope when present under this service root.
- Service-specific domain rules and models.
- `dsh/dsh.openapi.yaml` contract truth.
- Service-specific evidence and closure status.
- Service-specific flow, gap, Screen/API Matrix, and runtime state records inside this file.

### Does Not Own

- App runtime shells.
- App-level routing/bootstrap/provider ownership.
- `master.openapi.yaml`.
- `auth.openapi.yaml`.
- `@bthwani/ui-kit` primitives, tokens, themes, direction, shared states, or reusable design authority.
- Other services' internal files, private routes, domain logic, data models, or contracts.
- Financial effects outside WLT.
- Financial data models or preview finance fixtures (these are owned by `wlt/frontend/shared/finance/`).

### Allowed Dependencies

- `governance/PLATFORM_BLUEPRINT.md` for platform method.
- `dsh/dsh.openapi.yaml` for this service contract.
- `auth.openapi.yaml` for platform authentication/authorization when applicable.
- WLT contracts for any financial effect.
- `@bthwani/ui-kit` public exports for shared UI.
- Approved public contracts, typed clients, or explicit integration events.

### Forbidden Couplings

- Deep imports into another service's private files.
- Direct backend/API ownership from an app runtime.
- Business/domain logic inside app shells.
- Local design tokens, local reusable UI families, or local direction systems.
- Endpoint/schema changes without documented screen/flow gap.
- Financial behavior outside WLT.
- Closure claims without evidence.

---

## 3. Actors, Personas, and Capabilities

### Actors and Surface Touchpoints

| Surface | Role / Scope | What Surface Provides | Status | Evidence |
| --- | --- | --- | --- | --- |
| `app-client` | Customer: اكتشاف المتاجر، المنتجات، السلة، checkout، الدفع، التتبع، الدعم، التقييم. | scoped preview closure only; `UI_PREVIEW_ONLY` | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `webapp` | Customer Web: نسخة ويب وظيفية مكافئة لـ app-client عند النضج. | parity target only; no current webapp proof in this reality lock | `NEEDS_BINDING_LATER` | N/A |
| `app-partner` | Partner/Store: الطلبات، القبول/الرفض، التحضير، الجاهزية، الكتالوج، المشاكل. | scoped preview closure only; `UI_PREVIEW_ONLY` | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `app-captain` | Captain: قبول مهمة التوصيل، الاستلام، التسليم، البلاغات، الإكمال. | scoped preview closure only; `UI_PREVIEW_ONLY` | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `app-field` | Field Agent: تفعيل المتاجر والدعم الميداني عند الحاجة المثبتة. | scoped preview closure only; `UI_PREVIEW_ONLY` | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `control-panel` | Admin/Ops: مراقبة، تشغيل، دعم، كتالوج، تدخل، تقارير. | scoped preview closure only; `UI_PREVIEW_ONLY` | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |

### Owned Capabilities

- Store discovery
- Storefront
- Catalog/product browsing
- Cart
- Checkout
- Order creation
- Partner intake/preparation
- Captain assignment/delivery
- Tracking
- Support
- Rating
- WLT financial relation
- Control-panel operations

### Capability Lock Notes

- Actor capability fields must be enforced by platform/auth/server rules when applicable.
- Partner, captain, and field capabilities must remain role-correct and service-correct.
- Any role or permission not proven by evidence remains `TBD`.

---

## 4. Surface Matrix

| Surface | Ownership Rule | Service Scope | Status | Evidence |
|---|---|---|---|---|
| `app-client` | app owns shell/composition only | Customer: اكتشاف المتاجر، المنتجات، السلة، checkout، الدفع، التتبع، الدعم، التقييم. | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `webapp` | app owns shell/composition only | Customer Web: نسخة ويب وظيفية مكافئة لـ app-client عند النضج. | `NEEDS_BINDING_LATER` | N/A |
| `app-partner` | app owns shell/composition only | Partner/Store: الطلبات، القبول/الرفض، التحضير، الجاهزية، الكتالوج، المشاكل. | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `app-captain` | app owns shell/composition only | Captain: قبول مهمة التوصيل، الاستلام، التسليم، البلاغات، الإكمال. | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `app-field` | app owns shell/composition only | Field Agent: تفعيل المتاجر والدعم الميداني عند الحاجة المثبتة. | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |
| `control-panel` | app owns shell/composition only | Admin/Ops: مراقبة، تشغيل، دعم، كتالوج، تدخل، تقارير. | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` |

### App/Shell Rule

Apps may own entry, bootstrap, routing mount, providers, platform config, metadata, and minimal environment wiring.

Apps must not own real `dsh` service screens, business/domain logic, reusable UI families, local design tokens, mock service content, independent i18n/direction ownership, direct backend/API ownership, or deep/private imports.

---

## 5. Operation Registry

| Operation ID | Operation | Business Meaning | Actor | Surface | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `DSH-OP-01` | Store discovery | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-02` | Storefront | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-03` | Catalog/product browsing | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-04` | Cart | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-05` | Checkout | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-06` | Order creation | `UI_PREVIEW_ONLY` | Customer/partner | app-client / app-partner | `NEEDS_BINDING_LATER` |
| `DSH-OP-07` | Partner intake/preparation | `UI_PREVIEW_ONLY` | Partner | app-partner | `NEEDS_BINDING_LATER` |
| `DSH-OP-08` | Captain assignment/delivery | `UI_PREVIEW_ONLY` | Captain | app-captain | `NEEDS_BINDING_LATER` |
| `DSH-OP-09` | Tracking | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-10` | Support | `UI_PREVIEW_ONLY` | Customer/admin | app-client / control-panel | `NEEDS_BINDING_LATER` |
| `DSH-OP-11` | Rating | `UI_PREVIEW_ONLY` | Customer | app-client | `NEEDS_BINDING_LATER` |
| `DSH-OP-12` | WLT financial relation | Bound to WLT preview model | Financial boundary | wlt | `NEEDS_BINDING_LATER` |
| `DSH-OP-13` | Control-panel operations | `UI_PREVIEW_ONLY` | Admin/Ops | control-panel | `NEEDS_BINDING_LATER` |

### Operation Rules

- No operation becomes contract truth until it appears in the Screen/API Matrix and Gap Map.
- No operation becomes runtime truth until runtime evidence exists.
- No operation becomes closed until all required gates pass.

---

## 6. Journey and Lifecycle Map

### Primary Lifecycle

```text
Store discovery → Storefront → Product selection → Cart → Checkout → Payment decision through WLT → Order created → Partner intake → Partner accept/reject → Partner prepare → Partner ready/handoff → Captain assignment → Captain pickup → Out for delivery → Customer tracking → Delivery confirmation → Rating → Settlement/refund/support paths through WLT → Control-panel monitoring and intervention.
```

### Deep Closure Sequence

```text
Actors
→ Operations
→ Lifecycle
→ Surface Coverage
→ Journeys
→ Screen Inventory
→ Route Rationalization
→ Purpose / CTA
→ State Coverage
→ Screen/API Matrix
→ Gap Map
→ Contract
→ Generated/typed client
→ Binding
→ Integration
→ Runtime
→ Backend
→ Data
→ Security
→ Observability
→ Tests
→ Performance / Accessibility
→ Production Readiness
→ Evidence
```

---

## 7. Screen / Route / Sheet / State Inventory

| ID | Surface | Screen / Route / Sheet / State | Type | Purpose / CTA | Required States | Owner Path | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| `DSH-OPS-COMMAND-CENTER-01` | control-panel / operations | DSH operations command-center UI preview | Screen | Dispatch, exceptions, SLA, audit, partner prep, live tracking, handoff, proof review, capacity | loading / empty / error / offline / disabled / ready | `dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx` | `UI_PREVIEW_ONLY` | `DSH_CLEANUP_HARDENING` |

### Screen File Model

- `*Screen.tsx` must represent a real route/page/surface entry.
- Card, row, section, and block components must not be named `Screen`.
- A giant file containing many screens is a breach.
- A fragment named `Screen` that is not a route/page/surface entry is a breach.
- `index.ts` exports screen entries only and does not leak private parts unless that public contract is intentional.
- A screen consumes view state and must not own raw backend calls.

---

## 8. Screen/API Matrix

| Flow ID | Screen / Route / State | Needed Data | Needed Action | Existing Contract | Required Contract Gap | Status | Evidence |
|---|---|---|---|---|---|---|---|
| `DSH-MATRIX-OPS-UI-01` | control-panel operations command-center preview | dispatch, exceptions, sla, audit, partner-prep, live-tracking, handoff, proof-review, capacity | route navigation only | `dsh/dsh.openapi.yaml` | no API contract yet | PRESENT_UI_PREVIEW | N/A |

### Screen/API Rules

- No OpenAPI change without a documented gap.
- No endpoint without screen/flow need.
- No schema without usage demand.
- OpenAPI existence means contract exists only; it does not prove Binding, Integration, Runtime, or service closure.

---

## 9. Gap Map

| Gap ID | Gap Type | Affected Flow | Surface / Layer | Expected | Current | Impact | Priority | Closure Type | Target Owner Path | Blocked By | Verification Gate | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-GAP-ROOT-PARITY` | DUPLICATE_NOISE | Root truth parity | `dsh/` + docs | frontend truth aligned | truth parity evidence collected | medium | medium | `PASS_WITH_EVIDENCE` | `dsh/` | evidence | `PASS_WITH_EVIDENCE` | `DSH_CLEANUP_HARDENING` |
| `DSH-GAP-ROUTE-PARITY` | MISSING_ROUTE | Control-panel control/operations | `control-panel/runtime` + `control-panel/shell` | route ids and subsections aligned | route ids, tabs, and render cases now align for the operations command-center UI | medium | high | `PASS_WITH_EVIDENCE` | `control-panel/` | compile + route evidence | `UI_FLOW_PRESENT_NEEDS_VISUAL_EVIDENCE` | `DSH_CLEANUP_HARDENING` |
| `DSH-GAP-CONTRACT` | MISSING_CONTRACT | All DSH flows | `dsh/dsh.openapi.yaml` | contract-backed flow proof | contract remains scaffold/TBD | high | high | ADD_CONTRACT_OPERATION | `dsh/` | Screen/API Matrix | CONTRACT_TBD | N/A |
| `DSH-GAP-BACKEND` | MISSING_BACKEND_HANDLER | All DSH flows | `dsh/backend` | backend truth proven | backend scaffold only | high | high | ADD_BACKEND_HANDLER | `dsh/backend/` | implementation evidence | BACKEND_SCAFFOLD_ONLY | N/A |
| `DSH-GAP-DOMAIN` | MISSING_PERSISTENCE_MODEL | All DSH flows | `dsh/domain` | domain truth proven | domain TBD | medium | medium | ADD_PERSISTENCE_MODEL | `dsh/domain/` | domain evidence | DOMAIN_TBD | N/A |
| `DSH-GAP-RUNTIME` | RUNTIME_LEAKAGE | All DSH flows | `dsh/frontend` + `control-panel` | runtime proof for present slices | runtime unproven | high | high | ADD_RUNTIME_PROVIDER | `dsh/frontend/` | visual/runtime evidence | RUNTIME_UNPROVEN | N/A |

### Allowed Gap Types

`MISSING_SCREEN`, `MISSING_ROUTE`, `MISSING_SHEET_DRAWER`, `MISSING_STATE`, `MISSING_LINK`, `MISSING_COUNTERPART_SURFACE`, `MISSING_CONTRACT`, `MISSING_API_TYPE`, `MISSING_API_CLIENT`, `MISSING_BINDING_ADAPTER`, `MISSING_RUNTIME_PROVIDER`, `MISSING_BACKEND_HANDLER`, `MISSING_PERSISTENCE_MODEL`, `MISSING_INTEGRATION_EVENT`, `MISSING_SECURITY_POLICY`, `MISSING_OBSERVABILITY_SIGNAL`, `MISSING_TEST_COVERAGE`, `OWNERSHIP_BREACH`, `UI_KIT_BREACH`, `APP_SHELL_BREACH`, `SURFACE_BOUNDARY_BREACH`, `API_BOUNDARY_BREACH`, `BINDING_BOUNDARY_BREACH`, `DUPLICATE_NOISE`, `ORPHAN_DEAD_CANDIDATE`, `RUNTIME_LEAKAGE`, `CONTENT_LEAKAGE`, `TBD`

### Gap Closure Types

A gap does not automatically mean a new screen. It may close through:

`ADD_SCREEN`, `ADD_ROUTE`, `ADD_SHEET`, `ADD_PART`, `ADD_STATE`, `ADD_LINK`, `ADD_CONTRACT_OPERATION`, `ADD_API_TYPE`, `GENERATE_API_CLIENT`, `ADD_BINDING_ADAPTER`, `ADD_RUNTIME_PROVIDER`, `ADD_BACKEND_HANDLER`, `ADD_PERSISTENCE_MODEL`, `ADD_INTEGRATION_EVENT`, `ADD_SECURITY_GUARD`, `ADD_OBSERVABILITY_SIGNAL`, `ADD_TEST`, `MOVE_EXISTING`, `RECLASSIFY`, `EXPOSE_PUBLIC_EXPORT`, `PROMOTE_TO_UI_KIT`, `PROMOTE_TO_APP_SHELL`, `PROMOTE_TO_SURFACE_OWNED`, `REMOVE_DUPLICATE_LATER`, `MARK_TBD`, `BLOCKED`.

---

## 10. Contract, Backend, and Domain State

| Area | Status | Source | Evidence | Notes |
|---|---|---|---|---|
| OpenAPI | `CONTRACT_TBD` | `dsh/dsh.openapi.yaml` | N/A | Do not add fake endpoints. |
| API Types | `TBD` | TBD | N/A | Must follow contract generate/verify. |
| API Client / Typed Boundary | `TBD` | TBD | N/A | Required before Binding PASS. |
| Backend Handler | `TBD` | TBD | N/A | No backend claim without implementation evidence. |
| Persistence Model | `TBD` | TBD | N/A | No data claim without evidence. |
| Domain Model | `TBD` | TBD | N/A | Must stay service-owned. |
| Mutable Policy / VAR | `TBD` | TBD | N/A | Use `VAR_*` for market/region/provider/store/season mutable values. |

### Contract Order

```text
Flow / Screen Need
→ Screen/API Matrix
→ Gap Map
→ OpenAPI Contract
→ Generated/typed client
→ Binding Adapter / ViewModel
→ Screen State
→ Runtime Evidence
```

### Financial Boundary

All payments, fees, commissions, discounts, refunds, settlements, compensation, cashback, ledger entries, and financial closures must pass through WLT only.

---

## 11. Binding, Integration, Runtime State

| Gate | Status | Required Proof | Evidence | Notes |
|---|---|---|---|---|
| UI / UX / Flow | `NEEDS_VISUAL_EVIDENCE` | Surface coverage, states, RTL, purpose/CTA, no ownership breach | `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | Current live routes are frozen, but trusted screenshots are still missing. |
| Binding | `NEEDS_BINDING_LATER` | Typed client/boundary, actual usage, TypeScript PASS | `dsh/docs/SCREEN_API_MATRIX.md` | Freeze first; runtime binding remains later work. |
| Integration | `NOT_READY_FOR_API` | Approved contract/event/public interface | `dsh/docs/SCREEN_API_MATRIX.md` | No contract work starts before current freeze exits the visual gate. |
| Runtime | `RUNTIME_UNPROVEN` | Runtime mode, provider, happy/failure/recovery path proof | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | Fixture/mock/seed is not runtime truth. |
| Backend | `NOT_READY_FOR_API` | handler/service/data/security proof | `dsh/dsh.openapi.yaml`; `dsh/backend/src/contracts.ts` | Backend and domain remain scaffold-only in this phase. |
| Production Readiness | `BLOCKED` | builds, security, observability, tests, rollback, evidence pack | N/A | No GO without all criteria. |

### Runtime Truth Classification

Allowed classifications:

- `mock`
- `fixture`
- `seed`
- `preview`
- `runtime truth`
- `production-like truth`

No fixture, mock, or seed may be promoted to runtime truth without evidence.

---

## 12. Security, RBAC/ABAC, Privacy, Audit State

| Area | Status | Notes | Evidence |
|---|---|---|---|
| Auth dependency | `TBD` | Must use `auth.openapi.yaml` when applicable. | N/A |
| RBAC/ABAC | `TBD` | Actor and capability enforcement must be server/platform-enforced when enabled. | N/A |
| PII/privacy | `TBD` | No logging/retention claim without policy evidence. | N/A |
| Audit | `TBD` | High-risk changes and financial effects require audit trace. | N/A |
| Secrets | `TBD` | No secrets in source, logs, or evidence. | N/A |

---

## 13. Observability, Testing, Performance, Accessibility State

| Area | Status | Minimum Proof | Evidence |
|---|---|---|---|
| Observability | `TBD` | signals/logs/metrics for P0 flows when enabled | N/A |
| TypeScript | `PASS` | `pnpm -w exec tsc --noEmit` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336/tsc-noemit.txt` |
| Unit/Component | `TBD` | scope-based tests where applicable | N/A |
| Integration/E2E | `TBD` | critical path proof where applicable | N/A |
| Visual/RTL | `NEEDS_VISUAL_EVIDENCE` | screenshot/visual proof for UI changes | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` |
| Accessibility | `TBD` | WCAG 2.2 floor where applicable | N/A |
| Performance | `TBD` | no material regression for enabled flows | N/A |

---

## 14. Control-Panel Relation

| Control-Panel Area | Relation to This Service | Status | Evidence |
|---|---|---|---|
| dashboard | TBD | TBD | N/A |
| operations | TBD | TBD | N/A |
| finance | WLT-owned financial truth only; this service may expose monitoring/admin context when applicable | TBD | N/A |
| catalogs | TBD | TBD | N/A |
| support | TBD | TBD | N/A |
| partners | TBD | TBD | N/A |
| marketing | TBD | TBD | N/A |
| community-services | Applies to ESF/KWD/MRF/SND when relevant | TBD | N/A |
| control/platform | Platform admin only | TBD | N/A |
| control/administration | Administrative control only | TBD | N/A |
| control/hr | HR/admin only | TBD | N/A |

### Control-Panel Rule

`control-panel` is a web-first operational control room. It is not a parallel owner of service truth and it is not a parallel financial path.

---

## 15. Evidence, Decision, and Next Action

### Evidence Registry

| Evidence ID | Scope | Result | Path | Notes |
|---|---|---|---|---|
| NEEDS_EVIDENCE | Root frontend parity | Pending | `tools/registry/runs/{SESSION_ID}` | Add only verified evidence. |
| DSH_FINAL_REALITY_LOCK | Current-branch truth reconciliation for preview-only scope | `CLOSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` | Truth files, vocabulary, live-file CSVs, and current-branch blockers were reconciled without promoting runtime/API/backend claims. |
| DSH_VISUAL_RUNTIME_SMOKE | Current-branch visual/runtime smoke gate | `NEEDS_VISUAL_EVIDENCE` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | Existing screenshots found in older evidence packs were partial and not accepted as current-branch proof. |
| DSH_AUDIT_010 | Deep Local System Audit | FIX_REQUIRED | `tools/registry/runs/DSH_AUDIT_010_DEEP_SYSTEM_DIAGNOSIS-20260506-053242` | Matrix drift cleanup and evidence generation |
| DSH-EVD-F2-F3-WLT-BIND | DSH screens bound to WLT finance model (F2–F3, 2026-05-09) | `UI_PREVIEW_FOUNDATION` | `dsh/frontend/app-client/screens/CartScreen.tsx`, `dsh/frontend/app-captain/screens/DshCaptainFinanceScreen.tsx`, `dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx` | preview/fixture only — DSH consumes WLT model, no financial data ownership in DSH |
| DSH_CLEANUP_HARDENING | Dead code archive, duplication consolidation, and naming cleanup | `PASSED` | `dsh/_archive/frontend/5899a771-f61c-4e88-ba19-e7560e699a04/` | Archived redundant fixtures and screens; current reality lock revalidated truth separately. |
| DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R3 | Final cleanup of index, preferences data, ghost types, and WLT bridge consolidation | `PASSED` | `tools/registry/runs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R3_FIX_REQUIRED-20260511-035800` | App-client surface cleanup and WLT bridge consolidation were completed; runtime proof remains separate. |
| DSH_MOBILE_APPS_FINAL_CLOSURE_GATE | Partner, captain, and field mobile closure plus app-field public API hardening | `PASSED_PREVIEW_ONLY` | `tools/registry/runs/DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555` | Mobile registries were closed for preview-only scope; runtime smoke was skipped in that gate. |


### Current Decision

```text
DSH_FINAL_REALITY_LOCK_CLOSED_PREVIEW_ONLY
```

### Remaining Risks

- Preview-only mobile and control-panel scope is frozen, but trusted current-branch screenshots are still missing.
- API contract remains `CONTRACT_TBD` until the visual gate is cleared and the Screen/API freeze exits with evidence.
- Backend, domain, and WLT ledger runtime remain unproven and intentionally out of scope for this phase.

### Single Next Action

Attach trusted current-branch screenshots for the five active DSH surfaces, or keep the service at `NEEDS_VISUAL_EVIDENCE` without promoting API/runtime closure language.


### Update Protocol

1. Read `governance/PLATFORM_BLUEPRINT.md`.
2. Read this file.
3. Inspect current service files before editing.
4. Apply the smallest safe change.
5. Run required verification.
6. Create evidence under `tools/registry/runs/{SESSION_ID}`.
7. Update this file only with verified service-specific truth.
8. Do not duplicate platform-wide rules here.
9. Do not claim `CLOSED` unless all applicable gates pass.

<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:start -->
## DSH Partner App-Scope Standardization

Scope: DSH partner only.

Ownership:
- DSH owns partner delivery operations: store profile, operations, orders, order issues, inventory, promotions, notifications, settings, and support.
- WLT owns wallet, balance, settlements, payouts, commission, and money semantics.
- ARB is not part of `dsh/frontend/app-partner`.
- No service named `core`.

Canonical structure:

```text
dsh/frontend/app-partner/
├─ index.ts
├─ DshPartnerSurface.tsx
├─ dsh-partner.routes.ts
├─ dsh-partner.screen-registry.ts
├─ dsh-partner.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/
```

Canonical DSH partner screens:
`PartnerHomeScreen`, `PartnerEntryScreen`, `StoreProfileScreen`, `OperationsScreen`, `OrdersInboxScreen`, `OrderDetailScreen`, `OrderIssueScreen`, `InventoryCatalogScreen`, `PromotionsScreen`, `NotificationsScreen`, `PartnerSettingsScreen`, `PartnerSupportScreen`.

WLT-owned DSH partner bridge:
`wlt/frontend/app-partner/dsh/index.ts`, `WltDshPartnerBridge.tsx`, `wlt-dsh-partner.parts.tsx`, `wlt-dsh-partner.adapter.ts`, `wlt-dsh-partner.ui-copy.ts`, `wlt-dsh-partner.contract.ts`, `wlt-dsh-partner.preview-data.ts`, `wlt-dsh-partner.types.ts`, `useWltDshPartnerWalletPreview.ts`.

Archived finance remnants:
Dead DSH-owned wallet/finance preview files must move to `dsh/_archive/frontend/**` once they are proven unreferenced.

Gates:
- no `export *`
- no `serviceId: 'core'`
- no Tamagui outside `ui-kit`
- no DSH-owned wallet/finance screen
- no ARB route in DSH partner surface
- all scoped files classified once
- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit`

<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:end -->
