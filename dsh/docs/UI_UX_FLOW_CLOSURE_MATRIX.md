# DSH UI/UX Flow Closure Matrix

Status: ACTIVE_FRONTEND_CLOSURE_TRUTH
Decision: DSH_SLICE_006B_FIELD_VISIT_IMPLEMENTED_RUNTIME_PROVEN_NOT_FINAL_CLOSED

Canonical sources:

- `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
- `dsh/frontend/shared/dsh-flow-registry.ts`
- the four mobile screen registries
- `control-panel/operations/operations.registry.ts`
- `control-panel/finance/finance.registry.ts`

Current summary:

- `preview-ready`: 0
- `needs-visual-evidence`: 4
- `blocked-by-wlt`: 1
- `verified-ui-flow`: 6

## Surface Row Classification

Every row in this matrix is a **surface evidence unit** for a cross-surface slice — not a standalone slice, and not an independent closure unit. A row proves that a given surface/actor/domain combination has the required screens, flows, states, CTAs, and evidence. The cross-surface slice groups these rows into a complete business/operational journey.

| Surface | Actor | Domain | Route hint | Screen owner | Primary action | Required states | Status | Evidence status | Runtime binding | Remaining blocker | Cross-surface dependencies | WLT boundary | Visual evidence required | Proposed Cross-Surface Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `app-client` | `client` | `client-discovery` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | none; screenshots and visual review are captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100` | marketing publish controls; partner readiness; shared marketing visibility | no WLT ownership here | `yes` | `DSH-SLICE-001-STORE-DISCOVERY` |
| `app-client` | `client` | `client-checkout` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx`; `DshCheckoutFailureScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_BINDING_LATER` | live auth-service runtime proof + WLT runtime/security proof + visual proof pending | WLT bridge; finance preview; partner intake visibility | WLT owns payment and money semantics | `yes` | IMPLEMENTATION_STARTED |
| `app-client` | `client` | `client-tracking-support` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | deferred pending J-003 checkout/payment full closure | partner lifecycle; captain milestones; control-panel support/audit | WLT owns refund execution only | `yes` | DEFERRED_WITH_REASON |
| `app-partner` | `partner` | `partner-operations` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | deferred pending J-003 checkout/payment full closure | client order visibility; captain readiness; control-panel operations | WLT only enters if reversal becomes financial | `yes` | DEFERRED_WITH_REASON |
| `app-partner` | `partner` | `partner-catalog` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | barcode/duplicate/publishing/client-visibility logic is wired; screenshots captured VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602); publishing-gate runtime proof still missing | client storefront visibility; control-panel catalogs; marketing visibility | no WLT ownership here | `yes` | `DSH-SLICE-001-STORE-DISCOVERY` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `device-visual-evidence-captured` | `PASS` | `API_CLIENT_BOUND__E2E_EVIDENCE_PRESENT` | accept/decline/pickup callbacks use typed lifecycle client with injectable captain identity; device screenshots captured in `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/` | partner ready-for-pickup; dispatch assignment; client milestone visibility | no direct WLT ownership | `yes` | DSH-SLICE-005B-005C |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `device-visual-evidence-captured` | `PASS` | `API_CLIENT_BOUND__E2E_EVIDENCE_PRESENT` | map/PoD/failure callbacks use typed lifecycle client with injectable captain identity; device screenshots captured in `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/` | client delivered surface; control-panel audit/support | WLT only owns downstream financial complaint/refund/payout execution | `yes` | DSH-SLICE-005D-005F |
| `app-field` | `field` | `field-operations` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none for 006A; visit evidence and readiness approval remain later J-006 slices | control-panel approvals; partner readiness ownership | no WLT ownership here | `yes` | `DSH-SLICE-006A-STORE-ONBOARDING` |
| `app-field` | `field` | `field-operations` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx`; `dsh-field-visit-client.ts` | capture visit evidence and escalate blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `needs-visual-evidence` | `runtime-proven__visual-rebuild-pending` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | POST /stores/{id}/field-visits is runtime-proven against local Postgres; updated-device visual proof is blocked until app-field is rebuilt/installed | control-panel approvals; partner ownership; field account/history | WLT finance stays outside visit flow | `yes` | `DSH-SLICE-006B-FIELD-VISIT-EVIDENCE` |
| `control-panel` | `operator` | `control-panel-operations` | `/operations` | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect risk and route intervention | `success`, `error`, `retry`, `blocked` | `needs-visual-evidence` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | deferred pending J-003 checkout/payment full closure | client support/tracking; partner readiness; captain assignment/proof; signal layer | no direct WLT ownership | `yes` | DEFERRED_WITH_REASON |
| `control-panel` | `operator` | `control-panel-finance` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `blocked-by-wlt` | `blocked-by-wlt` | `BLOCKED_BY_WLT` | settlement, refund, payout, commission, and ledger remain WLT-owned | WLT finance preview; partner/captain/field bridge workspaces | full WLT financial boundary | `yes` | BLOCKED_WITH_REASON |

Rule:
No row above may be promoted to a stronger closure claim until route proof, screen proof, required states, visual evidence, and runtime proof all exist together, or an explicit blocker remains in place.

Cross-Surface Slice Rule:
No row may be promoted to a cross-surface slice without all supporting surfaces classified. Any row revealing a missing screen/process/CTA/state must propose it inside the related slice manifest as REQUIRED_ADDITION or BLOCKED_WITH_REASON before that slice may close.
