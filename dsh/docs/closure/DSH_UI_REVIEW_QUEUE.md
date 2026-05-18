# DSH UI Review Queue — Loop 8 (Updated)

Status: NEEDS_VISUAL_EVIDENCE
Loop: 8
Date: 2026-05-18

All 63 registered DSH screens are `NEEDS_VISUAL_EVIDENCE`. No screen has been visually confirmed by a human reviewer. This document is the canonical queue for visual review ordered by priority.

---

## Review instructions

For each screen below, a human reviewer must:
1. Run the app surface on a device or simulator
2. Navigate to the screen
3. Verify the screen renders without crash or layout break
4. Check RTL (Arabic) text renders correctly
5. Confirm all required states (loading / empty / error / offline / success) render
6. Confirm the primary CTA is visible and triggers correct navigation
7. Sign off the screen as `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE`

---

## P0 — Business-critical screens (review immediately)

| Priority | Screen ID | Surface | File | RTL Risk | Primary CTA | Known Gap |
| --- | --- | --- | --- | --- | --- | --- |
| P0-01 | client.dsh.home.feed | app-client | HomeScreen.tsx | HIGH | Browse stores | None |
| P0-02 | client.dsh.cart.review | app-client | CartScreen.tsx | MEDIUM | Proceed to checkout | WLT fee display |
| P0-03 | client.dsh.checkout.intent | app-client | DshCheckoutIntentScreen.tsx | MEDIUM | Confirm order | SKELETON_ADDED: ML-006 order-created, ML-009 payment-failed, ML-010 quote-unavailable, ML-015 quote-loading/failed/success — NEEDS_VISUAL_EVIDENCE |
| P0-04 | client.dsh.order.tracking.live | app-client | OrdersTrackingScreens.tsx | HIGH | Track order | SKELETON_ADDED: ML-007 CancelOrderSheet wired, ML-008 refund_pending label added — NEEDS_VISUAL_EVIDENCE; CG-007 streaming unproven |
| P0-05 | client.dsh.orders.history | app-client | OrdersTrackingScreens.tsx | HIGH | View order | CG-006 unproven |
| P0-06 | client.dsh.store.details | app-client | StoreScreen.tsx | MEDIUM | View menu | CG-002 unproven |
| P0-07 | client.dsh.order.issue.workspace | app-client | OperationScreens.tsx | HIGH | Report issue | CG-012 unproven; OperationScreens god-file |
| P0-08 | partner.dsh.orders.inbox | app-partner | OrdersInboxScreen.tsx | HIGH | Accept order | SKELETON_ADDED: ML-016 AcceptanceTimerSheet wired, ML-020 onMarkReady present — NEEDS_VISUAL_EVIDENCE |
| P0-09 | partner.dsh.order.detail | app-partner | OrdersInboxScreen.tsx | HIGH | Prepare order | SKELETON_ADDED: ML-018 preparation_started, ML-019 preparing+items_ready states added — NEEDS_VISUAL_EVIDENCE |
| P0-10 | partner.dsh.inventory.catalog | app-partner | InventoryCatalogScreen.tsx | HIGH | Update inventory | CG-020 unproven |
| P0-11 | partner.dsh.order.rejection | app-partner | DshPartnerOrderRejectionScreen.tsx | LOW | Reject order | CG-022 unproven; ownerKind review |
| P0-12 | partner.dsh.entry.status | app-partner | PartnerEntryScreen.tsx | LOW | Activate store | ML-017 availability toggle |
| P0-13 | partner.dsh.home.dashboard | app-partner | PartnerHubScreen.tsx | HIGH | View orders | PartnerHubScreen god-file (3 screens) |
| P0-14 | captain.dsh.orders.inbox | app-captain | DshCaptainOrdersScreen.tsx | HIGH | Accept offer | SKELETON_ADDED: ML-024 OfferDeclineSheet, ML-026 availability-toggle, ML-027 loading-assignment states — NEEDS_VISUAL_EVIDENCE |
| P0-15 | captain.dsh.orders.detail | app-captain | DshCaptainOrdersScreen.tsx | HIGH | Navigate to pickup | CG-016 unproven — NEEDS_VISUAL_EVIDENCE |
| P0-16 | captain.dsh.orders.pickup-dropoff | app-captain | DshCaptainPickupDropoffScreen.tsx | MEDIUM | Confirm pickup | VERIFIED: ML-025 registered, ML-029 out-for-delivery+navigating-to-dropoff present — NEEDS_VISUAL_EVIDENCE |
| P0-17 | captain.dsh.orders.pod-submission | app-captain | DshCaptainPoDSubmissionScreen.tsx | LOW | Submit proof | SKELETON_ADDED: ML-031 retry-required state added — NEEDS_VISUAL_EVIDENCE |
| P0-18 | field.dsh.stores.list | app-field | DshFieldStoresScreen.tsx | HIGH | Select store | CG-024 unproven |
| P0-19 | field.dsh.store.onboarding | app-field | DshFieldStoreOnboardingScreen.tsx | MEDIUM | Complete step | ML-002 doc section; ML-005 exit state |
| P0-20 | field.dsh.store.visit | app-field | DshFieldStoreVisitScreen.tsx | LOW | Submit visit | ML-003 photo section |
| P0-21 | captain.wlt.dsh.finance.bridge | app-captain | WltDshCaptainBridge.tsx | HIGH | View payout | WLT-owned; DO NOT implement |
| P0-22 | partner.wlt.dsh.wallet.bridge | app-partner | WltDshPartnerBridge.tsx | HIGH | View wallet | WLT-owned; DO NOT implement |

---

## P1 — High-value screens (review in sprint following P0)

| Priority | Screen ID | Surface | File | RTL Risk | Known Gap |
| --- | --- | --- | --- | --- | --- |
| P1-01 | client.dsh.entry | app-client | EntryScreen.tsx | LOW | None significant |
| P1-02 | client.dsh.my-space.home | app-client | MySpaceScreen.tsx | HIGH | ML-013 subscriptions section |
| P1-03 | client.dsh.notifications.list | app-client | NotificationsScreen.tsx | HIGH | None significant |
| P1-04 | client.dsh.store.items | app-client | StoreItemsScreen.tsx | HIGH | CG-002 items endpoint |
| P1-05 | client.dsh.discovery.search | app-client | SearchScreen.tsx | HIGH | Arabic search input |
| P1-06 | client.dsh.benefits.home | app-client | BenefitsScreen.tsx | MEDIUM | ML-012 loyalty section |
| P1-07 | client.dsh.conversation.workspace | app-client | OperationScreens.tsx | HIGH | ML-011 thread differentiation; god-file |
| P1-08 | client.dsh.order.issue.workspace | app-client | OperationScreens.tsx | HIGH | Sheet candidate; god-file |
| P1-09 | partner.dsh.store.profile | app-partner | StoreProfileScreen.tsx | MEDIUM | Arabic content |
| P1-10 | partner.dsh.operations.control | app-partner | PartnerHubScreen.tsx | HIGH | ML-017 availability; god-file |
| P1-11 | partner.dsh.notifications.list | app-partner | OperationScreens.tsx | HIGH | ML-022 ops messaging gap |
| P1-12 | partner.dsh.support.center | app-partner | PartnerSupportScreen.tsx | MEDIUM | ML-051 ops-side missing |
| P1-13 | captain.dsh.entry | app-captain | DshCaptainEntryScreen.tsx | LOW | ML-026 availability toggle here |
| P1-14 | captain.dsh.home.dashboard | app-captain | DshCaptainSurface.tsx | HIGH | God-file (7 screens) |
| P1-15 | captain.dsh.support.directory | app-captain | DshCaptainOperationsScreen.tsx | MEDIUM | None significant |
| P1-16 | captain.dsh.support.workspace | app-captain | DshCaptainSurface.tsx | HIGH | ML-030 god-file extract needed; ML-052 ops-side |
| P1-17 | captain.dsh.orders.chat | app-captain | DshCaptainOrdersScreen.tsx | HIGH | Sheet candidate |
| P1-18 | captain.dsh.orders.bell | app-captain | DshCaptainOrdersScreen.tsx | LOW | Sheet candidate |
| P1-19 | field.dsh.finance.overview | app-field | DshFieldFinanceScreen.tsx | HIGH | WLT bridge |
| P1-20 | field.dsh.account.home | app-field | DshFieldProfileHomeScreen.tsx | HIGH | None significant |
| P1-21 | field.dsh.store.readiness-escalation | app-field | DshFieldReadinessEscalationScreen.tsx | LOW | ML-004 ops dependency; sheet candidate |
| P1-22 | field.wlt.dsh.finance.bridge | app-field | WltDshFieldBridge.tsx | HIGH | WLT-owned |
| P1-23 | captain.dsh.account.orders | app-captain | DshCaptainSurface.tsx | HIGH | God-file split |
| P1-24 | partner.dsh.promotions.intent | app-partner | PromotionsScreen.tsx | MEDIUM | ML-023 video ownership |

---

## P2 — Lower-priority screens (review before Loop 6 readiness)

| Priority | Screen ID | Surface | File | RTL Risk | Known Gap |
| --- | --- | --- | --- | --- | --- |
| P2-01 | client.dsh.order.rating | app-client | DshRatingScreen.tsx | LOW | Sheet candidate |
| P2-02 | client.dsh.favorites.toggle | app-client | FavoriteToggleScreen.tsx | LOW | Sheet candidate |
| P2-03 | client.dsh.favorites.list | app-client | FavoritesScreen.tsx | HIGH | None significant |
| P2-04 | client.dsh.bell | app-client | BellScreen.tsx | LOW | None significant |
| P2-05 | client.dsh.listing.status-update | app-client | OperationScreens.tsx | MEDIUM | Sheet candidate; god-file |
| P2-06 | client.dsh.proxy.workspace | app-client | OperationScreens.tsx | MEDIUM | Awnak/Shein proxy; god-file |
| P2-07 | client.dsh.service.settings | app-client | OperationScreens.tsx | LOW | God-file |
| P2-08 | client.dsh.zone.set | app-client | OperationScreens.tsx | MEDIUM | Sheet candidate |
| P2-09 | captain.dsh.account.root | app-captain | DshCaptainSurface.tsx | HIGH | God-file |
| P2-10 | captain.dsh.account.profile | app-captain | DshCaptainProfileScreen.tsx | MEDIUM | None significant |
| P2-11 | captain.dsh.account.finance | app-captain | DshCaptainFinanceScreen.tsx | HIGH | WLT bridge |
| P2-12 | captain.dsh.account.docs | app-captain | DshCaptainSurface.tsx | MEDIUM | God-file |
| P2-13 | captain.dsh.account.shifts | app-captain | DshCaptainSurface.tsx | MEDIUM | God-file |
| P2-14 | captain.dsh.account.support | app-captain | DshCaptainSurface.tsx | MEDIUM | God-file; routes to support screen |
| P2-15 | field.dsh.account.profile | app-field | DshFieldProfileScreen.tsx | MEDIUM | None significant |
| P2-16 | field.dsh.stores.history | app-field | DshFieldStoresHistoryScreen.tsx | HIGH | None significant |
| P2-17 | partner.dsh.settings.preferences | app-partner | PartnerHubScreen.tsx | LOW | God-file |

---

## Screens blocked from review until gap resolution

| Screen ID | Blocked by | Gap |
| --- | --- | --- |
| captain.dsh.orders.pickup-dropoff | DshCaptainMapScreen not registered | ML-025 |
| client.dsh.checkout.intent (success state) | Order-created confirmation missing | ML-006 |
| client.dsh.order.tracking.live (refund state) | WLT refund bridge missing | ML-008 |
| ALL CP support screens | Entire section not built | ML-046..ML-052 |
| ALL CP finance sub-workspaces | All 6 sub-workspaces missing | ML-040..ML-045 |

---

## Summary

| Status | Count |
| --- | --- |
| P0 screens requiring immediate visual review | 22 |
| P1 screens requiring sprint-following review | 24 |
| P2 screens requiring pre-Loop-6 review | 17 |
| Screens blocked by unresolved gaps | 5+ groups |
| **Total registered screens** | **63** |

No screen has status `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE` — all are `NEEDS_VISUAL_EVIDENCE`.
