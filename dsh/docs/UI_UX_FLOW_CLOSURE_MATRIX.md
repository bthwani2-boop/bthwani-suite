# DSH UI/UX/Flow Closure Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: NOT_CLOSED

Evidence source:
- CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528
- tools\registry\runs\CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528

Summary:
- screen_file_count: 56
- giant_screen_candidates: 5
- tbd_flow_mappings: 19

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

## Surface Counts

| Surface | Screen Count | Giant Screen Candidates | Evidence | Decision | Next Action |
|---|---:|---:|---|---|---|
| app-captain | 5 | 1 | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | PASS_WITH_WARNINGS | classify routes/states visually |
| app-client | 19 | 3 | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | PASS_WITH_WARNINGS | classify routes/states visually |
| app-field | 7 | 0 | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | PASS_WITH_WARNINGS | classify routes/states visually |
| app-partner | 5 | 1 | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | PASS_WITH_WARNINGS | classify routes/states visually |
| control-panel | 20 | 0 | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | PASS_WITH_WARNINGS | classify routes/states visually |

## Flow Closure Matrix

| Flow ID | Flow | Actor | Surface | Screen/File | Route/Host | Primary CTA | Required States | Current UI Status | RTL/Visual Status | UI Kit Boundary | Runtime Status | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DSH-FLOW-001 | Store discovery + banner/promos lifecycle | Customer + Partner + Admin | app-client + app-partner + control-panel | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx (BannerCarousel/promos block); dsh/frontend/app-partner/console/screens/DshPartnerConsoleScreen.tsx (analytics section with embedded promotion intent); dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx + dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx; dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx + dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx + dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx | app-client/composition -> app-client/shell/ClientSurfaceHost.tsx -> dsh/frontend/app-client/DshSurfaceHost.tsx -> DshHomeGetScreen; control-panel/runtime/app/partners/page.tsx -> partners section; control-panel/runtime/app/marketing/page.tsx -> marketing section; app-partner analytics workspace inside DshPartnerConsoleScreen | app-partner offer intent status: CANDIDATE_SCREEN; control-panel partners eligibility status: PROVEN_INTERNAL_SECTION; control-panel marketing campaign status: PROVEN_SCREEN; app-client display status: CLIENT_DISPLAY_PROVEN; DSH-CAP-002 store/category/featured lifecycle baseline is anchored here; visual deferred | loading/empty/error/ready/offline | visual deferred | NEEDS_VISUAL_EVIDENCE | PASS_WITH_WARNINGS_NON_VISUAL | RUNTIME_UNPROVEN | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; DshSurfaceHost resolvePublishedHomePromos(); dsh/frontend/shared/marketing/banner-store.ts; dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx; dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx; dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx; dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx; dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx; dsh/frontend/app-partner/console/screens/DshPartnerConsoleScreen.tsx | NOT_CLOSED | app-partner offer intent remains candidate; visual and runtime proof remain deferred |
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
| DSH-FLOW-012 | Control-panel operations | Admin/Ops | control-panel | dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx; mapped candidates: 14 | operations DSH host | monitor/intervene | loading/empty/error/offline/disabled/ready | ROUTE_REFERENCES_PRESENT_NEEDS_VISUAL_RUNTIME_EVIDENCE | NEEDS_VISUAL_EVIDENCE | PASS_WITH_WARNINGS | RUNTIME_UNPROVEN | CHECK_DSH_UI_UX_FLOW_SCREEN_MAPPING_V2-20260505-175528 | NOT_CLOSED | first visual/runtime closure candidate |

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
| app-client | dsh\frontend\app-client\bell\screens\DshClientBellScreen.tsx | 8110 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\entry\screens\DshEntryScreen.tsx | 4803 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\favorites\screens\DshFavoritesListScreen.tsx | 2027 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\favorites\screens\DshFavoriteToggleScreen.tsx | 3560 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\loyalty\screens\DshBenefitsHubScreen.tsx | 170 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\my_space\screens\DshMySpaceCommercialScreen.tsx | 13133 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\my_space\screens\DshMySpaceScreen.tsx | 7035 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\notifications\screens\DshNotificationsScreen.tsx | 7181 | TBD | NEEDS_REVIEW | classify manually |
| app-client | dsh\frontend\app-client\subscriptions\screens\SubscriptionsHubScreen.tsx | 1303 | TBD | NEEDS_REVIEW | classify manually |
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

## Current Closure Decision

UI/UX/Flow remains NOT_CLOSED.

The first practical closure candidate is:
- DSH-FLOW-012
- control-panel operations
- dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx

Reason:
It already has route references and a surface host. It still needs visual/runtime proof.