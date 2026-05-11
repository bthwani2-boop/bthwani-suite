# BThwani DSH Final Reality Analysis & Closure Rewrite

**Date:** 2026-05-12
**Target branch:** `ghb/0129-20260512-002932-app-captain-app-client-app-field`
**Repo:** `bthwani2-boop/bthwani-suite` / `C:\bthwani-suite`
**Mode:** READ-ONLY analysis + rewritten decision document
**Scope:** DSH service across `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, WLT bridge, backend/domain/API.

---

## 1. Executive Decision

DSH is **not closed 100% as a full delivery service** on the current branch.

The current branch **does materially improve the previous state** by closing the mobile frontend registry/classification scope for `app-client`, `app-partner`, `app-captain`, and `app-field` as **preview-only**. However, the current evidence still blocks any claim of runtime, API, backend, domain, WLT ledger, or production readiness closure.

The accurate status is:

```text
DSH_MOBILE_PREVIEW_SCOPE_CLOSED_WITH_WARNINGS
DSH_FRONTEND_STANDARDIZATION_ADVANCED
DSH_RUNTIME_UNPROVEN
DSH_CONTRACT_TBD
DSH_BACKEND_SCAFFOLD_ONLY
DSH_DOMAIN_TBD
DSH_WLT_LEDGER_RUNTIME_NOT_CLOSED
DSH_FINAL_100_CLOSURE_BLOCKED
```

The current branch should be described as:

```text
Mobile frontend preview closure has improved and closed the registry/classification gate for the four mobile apps.
Full DSH service closure remains blocked by runtime, API, backend, domain, WLT ledger, visual evidence, and production-readiness gates.
```

Do **not** describe it as:

```text
DSH is 100% complete.
DSH is production-ready.
DSH runtime is closed.
DSH API is ready.
DSH wallet settlement is implemented.
DSH backend is implemented.
```

---

## 2. What Changed Since the Previous Analysis

The prior branch `ghb/0128-20260511-034906-dsh` was mostly a DSH frontend standardization checkpoint with multiple open mobile gaps.

The current branch `ghb/0129-20260512-002932-app-captain-app-client-app-field` adds a significant gate:

```text
DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555
```

The improvement is real, but its scope is narrow:

| Area | Previous practical state | Current branch state | Interpretation |
|---|---|---|---|
| Mobile registries | Some mobile registry rows/gates still unresolved | No `UNPROVEN` rows in the four targeted mobile registries according to the mobile closure doc | Preview registry closure improved |
| app-partner | P6/gate pending language | Partner mobile gate is now reported closed for preview-only scope | Better, but still not runtime |
| app-captain | assignment/pickup/dropoff/PoD unproven | registry is verified; finance copy moved to WLT helpers | UI ownership improved, delivery runtime still unproven |
| app-field | finance/onboarding/visit needed classification | field registry/classification now explicit | Better classification, runtime still unproven |
| WLT bridge | conceptually understood | partner/captain/field WLT bridge metadata/helpers expanded | Better boundary, no ledger runtime yet |
| API/OpenAPI | empty | still empty | unchanged blocker |
| Backend/domain | scaffold/TBD | still scaffold/TBD | unchanged blocker |
| Runtime evidence | unproven | still unproven | unchanged blocker |
| Visual evidence | incomplete | still not complete; runtime smoke skipped | unchanged blocker |

The branch therefore **closes a mobile preview governance layer**, not the delivery service itself.

---

## 3. Evidence-Based Current State

### 3.1 Service Blueprint status

`dsh/SERVICE_BLUEPRINT.md` now declares:

```text
Current Decision: DSH_MOBILE_APPS_FINAL_CLOSURE_GATE_CLOSED_PREVIEW_ONLY
Current Status: MOBILE_PREVIEW_CLOSURE_COMPLETED
Evidence Root: tools/registry/runs/DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555
```

This is an improvement, but the same blueprint still explicitly classifies the major surfaces as:

```text
UI_PREVIEW_ONLY
```

It also keeps:

```text
screens_matrix: NEEDS_EVIDENCE
flow_matrix: NEEDS_EVIDENCE
```

And the operation registry still keeps DSH operations as:

```text
NEEDS_BINDING_LATER
```

This means the branch cannot be treated as final service closure.

### 3.2 Mobile final closure report

`dsh/docs/DSH_MOBILE_APPS_FINAL_CLOSURE.md` reports the following gate results:

```text
TypeScript: PASS
Diff whitespace: PASS
UNPROVEN registry rows: PASS
export * in scoped mobile surface: PASS
core ownership tokens: PASS
Runtime smoke: SKIPPED
```

The key line is:

```text
Runtime smoke: SKIPPED — no active mobile runtime session was available in this gate.
```

The same document says:

```text
No backend, API, OpenAPI, dependency, route-semantics, label/value, or media changes were introduced in this gate.
```

Therefore, this gate is valid only as **mobile preview closure**.

### 3.3 UI/UX/Flow Closure Matrix

`dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` still says:

```text
Status: ACTIVE_CLOSURE_CONTROL
Decision: NOT_CLOSED
screen_file_count: 67
giant_screen_candidates: 5
visual_evidence_gaps: 15
tbd_flow_mappings: 10
```

It also defines the required closure rule:

A DSH UI/UX/Flow row is not closed until it has:

```text
surface ownership proof
route/host proof
screen/file proof
primary CTA
state coverage
RTL/visual proof where visible UI exists
UI kit boundary proof
runtime evidence or explicit runtime blocker
evidence path
```

This matrix still blocks final 100% UI/UX/Flow closure.

### 3.4 Runtime Matrix

`dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` still declares:

```text
Decision: RUNTIME_UNPROVEN
```

It explicitly says current UI work must stay preview-only unless runtime evidence is proven later.

The closure rule remains:

```text
Runtime is PASS only when source, provider, happy path, failure path, recovery path, and evidence are proven.
```

No evidence in this branch proves that.

### 3.5 OpenAPI and backend

`dsh/dsh.openapi.yaml` remains:

```yaml
x-bthwani-status: CONTRACT_TBD
paths: {}
components:
  schemas: {}
```

`dsh/backend/src/contracts.ts` remains an empty contract record:

```ts
export type DshBackendContracts = Readonly<Record<string, never>>;
export const dshBackendContracts: DshBackendContracts = {};
```

This means:

```text
No real DSH API contract exists.
No DSH backend contract exists.
No DSH runtime backend behavior is proven.
```

---

## 4. Updated Surface-Level Verdict

| Surface / Layer | Current verdict on branch `0129` | What improved | Still missing / blocking |
|---|---|---|---|
| `app-client` | Strongest mobile customer frontend; preview registry/reference remains closed | route/screen registry is verified; classification is broad; app-client has the most complete customer journey inventory | visual evidence, runtime source, checkout/WLT runtime, rating/support standalone proof, real order lifecycle binding |
| `app-partner` | Improved from “pending” to preview-closed registry/classification | partner registry rows verified; finance/wallet copy routed behind WLT helpers; no `core` ownership or broad exports in scoped gate | real incoming-order lifecycle, accept/reject/prep/ready runtime, availability/item exception persistence, partner payout/settlement binding |
| `app-captain` | Improved preview closure, but not delivery runtime closure | captain registry verified; captain map boundary maintained; finance chrome routed to WLT helpers | assignment engine, accept/reject, pickup verification, dropoff verification, Proof of Delivery, exception flow, earnings/payout runtime |
| `app-field` | Improved preview classification and public export hardening | field registry verified; app-field index/composition export rules cleaned; WLT bridge ownership explicit | onboarding persistence, visit evidence, approval handoff to control-panel/partner runtime, field finance runtime, audit trail |
| `control-panel` | operations preview remains the strongest web/admin piece | command-center preview exists and remains the closest control-room candidate | live dispatch backend, exception queue runtime, support timeline, manual action audit, finance/settlement oversight runtime |
| WLT bridge | stronger boundary, still preview | partner/captain/field WLT helpers and metadata made explicit; DSH financial copy moved out of DSH host surfaces | ledger events, split settlement, payout, refund, chargeback, transfer reversal/adjustment runtime |
| backend/domain/API | still not closed | no meaningful improvement in this gate by design | OpenAPI paths/schemas, backend handlers, domain rules, persistence, auth/RBAC, observability |

---

## 5. Critical Missing Logic by Application

### 5.1 app-client — Customer app

Current state:

```text
Frontend route/screen coverage is strongest.
Preview registry/classification is mostly mature.
Customer-facing journey exists at UI preview level.
```

Critical missing logic:

1. **Quote / serviceability before checkout**
   - address validity
   - coverage area
   - store open/closed/busy
   - item availability
   - delivery fee
   - ETA pickup/dropoff
   - fallback when unavailable

2. **Checkout runtime**
   - payment method selection through WLT
   - submit disabled/error logic backed by real provider
   - order create response
   - quote expiration
   - retry/idempotency

3. **Order lifecycle visibility**
   - customer-visible statuses must map to one canonical lifecycle
   - tracking timeline must not be only local preview data
   - cancellation/failure/refund visibility must be backed by events

4. **Support and rating proof**
   - rating is not fully proven as a closed standalone DSH-owned journey
   - support/issue flow must connect to ticket/timeline/audit later

5. **Visual/runtime proof**
   - required screenshots for home, store, cart, checkout, tracking, failure/refund states
   - device runtime logs for happy/failure/recovery paths

Correct status:

```text
APP_CLIENT_PREVIEW_STRONG
APP_CLIENT_RUNTIME_NOT_CLOSED
APP_CLIENT_CHECKOUT_BLOCKED_BY_WLT_RUNTIME_AND_API
```

### 5.2 app-partner — Partner/store app

Current state:

```text
Partner preview registry is now verified.
The previous Partner P6 gate concern is materially improved.
WLT boundary for wallet/finance text is cleaner.
```

Critical missing logic:

1. **Incoming order queue**
   - real order source
   - accept/reject action
   - reason codes
   - prep-time decision
   - timeout/escalation

2. **Preparation lifecycle**
   - preparing
   - ready_for_pickup
   - item unavailable
   - partial fulfillment
   - partner delay
   - store busy/pause orders

3. **Handoff to captain**
   - pickup code/barcode/OTP
   - captain arrival proof
   - partner handoff confirmation
   - failed handoff exception

4. **Partner financial view**
   - gross/net amount
   - commission
   - refund impact
   - settlement batch
   - payout state
   - must be WLT-owned, not DSH-owned

Correct status:

```text
APP_PARTNER_PREVIEW_REGISTRY_CLOSED
APP_PARTNER_OPERATIONS_RUNTIME_NOT_CLOSED
APP_PARTNER_FINANCE_WLT_BOUNDARY_IMPROVED_BUT_LEDGER_UNPROVEN
```

### 5.3 app-captain — Captain delivery app

Current state:

```text
Captain preview registry is verified.
Captain route/map boundary is maintained.
Finance copy is routed through WLT helpers.
```

Critical missing logic:

1. **Assignment / offer flow**
   - task offer source
   - accept/reject
   - expiry
   - batching/reassignment
   - capability/availability guard

2. **Pickup verification**
   - route to pickup
   - arrived_at_pickup
   - pickup code/barcode
   - partner confirmation
   - pickup failure reasons

3. **Dropoff verification**
   - route to dropoff
   - arrived_at_dropoff
   - customer unreachable
   - address not found
   - contactless handoff
   - OTP/PIN/QR/signature/photo proof

4. **Proof of Delivery**
   - proof type
   - required/optional policy
   - captured asset URL
   - verification result
   - failure reason
   - control-panel inspection
   - payout hold/release impact through WLT

5. **Captain earnings runtime**
   - base fare
   - bonus
   - deduction
   - failed-delivery adjustment
   - payout pending/paid/failed

Correct status:

```text
APP_CAPTAIN_PREVIEW_REGISTRY_CLOSED
APP_CAPTAIN_DELIVERY_RUNTIME_NOT_CLOSED
APP_CAPTAIN_POD_NOT_CLOSED
APP_CAPTAIN_EARNINGS_LEDGER_NOT_CLOSED
```

### 5.4 app-field — Field operations app

Current state:

```text
Field registry/classification is improved.
Field visit/onboarding files are now active and classified.
WLT field finance bridge exists as preview/integration layer.
```

Critical missing logic:

1. **Partner acquisition/onboarding**
   - lead/intake
   - document/profile verification
   - store readiness checklist
   - catalog readiness
   - hours/modes/area setup

2. **Visit workflow**
   - visit scheduled
   - visit started
   - visit completed
   - blocker found
   - notes and evidence attachment
   - follow-up/escalation

3. **Control-panel handoff**
   - field submits readiness
   - control-panel approves/rejects
   - partner app receives activation status
   - audit record exists

4. **Field finance**
   - should remain WLT-owned
   - no DSH-owned money logic
   - preview is acceptable only until ledger runtime exists

Correct status:

```text
APP_FIELD_PREVIEW_REGISTRY_CLOSED
APP_FIELD_ONBOARDING_RUNTIME_NOT_CLOSED
APP_FIELD_CP_HANDOFF_NOT_CLOSED
APP_FIELD_FINANCE_WLT_PREVIEW_ONLY
```

### 5.5 control-panel — Command center

Current state:

```text
Operations command-center preview remains the strongest admin/control-panel area.
It is still preview-only.
```

Critical missing logic:

1. **Live orders board**
   - real orders feed
   - status transitions
   - SLA timers
   - risk flags

2. **Dispatch board**
   - captain availability
   - assignment/reassignment
   - capacity by area
   - manual override with audit

3. **Exception queue**
   - cancellation
   - refund
   - return
   - redispatch
   - customer unreachable
   - partner delay
   - address not found

4. **Support timeline**
   - unified order event history
   - customer/partner/captain notes
   - attachments/proof
   - manual action log

5. **Finance oversight**
   - delivery fees
   - commission
   - refund liability
   - captain payout
   - partner settlement
   - platform impact

Correct status:

```text
CONTROL_PANEL_OPERATIONS_PREVIEW_STRONG
CONTROL_PANEL_RUNTIME_COMMAND_CENTER_NOT_CLOSED
CONTROL_PANEL_FINANCE_SUPPORT_AUDIT_NOT_CLOSED
```

### 5.6 WLT bridge

Current state:

```text
WLT bridge ownership is more explicit.
Partner/captain/field finance copy is moved behind WLT helper/bridge paths.
```

Critical missing logic:

1. **Ledger entries**
   - customer charge
   - delivery fee
   - platform commission
   - partner gross/net
   - captain earning
   - refund debit
   - adjustment debit/credit
   - payout pending/paid/failed
   - chargeback

2. **Settlement batches**
   - partner settlement batch
   - captain payout batch
   - platform fee reconciliation
   - refund reversal and transfer reversal handling

3. **Runtime source**
   - preview data must not become accounting truth
   - WLT needs real ledger events or a formal runtime adapter

Correct status:

```text
WLT_DSH_BOUNDARY_IMPROVED
WLT_DSH_LEDGER_RUNTIME_NOT_CLOSED
WLT_DSH_SETTLEMENT_NOT_CLOSED
```

### 5.7 backend/domain/API

Current state:

```text
OpenAPI is empty.
Backend contracts are empty.
Domain is TBD.
```

Critical missing logic:

1. **OpenAPI P0 endpoints**
   - quote/serviceability
   - store availability
   - cart/checkout snapshot
   - order create
   - lifecycle event timeline
   - partner order operations
   - captain task operations
   - proof of delivery
   - exception/support/refund requests

2. **Backend handlers**
   - serviceability handler
   - order lifecycle handler
   - dispatch/captain assignment handler
   - partner prep handler
   - support/exception handler
   - event timeline handler

3. **Domain model**
   - order
   - delivery
   - actor
   - lifecycle event
   - exception reason
   - proof
   - audit action
   - WLT ledger reference

Correct status:

```text
BACKEND_DOMAIN_API_NOT_CLOSED
CONTRACT_FIRST_WORK_REQUIRED_AFTER_SCREEN_API_MATRIX
```

---

## 6. Updated Critical Gap Table

| Surface / Layer | Current judgment | Decisive gap after branch `0129` |
|---|---|---|
| app-client | strongest mobile frontend; preview classification/registry mature | visual runtime evidence, serviceability/quote, checkout/WLT runtime, rating/support closure, real order lifecycle source |
| app-partner | preview registry now closed | real order intake, accept/reject, prep/ready, handoff, item exceptions, store busy mode, partner settlement runtime |
| app-captain | preview registry now closed | assignment, pickup/dropoff verification, PoD capture/verification, exception handling, captain payout runtime |
| app-field | preview registry now closed | onboarding persistence, visit proof, approval handoff, audit trail, WLT-owned field finance runtime |
| control-panel | operations preview strong | live dispatch, support timeline, exception queue, manual audit, finance/settlement oversight, backend-backed command center |
| WLT bridge | ownership improved | ledger entries, split settlement, payout/refund/chargeback runtime, transfer reversal/adjustment logic |
| backend/domain/API | unchanged blocker | OpenAPI empty, backend contracts empty, domain model TBD, persistence and auth/RBAC unproven |

---

## 7. External Benchmark Requirements for a Delivery Platform

Modern delivery platforms do not treat delivery as UI screens only. They require a state/event system, status webhooks, serviceability/quote checks, proof-of-delivery handling, and marketplace-grade financial settlement.

Minimum benchmark implications for BThwani DSH:

1. **Delivery lifecycle** must include states similar to created, confirmed, enroute_to_pickup, arrived_at_pickup, picked_up, enroute_to_dropoff, arrived_at_dropoff, delivered, and cancelled.
2. **Real-time events/webhooks** are required for live customer tracking, push notifications, support timelines, and control-panel operations.
3. **Serviceability before checkout** must validate address, store, capacity, delivery window, and item availability before order creation.
4. **Proof of Delivery** must support photo/signature/OTP/PIN/QR policies, with retrieval and dispute handling.
5. **Marketplace finance** must split customer payments into partner, captain, platform, fee, refund, reversal, and chargeback responsibilities.

Reference sources:

- DoorDash Drive delivery statuses and webhooks.
- Uber Direct delivery/webhook flows.
- Instacart fulfillment and address/capacity validation.
- Onfleet task completion and proof of delivery.
- Stripe Connect separate charges/transfers and refund/transfer reversal handling.
- Adyen marketplace split transactions and split refunds.

---

## 8. Layered Closure Evaluation

| Closure Layer | Current branch state | Decision |
|---|---|---|
| Mobile registry/classification | improved and closed for preview-only gate | PASS_WITH_WARNINGS |
| Mobile public export cleanup | improved in targeted scope | PASS_WITH_WARNINGS |
| WLT ownership boundary | improved | PASS_WITH_WARNINGS |
| app-client frontend | strong preview | PASS_WITH_WARNINGS |
| app-partner frontend | preview-closed registry | PASS_WITH_WARNINGS |
| app-captain frontend | preview-closed registry | PASS_WITH_WARNINGS |
| app-field frontend | preview-closed registry | PASS_WITH_WARNINGS |
| control-panel operations preview | strong but preview | PASS_WITH_WARNINGS |
| Visual/RTL absolute evidence | not complete | NEEDS_VISUAL_EVIDENCE |
| Runtime smoke | skipped / unproven | RUNTIME_UNPROVEN |
| Screen/API Matrix | active, not API-ready | NOT_READY_FOR_API |
| OpenAPI | empty | CONTRACT_TBD |
| Backend | empty/scaffold | BACKEND_SCAFFOLD_ONLY |
| Domain | TBD | DOMAIN_TBD |
| WLT ledger | preview bridge only | NOT_CLOSED |
| Production readiness | impossible currently | BLOCKED |

---

## 9. What Should Be Done Next

The next correct step is **not** broad UI redesign and not backend implementation immediately. The next step is a strict reality-lock and evidence gate.

### Phase A — DSH Final Reality Lock

Purpose:

```text
Turn the current branch truth into a single non-contradictory closure record.
```

Required actions:

1. Update `SERVICE_BLUEPRINT.md` language so `CLOSED` always means scoped preview closure, not full service closure.
2. Update `UI_UX_FLOW_CLOSURE_MATRIX.md` to remove stale path references or mark them legacy if they are no longer live.
3. Update `SCREEN_API_MATRIX.md` so every P0 flow has a clear status: `PREVIEW_CLOSED`, `NEEDS_VISUAL_EVIDENCE`, `RUNTIME_UNPROVEN`, `NOT_READY_FOR_API`, or `BLOCKED_BY_WLT/AUTH`.
4. Update `RUNTIME_EVIDENCE_MATRIX.md` to reflect the mobile gate but keep runtime unproven.
5. Ensure all four mobile classification CSVs are generated from live files and not stale paths.

Acceptance:

```text
No ambiguous final closure language.
No stale path in active truth sections.
No claim that preview equals runtime.
No claim that OpenAPI/backend/domain are closed.
```

### Phase B — Visual Runtime Smoke Evidence

Purpose:

```text
Prove preview screens render correctly in live app sessions.
```

Required evidence:

- app-client screenshots: home, store, cart, checkout, tracking, support/refund/rating states.
- app-partner screenshots: home, order inbox, order detail, prep/ready, inventory, support, WLT wallet bridge.
- app-captain screenshots: task/inbox, detail, map, pickup/dropoff, support, finance bridge.
- app-field screenshots: stores, onboarding, visit, history, profile, finance bridge.
- control-panel screenshots: operations, exceptions, SLA, support, finance preview.

Acceptance:

```text
VISUAL_EVIDENCE_PASS or NEEDS_VISUAL_FIX
```

### Phase C — Screen/API Matrix Freeze

Purpose:

```text
Freeze exactly what data/actions are required before OpenAPI work begins.
```

Required output:

```text
Flow → Surface → Screen → State → Needed Data → Needed Action → Auth/WLT Dependency → API Gap → Runtime Proof
```

Acceptance:

```text
READY_FOR_OPENAPI_P0_DESIGN
```

### Phase D — OpenAPI P0 Only

Start only after Phase C.

P0 contract groups:

```text
serviceability/quote
store availability
cart/checkout intent
order create
order lifecycle event
partner prep action
captain task action
proof of delivery
exception/support/refund request
tracking timeline
```

### Phase E — Runtime Binding Wave

Start only after P0 contracts and typed client boundaries are clear.

Order:

1. app-client quote → checkout → tracking.
2. app-partner order intake → prep → ready.
3. app-captain assignment → pickup/dropoff → PoD.
4. control-panel live order/dispatch/exception view.
5. WLT ledger bridge for payment/refund/settlement events.

---

## 10. Final Updated Decision

```text
Decision: PASS_WITH_WARNINGS_FOR_MOBILE_PREVIEW_SCOPE_ONLY
Final service closure: BLOCKED
Reason: runtime/API/backend/domain/WLT ledger/visual evidence are not closed.
```

The branch `ghb/0129-20260512-002932-app-captain-app-client-app-field` is a useful and important checkpoint. It proves that the mobile app preview structure is much cleaner and that app-partner/app-captain/app-field registry/ownership gaps were reduced.

It does **not** prove that DSH is operationally complete.

The correct next move is:

```text
DSH_FINAL_REALITY_LOCK
then VISUAL_RUNTIME_SMOKE
then SCREEN_API_MATRIX_FREEZE
then OPENAPI_P0
then RUNTIME_BINDING_WAVE
```

Any direct jump to “DSH 100% closed” remains unsupported by the current branch evidence.
