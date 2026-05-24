# DSH UI/UX Flow Closure Matrix

Status: ACTIVE_FRONTEND_CLOSURE_TRUTH
Decision: DSH_UIUX_FLOW_LOGICALLY_READY_FOR_VISUAL_REVIEW

Canonical sources:

- `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
- `dsh/frontend/shared/dsh-flow-registry.ts`
- the four mobile screen registries
- `control-panel/operations/operations.registry.ts`
- `control-panel/finance/finance.registry.ts`

Current summary:

- `preview-ready`: 0
- `needs-visual-evidence`: 9
- `blocked-by-wlt`: 1
- `verified-ui-flow`: 1

| Surface | Actor | Domain | Route hint | Screen owner | Primary action | Required states | Status | Evidence status | Runtime binding | Remaining blocker | Cross-surface dependencies | WLT boundary | Visual evidence required |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `app-client` | `client` | `client-discovery` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | none; screenshots and visual review are captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100` | marketing publish controls; partner readiness; shared marketing visibility | no WLT ownership here | `yes` |
| `app-client` | `client` | `client-checkout` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_BINDING_LATER` | payment lifecycle and order-create failure states are wired; screenshots and runtime proof are still missing | WLT bridge; finance preview; partner intake visibility | WLT owns payment and money semantics | `yes` |
| `app-client` | `client` | `client-tracking-support` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | cancellation/refund/support-exception/rating handoff are wired; screenshots and runtime proof are still missing | partner lifecycle; captain milestones; control-panel support/audit | WLT owns refund execution only | `yes` |
| `app-partner` | `partner` | `partner-operations` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | accept/reject/prepare/ready/handoff states are wired; screenshots and runtime proof are still missing | client order visibility; captain readiness; control-panel operations | WLT only enters if reversal becomes financial | `yes` |
| `app-partner` | `partner` | `partner-catalog` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `needs-visual-evidence` | `needs-visual-evidence` | `UI_PREVIEW_ONLY` | barcode/duplicate/publishing/client-visibility logic is wired; screenshots are still missing | client storefront visibility; control-panel catalogs; marketing visibility | no WLT ownership here | `yes` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | pickup/decline/reassignment/handoff logic is wired; screenshots and runtime proof are still missing | partner ready-for-pickup; dispatch assignment; client milestone visibility | no direct WLT ownership | `yes` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | PoD and delivery-failure logic is wired; screenshots and runtime proof are still missing | client delivered surface; control-panel audit/support | WLT only appears if a complaint becomes financial | `yes` |
| `app-field` | `field` | `field-operations` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | document states and readiness outcomes are wired inside onboarding; screenshots are still missing | control-panel approvals; partner readiness ownership | no WLT ownership here | `yes` |
| `app-field` | `field` | `field-operations` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | capture visit evidence and escalate blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | visit evidence and readiness outcome states are wired; screenshots and runtime proof are still missing | control-panel approvals; partner ownership; field account/history | WLT finance stays outside visit flow | `yes` |
| `control-panel` | `operator` | `control-panel-operations` | `/operations` | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect risk and route intervention | `success`, `error`, `retry`, `blocked` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | current-branch screenshots and intervention runtime proof are still missing | client support/tracking; partner readiness; captain assignment/proof; signal layer | no direct WLT ownership | `yes` |
| `control-panel` | `operator` | `control-panel-finance` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `blocked-by-wlt` | `blocked-by-wlt` | `BLOCKED_BY_WLT` | settlement, refund, payout, commission, and ledger remain WLT-owned | WLT finance preview; partner/captain/field bridge workspaces | full WLT financial boundary | `yes` |

Rule:
No row above may be promoted to a stronger closure claim until route proof, screen proof, required states, visual evidence, and runtime proof all exist together, or an explicit blocker remains in place.
