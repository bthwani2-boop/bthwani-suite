# DSH UI/UX/Flow Closure Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: PHASE_3R_O4_READY_FOR_MANUAL_DESIGN

Evidence source:
- `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`
- `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336`

Summary:
- `live_screen_scan_current_head`: 85 files across `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel`
- `giant_screen_candidates_current_head`: 8
- `required_visual_runtime_captures`: 30 minimum screenshots across the five active DSH surfaces
- `phase_c_freeze_status`: P0 flow freeze is complete, but visual/runtime evidence remains blocking
- `phase_3r_o4_operating_logic_lock`: manual-design contract is ready, while runtime/backend/domain/WLT closure remains blocked

Purpose:
Single lean matrix for DSH UI/UX/Flow closure on the current branch. This file records only live route anchors, live screen files, and evidence-backed blockers.

Required closure rule:
A DSH UI/UX/Flow row is not accepted beyond preview-only scope until it has:
- surface ownership proof
- route or host proof
- screen or file proof
- primary CTA
- required state coverage
- trusted RTL/visual proof where visible UI exists
- runtime evidence or an explicit blocker

Current head surface anchors:

| Surface | Host / Route Anchor | Canonical Screen Family | Current Reality Lock |
|---|---|---|---|
| `app-client` | `app-client/shell/ClientSurfaceHost.tsx` -> `dsh/frontend/app-client/DshClientSurface.tsx` | `dsh/frontend/app-client/screens/*.tsx` | scoped preview closure only |
| `app-partner` | `app-partner/shell/PartnerSurfaceHost.tsx` -> `dsh/frontend/app-partner/DshPartnerSurface.tsx` | `dsh/frontend/app-partner/screens/*.tsx` | scoped preview closure only |
| `app-captain` | `app-captain/shell/CaptainSurfaceHost.tsx` -> `dsh/frontend/app-captain/DshCaptainSurface.tsx` | `dsh/frontend/app-captain/screens/*.tsx` | scoped preview closure only |
| `app-field` | `app-field/shell/FieldSurfaceHost.tsx` -> `dsh/frontend/app-field/DshFieldSurface.tsx` | `dsh/frontend/app-field/screens/*.tsx` | scoped preview closure only |
| `control-panel` | `dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx` | `dsh/frontend/control-panel/**/*.tsx` | scoped preview closure only |

Heatmap placement contract:
- `control-panel`: allowed only in `dsh/frontend/control-panel/operations/GeoHeatmapScreen.tsx`
- `app-captain`: allowed only in `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx`
- `app-client`, `app-partner`, `app-field`: no heatmap placement is accepted

## Flow Closure Matrix

| Flow ID | Flow | Actor | Surface | Screen/File | Route/Host | Primary CTA | Required States | Visual Status | Runtime Status | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-FLOW-001` | Store discovery + promos lifecycle | Customer + Partner + Admin | `app-client + app-partner + control-panel` | `dsh/frontend/app-client/screens/HomeScreen.tsx`; `dsh/frontend/app-partner/screens/PromotionsScreen.tsx`; `dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx`; `dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx`; `dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx`; `dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx`; `dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx` | `ClientSurfaceHost` -> `DshClientSurface`; `PartnerSurfaceHost` -> `DshPartnerSurface`; `DshControlPanelSurfaceHost` -> marketing/partners sections | open discovery destination, submit promotion intent, approve featured eligibility | `loading/empty/error/success/offline` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`; `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | attach current-branch client, partner, and control-panel screenshots for discovery/promotions |
| `DSH-FLOW-002` | Storefront | Customer | `app-client` | `dsh/frontend/app-client/screens/StoreScreen.tsx`; `dsh/frontend/app-client/screens/StoreItemsScreen.tsx` | `ClientSurfaceHost` -> `DshClientSurface` -> `StoreScreen` | browse items and open product detail | `loading/empty/error/success/offline` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture store and store-items screenshots with availability states |
| `DSH-FLOW-003` | Catalog/product browsing | Customer | `app-client` | `dsh/frontend/app-client/screens/SearchScreen.tsx`; `dsh/frontend/app-client/screens/StoreItemsScreen.tsx` | `ClientSurfaceHost` -> `DshClientSurface` | search, filter, add item | `loading/empty/error/success/offline` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture search and catalog screenshots |
| `DSH-FLOW-004` | Cart | Customer | `app-client` | `dsh/frontend/app-client/screens/CartScreen.tsx` | `ClientSurfaceHost` -> `DshClientSurface` | review cart and continue to checkout | `loading/empty/error/success/offline/blocked` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture cart screenshots for empty, filled, and blocked states |
| `DSH-FLOW-005` | Checkout | Customer | `app-client` | `dsh/frontend/app-client/screens/CartScreen.tsx` checkout path | `ClientSurfaceHost` -> `DshClientSurface` | place order | `loading/error/success/blocked/retry` | `NEEDS_VISUAL_EVIDENCE` | `BLOCKED_BY_WLT/AUTH` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`; `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `BLOCKED_BY_WLT/AUTH` | keep checkout blocked until WLT/auth proof exists |
| `DSH-FLOW-006` | Order creation | Customer + Partner | `app-client + app-partner` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx`; `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` | `ClientSurfaceHost` -> `DshClientSurface`; `PartnerSurfaceHost` -> `DshPartnerSurface` | submit order, accept or reject order | `pending/success/error/retry/blocked` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` | `NOT_READY_FOR_API` | freeze lifecycle vocabulary after upstream visual proof |
| `DSH-FLOW-007` | Partner preparation | Partner | `app-partner` | `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx`; `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx`; `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` | `PartnerSurfaceHost` -> `DshPartnerSurface` | accept, prepare, ready, report issue | `loading/empty/error/success/offline/blocked/retry` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture partner inbox, detail, prep, inventory, and support screenshots |
| `DSH-FLOW-008` | Captain assignment + delivery | Captain + Ops | `app-captain` | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx`; `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx`; `dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx` | `CaptainSurfaceHost` -> `DshCaptainSurface` | accept task, pickup, deliver, report issue | `loading/empty/error/success/offline/retry/blocked` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture captain inbox, detail, map, pickup/dropoff, support, and finance bridge screenshots |
| `DSH-FLOW-009` | Tracking | Customer + Captain + Ops | `app-client + app-captain + control-panel` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx`; `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx`; `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` | `ClientSurfaceHost`; `CaptainSurfaceHost`; `DshControlPanelSurfaceHost` | monitor live order progress | `loading/error/success/offline/retry` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture current-branch tracking screenshots across all three surfaces |
| `DSH-FLOW-010` | Support + refund + exception | Customer + Partner + Captain + Admin | `app-client + app-partner + app-captain + control-panel` | `dsh/frontend/app-client/screens/OperationScreens.tsx`; `dsh/frontend/app-partner/screens/OperationScreens.tsx`; `dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx`; `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` | surface host of each surface above | open issue, escalate, cancel, refund request, resolve | `loading/empty/error/success/retry/blocked` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture support and exception screenshots before any contract claim |
| `DSH-FLOW-011` | Rating | Customer | `app-client` | embedded client post-order rating path in `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | `ClientSurfaceHost` -> post-order client journey | submit rating | `success/error/retry` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` | `NOT_READY_FOR_API` | keep rating blocked until a proven standalone or explicitly embedded current-branch flow exists |
| `DSH-FLOW-012` | Control-panel operations | Admin/Ops | `control-panel` | `dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx`; `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` | `DshControlPanelSurfaceHost` | monitor and intervene | `loading/empty/error/success/offline/disabled` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture operations, exceptions, SLA, support, and finance preview screenshots |
| `DSH-FLOW-013` | Field onboarding + visit + handoff | Field + Admin + Partner | `app-field + control-panel + app-partner` | `dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldStoresHistoryScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldProfileScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx` | `FieldSurfaceHost` -> `DshFieldSurface` | submit onboarding, capture visit, escalate blocker, hand off readiness | `loading/empty/error/success/offline/disabled` | `NEEDS_VISUAL_EVIDENCE` | `RUNTIME_UNPROVEN` | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture field stores, onboarding, visit, history, profile, and finance bridge screenshots |

## High-Risk Current-Head Screens

| Surface | File | Size Bytes | Decision | Next Action |
|---|---|---:|---|---|
| `app-client` | `dsh/frontend/app-client/screens/StoreScreen.tsx` | 99714 | `NEEDS_REVIEW` | split only if a later implementation slice touches the file |
| `app-client` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | 77930 | `NEEDS_REVIEW` | keep under observation during tracking/rating work |
| `app-client` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | 73472 | `NEEDS_REVIEW` | keep under observation during discovery/promos work |
| `control-panel` | `dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx` | 61973 | `NEEDS_REVIEW` | avoid mixing marketing and runtime claims in one patch |
| `app-captain` | `dsh/frontend/app-captain/DshCaptainSurface.tsx` | 55138 | `NEEDS_REVIEW` | avoid broad rewrites without route-by-route proof |
| `app-client` | `dsh/frontend/app-client/screens/CartScreen.tsx` | 53231 | `NEEDS_REVIEW` | keep cart and checkout changes tightly scoped |
| `app-partner` | `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` | 49347 | `NEEDS_REVIEW` | isolate partner operations changes by screen or section |
| `app-captain` | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` | 43587 | `NEEDS_REVIEW` | isolate captain task and PoD changes by subflow |

## Current Closure Decision

UI/UX/Flow is frozen for preview-only scope on the current branch, but it is not accepted beyond `mobile preview scope`.

Current branch result:
- current live routes and screens are mapped
- P0 flow freeze is recorded
- trusted visual/runtime evidence is still missing for the active DSH surfaces
- full service closure remains blocked

## Phase 3R-O4 Operating Logic + Screen Gap Lock

Status: `PHASE_3R_O4_READY_FOR_MANUAL_DESIGN`

Phase 3R-O4 deliverables:
- `dsh/docs/DSH_PHASE_3R_SCREEN_GAP_INVENTORY.md`
- `dsh/docs/DSH_PHASE_3R_OPERATING_LOGIC_MODEL.md`
- `dsh/docs/DSH_PHASE_3R_MANUAL_DESIGN_WORK_ORDER.md`
- `dsh/docs/DSH_PHASE_3R_PREVIEW_SCENARIOS.md`

Phase 3R-O4 judgment:
- current preview screenshots and prior captures are sufficient to confirm that the five DSH surfaces visibly exist as preview surfaces
- those images are not accepted as runtime proof and do not close backend, domain, auth, or WLT-ledger truth
- this phase is ready for manual design because the operating logic, screen gaps, and WLT boundaries are now explicitly frozen in docs
- this phase does not promote DSH to runtime pass, service closure, or API readiness

| Surface | Status | Next Action |
|---|---|---|
| `app-client` | `READY_FOR_MANUAL_DESIGN` | design discovery, storefront, cart, checkout intent, tracking, support, and rating states against the new Phase 3R docs |
| `app-partner` | `READY_FOR_MANUAL_DESIGN` | design intake, accept/reject, prep/ready, unavailable-item, support, and availability states |
| `app-captain` | `READY_FOR_MANUAL_DESIGN` | design assignment, route readiness, pickup, dropoff, PoD, issue, and WLT-display boundaries |
| `app-field` | `READY_FOR_MANUAL_DESIGN` | design onboarding, visit, readiness escalation, history/profile, and WLT-display boundaries |
| `control-panel` | `READY_FOR_MANUAL_DESIGN` | design operations, partner intervention, support, catalog, marketing, finance visibility, and audit states |
| `WLT` | `BLOCKED_BY_WLT_BOUNDARY` | keep all payment, wallet, settlement, refund, payout, commission, and ledger semantics outside DSH |
| `backend-domain` | `NOT_READY_FOR_IMPLEMENTATION` | keep serviceability, order lifecycle, support, and finance contracts in planning-only state until later proof gates are satisfied |
