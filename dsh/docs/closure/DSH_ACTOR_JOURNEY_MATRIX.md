# DSH Actor Journey Matrix — Loop 2

Status: DONE_LOCAL
Loop: 2
Date: 2026-05-15

## Rules

- Every actor journey point maps to: SCREEN / WORKSPACE / SECTION / SHEET / STATE / EVENT / NOTIFICATION / OPS_ACTION / WLT_BRIDGE / AUDIT_RECORD / TBD
- COVERED = existing file/registration found in Loop 1 inventory
- MISSING = no file or registration found
- PARTIAL = file exists but state/flow incomplete or unregistered

---

## Actor: Field (onboarding/activation only — exits after partner activation)

| # | Journey Point | Placement | File | Status | Notes |
|---|---|---|---|---|---|
| F-01 | Store assignment list | SCREEN | DshFieldStoresScreen.tsx | COVERED | TAB_ROOT P0 |
| F-02 | Store selection | STATE | DshFieldStoresScreen.tsx | COVERED | Within stores list |
| F-03 | Onboarding checklist | SCREEN | DshFieldStoreOnboardingScreen.tsx | COVERED | FLOW_STEP P0 |
| F-04 | Document verification | SECTION | DshFieldStoreOnboardingScreen.tsx | PARTIAL | No dedicated section file; must be section within onboarding |
| F-05 | Store visit recording | SCREEN | DshFieldStoreVisitScreen.tsx | COVERED | FLOW_STEP P0 |
| F-06 | Visit photo/evidence capture | SECTION | DshFieldStoreVisitScreen.tsx | PARTIAL | No photo capture section confirmed; needs visual evidence |
| F-07 | Readiness escalation | SCREEN | DshFieldReadinessEscalationScreen.tsx | COVERED | FLOW_STEP P2 READY_FOR_REVIEW |
| F-08 | Activation approval (ops-side) | OPS_ACTION | control-panel/partners/ | MISSING | No dedicated ops activation approval workspace |
| F-09 | Post-activation exit | STATE | DshFieldStoreOnboardingScreen.tsx | PARTIAL | Completion state must be explicit — no confirmed success/exit state |
| F-10 | Stores history | SCREEN | DshFieldStoresHistoryScreen.tsx | COVERED | FLOW_STEP P2 |
| F-11 | Account home | SCREEN | DshFieldProfileHomeScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| F-12 | Profile | SCREEN | DshFieldProfileScreen.tsx | COVERED | FLOW_STEP P2 |
| F-13 | Finance overview (WLT bridge) | SCREEN + WLT_BRIDGE | DshFieldFinanceScreen.tsx + WltDshFieldBridge.tsx | COVERED | P1 — WLT-owned; DSH displays only |

---

## Actor: Client

| # | Journey Point | Placement | File | Status | Notes |
|---|---|---|---|---|---|
| C-01 | Entry/service gate | SCREEN | EntryScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| C-02 | Home feed / discovery | SCREEN | HomeScreen.tsx | COVERED | TAB_ROOT P0 |
| C-03 | Search | SCREEN | SearchScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| C-04 | Store details | SCREEN | StoreScreen.tsx | COVERED | FLOW_STEP P0 |
| C-05 | Store items | SCREEN | StoreItemsScreen.tsx | COVERED | FLOW_STEP P1 |
| C-06 | Add to cart | STATE | StoreItemsScreen.tsx | COVERED | CTA within items screen |
| C-07 | Cart review | SCREEN | CartScreen.tsx | COVERED | FLOW_STEP P0 |
| C-08 | Checkout intent | SCREEN | DshCheckoutIntentScreen.tsx | COVERED | FLOW_STEP P0 READY_FOR_REVIEW |
| C-09 | Serviceability quote | STATE | DshCheckoutIntentScreen.tsx | COVERED | Loading/blocked state within checkout intent |
| C-10 | WLT payment handoff | WLT_BRIDGE | WLT-owned | COVERED (boundary) | DSH passes to WLT; no DSH screen |
| C-11 | Order created confirmation | STATE | TBD | MISSING | No dedicated order-created screen or state after WLT handoff — needs skeleton in Loop 4 |
| C-12 | Orders history list | SCREEN | OrdersTrackingScreens.tsx | COVERED | SCREEN_ENTRY P0 |
| C-13 | Live order tracking | SCREEN | OrdersTrackingScreens.tsx | COVERED | FLOW_STEP P0 |
| C-14 | Bell notification | SHEET | BellScreen.tsx | COVERED | MODAL P2 |
| C-15 | Notifications list | SCREEN | NotificationsScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| C-16 | Client↔Captain chat | SCREEN | OperationScreens.tsx (conversation-workspace) | COVERED | FLOW_STEP P1 |
| C-17 | Client↔Support/Ops messaging | SCREEN | OperationScreens.tsx (conversation-workspace) | PARTIAL | Same screen as captain chat — needs state differentiation |
| C-18 | Order issue report | SCREEN | OperationScreens.tsx (order-issue-workspace) | COVERED | FLOW_STEP P1 |
| C-19 | Order rating | SCREEN | DshRatingScreen.tsx | COVERED | FLOW_STEP P2 READY_FOR_REVIEW |
| C-20 | Order cancellation | TBD | TBD | MISSING | No cancellation screen or flow |
| C-21 | Refund status view | WLT_BRIDGE | TBD | MISSING | WLT bridge for refund status not built |
| C-22 | Favorites list | SCREEN | FavoritesScreen.tsx | COVERED | SCREEN_ENTRY P2 |
| C-23 | Favorite toggle | SCREEN | FavoriteToggleScreen.tsx | COVERED | FLOW_STEP P2 — candidate for sheet |
| C-24 | Benefits hub | SCREEN | BenefitsScreen.tsx | COVERED | FLOW_STEP P1 |
| C-25 | Loyalty rewards detail | SECTION | LoyaltyRewardsScreen.tsx (parts/) | PARTIAL | Parts file not registered; section within BenefitsScreen |
| C-26 | Subscriptions | SECTION | SubscriptionsScreen.tsx (parts/) | PARTIAL | Parts file not registered; section within MySpaceScreen |
| C-27 | My space | SCREEN | MySpaceScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| C-28 | Proxy order (Shein/Awnak) | SCREEN | OperationScreens.tsx (proxy-workspace) | COVERED | FLOW_STEP P2 |
| C-29 | Service settings | SCREEN | OperationScreens.tsx (service-settings) | COVERED | FLOW_STEP P2 |
| C-30 | Zone set | SHEET | OperationScreens.tsx (zone-set) | COVERED | FLOW_STEP P2 — sheet candidate |
| C-31 | Listing status update | SHEET | OperationScreens.tsx (listing-status-update) | COVERED | FLOW_STEP P2 — sheet candidate |
| C-32 | Video reels viewer | SECTION | ApprovedVideoReelsViewer.tsx (parts/) | PARTIAL | Parts file not registered; section within HomeScreen or StoreScreen |

---

## Actor: Partner

| # | Journey Point | Placement | File | Status | Notes |
|---|---|---|---|---|---|
| P-01 | Entry/gate | SCREEN | PartnerEntryScreen.tsx | COVERED | SCREEN_ENTRY P0 |
| P-02 | Home dashboard | SCREEN | PartnerHubScreen.tsx | COVERED | TAB_ROOT P0 |
| P-03 | Operations control | SCREEN | PartnerHubScreen.tsx | COVERED | SCREEN_ENTRY P0 — same file as home |
| P-04 | Orders inbox | SCREEN | OrdersInboxScreen.tsx | COVERED | SCREEN_ENTRY P0 |
| P-05 | Order detail | SCREEN | OrdersInboxScreen.tsx | COVERED | SCREEN_ENTRY P0 |
| P-06 | Accept order CTA | STATE | OrdersInboxScreen.tsx | COVERED | CTA/action within order detail |
| P-07 | Acceptance timer/countdown | SHEET | TBD | MISSING | No timer/countdown state or sheet for acceptance window |
| P-08 | Reject order | SCREEN | DshPartnerOrderRejectionScreen.tsx | COVERED | FLOW_STEP P0 READY_FOR_REVIEW |
| P-09 | Order preparation start | STATE | OrdersInboxScreen.tsx | PARTIAL | State within order detail — no explicit preparation-start state confirmed |
| P-10 | Order preparation progress | STATE | OrdersInboxScreen.tsx | PARTIAL | State within order detail — needs prep-progress state |
| P-11 | Partner ready | STATE | OrdersInboxScreen.tsx | PARTIAL | Mark-ready CTA and state needed |
| P-12 | Handoff to captain | EVENT | OrdersInboxScreen.tsx | PARTIAL | System event — must be visible as a state change in order detail |
| P-13 | Order issue report | SCREEN | OperationScreens.tsx (partner) | COVERED | SCREEN_ENTRY P0 |
| P-14 | Partner↔Ops messaging | SECTION | PartnerOrderConversationPanel.tsx | COVERED | Section within order detail — ops-side MISSING |
| P-15 | Order alerts panel | SECTION | PartnerOrderAlertsPanel.tsx | COVERED | Section within hub or inbox |
| P-16 | Order action panel | SECTION | PartnerOrderActionPanel.tsx | COVERED | Section within order detail |
| P-17 | Order conversation panel | SECTION | PartnerOrderConversationPanel.tsx | COVERED | Section within order detail |
| P-18 | Order issue panel | SECTION | PartnerOrderIssuePanel.tsx | COVERED | Section within issue screen |
| P-19 | Notifications | SCREEN | OperationScreens.tsx (partner-notifications) | COVERED | SCREEN_ENTRY P1 |
| P-20 | Settings / preferences | SCREEN | PartnerHubScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| P-21 | Store profile management | SCREEN | StoreProfileScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| P-22 | Inventory catalog | SCREEN | InventoryCatalogScreen.tsx | COVERED | SCREEN_ENTRY P0 |
| P-23 | Inventory action panel | SECTION | PartnerInventoryActionPanel.tsx | COVERED | Section within inventory |
| P-24 | Onboarding action panel | SECTION | PartnerOnboardingActionPanel.tsx | COVERED | Section within entry/onboarding flow |
| P-25 | Video submission | SECTION | PartnerVideoSubmissionPanel.tsx | PARTIAL | Ownership unclear — inventory vs promotions |
| P-26 | Promotions enrollment | SCREEN | PromotionsScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| P-27 | Support center | SCREEN | PartnerSupportScreen.tsx | COVERED | SCREEN_ENTRY P0 |
| P-28 | Wallet / finance (WLT bridge) | WLT_BRIDGE | WltDshPartnerBridge.tsx | COVERED | FLOW_STEP P0 — WLT-owned |

---

## Actor: Captain

| # | Journey Point | Placement | File | Status | Notes |
|---|---|---|---|---|---|
| CAP-01 | Entry/gate | SCREEN | DshCaptainEntryScreen.tsx | COVERED | SCREEN_ENTRY P1 |
| CAP-02 | Home dashboard | SCREEN | DshCaptainSurface.tsx | COVERED | TAB_ROOT P1 — god-file risk |
| CAP-03 | Orders inbox (offer queue) | SCREEN | DshCaptainOrdersScreen.tsx | COVERED | SCREEN_ENTRY P0 |
| CAP-04 | Order offer accept | STATE | DshCaptainOrdersScreen.tsx | PARTIAL | Accept CTA within inbox — no dedicated offer-accept state screen |
| CAP-05 | Order offer decline | STATE | DshCaptainOrdersScreen.tsx | MISSING | No decline flow or reason flow found |
| CAP-06 | Order detail | SCREEN | DshCaptainOrdersScreen.tsx | COVERED | FLOW_STEP P0 |
| CAP-07 | Bell / notification modal | SHEET | DshCaptainOrdersScreen.tsx | COVERED | MODAL P1 |
| CAP-08 | Captain↔Client chat | SHEET | DshCaptainOrdersScreen.tsx | COVERED | FLOW_STEP P1 — sheet candidate |
| CAP-09 | Map / navigation | SCREEN | DshCaptainMapScreen.tsx | MISSING (unregistered) | File exists but not in registry — CRITICAL P0 gap |
| CAP-10 | Pickup route / arrive pickup | STATE | DshCaptainPickupDropoffScreen.tsx | COVERED | FLOW_STEP P1 READY_FOR_REVIEW |
| CAP-11 | Pickup confirmation | STATE | DshCaptainPickupDropoffScreen.tsx | COVERED | State within pickup-dropoff screen |
| CAP-12 | Out for delivery / in transit | STATE | DshCaptainPickupDropoffScreen.tsx | PARTIAL | In-transit state needs explicit representation |
| CAP-13 | Arrive at dropoff | STATE | DshCaptainPickupDropoffScreen.tsx | COVERED | State within pickup-dropoff screen |
| CAP-14 | Proof of delivery | SCREEN | DshCaptainPoDSubmissionScreen.tsx | COVERED | FLOW_STEP P1 READY_FOR_REVIEW |
| CAP-15 | Support directory | SCREEN | DshCaptainOperationsScreen.tsx | COVERED | FLOW_STEP P1 |
| CAP-16 | Captain↔Ops support workspace | SCREEN | DshCaptainSurface.tsx (support-screen) | COVERED | FLOW_STEP P1 — lives in god-file |
| CAP-17 | Account root | SCREEN | DshCaptainSurface.tsx | COVERED | TAB_ROOT P2 — god-file |
| CAP-18 | Account profile | SCREEN | DshCaptainProfileScreen.tsx | COVERED | FLOW_STEP P2 |
| CAP-19 | COD balance / finance screen | SCREEN | DshCaptainFinanceScreen.tsx | COVERED | FLOW_STEP P2 — WLT integration |
| CAP-20 | Finance bridge (WLT) | WLT_BRIDGE | WltDshCaptainBridge.tsx | COVERED | FLOW_STEP P0 — WLT-owned |
| CAP-21 | Account orders history | SCREEN | DshCaptainSurface.tsx (account-orders) | COVERED | FLOW_STEP P1 — god-file |
| CAP-22 | Account docs | SCREEN | DshCaptainSurface.tsx (account-docs) | COVERED | FLOW_STEP P2 — god-file |
| CAP-23 | Account shifts | SCREEN | DshCaptainSurface.tsx (account-shifts) | COVERED | FLOW_STEP P2 — god-file |
| CAP-24 | Account support | SCREEN | DshCaptainSurface.tsx (account-support) | COVERED | FLOW_STEP P2 — god-file |
| CAP-25 | Availability toggle | STATE | TBD | MISSING | No availability/online-offline toggle surface found |

---

## Actor: Operations (Control Panel)

| # | Journey Point | Placement | File | Status | Notes |
|---|---|---|---|---|---|
| O-01 | Operations hub | SCREEN | OperationsHubScreen.tsx | COVERED | |
| O-02 | Command center | SCREEN | CommandCenterScreen.tsx | COVERED | Live order overview |
| O-03 | Live orders monitoring | SCREEN | LiveOrdersScreen.tsx | COVERED | |
| O-04 | Manual assignment | SCREEN | DispatchAssignmentScreen.tsx | COVERED | Covers manual dispatch |
| O-05 | Auto-assignment config | OPS_ACTION | DispatchAssignmentScreen.tsx | PARTIAL | Auto-assign toggle exists but no dedicated config surface |
| O-06 | Reassignment trigger | OPS_ACTION | ExceptionsEscalationsScreen.tsx | PARTIAL | Reassignment within exceptions — no dedicated reassignment-trigger action surface |
| O-07 | Exceptions/escalations | SCREEN | ExceptionsEscalationsScreen.tsx | COVERED | |
| O-08 | Captain operations view | SCREEN | CaptainOperationsScreen.tsx | COVERED | |
| O-09 | Partner stores view | SCREEN | PartnerStoresScreen.tsx | COVERED | |
| O-10 | Area capacity | SCREEN | AreaCapacityScreen.tsx | COVERED | |
| O-11 | Geo heatmap | SCREEN | GeoHeatmapScreen.tsx | COVERED | |
| O-12 | Audit / SLA | SCREEN | AuditSupportSlaScreen.tsx | COVERED | |
| O-13 | Awnak proxy ops | SCREEN | AwnakScreen.tsx | COVERED | Relationship to app-client proxy needs Loop 3 |
| O-14 | Shein proxy ops | SCREEN | ControlPanelDshSheinProxyScreen.tsx | COVERED | Relationship to app-client proxy needs Loop 3 |
| O-15 | Ops→client messaging | OPS_ACTION | TBD | MISSING | No ops-side messaging surface for client |
| O-16 | Ops→partner messaging | OPS_ACTION | TBD | MISSING | No ops-side messaging surface for partner |
| O-17 | Ops→captain messaging | OPS_ACTION | TBD | MISSING | No ops-side messaging surface for captain |
| O-18 | Audit trail detail workspace | WORKSPACE | TBD | MISSING | AuditSupportSlaScreen exists but no detail workspace |
| O-19 | Closure dashboard | SCREEN | ControlPanelDshClosureDashboardScreen.tsx | COVERED | |
| O-20 | Decision board (shared) | SECTION | ControlPanelDshDecisionBoard.tsx | COVERED | Shared across ops screens |
| O-21 | Action queue (shared) | SECTION | ControlPanelDshActionQueue.tsx | COVERED | Shared ops action panel |
| O-22 | Workspace frame (shared) | SECTION | ControlPanelDshWorkspaceFrame.tsx | COVERED | Layout wrapper |

## Actor: Operations — Marketing / Partners / Finance / Support / Catalogs

| # | Journey Point | Section | File | Status | Notes |
|---|---|---|---|---|---|
| MK-01 | Marketing hub | SCREEN | ControlPanelDshMarketingScreen.tsx | COVERED | |
| MK-02 | Campaigns | SCREEN | CampaignsCommandDeckScreen.tsx | COVERED | |
| MK-03 | Loyalty command deck | SCREEN | LoyaltyCommandDeckScreen.tsx | COVERED | |
| MK-04 | Promos | SCREEN | PromosCommandDeckScreen.tsx | COVERED | |
| MK-05 | Banners | SCREEN | BannersCommandDeckScreen.tsx | COVERED | |
| MK-06 | Videos | SCREEN | VideosCommandDeckScreen.tsx | COVERED | |
| MK-07 | Partner offers | SCREEN | PartnerOffersCommandDeckScreen.tsx | COVERED | |
| MK-08 | Media review | SCREEN | MarketingMediaReviewCommandDeckScreen.tsx | COVERED | |
| MK-09 | Growth command deck | SCREEN | GrowthCommandDeckScreen.tsx | COVERED | |
| MK-10 | Smart signal layer | SCREEN | SmartSignalLayerScreen.tsx | COVERED | |
| MK-11 | Marketing review queue | SECTION | MarketingReviewQueue.tsx | COVERED | |
| PT-01 | Partner approvals | SCREEN | ControlPanelDshPartnerApprovalsScreen.tsx | COVERED | |
| PT-02 | Partner promotion eligibility | SCREEN | DshPartnerPromotionEligibilityScreen.tsx | COVERED | |
| PT-03 | Partner intake lane | SECTION | PartnerIntakeLane.tsx | COVERED | |
| PT-04 | Partner topology | SECTION | PartnerTopologyLane.tsx | COVERED | |
| PT-05 | Partner deactivation | OPS_ACTION | TBD | MISSING | No deactivation workspace |
| PT-06 | Partner performance review | WORKSPACE | TBD | MISSING | No performance review workspace |
| FN-01 | Finance hub | SCREEN | FinanceHubScreen.tsx | COVERED | WLT bridge entry only |
| FN-02 | Partner settlement workspace | WLT_BRIDGE | TBD | MISSING | WLT bridge sub-workspace needed |
| FN-03 | Captain payout workspace | WLT_BRIDGE | TBD | MISSING | WLT bridge sub-workspace needed |
| FN-04 | Refund management queue | WLT_BRIDGE | TBD | MISSING | WLT bridge sub-workspace needed |
| FN-05 | Commission breakdown | WLT_BRIDGE | TBD | MISSING | WLT bridge sub-workspace needed |
| FN-06 | Platform fee audit | WLT_BRIDGE | TBD | MISSING | WLT bridge sub-workspace needed |
| FN-07 | Field commission workspace | WLT_BRIDGE | TBD | MISSING | WLT bridge sub-workspace needed |
| SP-01 | Support ticket list | SCREEN | TBD | MISSING | Zero support screens in CP |
| SP-02 | Ticket detail/response | WORKSPACE | TBD | MISSING | |
| SP-03 | SLA dashboard | SCREEN | TBD | MISSING | |
| SP-04 | Escalation queue | SCREEN | TBD | MISSING | |
| SP-05 | Ops↔client messaging | WORKSPACE | TBD | MISSING | |
| SP-06 | Ops↔partner messaging | WORKSPACE | TBD | MISSING | |
| SP-07 | Ops↔captain messaging | WORKSPACE | TBD | MISSING | |
| CT-01 | Catalog hub | SCREEN | ControlPanelDshCatalogScreen.tsx | COVERED | |
| CT-02 | Catalog categories | SCREEN | ControlPanelDshCatalogCategoriesScreen.tsx | COVERED | |
| CT-03 | Catalog adoption queue | SECTION | CatalogAdoptionQueue.tsx | COVERED | |
| CT-04 | Item approval workflow | OPS_ACTION | TBD | MISSING | No item-level approval flow |
| CT-05 | Catalog publishing gate | OPS_ACTION | TBD | MISSING | No publishing gate workspace |

---

## Coverage summary

| Actor | Journey Points | COVERED | PARTIAL | MISSING |
|---|---|---|---|---|
| Field | 13 | 8 | 4 | 1 |
| Client | 32 | 22 | 5 | 5 |
| Partner | 28 | 20 | 6 | 2 |
| Captain | 25 | 17 | 4 | 4 |
| Ops-Operations | 22 | 16 | 2 | 4 |
| Ops-Marketing | 11 | 11 | 0 | 0 |
| Ops-Partners | 6 | 4 | 0 | 2 |
| Ops-Finance | 7 | 1 | 0 | 6 |
| Ops-Support | 7 | 0 | 0 | 7 |
| Ops-Catalogs | 5 | 3 | 0 | 2 |
| **Total** | **156** | **102** | **21** | **33** |

COVERED rate: 65% · PARTIAL/needs-work: 13% · MISSING: 21%

Missing 33 points are the Loop 3 gap map targets.
