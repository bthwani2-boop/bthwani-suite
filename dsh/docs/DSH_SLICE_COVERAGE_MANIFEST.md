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
| `DSH-SLICE-001` | Store Discovery | Client can discover available stores, search inline, and open store details after the shared visibility gate allows exposure. | `client` | client | client opens home → searches inline → opens store | `app-client` | shared DSH client visibility/serviceability model; app-partner; control-panel catalogs; control-panel marketing | None | app-captain (NOT_APPLICABLE); app-field (NOT_APPLICABLE); cart/checkout (NOT_APPLICABLE); WLT (NOT_APPLICABLE) | operations (catalog/marketing governance) | dsh/frontend/data owns preview; domain owns visibility gate | none (WLT starts after checkout/payment) | Public/guest-safe | no provider policy in scope yet | none | none | GET /stores (app-client / GET /stores edge proof only; not full cross-surface Slice 001 closure) | HomeScreen.tsx; StoreScreen.tsx; InventoryCatalogScreen.tsx; catalogs.screen.tsx | open store; search inline; view store details; update readiness; approve catalog | loading; empty; error; success; offline | VR-L1-001; VR-L1-023; VR-L1-005; plus partner and CP screens | DSH-RUN-P014-01 (app-client / GET /stores edge proof only; not full cross-surface Slice 001 closure) | GAP-001, GAP-002, GAP-003 | `DSH_SLICE001_FINAL_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE` | None. All E2E screen runtime verification completed successfully and evidence was archived. | `PASS` |
| `DSH-SLICE-002` | Deeper Catalog Management | Partner manages deep catalog structure beyond basic visibility. | `partner` | partner → control-panel | partner updates products → control-panel approves | `app-partner` | control-panel catalog governance | Platform/Vars/provider policy | cart (excluded); checkout (excluded); WLT/payment (excluded) | catalog governance | dsh/frontend/data owns preview; partner owns inventory source | none | partner auth + operator auth | Platform/Vars/provider policy | none | none | POST /stores/{id}/products, PATCH /products/{id}, GET /stores/{id}/products, GET /products/{id}, POST /stores/{id}/categories, GET /stores/{id}/categories, GET/PATCH/DELETE /categories/{id}, POST /media, DELETE /media/{id}, PATCH /stores/{store_id}/catalog-overrides, POST /catalog-approvals, GET /stores/{id}/products?approval_status=catalog_adopted, GET /catalog-conflicts, POST /catalog-conflicts/{id}/resolve | InventoryCatalogScreen.tsx (partner); ProductEditScreen.tsx (partner); CategoryManagementScreen.tsx (partner); ProductMediaScreen.tsx (partner); ProductOverridesScreen.tsx (partner); CatalogsPage (control-panel); AuditTrailDrawer (control-panel) | create product; edit product; set SKU; barcode; set main category; set sub-category; set facet; assign mediaKey; upload image; reject image; apply override; remove override; approve; reject; request fix; publish listing; unpublish listing; set visibility; resolve conflict (accept local); revert to central; view conflicts | loading; form; saving; saved; error; offline; not_found; success; pending review; approved; rejected; products listed; no conflicts; conflicts present; resolving | yes | tools/registry/runs/DSH_SLICE_002*_FINAL_CLOSURE-*/ | none | `DSH_SLICE002_FINAL_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE` | None. All E2E screen runtime verification completed successfully and evidence was archived. | `PASS` |
| `DSH-SLICE-CHECKOUT` | Checkout / Payment Cross-Surface | Client completes order; WLT processes payment; partner receives order; control-panel monitors. | `client` | client → WLT → partner → control-panel | TBD | `app-client` | WLT; app-partner order intake; control-panel finance/ops | TBD | TBD | finance; operations | TBD | full WLT ownership of payment/money semantics | TBD | TBD | TBD | TBD | TBD | CartScreen.tsx; DshCheckoutIntentScreen.tsx; WLT screens | TBD | TBD | TBD | TBD | client-checkout is NOT the immediate next safe slice; must not begin until WLT/Auth/payment proof exists | `FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT` | WLT/Auth/payment runtime proof exists; cross-surface impact map complete | TBD |
| `DSH-SLICE-LIFECYCLE` | Lifecycle / Support Cross-Surface | Order lifecycle events (tracking, cancellation, support, refund) are proven across all surfaces. | `client` | client → partner → captain → control-panel | TBD | `app-client` | app-partner; app-captain; control-panel support/audit | WLT (refund execution only) | TBD | operations; finance (refund) | TBD | WLT owns refund execution | TBD | TBD | TBD | TBD | TBD | OrdersTrackingScreens.tsx; OperationScreens.tsx | TBD | TBD | TBD | TBD | none | `FUTURE_NEEDS_CROSS_SURFACE_PROOF` | cross-surface impact map; partner/captain/control-panel runtime proof | TBD |
| `DSH-SLICE-DELIVERY` | Delivery Execution Cross-Surface | Captain completes pickup and delivery; partner confirms ready; client tracks; control-panel dispatches. | `captain` | captain → partner → client → control-panel | TBD | `app-captain` | app-partner; app-client; control-panel dispatch | WLT (payout effects only, deferred) | TBD | operations; finance (payout, deferred) | TBD | WLT payout deferred | TBD | TBD | TBD | TBD | TBD | DshCaptainOrdersScreen.tsx; DshCaptainPickupDropoffScreen.tsx; DshCaptainMapScreen.tsx; DshCaptainPoDSubmissionScreen.tsx | TBD | TBD | TBD | TBD | none | `FUTURE_NEEDS_CAPTAIN_PARTNER_CLIENT_CONTROL_PANEL_PROOF` | cross-surface impact map; captain/partner/client/control-panel runtime proof | TBD |
| `DSH-SLICE-FIELD` | Field Readiness Cross-Surface | Field agent onboards and verifies stores; control-panel approves; partner achieves readiness. | `field` | field → control-panel → partner | TBD | `app-field` | control-panel approvals; app-partner readiness | none | WLT (excluded: no money semantics in field readiness) | operations | TBD | none | TBD | TBD | TBD | TBD | TBD | DshFieldStoresScreen.tsx; DshFieldStoreOnboardingScreen.tsx; DshFieldStoreVisitScreen.tsx; DshFieldReadinessEscalationScreen.tsx | TBD | TBD | TBD | TBD | none | `FUTURE_NEEDS_FIELD_CONTROL_PANEL_PARTNER_PROOF` | cross-surface impact map; field/control-panel/partner runtime proof | TBD |

---

## Business Journey Table

10 canonical DSH journeys. Execution slices in the next section.

| Journey ID | Journey Name | Type | Primary Actors | Control Panel Owner | WLT Boundary | Current Status |
|---|---|---|---|---|---|---|
| J-001 | Store Discovery | Business | client, partner, operator | operations (catalog + marketing) | none | **SLICE_GROUP_CLOSED** — DSH-SLICE-001A/B/C/D/E/F all PASS (001F closed 2026-06-04T01:52:00Z, evidence DSH_SLICE_001F_CROSS_SURFACE_FINAL_PROOF-20260604-044800) |
| J-002 | Catalog Management | Business | partner, operator | catalog governance | none | **SLICE_GROUP_CLOSED** — DSH-SLICE-002A/B/C/D/E/F/G all PASS (002G closed 2026-06-04T15:59:00Z, evidence DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900) |
| J-003 | Checkout / Payment | Business | client, WLT, partner, operator | finance + operations | full WLT ownership of payment/money | FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT |
| J-004 | Order Lifecycle / Support | Business | client, partner, captain, operator | operations + finance (refund) | WLT owns refund execution | FUTURE_NEEDS_CROSS_SURFACE_PROOF |
| J-005 | Delivery Execution | Business | captain, partner, client, operator | operations + finance (payout, deferred) | WLT payout deferred | FUTURE_NEEDS_CAPTAIN_PARTNER_CLIENT_CONTROL_PANEL_PROOF |
| J-006 | Field Readiness | Business | field, operator, partner | operations | none | FUTURE_NEEDS_FIELD_CONTROL_PANEL_PARTNER_PROOF |
| J-007 | Data / Media / Fixture Governance | Foundation | domain, operator | N/A — data governance | none | ACTIVE_GOVERNANCE — no runtime slice, perpetual |
| J-008 | Platform / Vars / Provider Policy | Foundation | operator | platform | none | ACTIVE_GOVERNANCE — no standalone runtime slice |
| J-009 | Control Panel Operations Room | Foundation | operator | operations | none | NEEDS_VISUAL_EVIDENCE + NEEDS_RUNTIME_EVIDENCE |
| J-010 | WLT Finance / Settlement Boundary | Foundation | operator (read-only) | finance | full WLT ownership — DSH is read-only bridge | BLOCKED_BY_WLT |

---

## Execution Slice Table

44 execution slices decomposed from the 10 journeys. Each slice: 1 goal, 1–2 primary surfaces, 1 operation, 1–3 CTAs, defined states, defined exit gate.

For fields beyond this table, each slice requires a manifest file under `dsh/docs/slices/` with all Required Slice Sections.

| Slice ID | Parent Journey | Business Outcome | Primary Actor | Primary Surface | Supporting Surfaces | Excluded Surfaces + Reason | CTAs (≤3) | Required States | Data Owner | API/Runtime Boundary | WLT Boundary | Auth Boundary | Visual Evidence Required | Runtime Evidence Required | Exit Gate | Current Status | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-SLICE-001A` | J-001 | Client sees live list of stores from API | client | app-client | shared visibility model | app-captain (N/A: no delivery); app-field (N/A: no field ops); WLT (N/A: no money) | open store; search inline | loading, empty, error, success, offline | dsh/frontend/data (preview); domain (visibility gate) | GET /stores — RUNTIME_PROVEN (DSH_SLICE001_LIVE_E2E-20260603-173059) | none | public/guest-safe | VR-L1-001, VR-L1-005, VR-L1-023 | DSH-RUN-P014-01 — PROVEN | All 3 visibility gate PASS + runtime matrix updated | PASS | None — slice closed |
| `DSH-SLICE-001B` | J-001 | Client opens store details and browses inline | client | app-client | shared visibility model | app-captain (N/A); app-field (N/A); WLT (N/A) | open store; view details; search inline | loading, empty, error, success, offline | dsh/frontend/data (preview) | GET /stores/{id} — RUNTIME_PROVEN (DSH_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE-20260604-034548) | none | public/guest-safe | yes — store detail screen | tools/registry/runs/DSH_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE-20260604-034548/ | Visual + runtime proof of store detail screen | PASS | Feed DSH-SLICE-001F final cross-surface proof; do not reopen 001B unless store detail behavior changes. |
| `DSH-SLICE-001C` | J-001 | Partner sets readiness; client_visible changes | partner | app-partner | app-client (serviceability reader), control-panel | app-captain (N/A); app-field (N/A); WLT (N/A) | update readiness; toggle ready/paused | loading, success, offline | dsh/frontend/data (preview); domain (readiness logic) | PATCH /stores/{id}/partner-readiness — DSH_SLICE001_SCREEN_RUNTIME_PROVEN | none | partner auth | VR-L1-009 VISUAL_PASS (2026-06-02) | `tools/registry/runs/DSH_SLICE_001C_PARTNER_READINESS_FINAL_CLOSURE-20260604-043800/` | All 3 visibility gate PASS + runtime matrix updated | PASS | None — slice closed |
| `DSH-SLICE-001D` | J-001 | Operator approves catalog; client_visible changes | operator | control-panel (catalogs) | app-client (serviceability reader), app-partner | app-captain (N/A); app-field (N/A); WLT (N/A) | approve catalog; reject catalog | loading, success, error | domain | PATCH /stores/{id}/catalog-approval — DSH_SLICE001_SCREEN_RUNTIME_PROVEN | none | operator auth | VR-L2-008, VR-L2-009 VISUAL_PASS | DSH-RUN-P014-07 — PROVEN | All 3 visibility gate PASS + runtime matrix updated | PASS | None — slice closed |
| `DSH-SLICE-001E` | J-001 | Operator sets marketing visibility; client_visible changes | operator | control-panel (marketing) | app-client (serviceability reader) | app-captain (N/A); app-field (N/A); WLT (N/A) | set active (visible); set inactive | loading, success, error | domain | PATCH /stores/{id}/marketing-visibility — DSH_SLICE001_SCREEN_RUNTIME_PROVEN | none | operator auth | VR-L2-012 VISUAL_PASS | DSH-RUN-P014-07 — PROVEN | All 3 visibility gate PASS + runtime matrix updated | PASS | None — slice closed |
| `DSH-SLICE-001F` | J-001 | Cross-surface final visibility proof: all 3 gates affect GET /stores together | operator + partner + client | app-client + app-partner + control-panel | shared visibility model | app-captain (N/A); app-field (N/A); WLT (N/A) | (implicit — derived from 001C/D/E) | all states from 001A–001E | domain | GET /stores diff after each PATCH gate | none | all roles | combined runtime evidence (9 steps, all gates individually + simultaneously) | GET /stores response diff before/after each PATCH + all-gates-off + all-gates-on | All 3 PATCH gates affect GET /stores in a single session | **PASS** — DSH_SLICE_001F_CROSS_SURFACE_FINAL_PROOF-20260604-044800 | None — J-001 CLOSED |
| `DSH-SLICE-002A` | J-002 | Partner identifies and manages product identity (SKU/GTIN/barcode) | partner | app-partner | control-panel (catalog governance) | app-captain (N/A); app-field (N/A); WLT (N/A) | create product; edit product; set SKU; barcode | loading, form, saving, saved, error, offline, not_found | domain/postgres | POST /stores/{id}/products, PATCH /products/{id}, GET /stores/{id}/products, GET /products/{id} — RUNTIME_PROVEN 6/6 (DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE-20260604-050000) | none (base_price_label is display-only; WLT owns price semantics) | partner auth | yes | tools/registry/runs/DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE-20260604-050000/09-runtime-request-response-proof.txt | Slice manifest complete; runtime proof 6/6; go test PASS; migration applied | **PASS** | Proceed to DSH-SLICE-002B — Category Structure |
| `DSH-SLICE-002B` | J-002 | Partner manages category structure (main/sub/facet) | partner | app-partner | control-panel (catalog governance) | app-captain (N/A); app-field (N/A); WLT (N/A) | set main category; set sub-category; set facet | loading, success, error, offline | dsh/frontend/data (preview) | POST /stores/{id}/categories, GET /stores/{id}/categories, GET/PATCH/DELETE /categories/{id} | none | partner auth | yes | tools/registry/runs/DSH_SLICE_002B_CATEGORY_STRUCTURE_FINAL_CLOSURE-20260604-054101/ | Slice manifest complete; visual + runtime proof | **PASS** | None — slice closed |
| `DSH-SLICE-002C` | J-002 | Media ownership: mediaKey assignment and image governance | partner, operator | app-partner + control-panel | shared media governance | app-captain (N/A); WLT (N/A) | assign mediaKey; upload image; reject image | loading, success, error | domain (mediaKey rules); dsh/frontend/media-fixtures | POST /media + DELETE /media/{id} | none | partner + operator auth | yes | tools/registry/runs/DSH_SLICE_002C_MEDIA_GOVERNANCE_FINAL_CLOSURE-20260604-055952/ | Slice manifest complete; visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002D` | J-002 | Partner local overrides boundary: partner can override within allowed scope | partner | app-partner | control-panel (override governance) | app-captain (N/A); WLT (N/A) | apply override; remove override | loading, success, error | partner owns overrides; domain owns base | PATCH /stores/{store_id}/catalog-overrides — DSH_SLICE_002D_PARTNER_LOCAL_OVERRIDES_FINAL_CLOSURE-20260604-150500 | none | partner auth | yes | tools/registry/runs/DSH_SLICE_002D_PARTNER_LOCAL_OVERRIDES_FINAL_CLOSURE-20260604-150500/ | Slice manifest complete; visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002E` | J-002 | Catalog approval / rejection / needs-fix workflow | operator | control-panel (catalogs) | app-partner (submitter), app-client (consumer) | app-captain (N/A); WLT (N/A) | approve; reject; request fix | loading, success, error | domain | POST /catalog-approvals — DSH_SLICE_002E_APPROVAL_WORKFLOW_FINAL_CLOSURE-20260604-153300 | none | operator auth | yes | tools/registry/runs/DSH_SLICE_002E_APPROVAL_WORKFLOW_FINAL_CLOSURE-20260604-153300/ | Slice manifest complete; visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002F` | J-002 | Listing visibility / publication boundary | partner, operator | app-partner + control-panel | app-client (consumer) | app-captain (N/A); WLT (N/A) | publish listing; unpublish listing; set visibility | loading, success, error | domain (visibility gate) | GET /stores/{id}/products?approval_status=catalog_adopted — DSH_SLICE_002F_LISTING_VISIBILITY_FINAL_CLOSURE-20260604-154100 | none | partner + operator auth | yes | tools/registry/runs/DSH_SLICE_002F_LISTING_VISIBILITY_FINAL_CLOSURE-20260604-154100/ | Slice manifest complete; visual + runtime proof; go test PASS | **PASS** | None — slice closed |
| `DSH-SLICE-002G` | J-002 | Catalog conflict / duplicate / audit handling | operator | control-panel (catalogs) | app-partner | app-captain (N/A); app-field (N/A); WLT (N/A) | Resolve conflict (accept local); Revert to central; View conflicts | loading, success, error, resolving | domain | GET /catalog-conflicts, POST /catalog-conflicts/{id}/resolve | none | operator auth | yes | DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900 | Slice manifest complete; visual + runtime proof | **PASS** | None — slice closed |
| `DSH-SLICE-003A` | J-003 | Client reviews cart and confirms serviceability lock | client | app-client (cart) | shared serviceability model | app-captain (N/A: not yet assigned); WLT (N/A: payment not started); app-partner (N/A: J-001); app-field (N/A: J-006); control-panel (N/A: no CP action at cart step) | view cart; remove item; proceed to checkout | loading, empty, error, blocked, retry, serviceable, not_serviceable | preview/local-state | BLOCKED_BY_WLT/AUTH — GET /cart/serviceability not designed; requires auth contract | WLT starts at payment intent (003C) | client auth — PRIMARY BLOCKER | yes — 7 states required | NEEDS_RUNTIME_EVIDENCE — blocked | WLT/auth runtime proof exists + GET /cart/serviceability designed + backend implemented + CartScreen wired + runtime proof + visual proof (all 7 states) | BLOCKED_WITH_REASON — WLT/auth proof not available; slice file fully upgraded to required-section compliance (DSH_SLICE_003A_CART_SERVICEABILITY_BLOCKED_CLOSURE-20260604-174100) | Await WLT/auth runtime proof; do NOT start DSH-SLICE-003B until this slice PASS |
| `DSH-SLICE-003B` | J-003 | Client submits checkout intent; system reserves items and prepares order session | client | app-client / DshCheckoutIntentScreen | DSH backend checkout session service | app-captain (N/A); app-partner (N/A: intake is 003D); app-field (N/A: J-006); control-panel (N/A: no operator action) | confirm checkout; cancel; change address | loading, address_entry, intent_created, intent_failed, blocked, error | preview/local-state | BLOCKED_BY_WLT/AUTH — POST /checkout/intent not designed; requires auth + 003A PASS | WLT receives session token at 003C | client auth (upstream from 003A) | yes — 6 states required | NEEDS_RUNTIME_EVIDENCE — blocked | WLT/auth proof + 003A PASS + POST /checkout/intent designed + backend implemented + DshCheckoutIntentScreen wired + runtime + visual proof | BLOCKED_WITH_REASON — WLT/auth proof + 003A PASS required; slice fully upgraded (DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700) | Await 003A PASS; do NOT start 003C until 003B PASS |
| `DSH-SLICE-003C` | J-003 | Payment executed via WLT; DSH receives payment-confirmed callback and stores reference ID only | WLT (primary); DSH backend (callback) | WLT (external boundary); app-client (WltBoundaryBanner) | DSH backend callback handler; control-panel finance (read-only) | app-captain (N/A); app-partner (N/A: intake is 003D); app-field (N/A: J-006); WLT wallet mutation (excluded: WLT owns entirely) | Pay via WLT; (auto) receive callback; retry on WLT failure | awaiting_wlt_confirmation, payment_confirmed, payment_failed, loading, error | WLT-owned (payment); DSH stores reference ID only | BLOCKED_BY_WLT — POST /checkout/payment-callback not designed; WLT callback spec not published; 003B PASS required | Full WLT ownership — DSH callback only; no finance mutation | WLT-managed auth | yes — WltBoundaryBanner states required | NEEDS_WLT_RUNTIME_PROOF | WLT callback spec published + 003B PASS + POST /checkout/payment-callback designed + WLT E2E proven + DSH callback proven | BLOCKED_WITH_REASON — WLT runtime proof + callback spec + 003B PASS required; slice fully upgraded (DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700) | Await WLT callback spec + WLT runtime proof + 003B PASS; do NOT start 003D or 003E until 003C PASS |
| `DSH-SLICE-003D` | J-003 | DSH creates order record on WLT payment confirmation; hands off to partner + ops monitor | DSH backend (automated); app-partner; control-panel ops | DSH backend / order service | app-partner (intake); control-panel ops monitor | app-captain (N/A: assigned in J-005); app-field (N/A: J-006); WLT (excluded: already provided payment confirmation) | (auto) create order; view order (client); view new order (partner) | payment_confirmed, order_CREATED, order_creation_failed, notification_sent, loading, error | DSH backend domain (order record); WLT payment reference (read-only) | BLOCKED — POST /orders not designed; requires 003B + 003C PASS | DSH reads WLT payment reference ID only; no DSH finance mutation | DSH internal + partner + operator auth | yes — client confirmation + partner intake + CP ops monitor | NEEDS_RUNTIME_EVIDENCE | 003B + 003C PASS + POST /orders designed + backend + DB migration + partner notification proven + runtime proof | BLOCKED_WITH_REASON — depends on 003B + 003C PASS; slice fully upgraded (DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700) | Await 003B + 003C PASS; do NOT start J-004 partner lifecycle until 003D PASS |
| `DSH-SLICE-003E` | J-003 | Client receives failure feedback + recovery path when WLT payment fails; cart preserved | client | app-client / CheckoutFailureScreen | DSH backend (failure callback); app-client cart (preserved) | app-captain (N/A); app-partner (N/A); app-field (N/A: J-006); control-panel (NOT_APPLICABLE at this step — escalation in J-004) | retry payment; cancel checkout; contact support | payment_failed, retry_in_progress, cancelled, cart_preserved, loading, error | WLT-owned (failure reason); DSH stores failure event | BLOCKED — DELETE /checkout/intent/{id} not designed; WLT failure error spec not published; 003C PASS required | WLT owns failure reason; DSH displays only; no finance mutation | client auth (session from 003B) | yes — 6 states + cart preserved state | NEEDS_RUNTIME_EVIDENCE | 003C PASS + WLT error spec + CheckoutFailureScreen built + registered + DELETE /checkout/intent designed + backend + runtime + visual proof | BLOCKED_WITH_REASON — 003C PASS + WLT error spec required; REQUIRED_ADDITION: CheckoutFailureScreen not yet in screen registry; slice fully upgraded (DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700) | Await 003C PASS + WLT error spec; build + register CheckoutFailureScreen; J-003 NOT closed until 003E PASS |
| `DSH-SLICE-004A` | J-004 | Client views order tracking timeline | client | app-client (orders) | partner (lifecycle events), captain (milestones), control-panel | WLT (N/A: read-only order events) | view timeline; open details; contact support | loading, error, success, offline, cancelled | preview/local-state | NOT_READY_FOR_API | WLT owns refund only | client auth | yes | NEEDS_RUNTIME_EVIDENCE | Order event API + timeline screen proven | DEFERRED_WITH_REASON — depends on J-003 closure | Close J-003 first |
| `DSH-SLICE-004B` | J-004 | Partner accepts/rejects/prepares/marks ready | partner | app-partner (orders) | control-panel (ops visibility), app-client (order status) | app-captain (N/A: not yet assigned) | accept; reject; prepare; mark ready | loading, empty, error, success, offline, blocked, retry | preview/local-state | NOT_READY_FOR_API | WLT only if reversal becomes financial | partner auth | yes | NEEDS_RUNTIME_EVIDENCE | Partner acceptance + handoff API proven | DEFERRED_WITH_REASON — depends on 003D | Close 003D first |
| `DSH-SLICE-004C` | J-004 | Support escalation link: client raises support ticket | client, operator | app-client + control-panel (support) | partner (context owner) | app-captain (N/A: support not delivery) | raise issue; attach evidence; escalate | loading, success, error | preview/local-state | NOT_READY_FOR_API | WLT only if financial outcome | client + operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Support ticket API + escalation flow proven | DEFERRED_WITH_REASON | Create support API slice first |
| `DSH-SLICE-004D` | J-004 | Cancellation request: client cancels an active order | client, partner | app-client + app-partner | control-panel (audit) | app-captain (N/A: delivery not started) | request cancellation; confirm cancellation; reject cancellation | loading, success, error, blocked | preview/local-state | NOT_READY_FOR_API | WLT only if refund is triggered | client + partner auth | yes | NEEDS_RUNTIME_EVIDENCE | Cancellation API + cross-surface state proven | DEFERRED_WITH_REASON — depends on 003D/004B | Close 003D + 004B first |
| `DSH-SLICE-004E` | J-004 | Refund pending WLT bridge: DSH surfaces show refund status | client, operator | app-client + control-panel | WLT (refund executor) | app-captain (N/A: not party to refund) | view refund status | loading, success, pending, error | WLT-owned | BLOCKED_BY_WLT | WLT owns refund execution | WLT-managed | yes | NEEDS_WLT_RUNTIME_PROOF | WLT refund API + refund status screen proven | BLOCKED_WITH_REASON — WLT owns refund | Keep blocked until WLT provides refund proof |
| `DSH-SLICE-004F` | J-004 | Control-panel exception / audit queue for order issues | operator | control-panel (support/operations) | app-client (support input), app-partner (order state), app-captain (delivery state) | app-field (N/A) | view exception queue; assign; resolve | loading, success, error, retry, blocked | preview/local-governance-state | NOT_READY_FOR_API | WLT only if financial escalation | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Exception queue API + control-panel screen proven | DEFERRED_WITH_REASON — depends on J-003/J-004 runtime | Close J-003 + earlier J-004 slices first |
| `DSH-SLICE-005A` | J-005 | Captain assignment: captain is assigned to an order | operator, system | control-panel (dispatch) | app-captain (assignment receiver), app-partner (order state) | app-client (N/A: dispatching not client-initiated) | assign captain; view assignment | loading, success, error | preview/local-state | NOT_READY_FOR_API | WLT payout deferred | operator + captain auth | yes | NEEDS_RUNTIME_EVIDENCE | Assignment API + dispatch screen proven | DEFERRED_WITH_REASON — depends on J-004 partner-ready | Close J-004 partner-ready slices first |
| `DSH-SLICE-005B` | J-005 | Captain accepts or declines and handles no-show | captain | app-captain | control-panel (reassignment), app-partner (handoff state) | WLT (N/A: not financial yet) | accept; decline; mark no-show | loading, success, error, retry | preview/fixture/local-state | NOT_READY_FOR_API | WLT payout deferred | captain auth | yes | NEEDS_RUNTIME_EVIDENCE | Accept/decline API + captain screen proven | DEFERRED_WITH_REASON — depends on 005A | Close 005A first |
| `DSH-SLICE-005C` | J-005 | Pickup handoff proof: captain arrives at partner store | captain, partner | app-captain + app-partner | control-panel (ops visibility) | app-client (N/A: pickup is backend) | confirm arrival; confirm pickup | loading, success, error | preview/fixture | NOT_READY_FOR_API | WLT payout deferred | captain + partner auth | yes | NEEDS_RUNTIME_EVIDENCE | Pickup API + screen proof for both surfaces | DEFERRED_WITH_REASON — depends on 005B | Close 005B first |
| `DSH-SLICE-005D` | J-005 | Trip milestones and map tracking | captain, client | app-captain (map) + app-client (tracking) | control-panel (ops map), app-partner (handoff confirmed) | WLT (N/A: tracking not financial) | update location; view trip; see milestone | loading, success, error, retry | preview/fixture | NOT_READY_FOR_API | WLT payout deferred | captain + client auth | yes | NEEDS_RUNTIME_EVIDENCE | Milestones API + map screen on both surfaces proven | DEFERRED_WITH_REASON — depends on 005C | Close 005C first |
| `DSH-SLICE-005E` | J-005 | Proof of delivery: captain submits PoD | captain | app-captain (PoD submission) | app-client (delivered state), control-panel (audit) | WLT (N/A: payout calculated elsewhere) | submit PoD photo; confirm delivery | loading, success, error, retry | preview/fixture | NOT_READY_FOR_API | WLT payout deferred | captain auth | yes | NEEDS_RUNTIME_EVIDENCE | PoD API + screen proof captured | DEFERRED_WITH_REASON — depends on 005D | Close 005D first |
| `DSH-SLICE-005F` | J-005 | Failure / return / operational closure of delivery | captain, operator | app-captain + control-panel (ops) | app-partner (reversal state), app-client (failed delivery state) | WLT appears if complaint becomes financial | report failure; initiate return; close order | loading, success, error, blocked | preview/fixture | NOT_READY_FOR_API | WLT only if complaint financial | captain + operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Failure/return API + cross-surface screen proof | DEFERRED_WITH_REASON — depends on 005E | Close 005E first |
| `DSH-SLICE-006A` | J-006 | Field agent opens candidate store and submits onboarding readiness | field | app-field (stores/onboarding) | control-panel (approvals), app-partner (readiness reflection) | app-captain (N/A); WLT (N/A) | open candidate; submit onboarding | loading, empty, error, success, offline, disabled | preview/local-state | NOT_READY_FOR_API | none | field auth | yes | NEEDS_RUNTIME_EVIDENCE | Onboarding submission API + field screen proven | DEFERRED_WITH_REASON — slice manifest not yet created | Create slice manifest |
| `DSH-SLICE-006B` | J-006 | Field visit evidence: captain captures visit and evidence | field | app-field (visits) | control-panel (approvals) | app-captain (N/A: field not captain); WLT (N/A) | capture evidence; submit visit | loading, empty, error, success, offline, disabled, blocked, retry | preview/local-state | NOT_READY_FOR_API | none | field auth | yes | NEEDS_RUNTIME_EVIDENCE | Visit evidence API + field screen proven | DEFERRED_WITH_REASON — depends on 006A | Close 006A first |
| `DSH-SLICE-006C` | J-006 | Documents / media / missing proof handling in field readiness | field, operator | app-field + control-panel | app-partner (receives approval/rejection) | WLT (N/A) | upload doc; flag missing proof; resolve | loading, error, success, blocked | dsh/frontend/media-fixtures (preview) | NOT_READY_FOR_API | none | field + operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Document/media API + cross-surface screen proven | DEFERRED_WITH_REASON — depends on 006B | Close 006B first |
| `DSH-SLICE-006D` | J-006 | Readiness escalation: field agent escalates a blocker | field, operator | app-field + control-panel | app-partner (escalation receiver) | WLT (N/A) | escalate; view escalation queue | loading, error, success, blocked | preview/local-state | NOT_READY_FOR_API | none | field + operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Escalation API + cross-surface screen proven | DEFERRED_WITH_REASON — depends on 006C | Close 006C first |
| `DSH-SLICE-006E` | J-006 | Control-panel approval and partner readiness reflection | operator, partner | control-panel + app-partner | app-field (submitter) | WLT (N/A) | approve readiness; reject readiness; view partner status | loading, success, error | domain | NOT_READY_FOR_API | none | operator + partner auth | yes | NEEDS_RUNTIME_EVIDENCE | Approval API + partner status screen + CP screen proven | DEFERRED_WITH_REASON — depends on 006D | Close 006D first |
| `DSH-SLICE-007A` | J-007 | Central preview data ownership: single source for all DSH preview data | domain | dsh/frontend/data | all surfaces (consumers) | WLT (N/A: WLT has own data) | N/A — governance | N/A | dsh/frontend/data owns preview | no API candidate | none | N/A | N/A — governance | guard checks | Preview data contracts validated; no divergent local copies | ACTIVE_GOVERNANCE — perpetual rule | Perpetual: enforce via guard |
| `DSH-SLICE-007B` | J-007 | Media-fixtures ownership and mediaKey rules: governed central media | domain, operator | dsh/frontend/media-fixtures | all surfaces (consumers) | WLT (N/A) | N/A — governance | N/A | media-fixtures; domain owns mediaKey rules | no API candidate | none | N/A | guard enforces MANIFEST.local-required.tsv | guard checks | Media manifest guard passes; no orphan media | ACTIVE_GOVERNANCE — perpetual rule | Perpetual: enforce via guard-dsh-media-manifest |
| `DSH-SLICE-007C` | J-007 | No local divergent demo copies: eliminate duplicate preview data | domain | all DSH surfaces | N/A | N/A | N/A — governance | N/A | dsh/frontend/data is single owner | no API candidate | none | N/A | N/A — governance | guard checks | No surface has its own demo copy contradicting canonical preview data | ACTIVE_GOVERNANCE — perpetual rule | Perpetual: enforce via guard-dsh-shared-foundations |
| `DSH-SLICE-007D` | J-007 | Adapters / view-models / on-demand detail loading: surfaces use adapters only | domain | all DSH surfaces | N/A | N/A | N/A — governance | N/A | domain owns adapters | no API candidate | none | N/A | N/A — governance | N/A | All surface detail loads go through adapters; no raw preview in screens | ACTIVE_GOVERNANCE — perpetual rule | Perpetual: audit on each slice manifest |
| `DSH-SLICE-008A` | J-008 | Provider policy classification: all providers classified for DSH | operator | control-panel (platform) | all DSH surfaces (consumers) | WLT (N/A: WLT has own policy) | view provider policy; classify | loading, success, error | domain | NOT_READY_FOR_API | none | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Provider policy API + CP screen proven | DEFERRED_WITH_REASON — slice manifest not yet created | Create slice manifest |
| `DSH-SLICE-008B` | J-008 | Feature flags / rollout / disable-enable preview | operator | control-panel (platform/rollouts) | all DSH surfaces (flag consumers) | WLT (N/A) | enable flag; disable flag; view rollout status | loading, success, error | domain/platform | NOT_READY_FOR_API | none | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Feature flag API + rollout screen proven | DEFERRED_WITH_REASON — slice manifest not yet created | Create slice manifest |
| `DSH-SLICE-008C` | J-008 | Vars scope/precedence/audit/rollback preview | operator | control-panel (platform/vars) | all DSH surfaces (var consumers) | WLT (N/A) | set var; audit var; rollback var | loading, success, error | domain/platform | NOT_READY_FOR_API | none | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Vars API + audit screen proven | DEFERRED_WITH_REASON — slice manifest not yet created | Create slice manifest |
| `DSH-SLICE-008D` | J-008 | Policy impact on visibility and serviceability: vars/policy affect store exposure | domain | all DSH surfaces | N/A | WLT (N/A) | N/A — policy evaluation | N/A | domain/platform | no standalone API | none | N/A | N/A — governance | policy evaluation test | Policy changes propagate to visibility gate correctly | DEFERRED_WITH_REASON — depends on 008A–008C | Close 008A/B/C first |
| `DSH-SLICE-009A` | J-009 | Operations queue and risk inspection | operator | control-panel (operations/command-center) | all DSH surfaces (data sources) | WLT (N/A: ops not financial) | view queue; inspect risk; filter | loading, success, error, retry, blocked | preview/local-governance-state | BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING (catalog-approval / marketing-visibility) | none | operator auth | yes | NEEDS_RUNTIME_EVIDENCE — screen proof pending | CP operations screen proof with Go API running | FIX_REQUIRED — SCREEN_API_MATRIX shows FRONTEND_BINDING_PENDING; CONTRA-002 | Capture CP screen proof; update matrix |
| `DSH-SLICE-009B` | J-009 | Dispatch assignment and reassign preview | operator | control-panel (operations/dispatch) | app-captain (assignment receiver), app-partner (order state) | WLT (N/A) | assign; reassign; view dispatch board | loading, success, error, blocked | preview/local-governance-state | NOT_READY_FOR_API | none | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Dispatch assignment API + CP screen proven | DEFERRED_WITH_REASON — depends on J-005 | Close J-005 first |
| `DSH-SLICE-009C` | J-009 | Exception / support escalation queues | operator | control-panel (operations/exceptions) | all DSH surfaces (exception sources) | WLT (N/A: unless financial) | view escalation; assign; resolve | loading, success, error, blocked | preview/local-governance-state | NOT_READY_FOR_API | WLT only if financial escalation | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Exception API + escalation queue screen proven | DEFERRED_WITH_REASON — depends on J-004 | Close J-004 first |
| `DSH-SLICE-009D` | J-009 | Audit / rollback / operation record classification | operator | control-panel (administration/audit) | all DSH surfaces (audit sources) | WLT (N/A: audit is governance) | view audit log; rollback; classify record | loading, success, error | domain/platform | NOT_READY_FOR_API | none | operator auth | yes | NEEDS_RUNTIME_EVIDENCE | Audit API + administration screen proven | DEFERRED_WITH_REASON — slice manifest not yet created | Create slice manifest |
| `DSH-SLICE-010A` | J-010 | DSH read-only WLT bridge: DSH CP shows finance visibility without mutation | operator | control-panel (finance) | WLT surfaces (data source) | all DSH business surfaces (excluded: no DSH financial mutation) | view finance summary | loading, success, error, blocked | WLT-owned | BLOCKED_BY_WLT | full WLT financial boundary | WLT-managed | yes | NEEDS_WLT_RUNTIME_PROOF | WLT finance read API + CP finance screen proven | BLOCKED_WITH_REASON — WLT owns all finance; DSH reads only | Keep blocked until WLT provides runtime proof |
| `DSH-SLICE-010B` | J-010 | Settlement input candidate classification: DSH classifies settlement eligibility signals | domain | control-panel (finance) | WLT (settlement processor) | all DSH mobile surfaces (excluded: no money on mobile) | classify candidate; view pending | loading, success, error | WLT-owned signals | BLOCKED_BY_WLT | WLT owns settlement | WLT-managed | yes | NEEDS_WLT_RUNTIME_PROOF | WLT settlement API + classification screen proven | BLOCKED_WITH_REASON — WLT settlement not proven | Keep blocked |
| `DSH-SLICE-010C` | J-010 | Refund/payout/ledger blocked-by-WLT rules: DSH enforces no-mutation boundary | domain | all DSH surfaces | WLT (enforcement owner) | N/A — governance rule | N/A — enforcement | N/A | WLT-owned | none (DSH does not call refund/payout APIs) | full WLT financial boundary | N/A | N/A — governance | guard/type-check | No DSH surface calls WLT financial mutation APIs | ACTIVE_GOVERNANCE — perpetual enforcement | Perpetual: enforce via service boundary rules |
| `DSH-SLICE-010D` | J-010 | Finance screens ownership: all finance screens are WLT-owned; DSH shows banners only | domain, WLT | control-panel (finance) | DSH surfaces (banner consumers) | N/A | N/A — governance | N/A | WLT-owned | none (DSH shows WltBoundaryBanner.tsx only) | full WLT financial boundary | N/A | N/A — governance | N/A | All finance screens are WLT-owned; WltBoundaryBanner.tsx is the only DSH surface element | ACTIVE_GOVERNANCE — perpetual rule | Perpetual: enforce via service boundary rules |

---

## DSH-SLICE-001 Legacy Grouping

`DSH-SLICE-001` (in the Initial Editable Cross-Surface Slice Matrix above) is the **Parent Journey Slice Group** for Journey J-001. It maps to execution sub-slices `DSH-SLICE-001A` through `DSH-SLICE-001F`.

The full slice manifest is at `dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md`.

**Important**: DSH-SLICE-001's `Final Slice Decision: PASS` in the legacy matrix is disputed by CONTRA-001 through CONTRA-004 documented in `dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md`. The PASS stands as the most recent CLOSURE_DECISION_LOG entry (DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700) but requires RUNTIME_EVIDENCE_MATRIX and SCREEN_API_MATRIX updates to be fully consistent. Until those matrices are updated, the status is `PASS_WITH_WARNINGS — matrix update required`.

---

## Known Contradictions / FIX_REQUIRED

See `dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md` § Known Contradictions for the full table.

| ID | Files | Description | Status |
|---|---|---|---|
| CONTRA-001 | CLOSURE_DECISION_LOG vs RUNTIME_EVIDENCE_MATRIX (DSH-RUN-P014-04, DSH-RUN-P014-07) | Log claims full proof; matrix shows FRONTEND_TRANSPORT_BOUND__SCREEN_PROOF_PENDING for partner + CP | FIX_REQUIRED — update matrix with evidence path |
| CONTRA-002 | CLOSURE_DECISION_LOG vs SCREEN_API_MATRIX (DSH-SAPI-P014-05, DSH-SAPI-P014-10) | Log claims all gates proven; API matrix shows FRONTEND_BINDING_PENDING for partner + CP | FIX_REQUIRED — update API matrix with evidence path |
| CONTRA-003 | DSH_SLICE_COVERAGE_MANIFEST (PASS for DSH-SLICE-001) vs CONTRA-001+002 | Manifest PASS while two evidence matrices show pending | PASS_WITH_WARNINGS — pending matrix updates |
| CONTRA-004 | DSH-SLICE-001-STORE-DISCOVERY.md (all surfaces PASS) vs RUNTIME_EVIDENCE_MATRIX | Slice manifest PASS for partner + CP surfaces; matrices show screen proof pending | FIX_REQUIRED — update matrices |
