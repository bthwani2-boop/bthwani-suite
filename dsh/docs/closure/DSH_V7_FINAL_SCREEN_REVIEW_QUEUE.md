# DSH V7 Final Screen Review Queue

Date: 2026-05-16
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## List 1: READY_TO_VISUALLY_REVIEW_NOW (fully wired, no blocking gap)

These screens are WIRED_IN_FLOW with no API gaps blocking the surface render path. Review them first.

| # | Screen ID | Surface | File | Notes |
|---|---|---|---|---|
| 1 | client.dsh.home.feed | app-client | HomeScreen.tsx | No blocking gaps |
| 2 | client.dsh.cart.review | app-client | CartScreen.tsx | WLT fee display label present |
| 3 | client.dsh.order.tracking.live | app-client | OrdersTrackingScreens.tsx | Tracking wired; refund state BLOCKED_BY_WLT but screen loads |
| 4 | client.dsh.orders.history | app-client | OrdersTrackingScreens.tsx | Orders list wired |
| 5 | client.dsh.store.details | app-client | StoreScreen.tsx | Visual baseline from prior session |
| 6 | client.dsh.order.issue.workspace | app-client | OperationScreens.tsx | ML-011 OWNER_DECISION_REQUIRED but screen loads |
| 7 | partner.dsh.orders.inbox | app-partner | OrdersInboxScreen.tsx | Prep states WIRED; timer sheet BLOCKED_BY_CONTRACT but screen loads |
| 8 | partner.dsh.order.detail | app-partner | OrdersInboxScreen.tsx | ML-018/019/020 prep states WIRED |
| 9 | partner.dsh.inventory.catalog | app-partner | InventoryCatalogScreen.tsx | CG-020 unproven but screen structure visible |
| 10 | partner.dsh.order.rejection | app-partner | DshPartnerOrderRejectionScreen.tsx | CG-022 unproven but screen loads |
| 11 | partner.dsh.entry.status | app-partner | PartnerEntryScreen.tsx | ML-017 availability toggle WIRED |
| 12 | partner.dsh.home.dashboard | app-partner | PartnerHubScreen.tsx | God-file; split OWNER_DECISION_REQUIRED; screen loads |
| 13 | captain.dsh.orders.inbox | app-captain | DshCaptainOrdersScreen.tsx | ML-027 offer-accept WIRED; decline sheet BLOCKED_BY_CONTRACT but screen loads |
| 14 | captain.dsh.orders.detail | app-captain | DshCaptainOrdersScreen.tsx | CG-016 unproven but detail view loads |
| 15 | field.dsh.stores.list | app-field | DshFieldStoresScreen.tsx | CG-024 unproven but list renders |
| 16 | field.dsh.store.onboarding | app-field | DshFieldStoreOnboardingScreen.tsx | ML-002 documents section NOW WIRED; ML-005 exit state WIRED |
| 17 | field.dsh.store.visit | app-field | DshFieldStoreVisitScreen.tsx | ML-003 VisitEvidenceSection NOW WIRED; capture buttons disabled |
| 18 | ops.dsh.operations.hub | control-panel | OperationsHubScreen.tsx | 11 SCREEN_RENDERERS; full hub accessible |
| 19 | ops.dsh.dispatch | control-panel | DispatchAssignmentScreen.tsx | ML-036 OWNER_DECISION_REQUIRED but screen loads |
| 20 | ops.dsh.exceptions | control-panel | ExceptionsEscalationsScreen.tsx | ML-037 OWNER_DECISION_REQUIRED but screen loads |
| 21 | ops.dsh.live.orders | control-panel | LiveOrdersScreen.tsx | No significant gaps |
| 22 | ops.dsh.audit.sla | control-panel | AuditSupportSlaScreen.tsx | ML-035 AuditTrailDetailWorkspace NOW WIRED as toggle panel |

---

## List 2: READY_TO_REVIEW_AS_DISABLED_PREVIEW (wired but primary action is disabled)

These screens are reachable and render correctly. The primary action is blocked by a missing API contract, but the UI layout, skeleton states, and RTL rendering are all reviewable.

| # | Screen ID | Surface | File | What is disabled | Notes |
|---|---|---|---|---|---|
| 1 | client.dsh.checkout.intent | app-client | DshCheckoutIntentScreen.tsx | Payment submission | Screen reachable from CartScreen; WLT callback not proven; ML-009 error state WIRED; ML-010 retry WIRED |
| 2 | captain.dsh.orders.pickup-dropoff | app-captain | DshCaptainPickupDropoffScreen.tsx | Nothing (skeleton only) | NOW WIRED — navigable from detail route; mode=pickup preview; confirm → pod-submission |
| 3 | captain.dsh.orders.pod-submission | app-captain | DshCaptainPoDSubmissionScreen.tsx | Confirm button (no photoUri) | NOW WIRED — navigable from pickup-dropoff onConfirm; camera capture disabled (CG-018) |
| 4 | captain.dsh.orders.map | app-captain | DshCaptainMapScreen.tsx | Nothing (skeleton only) | NOW WIRED — navigable from expanded home order panel; task stage toggle works |
| 5 | field.dsh.store.onboarding / documents | app-field | DshFieldStoreOnboardingScreen.tsx (documents section) | Upload buttons | ML-002 NOW WIRED in 'documents' section; upload disabled (document API not proven) |
| 6 | field.dsh.store.visit / evidence | app-field | DshFieldStoreVisitScreen.tsx (VisitEvidenceSection) | Photo capture buttons | ML-003 NOW WIRED as evidence section; capture buttons are no-ops; confirm button disabled |
| 7 | ops.dsh.audit.sla / detail | control-panel | AuditSupportSlaScreen + AuditTrailDetailWorkspace | Real audit data | ML-035 NOW WIRED as toggle panel; skeleton data only; audit API not proven |
| 8 | ops.dsh.catalog.approvals.quality | control-panel | ControlPanelDshCatalogScreen (approvals/quality) | Approve/reject actions | ML-053 ItemApprovalSection NOW WIRED; demo data; API callbacks optional |
| 9 | ops.dsh.catalog.approvals.pricing | control-panel | ControlPanelDshCatalogScreen (approvals/pricing) | Publish approval | ML-054 CatalogPublishingGateSection NOW WIRED; approve disabled (in-review status) |
| 10 | captain.wlt.dsh.finance.bridge | app-captain | WltDshCaptainBridge.tsx | Full WLT integration | WLT-owned; do not implement |
| 11 | partner.wlt.dsh.wallet.bridge | app-partner | WltDshPartnerBridge.tsx | Full WLT integration | WLT-owned; do not implement |

---

## List 3: BLOCKED_NOT_RENDERED (not reachable through surface; no render branch)

These screens are registered or exported but cannot be navigated to and cannot be reviewed visually.

| # | Screen ID | Surface | File | Blocker |
|---|---|---|---|---|
| 1 | client.dsh.checkout.intent | app-client | DshCheckoutIntentScreen.tsx | DshClientSurface has no checkout-intent route (ML-006/009); WLT required |

---

## List 4: BLOCKED_BY_CONTRACT_OR_WLT (wired path exists but feature is non-functional)

These screens render and are accessible but contain features that are completely non-functional pending contract resolution. List them for completeness; they do NOT block review of the rest of the screen.

| # | Screen | Feature blocked | Gap | Contract |
|---|---|---|---|---|
| 1 | OrdersTrackingScreens.tsx | Refund status state | ML-008 | WLT CG-035 |
| 2 | DshCaptainSurface.tsx | Availability API toggle | ML-026 | CG-019 |
| 3 | DshCaptainOrdersScreen.tsx | Offer decline sheet | ML-024 | CG-015 |
| 4 | OrdersInboxScreen.tsx (partner) | Acceptance timer sheet | ML-016 | CG-021 |
| 5 | PartnerHubScreen.tsx | God-file split | N/A | Owner decision |
| 6 | DshCaptainSurface.tsx | God-file split | N/A | Owner decision |
| 7 | OperationScreens.tsx (client) | thread_type placement | ML-011 | Owner decision |

---

## Screens Not Yet in Any Review List (P2 — pre-Loop-8)

Catalog, marketing, secondary profile, field finance, and remaining control-panel views. All `NEEDS_VISUAL_EVIDENCE`. No P1 gates block these.

| Screen | File | Surface |
|---|---|---|
| client.dsh.entry | EntryScreen.tsx | app-client |
| client.dsh.my-space.home | MySpaceScreen.tsx | app-client |
| client.dsh.notifications.list | NotificationsScreen.tsx | app-client |
| client.dsh.store.items | StoreItemsScreen.tsx | app-client |
| client.dsh.benefits.hub | BenefitsScreen.tsx | app-client |
| client.dsh.favorites.list | FavoritesScreen.tsx | app-client |
| client.dsh.search | SearchScreen.tsx | app-client |
| client.dsh.rating | DshRatingScreen.tsx | app-client |
| partner.dsh.profile | PartnerProfileScreen.tsx | app-partner |
| partner.dsh.promotions | PromotionsScreen.tsx | app-partner |
| partner.dsh.conversation | PartnerOrderConversationPanel | app-partner |
| captain.dsh.entry | DshCaptainEntryScreen.tsx | app-captain |
| captain.dsh.orders.chat | DshCaptainOrdersScreen.tsx | app-captain |
| captain.dsh.support.directory | DshCaptainOperationsScreen.tsx | app-captain |
| captain.dsh.account.profile | DshCaptainProfileScreen.tsx | app-captain |
| captain.dsh.account.finance | DshCaptainFinanceScreen.tsx | app-captain |
| field.dsh.store.escalation | DshFieldReadinessEscalationScreen.tsx | app-field |
| ops.dsh.partner.approvals | ControlPanelDshPartnerApprovalsScreen.tsx | control-panel |

---

## Review Protocol

For each screen, human reviewer must:
1. Navigate to the screen on device/simulator (or browser for control panel)
2. Confirm no crash or layout break
3. Verify RTL (Arabic) text direction is correct
4. Confirm all states (loading/empty/error/success/offline) render
5. Confirm primary CTA is visible and triggers correct navigation (or is correctly disabled)
6. Sign off as `HUMAN_VISUAL_REVIEW_CONFIRMED` or `HUMAN_VISUAL_REVIEW_FAILED`
