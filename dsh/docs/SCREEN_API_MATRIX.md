# DSH Screen/API Matrix

Status: ACTIVE_FRONTEND_CLOSURE_CONTROL
Decision: READY_FOR_OPENAPI_P0_DESIGN

Purpose:
Freeze the frontend-facing API needs after P0-14 without inflating runtime or backend closure.

Current rule:

- no `dsh/dsh.openapi.yaml` edit is justified by route proof alone
- every row below remains preview-only unless trusted runtime proof exists
- WLT-owned finance rows stay explicitly blocked-by-wlt

| Matrix ID | Surface | Route hint | Screen owner | Primary action | Required states | API readiness | Auth/WLT boundary | Remaining blocker | Next allowed work |
|---|---|---|---|---|---|---|---|---|---|
| `DSH-SAPI-P014-01` | `app-client` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open a destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `READY_FOR_OPENAPI_P0_DESIGN` | no WLT boundary yet | none; screenshots and visual review are captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100` | ready for OpenAPI design gate |
| `DSH-SAPI-P014-02` | `app-client` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `BLOCKED_BY_WLT/AUTH` | WLT owns payment decision; auth is still unproven | payment lifecycle and order-create failure states remain preview-only | keep blocked until WLT/auth runtime proof exists |
| `DSH-SAPI-P014-03` | `app-client` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `NOT_READY_FOR_API` | WLT owns refund execution only | lifecycle events, cancellation, and support-exception states are not runtime-proven | capture cross-surface proof before freezing event contracts |
| `DSH-SAPI-P014-04` | `app-partner` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | WLT only enters if later financial reversal is needed | acceptance timer, delay, ready, and handoff semantics are still preview-only | capture partner proof before any action contract is designed |
| `DSH-SAPI-P014-05` | `app-partner` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | no WLT boundary | barcode, duplicate, and publishing-gate semantics are not proven | capture catalog proof before inventory API planning |
| `DSH-SAPI-P014-06` | `app-captain` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `NOT_READY_FOR_API` | WLT payout effects stay outside this slice | pickup, arrival, and failure milestones are still preview-only | capture captain proof before delivery action modeling |
| `DSH-SAPI-P014-07` | `app-captain` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `NOT_READY_FOR_API` | WLT only appears if a later complaint becomes financial | proof-policy and delivery-failure semantics are not runtime-proven | capture PoD proof before any contract design |
| `DSH-SAPI-P014-08` | `app-field` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | no WLT boundary | document states and readiness outcomes are still preview-only | capture field onboarding proof before API planning |
| `DSH-SAPI-P014-09` | `app-field` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | capture visit evidence and escalate readiness blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | WLT finance remains outside visit flow | photo, location, revisit, and escalation-return semantics are not runtime-proven | capture field visit proof before readiness contract design |
| `DSH-SAPI-P014-10` | `control-panel` | `/operations` | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect multi-surface risk and route intervention | `success`, `error`, `retry`, `blocked` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | no WLT boundary in operations | screenshots and intervention-side runtime proof are still missing | capture control-panel operations proof before control action contracts |
| `DSH-SAPI-P014-11` | `control-panel` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `BLOCKED_BY_WLT` | WLT owns settlement, payout, refund, commission, and ledger semantics | finance remains a read-only bridge, not a DSH API surface | keep blocked by WLT |
| `DSH-SAPI-P014-12` | `backend/domain/openapi` | `dsh/backend`; `dsh/domain`; `dsh/dsh.openapi.yaml` | service scaffold only | none accepted yet | `BLOCKED_BY_CONTRACT` | auth, runtime, persistence, and observability all unproven | frontend proof is still preview-only and insufficient for API design | reopen only after frontend proof gates move forward |

Exit gate:
`READY_FOR_OPENAPI_P0_DESIGN` is still blocked. It only becomes valid after the relevant rows move out of preview-only status without hiding WLT or contract blockers.
