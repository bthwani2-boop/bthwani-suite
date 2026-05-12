# DSH Runtime Evidence Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: RUNTIME_UNPROVEN

Purpose:
Single lean runtime evidence file for the current branch. It separates preview and fixture truth from runtime truth and records the exact blockers that still prevent DSH runtime closure.

Allowed classifications:
- `mock`
- `fixture`
- `seed`
- `preview`
- `props-driven`
- `local-state`
- `runtime truth`
- `production-like truth`

Current branch decision vocabulary:
- `UI_PREVIEW_ONLY`
- `NEEDS_BINDING_LATER`
- `NEEDS_VISUAL_EVIDENCE`
- `RUNTIME_UNPROVEN`
- `NOT_READY_FOR_API`
- `BLOCKED_BY_WLT/AUTH`

Rule:
No preview, fixture, seed, or local-state source may be promoted to runtime truth without trusted current-branch proof for source, provider, happy path, failure path, and recovery path.

Evidence anchors:
- `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`
- `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336`
- `tools/registry/runs/DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555`

| Runtime ID | Scope | Owner Path | Used By | Data Classification | Runtime Claim Allowed | Required Proof | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|
| `DSH-RUN-001` | app-client discovery, storefront, cart, and tracking | `dsh/frontend/app-client/screens/HomeScreen.tsx`; `dsh/frontend/app-client/screens/StoreScreen.tsx`; `dsh/frontend/app-client/screens/CartScreen.tsx`; `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | `app-client` | `props-driven`, `preview`, `local-state` | `NO` | device or simulator screenshots for home, store, cart, tracking, plus failure and blocked states on the current branch | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture trusted current-branch app-client screenshots |
| `DSH-RUN-002` | app-partner queue, prep, support, and promotions | `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx`; `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx`; `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx`; `dsh/frontend/app-partner/screens/PromotionsScreen.tsx`; `dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx` | `app-partner` | `preview`, `local-state` | `NO` | current-branch screenshots for home, inbox, detail, prep, inventory, support, and wallet bridge | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture trusted current-branch partner screenshots |
| `DSH-RUN-003` | app-captain task, map, support, and finance bridge | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx`; `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx`; `dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx`; `dsh/frontend/app-captain/screens/DshCaptainFinanceScreen.tsx` | `app-captain` | `preview`, `fixture`, `local-state` | `NO` | current-branch screenshots for inbox, detail, map, pickup/dropoff, support, and finance bridge; failure proof for task flow | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture trusted current-branch captain screenshots |
| `DSH-RUN-004` | app-field onboarding, visit, history, profile, and finance bridge | `dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldStoresHistoryScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldProfileScreen.tsx`; `dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx` | `app-field` | `preview`, `local-state` | `NO` | current-branch screenshots for stores, onboarding, visit, history, profile, and finance bridge | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture trusted current-branch field screenshots |
| `DSH-RUN-005` | control-panel operations, marketing, and partner eligibility | `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx`; `dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx`; `dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx`; `dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx`; `dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx`; `dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx` | `control-panel` | `preview`, `local governance state` | `NO` | trusted current-branch screenshots for operations, exceptions, SLA, support, finance preview, marketing, and partner eligibility flows | `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `NEEDS_VISUAL_EVIDENCE` | capture trusted current-branch control-panel screenshots |
| `DSH-RUN-006` | checkout and WLT-dependent payment boundary | `dsh/frontend/app-client/screens/CartScreen.tsx`; WLT bridge remains outside this service root | `app-client`, partner/captain/field finance bridges by dependency | `preview` | `NO` | WLT runtime provider proof, auth proof, payment decision proof, failure/recovery proof, and current-branch checkout screenshots | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336`; `tools/registry/runs/DSH_VISUAL_RUNTIME_SMOKE-20260512-023336` | `BLOCKED_BY_WLT/AUTH` | keep checkout blocked until WLT/auth runtime truth exists |
| `DSH-RUN-007` | order lifecycle event chain across client, partner, captain, field, and ops | multiple screens across `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel` | all active DSH surfaces | `preview`, `fixture`, `local-state` | `NO` | canonical lifecycle schema, current-branch multi-surface screenshots, and runtime event provider proof | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` | `NOT_READY_FOR_API` | freeze lifecycle vocabulary before runtime binding |
| `DSH-RUN-008` | backend, domain, and OpenAPI surface | `dsh/backend`; `dsh/domain`; `dsh/dsh.openapi.yaml` | DSH service | `scaffold/TBD` | `NO` | handler, domain, persistence, auth, and observability proof after screen/API freeze | `tools/registry/runs/DSH_FINAL_REALITY_LOCK-20260512-023336` | `NOT_READY_FOR_API` | keep backend/domain/API blocked in this phase |
| `DSH-RUN-009` | mobile preview closure gate baseline | `dsh/frontend/app-client`; `dsh/frontend/app-partner`; `dsh/frontend/app-captain`; `dsh/frontend/app-field` | mobile DSH surfaces | `preview` | `NO` | runtime smoke and current-branch screenshots on top of registry/classification closure | `tools/registry/runs/DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555` | `RUNTIME_UNPROVEN` | preserve the mobile gate as preview-only baseline; do not promote it to runtime truth |

Closure rule:
`RUNTIME_UNPROVEN` remains the service-wide decision until trusted runtime proof exists for the active surfaces above. A visual pass alone does not promote preview data to runtime truth.
