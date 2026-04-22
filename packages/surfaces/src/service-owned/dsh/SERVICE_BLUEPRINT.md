# DSH Service Blueprint

Status: ACTIVE
Owner root: packages/surfaces/src/service-owned/dsh
Purpose: Single canonical living control file for DSH service truth.

This file replaces scattered DSH service docs under packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md.

It must stay compact, evidence-driven, and phase-aware. Do not add noisy screen lists, stale generated names, or future claims without proof.

---

## 1. Service Identity

| Field | Value |
|---|---|
| Service | DSH |
| Service Meaning | Delivery & Shopping |
| Canonical owner root | packages/surfaces/src/service-owned/dsh |
| Legacy docs root | packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md |
| Legacy docs status | RETIRED |
| Current truth file | packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md |
| Last verified | 2026-04-20 23:15:58 |
| Evidence root | $SealRunRel |

---

## 2. Non-Negotiable Rules

| Rule | Status |
|---|---|
| No stale packages/surfaces/src/dsh/... paths | REQUIRED |
| No amilies/ legacy path as live truth | REQUIRED |
| No noisy generated screen lists without need | REQUIRED |
| No Binding truth before Binding phase evidence | REQUIRED |
| No Integration truth before Integration phase evidence | REQUIRED |
| No API truth before API/Contract phase evidence | REQUIRED |
| No full DSH closure claim while only app-client is sealed | REQUIRED |
| No 	ask/tasks terminology for DSH order flows | REQUIRED — use order/orders |
| No commit mixing app-client closure with app-captain/app-partner/app-field closure | REQUIRED |

---

## 3. Surface Status Matrix

| Surface | UI / UX / Flow | Binding | Integration | API / Contract | Current Status | Evidence |
|---|---:|---:|---:|---:|---|---|
| app-client | CLOSED / PASS | TBD | TBD | TBD | Client UX/UI/Flow sealed only | $SealRunRel |
| app-captain | TBD | TBD | TBD | TBD | Outside current closure | N/A |
| app-partner | TBD | TBD | TBD | TBD | Outside current closure | N/A |
| app-field | TBD | TBD | TBD | TBD | Outside current closure | N/A |
| control-panel | TBD | TBD | TBD | TBD | Outside current closure | N/A |

---

## 4. Current Closed Decision

| Field | Value |
|---|---|
| Decision | DSH app-client UX/UI/Flow closure accepted |
| Scope | packages/surfaces/src/service-owned/dsh/app-client only |
| Blockers | 0 |
| Warnings | 0 |
| App-client TypeScript | PASS |
| Raw surfaces TypeScript | FAIL outside current scope |
| Full DSH closure | NOT CLOSED |
| Evidence | $SealRunRel |

---

## 5. Current Phase Truth

| Phase | Status | Notes |
|---|---|---|
| UI / UX / Flow — app-client | CLOSED | Closed with evidence. |
| UI / UX / Flow — other DSH surfaces | TBD | Must be checked separately. |
| Binding | TBD | Not started as closed truth. |
| Integration | TBD | Not started as closed truth. |
| API / Contract | TBD | Not started as closed truth. |
| Runtime Vars | TBD | Add only after verified. |
| Guards | TBD | Add only after verified. |

---

## 6. Evidence Registry

| Evidence ID | Scope | Result | Path |
|---|---|---|---|
| SEAL_DSH_APP_CLIENT_UX_UI_FLOW_CLOSURE | app-client UX/UI/Flow | PASS_CLIENT_SCOPE | $SealRunRel |

---

## 7. Update Protocol

When DSH progresses to Binding, Integration, API, or full closure:

1. Add only verified rows.
2. Add evidence path.
3. Keep old claims as TBD until proven.
4. Do not reintroduce packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md.
5. Do not paste long generated screen catalogs into this file.
6. Keep this file as a compact control blueprint.

---

## 8. Retired Docs Decision

| Retired Path | Replacement |
|---|---|
| packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md | packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md |

Reason: The old docs folder contained noisy/stale screen lists and path references. The new service-owned blueprint is the compact canonical control point.

---

## 9. Change Log

| Date | Change | Evidence |
|---|---|---|
| 2026-04-20 23:15:58 | Retired packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md; created service-owned DSH blueprint; preserved app-client UX/UI/Flow closure truth. | $SealRunRel |

<!-- BEGIN APP_CLIENT_VERIFIED_BLUEPRINT -->

## 10. App-Client Verified Blueprint

Status: VERIFIED / CLOSED for UI, UX, and Flow only.

Last updated: 2026-04-20 23:29:45

| Field | Value |
|---|---|
| Surface | app-client |
| Owner path | packages/surfaces/src/service-owned/dsh/app-client |
| Host | packages/surfaces/src/service-owned/dsh/app-client/DshSurfaceHost.tsx |
| Catalog | packages/surfaces/src/service-owned/dsh/app-client/surface-catalog.ts |
| UI / UX / Flow | CLOSED / PASS |
| Binding | TBD |
| Integration | TBD |
| API / Contract | TBD |
| App-client TypeScript | PASS |
| Raw surfaces TypeScript | FAIL — outside-scope failures are not app-client closure blockers |
| Closure evidence | tools/registry/runs/SEAL_DSH_APP_CLIENT_UX_UI_FLOW_CLOSURE-20260420-222955 |
| Docs retirement evidence | tools/registry/runs/APPLY_VERIFY_DSH_DOCS_RETIRE_AND_SERVICE_BLUEPRINT_CREATE-20260420-231558 |

### 10.1 Verified Inventory Counts

| Metric | Value |
|---|---|
| TS/TSX files | 65 |
| TSX files | 29 |
| Screen files | 24 |
| DshRoute entries | 30 |
| surfaceCatalog entries | 30 |
| Route/catalog drift | 0 |
| App-client related TSC errors | 0 |
| Closure blockers | 0 |
| Closure warnings | 0 |

### 10.2 Verified Top-Level App-Client Groups

| Group | Status | Path |
|---|---|---|
| assets | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/assets |
| awnak | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/awnak |
| bell | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/bell |
| cart | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/cart |
| categories | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/categories |
| checkout | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/checkout |
| discovery | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/discovery |
| entry | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/entry |
| favorites | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/favorites |
| gas | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/gas |
| home | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/home |
| loyalty | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/loyalty |
| my_space | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/my_space |
| notifications | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/notifications |
| operations | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/operations |
| patterns | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/patterns |
| shein | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/shein |
| stores | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/stores |
| subscriptions | VERIFIED_PRESENT | packages/surfaces/src/service-owned/dsh/app-client/subscriptions |

### 10.3 Verified Routes and Catalog Parity

| Route | In DshRoute | In surfaceCatalog | Status |
|---|---|---|---|
| home | YES | YES | VERIFIED |
| entry | YES | YES | VERIFIED |
| my-space | YES | YES | VERIFIED |
| notifications | YES | YES | VERIFIED |
| store-items | YES | YES | VERIFIED |
| awnak-order-create | YES | YES | VERIFIED |
| cart-get | YES | YES | VERIFIED |
| favorite-toggle | YES | YES | VERIFIED |
| favorites-list | YES | YES | VERIFIED |
| search | YES | YES | VERIFIED |
| store-get | YES | YES | VERIFIED |
| bell | YES | YES | VERIFIED |
| create-order | YES | YES | VERIFIED |
| checkout-workspace | YES | YES | VERIFIED |
| benefits | YES | YES | VERIFIED |
| conversation-workspace | YES | YES | VERIFIED |
| delivery-management-workspace | YES | YES | VERIFIED |
| intake-workspace | YES | YES | VERIFIED |
| listing-status-update | YES | YES | VERIFIED |
| order-issue-workspace | YES | YES | VERIFIED |
| proxy-workspace | YES | YES | VERIFIED |
| shein-order-create | YES | YES | VERIFIED |
| service-settings | YES | YES | VERIFIED |
| trust-workspace | YES | YES | VERIFIED |
| zone-set | YES | YES | VERIFIED |
| operations-directory | YES | YES | VERIFIED |
| operations-screen | YES | YES | VERIFIED |
| success | YES | YES | VERIFIED |
| orders-list | YES | YES | VERIFIED |
| tracking | YES | YES | VERIFIED |

### 10.4 Verified Screen Files

| Screen File | Status |
|---|---|
| packages/surfaces/src/service-owned/dsh/app-client/awnak/screens/DshAwnakOrderCreateScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/bell/screens/DshClientBellScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/cart/screens/DshCartUnifiedScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/checkout/screens/checkoutTracking.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/checkout/screens/index.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/discovery/screens/DshSearchScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/entry/screens/DshEntryScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/favorites/screens/DshFavoritesListScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/favorites/screens/DshFavoriteToggleScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/home/screens/DshHomeGetScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/loyalty/screens/DshBenefitsHubScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/loyalty/screens/LoyaltyRewardsPage.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/my_space/screens/DshMySpaceCommercialScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/my_space/screens/DshMySpaceOrdersScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/my_space/screens/DshMySpaceScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/notifications/screens/DshNotificationsScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/operations/screens/DshClientOperationScreens.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/patterns/screens/DshOperationScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/shein/screens/DshSheinOrderCreateScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/stores/screens/DshStoreGetScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/stores/screens/DshStoreItemsScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/subscriptions/screens/SubscriptionsHubScreen.tsx | VERIFIED_PRESENT |
| packages/surfaces/src/service-owned/dsh/app-client/subscriptions/screens/SubscriptionsPage.tsx | VERIFIED_PRESENT |

### 10.5 Current Phase Boundary

| Area | Status | Reason |
|---|---|---|
| UI | CLOSED / PASS | App-client gate closed with zero blockers and zero warnings. |
| UX | CLOSED / PASS | App-client flow closure accepted by seal evidence. |
| Flow | CLOSED / PASS | DshRoute and surfaceCatalog parity verified. |
| Binding | TBD | No binding phase evidence is closed yet. |
| Integration | TBD | No integration phase evidence is closed yet. |
| API / Contract | TBD | No API/contract phase evidence is closed yet. |
| Full DSH closure | NOT CLOSED | Only app-client UX/UI/Flow is sealed. |

### 10.6 Guard Results

| Guard | Result |
|---|---|
| legacy placeholder | PASS — none detected |
| no-op interaction | PASS — none detected |
| demoCartItems / demo data blocker | PASS — none detected by closure gate |
| hardcoded KSA context | PASS — none detected |
| forbidden task/tasks naming | PASS — none detected in app-client |
| route/catalog parity | PASS |
| app-client related TypeScript | PASS |

<!-- END APP_CLIENT_VERIFIED_BLUEPRINT -->

<!-- BEGIN DSH_BLUEPRINT_UPDATE_GUARD -->

## 11. Blueprint Update Guard

Status: REQUIRED

This section prevents future agent drift, forgotten closure updates, and noisy duplicate DSH documentation.

| Guard | Requirement |
|---|---|
| Canonical file | packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md |
| Retired docs | docs/services/dsh must not be recreated |
| Before DSH work | Read this file first |
| During DSH work | Do not promote unverified claims |
| After DSH work | Update this file or verify that no update is needed |
| Evidence | Every closed DSH phase must reference an Evidence Pack under tools/registry/runs/{SESSION_ID} |
| UI / UX / Flow | Current verified closure exists for app-client only |
| Binding | Must remain TBD until binding evidence exists |
| Integration | Must remain TBD until integration evidence exists |
| API / Contract | Must remain TBD until contract evidence exists |
| Full DSH closure | Must remain NOT CLOSED until all surfaces and phases pass evidence gates |
| Noise prevention | Do not paste generated screen dumps, stale paths, or future plans as verified truth |

### Required Gate

Run this guard before accepting any DSH closure:

tools/scripts/APPLY_VERIFY_DSH_SERVICE_BLUEPRINT_AGENT_GUARD.ps1

<!-- END DSH_BLUEPRINT_UPDATE_GUARD -->


