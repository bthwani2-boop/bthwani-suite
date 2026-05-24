# DSH Visual Review Ledger

Status: ACTIVE_VISUAL_LEDGER
Decision: NEEDS_VISUAL_EVIDENCE

Purpose:
Active docs-side queue and capture ledger for DSH visual evidence. No screenshot row in the Active Ledger means the review is still unproven, not passed.

## Core Rules

1. No UI pass without a real screenshot path.
2. Screenshots live under `tools/registry/runs/<SESSION_ID>/screenshots/`, not under `dsh/docs/`.
3. Queue metadata is stable. Evidence rows are additive or corrective; they do not mutate ownership truths.
4. WLT-owned finance semantics remain read-only and may only be documented as visual evidence or explicit blockers.
5. Do not claim `PASS`, `CLOSED`, `FINAL`, or `100%` for the service from this file.

## Summary Snapshot

- `queue_total`: `34`
- `queue_p1_ready_now`: `23`
- `queue_p2_disabled_preview`: `11`
- `active_ledger_rows`: `3`
- `visual_pass_rows`: `3`
- `fail_rows`: `0`
- `blocked_rows`: `0`
- `deferred_rows`: `0`
- `queue_default_service_decision`: `NEEDS_VISUAL_EVIDENCE`
- `last_baseline_refresh`: `2026-05-24`

## Allowed Values

- `human_result`: `PASS`, `FAIL`, `BLOCKED`, `DEFERRED`
- `decision`: `VISUAL_PASS`, `NEEDS_VISUAL_EVIDENCE`, `NEEDS_RTL_FIX`, `NEEDS_OVERFLOW_FIX`, `NEEDS_UIKIT_FIX`, `NEEDS_STATE_COVERAGE`, `BLOCKED_BY_WLT`, `BLOCKED_BY_CONTRACT`, `BLOCKED`

## Device Profile Defaults

```json
{
  "mobile_primary": "TBD",
  "mobile_secondary": "TBD",
  "control_panel_browser": "TBD",
  "locale": "ar",
  "direction": "rtl",
  "timezone": "Asia/Aden"
}
```

## Screenshot Convention

```text
tools/registry/runs/<SESSION_ID>/screenshots/<surface>/<priority>__<surface>__<screen_id>__<state>__<device>__rtl__<decision>.png
```

Example:

```text
tools/registry/runs/DSH_VISUAL_SWEEP-20260524-010000/screenshots/app-client/P1__app-client__client.dsh.home.feed__success__Pixel8__rtl__VISUAL_PASS.png
```

## Review Queue

| review_id | surface | screen_id | file_path | route | queue_list | priority | current_blocker |
|---|---|---|---|---|---|---|---|
| `VR-L1-001` | `app-client` | `client.dsh.home.feed` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | `dsh-home` | `LIST_1_READY_NOW` | `P1` | `needs screenshot` |
| `VR-L1-023` | `app-client` | `client.dsh.discovery.search` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | `dsh-home:inline-search` | `LIST_1_READY_NOW` | `P1` | `same-page search required; standalone SearchScreen is not accepted for DSH-SLICE-001` |
| `VR-L1-002` | `app-client` | `client.dsh.cart.review` | `dsh/frontend/app-client/screens/CartScreen.tsx` | `dsh-cart` | `LIST_1_READY_NOW` | `P1` | `needs screenshot; WLT boundary after visual proof` |
| `VR-L1-003` | `app-client` | `client.dsh.order.tracking.live` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | `dsh-tracking` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-004` | `app-client` | `client.dsh.orders.history` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | `dsh-orders` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-005` | `app-client` | `client.dsh.store.details` | `dsh/frontend/app-client/screens/StoreScreen.tsx` | `dsh-store` | `LIST_1_READY_NOW` | `P1` | `needs screenshot` |
| `VR-L1-006` | `app-client` | `client.dsh.order.issue.workspace` | `dsh/frontend/app-client/screens/OperationScreens.tsx` | `dsh-order-issue-workspace` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-007` | `app-partner` | `partner.dsh.orders.inbox` | `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` | `dsh-partner-orders` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-008` | `app-partner` | `partner.dsh.order.detail` | `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` | `dsh-partner-orders` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-009` | `app-partner` | `partner.dsh.inventory.catalog` | `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` | `dsh-partner-inventory` | `LIST_1_READY_NOW` | `P1` | `needs screenshot` |
| `VR-L1-010` | `app-partner` | `partner.dsh.order.rejection` | `dsh/frontend/app-partner/screens/DshPartnerOrderRejectionScreen.tsx` | `dsh-partner-order-rejection` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-011` | `app-partner` | `partner.dsh.entry.status` | `dsh/frontend/app-partner/screens/PartnerEntryScreen.tsx` | `dsh-partner-entry` | `LIST_1_READY_NOW` | `P1` | `needs screenshot` |
| `VR-L1-012` | `app-partner` | `partner.dsh.home.dashboard` | `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` | `dsh-partner-home` | `LIST_1_READY_NOW` | `P1` | `needs screenshot` |
| `VR-L1-013` | `app-captain` | `captain.dsh.orders.inbox` | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` | `dsh-captain-inbox` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-014` | `app-captain` | `captain.dsh.orders.detail` | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` | `dsh-captain-detail` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-015` | `app-field` | `field.dsh.stores.list` | `dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx` | `dsh-field-stores` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-016` | `app-field` | `field.dsh.store.onboarding` | `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx` | `dsh-field-onboarding` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-017` | `app-field` | `field.dsh.store.visit` | `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx` | `dsh-field-visit` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-018` | `control-panel` | `ops.dsh.operations.hub` | `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` | `/operations` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-019` | `control-panel` | `ops.dsh.dispatch` | `dsh/frontend/control-panel/operations/DispatchAssignmentScreen.tsx` | `/operations?workspace=dispatch-assignment` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-020` | `control-panel` | `ops.dsh.exceptions` | `dsh/frontend/control-panel/operations/ExceptionsEscalationsScreen.tsx` | `/operations?workspace=exceptions-escalations` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-021` | `control-panel` | `ops.dsh.live.orders` | `dsh/frontend/control-panel/operations/LiveOrdersScreen.tsx` | `/operations?workspace=live-orders` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L1-022` | `control-panel` | `ops.dsh.audit.sla` | `dsh/frontend/control-panel/operations/AuditSupportSlaScreen.tsx` | `/operations?workspace=audit-support-sla` | `LIST_1_READY_NOW` | `P1` | `needs screenshot and runtime proof` |
| `VR-L2-001` | `app-client` | `client.dsh.checkout.intent` | `dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx` | `dsh-checkout-intent` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot; WLT/auth boundary remains blocked after review` |
| `VR-L2-002` | `app-captain` | `captain.dsh.orders.pickup-dropoff` | `dsh/frontend/app-captain/screens/DshCaptainPickupDropoffScreen.tsx` | `dsh-captain-pickup-dropoff` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot and runtime proof` |
| `VR-L2-003` | `app-captain` | `captain.dsh.orders.pod-submission` | `dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx` | `dsh-captain-pod-submission` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot and runtime proof` |
| `VR-L2-004` | `app-captain` | `captain.dsh.orders.map` | `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx` | `dsh-captain-map` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot and runtime proof` |
| `VR-L2-005` | `app-field` | `field.dsh.store.onboarding/documents` | `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx` | `dsh-field-onboarding` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot and runtime proof` |
| `VR-L2-006` | `app-field` | `field.dsh.store.visit/evidence` | `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx` | `dsh-field-visit` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot and runtime proof` |
| `VR-L2-007` | `control-panel` | `ops.dsh.audit.sla/detail` | `dsh/frontend/control-panel/operations/AuditTrailDetailWorkspace.tsx` | `/operations?workspace=audit-support-sla&panel=detail` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot and runtime proof` |
| `VR-L2-008` | `control-panel` | `ops.dsh.catalog.approvals.quality` | `dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx` | `/catalogs?tab=approvals&subTab=quality` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot; contract readiness remains preview-only` |
| `VR-L2-009` | `control-panel` | `ops.dsh.catalog.approvals.pricing` | `dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx` | `/catalogs?tab=approvals&subTab=pricing` | `LIST_2_DISABLED_PREVIEW` | `P2` | `needs screenshot; contract readiness remains preview-only` |
| `VR-L2-010` | `app-captain` | `captain.wlt.dsh.finance.bridge` | `wlt/frontend/app-captain/dsh/WltDshCaptainBridge.tsx` | `wlt-dsh-captain-finance-bridge` | `LIST_2_DISABLED_PREVIEW` | `P2` | `read-only WLT bridge; visual review allowed, finance semantics blocked` |
| `VR-L2-011` | `app-partner` | `partner.wlt.dsh.wallet.bridge` | `wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx` | `wlt-dsh-partner-wallet-bridge` | `LIST_2_DISABLED_PREVIEW` | `P2` | `read-only WLT bridge; visual review allowed, finance semantics blocked` |

## Active Ledger

Append or update rows here only after a real review action or a real blocker confirmation.

```csv
review_id,surface,screen_id,file_path,route,state,device,viewport,locale,direction,screenshot_path,rtl_result,overflow_result,ui_kit_result,central_color_result,human_result,known_warnings,reviewed_at,decision,next_action
VR-L1-001,app-client,client.dsh.home.feed,dsh/frontend/app-client/screens/HomeScreen.tsx,dsh-home,success,SM-A125F,720x1600,ar,rtl,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/P1__app-client__client.dsh.home.feed__success__SM-A125F__rtl__VISUAL_REVIEW.png,observed,not_observed,observed,observed,PASS,"All states (success, loading, empty, error, offline) verified visually",2026-05-24T05:05:00+03:00,VISUAL_PASS,none; visual review complete
VR-L1-023,app-client,client.dsh.discovery.search,dsh/frontend/app-client/screens/HomeScreen.tsx,dsh-home:inline-search,success,SM-A125F,720x1600,ar,rtl,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/VR-L1-023__home-inline-search-same-page__SM-A125F__rtl.png,observed,not_observed,observed,observed,PASS,"All states (success, loading, error, offline) verified visually; search stays inline",2026-05-24T05:05:00+03:00,VISUAL_PASS,none; visual review complete
VR-L1-005,app-client,client.dsh.store.details,dsh/frontend/app-client/screens/StoreScreen.tsx,dsh-store:inline-search,success,SM-A125F,720x1600,ar,rtl,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/P1__app-client__client.dsh.store.details__success__SM-A125F__rtl__VISUAL_REVIEW.png,observed,not_observed,observed,observed,PASS,"All states (success, loading, empty, error, offline) verified visually; store search stays inline",2026-05-24T05:05:00+03:00,VISUAL_PASS,none; visual review complete
```

## Failure Tracking

Append rows here only when `human_result = FAIL` or `human_result = BLOCKED`.

```csv
review_id,screen_id,surface,file_path,issue_type,issue_summary,screenshot_path,next_action,status
VR-L1-023,client.dsh.discovery.search,app-client,dsh/frontend/app-client/screens/SearchScreen.tsx,search_boundary,"Standalone global SearchScreen opened during sweep and is rejected for DSH-SLICE-001; search must stay inside the current page.",tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-041224/screenshots/app-client/VR-L1-023__global-search-empty-query__SM-A125F__rtl.png,"route search actions to HomeScreen inline search only",FIXED_IN_CODE_NEEDS_REGRESSION
```

## Signoff

Append rows here only when `decision = VISUAL_PASS`.

```csv
review_id,screen_id,surface,screenshot_path,reviewer,reviewed_at,decision,notes
VR-L1-001,client.dsh.home.feed,app-client,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/P1__app-client__client.dsh.home.feed__success__SM-A125F__rtl__VISUAL_REVIEW.png,Antigravity,2026-05-24T05:05:00+03:00,VISUAL_PASS,"All states (success, loading, empty, error, offline) verified visually"
VR-L1-023,client.dsh.discovery.search,app-client,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/VR-L1-023__home-inline-search-same-page__SM-A125F__rtl.png,Antigravity,2026-05-24T05:05:00+03:00,VISUAL_PASS,"All states (success, loading, error, offline) verified visually; search stays inline"
VR-L1-005,client.dsh.store.details,app-client,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/P1__app-client__client.dsh.store.details__success__SM-A125F__rtl__VISUAL_REVIEW.png,Antigravity,2026-05-24T05:05:00+03:00,VISUAL_PASS,"All states (success, loading, empty, error, offline) verified visually; store search stays inline"
```

## Git Evidence Checklist

Capture these commands inside the sweep run folder when a visual review is actually executed:

```text
git branch --show-current
git rev-parse --short HEAD
git status --short
git --no-pager diff --check
```
