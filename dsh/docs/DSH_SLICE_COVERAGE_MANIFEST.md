# DSH Slice Coverage Manifest

Status: ACTIVE_SLICE_COVERAGE_PROTOCOL
Decision: MANIFEST_REQUIRED_BEFORE_SLICE_CLOSURE

Purpose:
Permanent DSH closure-governance protocol for preventing forgotten surfaces, screens, routes, CTAs, states, operations, permissions, WLT boundaries, or control-panel entries.

## Slice Definition

A DSH slice is not a single screen. A slice is:

```text
Actor + Goal + Surface group + Operation + Evidence
```

Every slice manifest is an official closure inventory. Raw screenshots, logs, command outputs, and zip bundles stay under `tools/registry/runs/<SESSION_ID>/`.

## Canonical Source Order

Read sources in this order before creating or changing any slice manifest:

1. `dsh/SERVICE_BLUEPRINT.md`
2. screen registries under `dsh/frontend/app-*/`
3. route registries under `dsh/frontend/app-*/`
4. `dsh/frontend/shared/dsh-flow-registry.ts`
5. `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
6. control-panel registries under `dsh/frontend/control-panel/**`
7. `dsh/docs/DSH_VISUAL_REVIEW.md`
8. `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
9. `dsh/docs/SCREEN_API_MATRIX.md`
10. `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
11. `dsh/dsh.openapi.yaml`, typed-client, binding, and runtime evidence only when the earlier rows allow it

## Required Slice Sections

Every file under `dsh/docs/slices/` must contain:

- `Identity`
- `Scope`
- `Coverage Matrix`
- `CTA Matrix`
- `State Matrix`
- `Cross-Surface Impact`
- `Evidence and Gates`
- `Decision`

## Required Row Fields

Every coverage row must resolve these fields:

```text
Slice ID
Service
Business Domain
Actor
Surface
Route
Screen Owner
Primary Action
Secondary Actions
CTA List
Navigation Target
Required States
Control Panel Entry
Auth/Permission
WLT Boundary
Vars/Provider Dependency
Search Dependency
Notification Dependency
Account/Profile Dependency
API Candidate
Binding Status
Runtime Status
Visual Evidence
Git Evidence
Typecheck Evidence
Regression Evidence
Decision
```

## Manifest Decision Vocabulary

Slice manifests must use only these decision values:

```text
PASS
FIX_REQUIRED
BLOCKED_WITH_REASON
NOT_APPLICABLE_WITH_REASON
DEFERRED_WITH_REASON
TBD_NOT_ALLOWED_AT_CLOSURE
```

Live matrices may still contain values such as `needs-visual-evidence`, `blocked-by-wlt`, `UI_PREVIEW_ONLY`, `NOT_READY_FOR_API`, or `RUNTIME_UNPROVEN`. Slice manifests may quote those values as source truth, but the manifest decision fields must use the vocabulary above.

## No-Orphan Rules

- No surface without a route.
- No route without an owner.
- No screen without a primary action.
- No CTA without a navigation target.
- No required state without a visual-review reference.
- No dependency without an owner classification.
- No finance row without WLT classification.
- No API candidate without a linked screen or flow reason.
- No runtime claim without request, response, log, and screen-state evidence.
- No operational side effect without a control-panel/audit classification.

## Incomplete Slice Rules

A slice is incomplete if:

- any required section is missing,
- any mandatory field is blank,
- any closure field contains a bare unresolved placeholder,
- any CTA lacks target or precondition,
- any required state lacks visual-review reference,
- any cross-surface dependency is mentioned without decision status,
- any WLT/Auth/Search/Notification/Vars impact is omitted or left unclassified,
- any linked UI/API/runtime matrix contradicts the slice decision.

## Slice Close Rule

A slice may not close unless all required rows are resolved, every required state is represented, every CTA is mapped, cross-surface dependencies are resolved or explicitly blocked with reason, visual-review links exist, and the linked UI/API/runtime docs support the same decision.

The service-wide DSH decision remains governed by `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`, `dsh/docs/SCREEN_API_MATRIX.md`, `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`, and `dsh/docs/DSH_VISUAL_REVIEW.md`. Slice manifests prove coverage completeness; they do not promote preview/local data to runtime truth.

## Cross-Surface Journey Model

Every DSH slice is a cross-surface business/operational journey from start to finish — not a single screen, not a surface row in a matrix, not a single actor surface.

Each slice manifest must resolve the following fields in addition to the Required Row Fields above:

```text
Business Outcome       — the measurable end state when the slice completes
Actor Chain            — ordered list of actors involved end-to-end (e.g. client → partner → captain → operator)
Operation Chain        — ordered list of operations across all surfaces
Primary Surface        — the surface that owns the visible journey anchor
Supporting Surfaces    — surfaces that participate but do not own the anchor
Dependency Surfaces    — surfaces that must be proven before the slice closes, but are not the actor
Excluded Surfaces      — surfaces explicitly not in this slice (reason required for each)
Control Panel Owner    — which control-panel area governs this slice (operations/finance/both/none)
WLT Boundary          — how WLT interacts with this slice (full owner/read-only bridge/none/future)
Auth/Permission Boundary — what auth/permission proof is required before the slice may close
Vars/Provider Boundary — which provider variables or platform policies affect this slice
Notification Boundary  — whether notifications are part of the slice or deferred
Account/Profile Boundary — account or profile state that this slice depends on
Data Ownership         — which layer owns each data set used (domain/preview/fixture/api/WLT)
API/Runtime Boundary   — API candidates and runtime proof requirements per surface
Visual Evidence per Surface — required visual review IDs per surface
Runtime Evidence per Surface — required runtime proof per surface
CTAs per Surface       — all CTAs for each surface in the slice
States per Surface     — all required screen states for each surface
Rollback/Disable Path  — how this slice can be disabled or rolled back if a blocker is found (where relevant)
Missing Logic/Screen/Process Proposals — any gap discovered during closure that must be resolved or blocked
Final Decision per Surface — PASS / FIX_REQUIRED / BLOCKED_WITH_REASON / NOT_APPLICABLE_WITH_REASON / DEFERRED_WITH_REASON
Final Slice Decision   — overall slice closure decision
```

## Surface Classification Vocabulary

Every surface referenced in a slice manifest must carry one of these classifications:

```text
primary     — owns the visible journey anchor for this slice; must have full visual and runtime proof
supporting  — participates in the journey but does not own the anchor; must be classified before closure
dependency  — must be proven before the slice closes, but is not the primary actor surface
excluded    — explicitly not part of this slice; reason required for each excluded surface
blocked     — cannot be classified yet; the blocker reason must be documented explicitly
deferred    — intentionally moved to a later slice; the target slice or reason must be documented
```

No surface that is mentioned in any slice field may be left without one of the above classifications. Unclassified surfaces are not allowed at closure time.

## Missing-Process Proposal Rule

If during the closure of any slice a missing screen, process, state, CTA, guard, data owner, API/runtime boundary, auth boundary, WLT boundary, or control-panel owner is discovered, it must be documented immediately inside the slice manifest as one of:

```text
REQUIRED_ADDITION   — this gap must be resolved before the slice may close
BLOCKED_WITH_REASON — this gap cannot be resolved now; the blocker is explicit and documented
```

Silent closure of a gap is prohibited. No slice may carry the decision PASS while any REQUIRED_ADDITION items remain unresolved. Omitting a known gap is treated as a governance violation equivalent to a false PASS.

## Forward-Only Closure Rule

No transition to the next slice is allowed unless every item in the current slice's Missing Logic/Screen/Process Proposals section is either:

- resolved with evidence (REQUIRED_ADDITION → PASS), or
- reclassified as BLOCKED_WITH_REASON with a documented, specific reason

Deferred items must name the target slice they belong to. No item may remain as TBD at transition time.

## Initial Editable Cross-Surface Slice Matrix

This matrix is a **living planning matrix**. It may be updated during execution only with evidence. Any new slice, screen, process, CTA, state, owner, or boundary discovered during closure must be added here before moving forward.

No row in this matrix is CLOSED unless all required surfaces are classified, all required evidence gates are listed, and any gaps are explicitly blocked or deferred with reason.

| Slice ID | Slice Name | Business Outcome | Primary Actor | Actor Chain | Operation Chain | Primary Surface | Supporting Surfaces | Dependency Surfaces | Excluded Surfaces + Reason | Control Panel Owner | Data Ownership | WLT Boundary | Auth/Permission Boundary | Vars/Provider Boundary | Notification Boundary | Account/Profile Boundary | API/Runtime Boundary | Required Screens | Required CTAs | Required States | Visual Evidence Required | Runtime Evidence Required | Missing Logic/Screen/Process Proposals | Current Status | Next Closure Gate | Final Slice Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-SLICE-001` | Store Discovery | Client can discover available stores, search inline, and open store details after the shared visibility gate allows exposure. | `client` | client | client opens home → searches inline → opens store | `app-client` | shared DSH client visibility/serviceability model | app-partner inventory/catalog readiness; control-panel catalogs governance; control-panel marketing visibility; Platform/Vars/provider policy | app-captain (NOT_APPLICABLE_WITH_REASON: no delivery action in discovery); app-field (NOT_APPLICABLE_WITH_REASON: no field operation); cart/checkout (NOT_APPLICABLE_WITH_REASON: belongs to later slice); WLT (NOT_APPLICABLE_WITH_REASON: no money semantics in discovery) | operations (classified: not in scope for discovery); finance (classified: not in scope) | dsh/frontend/data owns preview; domain owns visibility gate | none (WLT starts after checkout/payment) | DSH_SLICE_001_L7_CLOSED — auth proof not required for discovery | no provider policy in scope yet | none | none | GET /stores (L7_CLOSED for DSH-SAPI-P014-01) | HomeScreen.tsx; StoreScreen.tsx (inline search only) | open store; search inline; view store details | loading; empty; error; success; offline | VR-L1-001; VR-L1-023; VR-L1-005 | DSH-RUN-P014-01 (L7_CLOSED) | none unresolved | `L7_CLOSED` | none — slice is closed | `L7_CLOSED` |
| `DSH-SLICE-002` | Catalog Readiness — Client Visibility | Partner/catalog readiness becomes safely visible to client across all related governance surfaces. | `partner` | partner publishes catalog → control-panel governs → client sees visibility | partner updates inventory → control-panel approves catalog → control-panel controls marketing visibility → shared serviceability model gates exposure → client sees store/catalog | `app-partner` | control-panel catalog governance; control-panel marketing visibility; app-client visibility consumption; shared DSH data/visibility/serviceability model | Platform/Vars/provider policy | cart (excluded: checkout belongs to later slice); checkout (excluded: WLT/payment belongs to later slice); WLT/payment (excluded: no money semantics); refund (excluded: later slice); settlement (excluded: later slice); captain delivery (excluded: later slice); field visits (excluded: later slice); support escalation (excluded: later slice) | catalog governance; marketing visibility | dsh/frontend/data owns preview; domain owns catalog/visibility gate; partner owns inventory source | none (no WLT in catalog readiness/visibility) | TBD — must be classified before closure | TBD — must be classified before closure | TBD | TBD | TBD | InventoryCatalogScreen.tsx (partner); catalog governance screens (control-panel); HomeScreen.tsx/StoreScreen.tsx (client visibility consumption) | TBD — must enumerate before closure | TBD | TBD | TBD | slice manifest required; cross-surface impact map required; screen inventory required; CTA/state inventory required; data ownership map required; API/runtime readiness decision required; WLT/Auth/Vars classification required; visual evidence plan required; missing-process detection section required | `PROPOSED_NEXT_SLICE` | Slice manifest complete with all required cross-surface fields | TBD |
| `DSH-SLICE-CHECKOUT` | Checkout / Payment Cross-Surface | Client completes order; WLT processes payment; partner receives order; control-panel monitors. | `client` | client → WLT → partner → control-panel | TBD | `app-client` | WLT; app-partner order intake; control-panel finance/ops | TBD | TBD | finance; operations | TBD | full WLT ownership of payment/money semantics | TBD | TBD | TBD | TBD | TBD | CartScreen.tsx; DshCheckoutIntentScreen.tsx; WLT screens | TBD | TBD | TBD | TBD | client-checkout is NOT the immediate next safe slice; must not begin until WLT/Auth/payment proof exists | `FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT` | WLT/Auth/payment runtime proof exists; cross-surface impact map complete | TBD |
| `DSH-SLICE-LIFECYCLE` | Lifecycle / Support Cross-Surface | Order lifecycle events (tracking, cancellation, support, refund) are proven across all surfaces. | `client` | client → partner → captain → control-panel | TBD | `app-client` | app-partner; app-captain; control-panel support/audit | WLT (refund execution only) | TBD | operations; finance (refund) | TBD | WLT owns refund execution | TBD | TBD | TBD | TBD | TBD | OrdersTrackingScreens.tsx; OperationScreens.tsx | TBD | TBD | TBD | TBD | none | `FUTURE_NEEDS_CROSS_SURFACE_PROOF` | cross-surface impact map; partner/captain/control-panel runtime proof | TBD |
| `DSH-SLICE-DELIVERY` | Delivery Execution Cross-Surface | Captain completes pickup and delivery; partner confirms ready; client tracks; control-panel dispatches. | `captain` | captain → partner → client → control-panel | TBD | `app-captain` | app-partner; app-client; control-panel dispatch | WLT (payout effects only, deferred) | TBD | operations; finance (payout, deferred) | TBD | WLT payout deferred | TBD | TBD | TBD | TBD | TBD | DshCaptainOrdersScreen.tsx; DshCaptainPickupDropoffScreen.tsx; DshCaptainMapScreen.tsx; DshCaptainPoDSubmissionScreen.tsx | TBD | TBD | TBD | TBD | none | `FUTURE_NEEDS_CAPTAIN_PARTNER_CLIENT_CONTROL_PANEL_PROOF` | cross-surface impact map; captain/partner/client/control-panel runtime proof | TBD |
| `DSH-SLICE-FIELD` | Field Readiness Cross-Surface | Field agent onboards and verifies stores; control-panel approves; partner achieves readiness. | `field` | field → control-panel → partner | TBD | `app-field` | control-panel approvals; app-partner readiness | none | WLT (excluded: no money semantics in field readiness) | operations | TBD | none | TBD | TBD | TBD | TBD | TBD | DshFieldStoresScreen.tsx; DshFieldStoreOnboardingScreen.tsx; DshFieldStoreVisitScreen.tsx; DshFieldReadinessEscalationScreen.tsx | TBD | TBD | TBD | TBD | none | `FUTURE_NEEDS_FIELD_CONTROL_PANEL_PARTNER_PROOF` | cross-surface impact map; field/control-panel/partner runtime proof | TBD |
