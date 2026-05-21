# DSH Runtime Evidence Matrix

Status: ACTIVE_FRONTEND_CLOSURE_CONTROL
Decision: RUNTIME_UNPROVEN

Purpose:
Lean runtime matrix for the live frontend closure truth after P0-14. This file separates route and screen proof from runtime proof.

Current rule:

- route proof does not promote preview, local-state, fixture, or seed data to runtime truth
- no WLT-owned money semantics move into DSH
- no backend or API closure claim is allowed from this file

Historic anchors:

- `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`
- `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336`

P0-14 note:

- no new runtime capture was added in this phase
- this matrix now derives current frontend truth from live registries plus `dshCrossSurfaceClosureMap.ts`

| Runtime ID | Surface / slice | Live anchors | Data classification | Closure status | Runtime binding | Evidence status | Remaining blocker | Next allowed proof |
|---|---|---|---|---|---|---|---|---|
| `DSH-RUN-P014-01` | app-client discovery + storefront | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | `preview`, `props-driven`, `local-state` | `preview-ready` | `UI_PREVIEW_ONLY` | `pending-ui-gap` | store visibility and promo-to-store binding still need visual and runtime proof | trusted current-branch screenshots plus serviceability/runtime source proof |
| `DSH-RUN-P014-02` | app-client cart + checkout intent | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx` | `preview`, `local-state`, `WLT-adjacent` | `preview-ready` | `NEEDS_BINDING_LATER` | `pending-ui-gap` | WLT payment lifecycle and order-create failure states are not runtime-proven | screenshots plus trusted WLT/auth runtime proof |
| `DSH-RUN-P014-03` | app-client tracking + support | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | `preview`, `local-state` | `preview-ready` | `NEEDS_RUNTIME_EVIDENCE` | `pending-ui-gap` | cancellation, refund, support-exception, and rating handoff remain preview-only | cross-surface screenshots plus lifecycle event proof |
| `DSH-RUN-P014-04` | app-partner intake + catalog | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `InventoryCatalogScreen.tsx`; `DshPartnerOrderRejectionScreen.tsx` | `preview`, `local-state` | `preview-ready` | `NEEDS_RUNTIME_EVIDENCE` | `pending-ui-gap` | acceptance timer, delay, handoff, and publishing states remain preview-only | partner screenshots plus actor handoff proof |
| `DSH-RUN-P014-05` | app-captain pickup + delivery + PoD | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | `preview`, `fixture`, `local-state` | `preview-ready` | `NEEDS_RUNTIME_EVIDENCE` | `pending-ui-gap` | pickup, delivery-failure, and proof-policy states remain preview-only | captain screenshots plus delivery milestone proof |
| `DSH-RUN-P014-06` | app-field onboarding + visit + readiness | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx`; `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx` | `preview`, `local-state` | `preview-ready` | `NEEDS_RUNTIME_EVIDENCE` | `pending-ui-gap` | document states, revisit states, and readiness outcome states remain preview-only | field screenshots plus readiness handoff proof |
| `DSH-RUN-P014-07` | control-panel operations | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | `preview`, `local governance state` | `needs-visual-evidence` | `NEEDS_RUNTIME_EVIDENCE` | `pending-visual` | current-branch screenshots and runtime intervention proof are still missing | control-panel screenshots plus live intervention/runtime proof |
| `DSH-RUN-P014-08` | control-panel finance bridge | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | `preview`, `read-only bridge` | `blocked-by-wlt` | `BLOCKED_BY_WLT` | `blocked-by-wlt` | settlement, payout, refund, commission, and ledger remain WLT-owned | WLT-owned runtime proof only; no DSH finance mutation |
| `DSH-RUN-P014-09` | backend + domain + OpenAPI | `dsh/backend`; `dsh/domain`; `dsh/dsh.openapi.yaml` | `scaffold`, `TBD` | `blocked-by-contract` | `BLOCKED_BY_CONTRACT` | `blocked-by-contract` | no handler, domain, persistence, auth, or observability proof exists in this slice | backend/domain/API work only after frontend proof gates move forward |

Closure rule:
`RUNTIME_UNPROVEN` remains the service-wide runtime decision until trusted runtime proof exists for the active frontend slices above. A visual pass alone does not promote preview data to runtime truth.
