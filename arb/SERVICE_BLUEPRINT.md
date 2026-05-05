# ARB Service Blueprint

This file is the single truth file for the `arb` service only.

It must apply the rules from `governance/PLATFORM_BLUEPRINT.md` without duplicating platform-wide policy.

This file owns service-specific facts only: purpose, boundaries, capabilities, surfaces, flows, contracts, status, evidence, risks, and closure.

For platform-wide rules, read:

```text
governance/PLATFORM_BLUEPRINT.md
```

For API contract truth, read:

```text
arb/arb.openapi.yaml
```

---

## 1. Service Truth

| Field | Value |
|---|---|
| Service ID | `arb` |
| Service Name | Reservations / حجوزات |
| Service Type | `PAID_SERVICE` |
| Owner Root | `arb/` |
| Truth File | `arb/SERVICE_BLUEPRINT.md` |
| OpenAPI Contract | `arb/arb.openapi.yaml` |
| Public Export Path | `arb/index.ts` |
| Current Decision | `NOT CLOSED` |
| Current Status | `ROOTED_UNPROVEN / SERVICE_BLUEPRINT_BASELINE` |
| Evidence Root | `tools/registry/runs/{SESSION_ID}` |

### Blueprint Metadata

id: arb
name: Reservations
owner: arb/
public_export_path: arb/index.ts
screens_matrix: TBD
flow_matrix: TBD
evidence_root: tools/registry/runs/{SESSION_ID}
closure_decision: NOT CLOSED

### Service Purpose

خدمة حجوزات مثل الفنادق والصالات والمرافق ومزودي خدمات الحجز: البحث، التوافر، الحجز، العربون/الضمان، التأكيد، الإلغاء، النزاعات، والتسويات.

---

## 2. Ownership and Boundaries

### Owns

- Service-specific business meaning.
- Service-specific frontend surfaces when present under this service root.
- Service-specific backend scope when present under this service root.
- Service-specific domain rules and models.
- `arb/arb.openapi.yaml` contract truth.
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

### Allowed Dependencies

- `governance/PLATFORM_BLUEPRINT.md` for platform method.
- `arb/arb.openapi.yaml` for this service contract.
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
| `app-client` | Customer: البحث، الحجز، دفع/عربون عند اعتماده، المتابعة، الإلغاء/الدعم. | runtime / shell / composition only | TBD | N/A |
| `webapp` | Customer Web: حجوزات عبر الويب عند النضج. | runtime / shell / composition only | TBD | N/A |
| `app-partner` | Provider/Partner: إدارة الحجوزات، التوافر، العروض، التأكيد، الإلغاء. | runtime / shell / composition only | TBD | N/A |
| `app-field` | Field Agent: تفعيل مزودين أو دعم ميداني عند الحاجة المثبتة. | runtime / shell / composition only | TBD | N/A |
| `control-panel` | Admin/Ops: نزاعات، سياسات، تدقيق، إشراف، تشغيل. | runtime / shell / composition only | TBD | N/A |

### Owned Capabilities

- Reservation discovery
- Availability
- Offer detail
- Booking intent
- Deposit/guarantee relation
- Confirmation/cancellation
- Dispute/support
- Partner availability management
- WLT payment/refund/settlement relation

### Capability Lock Notes

- Actor capability fields must be enforced by platform/auth/server rules when applicable.
- Partner, captain, and field capabilities must remain role-correct and service-correct.
- Any role or permission not proven by evidence remains `TBD`.

---

## 4. Surface Matrix

| Surface | Ownership Rule | Service Scope | Status | Evidence |
|---|---|---|---|---|
| `app-client` | app owns shell/composition only | Customer: البحث، الحجز، دفع/عربون عند اعتماده، المتابعة، الإلغاء/الدعم. | TBD | N/A |
| `webapp` | app owns shell/composition only | Customer Web: حجوزات عبر الويب عند النضج. | TBD | N/A |
| `app-partner` | app owns shell/composition only | Provider/Partner: إدارة الحجوزات، التوافر، العروض، التأكيد، الإلغاء. | TBD | N/A |
| `app-field` | app owns shell/composition only | Field Agent: تفعيل مزودين أو دعم ميداني عند الحاجة المثبتة. | TBD | N/A |
| `control-panel` | app owns shell/composition only | Admin/Ops: نزاعات، سياسات، تدقيق، إشراف، تشغيل. | TBD | N/A |

### App/Shell Rule

Apps may own entry, bootstrap, routing mount, providers, platform config, metadata, and minimal environment wiring.

Apps must not own real `arb` service screens, business/domain logic, reusable UI families, local design tokens, mock service content, independent i18n/direction ownership, direct backend/API ownership, or deep/private imports.

---

## 5. Operation Registry

| Operation ID | Operation | Business Meaning | Actor | Surface | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `ARB-OP-01` | Reservation discovery | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-02` | Availability | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-03` | Offer detail | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-04` | Booking intent | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-05` | Deposit/guarantee relation | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-06` | Confirmation/cancellation | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-07` | Dispute/support | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-08` | Partner availability management | TBD | TBD | TBD | TBD | N/A |
| `ARB-OP-09` | WLT payment/refund/settlement relation | TBD | TBD | TBD | TBD | N/A |

### Operation Rules

- No operation becomes contract truth until it appears in the Screen/API Matrix and Gap Map.
- No operation becomes runtime truth until runtime evidence exists.
- No operation becomes closed until all required gates pass.

---

## 6. Journey and Lifecycle Map

### Primary Lifecycle

```text
Search reservation → view offer/detail → choose time/option → booking intent → WLT deposit/payment path if required → partner confirmation → customer follow-up → completion/cancel/dispute → WLT refund/settlement if required → control-panel supervision.
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
| `ARB-INV-TBD` | TBD | TBD | TBD | TBD | loading / empty / error / success / offline / disabled / pending / retry / blocked | TBD | TBD | N/A |

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
| `ARB-MATRIX-TBD` | TBD | TBD | TBD | `arb/arb.openapi.yaml` | TBD | TBD | N/A |

### Screen/API Rules

- No OpenAPI change without a documented gap.
- No endpoint without screen/flow need.
- No schema without usage demand.
- OpenAPI existence means contract exists only; it does not prove Binding, Integration, Runtime, or service closure.

---

## 9. Gap Map

| Gap ID | Gap Type | Affected Flow | Surface / Layer | Expected | Current | Impact | Priority | Closure Type | Target Owner Path | Blocked By | Verification Gate | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `ARB-GAP-TBD` | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | `arb/` | TBD | TBD | N/A |

### Allowed Gap Types

`MISSING_SCREEN`, `MISSING_ROUTE`, `MISSING_SHEET_DRAWER`, `MISSING_STATE`, `MISSING_LINK`, `MISSING_COUNTERPART_SURFACE`, `MISSING_CONTRACT`, `MISSING_API_TYPE`, `MISSING_API_CLIENT`, `MISSING_BINDING_ADAPTER`, `MISSING_RUNTIME_PROVIDER`, `MISSING_BACKEND_HANDLER`, `MISSING_PERSISTENCE_MODEL`, `MISSING_INTEGRATION_EVENT`, `MISSING_SECURITY_POLICY`, `MISSING_OBSERVABILITY_SIGNAL`, `MISSING_TEST_COVERAGE`, `OWNERSHIP_BREACH`, `UI_KIT_BREACH`, `APP_SHELL_BREACH`, `SURFACE_BOUNDARY_BREACH`, `API_BOUNDARY_BREACH`, `BINDING_BOUNDARY_BREACH`, `DUPLICATE_NOISE`, `ORPHAN_DEAD_CANDIDATE`, `RUNTIME_LEAKAGE`, `CONTENT_LEAKAGE`, `TBD`

### Gap Closure Types

A gap does not automatically mean a new screen. It may close through:

`ADD_SCREEN`, `ADD_ROUTE`, `ADD_SHEET`, `ADD_PART`, `ADD_STATE`, `ADD_LINK`, `ADD_CONTRACT_OPERATION`, `ADD_API_TYPE`, `GENERATE_API_CLIENT`, `ADD_BINDING_ADAPTER`, `ADD_RUNTIME_PROVIDER`, `ADD_BACKEND_HANDLER`, `ADD_PERSISTENCE_MODEL`, `ADD_INTEGRATION_EVENT`, `ADD_SECURITY_GUARD`, `ADD_OBSERVABILITY_SIGNAL`, `ADD_TEST`, `MOVE_EXISTING`, `RECLASSIFY`, `EXPOSE_PUBLIC_EXPORT`, `PROMOTE_TO_UI_KIT`, `PROMOTE_TO_APP_SHELL`, `PROMOTE_TO_SURFACE_OWNED`, `REMOVE_DUPLICATE_LATER`, `MARK_TBD`, `BLOCKED`.

---

## 10. Contract, Backend, and Domain State

| Area | Status | Source | Evidence | Notes |
|---|---|---|---|---|
| OpenAPI | `CONTRACT_TBD` | `arb/arb.openapi.yaml` | N/A | Do not add fake endpoints. |
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

Deposits, fees, refunds, settlements, commissions, or any ARB financial effect must pass through WLT only.

---

## 11. Binding, Integration, Runtime State

| Gate | Status | Required Proof | Evidence | Notes |
|---|---|---|---|---|
| UI / UX / Flow | `TBD` | Surface coverage, states, RTL, purpose/CTA, no ownership breach | N/A | No UI-first closure. |
| Binding | `TBD` | Typed client/boundary, actual usage, TypeScript PASS | N/A | First Binding must be small. |
| Integration | `TBD` | Approved contract/event/public interface | N/A | No deep/private integration. |
| Runtime | `TBD` | Runtime mode, provider, happy/failure/recovery path proof | N/A | Fixture/mock/seed is not runtime truth. |
| Backend | `TBD` | handler/service/data/security proof | N/A | Not implied by OpenAPI. |
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
| TypeScript | `TBD` | `pnpm -w exec tsc --noEmit` | N/A |
| Unit/Component | `TBD` | scope-based tests where applicable | N/A |
| Integration/E2E | `TBD` | critical path proof where applicable | N/A |
| Visual/RTL | `TBD` | screenshot/visual proof for UI changes | N/A |
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
| TBD | TBD | TBD | `tools/registry/runs/{SESSION_ID}` | Add only verified evidence. |

### Current Decision

```text
NOT CLOSED
```

### Remaining Risks

- Service state is not closed until evidence proves all required gates.
- API contract may be scaffold/TBD.
- Binding, Integration, Runtime, Backend, Security, Observability, Testing, Performance, Accessibility, and Production Readiness remain `TBD` unless evidence says otherwise.
- No financial behavior may bypass WLT.

### Single Next Action

Lock partner_type and field_type for ARB, then prove booking lifecycle gaps before changing OpenAPI.

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
