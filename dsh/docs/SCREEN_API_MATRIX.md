# DSH Screen/API Matrix

Status: MIXED_SERVICE_MATRIX
Decision: DSH_SLICE_006A_STORE_ONBOARDING_PASS

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
| `DSH-SAPI-P014-01` | `app-client` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open a destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary | none — all 3 visibility gates proven; store details (001B) proven in `tools/registry/runs/DSH_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE-20260604-034548/` | none — DSH-SLICE-001 closed; transition to DSH-SLICE-002 |
| `DSH-SAPI-P014-02` | `app-client` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx`; `DshCheckoutFailureScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `BLOCKED_WITH_REASON` | WLT owns payment decision; backend auth middleware supports production mode (`DSH_AUTH_MODE=production` + Bearer token + auth service validation); app-client checkout transport can send Bearer token via `authToken` or `EXPO_PUBLIC_DSH_AUTH_BEARER_TOKEN` | pending real auth-service verification and WLT E2E payment callback runtime | test local-preview fallback and run local smoke test |
| `DSH-SAPI-P014-03` | `app-client` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `DEFERRED_WITH_REASON` | WLT owns refund execution only | deferred pending J-003 checkout/payment full closure | run local smoke test and trace order updates |
| `DSH-SAPI-P014-04` | `app-partner` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `DEFERRED_WITH_REASON` | WLT only enters if later financial reversal is needed | deferred pending J-004 lifecycle/support and J-009 ops runtime | verify local orders intake and prep lifecycle |
| `DSH-SAPI-P014-05` | `app-partner` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary | none — screen proof captured in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`; partner readiness (001C) proven in `tools/registry/runs/DSH_SLICE_001C_PARTNER_READINESS_FINAL_CLOSURE-20260604-043800/` | none — DSH-SLICE-001 partner surface closed |
| `DSH-SAPI-P014-06` | `app-captain` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `API_CLIENT_BOUND__DEVICE_VISUAL_PROVEN` | WLT payout effects stay outside this slice | typed lifecycle client is wired for accept/decline/pickup with injectable captain identity; current app-captain screenshots captured | monitor real auth/captain identity provider integration |
| `DSH-SAPI-P014-07` | `app-captain` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `API_CLIENT_BOUND__DEVICE_VISUAL_PROVEN` | WLT only owns downstream financial complaint/refund/payout execution | typed lifecycle client is wired for location/PoD/failure with injectable captain identity; current app-captain map/detail screenshots captured | monitor live GPS/provider substitution and WLT-only financial follow-up |
| `DSH-SAPI-P014-08` | `app-field` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `API_CLIENT_BOUND__RUNTIME_PROVEN` | no WLT boundary | none for onboarding; visit/readiness approval remain downstream | proceed to DSH-SLICE-006B field visit evidence |
| `DSH-SAPI-P014-09` | `app-field` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx`; `dsh-field-visit-client.ts` | capture visit evidence and escalate readiness blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `API_CLIENT_BOUND__POST_FIELD_VISITS_RUNTIME_PROVEN__VISUAL_REBUILD_PENDING` | WLT finance remains outside visit flow | raw photo upload, readiness approval, and updated-device visual proof remain downstream/blocking | rebuild/install updated app-field and capture field visit visual proof |
| `DSH-SAPI-P014-10` | `control-panel` | `/operations` (5 canonical groups: command-center, live-orders, dispatch-capacity, exceptions, special-ops — each via `?workspace=<group>&subGroup=<sub>`) | `operations.registry.ts`; `OperationsHubScreen.tsx`; `CommandCenterScreen.tsx`; `LiveOrdersScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect multi-surface risk and route intervention | `success`, `error`, `retry`, `blocked` | `DEFERRED_WITH_REASON` | no WLT boundary in operations | deferred pending operations room visual and runtime E2E proof | verify live orders screen in controlled local test |
| `DSH-SAPI-P014-11` | `control-panel` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `BLOCKED_WITH_REASON` | WLT owns settlement, payout, refund, commission, and ledger semantics; read-only bridge (GET /wlt/wallet-summary) and settlement classification (POST /settlement/candidates) E2E verified | full WLT finance ownership; DSH reads only | verify read-only wallet summary rendering |
| `DSH-SAPI-P014-12` | `backend/domain/openapi` | `dsh/backend`; `dsh/domain`; `dsh/dsh.openapi.yaml` | service scaffold only | none accepted yet | N/A — backend only | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | no WLT boundary | none — all 3 PATCH gates + GET /stores proven via DSH_SLICE001_LIVE_E2E-20260603-173059; frontend binding + screen proof captured in DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700; go test pass | none — backend + frontend surface closed; transition to DSH-SLICE-002 |

Exit gate:
`DSH_SLICE001_SCREEN_RUNTIME_PROVEN` is the final matrix status for `DSH-SAPI-P014-01`, `DSH-SAPI-P014-05`, `DSH-SAPI-P014-10`, and `DSH-SAPI-P014-12` after:

- Backend Live E2E: all 3 PATCH gates + GET /stores proven against live Postgres (DSH_SLICE001_LIVE_E2E-20260603-173059).
- Frontend transport binding: StoreReadinessGate (app-partner) + catalog-approval / marketing-visibility sections (control-panel) wired via dsh-store-visibility-transport.ts (DSH_SLICE001_FRONTEND_BIND-20260603).
- Final screen runtime proof: all buttons pressed on physical device and browser; GET /stores response diff captured per gate (DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700).

Contradictions resolved: CONTRA-001, CONTRA-002, CONTRA-003, CONTRA-004 (see `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md`).
DSH-SLICE-001 matrix decision: `DSH_SLICE001_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE`.
Next: transition to DSH-SLICE-002 (Catalog Management).

### DSH-SLICE-005A Captain Assignment Screen/API Proof (2026-06-05)
Decision: `DEFERRED_WITH_REASON`
Evidence: `tools/registry/runs/DSH_SLICE_005A_CAPTAIN_ASSIGNMENT_FINAL_CLOSURE-20260605-042600/`
Summary:
- Endpoint `POST /orders/{id}/assign-captain` documented in `dsh.openapi.yaml`.
- SDK client method `assignCaptain` implemented in `dsh-order-lifecycle-client.ts`.
- DispatchAssignmentScreen wired to make live call to `assignCaptain` SDK endpoint.
- Validated manually using `run_j005_e2e.py` simulation script against Go API server.

### DSH-SLICE-006C Documents & Media Proof Screen/API Proof (2026-06-06)
Decision: `DEFERRED_WITH_REASON`
Evidence: `tools/registry/runs/DSH_SLICE_006C_DOCUMENTS_MEDIA_PROOF_FINAL_CLOSURE-20260606-044000/`
Summary:
- Endpoint `POST /stores/{id}/documents` documented in `dsh.openapi.yaml`.
- Shared client method `createFieldDocument` implemented in `dsh-field-document-client.ts`.
- `DshFieldDocumentUploadScreen` wired to make live call to `createFieldDocument` client.
- Validated via automated test `postgres_field_document_runtime_test.go` and TypeScript typecheck.
