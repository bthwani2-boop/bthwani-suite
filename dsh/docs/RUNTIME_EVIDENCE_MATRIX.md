# DSH Runtime Evidence Matrix

Status: MIXED_RUNTIME_MATRIX
Decision: DSH_SLICE001_BACKEND_LIVE_E2E_PROVEN__FRONTEND_BINDING_PENDING

## Matrix Evidence Requirement
Purpose:
Lean runtime matrix for the live frontend closure truth after P0-14. This file separates route and screen proof from runtime proof.

Current rule:

- route proof does not promote preview, local-state, fixture, or seed data to runtime truth
- no WLT-owned money semantics move into DSH
- no backend or API closure claim is allowed from this file
- Batch 8C only opens the Go backend slice decision for `GET /stores`; it does not prove runtime transport
- Batch 9A creates a Go skeleton with a temporary memory repository; it still does not prove PostgreSQL or frontend runtime transport
- Batch 9B proves local PostgreSQL-backed `GET /stores` runtime at the Go API boundary only; it does not prove frontend transport or screen runtime binding
- Runtime rows are proof units for cross-surface slices; they do not define slices by themselves.
- Runtime closure requires: UI action → typed client → service/backend where applicable → data store where applicable → response → screen state → logs/evidence.
- If runtime proof reveals a missing process/screen/state/operation, it must be recorded as REQUIRED_ADDITION or BLOCKED_WITH_REASON in the related slice.
- Runtime proof does not promote preview/fixtures to API/runtime truth.

Historic anchors:

- `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`
- `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336`

P0-14 note:

- no new runtime capture was added in this phase
- this matrix now derives current frontend truth from live registries plus `dshCrossSurfaceClosureMap.ts`

| Runtime ID | Surface / slice | Live anchors | Data classification | Closure status | Runtime binding | Evidence status | Remaining blocker | Next allowed proof |
|---|---|---|---|---|---|---|---|---|
| `DSH-RUN-P014-01` | app-client discovery + storefront | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx`; `DshClientSurface.tsx`; typed client bridge; `dsh-discovery-stores-transport.ts`; `dsh-discovery-stores-runtime-config.ts` | `runtime-proven` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | app-client / GET /stores and GET /stores/{id} E2E runtime proven | `api-db-runtime-proven__transport-bound__screen-runtime-proven` | none — partner + CP screen proof captured in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`; store details (001B) proven in `tools/registry/runs/DSH_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE-20260604-034548/` | none — DSH-SLICE-001 cross-surface runtime proven; transition to DSH-SLICE-002 |
| `DSH-RUN-P014-02` | app-client cart + checkout intent + checkout failure | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx`; `DshCheckoutFailureScreen.tsx` | `preview`, `local-state`, `WLT-adjacent` | `needs-visual-evidence` | `NEEDS_BINDING_LATER` | `needs-visual-evidence` | J-003 contracts designed (GET /cart/serviceability, POST /checkout/intent, DELETE /checkout/intent/{id}, POST /checkout/payment-callback all in dsh.openapi.yaml + backend handlers implemented); auth middleware ready for production mode (DSH_AUTH_MODE=production); auth service HTTP client (GET /auth/session) is the remaining implementation gate before 003A; RESOLVED: CartScreen 'retry' added to requiredStates; RESOLVED: DshCheckoutFailureScreen built + registered (route: dsh-checkout-failure, READY_FOR_REVIEW); WLT callback security: X-WLT-Callback-Token + X-WLT-Event-Id enforced in backend + OpenAPI formal parameters; polling/callback conflict resolved: callback-primary documented; WLT runtime proof is the external gate | await auth service HTTP client wire-up + WLT runtime proof (external — WLT team); forward-only gate: 003A PASS → 003B → 003C → 003D → 003E; J-003 NOT closed |
| `DSH-RUN-P014-03` | app-client tracking + support | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | `preview`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | cancellation/refund/support-exception/rating handoff are wired; screenshots and lifecycle runtime proof are still missing | cross-surface screenshots plus lifecycle event proof |
| `DSH-RUN-P014-04` | app-partner intake + catalog | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `InventoryCatalogScreen.tsx`; `DshPartnerOrderRejectionScreen.tsx` | `runtime-proven` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | `SCREEN_RUNTIME_PROVEN` | `api-db-runtime-proven__transport-bound__screen-runtime-proven` | none — screen proof captured in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`; partner readiness (001C) proven in `tools/registry/runs/DSH_SLICE_001C_PARTNER_READINESS_FINAL_CLOSURE-20260604-043800/` | none — DSH-SLICE-001 partner surface closed; transition to DSH-SLICE-002 |
| `DSH-RUN-P014-05` | app-captain pickup + delivery + PoD | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | `preview`, `fixture`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | pickup/delivery-failure/PoD logic is wired; screenshots and milestone proof are still missing | captain screenshots plus delivery milestone proof |
| `DSH-RUN-P014-06` | app-field onboarding + visit + readiness | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx`; `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | `preview`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | document states, revisit states, and readiness outcomes are wired; screenshots and handoff proof are still missing | field screenshots plus readiness handoff proof |
| `DSH-RUN-P014-07` | control-panel operations | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | `runtime-proven` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` | `SCREEN_RUNTIME_PROVEN` | `api-db-runtime-proven__transport-bound__screen-runtime-proven` | none — screen proof captured in `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`; catalog-approval PATCH verified in browser (rejected→client_visible:false, approved→client_visible:true); marketing-visibility PATCH verified (inactive→client_visible:false, active→client_visible:true); GET /stores response diff confirmed; PartnerStoresScreen button presses and responses proven | none — DSH-SLICE-001 control-panel surface closed; transition to DSH-SLICE-002 |
| `DSH-RUN-P014-08` | control-panel finance bridge | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | `preview`, `read-only bridge` | `blocked-by-wlt` | `BLOCKED_BY_WLT` | `blocked-by-wlt` | settlement, payout, refund, commission, and ledger remain WLT-owned | WLT-owned runtime proof only; no DSH finance mutation |
| `DSH-RUN-P014-09` | backend + domain + OpenAPI | dsh/backend; dsh/domain; dsh/dsh.openapi.yaml | go-skeleton, postgres-repository, docker-compose-postgres, migration-seed, openapi-aligned | DSH_SLICE001_BACKEND_LIVE_E2E_PROVEN | LOCAL_GO_API_TESTS_PASS__LIVE_E2E_PROVEN | api-db-runtime-proven__live-e2e-zip-captured | Live E2E proven: DSH_SLICE001_LIVE_E2E-20260603-173059; all 3 PATCH gates and GET /stores response diff captured against live Postgres; go test pass | wire frontend UI actions to PATCH endpoints |

Closure rule:
`RUNTIME_UNPROVEN` remains the frontend/screen runtime decision until trusted runtime proof exists for the active frontend slices above. Batch 9B proves the local Go -> PostgreSQL API boundary for `GET /stores`, but a visual pass, typed client boundary, or backend-only response does not promote preview screen data to end-to-end runtime truth.

Batch 8C final decision:
`READY_FOR_GO_BACKEND_SLICE` for `DSH-SLICE-001` / `GET /stores` only. No runtime closure is claimed.

Batch 9A final decision:
`BATCH_9A_GO_BACKEND_SKELETON_READY_FOR_POSTGRES` for `DSH-SLICE-001` / `GET /stores` only. Runtime closure remains unclaimed.

Batch 9B final decision:
`BATCH_9B_POSTGRES_RUNTIME_READY_FOR_FRONTEND_TRANSPORT` for `DSH-SLICE-001` / `GET /stores` only. Verified scope: Docker Compose PostgreSQL service, migration/seed table, PostgreSQL repository, `go test ./...`, and local `GET /stores` success/empty/invalid-limit responses. Frontend runtime transport and UI evidence remain Batch 9C/9D scope.

Batch 9C final decision:
`BATCH_9D_REAL_RUNTIME_PROVEN_READY_FOR_FINAL_CLOSURE` for `DSH-SLICE-001` / `GET /stores` only. Verified scope: `dsh-discovery-stores-runtime-config.ts` (config resolution, `EXPO_PUBLIC_DSH_API_BASE_URL`, null-safe fallback), `dsh-discovery-stores-transport.ts` (HTTP transport using native fetch, offline/http error shapes, typed client factory), `DshClientSurface.tsx` wired with `runtimeBridge` React state + `useEffect` transport call + bridge resolution on success/error/offline. `DSH-RUN-P014-01` binding updated to `FRONTEND_TRANSPORT_BOUND__E2E_PROOF_CAPTURED`. No UI visual change, no route change, no new endpoint, no backend change. E2E request/response/screen proof is the remaining Batch 9D blocker.

Post-9C reality reset:
`DSH-SLICE-001 UI_UX_VISUAL_LOCKED`. A local `DSH_SLICE_001_L7_RUNTIME-*` evidence folder exists and includes required screenshot evidence, proving a scoped app-client edge only; not full cross-surface Slice 001 closure.

Batch 9D final decision:
`DSH-SLICE-001 UI_UX_VISUAL_LOCKED`. Frontend lists refactored to `FlatList`, callbacks memoized, and runtime evidence (screenshots, DB queries, bridge proof, and performance notes) captured.
Runtime/API/L7 closure remains deferred until API binding and E2E cross-surface runtime proof are approved and proven.
Prior app-client / GET /stores L7 evidence does not equal full cross-surface Slice 001 L7 closure.

Go API Startup & E2E Proof (2026-06-03):
`LOCAL_GO_API_E2E_PROVEN` for `DSH-SLICE-001` / `GET /stores` only. Verified scope: Documented start command, live Go API listening on port 8080, connected to Postgres on port 55432, and captured HTTP GET /stores evidence.

app-client Live Mobile Runtime Proof (2026-06-03):
`APP_CLIENT_MOBILE_RUNTIME_PROVEN` for `DSH-SLICE-001` / `GET /stores` only. Verified scope: Physical Android device running via ADB and reverse port-forwarding tcp:8080 + tcp:8081, app-client successfully loaded live data from the Go API without preview fallback (fetched 3 stores), and screenshots captured under `DSH_SLICE001_BACKEND_E2E-20260603`. Overall cross-surface Slice 001 closure remains deferred.

Partner + Control Panel Visual Observation — Handoff NOT Proven (2026-06-03):
Decision: `SLICE001_HANDOFF_VISUAL_OBSERVED_RUNTIME_HANDOFF_BLOCKED`
What was observed: Screenshots captured under `DSH_SLICE001_REALITY_SYNC-20260603`. Physical SM-A125F shows app-partner orders screen (ORD-4401/4398/4391). Control-panel port 3000 shows overview, partners, operations, and catalogs sections. Screens render correctly from current branch.
What was NOT proven: (1) partner accept/prepare/ready button press produces a backend API call. (2) catalog approve/reject in CP writes to a Go endpoint. (3) marketing visibility toggle changes shared serviceability state. (4) any of the above actions changes the `GET /stores` response. No API binding, no Go endpoint for these actions, no DB write traced, no GET /stores response diff captured.
Status: `APP_PARTNER_RUNTIME_VISUAL_OBSERVED` + `CONTROL_PANEL_RUNTIME_VISUAL_OBSERVED`. Rows DSH-RUN-P014-04 and DSH-RUN-P014-07 corrected from false PROVEN labels to VISUAL_OBSERVED + HANDOFF_BLOCKED.
Remaining blocker: partner catalog/readiness endpoint + catalog-approval endpoint + marketing-visibility endpoint must be implemented, wired, and proven to affect GET /stores before this gate can be promoted.

DSH-SLICE-001 Backend Live E2E Proven (2026-06-03):
Decision: `DSH_SLICE001_BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING`
Evidence: `tools/registry/runs/DSH_SLICE001_LIVE_E2E-20260603-173059/`
Summary:

- 01-get-before.json: 3 stores (store-1001, store-1002, store-1003); store-1004 filtered correctly as closed
- 02 PATCH partner-readiness paused → client_visible: false
- 03 GET /stores after readiness paused → store-1001 removed (2 stores)
- 04 PATCH partner-readiness ready → client_visible: true (restored)
- 05 PATCH catalog quality rejected → client_visible: false
- 06 GET /stores after catalog rejected → store-1001 removed (2 stores)
- 07 PATCH catalog approved → client_visible: true (restored)
- 08 PATCH marketing inactive → client_visible: false
- 09 GET /stores after marketing inactive → store-1001 removed (2 stores)
- 10 PATCH marketing active → client_visible: true (restored)
- 11 GET /stores final → 3 stores restored
- go test -count=1 ./...: ok bthwani.local/dsh/backend/internal/http (0.041s)
- Server: dsh-api using postgres repository (live Postgres on port 55432)

Rows updated: DSH-RUN-P014-04 → BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING; DSH-RUN-P014-07 → BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING; DSH-RUN-P014-09 → DSH_SLICE001_BACKEND_LIVE_E2E_PROVEN
Remaining blocker: app-partner frontend endpoint binding + control-panel frontend endpoint binding + screen evidence after wiring.

DSH-SLICE-001 Frontend Transport Binding (2026-06-03):
Decision: `DSH_SLICE001_FRONTEND_TRANSPORT_BOUND__SCREEN_PROOF_PENDING`
Evidence: Current branch `ghb-0174-20260603-054326-checkpoint`
Summary:

- `dsh/frontend/shared/dsh-store-visibility-client.ts` — typed client for all 3 PATCH visibility gate endpoints; derives types directly from dsh.openapi.yaml contracts.
- `dsh/frontend/shared/dsh-store-visibility-transport.ts` — HTTP transport factory; reads `EXPO_PUBLIC_DSH_API_BASE_URL` (mobile) or `NEXT_PUBLIC_DSH_API_BASE_URL` (Next.js); falls back gracefully when env var is absent.
- `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` — `StoreReadinessGate` component added; calls `PATCH /stores/{id}/partner-readiness` with `ready` or `paused`; shows `client_visible` result; renders only when `canonicalStoreId` prop is present.
- `dsh/frontend/control-panel/operations/PartnerStoresScreen.tsx` — catalog-approval section added to store inspector; calls `PATCH /stores/{id}/catalog-approval`; marketing-visibility section added; calls `PATCH /stores/{id}/marketing-visibility`; both show `client_visible` result inline.
- `pnpm exec tsc --noEmit` — zero errors.

Rows updated: DSH-RUN-P014-04 → `FRONTEND_TRANSPORT_BOUND__SCREEN_PROOF_PENDING`; DSH-RUN-P014-07 → `FRONTEND_TRANSPORT_BOUND__SCREEN_PROOF_PENDING`
Remaining blocker: screen/runtime proof — run Go API + mobile/web session, press the wired buttons, capture screenshots and network trace.

DSH-SLICE-001 Final Screen Runtime Proof (2026-06-03):
Decision: `DSH_SLICE001_FINAL_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE`
Evidence: `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/`
Summary:

- All 3 visibility gates (partner-readiness, catalog-approval, marketing-visibility) verified on physical device and local control-panel browser against live Postgres database.
- app-partner: StoreReadinessGate button pressed on device; PATCH /stores/{id}/partner-readiness produced paused→client_visible:false and ready→client_visible:true; GET /stores response diff captured.
- control-panel: catalog-approval section buttons pressed in browser; PATCH /stores/{id}/catalog-approval produced rejected→client_visible:false and approved→client_visible:true; GET /stores diff captured.
- control-panel: marketing-visibility section buttons pressed in browser; PATCH /stores/{id}/marketing-visibility produced inactive→client_visible:false and active→client_visible:true; GET /stores diff captured.
- All blockers resolved. No remaining proof pending.

Rows updated: DSH-RUN-P014-01 → `DSH_SLICE001_SCREEN_RUNTIME_PROVEN`; DSH-RUN-P014-04 → `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` / `SCREEN_RUNTIME_PROVEN`; DSH-RUN-P014-07 → `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` / `SCREEN_RUNTIME_PROVEN`
Contradictions resolved: CONTRA-001 (coverage index), CONTRA-004 (slice manifest).
Next action: Update SCREEN_API_MATRIX rows DSH-SAPI-P014-05 and DSH-SAPI-P014-10; then transition to DSH-SLICE-002.
