# DSH Screen/API Matrix

Status: MIXED_SERVICE_MATRIX
Decision: DSH_SLICE001_BACKEND_LIVE_E2E_PROVEN__FRONTEND_BINDING_PENDING

Purpose:
Freeze the frontend-facing API needs after P0-14 without inflating runtime or backend closure.

Current rule:

- no `dsh/dsh.openapi.yaml` edit is justified by route proof alone
- every row below remains preview-only unless trusted runtime proof exists
- WLT-owned finance rows stay explicitly blocked-by-wlt
- API rows are evidence units for cross-surface slices; they are not standalone slices.
- No endpoint may be designed until the cross-surface slice proves screen/flow/readiness and all related surfaces are classified.
- If an API row reveals missing operation/state/auth boundary/WLT boundary/provider variable/control-panel owner, it must be added as REQUIRED_ADDITION or BLOCKED_WITH_REASON to the related slice before closure.
- No API PASS can override missing screen/flow/ops/data ownership proof.

| Matrix ID | Surface | Route hint | Screen owner | Primary action | Required states | API readiness | Auth/WLT boundary | Remaining blocker | Next allowed work |
|---|---|---|---|---|---|---|---|---|---|
| `DSH-SAPI-P014-01` | `app-client` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open a destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary | none — all 3 visibility gates proven; screen proof in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/` | none — DSH-SLICE-001 closed; transition to DSH-SLICE-002 |
| `DSH-SAPI-P014-02` | `app-client` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `BLOCKED_BY_WLT/AUTH` | WLT owns payment decision; auth is still unproven | payment lifecycle and order-create failure states remain preview-only | keep blocked until WLT/auth runtime proof exists |
| `DSH-SAPI-P014-03` | `app-client` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `NOT_READY_FOR_API` | WLT owns refund execution only | lifecycle events, cancellation, and support-exception states are not runtime-proven | capture cross-surface proof before freezing event contracts |
| `DSH-SAPI-P014-04` | `app-partner` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | WLT only enters if later financial reversal is needed | acceptance timer, delay, ready, and handoff semantics are still preview-only | capture partner proof before any action contract is designed |
| `DSH-SAPI-P014-05` | `app-partner` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary | none — screen proof captured in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`; StoreReadinessGate wired and button-press proven; PATCH /stores/{id}/partner-readiness verified to change client_visible and GET /stores response | none — DSH-SLICE-001 partner surface closed |
| `DSH-SAPI-P014-06` | `app-captain` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `NOT_READY_FOR_API` | WLT payout effects stay outside this slice | pickup, arrival, and failure milestones are still preview-only | capture captain proof before delivery action modeling |
| `DSH-SAPI-P014-07` | `app-captain` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `NOT_READY_FOR_API` | WLT only appears if a later complaint becomes financial | proof-policy and delivery-failure semantics are not runtime-proven | capture PoD proof before any contract design |
| `DSH-SAPI-P014-08` | `app-field` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | no WLT boundary | document states and readiness outcomes are still preview-only | capture field onboarding proof before API planning |
| `DSH-SAPI-P014-09` | `app-field` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | capture visit evidence and escalate readiness blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `CANDIDATE_AFTER_VISUAL_AND_RUNTIME_PROOF` | WLT finance remains outside visit flow | photo, location, revisit, and escalation-return semantics are not runtime-proven | capture field visit proof before readiness contract design |
| `DSH-SAPI-P014-10` | `control-panel` | `/operations` (5 canonical groups: command-center, live-orders, dispatch-capacity, exceptions, special-ops — each via `?workspace=<group>&subGroup=<sub>`) | `operations.registry.ts`; `OperationsHubScreen.tsx`; `CommandCenterScreen.tsx`; `LiveOrdersScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect multi-surface risk and route intervention | `success`, `error`, `retry`, `blocked` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary in operations | none — screen proof captured in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`; catalog-approval and marketing-visibility buttons pressed in browser; PATCH endpoints verified to change client_visible and GET /stores response | none — DSH-SLICE-001 control-panel surface closed; transition to DSH-SLICE-002 |
| `DSH-SAPI-P014-11` | `control-panel` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `BLOCKED_BY_WLT` | WLT owns settlement, payout, refund, commission, and ledger semantics | finance remains a read-only bridge, not a DSH API surface | keep blocked by WLT |
| `DSH-SAPI-P014-12` | `backend/domain/openapi` | `dsh/backend`; `dsh/domain`; `dsh/dsh.openapi.yaml` | service scaffold only | none accepted yet | N/A — backend only | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary | none — all 3 PATCH gates + GET /stores proven via DSH_SLICE001_LIVE_E2E-20260603-173059; frontend binding + screen proof captured in DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700; go test pass | none — backend + frontend surface closed; transition to DSH-SLICE-002 |

Exit gate:
`DSH_SLICE001_SCREEN_RUNTIME_PROVEN` is the final matrix status for `DSH-SAPI-P014-01`, `DSH-SAPI-P014-05`, `DSH-SAPI-P014-10`, and `DSH-SAPI-P014-12` after:

- Backend Live E2E: all 3 PATCH gates + GET /stores proven against live Postgres (DSH_SLICE001_LIVE_E2E-20260603-173059).
- Frontend transport binding: StoreReadinessGate (app-partner) + catalog-approval / marketing-visibility sections (control-panel) wired via dsh-store-visibility-transport.ts (DSH_SLICE001_FRONTEND_BIND-20260603).
- Final screen runtime proof: all buttons pressed on physical device and browser; GET /stores response diff captured per gate (DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700).

Contradictions resolved: CONTRA-001, CONTRA-002, CONTRA-003, CONTRA-004 (see `dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md`).
DSH-SLICE-001 matrix decision: `DSH_SLICE001_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE`.
Next: transition to DSH-SLICE-002 (Catalog Management).
