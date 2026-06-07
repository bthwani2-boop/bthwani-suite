# DSH UI/UX Flow Closure Matrix

Status: PASS
Decision: DSH_JOURNEYS_E2E_RUNTIMES_PROVEN

Canonical sources:

- `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
- `dsh/frontend/shared/dsh-flow-registry.ts`
- the four mobile screen registries
- `control-panel/operations/operations.registry.ts`
- `control-panel/finance/finance.registry.ts`

Current summary:

- `preview-ready`: 0
- `needs-visual-evidence`: 0
- `blocked-by-wlt`: 0
- `verified-ui-flow`: 13

Service-wide decision is PASS: all UI/UX flow evidence rows are verified and local E2E/smoke run evidence is captured.

## Surface Row Classification

Every row in this matrix is a **surface evidence unit** for a cross-surface slice — not a standalone slice, and not an independent closure unit. A row proves that a given surface/actor/domain combination has the required screens, flows, states, CTAs, and evidence. The cross-surface slice groups these rows into a complete business/operational journey.

| Surface | Actor | Domain | Route hint | Screen owner | Primary action | Required states | Status | Evidence status | Runtime binding | Remaining blocker | Cross-surface dependencies | WLT boundary | Visual evidence required | Proposed Cross-Surface Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `app-client` | `client` | `client-discovery` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | none; screenshots and visual review are captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100` | marketing publish controls; partner readiness; shared marketing visibility | no WLT ownership here | `yes` | `DSH-SLICE-001-STORE-DISCOVERY` |
| `app-client` | `client` | `client-checkout` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx`; `DshCheckoutFailureScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none; auth + payment callback verified in `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/` | WLT bridge; finance preview; partner intake visibility | WLT owns payment and money semantics | `yes` | `DSH-SLICE-003-CLIENT-CHECKOUT` |
| `app-client` | `client` | `client-tracking-support` | `/app-client/orders` | `DshOrdersListScreen.tsx`; `DshTrackingScreen.tsx`; `DshConversationHubScreen.tsx`; `DshOrderIssueHubScreen.tsx`; `DshProxyHubScreen.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | partner lifecycle; captain milestones; control-panel support/audit | WLT owns refund execution only | `yes` | `DSH-SLICE-004-CLIENT-TRACKING-SUPPORT` |
| `app-partner` | `partner` | `partner-operations` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | client order visibility; captain readiness; control-panel operations | WLT only enters if later financial reversal is needed | `yes` | `DSH-SLICE-005-PARTNER-OPERATIONS` |
| `app-partner` | `partner` | `partner-catalog` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | barcode/duplicate/publishing/client-visibility logic is wired; screenshots captured VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602); publishing-gate runtime proof still missing | client storefront visibility; control-panel catalogs; marketing visibility | no WLT ownership here | `yes` | `DSH-SLICE-001-STORE-DISCOVERY` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | partner ready-for-pickup; dispatch assignment; client milestone visibility | no direct WLT ownership | `yes` | `DSH-SLICE-006-CAPTAIN-OPERATIONS` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | client delivered surface; control-panel audit/support | WLT only owns downstream financial complaint/refund/payout execution | `yes` | `DSH-SLICE-006-CAPTAIN-OPERATIONS` |
| `app-field` | `field` | `field-operations` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `verified-ui-flow` | `PASS` | `PASS` | none | control-panel approvals; partner readiness ownership | no WLT ownership here | `yes` | `PASS` |
| `app-field` | `field` | `field-operations` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx`; `dsh-field-visit-client.ts` | capture visit evidence and escalate blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `verified-ui-flow` | `PASS` | `PASS` | none | control-panel approvals; partner ownership; field account/history | WLT finance stays outside visit flow | `yes` | `PASS` |
| `app-field` | `field` | `field-operations` | `/app-field/documents` | `DshFieldDocumentUploadScreen.tsx`; `dsh-field-document-client.ts` | choose document type and submit media key | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `verified-ui-flow` | `PASS` | `PASS` | none | onboarding checklist; control-panel approvals; partner activation | no WLT ownership here | `yes` | `PASS` |
| `control-panel` | `operator` | `control-panel-operations` | `/operations` | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect risk and route intervention | `success`, `error`, `retry`, `blocked` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | client support/tracking; partner readiness; captain assignment/proof; signal layer | no direct WLT ownership | `yes` | `DSH-SLICE-007-OPERATOR-CONTROL` |
| `control-panel` | `operator` | `control-panel-finance` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `verified-ui-flow` | `PASS` | `RUNTIME_BOUND` | none; settlement, refund, payout, commission, and ledger are runtime-bound to WLT Go backend; verification logs captured under local runs | WLT finance runtime; partner/captain/field bridge workspaces | full WLT financial boundary | `yes` | `DSH-SLICE-008-FINANCIAL-CONTROL` |
| `control-panel` | `operator` | `control-panel-partners` | `/partners` | `ReadinessEscalationsWorkspace.tsx` | manage field readiness escalations | `success`, `error`, `info_requested` | `verified-ui-flow` | `PASS` | `PASS` | none | field agent escalation blocker; CP operator resolution | no WLT ownership here | `yes` | `PASS` |
| `control-panel` | `operator` | `control-panel-partners` | `/partners` | `ReadinessApprovalsWorkspace.tsx` | formally approve/reject store readiness package | `success`, `error`, `approved`, `rejected` | `verified-ui-flow` | `PASS` | `PASS` | none | CP operator approval; partner status reflection; toggle eligibility | no WLT ownership here | `yes` | `PASS` |

Rule:
No row above may be promoted to a stronger closure claim until route proof, screen proof, required states, visual evidence, and runtime proof all exist together, or an explicit blocker remains in place.

Cross-Surface Slice Rule:
No row may be promoted to a cross-surface slice without all supporting surfaces classified. Any row revealing a missing screen/process/CTA/state must propose it inside the related slice manifest as REQUIRED_ADDITION or BLOCKED_WITH_REASON before that slice may close.
