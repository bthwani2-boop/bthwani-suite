# DSH UI/UX Flow Closure Matrix

Status: ACTIVE_FRONTEND_CLOSURE_TRUTH
Decision: PREVIEW_ONLY_WITH_PENDING_VISUAL_EVIDENCE

Canonical sources:

- `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
- `dsh/frontend/shared/dsh-flow-registry.ts`
- the four mobile screen registries
- `control-panel/operations/operations.registry.ts`
- `control-panel/finance/finance.registry.ts`

Current summary:

- `preview-ready`: 9
- `needs-visual-evidence`: 1
- `blocked-by-wlt`: 1
- `verified-ui-flow`: 0

| Surface | Actor | Domain | Route hint | Screen owner | Primary action | Required states | Status | Evidence status | Runtime binding | Remaining blocker | Cross-surface dependencies | WLT boundary | Visual evidence required |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `app-client` | `client` | `client-discovery` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `preview-ready` | `pending-ui-gap` | `UI_PREVIEW_ONLY` | store visibility, promo binding, and delivery-mode badges remain preview-only | marketing publish controls; partner readiness; shared marketing visibility | no WLT ownership here | `yes` |
| `app-client` | `client` | `client-checkout` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `preview-ready` | `pending-ui-gap` | `NEEDS_BINDING_LATER` | WLT payment lifecycle and order-create failure states are not fully closed | WLT bridge; finance preview; partner intake visibility | WLT owns payment and money semantics | `yes` |
| `app-client` | `client` | `client-tracking-support` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `preview-ready` | `pending-ui-gap` | `NEEDS_RUNTIME_EVIDENCE` | cancellation, refund, support-exception, and rating handoff remain preview-only | partner lifecycle; captain milestones; control-panel support/audit | WLT owns refund execution only | `yes` |
| `app-partner` | `partner` | `partner-operations` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `preview-ready` | `pending-ui-gap` | `NEEDS_RUNTIME_EVIDENCE` | acceptance timer, delay, ready, and handoff semantics remain preview-only | client order visibility; captain readiness; control-panel operations | WLT only enters if reversal becomes financial | `yes` |
| `app-partner` | `partner` | `partner-catalog` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `preview-ready` | `pending-ui-gap` | `UI_PREVIEW_ONLY` | barcode, duplicate, and publishing-gate states remain preview-only | client storefront visibility; control-panel catalogs; marketing visibility | no WLT ownership here | `yes` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `preview-ready` | `pending-ui-gap` | `NEEDS_RUNTIME_EVIDENCE` | availability, pickup, and handoff mismatch states remain preview-only | partner ready-for-pickup; dispatch assignment; client milestone visibility | no direct WLT ownership | `yes` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `preview-ready` | `pending-ui-gap` | `NEEDS_RUNTIME_EVIDENCE` | arrival, delivered, and delivery-failure states remain preview-only | client delivered surface; control-panel audit/support | WLT only appears if a complaint becomes financial | `yes` |
| `app-field` | `field` | `field-operations` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `preview-ready` | `pending-ui-gap` | `NEEDS_RUNTIME_EVIDENCE` | document states and readiness outcomes remain preview-only | control-panel approvals; partner readiness ownership | no WLT ownership here | `yes` |
| `app-field` | `field` | `field-operations` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | capture visit evidence and escalate blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `preview-ready` | `pending-ui-gap` | `NEEDS_RUNTIME_EVIDENCE` | photo, location, revisit, and escalation-return states remain preview-only | control-panel approvals; partner ownership; field account/history | WLT finance stays outside visit flow | `yes` |
| `control-panel` | `operator` | `control-panel-operations` | `/operations` | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect risk and route intervention | `success`, `error`, `retry`, `blocked` | `needs-visual-evidence` | `pending-visual` | `NEEDS_RUNTIME_EVIDENCE` | current-branch screenshots and intervention runtime proof are still missing | client support/tracking; partner readiness; captain assignment/proof; signal layer | no direct WLT ownership | `yes` |
| `control-panel` | `operator` | `control-panel-finance` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `blocked-by-wlt` | `blocked-by-wlt` | `BLOCKED_BY_WLT` | settlement, refund, payout, commission, and ledger remain WLT-owned | WLT finance preview; partner/captain/field bridge workspaces | full WLT financial boundary | `yes` |

Rule:
No row above may be promoted to a stronger closure claim until route proof, screen proof, required states, visual evidence, and runtime proof all exist together, or an explicit blocker remains in place.
