# BTHWANI FULL STACK UI-ONLY FINAL CLOSURE PLAN

**Branch:** `feat/dsh-surface-refactor`
**Scope:** live code only. Ignore deleted slices/journey docs.
**Objective:** make BThwani DSH/WLT a real full-stack system, with UI-only surfaces and all shared logic centralized in `dsh/frontend/shared` and `wlt/frontend/dsh/shared`.

---

## 0) Executive verdict

The branch has improved partially, but it is **not closed**, **not UI-only**, and **not 100% full-stack**.

The remaining problem is structural:

```text
DSH app-* and DSH control-panel still contain hooks, adapters, route policies, runtime state, local draft logic, lifecycle logic, and business decisions.

WLT app-* and WLT control-panel still expose or contain finance bindings, contracts, model files, selectors, and runtime adapter names in UI roots.

shared exists, but it is not yet the complete operating brain.
```

The correct closure rule is:

```text
UI roots = UI only.
DSH shared = every DSH non-UI capability.
WLT DSH shared = every WLT finance/read-model/policy/adapter capability.
ui-kit = reusable visual design authority.
```

---

## 1) Current file-volume evidence from the provided file list

The attached path list contains **515 non-empty entries**. The UI-only paths still contain high volume:

| Path | Total entries in provided list | File entries |
|---|---:|---:|
| `dsh/frontend/app-client` | 125 | 113 |
| `dsh/frontend/control-panel` | 194 | 171 |
| `wlt/frontend/dsh/control-panel` | 59 | 50 |
| `dsh/frontend/app-partner` | 38 | 33 |
| `dsh/frontend/app-captain` | 31 | 25 |
| `dsh/frontend/app-field` | 31 | 24 |
| `wlt/frontend/dsh/app-client` | 9 | 8 |
| `wlt/frontend/dsh/app-partner` | 9 | 8 |
| `wlt/frontend/dsh/app-captain` | 8 | 7 |
| `wlt/frontend/dsh/app-field` | 7 | 6 |

High file count is not automatically wrong, but here it is a symptom because many files are named `hooks`, `adapters`, `models`, `selectors`, `contracts`, `storage`, `runtime`, `workflow`, `registry`, `types`, `financeContracts`, and related non-UI responsibilities inside UI roots.

---

## 2) What has improved

### 2.1 DSH shared now has a correct public gateway rule

`dsh/frontend/shared/index.ts` now states that shared is a capability gateway layer and explicitly forbids JSX, ui-kit, and Tamagui in this layer. It also recognizes `@bthwani/ui-kit` as the design authority and WLT finance mutations as WLT-shared-owned.

### 2.2 WLT shared now exists

`wlt/frontend/dsh/shared/index.ts` exists and exports `contracts`, `clients`, `read-models`, `policies`, `adapters`, `view-models`, `formatters`, and `guards`.

### 2.3 Guard scripts now exist

`package.json` now includes these relevant scripts:

```text
guard:ui-only-surfaces
guard:dsh-shared-no-ui
guard:wlt-dsh-ui-only-bindings
guard:ui-only-ownership-matrix
guard:no-broken-imports
guard:bthwani-full-stack
guard:bthwani-full-stack:strict
guard:dsh-shared-ownership
guard:control-panel-sections
guard:full-stack-capability-coverage
```

### 2.4 Full-stack capability map exists

`dsh/frontend/shared/full-stack/bthwani-full-stack-capability.map.ts` defines BThwani full-stack capabilities and binds each capability to backend/OpenAPI/shared/control-panel/mobile/WLT/media/evidence.

---

## 3) What still blocks closure

### 3.1 Capability map itself says several capabilities are not closed

The capability map still marks several core capabilities as `contract-required` or `needs-runtime-evidence`, including:
- `foundation`
- `actor-auth-permissions`
- `catalog-store`
- `media-runtime`
- `cart-checkout`
- `order-lifecycle`
- `captain-delivery`
- `partner-operations`
- `field-readiness`
- `support-escalation`
- `wlt-finance-read-model`
- `notifications`

This means the branch cannot be considered 100% closed.

### 3.2 `app-client` is not UI-only

`DshClientSurface.tsx` still imports and orchestrates:
- runtime stores
- cart state
- store state
- order execution
- marketing state
- bell/notifications state
- home actions
- WLT wallet session
- route and tracking logic
- derived store/category/product builders
- recent-order projection
- large prop bundles into route renderer

This is not UI-only. It is still a surface-level operating controller.

### 3.3 `app-captain` is not UI-only

`DshCaptainSurface.tsx` still contains:
- command route map
- empty order summary model
- generic object reducer
- large object state
- captain availability state
- GPS state
- active order phase
- store-courier stage
- PoD state and media key state
- runtime order client usage
- location push usage
- route history and command routing
- accept/decline/pickup/delivery handlers

This must be moved into shared controllers, state machines, adapters, and view-models.

### 3.4 `app-field` is not UI-only

`DshFieldSurface.tsx` still contains:
- store files state
- route stack
- visit values/errors
- escalation state
- manual store creation
- patchStore
- field runtime binding
- route resolution
- bottom navigation business routing

This should become a shared field-readiness controller/view-model plus a UI-only route shell.

### 3.5 `app-partner` is not UI-only

`DshPartnerSurface.tsx` still contains:
- store scope state
- route history
- support context state
- usePartnerOrdersRuntime
- runtimePartnerProfile
- deliveryOpsSummary
- support route mapping
- operational flow mapping
- many route/action handlers

This must be centralized in shared partner/operations/support view-models and controllers.

### 3.6 WLT app roots are still not purely UI-only

`wlt/frontend/dsh/app-captain/index.ts` exports runtime finance functions directly from shared adapters:

```text
getRecords
getRecordsForSection
getSections
getSnapshot
```

Even if implementation is now in shared, exposing these functions through the UI root keeps the UI root as an adapter gateway. That is not UI-only. App roots should export components/hooks/bindings only.

### 3.7 Control Panel remains too large and mixed

`dsh/frontend/control-panel` contains many section files with names indicating non-UI ownership:
- `*.adapters.ts`
- `*.data.ts`
- `*.model.ts`
- `*.hooks.ts`
- `*.types.ts`
- `*.registry.ts`
- `workflow.ts`
- `flow-meta.ts`
- `banner-target-utils.ts`
- `video-target-utils.ts`
- `taxonomy.hooks.ts`
- `catalogs.category-state.ts`
- `catalogs.filter-products.ts`
- `catalogs.micro-actions.ts`

Most of these should be moved into `dsh/frontend/shared/control-panel`, `shared/contracts`, `shared/adapters`, `shared/view-models`, `shared/policies`, or `shared/state-machines`.

`wlt/frontend/dsh/control-panel` likewise contains:
- `adapters`
- `constants`
- `models`
- `selectors`
- `financeContracts.ts`

These belong in `wlt/frontend/dsh/shared`, except components/screens/styles.

---

## 4) Final architecture target

### 4.1 UI-only roots

These paths must contain only UI, shell, route composition, local visual state, copy, and thin binding:

```text
dsh/frontend/app-captain
dsh/frontend/app-client
dsh/frontend/app-field
dsh/frontend/app-partner
dsh/frontend/control-panel
wlt/frontend/dsh/app-captain
wlt/frontend/dsh/app-client
wlt/frontend/dsh/app-field
wlt/frontend/dsh/app-partner
wlt/frontend/dsh/control-panel
```

Allowed inside UI-only roots:

```text
screens/
parts/
sheets/
components/             only if surface-specific UI
route renderer          rendering only
surface host            thin shell
navigation bridge       route mapping only, no business policy
screen registry         display mapping only
UI copy                 display text only
local visual state      modal/tab/sheet/open/closed/search input
ui-kit components
```

Forbidden inside UI-only roots:

```text
business logic
runtime clients
HTTP/fetch calls
OpenAPI wrappers
state machines
lifecycle rules
policy rules
runtime adapters
data mappers
status maps
next-action maps
finance/payment/refund/settlement/payout/ledger logic
media upload/complete flow
draft runtime storage
fallback/demo/mock/sample/preview runtime
Date.now runtime IDs
silent/no-op catch
large controllers
large hooks
large presenters
large model builders
```

### 4.2 DSH shared target

```text
dsh/frontend/shared/
  full-stack/
  actors/
  runtime/
  api/
  contracts/
  state-machines/
  policies/
  adapters/
  view-models/
  presentation-models/
  control-panel/
  media/
  finance-boundary/
```

### 4.3 WLT DSH shared target

```text
wlt/frontend/dsh/shared/
  contracts/
  clients/
  read-models/
  policies/
  adapters/
  view-models/
  formatters/
  guards/
```

### 4.4 UI Kit authority

Reusable visual components go to:

```text
ui-kit
```

Not to `dsh/frontend/shared` or `wlt/frontend/dsh/shared`.

---

## 5) Mandatory closure methodology

Do not move blindly.

For every file in the UI-only roots and shared roots, produce a record in:

```text
tools/registry/runs/BTHWANI-FULL-STACK-UI-ONLY-FINAL-CLOSURE-YYYYMMDD-HHMMSS/file-ownership-matrix.json
```

Required decision values:

```text
KEEP_UI_ONLY
KEEP_BINDING_ONLY
MOVE_TO_DSH_SHARED
MOVE_TO_WLT_DSH_SHARED
MOVE_TO_UI_KIT
SPLIT_BY_CAPABILITY
MERGE_DUPLICATE
RETIRE_DEAD
KEEP_TYPE_ONLY
```

Required fields:

```json
{
  "path": "",
  "decision": "",
  "current_owner": "",
  "target_owner": "",
  "reason": "",
  "is_ui_only": false,
  "contains_jsx": false,
  "contains_runtime_logic": false,
  "contains_api_logic": false,
  "contains_wlt_logic": false,
  "contains_media_logic": false,
  "contains_state_machine": false,
  "contains_policy": false,
  "contains_data_mapper": false,
  "contains_visual_design": false,
  "consumers": [],
  "imports_out": [],
  "routes": [],
  "screens": [],
  "guards_required": [],
  "safe_to_delete_after_move": false
}
```

---

## 6) Phase A — Stabilize and prove current branch state

### A1. Sync and baseline

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git fetch origin
git checkout feat/dsh-surface-refactor
git status --short
git --no-pager log --oneline origin/main..HEAD
```

### A2. Run basic proof before refactor

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:no-broken-imports
```

### A3. Run current ownership guards

```powershell
pnpm run guard:ui-only-surfaces
pnpm run guard:dsh-shared-no-ui
pnpm run guard:wlt-dsh-ui-only-bindings
pnpm run guard:ui-only-ownership-matrix
```

Expected result now: failures are acceptable as diagnosis, but must be captured as input to cleanup.

---

## 7) Phase B — Make guards strict enough to prevent fake closure

### B1. Strengthen `guard-ui-only-roots-ownership.mjs`

It already scans correct roots. Make it stricter and reduce false positives through structured allowlists.

Must fail for:
- `use*Runtime*` in UI roots
- `use*OrderExecution*` in UI roots
- `use*MarketingState*` in UI roots
- `use*RuntimeStores*` in UI roots
- `usePartnerOrdersRuntime` in UI roots
- `useCaptainOrderRuntime` in UI roots
- `useFieldRuntimeActions` in UI roots
- `createManualFieldStore` in UI roots
- `Date.now` in UI roots
- `mapRuntime*` in UI roots
- `*Adapter*` implementation in UI roots
- `*Policy*` implementation in UI roots
- `*StateMachine*` implementation in UI roots
- `fetch`, `create*Client`, `list*`, `update*`, `submit*`, `upload*`, `complete*`, `request*`, `confirm*`
- Arabic runtime fake markers: `معاينة`, `محاكاة`, `محلي فقط`, `لا يطبق`, `تجريبي`

Allowed:
- UI event handlers that only call shared action props.
- `useState` for visual-only state: sheet/modal/tab/search input.
- type-only imports.
- index exports that only expose UI components.

### B2. Strengthen `guard-dsh-shared-no-ui.mjs`

Must fail inside `dsh/frontend/shared` for:
- `.tsx`
- JSX syntax
- `@bthwani/ui-kit`
- `tamagui`
- `StyleSheet`
- `colorPalette`, `spacing`, `shadowPresets` unless type-only and explicitly allowed
- component names like `Button`, `Card`, `Header`, `Badge`, `Screen`, `Sheet` exported as React components

### B3. Strengthen `guard-wlt-dsh-shared-ownership.mjs`

Must fail inside WLT UI roots for:
- `createWltDshTypedClient`
- ledger mapping
- `getSnapshot` exports
- `getRecords` exports
- `topUp`
- `requestSettlement`
- `formatWltYer`
- `finance.api-matrix`
- `financeContracts`
- `selectors/buildFinancialCenter`
- `selectors/buildTrialBalance`
- finance model definitions outside shared

### B4. Add a file-count/noise guard

Create:

```text
tools/guards/guard-ui-only-file-volume.mjs
```

It should not blindly fail by count, but should fail when UI roots contain non-UI folders:
- `adapters`
- `contracts` except type-only
- `hooks` except visual hooks
- `models`
- `selectors`
- `storage`
- `runtime`
- `data`
- `policies`
- `state-machines`

---

## 8) Phase C — Clean WLT first

Reason: finance boundaries are high-risk and must not remain in UI roots.

### C1. `wlt/frontend/dsh/app-captain`

Current UI root must become:

```text
WltDshCaptainBridge.tsx
WltDshCaptainFinanceSummary.tsx
useWltDshCaptainFinanceSummary.ts
wlt-dsh-captain.ui-copy.ts
wlt-dsh-captain.types.ts       UI props/types only
index.ts                       export UI only
```

Move or remove from app root:
- `getRecords`
- `getRecordsForSection`
- `getSections`
- `getSnapshot`
- finance runtime adapters
- payout calculations
- ledger projections

Target:

```text
wlt/frontend/dsh/shared/adapters/captain-finance-runtime.adapter.ts
wlt/frontend/dsh/shared/read-models/captain-payout-summary.ts
wlt/frontend/dsh/shared/view-models/captain-finance-summary.model.ts
```

### C2. `wlt/frontend/dsh/app-client`

UI root must contain:
- `CustomerWalletScreen.tsx`
- `WltDshClientBridge.tsx`
- `WltDshClientPaymentSelector.tsx`
- `useWltDshWalletSession.ts` only if binding to shared adapter
- UI parts/types/copy only

Move to shared:
- wallet session logic
- payment session logic
- top-up logic
- deep-link/payment projection
- payment method policy
- WLT typed client calls

### C3. `wlt/frontend/dsh/app-partner`

Move to shared:
- settlement transaction mapping
- finance label mapping
- settlement impact logic
- partner wallet summary logic

Keep:
- `PartnerSettlementScreen.tsx`
- `WltDshPartnerBridge.tsx`
- UI parts/types/copy only

### C4. `wlt/frontend/dsh/app-field`

Move to shared:
- field commission snapshot
- ledger projection
- field finance record mapping

Keep:
- `WltDshFieldBridge.tsx`
- `WltDshFieldFinanceSummary.tsx`
- UI binding hook only

### C5. `wlt/frontend/dsh/control-panel`

Move to shared:
- `adapters/finance.api-matrix.ts`
- `adapters/wltDshFinanceRuntime.adapter.ts`
- all `models/*.types.ts`
- `constants/finance.registry.ts`
- `selectors/buildFinancialCenter.ts`
- `selectors/buildTrialBalance.ts`
- `financeContracts.ts`

Keep in control-panel:
- `screens/*.tsx`
- `components/*.tsx`
- `styles/*.css`
- `shared/control-panel-surface.module.css`
- `index.ts`

---

## 9) Phase D — Clean DSH app-client

### D1. Move these folders/files out of `app-client`

Move to `dsh/frontend/shared`:

```text
app-client/adapters/*                     -> shared/adapters/client, shared/adapters/catalog, shared/media
app-client/hooks/useDshClientRuntimeStores -> shared/view-models/client or shared/adapters/client
app-client/hooks/useDshClientCartState     -> shared/view-models/cart
app-client/hooks/useDshClientStoreState    -> shared/view-models/store
app-client/hooks/useDshClientOrderExecution -> shared/adapters/order + shared/view-models/checkout
app-client/hooks/useDshClientMarketingState -> shared/view-models/marketing + shared/adapters/marketing
app-client/hooks/useDshClientBellState     -> shared/adapters/notifications + shared/view-models/notifications
app-client/hooks/useDshOrderTracking       -> shared/state-machines/order-lifecycle + shared/view-models/tracking
app-client/hooks/useDshClientHomeCategories -> shared/view-models/home
app-client/presenters/dshClientCheckoutPresenter.ts -> shared/view-models/checkout
```

### D2. Keep only UI hooks in app-client

Allowed in app-client hooks:
- debounce
- image viewer sheet open/close
- search input local state
- measurement sheet visual state
- gesture handlers only if pure UI and no runtime effect

If a hook depends on API, runtime, cart, checkout, order, marketing, notification, WLT, media, or store state, move it to shared.

### D3. Surface target

`DshClientSurface.tsx` must only:
- mount providers
- call `useDshClientSurfaceModel` from shared
- pass `{ model, actions }` to renderer
- render bottom nav

Target shape:

```tsx
function DshClientSurfaceInner(props) {
  const surface = useDshClientSurfaceModel(props);
  return <DshClientShell model={surface.model} actions={surface.actions} />;
}
```

### D4. Renderer target

`DshClientRouteRenderer.tsx` must only choose screen:

```tsx
switch (model.route.kind) {
  case 'home': return <HomeScreen {...model.home} />;
}
```

No calculations, no WLT, no API, no fallback IDs.

### D5. Screen target

Screens keep UI design but receive props from shared model.

Do not change design.

---

## 10) Phase E — Clean DSH app-captain

### E1. Move from `DshCaptainSurface.tsx`

Move to shared:

```text
getRouteForCommandTarget       -> shared/policies/captain-route-policy
EMPTY_ORDER_SUMMARY            -> shared/view-models/captain
useObjectState if non-UI       -> shared/runtime/ui-state only if reusable, otherwise keep if visual-only
CAPTAIN_BOTTOM_NAV_ROUTES      -> app UI only if purely navigation
CaptainAvailabilityStatus      -> shared/view-models/captain
CaptainGpsStatus               -> shared/view-models/captain
ActiveOrderPhase               -> shared/state-machines/delivery-lifecycle
CaptainAppMode                 -> shared/policies/captain
StoreCourierStage              -> shared/state-machines/delivery-lifecycle
DshCaptainPodState             -> shared/media/pod
useCaptainOrderRuntime calls   -> shared/adapters/captain
useCaptainActiveLocationPush   -> shared/adapters/captain/location
PoD state/media key handling   -> shared/media/pod
accept/decline/pickup/deliver handlers -> shared/adapters/captain/actions
```

### E2. Keep in app-captain

```text
screens/
parts/
sheets/
DshCaptainSurface.tsx as shell
DshCaptainRouteRenderer if created
visual-only BottomNav
visual-only map layer
visual-only chat bubble
```

### E3. Split current surface

Current file should become:
- `DshCaptainSurface.tsx` shell
- `DshCaptainRouteRenderer.tsx` UI switch
- shared `useDshCaptainSurfaceModel`
- shared `useDshCaptainSurfaceActions`

---

## 11) Phase F — Clean DSH app-field

### F1. Move to shared

```text
route resolver                  -> shared/policies/field-route-policy
stores state                    -> shared/view-models/field
visitValues/visitErrors         -> shared/view-models/field-visit
selected escalation state       -> shared/state-machines/field-readiness
createManualFieldStore          -> shared/adapters/field/draft-store, but not as runtime truth
patchStore                      -> shared field model updater
useFieldRuntimeActions usage    -> shared/adapters/field
document upload flow            -> shared/media/field-documents
offline queue policy            -> shared/policies/offline-draft
```

### F2. Keep in app-field

```text
screens/
parts/
sections/ if UI only
DshFieldSurface.tsx shell
DshFieldRouteContent.tsx UI only if no business logic
BottomNav
```

### F3. Hard rule

No local store creation as runtime truth inside UI root.

If local drafts remain, they must be named explicitly:
- `draftLocalId`
- `syncStatus`
- `source: 'local-draft' | 'backend'`

And the logic belongs to shared.

---

## 12) Phase G — Clean DSH app-partner

### G1. Move to shared

```text
storeScopeOptions                 -> shared/view-models/partner if business scope
defaultServiceModes               -> shared/policies/fulfillment
defaultSupportCommandContext      -> shared/contracts/support
buildSupportCommandContext*       -> shared/adapters/support
support route/flow mapping        -> shared/policies/partner-support
runtimePartnerProfile             -> shared/view-models/partner-profile
deliveryOpsSummary                -> shared/view-models/partner-operations
getActionableHandoffsForSurface   -> already shared, keep there
usePartnerOrdersRuntime usage     -> shared/adapters/partner
route history if more than UI      -> shared route controller or keep only visual
```

### G2. Keep in app-partner

```text
screens/
parts/
sheets/
DshPartnerSurface.tsx shell
DshPartnerRouteRenderer.tsx UI switch
BottomNav
StoreScopeSheet if only UI
```

### G3. Target

`DshPartnerSurface.tsx` calls:

```text
useDshPartnerSurfaceModel()
useDshPartnerSurfaceActions()
```

and renders UI.

---

## 13) Phase H — Clean DSH control-panel

The current sections remain. Do not rename top-level sections.

### H1. Dashboard

Move:
- closure status models
- evidence status logic
- capability status summaries

To:
```text
shared/view-models/control-panel/dashboard
shared/full-stack
```

Keep:
- `ControlPanelDshClosureDashboardScreen.tsx` UI

### H2. Operations

Move:
- `operations.registry.ts`
- `operations.types.ts`
- `geo-heatmap.helpers.ts`
- flow meta
- order detail model
- dispatch/SLA/escalation models

To:
```text
shared/contracts/operations
shared/adapters/operations
shared/view-models/control-panel/operations
shared/state-machines/order-lifecycle
```

Keep screens/components only.

### H3. Catalogs

Move:
- `catalogs.adapters.ts`
- `catalogs.data.ts`
- `catalogs.model.ts`
- `catalogs.category-state.ts`
- `catalogs.filter-products.ts`
- `catalogs.micro-actions.ts`
- taxonomy hooks/models
- product table model logic
- publication readiness model
- media governance logic

To:
```text
shared/contracts/catalog
shared/adapters/catalog
shared/view-models/control-panel/catalogs
shared/state-machines/catalog-publication
shared/media/catalog
```

Keep screens/drawers/components only.

### H4. Marketing

Move:
- `banner-target-utils.ts`
- `video-target-utils.ts`
- `banner-types.ts`
- `video-types.ts`
- `flow-meta.ts`
- `marketing-permissions.contract.ts`
- `section-catalog.ts`
- `section-meta.ts`
- media review models

To:
```text
shared/contracts/marketing
shared/adapters/marketing
shared/view-models/control-panel/marketing
shared/media/marketing
shared/policies/permissions
```

Keep visual screens/editors/viewers.

### H5. Partners

Move:
- `workflow.ts`
- `partners.types.ts`
- partner readiness flow models
- activation/deactivation logic
- field handoff logic

To:
```text
shared/contracts/partner
shared/state-machines/partner-readiness
shared/state-machines/field-readiness
shared/view-models/control-panel/partners
```

Keep workspace UI.

### H6. Platform

Move:
- vars model
- provider/service/rollout policies
- audit state logic

To:
```text
shared/runtime/platform-vars
shared/policies/platform
shared/view-models/control-panel/platform
```

Keep workspace UI only.

Platform must not locally apply runtime changes unless backed by API.

### H7. Support

Move:
- `support.types.ts`
- ticket models
- escalation logic
- audit trail model
- messaging workspace models

To:
```text
shared/contracts/support
shared/state-machines/support-escalation
shared/adapters/support
shared/view-models/control-panel/support
```

Keep UI screens.

### H8. Administration

Move:
- `administration.types.ts`
- permission model

To:
```text
shared/policies/permissions
shared/view-models/control-panel/administration
```

Keep screen UI.

### H9. HR

Keep read-only/blocked UI until backend HR is real.

Move types/policies if any to shared.

---

## 14) Phase I — Fix backend/frontend consistency

From now on, cleanup must include backend and OpenAPI when relevant.

### I1. Backend endpoints required

Check actual backend/OpenAPI coverage for:
- notifications
- platform vars
- products/catalog
- media
- checkout/WLT bridge
- order lifecycle
- captain assignment/actions
- field store onboarding/documents
- support tickets/escalations

### I2. OpenAPI placement

DSH generated OpenAPI types must be owned by:

```text
dsh/frontend/shared/api
```

or:

```text
dsh/frontend/shared/contracts/openapi
```

Not by app-client.

### I3. WLT OpenAPI placement

WLT generated OpenAPI types must be owned by:

```text
wlt/frontend/dsh/shared/contracts
```

or WLT shared clients.

### I4. No UI fetch

All UI roots must call shared actions/models only.

---

## 15) Phase J — Media runtime centralization

All media flows go to:

```text
dsh/frontend/shared/media
```

Must cover:
- catalog product/store media
- marketing banners/videos
- captain PoD
- field documents
- field visit evidence
- support attachments
- partner product media
- client product/store rendering

Forbidden in UI roots:
- base64 placeholder
- manual media key as source of truth
- fake storage key
- local uri as persisted runtime truth
- upload/complete logic

---

## 16) Phase K — Delete / Merge / Split policy

### Delete

Delete files only when:
- no imports
- no exports
- no route references
- no screen registry references
- no tests
- no guard references
- no OpenAPI/generated references

### Merge

Merge:
- one-line compatibility exports
- duplicated `OperationScreen`
- duplicated helper wrappers
- duplicated type aliases
- duplicated UI copy files if surface-specific copy can be consolidated
- one-purpose wrappers that no longer add UI value

### Split

Split:
- `DshClientSurface.tsx`
- `DshCaptainSurface.tsx`
- `DshFieldSurface.tsx`
- `DshPartnerSurface.tsx`
- large control-panel sections
- large cart screen if it contains non-UI logic

### Move to UI Kit

Move only reusable visual components:
- generic metric card
- generic state card
- generic status badge
- generic timeline
- generic finance summary card
- generic section header

Do not move business or DSH/WLT-specific logic to UI Kit.

---

## 17) Target file structure after cleanup

### DSH app-client

```text
app-client/
  screens/
  parts/
  sheets/
  DshClientSurface.tsx
  DshClientRouteRenderer.tsx
  DshClientBottomNav.tsx
  dsh-client.routes.ts
  dsh-client.types.ts
  index.ts
```

No `adapters`, no runtime `hooks`, no business `presenters`.

### DSH app-captain

```text
app-captain/
  screens/
  parts/
  sheets/
  DshCaptainSurface.tsx
  DshCaptainRouteRenderer.tsx
  dsh-captain.routes.ts
  dsh-captain.types.ts
  index.ts
```

No runtime adapters/state machines.

### DSH app-field

```text
app-field/
  screens/
  parts/
  sections/
  DshFieldSurface.tsx
  DshFieldRouteRenderer.tsx
  dsh-field.routes.ts
  dsh-field.types.ts
  index.ts
```

No storage, no runtime state engine.

### DSH app-partner

```text
app-partner/
  screens/
  parts/
  sheets/
  DshPartnerSurface.tsx
  DshPartnerRouteRenderer.tsx
  dsh-partner.routes.ts
  dsh-partner.types.ts
  index.ts
```

No runtime profile/summary/adapters.

### DSH control-panel

```text
control-panel/
  dashboard/
  operations/
  support/
  finance/
  catalogs/
  partners/
  marketing/
  platform/
  administration/
  hr/
  shared/               visual-only workspace frame only
  DshControlPanelSurfaceHost.tsx
  surface-catalog.ts
  surface-meta.ts
  index.ts
```

No data/adapters/models/selectors/policies in section roots unless UI-only.

### WLT app roots

```text
wlt/frontend/dsh/app-client/
  CustomerWalletScreen.tsx
  WltDshClientBridge.tsx
  WltDshClientPaymentSelector.tsx
  useWltDshWalletSession.ts
  *.types.ts
  *.ui-copy.ts
  index.ts
```

Similar for captain/partner/field.

No finance runtime logic.

### WLT control-panel

```text
wlt/frontend/dsh/control-panel/
  components/
  screens/
  styles/
  shared/ visual-only
  index.ts
```

No models/adapters/constants/selectors/contracts.

---

## 18) Verification commands

Run after every phase:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check

pnpm -w exec tsc --noEmit

pnpm run guard:no-broken-imports
pnpm run guard:ui-only-surfaces
pnpm run guard:dsh-shared-no-ui
pnpm run guard:wlt-dsh-ui-only-bindings
pnpm run guard:ui-only-ownership-matrix
pnpm run guard:bthwani-full-stack:strict
pnpm run guard:dsh-zero-gap-runtime-boundaries
pnpm run guard:dsh-surface-structure
pnpm run guard:real-media-runtime
pnpm run guard:depcruise:live-boundaries
pnpm run guard:jscpd:live
pnpm run guard:platform-vars
pnpm run guard:ui-kit-central-design-ownership
pnpm run guard:tamagui-import-boundary
pnpm run guard:binding-proof
```

If backend changes:

```powershell
go test ./...
```

If Docker/runtime changes:

```powershell
docker compose -f .\docker-compose.local.yml config
```

---

## 19) Evidence outputs

Write:

```text
file-ownership-matrix.json
moved-files-report.json
retired-files-report.json
merged-files-report.json
split-files-report.json
ui-only-guard-results.json
shared-no-ui-guard-results.json
wlt-shared-ownership-results.json
typecheck.log
final-decision.md
```

`final-decision.md` must say one of:

```text
UI_ONLY_FULL_STACK_CLEANED_WITH_EVIDENCE
HARD_BLOCKED_EXTERNAL_ONLY
```

Do not use:
- `PASS_WITH_WARNINGS`
- `REPORT_ONLY`
- `DEFERRED`
- `FIX_REQUIRED_WITH_EXACT_PATHS`
- `CLOSED_WITHOUT_RUNTIME`
- `CLOSED_WITHOUT_VISUAL`

---

## 20) Exact execution order for the next agent

1. Run existing guards and capture failures.
2. Generate file ownership matrix.
3. Strengthen guards to fail on current non-UI ownership leaks.
4. Move WLT control-panel models/adapters/selectors/contracts to WLT shared.
5. Convert WLT app roots to UI bindings only.
6. Move DSH app-client adapters/hooks/presenters to DSH shared.
7. Move DSH app-captain lifecycle/GPS/PoD/action handlers to DSH shared.
8. Move DSH app-field draft/readiness/document/visit runtime to DSH shared.
9. Move DSH app-partner scope/support/order summary logic to DSH shared.
10. Move DSH control-panel non-UI section logic to DSH shared.
11. Relocate generated OpenAPI types to shared ownership.
12. Centralize media runtime in DSH shared.
13. Delete dead files after proof.
14. Merge wrappers and duplicates.
15. Split large surface files into UI shell + shared model/actions.
16. Run TypeScript and all guards.
17. Run runtime/visual evidence for touched screens.
18. Write final evidence reports.

---

## 21) Acceptance criteria

Closure is accepted only when:

1. UI-only roots contain no runtime adapters, business logic, state machines, policies, API clients, WLT logic, media flow, or hidden fallback.
2. `dsh/frontend/shared` contains all DSH non-UI logic and no UI code.
3. `wlt/frontend/dsh/shared` contains all WLT finance/read-model/policy/adapter logic.
4. Control Panel sections remain visually intact and use shared models/actions.
5. Current UI design remains intact.
6. `@bthwani/ui-kit` remains the only reusable design system.
7. No cross-surface imports.
8. No WLT app/control-panel non-UI logic.
9. No duplicate lifecycle/status/action maps.
10. No local runtime truth inside UI roots.
11. No dead wrappers.
12. TypeScript passes.
13. Full-stack guards pass.
14. Runtime/visual evidence exists for touched UI.
15. Backend/OpenAPI are consistent with frontend bindings.

---

## 22) Final instruction to execution agent

Do not produce another report-only pass.

Perform actual:
- move
- rename
- merge
- delete
- split
- import rewrite
- guard strengthening
- typecheck
- evidence

Every touched file must have an ownership decision.

Every non-UI file in UI roots must be moved, merged, or deleted.

Every UI root must become a thin rendering/binding layer.

Every reusable visual component must remain in or move to ui-kit.

Every DSH non-UI capability must live under `dsh/frontend/shared`.

Every WLT/DSH finance capability must live under `wlt/frontend/dsh/shared`.
