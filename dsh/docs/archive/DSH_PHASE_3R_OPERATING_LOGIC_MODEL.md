# DSH Phase 3R Operating Logic Model

Status: PREVIEW_CONTRACT_ONLY
Decision: READY_FOR_MANUAL_DESIGN

Purpose:
This file defines the complete DSH preview operating logic before any OpenAPI, backend, domain, persistence, or runtime implementation. It is a planning contract only.

Hard boundaries:
- No section in this file proves runtime truth.
- No section in this file proves backend, domain, or API closure.
- WLT owns all financial semantics; DSH may display preview status or intent only.

## 1. DSH lifecycle canonical

| lifecycle state | primary actor | DSH role now | next allowed state | blocked by | owner note |
|---|---|---|---|---|---|
| `discovery` | `client` | preview browse and destination selection | `storefront` | no store selected, no serviceable destination intent | DSH-owned preview |
| `storefront` | `client` | preview store and item browsing | `cart` | store closed, item unavailable, no item selected | DSH-owned preview |
| `cart` | `client` | preview cart review and edit | `checkout_intent` | empty cart, invalid quantity, blocked item | DSH-owned preview |
| `checkout_intent` | `client` | preview checkout request with serviceability and payment choice | `serviceability_quote` | auth missing, quote unavailable, WLT decision unavailable | DSH owns intent only |
| `serviceability_quote` | `DSH` | preview quote request result, ETA, and fee visibility | `payment_decision_by_WLT` | quote failure, unsupported zone, no retry path | DSH owns quote display only |
| `payment_decision_by_WLT` | `WLT` | payment method, wallet result, COD flag, or pending result | `order_draft` | payment failed, payment pending, WLT unavailable | WLT-owned |
| `order_draft` | `DSH` | assemble order payload preview after quote/payment decision | `order_created_preview` | missing partner/store readiness, invalid address, missing customer intent | DSH owns draft preview only |
| `order_created_preview` | `DSH` | client-visible created order preview | `partner_intake` | no partner intake surface, no canonical status handoff | DSH-owned preview |
| `partner_intake` | `partner` | receive order in inbox or intake dashboard | `partner_accept` or `partner_reject` | auth/capability missing, partner offline, invalid order data | DSH-owned preview |
| `partner_accept` | `partner` | accept order and commit to preparation | `partner_prepare` | unavailable item, store paused, issue raised | DSH-owned preview |
| `partner_reject` | `partner` | reject order with reason | `support_exception` | missing rejection reason, no client notification path | DSH-owned preview, financial reversal by WLT if needed |
| `partner_prepare` | `partner` | prepare order and monitor readiness | `partner_ready` | prep delay, inventory failure, store issue | DSH-owned preview |
| `partner_ready` | `partner` | mark ready for captain pickup | `captain_assignment` | no captain supply, no pickup slot, unresolved issue | DSH-owned preview |
| `captain_assignment` | `control-panel` or `captain` | assign or expose delivery offer | `captain_accept` | no captain available, offer timeout, route unavailable | DSH-owned preview |
| `captain_accept` | `captain` | accept assignment and start route readiness | `captain_arrive_pickup` | route issue, GPS unavailable, captain issue | DSH-owned preview |
| `captain_arrive_pickup` | `captain` | indicate arrival at pickup | `captain_pickup` | partner not ready, pickup blocked, no proof | DSH-owned preview |
| `captain_pickup` | `captain` | confirm pickup | `out_for_delivery` | pickup failed, item mismatch, issue raised | DSH-owned preview |
| `out_for_delivery` | `captain` | in-transit delivery state | `arrive_dropoff` | GPS unavailable, route blocked, customer unreachable | DSH-owned preview |
| `arrive_dropoff` | `captain` | arrive at dropoff point | `proof_of_delivery` | customer absent, proof blocked, issue raised | DSH-owned preview |
| `proof_of_delivery` | `captain` | submit proof or record failure | `delivered` | PoD missing, proof rejected, manual review required | DSH-owned preview |
| `delivered` | `DSH` | show delivered preview to client and control-panel | `rating` | unresolved support exception, PoD review pending | DSH-owned preview |
| `rating` | `client` | submit post-delivery rating | `control_panel_audit` | rating surface unclear, order not fully closed | DSH-owned preview |
| `support_exception` | `client/partner/captain/control-panel` | hold operational issue, failure, or complaint | `refund_or_adjustment_by_WLT` or `control_panel_audit` | no case owner, no evidence, no route back to lifecycle | DSH owns case flow, not money semantics |
| `refund_or_adjustment_by_WLT` | `WLT` | execute refund, void, adjustment, commission reversal, or payout effect | `control_panel_audit` | missing WLT decision or financial evidence | WLT-owned |
| `control_panel_audit` | `control-panel` | review lifecycle evidence and intervention record | terminal preview state | no audit trail, no evidence, unresolved exception | DSH-owned preview and governance only |

## 2. Actor/action matrix

| actor | action family | allowed preview actions now | blocked dependency | output in this phase |
|---|---|---|---|---|
| `client` | browse and order intent | browse discovery, storefront, cart, checkout intent, tracking, support, rating preview | auth for real checkout, WLT for payment decision, runtime proof for real tracking | manual design + future API readiness inputs |
| `partner` | order handling | intake, accept/reject preview, prep/ready preview, inventory issue preview, support preview | auth/capability proof, partner availability rule, runtime handoff proof | manual design + transition rules |
| `captain` | delivery execution | accept assignment preview, route/map preview, pickup/dropoff/PoD preview, issue preview | auth/capability proof, GPS proof, route truth, proof capture truth | manual design + transition rules |
| `field` | onboarding and readiness | store discovery, onboarding preview, visit preview, readiness escalation preview | auth/capability proof, evidence persistence, partner/control-panel ownership rule | manual design + escalation model |
| `control-panel` | governance and intervention | operations preview, support queue preview, partner governance preview, catalog/marketing governance preview, finance visibility preview | runtime action proof, audit persistence, WLT finance authority | manual design + future API boundary |
| `WLT` | financial semantics | payment decision preview bridge, finance visibility preview bridge | WLT runtime proof, auth, ledger/payout/refund systems | ownership boundary only |
| `auth/capability` | access gating | implied but not proven across partner/captain/field/control-panel and real checkout | real auth provider and capability wiring | explicit blocker, not implementation |

## 3. Transition rules

| from state | to state | what moves it forward | what blocks it | what creates support exception | control-panel intervention | WLT-only concern | preview-only note |
|---|---|---|---|---|---|---|---|
| `discovery` | `storefront` | client opens a store or category destination | no store, invalid destination, closed store | broken destination intent | not required normally | none | current surfaces prove browse only |
| `storefront` | `cart` | add item to cart | unavailable item, closed store, invalid quantity | item unavailable without fallback | only if catalog mismatch becomes operational issue | none | add-to-cart is preview logic only |
| `cart` | `checkout_intent` | client confirms cart and delivery preference | empty cart, blocked line, invalid address | repeated cart failure or unsupported location | only if systemic issue becomes visible | totals may preview WLT-owned money | no real write or reservation |
| `checkout_intent` | `serviceability_quote` | client requests quote or order estimate | auth missing, serviceability unavailable, quote source missing | quote cannot be produced | monitor repeated failures only | fee/payment fields are not DSH-owned | no API/provider is active |
| `serviceability_quote` | `payment_decision_by_WLT` | quote visible and client selects payment path | quote expired, unsupported zone, missing payment bridge | inconsistent quote or route failure | visibility only | payment choice, wallet state, COD handling semantics | quote is preview-only now |
| `payment_decision_by_WLT` | `order_draft` | WLT returns paid, pending, failed, or COD decision | pending payment, failed payment, no bridge result | payment failed or ambiguous | expose blocked/pending case | fully WLT-owned | DSH stores only display intent |
| `order_draft` | `order_created_preview` | DSH assembles a valid order preview after quote/payment decision | missing address/store/partner readiness | draft cannot be completed | monitor incomplete drafts if repeated | none | no backend creation occurs |
| `order_created_preview` | `partner_intake` | preview order becomes partner-visible inbox item | no partner intake path, invalid status mapping | client sees created but partner cannot see intake | must review visibility gap | financial effects remain outside DSH | preview handoff only |
| `partner_intake` | `partner_accept` / `partner_reject` | partner makes explicit decision | auth missing, store paused, no reason flow | partner rejection, delayed response | yes, when SLA or readiness is impacted | if payment reversal is needed later | no runtime decision effect exists |
| `partner_accept` | `partner_prepare` | partner confirms preparation start | unavailable item, partner issue, paused store | prep cannot start or item unavailable | yes, if issue requires re-route or support | none | state is UI-preview only |
| `partner_prepare` | `partner_ready` | partner marks order ready | delay, inventory mismatch, support issue | partner delayed beyond tolerance | yes, if delay triggers escalation | none | no real timers or provider truth |
| `partner_ready` | `captain_assignment` | order enters delivery supply queue | no captain available, partner issue unresolved | ready but unassigned or delayed | yes, for manual reassignment or delay note | none | supply is preview-only |
| `captain_assignment` | `captain_accept` | captain accepts assignment | no captain, timeout, route unavailable | captain unavailable or repeated timeout | yes, manual assignment needed | none | assignment is not live-dispatch truth |
| `captain_accept` | `captain_arrive_pickup` | route becomes actionable | GPS unavailable, captain issue | route blocked or captain support needed | yes, to reassign or pause | none | map is preview only |
| `captain_arrive_pickup` | `captain_pickup` | pickup confirmed | partner not ready, proof missing | pickup failed or delayed | yes, if partner/captain issue persists | none | no verified pickup evidence store |
| `captain_pickup` | `out_for_delivery` | order leaves pickup point | wrong order, unresolved issue | pickup mismatch | yes, if manual review required | COD collection note may exist but money is WLT-owned | no live transport truth |
| `out_for_delivery` | `arrive_dropoff` | route reaches customer area | GPS unavailable, customer unreachable | delivery delay, route issue | yes, intervene on SLA risk | none | tracking is preview timeline only |
| `arrive_dropoff` | `proof_of_delivery` | captain can submit proof or completion note | customer absent, app issue, proof path missing | failed dropoff or dispute risk | yes, review support case | none | no live proof pipeline |
| `proof_of_delivery` | `delivered` | acceptable proof exists | PoD missing, proof rejected, manual review needed | PoD missing or disputed delivery | yes, manual review required | none | proof remains design contract only |
| `delivered` | `rating` | delivery is closed at preview level | unresolved exception, missing review, pending WLT financial issue | complaint after delivery | yes, if complaint opens case | financial aftercare remains WLT-owned | delivery closure is preview only |
| `support_exception` | `refund_or_adjustment_by_WLT` / `control_panel_audit` | case has owner, evidence, and financial/non-financial classification | no evidence, no owner, no resolution route | unresolved complaint or dispute | yes, always when issue crosses surface boundaries | refund, void, adjustment, commission, payout, ledger | support exists, but not as runtime case system |

## 4. Failure and escalation model

| failure case | immediate DSH effect | escalation owner | control-panel signal | WLT involvement | current phase decision |
|---|---|---|---|---|---|
| `store closed` | block storefront or checkout intent | `partner` then `control-panel` if persistent | partner readiness / store paused | none | manual design required |
| `item unavailable` | block add-to-cart, prep, or pickup accuracy | `partner` | inventory issue / customer impact | none | manual design required |
| `quote unavailable` | block checkout intent progression | `control-panel` only for systemic visibility | serviceability/quote failure | none | not ready for API |
| `WLT payment pending` | keep order blocked or pending | `WLT` with client visibility in DSH | blocked checkout / finance pending | required | not ready for API |
| `WLT payment failed` | stop order progression before order-created preview | `WLT` | failed payment / retry path | required | not ready for API |
| `COD selected` | keep non-card flow visible and flag collection requirement | `captain` + `control-panel` visibility | COD note / collection flag | ledger and reconciliation remain WLT-owned | candidate later only after proof |
| `partner rejected` | create client-visible failure branch and partner reason | `partner`, then `control-panel` if repeated | rejection reason / exception case | WLT only if payment reversal needed | manual design required |
| `partner delayed` | keep order in prep or exception | `partner` then `control-panel` | prep delay / SLA risk | none | manual design required |
| `captain unavailable` | stall assignment or force manual reassignment | `control-panel` | no supply / manual delay | none | manual design required |
| `captain GPS unavailable` | degrade route readiness and tracking confidence | `captain` then `control-panel` | map degraded / ETA unreliable | none | manual design required |
| `pickup failed` | prevent out-for-delivery transition | `captain + partner + control-panel` | pickup failure / handoff blocked | none | manual design required |
| `delivery failed` | prevent delivered closure | `captain + control-panel` | failed delivery / reattempt or support | possible if financial adjustment is needed later | manual design required |
| `PoD missing` | prevent delivered closure | `control-panel` | proof review required | none | manual design required |
| `customer complaint` | open support exception | `support/control-panel` | complaint queue / severity | WLT only if financial | manual design required |
| `refund needed` | keep case open until classified as financial | `control-panel` for case, `WLT` for money | refund candidate / financial classification | required | not ready for API |
| `manual control-panel intervention` | override preview path with governance action | `control-panel` | intervention record / audit note | maybe, if finance is touched | preview governance only |

## 5. WLT ownership law

WLT-only semantics:
- wallet
- payment authorization
- payment capture
- COD reconciliation
- settlement
- refund
- adjustment
- commission
- payout
- chargeback
- ledger

DSH-only allowed role in this phase:
- show preview payment status
- show blocked/pending/failed payment intent
- show finance visibility bridge entry
- carry non-financial operational state around checkout, intake, prep, delivery, support, and audit

DSH forbidden role in this phase:
- own money semantics
- define settlement truth
- define refund truth
- define payout truth
- define ledger truth
- define chargeback truth

Current outcome:
- The DSH preview operating logic is strong enough to drive manual design and future API planning vocabulary.
- It is not strong enough to justify runtime, backend, domain, or WLT-ledger closure claims.
