# DSH Service Flow Model — Loop 2

Status: DONE_LOCAL
Loop: 2
Date: 2026-05-15
Source: DSH_PHASE_3R_OPERATING_LOGIC_MODEL.md + dshCrossSurfaceClosureMap.ts

## Scope

UI/UX Flow Logic Closure only. This is a preview operating model — not a runtime,
backend, domain, or API contract. All financial semantics are WLT-owned.

---

## Canonical lifecycle — 22 states

| # | State | Primary Actor | Surface | DSH Role | Next State | Finance |
|---|---|---|---|---|---|---|
| 1 | `discovery` | client | app-client | Preview browse and catalog | storefront | none |
| 2 | `storefront` | client | app-client | Preview store and item browse | cart | none |
| 3 | `cart` | client | app-client | Preview cart review and edit | checkout_intent | WLT totals display only |
| 4 | `checkout_intent` | client | app-client | Preview checkout request + serviceability | serviceability_quote | WLT intent only |
| 5 | `serviceability_quote` | DSH | app-client | Preview quote display (ETA / fee visibility) | payment_decision_by_WLT | WLT fee display only |
| 6 | `payment_decision_by_WLT` | WLT | WLT | Payment method / wallet / COD / result | order_draft | **WLT-owned** |
| 7 | `order_draft` | DSH | app-client | Assemble order preview after payment decision | order_created_preview | none |
| 8 | `order_created_preview` | DSH | app-client | Client-visible order created state | partner_intake | none |
| 9 | `partner_intake` | partner | app-partner | Receive order in inbox | partner_accept OR partner_reject | none |
| 10 | `partner_accept` | partner | app-partner | Accept and commit to preparation | partner_prepare | none |
| 11 | `partner_reject` | partner | app-partner | Reject order with reason | support_exception | WLT reversal if needed |
| 12 | `partner_prepare` | partner | app-partner | Prepare order | partner_ready | none |
| 13 | `partner_ready` | partner | app-partner | Mark ready for pickup | captain_assignment | none |
| 14 | `captain_assignment` | control-panel / captain | control-panel + app-captain | Assign or expose offer | captain_accept | none |
| 15 | `captain_accept` | captain | app-captain | Accept offer, start route readiness | captain_arrive_pickup | none |
| 16 | `captain_arrive_pickup` | captain | app-captain | Arrive at pickup | captain_pickup | none |
| 17 | `captain_pickup` | captain | app-captain | Confirm pickup | out_for_delivery | COD flag (WLT) |
| 18 | `out_for_delivery` | captain | app-captain | In-transit delivery state | arrive_dropoff | none |
| 19 | `arrive_dropoff` | captain | app-captain | Arrive at dropoff | proof_of_delivery | none |
| 20 | `proof_of_delivery` | captain | app-captain | Submit proof or record failure | delivered | none |
| 21 | `delivered` | DSH | app-client + control-panel | Show delivered to client and ops | rating | WLT aftercare |
| 22 | `rating` | client | app-client | Post-delivery rating | control_panel_audit | none |
| — | `support_exception` | any | all surfaces | Hold operational issue or complaint | refund_by_WLT OR control_panel_audit | WLT if financial |
| — | `refund_or_adjustment_by_WLT` | WLT | WLT | Execute refund / adjustment | control_panel_audit | **WLT-owned** |
| — | `control_panel_audit` | operator | control-panel | Review lifecycle evidence | terminal | none |

---

## Cross-surface signal model (from dshCrossSurfaceClosureMap.ts)

| Surface | Actor | Area | Lifecycle Step | Closure Status | Runtime Binding |
|---|---|---|---|---|---|
| app-client | client | client-discovery | discovery | UI_PREVIEW_ONLY | closed (preview) |
| app-client | client | client-cart-checkout | checkout | UI_PREVIEW_ONLY | closed (preview) |
| app-client | client | client-tracking-support | tracking | UI_PREVIEW_ONLY | closed (preview) |
| app-partner | partner | partner-intake-prep | order-intake | UI_PREVIEW_ONLY | closed (preview) |
| app-partner | partner | partner-catalog-readiness | catalog-governance | UI_PREVIEW_ONLY | closed (preview) |
| app-captain | captain | captain-task-pickup | pickup | UI_PREVIEW_ONLY | closed (preview) |
| app-captain | captain | captain-delivery-proof | delivery | UI_PREVIEW_ONLY | closed (preview) |
| app-field | field | field-onboarding | onboarding | UI_PREVIEW_ONLY | closed (preview) |
| app-field | field | field-visit-evidence | visit | UI_PREVIEW_ONLY | closed (preview) |
| control-panel | operator | control-panel-ops | operations-monitoring | UI_PREVIEW_ONLY | closed (preview) |
| control-panel | operator | control-panel-governance | finance-review | UI_PREVIEW_ONLY | closed (preview) |

All entries: `UI_PREVIEW_ONLY` — no runtime binding proven. Runtime evidence remains blocking for all surfaces.

---

## Messaging surfaces

| Pair | App-side Surface | Ops-side Surface | Status |
|---|---|---|---|
| Client ↔ Captain | app-client: OperationScreens (conversation-workspace) / app-captain: DshCaptainOrdersScreen (chat) | — | PARTIAL — ops-side missing |
| Client ↔ Support/Ops | app-client: OperationScreens (conversation-workspace) | control-panel/support: TBD | MISSING ops-side |
| Partner ↔ Ops | app-partner: PartnerOrderConversationPanel (section) | control-panel/support: TBD | MISSING ops-side |
| Captain ↔ Ops | app-captain: DshCaptainSurface (support-screen) | control-panel/support: TBD | MISSING ops-side |

---

## WLT ownership boundary (from operating logic model)

WLT exclusively owns: wallet · payment auth · capture · COD reconciliation · settlement · refund · adjustment · commission · payout · chargeback · ledger

DSH allowed in this phase: preview payment status · blocked/pending/failed intent · finance visibility bridge entry · operational state around checkout/prep/delivery/support/audit

DSH forbidden in this phase: any money semantics · settlement truth · refund truth · payout truth · ledger truth

---

## Runtime binding status — all surfaces

All DSH screens: `UI_PREVIEW_ONLY` until visual evidence, runtime proof, and API contract are provided.
No screen is `RUNTIME_CLOSED`. No API is `READY_FOR_OPENAPI_P0_DESIGN`.
