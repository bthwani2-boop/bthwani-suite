# DSH V6 Final Screen Review Queue

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

All registered DSH screens require human visual review. This is the V6 prioritized queue.

---

## P0 — Review immediately (22 screens — unchanged from V4 queue)

| # | Screen ID | Surface | File | V6 design state | Key gaps remaining |
|---|---|---|---|---|---|
| P0-01 | client.dsh.home.feed | app-client | HomeScreen.tsx | NEEDS_VISUAL_EVIDENCE | None blocking |
| P0-02 | client.dsh.cart.review | app-client | CartScreen.tsx | NEEDS_VISUAL_EVIDENCE | WLT fee display |
| P0-03 | client.dsh.checkout.intent | app-client | DshCheckoutIntentScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-009 error state WIRED; ML-010 retry WIRED; ML-015 quote-loading WIRED; WLT callback not proven |
| P0-04 | client.dsh.order.tracking.live | app-client | OrdersTrackingScreens.tsx | NEEDS_VISUAL_EVIDENCE | ML-008 refund state BLOCKED_BY_WLT |
| P0-05 | client.dsh.orders.history | app-client | OrdersTrackingScreens.tsx | NEEDS_VISUAL_EVIDENCE | CG-006 unproven |
| P0-06 | client.dsh.store.details | app-client | StoreScreen.tsx | NEEDS_VISUAL_EVIDENCE | Major visual baseline from prior session |
| P0-07 | client.dsh.order.issue.workspace | app-client | OperationScreens.tsx | NEEDS_VISUAL_EVIDENCE | ML-011 thread differentiation OWNER_DECISION_REQUIRED |
| P0-08 | partner.dsh.orders.inbox | app-partner | OrdersInboxScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-021 captain_assigned/captain_arriving WIRED; ML-016 timer BLOCKED_BY_CONTRACT |
| P0-09 | partner.dsh.order.detail | app-partner | OrdersInboxScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-018 ML-019 ML-020 prep states WIRED |
| P0-10 | partner.dsh.inventory.catalog | app-partner | InventoryCatalogScreen.tsx | NEEDS_VISUAL_EVIDENCE | CG-020 unproven |
| P0-11 | partner.dsh.order.rejection | app-partner | DshPartnerOrderRejectionScreen.tsx | NEEDS_VISUAL_EVIDENCE | CG-022 unproven |
| P0-12 | partner.dsh.entry.status | app-partner | PartnerEntryScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-017 availability toggle WIRED |
| P0-13 | partner.dsh.home.dashboard | app-partner | PartnerHubScreen.tsx | NEEDS_VISUAL_EVIDENCE | god-file (3 screens); split OWNER_DECISION_REQUIRED |
| P0-14 | captain.dsh.orders.inbox | app-captain | DshCaptainOrdersScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-027 offer-accept confirmation WIRED; ML-024 decline sheet BLOCKED_BY_CONTRACT |
| P0-15 | captain.dsh.orders.detail | app-captain | DshCaptainOrdersScreen.tsx | NEEDS_VISUAL_EVIDENCE | CG-016 unproven |
| P0-16 | captain.dsh.orders.pickup-dropoff | app-captain | DshCaptainPickupDropoffScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-029 in-transit state WIRED |
| P0-17 | captain.dsh.orders.pod-submission | app-captain | DshCaptainPoDSubmissionScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-031 rejected state confirmed present |
| P0-18 | field.dsh.stores.list | app-field | DshFieldStoresScreen.tsx | NEEDS_VISUAL_EVIDENCE | CG-024 unproven |
| P0-19 | field.dsh.store.onboarding | app-field | DshFieldStoreOnboardingScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-002 doc section WIRED; ML-005 exit state WIRED |
| P0-20 | field.dsh.store.visit | app-field | DshFieldStoreVisitScreen.tsx | NEEDS_VISUAL_EVIDENCE | ML-003 VisitEvidenceSection WIRED (new in V6) |
| P0-21 | captain.wlt.dsh.finance.bridge | app-captain | WltDshCaptainBridge.tsx | NEEDS_VISUAL_EVIDENCE | WLT-owned; DO NOT implement |
| P0-22 | partner.wlt.dsh.wallet.bridge | app-partner | WltDshPartnerBridge.tsx | NEEDS_VISUAL_EVIDENCE | WLT-owned; DO NOT implement |

---

## P1 — Review in sprint following P0 (24 screens)

| # | Screen ID | Surface | File | V6 gaps |
|---|---|---|---|---|
| P1-01 | client.dsh.entry | app-client | EntryScreen.tsx | None significant |
| P1-02 | client.dsh.my-space.home | app-client | MySpaceScreen.tsx | ML-012 ML-013 OWNER_DECISION_REQUIRED |
| P1-03 | client.dsh.notifications.list | app-client | NotificationsScreen.tsx | None significant |
| P1-04 | client.dsh.store.items | app-client | StoreItemsScreen.tsx | CG-002 unproven |
| P1-05 | client.dsh.benefits.hub | app-client | BenefitsScreen.tsx | ML-012 loyalty section OWNER_DECISION_REQUIRED |
| P1-06 | client.dsh.favorites.list | app-client | FavoritesScreen.tsx | None significant |
| P1-07 | client.dsh.search | app-client | SearchScreen.tsx | None significant |
| P1-08 | client.dsh.rating | app-client | DshRatingScreen.tsx | None significant |
| P1-09 | partner.dsh.profile | app-partner | PartnerProfileScreen.tsx | None significant |
| P1-10 | partner.dsh.promotions | app-partner | PromotionsScreen.tsx | ML-023 video ownership OWNER_DECISION_REQUIRED |
| P1-11 | partner.dsh.conversation | app-partner | PartnerOrderConversationPanel | ML-022 ops-side WIRED as OpsPartnerMessagingWorkspace (BLOCKED_BY_CONTRACT) |
| P1-12 | captain.dsh.entry | app-captain | DshCaptainEntryScreen.tsx | None significant |
| P1-13 | captain.dsh.orders.map | app-captain | DshCaptainMapScreen.tsx | ML-025 registered UNPROVEN — no navigation trigger yet |
| P1-14 | captain.dsh.orders.chat | app-captain | DshCaptainOrdersScreen.tsx | CG-017 unproven |
| P1-15 | captain.dsh.support.directory | app-captain | DshCaptainOperationsScreen.tsx | None significant |
| P1-16 | captain.dsh.account.profile | app-captain | DshCaptainProfileScreen.tsx | None significant |
| P1-17 | captain.dsh.account.finance | app-captain | DshCaptainFinanceScreen.tsx | WLT bridge |
| P1-18 | field.dsh.store.escalation | app-field | DshFieldReadinessEscalationScreen.tsx | ML-004 pending/approved/rejected states WIRED (new in V6) |
| P1-19 | ops.dsh.operations.hub | control-panel | OperationsHubScreen.tsx | None significant |
| P1-20 | ops.dsh.dispatch | control-panel | DispatchAssignmentScreen.tsx | ML-036 auto-assign OWNER_DECISION_REQUIRED |
| P1-21 | ops.dsh.exceptions | control-panel | ExceptionsEscalationsScreen.tsx | ML-037 reassign trigger OWNER_DECISION_REQUIRED |
| P1-22 | ops.dsh.live.orders | control-panel | LiveOrdersScreen.tsx | None significant |
| P1-23 | ops.dsh.partner.approvals | control-panel | ControlPanelDshPartnerApprovalsScreen.tsx | ML-001 approval action section WIRED |
| P1-24 | ops.dsh.audit.sla | control-panel | AuditSupportSlaScreen.tsx | ML-035 AuditTrailDetailWorkspace WIRED (V6) |

---

## P2 — Review pre-Loop-7 (17 screens)

Catalog, marketing, secondary profile, field finance, and remaining control-panel views. All `NEEDS_VISUAL_EVIDENCE`. No P0/P1 gates block these.

---

## Review protocol

For each screen, human reviewer must:
1. Navigate to the screen on device/simulator
2. Confirm no crash or layout break
3. Verify RTL (Arabic) text direction is correct
4. Confirm all states (loading/empty/error/success/offline) render
5. Confirm primary CTA is visible and triggers correct navigation
6. Sign off as `HUMAN_VISUAL_REVIEW_CONFIRMED` or `HUMAN_VISUAL_REVIEW_FAILED`
