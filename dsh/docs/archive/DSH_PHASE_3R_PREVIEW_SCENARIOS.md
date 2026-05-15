# DSH Phase 3R Preview Scenarios

Status: PREVIEW_SCENARIOS_ONLY
Decision: READY_FOR_MANUAL_DESIGN

Rule:
Each scenario below is testable as preview logic and manual-design input only. None of them proves runtime, backend, domain, or WLT-ledger closure.

## 1. Happy path

| field | detail |
|---|---|
| `actors` | `client`, `partner`, `captain`, `control-panel`, `WLT` |
| `preconditions` | client can browse discovery and storefront preview; cart has valid items; partner is available; captain supply exists; WLT payment decision preview is reachable |
| `steps` | 1. client opens discovery and store. 2. client adds items to cart. 3. client enters checkout intent. 4. WLT returns payment-approved or COD-accepted decision. 5. order becomes `order_created_preview`. 6. partner accepts and prepares. 7. partner marks ready. 8. captain accepts and picks up. 9. captain completes dropoff and PoD. 10. client sees delivered state and rating entry. |
| `expected visible screens` | `HomeScreen`, `StoreScreen`, `CartScreen`, `OrdersTrackingScreens`, `OrdersInboxScreen`, `DshCaptainOrdersScreen`, `DshCaptainMapScreen`, `OperationsHubScreen` |
| `expected states` | `ready -> success -> ready -> success -> delivered -> rating` |
| `DSH-owned data` | discovery intent, storefront selection, cart lines, quote display, order-created preview, partner/captain milestone labels, support status, audit labels |
| `WLT-owned data` | payment decision, wallet/card/COD semantics, any financial status wording beyond preview display |
| `control-panel signals` | new order visible, partner accepted, ready for pickup, captain assigned, delivered, no unresolved exception |
| `missing screen/logic if any` | checkout intent and rating still need sharper manual design contracts; PoD closure needs explicit design |
| `API readiness` | `CANDIDATE_LATER` |

## 2. COD path

| field | detail |
|---|---|
| `actors` | `client`, `partner`, `captain`, `control-panel`, `WLT` |
| `preconditions` | COD is selectable in preview; partner and captain surfaces can display COD flag or collection note |
| `steps` | 1. client reaches checkout intent. 2. client selects COD. 3. WLT returns COD decision preview. 4. order-created preview shows COD flag. 5. partner intake shows COD context. 6. captain sees collection note. 7. control-panel sees COD visibility only. |
| `expected visible screens` | `CartScreen`, `OrdersTrackingScreens`, `OrdersInboxScreen`, `DshCaptainOrdersScreen`, `OperationsHubScreen`, finance visibility surfaces as needed |
| `expected states` | `ready -> success -> ready -> support_required only if collection issue arises` |
| `DSH-owned data` | COD note visibility, order lifecycle labels, non-financial operational milestones |
| `WLT-owned data` | COD reconciliation, cash settlement, collection ledger, payout impact |
| `control-panel signals` | COD flag on order timeline, collection-risk note if issue arises |
| `missing screen/logic if any` | COD collection note and post-delivery reconciliation need manual design and must remain WLT-owned |
| `API readiness` | `NOT_READY` |

## 3. WLT payment pending

| field | detail |
|---|---|
| `actors` | `client`, `control-panel`, `WLT` |
| `preconditions` | checkout intent can surface pending payment state; no order should progress as delivered runtime truth |
| `steps` | 1. client confirms checkout intent. 2. WLT returns `pending`. 3. DSH keeps order blocked or pending. 4. client sees retry/cancel path. 5. control-panel sees blocked financial signal only. |
| `expected visible screens` | `CartScreen`, client order confirmation/tracking preview, `OperationsHubScreen`, finance visibility preview if surfaced |
| `expected states` | `loading -> blocked -> retry or cancelled` |
| `DSH-owned data` | blocked checkout state, pending label, retry/cancel visibility |
| `WLT-owned data` | payment pending decision, retry authorization, failure reason, financial resolution |
| `control-panel signals` | pending financial gate, blocked order progression |
| `missing screen/logic if any` | blocked checkout copy, pending order state, and cancel/retry branch need manual design |
| `API readiness` | `NOT_READY` |

## 4. Partner rejected

| field | detail |
|---|---|
| `actors` | `client`, `partner`, `control-panel`, `WLT` |
| `preconditions` | partner can access intake detail; rejection reason can be surfaced in preview |
| `steps` | 1. order enters partner intake. 2. partner rejects with reason. 3. client is notified in preview order state. 4. control-panel sees rejection exception. 5. if money needs reversal, WLT handles void/refund path. |
| `expected visible screens` | `OrdersInboxScreen`, `OrdersTrackingScreens`, `OperationsHubScreen`, support/finance visibility surfaces as needed |
| `expected states` | `ready -> rejected -> support_required or cancelled` |
| `DSH-owned data` | rejection reason display, client notification state, control-panel exception visibility |
| `WLT-owned data` | void/refund/adjustment if money reversal is required |
| `control-panel signals` | rejection case, partner readiness impact, support exception entry |
| `missing screen/logic if any` | explicit rejection reason template and client notification state still need manual design |
| `API readiness` | `CANDIDATE_LATER` |

## 5. Captain unavailable

| field | detail |
|---|---|
| `actors` | `partner`, `captain`, `control-panel` |
| `preconditions` | order is partner-ready; captain supply can be previewed in control-panel |
| `steps` | 1. partner marks order ready. 2. no captain accepts or no captain is available. 3. control-panel sees supply gap. 4. order is delayed or manually reassigned. |
| `expected visible screens` | `OrdersInboxScreen`, `DshCaptainOrdersScreen`, `OperationsHubScreen`, `DispatchAssignmentScreen` |
| `expected states` | `ready -> support_required -> delayed or reassigned` |
| `DSH-owned data` | ready-for-pickup status, no-captain warning, manual delay note, reassignment visibility |
| `WLT-owned data` | none unless later payout/adjustment impact exists |
| `control-panel signals` | unassigned order, delay risk, captain supply shortage, reassignment action |
| `missing screen/logic if any` | reassignment outcome and customer-visible delay state need manual design |
| `API readiness` | `CANDIDATE_LATER` |

## 6. Field support needed

| field | detail |
|---|---|
| `actors` | `field`, `partner`, `control-panel` |
| `preconditions` | field agent is visiting or onboarding a store; readiness may be blocked |
| `steps` | 1. field agent opens onboarding or visit flow. 2. field agent detects store issue. 3. field agent escalates to partner or control-panel. 4. readiness stays blocked or pending. 5. partner/control-panel reviews next step. |
| `expected visible screens` | `DshFieldStoresScreen`, `DshFieldStoreOnboardingScreen`, `DshFieldStoreVisitScreen`, `ControlPanelDshPartnerApprovalsScreen`, `OperationsHubScreen` |
| `expected states` | `ready -> support_required -> success or rejected` |
| `DSH-owned data` | visit notes, readiness status, escalation target, blocked reason |
| `WLT-owned data` | none |
| `control-panel signals` | partner-readiness queue, escalated blocker, missing readiness sign-off |
| `missing screen/logic if any` | readiness sign-off, escalation return path, and blocked-state language need manual design |
| `API readiness` | `CANDIDATE_LATER` |

## 7. Support escalation

| field | detail |
|---|---|
| `actors` | `client`, `partner`, `captain`, `control-panel`, `WLT` when financial |
| `preconditions` | any lifecycle stage produces a complaint, dispute, or delivery issue |
| `steps` | 1. actor opens issue/support path. 2. case enters support exception state. 3. control-panel reviews owner, severity, and evidence. 4. non-financial cases return to operational owner. 5. financial cases go to WLT adjustment/refund path only. |
| `expected visible screens` | client `OperationScreens`, partner `PartnerSupportScreen` or `OperationScreens`, captain `DshCaptainOperationsScreen`, `ControlPanelDshSupportHubScreen` |
| `expected states` | `support_required -> ready or cancelled or rejected` |
| `DSH-owned data` | case category, actor context, notes, non-financial resolution state, audit note |
| `WLT-owned data` | refund/adjustment/chargeback semantics if case is financial |
| `control-panel signals` | support queue, severity, owner, audit outcome, financial classification |
| `missing screen/logic if any` | unified case taxonomy and financial vs non-financial classification still need manual design |
| `API readiness` | `NOT_READY` |

## 8. PoD missing

| field | detail |
|---|---|
| `actors` | `captain`, `control-panel`, `client` |
| `preconditions` | captain reaches dropoff but cannot submit acceptable proof |
| `steps` | 1. captain arrives at dropoff. 2. captain cannot submit proof or proof is insufficient. 3. delivered state stays blocked. 4. control-panel reviews issue. 5. client remains in unresolved delivery status until review. |
| `expected visible screens` | `DshCaptainOrdersScreen`, `DshCaptainMapScreen`, client `OrdersTrackingScreens`, `OperationsHubScreen`, support queue |
| `expected states` | `arrive_dropoff -> support_required -> ready or rejected` |
| `DSH-owned data` | PoD-missing flag, delivery review state, support exception reference |
| `WLT-owned data` | none unless financial complaint follows later |
| `control-panel signals` | proof review required, unresolved delivery closure, potential complaint risk |
| `missing screen/logic if any` | dedicated PoD failure surface and review outcome state need manual design |
| `API readiness` | `NOT_READY` |
