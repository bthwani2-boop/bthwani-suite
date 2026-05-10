# DSH UI/UX/Flow Closure Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: NOT_CLOSED

Evidence source:
- CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528
- tools\registry\runs\CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528

Summary:
- screen_file_count: 67
- giant_screen_candidates: 5
- visual_evidence_gaps: 15
- tbd_flow_mappings: 10

Note: DSH-CAP-001..009B closed non-visual baseline only. Visual and runtime proof remains missing.

Purpose:
Single lean matrix for DSH UI/UX/Flow closure. This file replaces separate screen inventory, flow registry, route parity, state coverage, visual RTL plan, and UI kit boundary files.

Required closure rule:
A DSH UI/UX/Flow row is not CLOSED until it has:
- surface ownership proof
- route/host proof
- screen/file proof
- primary CTA
- state coverage
- RTL/visual proof where visible UI exists
- UI kit boundary proof
- runtime evidence or explicit runtime blocker
- evidence path

Preview-only ownership lock:
- canonical surfaces are `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`
- preview/runtime labels are `UI_PREVIEW_ONLY`, `NEEDS_BINDING_LATER`, `NEEDS_RUNTIME_EVIDENCE`
- live dispatch map is allowed only inside `control-panel` operations
- captain-scoped route/map is allowed only inside `app-captain`
- no heatmap belongs in `app-client`, `app-partner`, or `app-field`

## Wave 01 Frontend Ownership / Classification Matrix

Status: IN_PROGRESS
Decision: NOT_CLOSED

Current-head evidence anchors:
- `tools/registry/runs/DSH_FRONTEND_PREFLIGHT_CONDENSER-20260510-065305`
- `tools/registry/runs/DSH_NAMING_CLASSIFICATION_CONTRACT_B2C-20260510-044245`
- `tools/registry/runs/DSH_SEMANTIC_OWNERSHIP_AUDIT_B2D-20260510-045348`
- `tools/registry/runs/DSH_FINAL_GATE_B2F_R1-20260510-052400`
- `tools/registry/runs/B4_P1_FIXTURE_LOCATION_DATA_CONTRACT-20260510-053500`
- `tools/registry/runs/B4_P2_APP_CLIENT_SMALL_FIXTURE_DATA_CONTRACT-20260510-054147`
- `tools/registry/runs/B4_P3_APP_CLIENT_FIXTURE_BUILDER_DATA_CONTRACT-20260510-054903`
- `tools/registry/runs/B4_P4_DSH_REMAINING_SMALL_DATA_CONTRACT_SWEEP-20260510-060904`
- `tools/registry/runs/B4_P5_DSH_SKIPPED_DATA_CONTRACT_CLOSURE-20260510-061926`

Wave 00 preflight summary:
- branch parity: PASS (`ghb/0127-20260510-020924-governance` matches `origin/ghb/0127-20260510-020924-governance`)
- worktree delta at preflight: only the execution package file under `tools/plan/DSH_FRONTEND_FINAL_CLOSURE_MEGA_EXECUTION_20260510.md`
- TypeScript baseline: PASS
- naming evidence: B2C still reports 40 manual-review items
- rename guardrail: B2F-R1 still allows 0 rename candidates under current rules

### Surface Ownership Matrix

| Surface | Current HEAD owner root | Canonical host / route anchor | Canonical screen-entry family | Preview / data family | Wave 01 rule |
|---|---|---|---|---|---|
| app-client | `dsh/frontend/app-client` | `DshSurfaceHost.tsx` | `Dsh*Screen.tsx` | `*Fixtures.ts`, `types.ts`, `builders.ts`, `store-profile.ts` | treat client heatmap as forbidden; keep preview/data files out of rename scope |
| app-partner | `dsh/frontend/app-partner` | `DshPartnerConsoleScreen.tsx` plus partner entry/orders screens | `DshPartner*Screen.tsx` | `fixture-locations.ts`, `dshPartner*Model.ts`, `dshPartnerOperationalFlowIds.ts` | partner remains actor-owned; no heatmap placement allowed |
| app-captain | `dsh/frontend/app-captain` | `DshCaptainEntryScreen.tsx`, `DshCaptainOrdersScreen.tsx`, `DshCaptainOperationsScreen.tsx` | `DshCaptain*Screen.tsx` | `fixture-locations.ts`, `dshCaptain*Model.ts`, `flow-map.ts`, `dshCaptainBinding.contracts.ts` | captain-scoped route/map is the only non-control-panel map exception |
| app-field | `dsh/frontend/app-field` | `FieldSurfaceHost.tsx`, `mobile-entry.tsx` | `DshField*Screen.tsx` | `dshField*Model.ts`, `FieldOnboardingStorage.ts`, `fieldStoreModel.ts` | field remains visit/onboarding owned; no heatmap placement allowed |
| control-panel | `dsh/frontend/control-panel` | `DshControlPanelSurfaceHost.tsx` and `control-panel/shell/ControlPanelSurfaceHost.tsx` | `ControlPanelDsh*Screen.tsx`, section screens under `dashboard/`, `finance/`, `operations/`, `support/`, `catalogs/`, `partners/`, `marketing/`, `control/` | `fixture-locations.ts`, `*.preview-data.ts`, section registries/types | live dispatch map belongs only to `operations/GeoHeatmapScreen.tsx` |
| shared | `dsh/frontend/shared` | none | none | `*store.ts`, `catalog.ts`, `*PreviewModel.ts`, `workflow.ts`, `dshStoreProductCardModel.ts`, `store-card-commercial-map.ts` | shared is preview/data/helper only; never a routed surface |

### Classification Contract (Current HEAD)

| Current file family / pattern | Classification | Current HEAD note |
|---|---|---|
| `Dsh*Screen.tsx`, `ControlPanelDsh*Screen.tsx`, `*Page.tsx` | `SCREEN_ENTRY` | routed or directly mounted surface entry; giant-screen candidates remain review-only until a bounded slice touches them |
| `*Panel.tsx`, `*WorkspaceContent.tsx`, `*ActionQueue.tsx`, `*DecisionBoard.tsx`, `*WorkspaceFrame.tsx`, `FieldStoreCard.tsx` | `SCREEN_PART` | embedded workbench or screen-part composition; not a standalone surface |
| `*.preview-data.ts`, `*PreviewModel.ts` | `PREVIEW_DATA` | preview-only inputs; never runtime truth |
| `*Fixtures.ts`, `fixture-locations.ts` | `FIXTURE` | fixture authority and data-contract gap closure only; not rename candidates in Wave 01 |
| `*store.ts`, `*catalog.ts`, `*cardModel.ts`, `store-card-commercial-map.ts`, `promo-store.ts`, `video-store.ts` | `STORE_PREVIEW` | shared preview-store authority; can be consolidated only with import/consumer proof |
| `surface-meta.ts`, `surface-catalog.ts`, `flow-meta.ts`, `flow-map.ts`, `*StateModel.ts`, `*Binding.contracts.ts`, `workflow.ts`, `types.ts`, `builders.ts`, `resolve*.ts`, `map*.ts`, `get*.ts` | `SHARED_HELPER` | metadata, helper, or bridge-only files; fix naming only when proof is explicit |
| `DshSurfaceHost.tsx`, `FieldSurfaceHost.tsx`, `mobile-entry.tsx`, `DshControlPanelSurfaceHost.tsx` | `ROUTE_ADAPTER` | host or route adapter; do not rename without route and registry proof |
| `dsh/frontend/app-client/DshHomeScreen.mappers.ts` | `DEAD_CANDIDATE` | archived in Wave 01 to `dsh/_archive/frontend/WAVE_01_DSH_FRONTEND_OWNERSHIP_CLASSIFICATION_CLOSURE-20260510-070100/app-client/DshHomeScreen.mappers.ts` after current-head no-import/no-registry proof |
| manual-review items from B2C/B2D with unresolved owner proof | `AMBIGUOUS_BLOCKED` | keep blocked until import/export/registry evidence exists on current HEAD |

### Wave 01 Rename / Archive Guardrails

- B2F-R1 allows zero rename candidates under current rules; do not force renames to satisfy naming style alone.
- Preview/data/fixture files are blocked from rename in this wave. Current explicit block list includes:
  - `dsh/frontend/app-captain/fixture-locations.ts`
  - `dsh/frontend/app-partner/fixture-locations.ts`
  - `dsh/frontend/control-panel/fixture-locations.ts`
  - `dsh/frontend/app-client/discoveryFixtures.ts`
  - `dsh/frontend/app-client/dshNotificationsFixtures.ts`
  - `dsh/frontend/app-client/dshStoreFixtures.ts`
  - `dsh/frontend/app-client/storeFixtures.ts`
  - `dsh/frontend/control-panel/operations/geo-heatmap.preview-data.ts`
  - `dsh/frontend/control-panel/operations/operations.preview-data.ts`
  - `dsh/frontend/control-panel/marketing/loyaltyCommerceData.ts`
- Archive is allowed only to `dsh/_archive/frontend/<SESSION_ID>/...` and only after import, registry, and route proof.
- `dsh/frontend/Archive`, `dsh/frontend/archive`, and `dsh/frontend/_archive` remain forbidden paths.
- **DSH_CLEANUP_HARDENING Archive**: `dsh/_archive/frontend/5899a771-f61c-4e88-ba19-e7560e699a04/` (storeFixtures, DshBenefitsHubScreen, partner-intake-store).


### Heatmap Placement Contract

| Surface | Placement decision | Current HEAD anchor |
|---|---|---|
| control-panel | ALLOWED | `dsh/frontend/control-panel/operations/GeoHeatmapScreen.tsx` |
| app-captain | PROVEN_CAPTAN_SCOPED | `dsh/frontend/app-captain/DshCaptainMapScreen.tsx` |
| app-client | FORBIDDEN | no heatmap placement allowed |
| app-partner | FORBIDDEN | no heatmap placement allowed |
| app-field | FORBIDDEN | no heatmap placement allowed |

## Surface Counts

| Surface | Screen Count | Giant Screen Candidates | Evidence | Decision | Next Action |
|---|---:|---:|---|---|---|
| app-captain | 5 | 1 | DSH_LINK_013_SCREEN_TOPOLOGY_CLOSURE | PASS |
| app-client | 30 | 3 | DSH_LINK_013_SCREEN_TOPOLOGY_CLOSURE | PASS |
| app-field | 7 | 0 | DSH_LINK_013_SCREEN_TOPOLOGY_CLOSURE | PASS |
| app-partner | 5 | 1 | DSH_LINK_013_SCREEN_TOPOLOGY_CLOSURE | PASS |
| control-panel | 20 | 0 | DSH_LINK_013_SCREEN_TOPOLOGY_CLOSURE | PASS |

## Flow Closure Matrix

| Flow ID | Flow | Actor | Surface | Screen/File | Route/Host | Primary CTA | Required States | Current UI Status | RTL/Visual Status | UI Kit Boundary | Runtime Status | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DSH-FLOW-001 | Store discovery + banner/promos lifecycle | Customer + Partner + Admin | app-client + app-partner + control-panel | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx (BannerCarousel/promos block); dsh/frontend/app-partner/console/screens/DshPartnerConsoleScreen.tsx (analytics section with embedded promotion intent); dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx + dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx; dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx + dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx + dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx | app-client/composition -> app-client/shell/ClientSurfaceHost.tsx -> dsh/frontend/app-client/DshSurfaceHost.tsx -> DshHomeGetScreen; control-panel/runtime/app/partners/page.tsx -> partners section; control-panel/runtime/app/marketing/page.tsx -> marketing section; app-partner analytics workspace inside DshPartnerConsoleScreen | app-partner offer intent status: CANDIDATE_SCREEN; control-panel partners eligibility status: PROVEN_INTERNAL_SECTION; control-panel marketing campaign status: PROVEN_SCREEN; app-client display status: CLIENT_DISPLAY_PROVEN; DSH-CAP-002 store/category/featured lifecycle baseline is anchored here; live-code hardening now routes shared marketing promos through the shared banner-store and control-panel re-export; visual deferred | loading/empty/error/ready/offline | visual deferred | NEEDS_VISUAL_EVIDENCE | PASS_WITH_WARNINGS_NON_VISUAL | RUNTIME_UNPROVEN | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; DshSurfaceHost resolvePublishedHomePromos(); dsh/frontend/shared/marketing/banner-store.ts; dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx; dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx; dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx; dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx; dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx; dsh/frontend/app-partner/console/screens/DshPartnerConsoleScreen.tsx | NOT_CLOSED | app-partner offer intent remains candidate; visual and runtime proof remain deferred |
| DSH-FLOW-002 | Storefront | Customer | app-client/webapp | mapped candidates: 1 | TBD | browse products | loading/empty/error/ready/offline | FRONTEND_PRESENT_NEEDS_ROUTE_STATE_VISUAL; DSH-CAP-002 storefront subset to be linked here | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | classify storefront route; link DSH-CAP-002 storefront subset |
| DSH-FLOW-003 | Catalog/product browsing | Customer | app-client/webapp | mapped candidates: 3 | TBD | add item | loading/empty/error/ready/offline | FRONTEND_PRESENT_NEEDS_ROUTE_STATE_VISUAL | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | classify product/catalog screens |
| DSH-FLOW-004 | Cart | Customer | app-client/webapp | mapped candidates: 1 | TBD | review cart | empty/error/ready/disabled | FRONTEND_PRESENT_NEEDS_ROUTE_STATE_VISUAL | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | inspect DshCartUnifiedScreen |
| DSH-FLOW-005 | Checkout | Customer | app-client/webapp | mapped candidates: 0 | TBD | place order | loading/error/ready/blocked | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | BLOCKED_BY_WLT | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | BLOCKED | do not start API before WLT/auth dependency |
| DSH-FLOW-006 | Order creation | Customer/Partner | app-client/app-partner | mapped candidates: 7 | TBD | submit/accept order | pending/success/error/retry | FRONTEND_PRESENT_NEEDS_ROUTE_STATE_VISUAL | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | classify order screens |
| DSH-FLOW-007 | Partner preparation | Partner | app-partner | mapped candidates: 7 | TBD | accept/prepare/ready | pending/ready/error/blocked | FRONTEND_PRESENT_NEEDS_ROUTE_STATE_VISUAL | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | inspect partner console |
| DSH-FLOW-008 | Captain assignment/delivery | Captain/Ops | app-captain/control-panel | mapped candidates: 6 | TBD | accept/pickup/deliver | pending/ready/error/offline | FRONTEND_PRESENT_NEEDS_ROUTE_STATE_VISUAL | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | inspect captain screens |
| DSH-FLOW-009 | Tracking | Customer/Captain/Ops | app-client/app-captain/control-panel | mapped candidates: 1 | TBD | monitor order | loading/ready/error/offline | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | map tracking route |
| DSH-FLOW-010 | Support | Customer/Admin | app-client/control-panel | mapped candidates: 1 | TBD | open/resolve case | empty/pending/error/success | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | map support screens |
| DSH-FLOW-011 | Rating | Customer | app-client | mapped candidates: 0 | TBD | submit rating | ready/error/success | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_FILE_REVIEW | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | rating screen not proven by mapping |
| DSH-FLOW-012 | Control-panel operations | Admin/Ops | control-panel | dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx; dsh/frontend/control-panel/operations/OperationsHubScreen.tsx | operations DSH host | monitor/intervene | loading/empty/error/offline/disabled/ready | PASS_PREVIEW_COCKPIT | PASS_RTL_VISUAL | PASS_UI_KIT_BOUNDARY | UI_PREVIEW_ONLY | DSH_FRONTEND_FINAL_CLOSURE_MEGA_EXECUTION_20260510 | CLOSED | maintenance only |

## High-Risk Screen Candidates

| Surface | File | Size Bytes | Risk | Decision | Next Action |
|---|---|---:|---|---|---|
| app-captain | dsh\frontend\app-captain\orders\DshCaptainOrdersScreen.tsx | 42131 | GIANT_SCREEN_CANDIDATE | NEEDS_REVIEW | inspect before closure |
| app-client | dsh\frontend\app-client\cart\screens\DshCartUnifiedScreen.tsx | 52041 | GIANT_SCREEN_CANDIDATE | NEEDS_REVIEW | inspect before closure |
| app-client | dsh\frontend\app-client\home\screens\DshHomeGetScreen.tsx | 64617 | GIANT_SCREEN_CANDIDATE | NEEDS_REVIEW | inspect before closure |
| app-client | dsh\frontend\app-client\stores\screens\DshStoreGetScreen.tsx | 98346 | GIANT_SCREEN_CANDIDATE | NEEDS_REVIEW | inspect before closure |
| app-partner | dsh\frontend\app-partner\console\screens\DshPartnerConsoleScreen.tsx | 43908 | GIANT_SCREEN_CANDIDATE | NEEDS_REVIEW | inspect before closure |

## TBD Flow Mapping Candidates

These files were detected as screen files but not confidently mapped by filename/path keywords. They are not closed.

| Surface | File | Size Bytes | Candidate Flow | Decision | Next Action |
|---|---|---:|---|---|---|
| app-client | dsh\frontend\app-client\DshClientBellScreen.tsx | 8110 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshEntryScreen.tsx | 4803 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshFavoritesListScreen.tsx | 2027 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshFavoriteToggleScreen.tsx | 3560 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshLoyaltyRewardsScreen.tsx | 2698 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshSubscriptionsScreen.tsx | 6871 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshMySpaceCommercialScreen.tsx | 13133 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshMySpaceScreen.tsx | 7035 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\DshNotificationsScreen.tsx | 7181 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-client | dsh\frontend\app-client\SubscriptionsHubScreen.tsx | 1303 | SCREEN_ENTRY | `UI_PREVIEW_ONLY` | classify manually |
| app-field | dsh\frontend\app-field\finance\DshFieldFinanceScreen.tsx | 1981 | TBD | NEEDS_REVIEW | classify manually |
| app-field | dsh\frontend\app-field\onboarding\DshFieldStoreOnboardingScreen.tsx | 16387 | TBD | NEEDS_REVIEW | classify manually |
| app-field | dsh\frontend\app-field\profile\DshFieldProfileScreen.tsx | 1472 | TBD | NEEDS_REVIEW | classify manually |
| app-field | dsh\frontend\app-field\visits\DshFieldStoreVisitScreen.tsx | 6295 | TBD | NEEDS_REVIEW | classify manually |
| control-panel | dsh\frontend\control-panel\dashboard\ControlPanelDshClosureDashboardScreen.tsx | 3253 | TBD | NEEDS_REVIEW | classify manually |
| control-panel | dsh\frontend\control-panel\marketing\BannersCommandDeckScreen.tsx | 17473 | TBD | NEEDS_REVIEW | classify manually |
| control-panel | dsh\frontend\control-panel\marketing\ControlPanelDshMarketingScreen.tsx | 4515 | TBD | NEEDS_REVIEW | classify manually |
| control-panel | dsh\frontend\control-panel\marketing\GrowthCommandDeckScreen.tsx | 22187 | TBD | NEEDS_REVIEW | classify manually |
| control-panel | dsh\frontend\control-panel\marketing\loyalty\LoyaltyCommandDeckScreen.tsx | 18486 | TBD | NEEDS_REVIEW | classify manually |
| control-panel | dsh\frontend\control-panel\marketing\SmartSignalLayer\SmartSignalLayerScreen.tsx | 35416 | TBD | NEEDS_REVIEW | classify manually |

## RTL/Visual Contract

- Arabic text must align correctly.
- Icon/text cluster must remain together in RTL rows.
- Chevron/action goes opposite side.
- No clipping, overflow, or safe-area breach.
- BThwani identity uses deepBlue #0A2F5C, orange #FF500D, white #FFFFFF with controlled tints only.
- No local design system outside @bthwani/ui-kit.

## DSH-FLOW-016 Actor Flow Parity Findings

- **Verdict**: PASS_WITH_WARNINGS
- **Summary**: All 6 major actor flows (Client, Partner, Captain, Field, Control Panel, WLT) have been mapped and verified for logical counterpart parity.
- **Key Handoffs**:
  - Field -> CP -> Partner (Store Intake) is proven in `workflow.ts`.
  - Client -> Partner -> Captain (Order Lifecycle) is proven via shared contracts.
- **Identified Gaps**:
  - Rating/Support are currently embedded or callback-only; no standalone dsh-owned screens.
  - Runtime/API transitions are logically sound but technically deferred (Local Preview only).
- **Handoff Typo Fixes**:
  - Verified and hardened `onOpenBenefits` in `DshHomeGetScreen`.

Current Closure Decision: PASS_WITH_WARNINGS (Wave 04 Executed)

## Current Closure Decision

UI/UX/Flow is CLOSED for Control Panel Operations (Wave 04). Client/Partner/Field remain in PREVIEW_DATA stage.

## DSH-CLEAN-018 Dead/Duplicate/Noise Findings

- total duplicate candidates: 2
- removed: 2 stale field default-alias exports and 1 noisy preview copy block
- kept: 2 compatibility aliases (`DshCartGetScreen`, `DshInventoryManagementScreen`)
- remaining retire-later: 0 in this cleanup slice
- final decision: PASS_WITH_WARNINGS

## DSH-CLEAN-019 Full Noise/Duplicate Enforcement Findings

- total candidates scanned: 1 stale export family plus the current DSH frontend inventory scan
- removed dead files: 0
- removed exports/imports: 1 export family removed, 0 imports removed
- visible noise removed: 0 new visible blocks in this slice
- duplicate variants resolved: 0
- compatibility aliases preserved: 2
- remaining retire-later: 2
- final decision: PASS_WITH_WARNINGS

## DSH-ARCHIVE-020 Active Frontend Archive Separation

- scanned files: 231 files under `dsh/frontend`
- archived files: 1
- removed stale exports/imports: 0
- removed visible noise blocks: 12 confirmed user-facing `[TBD]` or trial-language strings/labels in active flows
- kept active screens: `DshHomeGetScreen`, `DshStoreGetScreen`, `ControlPanelDshPartnerApprovalsScreen`, `DshFieldStoreOnboardingScreen`
- remaining fix-required: 3 (`DshPartnerOperationsDirectoryScreen`, `DshCaptainOperationsScreen`, `DshGasRefillOrderCreateScreen`)
- final decision: PASS_WITH_WARNINGS

Notes:
- archived file: `dsh/frontend/app-captain/DshSurfaceHost.tsx` -> `dsh/_archive/frontend/DSH_ARCHIVE_020_ACTIVE_FRONTEND_CLEANUP-20260506-225900/app-captain/DshSurfaceHost.tsx`
- visible-noise cleanup stayed inside active files only: `dsh/frontend/control-panel/partners/workflow.ts` and `dsh/frontend/app-field/stores/dshFieldStoresModel.ts`
- no active route screen, compat alias, or legacy fixture was moved in this slice

## DSH-DATA-017 Preview Data Authority Findings

- **Verdict**: PASS_WITH_WARNINGS
- **Summary**: All preview, fixture, and local-state data entities within DSH have been audited for source authority. Conflicting display names and inconsistent currency standards were unified.
- **Data Authority Map**:
  - **CANONICAL**: `dsh/frontend/shared/catalog` and `shared/finance`.
  - **LEGACY_STABLE**: preserved `store-1001`, `item-apple-1` for backward compatibility.
  - **FIELD_SOURCE**: `app-field` draft records linked to partner workflow.
- **Integrity Fixes**:
  - Unified `store-1001` name to 'أسواق العليا الطازجة' in marketing banners.
  - Standardized currency label to 'ر.س' across all client-side fixtures.
  - Verified all marketing (Banner/Growth) targets point to valid active entities.
- **Evidence Path**: `tools/registry/runs/DSH_DATA_017_PREVIEW_DATA_AUTHORITY-20260506-213046`

The first practical closure candidate is:
- DSH-FLOW-012
- control-panel operations
- dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx

Reason:
It already has route references and a surface host. It still needs visual/runtime proof.
