# DSH Visual Review — Screen Index

Branch: `ghb/0144-20260516-033533-local-change-review-patch`
Commit: `cae3c7bf`

All 33 reviewable rows grouped by surface.
See `DSH_VISUAL_REVIEW_LEDGER.csv` for full column data.

---

## app-client (7 screens)

| review_id | screen_id | file_path | queue_list | priority | result |
|---|---|---|---|---|---|
| VR-L1-001 | client.dsh.home.feed | dsh/frontend/app-client/screens/HomeScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-002 | client.dsh.cart.review | dsh/frontend/app-client/screens/CartScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-003 | client.dsh.order.tracking.live | dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-004 | client.dsh.orders.history | dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-005 | client.dsh.store.details | dsh/frontend/app-client/screens/StoreScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-006 | client.dsh.order.issue.workspace | dsh/frontend/app-client/screens/OperationScreens.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L2-001 | client.dsh.checkout.intent | dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |

---

## app-partner (7 screens)

| review_id | screen_id | file_path | queue_list | priority | result |
|---|---|---|---|---|---|
| VR-L1-007 | partner.dsh.orders.inbox | dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-008 | partner.dsh.order.detail | dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-009 | partner.dsh.inventory.catalog | dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-010 | partner.dsh.order.rejection | dsh/frontend/app-partner/screens/DshPartnerOrderRejectionScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-011 | partner.dsh.entry.status | dsh/frontend/app-partner/screens/PartnerEntryScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-012 | partner.dsh.home.dashboard | dsh/frontend/app-partner/screens/PartnerHubScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L2-011 | partner.wlt.dsh.wallet.bridge | dsh/frontend/app-partner/screens/WltDshPartnerBridge.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |

---

## app-captain (6 screens)

| review_id | screen_id | file_path | queue_list | priority | result |
|---|---|---|---|---|---|
| VR-L1-013 | captain.dsh.orders.inbox | dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-014 | captain.dsh.orders.detail | dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L2-002 | captain.dsh.orders.pickup-dropoff | dsh/frontend/app-captain/screens/DshCaptainPickupDropoffScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |
| VR-L2-003 | captain.dsh.orders.pod-submission | dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |
| VR-L2-004 | captain.dsh.orders.map | dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |
| VR-L2-010 | captain.wlt.dsh.finance.bridge | dsh/frontend/app-captain/screens/WltDshCaptainBridge.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |

---

## app-field (4 screens)

| review_id | screen_id | file_path | queue_list | priority | result |
|---|---|---|---|---|---|
| VR-L1-015 | field.dsh.stores.list | dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-016 | field.dsh.store.onboarding | dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-017 | field.dsh.store.visit | dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L2-005 | field.dsh.store.onboarding/documents | dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |
| VR-L2-006 | field.dsh.store.visit/evidence | dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |

---

## control-panel (8 screens)

| review_id | screen_id | file_path | queue_list | priority | result |
|---|---|---|---|---|---|
| VR-L1-018 | ops.dsh.operations.hub | dsh/frontend/control-panel/screens/OperationsHubScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-019 | ops.dsh.dispatch | dsh/frontend/control-panel/screens/DispatchAssignmentScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-020 | ops.dsh.exceptions | dsh/frontend/control-panel/screens/ExceptionsEscalationsScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-021 | ops.dsh.live.orders | dsh/frontend/control-panel/screens/LiveOrdersScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L1-022 | ops.dsh.audit.sla | dsh/frontend/control-panel/screens/AuditSupportSlaScreen.tsx | LIST_1_READY_NOW | P1 | NOT_REVIEWED |
| VR-L2-007 | ops.dsh.audit.sla/detail | dsh/frontend/control-panel/screens/AuditSupportSlaScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |
| VR-L2-008 | ops.dsh.catalog.approvals.quality | dsh/frontend/control-panel/screens/ControlPanelDshCatalogScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |
| VR-L2-009 | ops.dsh.catalog.approvals.pricing | dsh/frontend/control-panel/screens/ControlPanelDshCatalogScreen.tsx | LIST_2_DISABLED_PREVIEW | P2 | NOT_REVIEWED |

---

## Totals

| Surface | List 1 | List 2 | Total |
|---|---|---|---|
| app-client | 6 | 1 | 7 |
| app-partner | 6 | 1 | 7 |
| app-captain | 2 | 4 | 6 |
| app-field | 3 | 2 | 5 |
| control-panel | 5 | 3 | 8 |
| **Total** | **22** | **11** | **33** |
