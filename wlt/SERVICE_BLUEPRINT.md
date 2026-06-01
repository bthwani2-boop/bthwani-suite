# WLT Service Blueprint

This file is the single truth file for the `wlt` service only.

It must apply the rules from `governance/PLATFORM_BLUEPRINT.md` without duplicating platform-wide policy.

This file owns service-specific facts only: purpose, boundaries, capabilities, surfaces, flows, contracts, status, evidence, risks, and closure.

For platform-wide rules, read:

```text
governance/PLATFORM_BLUEPRINT.md
```

For API contract truth, read:

```text
wlt/wlt.openapi.yaml
```

---

## 1. Service Truth

| Field | Value |
|---|---|
| Service ID | `wlt` |
| Service Name | Wallet / محفظة بثواني |
| Service Type | `FINANCIAL_PLATFORM_SERVICE` |
| Owner Root | `wlt/` |
| Truth File | `wlt/SERVICE_BLUEPRINT.md` |
| OpenAPI Contract | `wlt/wlt.openapi.yaml` |
| Public Export Path | `wlt/index.ts` |
| Current Decision | `NOT CLOSED` |
| Current Status | `SSOT_ALIGNED / COCKPIT_HARDENED / NEEDS_EVIDENCE` |
| Phase F1 Status | `UI_PREVIEW_FOUNDATION / NEEDS_EVIDENCE` |
| Phase F2 Status | `UI_PREVIEW_FOUNDATION / NEEDS_EVIDENCE` |
| Phase F3 Status | `UI_PREVIEW_FOUNDATION / NEEDS_EVIDENCE` |
| Phase F4 Status | `UI_PREVIEW_FOUNDATION / NEEDS_EVIDENCE` |
| Phase F5 Status | `CURRENCY_CLEAN / UI_PREVIEW_FOUNDATION` |
| Phase F6 Status | `CONTRACT_SCAFFOLD / BOUNDARY_LOCKED` |
| Phase F7 Status | `SSOT_ALIGNED / COCKPIT_HARDENED` |
| Evidence Root | `tools/registry/runs/{SESSION_ID}` |

### Blueprint Metadata

id: wlt
name: Wallet
owner: wlt/
public_export_path: wlt/index.ts
screens_matrix: TBD
flow_matrix: TBD
evidence_root: tools/registry/runs/{SESSION_ID}
closure_decision: NOT CLOSED

### Service Purpose

خدمة المحفظة والمسار المالي المركزي: الرصيد، الشحن، الدفع، السداد، التحويل، الإهداء، الاسترداد، التسويات، الدفعات، ledger، reconciliation، exports، والclosures.

---

## 2. Ownership and Boundaries

### Owns

- Service-specific business meaning.
- Service-specific frontend surfaces when present under this service root.
- Service-specific backend scope when present under this service root.
- Service-specific domain rules and models.
- `wlt/wlt.openapi.yaml` contract truth.
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
- `wlt/wlt.openapi.yaml` for this service contract.
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
| `app-client` | Customer: رصيد، شحن، دفع، سداد، تحويل، إهداء رصيد، سجل، استرداد، اشتراكات عند اعتمادها. | runtime / shell / composition only | TBD | N/A |
| `webapp` | Customer Web: وظائف مالية مكافئة وظيفيًا عند النضج. | runtime / shell / composition only | TBD | N/A |
| `app-partner` | Partner: أرباح، دفعات، تسويات، دفتر، محفظة حسب الصلاحيات. | runtime / shell / composition only | TBD | N/A |
| `app-captain` | Captain: أرباح، رصيد، استلام دفعات، تسويات، سداد/محفظة حسب الصلاحيات. | runtime / shell / composition only | TBD | N/A |
| `app-field` | Field Agent: رصيد، دفعات، سداد، محفظة أو مستحقات حسب الصلاحيات. | runtime / shell / composition only | TBD | N/A |
| `control-panel` | Finance/Admin: إدارة ومراقبة مالية فقط، لا قناة مالية مستقلة. | WLT finance preview bound to /finance route (F4) — preview/fixture only | `UI_PREVIEW_FOUNDATION / NEEDS_EVIDENCE` | N/A |

### Owned Capabilities

- Wallet balance
- Top-up
- Payment
- Dues settlement
- Transfer
- Gift balance
- Refunds
- Payouts
- Settlements
- Ledger entries
- Reconciliation
- Batch runs
- Exports
- Financial closures
- Loyalty ledger when approved

### Capability Lock Notes

- Actor capability fields must be enforced by platform/auth/server rules when applicable.
- Partner, captain, and field capabilities must remain role-correct and service-correct.
- Any role or permission not proven by evidence remains `TBD`.

---

## 4. Surface Matrix

| Surface | Ownership Rule | Service Scope | Status | Evidence |
|---|---|---|---|---|
| `app-client` | app owns shell/composition only | Customer: رصيد، شحن، دفع، سداد، تحويل، إهداء رصيد، سجل، استرداد، اشتراكات عند اعتمادها. | TBD | N/A |
| `webapp` | app owns shell/composition only | Customer Web: وظائف مالية مكافئة وظيفيًا عند النضج. | TBD | N/A |
| `app-partner` | app owns shell/composition only | Partner: أرباح، دفعات، تسويات، دفتر، محفظة حسب الصلاحيات. | TBD | N/A |
| `app-captain` | app owns shell/composition only | Captain: أرباح، رصيد، استلام دفعات، تسويات، سداد/محفظة حسب الصلاحيات. | TBD | N/A |
| `app-field` | app owns shell/composition only | Field Agent: رصيد، دفعات، سداد، محفظة أو مستحقات حسب الصلاحيات. | TBD | N/A |
| `control-panel` | app owns shell/composition only | Finance/Admin: إدارة ومراقبة مالية فقط، لا قناة مالية مستقلة. | `UI_PREVIEW_FOUNDATION / NEEDS_EVIDENCE` | N/A |

### App/Shell Rule

Apps may own entry, bootstrap, routing mount, providers, platform config, metadata, and minimal environment wiring.

Apps must not own real `wlt` service screens, business/domain logic, reusable UI families, local design tokens, mock service content, independent i18n/direction ownership, direct backend/API ownership, or deep/private imports.

---

## 5. Operation Registry

| Operation ID | Operation | Business Meaning | Actor | Surface | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `WLT-OP-01` | Wallet balance | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-02` | Top-up | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-03` | Payment | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-04` | Dues settlement | Store settlement statements, account statement impact, and settlement calendar previews | Partner/store finance reviewer | control-panel / app-partner reference | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / MISSING_BACKEND_HANDLER` | N/A |
| `WLT-OP-05` | Transfer | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-06` | Gift balance | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-07` | Refunds | Refund/dispute ledger preview with wallet, settlement, and ledger impact labels | Finance reviewer / support reviewer | control-panel | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / MISSING_BACKEND_HANDLER` | N/A |
| `WLT-OP-08` | Payouts | Payout timing through settlement calendar and account statements | Finance reviewer | control-panel | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / MISSING_BACKEND_HANDLER` | N/A |
| `WLT-OP-09` | Settlements | Store, captain, field, and store-courier settlement cycle previews | Finance reviewer | control-panel | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / MISSING_BACKEND_HANDLER` | N/A |
| `WLT-OP-10` | Ledger entries | Chart of accounts, posting rules, subledger mapping, trial balance, and ledger preview | Finance reviewer | control-panel | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / NOT_IMPLEMENTED_RUNTIME_LEDGER` | N/A |
| `WLT-OP-11` | Reconciliation | Daily close stays a control layer after account details, not the finance system center | Finance reviewer | control-panel | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / MISSING_BACKEND_HANDLER` | N/A |
| `WLT-OP-12` | Batch runs | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-13` | Exports | TBD | TBD | TBD | TBD | N/A |
| `WLT-OP-14` | Financial closures | Audit pack, close status, trial balance, and reconciliation preview only | Finance reviewer / checker | control-panel | `CONTRACT_SCAFFOLD_PREVIEW_ONLY / MISSING_BACKEND_HANDLER` | N/A |
| `WLT-OP-15` | Loyalty ledger when approved | TBD | TBD | TBD | TBD | N/A |

### Operation Rules

- No operation becomes contract truth until it appears in the Screen/API Matrix and Gap Map.
- No operation becomes runtime truth until runtime evidence exists.
- No operation becomes closed until all required gates pass.

---

## 6. Journey and Lifecycle Map

### Primary Lifecycle

```text
Financial intent → WLT authorization/eligibility → balance/payment/settlement operation → ledger entry → reconciliation path → surface update → control-panel monitoring → closure/export as required.
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
| `WLT-INV-TBD` | TBD | TBD | TBD | TBD | loading / empty / error / success / offline / disabled / pending / retry / blocked | TBD | TBD | N/A |

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
| `WLT-FLOW-01` | `/cart` or `/wallet` (Client) | `WalletBalance` (balance, frozen) | `getClientWalletSummary` | `/wlt/dsh/client/wallet/summary` (GET) | `MISSING_API_CLIENT` | `UI_PREVIEW_ONLY` | `WLT-EVD-F2-CP` |
| `WLT-FLOW-02` | `/checkout` (Client) | `PaymentIntent` status and code | `createClientPaymentIntent` | `/wlt/dsh/client/payment-intents` (POST) | `MISSING_BACKEND_HANDLER` | `CONTRACT_TBD` | `N/A` |
| `WLT-FLOW-03` | `/wallet/recharge` (Client) | `TopUpIntent` and redirect URL | `createClientTopUpIntent` | `/wlt/dsh/client/top-up-intents` (POST) | `MISSING_BACKEND_HANDLER` | `CONTRACT_TBD` | `N/A` |
| `WLT-FLOW-04` | `DshCaptainFinanceScreen` (Captain) | `CaptainEligibilityBalance` | `getCaptainEligibility` | `/wlt/dsh/captain/eligibility` (GET) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F3-CAPTAIN` |
| `WLT-FLOW-05` | `DshCaptainFinanceScreen` (Captain) | Array of `CodLiability` | `getCaptainCodLiabilities` | `/wlt/dsh/captain/cod-liabilities` (GET) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F3-CAPTAIN` |
| `WLT-FLOW-06` | `DshCaptainFinanceScreen` (Captain) | Array of `LedgerEntry` | `getCaptainEarnings` | `/wlt/dsh/captain/earnings` (GET) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F3-CAPTAIN` |
| `WLT-FLOW-07` | `/finance` / `settlements` (CP) | Array of `PartnerSettlementCycle` | `getPartnerSettlementCycles` | `/wlt/dsh/partner/settlement-cycles` (GET) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F4-CP` |
| `WLT-FLOW-08` | `/finance` / `ledger` (CP) | Array of `FieldCommission` | `getFieldCommissions` | `/wlt/dsh/field/commissions` (GET) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F4-CP` |
| `WLT-FLOW-09` | `/finance` / `overview` (CP) | Aggregate `MoneyAmount` | `getControlPanelFinanceOverview` | `/wlt/dsh/control-panel/finance/overview` (GET) | `MISSING_API_CLIENT` | `UI_PREVIEW_ONLY` | `WLT-EVD-F7-CP` |
| `WLT-FLOW-10` | `/finance` / `risk-audit` (CP) | Array of `ReconciliationRun` | `listReconciliationRuns` | `/wlt/dsh/control-panel/reconciliation-runs` (GET/POST) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F7-CP` |
| `WLT-FLOW-11` | `/finance` / `payouts` (CP) | status confirmation | `createPayoutDecision` | `/wlt/dsh/control-panel/payout-decisions` (POST) | `MISSING_BACKEND_HANDLER` | `CONTRACT_TBD` | `N/A` |
| `WLT-FLOW-12` | `/finance` / `risk-audit` (CP) | Array of `AuditEvent` | `listAuditEvents` | `/wlt/dsh/control-panel/audit-events` (GET) | `MISSING_BACKEND_HANDLER` | `UI_PREVIEW_ONLY` | `WLT-EVD-F7-CP` |
| `WLT-FLOW-13` | `/finance` / `financial-center` (CP) | Account-first finance center | `getControlPanelFinanceCenter` | `/wlt/dsh/control-panel/finance-center` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-14` | `/finance` / `store-settlements` (CP) | Store settlement statements with order rows | `listStoreSettlementStatements` | `/wlt/dsh/control-panel/store-settlement-statements` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-15` | `/finance` / `account-statements` (CP) | Account statements by financial actor | `listControlPanelAccountStatements` | `/wlt/dsh/control-panel/account-statements` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-16` | `/finance` / `ledger` (CP) | Chart of accounts metadata | `listChartOfAccounts` | `/wlt/dsh/control-panel/chart-of-accounts` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-17` | `/finance` / `ledger` (CP) | Subledger balances and control account mapping | `listSubledgerBalances` | `/wlt/dsh/control-panel/subledger-balances` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-18` | `/finance` / `ledger` (CP) | Posting rule previews | `listPostingRules` | `/wlt/dsh/control-panel/posting-rules` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-19` | `/finance` / `ledger` (CP) | Trial balance preview | `getTrialBalance` | `/wlt/dsh/control-panel/trial-balance` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-20` | `/finance` / `settlement-calendar` (CP) | Settlement cycle calendar | `listSettlementCalendar` | `/wlt/dsh/control-panel/settlement-calendar` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-21` | `/finance` / `refund-ledger` (CP) | Refund and dispute ledger preview | `listRefundLedger` | `/wlt/dsh/control-panel/refund-ledger` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |
| `WLT-FLOW-22` | `/finance` / `risk-audit` (CP) | Audit pack preview | `getAuditPack` | `/wlt/dsh/control-panel/audit-pack` (GET) | `MISSING_BACKEND_HANDLER` | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | N/A |

### Screen/API Rules

- No OpenAPI change without a documented gap.
- No endpoint without screen/flow need.
- No schema without usage demand.
- OpenAPI existence means contract exists only; it does not prove Binding, Integration, Runtime, or service closure.

---

## 9. Gap Map

| Gap ID | Gap Type | Affected Flow | Surface / Layer | Expected | Current | Impact | Priority | Closure Type | Target Owner Path | Blocked By | Verification Gate | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `WLT-GAP-01` | `MISSING_API_CLIENT` | All flows (`WLT-FLOW-01` to `12`) | DSH Binding Layer / API Clients | Autogenerated typed clients from `wlt.openapi.yaml` | UI maps directly to seeds/fixtures without client | No real runtime binding possible | High | `GENERATE_API_CLIENT` | `wlt/` | None | TypeScript compilation check | N/A |
| `WLT-GAP-02` | `MISSING_BACKEND_HANDLER` | Wallet summaries & intents (`WLT-FLOW-01`, `02`, `03`) | WLT Backend Service / Go Ledger | Functional wallet balances, charge capture, and refund endpoints in Go | Go backend for WLT is not built; endpoints return scaffold preview only | No real money mutations can be executed | High | `ADD_BACKEND_HANDLER` | `wlt/` | None | Backend integration tests | N/A |
| `WLT-GAP-03` | `MISSING_BACKEND_HANDLER` | Captain eligibility and COD (`WLT-FLOW-04`, `05`, `06`) | WLT Backend Service / Go Ledger | Go database mapping of outstanding captain cash liabilities | No database model or handler implemented | Captain eligibility is mock-based | Medium | `ADD_BACKEND_HANDLER` | `wlt/` | `WLT-GAP-02` | Captain workflow E2E test | N/A |
| `WLT-GAP-04` | `MISSING_BACKEND_HANDLER` | Partner settlement and field commissions (`WLT-FLOW-07`, `08`) | WLT Backend Service / Go Ledger | Automated Go cycles that aggregate partner order net sums every 7 days | No batch processing or Go model exists | Settlements cycle displays static seeds | Medium | `ADD_BACKEND_HANDLER` | `wlt/` | `WLT-GAP-02` | Settlements integration test | N/A |
| `WLT-GAP-05` | `MISSING_BACKEND_HANDLER` | Reconciliation runs, payout decisions, audit events (`WLT-FLOW-10`, `11`, `12`) | WLT Backend Service / Go Ledger | Functional ledger discrepancies checks and payout mutation controls | Audit events and payout decisions are preview-only | Control panel commands are simulated | High | `ADD_BACKEND_HANDLER` | `wlt/` | `WLT-GAP-02` | Audit trail compliance test | N/A |
| `WLT-GAP-06` | `MISSING_BACKEND_HANDLER` | Account-first finance contracts (`WLT-FLOW-13` to `22`) | WLT Backend Service / Go Ledger | Real account statements, store settlement statements, subledger balances, posting rules, trial balance, settlement calendar, refund ledger, and audit packs from WLT runtime | Preview contracts and static read models only | Staff can inspect intended financial shape but cannot rely on runtime truth | High | `ADD_BACKEND_HANDLER` | `wlt/` | `WLT-GAP-02` | WLT finance integration and accounting invariants test | N/A |

### Allowed Gap Types

`MISSING_SCREEN`, `MISSING_ROUTE`, `MISSING_SHEET_DRAWER`, `MISSING_STATE`, `MISSING_LINK`, `MISSING_COUNTERPART_SURFACE`, `MISSING_CONTRACT`, `MISSING_API_TYPE`, `MISSING_API_CLIENT`, `MISSING_BINDING_ADAPTER`, `MISSING_RUNTIME_PROVIDER`, `MISSING_BACKEND_HANDLER`, `MISSING_PERSISTENCE_MODEL`, `MISSING_INTEGRATION_EVENT`, `MISSING_SECURITY_POLICY`, `MISSING_OBSERVABILITY_SIGNAL`, `MISSING_TEST_COVERAGE`, `OWNERSHIP_BREACH`, `UI_KIT_BREACH`, `APP_SHELL_BREACH`, `SURFACE_BOUNDARY_BREACH`, `API_BOUNDARY_BREACH`, `BINDING_BOUNDARY_BREACH`, `DUPLICATE_NOISE`, `ORPHAN_DEAD_CANDIDATE`, `RUNTIME_LEAKAGE`, `CONTENT_LEAKAGE`, `TBD`

### Gap Closure Types

A gap does not automatically mean a new screen. It may close through:

`ADD_SCREEN`, `ADD_ROUTE`, `ADD_SHEET`, `ADD_PART`, `ADD_STATE`, `ADD_LINK`, `ADD_CONTRACT_OPERATION`, `ADD_API_TYPE`, `GENERATE_API_CLIENT`, `ADD_BINDING_ADAPTER`, `ADD_RUNTIME_PROVIDER`, `ADD_BACKEND_HANDLER`, `ADD_PERSISTENCE_MODEL`, `ADD_INTEGRATION_EVENT`, `ADD_SECURITY_GUARD`, `ADD_OBSERVABILITY_SIGNAL`, `ADD_TEST`, `MOVE_EXISTING`, `RECLASSIFY`, `EXPOSE_PUBLIC_EXPORT`, `PROMOTE_TO_UI_KIT`, `PROMOTE_TO_APP_SHELL`, `PROMOTE_TO_SURFACE_OWNED`, `REMOVE_DUPLICATE_LATER`, `MARK_TBD`, `BLOCKED`.

---

## 10. Contract, Backend, and Domain State

| Area | Status | Source | Evidence | Notes |
|---|---|---|---|---|
| OpenAPI | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | `wlt/wlt.openapi.yaml` | N/A | Preview-only WLT finance contracts exist; backend/runtime is not implemented. |
| API Types | `TBD` | TBD | N/A | Must follow contract generate/verify. |
| API Client / Typed Boundary | `TBD` | TBD | N/A | Required before Binding PASS. |
| Backend Handler | `NOT_IMPLEMENTED` | TBD | N/A | No backend claim without implementation evidence. |
| Persistence Model | `NOT_IMPLEMENTED` | TBD | N/A | No data claim without evidence. |
| Domain Model | `CONTRACT_SCAFFOLD_PREVIEW_ONLY` | `wlt/frontend/control-panel/dsh/*` | N/A | Service-owned preview read models only. |
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

WLT is the only financial path for the entire platform. No service, surface, route, endpoint, job, webhook, or control-panel finance route may create financial effects outside WLT contracts.

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
| WLT-EVD-F2-CP | Client payment preview binding (F2) | `UI_PREVIEW_FOUNDATION` | `wlt/frontend/app-client/dsh/WltDshClientPaymentPreview.tsx` | preview/fixture only |
| WLT-EVD-F3-CAPTAIN | Captain finance preview (F3) | `UI_PREVIEW_FOUNDATION` | `wlt/frontend/app-captain/dsh/WltDshCaptainFinancePreview.tsx` | preview/fixture only |
| WLT-EVD-F3-FIELD | Field finance preview (F3) | `UI_PREVIEW_FOUNDATION` | `wlt/frontend/app-field/dsh/WltDshFieldFinancePreview.tsx` | preview/fixture only |
| WLT-EVD-F4-CP | Control-panel finance preview enhanced + bound to /finance (F4) | `UI_PREVIEW_FOUNDATION` | `wlt/frontend/control-panel/dsh/WltDshFinanceControlPanelPreview.tsx` | preview/fixture only; ControlPanelDshFinanceHubScreen bound in ControlPanelSurfaceHost as presentation host |
| WLT-EVD-F5-CP | Yemen context and currency formatting clean (F5) | `CURRENCY_CLEAN` | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | Clean YER/ar-YE enforcement |
| WLT-EVD-F6-CP | OpenAPI contract scaffold and paths (F6) | `SCAFFOLD` | `wlt/wlt.openapi.yaml` | 14 paths + 13 schemas |
| WLT-EVD-F7-CP | DSH Control-Panel Realignment and Cockpit Hardening (F7) | `SSOT_ALIGNED` | `dsh/frontend/control-panel/finance/FinanceHubScreen.tsx` | Dynamic adapter, 6 states, block alerts |

### Current Decision

```text
NOT CLOSED
```

### Remaining Risks

- Service state is not closed until evidence proves all required gates.
- API contract may be scaffold/TBD.
- Binding, Integration, Runtime, Backend, Security, Observability, Testing, Performance, Accessibility, and Production Readiness remain `TBD` unless evidence says otherwise.
- No financial behavior may bypass WLT.

### Phase F1 Evidence Record (2026-05-09)

| Item | File | Status |
| --- | --- | --- |
| WLT-owned DSH finance preview model created | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `UI_PREVIEW_FOUNDATION` |
| Deep cross-package import removed from PartnerDshWalletBridgeView | `wlt/frontend/app-partner/dsh/PartnerDshWalletBridgeView.tsx` | `BOUNDARY_FIXED` |
| Arabic label for selected state | `wlt/frontend/app-client/dsh/WltDshPaymentOptionsRow.tsx` | `FIXED` |
| Control-panel finance preview component added | `wlt/frontend/control-panel/dsh/WltDshFinanceControlPanelPreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| TSC result | pnpm -w exec tsc --noEmit | `PASS` |
| OpenAPI contract | `wlt/wlt.openapi.yaml` | `CONTRACT_TBD — NOT CHANGED` |
| All amounts | integer minor units (amountMinorUnits), no float — currency: YER / ريال يمني | `ENFORCED` |

Classification: preview/fixture only. Not runtime truth. Not production-ready. Not closed.

### Phase F2 Evidence Record (2026-05-09)

| Item | File | Status |
| --- | --- | --- |
| WLT payment options preview component created | `wlt/frontend/app-client/dsh/WltDshClientPaymentPreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| WLT model extended: WltDshPaymentMethod, WltDshPaymentPreviewState, payment option helpers | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `UI_PREVIEW_FOUNDATION` |
| DSH checkout uses WLT-owned finance event kind resolver | `dsh/frontend/app-client/DshCartUnifiedScreen.tsx` | `BOUNDARY_FIXED` |
| TSC result | `pnpm -w exec tsc --noEmit` | `PASS` |
| OpenAPI contract | `wlt/wlt.openapi.yaml` | `CONTRACT_TBD — NOT CHANGED` |

Classification: preview/fixture only. Not runtime truth. Not production-ready. Not closed.

### Phase F3 Evidence Record (2026-05-09)

| Item | File | Status |
| --- | --- | --- |
| WLT captain finance preview component created | `wlt/frontend/app-captain/dsh/WltDshCaptainFinancePreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| WLT field finance preview component created | `wlt/frontend/app-field/dsh/WltDshFieldFinancePreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| WLT model extended: WltCaptainFinanceSnapshot, WltPartnerFinanceSnapshot, WltFieldFinanceSnapshot | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `UI_PREVIEW_FOUNDATION` |
| DSH captain finance screen uses WLT-owned preview | `dsh/frontend/app-captain/DshCaptainFinanceScreen.tsx` | `BOUNDARY_FIXED` |
| DSH field finance screen uses WLT-owned preview | `dsh/frontend/app-field/DshFieldFinanceScreen.tsx` | `BOUNDARY_FIXED` |
| TSC result | `pnpm -w exec tsc --noEmit` | `PASS` |
| OpenAPI contract | `wlt/wlt.openapi.yaml` | `CONTRACT_TBD — NOT CHANGED` |

Classification: preview/fixture only. Not runtime truth. Not production-ready. Not closed.

### Phase F4 Evidence Record (2026-05-09)

| Item | File | Status |
| --- | --- | --- |
| Control-panel finance preview enhanced: client wallet/COD breakdown, captain COD/earnings, field commission/payout | `wlt/frontend/control-panel/dsh/WltDshFinanceControlPanelPreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| ControlPanelDshFinanceHubScreen acts as host to /finance route in DSH, dynamically mapping WLT seeds | `control-panel/shell/ControlPanelSurfaceHost.tsx` | `UI_PREVIEW_FOUNDATION` |
| Finance route confirmed: /finance → section="finance" → ControlPanelDshFinanceHubScreen | `control-panel/runtime/app/finance/page.tsx` | `ROUTE_CONFIRMED_PREVIEW_ONLY` |
| TSC result | `pnpm -w exec tsc --noEmit` | `PASS` |
| OpenAPI contract | `wlt/wlt.openapi.yaml` | `CONTRACT_TBD — NOT CHANGED` |
| Real finance blocked until | contract / backend / security / audit / idempotency / ledger | `BLOCKED` |

Classification: preview/fixture only. Not runtime truth. Not production-ready. Not closed.

### Phase F5 Evidence Record (2026-05-16)

| Item | File | Status |
| --- | --- | --- |
| Currency: ALL `halalas`/`SAR`/`ar-SA`/`ر.س` removed from WLT/DSH finance scope | All files in scope | `CURRENCY_CLEAN` |
| Renamed `amountHalalas` → `amountMinorUnits` throughout (halalas = Saudi subunit, not YER) | `wlt-dsh-client.adapter`, `useWltDshWalletPreview`, `dshFinancePreview.ts` | `FIXED` |
| Central `formatYer(minorUnits)` with `ar-YE` locale + safe fallback replacing Saudi formatter | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `FIXED` |
| `formatWltYer` alias exported for UI use | `wlt/frontend/control-panel/dsh/financeContracts.ts` | `FIXED` |
| Captain eligibility balance section: current balance, minimum, shortfall, recharge CTA | `wlt/frontend/app-captain/dsh/WltDshCaptainFinancePreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| COD reframed as ذمة مستحقة (liability) not balance | `wlt/frontend/app-captain/dsh/WltDshCaptainFinancePreview.tsx` | `FIXED` |
| Captain finance sections: eligibility / cod-liability / earnings / settlement | `wlt/frontend/app-captain/dsh/wlt-dsh-captain.adapter.ts` | `FIXED` |
| Partner finance: gross sales / platform commission / deductions / net settlement / cycle | `wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx` | `UI_PREVIEW_FOUNDATION` |
| Field commissions: approved / pending / rejected with holdReason and payout records | `wlt/frontend/app-field/dsh/WltDshFieldFinancePreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| Client payment preview: COD / wallet / mixed / official-wallets with balance states | `wlt/frontend/app-client/dsh/WltDshClientPaymentPreview.tsx` | `UI_PREVIEW_FOUNDATION` |
| DSH finance model converted to LEGACY_BRIDGE (re-exports WLT types only, no financial logic) | `dsh/frontend/shared/dshFinancePreviewModel.ts` | `BOUNDARY_FIXED` |
| DSH control panel: captain-eligibility group added to finance registry and hub | `dsh/frontend/control-panel/finance/finance.registry.ts` | `UI_PREVIEW_FOUNDATION` |
| DSH control panel: `FINANCE_ACTIVE_GROUPS` excludes tax-compliance (no Yemen policy) | `dsh/frontend/control-panel/finance/finance.registry.ts` | `FIXED` |
| DSH control panel KPIs: live YER values from `getWltControlPanelFinancePreview()` | `dsh/frontend/control-panel/finance/FinanceHubScreen.tsx` | `FIXED` |
| WLT control panel: CSS module replacing inline styles (no hardcoded colors) | `wlt/frontend/control-panel/dsh/wlt-finance-control-panel.module.css` | `FIXED` |
| WltCaptainFinanceSnapshot expanded: eligibility balance, minimum, shortfall, block reason | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `UI_PREVIEW_FOUNDATION` |
| WltPartnerFinanceSnapshot expanded: full settlement cycle breakdown | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `UI_PREVIEW_FOUNDATION` |
| WltFieldFinanceSnapshot expanded: pending/rejected records, payout date | `wlt/frontend/control-panel/dsh/dshFinancePreview.ts` | `UI_PREVIEW_FOUNDATION` |
| SERVICE_BLUEPRINT halalas → amountMinorUnits / YER fix | `wlt/SERVICE_BLUEPRINT.md` | `FIXED` |
| TSC result | `pnpm -w exec tsc --noEmit` | `PASS — EXIT 0` |
| Currency scan | All WLT/DSH finance files | `CLEAN — 0 SAR/ر.س/ar-SA/halalas` |
| Evidence session | `tools/registry/runs/DSH_WLT_YEMEN_FINANCE_CLOSURE-20260516-155044/` | `COMPLETE` |
| OpenAPI contract | `wlt/wlt.openapi.yaml` | `CONTRACT_TBD — NOT CHANGED` |

Classification: preview/fixture only. Not runtime truth. Not production-ready. Not closed.

---

## Phase F6 — Yemen Context + Contract Scaffold + Boundary Lock

**Session:** DSH_WLT_FINANCE_REMAINING_CLOSURE-20260516-234559
**Date:** 2026-05-16
**Scope:** DSH/WLT/UI-kit visible context cleanup, WLT OpenAPI scaffold, WLT-only boundary

### Phase F6 Summary

This phase closes the remaining gaps left after Phase F5 preview closure:

1. Saudi currency/context tokens removed from all DSH frontend files (previously missed by F5 scope)
2. Minor-unit naming violations renamed in dsh-client-binding contracts and CartScreen
3. WLT OpenAPI scaffold built with paths, schemas, and idempotency documentation
4. WLT-only financial ownership boundary locked in contract
5. ui-kit card.tsx default currency/locale corrected to Yemen context

**NOT CLOSED in this phase:**

- Runtime backend/ledger: NOT IMPLEMENTED
- Idempotency enforcement: NOT IMPLEMENTED
- Security/auth: NOT IMPLEMENTED
- Reconciliation engine: NOT IMPLEMENTED
- Production financial closure: NOT CLOSED

### Phase F6 Classification

| Item | Status |
| --- | --- |
| Saudi currency/context tokens in DSH frontend | CLOSED — scan zero |
| Minor-unit naming cleanup (contracts + CartScreen) | CLOSED — scan zero |
| WLT OpenAPI scaffold (paths + schemas) | CLOSED — scaffold present |
| WLT-only financial ownership boundary | CLOSED — contract + blueprint locked |
| ui-kit card default currency/locale | CLOSED — ar-YE / YER |
| Runtime/backend ledger | NOT IMPLEMENTED |
| Idempotency enforcement | NOT IMPLEMENTED |
| Security/auth layer | NOT IMPLEMENTED |
| Reconciliation engine | NOT IMPLEMENTED |
| Production financial closure | NOT CLOSED |

### Phase F6 Evidence Record

| Item | File | Status |
| --- | --- | --- |
| Saudi currency/context tokens removed from 9 DSH frontend files | dsh/frontend/** | `CLEAN` |
| Saudi locale (ar-SA) replaced with ar-YE in DSH partner/field/client files | dsh/frontend/** | `FIXED` |
| Minor-unit naming renamed in dsh-client-binding.contracts.ts (17 fields) | dsh/frontend/app-client/contracts/ | `FIXED` |
| Minor-unit naming renamed in CartScreen.tsx (types + local vars + function) | dsh/frontend/app-client/screens/ | `FIXED` |
| topUpWalletInline marked PREVIEW_ONLY explicitly | dsh/frontend/app-client/screens/CartScreen.tsx | `FIXED` |
| ui-kit card.tsx: ar-SA → ar-YE, SAR default → YER default | ui-kit/src/components/card.tsx | `FIXED` |
| CartDetails.tsx: ar-SA → ar-YE | dsh/frontend/app-client/parts/CartDetails.tsx | `FIXED` |
| WLT OpenAPI scaffold: 14 paths + 13 schemas + idempotency param | wlt/wlt.openapi.yaml | `SCAFFOLD` |
| WLT contract state: CONTRACT_SCAFFOLD_PREVIEW_ONLY | wlt/wlt.openapi.yaml | `FIXED` |
| WLT currency default: YER | wlt/wlt.openapi.yaml | `FIXED` |
| WLT ownership declaration in OpenAPI | wlt/wlt.openapi.yaml | `FIXED` |
| Evidence session | tools/registry/runs/DSH_WLT_FINANCE_REMAINING_CLOSURE-20260516-234559/ | `COMPLETE` |

---

## Phase F7 — Control-Panel Finance SSoT Realignment & Hardening

**Session:** DSH_WLT_FINANCE_SSOT_REALIGNMENT-20260601-050000
**Date:** 2026-06-01
**Scope:** Dynamic WLT SSoT adapter, removal of duplicate/hardcoded finance rows, Captain mobile app type correction (`cod-balance` -> `cod-liability`), upgraded cockpit header, 6 comprehensive view states, and blocked action feedback drawers.

### Phase F7 Summary

This phase accomplishes the final SSoT realignment and hardening for DSH control-panel finance interfaces:

1. **Dynamic SSoT Adapter & Duplicate Elimination**: Removed the hardcoded duplicate `FINANCE_ROWS` and mapped DSH finance screens to WLT `PREVIEW_SEEDS` dynamically via `getAdaptedFinanceControlPanelRows()` adapter in `wallet.preview-data.ts`.
2. **Captain Mobile Typings Resolved**: Corrected type violations in the Captain App where `'cod-balance'` was invalidly passed instead of `'cod-liability'` (`DshCaptainFinanceScreen.tsx`).
3. **Dense Premium Cockpit**: Designed a highly detailed command bar inside the Hub, showcasing Yemeni Rial (YER) indicators, synchronization status, and explicit financial ownership boundaries.
4. **Complete View States**: Replaced standard loaders with 6 rich screen states (`ready`, `loading`, `empty`, `error`, `offline`, `disabled`) with custom Arabic graphics and CTAs.
5. **No Silent Failures**: Replaced all empty interactive handlers with beautiful explicit warning notifications inside the Inspector drawer explaining the `CONTRACT_TBD` financial boundaries.

**NOT CLOSED in this phase:**
- Runtime backend/ledger: NOT IMPLEMENTED
- Idempotency enforcement: NOT IMPLEMENTED
- Security/auth layer: NOT IMPLEMENTED
- Reconciliation engine: NOT IMPLEMENTED
- Production financial closure: NOT CLOSED (Requires actual WLT engine implementation)

### Phase F7 Classification

| Item | Status |
| --- | --- |
| Dynamic WLT SSoT adapter mapping | CLOSED — 100% dynamic mapping |
| Elimination of duplicate hardcoded data rows | CLOSED — scan zero duplicates |
| Captain mobile app finance typings | CLOSED — type-safe |
| Cockpit visual density and YER indicator | CLOSED — premium cockpit |
| Full 6 view states coverage | CLOSED — 100% state coverage |
| Mutation button click handlers (No silent failures) | CLOSED — Warning alert integrated |
| Runtime/backend ledger | NOT IMPLEMENTED |
| Idempotency enforcement | NOT IMPLEMENTED |
| Security/auth layer | NOT IMPLEMENTED |
| Reconciliation engine | NOT IMPLEMENTED |
| Production financial closure | NOT CLOSED |

### Phase F7 Evidence Record

| Item | File | Status |
| --- | --- | --- |
| Dynamic adapter for WLT seeds to DSH rows | `dsh/frontend/data/wallet.preview-data.ts` | `CLOSED` |
| Removal of hardcoded finance rows | `dsh/frontend/data/wallet.preview-data.ts` | `CLOSED` |
| Correction of `cod-balance` to `cod-liability` | `dsh/frontend/app-captain/screens/DshCaptainFinanceScreen.tsx` | `CLOSED` |
| Upgraded control-room header & metrics | `dsh/frontend/control-panel/finance/FinanceHubScreen.tsx` | `CLOSED` |
| 6 state view handlers with Arabic messaging | `dsh/frontend/control-panel/finance/FinanceHubScreen.tsx` | `CLOSED` |
| Interactive warning panel for blocked mutations | `dsh/frontend/control-panel/finance/FinanceHubScreens.tsx` | `CLOSED` |
| TSC Type Check validation | `pnpm -w exec tsc --noEmit` | `PASS — EXIT 0` |

### Single Next Action

Create/verify WLT contract truth and WLT-only financial boundary before enabling money-related behavior in any other service.

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
