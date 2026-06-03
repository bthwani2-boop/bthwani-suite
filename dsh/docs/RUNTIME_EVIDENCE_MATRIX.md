# DSH Runtime Evidence Matrix

Status: MIXED_RUNTIME_MATRIX
Decision: DSH_SLICE_001_UI_UX_VISUAL_LOCKED__RUNTIME_DEFERRED__OTHER_ROWS_PENDING

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
| `DSH-RUN-P014-01` | app-client discovery + storefront | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx`; `DshClientSurface.tsx`; typed client bridge; `dsh-discovery-stores-transport.ts`; `dsh-discovery-stores-runtime-config.ts` | `runtime-proven` | app-client / GET /stores edge proof only; not full cross-surface Slice 001 closure | app-client / GET /stores edge proof only; not full cross-surface Slice 001 closure | `api-db-runtime-proven__transport-bound__screen-runtime-proven` | pending partner & CP cross-surface proof for Slice 001 | DSH-SLICE-001 UI_UX_VISUAL_LOCKED; runtime proof deferred |
| `DSH-RUN-P014-02` | app-client cart + checkout intent | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx` | `preview`, `local-state`, `WLT-adjacent` | `needs-visual-evidence` | `NEEDS_BINDING_LATER` | `needs-visual-evidence` | payment lifecycle and order-create failure states are wired; screenshots and trusted WLT runtime proof are still missing | screenshots plus trusted WLT/auth runtime proof |
| `DSH-RUN-P014-03` | app-client tracking + support | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | `preview`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | cancellation/refund/support-exception/rating handoff are wired; screenshots and lifecycle runtime proof are still missing | cross-surface screenshots plus lifecycle event proof |
| `DSH-RUN-P014-04` | app-partner intake + catalog | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `InventoryCatalogScreen.tsx`; `DshPartnerOrderRejectionScreen.tsx` | `preview`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | accept/reject/handoff/publishing logic is wired; screenshots and actor handoff proof are still missing | partner screenshots for Slice 001 + actor handoff proof |
| `DSH-RUN-P014-05` | app-captain pickup + delivery + PoD | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | `preview`, `fixture`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | pickup/delivery-failure/PoD logic is wired; screenshots and milestone proof are still missing | captain screenshots plus delivery milestone proof |
| `DSH-RUN-P014-06` | app-field onboarding + visit + readiness | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx`; `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | `preview`, `local-state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | document states, revisit states, and readiness outcomes are wired; screenshots and handoff proof are still missing | field screenshots plus readiness handoff proof |
| `DSH-RUN-P014-07` | control-panel operations | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | `preview`, `local governance state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `needs-visual-evidence` | current-branch screenshots and runtime intervention proof are still missing | control-panel screenshots plus live intervention/runtime proof |
| `DSH-RUN-P014-08` | control-panel finance bridge | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | `preview`, `read-only bridge` | `blocked-by-wlt` | `BLOCKED_BY_WLT` | `blocked-by-wlt` | settlement, payout, refund, commission, and ledger remain WLT-owned | WLT-owned runtime proof only; no DSH finance mutation |
| `DSH-RUN-P014-09` | backend + domain + OpenAPI | dsh/backend; dsh/domain; dsh/dsh.openapi.yaml | go-skeleton, postgres-repository, docker-compose-postgres, migration-seed, openapi-aligned | LOCAL_GO_API_E2E_PROVEN | LOCAL_GO_API_START_COMMAND_DOCUMENTED | api-db-runtime-proven | app-client screen runtime evidence requires live mobile/runtime session proof | DSH-SLICE-001 UI_UX_VISUAL_LOCKED; runtime proof deferred |

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
`LOCAL_GO_API_E2E_PROVEN` for `DSH-SLICE-001` / `GET /stores` only. Verified scope: Documented start command, live Go API listening on port 8080, connected to Postgres on port 55432, and captured HTTP GET /stores evidence under `DSH_SLICE001_BACKEND_E2E-20260603`. Overall cross-surface Slice 001 closure remains deferred, and app-client screen runtime proof is blocked until a live mobile session is available.
