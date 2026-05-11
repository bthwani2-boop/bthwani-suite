# DSH Client App Scope Standardization R2 Status

## Control Path

- Control folder: `tools/plan/dsh`
- Scope root: `dsh/frontend/app-client`
- WLT bridge root: `wlt/frontend/app-client/dsh`

## Completed Slices

- Introduced `DshClientSurface` as the canonical app-client-facing boundary while preserving `DshSurfaceHost` runtime compatibility.
- Added passive route and screen registries for the DSH client surface.
- Added `PreferencesScreen` and wired it from `DshMySpaceScreen` through the live host route flow.
- Replaced DSH cart deep WLT imports with the public WLT bridge index.
- Created canonical `screens/`, `parts/`, `data/`, and `shared/` entrypoints and switched the live DSH host to consume them.
- Created canonical WLT DSH bridge files at the root of `wlt/frontend/app-client/dsh` and kept legacy files as compatibility internals.
- Updated ownership metadata so DSH cart can explicitly declare WLT integration through `linkedServiceId: 'wlt'`.
- Reduced `dsh/frontend/app-client/builders.ts` to a compatibility wrapper and moved the live store-builder logic to `dsh/frontend/app-client/shared/store-builders.ts`.
- Reduced `dsh/frontend/app-client/resolve-image-source.ts` to a compatibility wrapper and moved the live image-source resolution logic to `dsh/frontend/app-client/shared/resolve-image-source.ts`.
- Reduced `dsh/frontend/app-client/resolveDevMediaUrl.ts` to a compatibility wrapper and moved the live media-base resolution logic to `dsh/frontend/app-client/shared/resolve-dev-media-url.ts`.
- Reduced `dsh/frontend/app-client/getDshCategoryIconUrl.ts` to a compatibility wrapper and moved the live category-icon resolution logic to `dsh/frontend/app-client/shared/get-dsh-category-icon-url.ts`.
- Reduced `dsh/frontend/app-client/mapMenuItemToProductCard.ts` to a compatibility wrapper and moved the live product-card mapper logic to `dsh/frontend/app-client/shared/map-menu-item-to-product-card.ts`.
- Reduced `dsh/frontend/app-client/store-profile.ts` to a compatibility wrapper and moved the live store-profile formatting helpers to `dsh/frontend/app-client/shared/store-profile.ts`.
- Reduced `dsh/frontend/app-client/dshStoreFixtures.ts` to a compatibility wrapper and moved the live store preview-data exports to `dsh/frontend/app-client/data/store.preview-data.ts`.
- Reduced `dsh/frontend/app-client/dshCategoriesFixtures.ts` to a compatibility wrapper and moved the live category preview-data exports to `dsh/frontend/app-client/data/categories.preview-data.ts`.
- Reduced `dsh/frontend/app-client/dshHomeGetFixtures.ts` to a compatibility wrapper and moved the live home preview-data exports to `dsh/frontend/app-client/data/home.preview-data.ts`.
- Reduced `dsh/frontend/app-client/discoveryFixtures.ts` to a compatibility wrapper and moved the live discovery preview-data exports to `dsh/frontend/app-client/data/discovery.preview-data.ts`.
- Reduced `dsh/frontend/app-client/itemsFixtures.ts` to a compatibility wrapper and moved the live items preview-data exports to `dsh/frontend/app-client/data/items.preview-data.ts`.
- Reduced `dsh/frontend/app-client/client-state.preview-data.ts` to a compatibility wrapper and moved the live client-state preview exports to `dsh/frontend/app-client/data/client-state.preview-data.ts`.
- Reduced `dsh/frontend/app-client/surface-meta.ts` to a compatibility wrapper and moved the live surface metadata export to `dsh/frontend/app-client/data/surface-meta.preview-data.ts`.
- Reduced `dsh/frontend/app-client/surface-catalog.ts` to a compatibility wrapper and moved the live surface catalog export to `dsh/frontend/app-client/data/surface-catalog.preview-data.ts`.
- Reduced `dsh/frontend/app-client/dshNotificationsFixtures.ts` to a compatibility wrapper and moved the live notifications preview-data exports to `dsh/frontend/app-client/data/notifications.preview-data.ts`.
- Reduced `dsh/frontend/app-client/subscriptionsCommercialDeck.ts` to a compatibility wrapper and moved the live subscriptions commercial preview exports to `dsh/frontend/app-client/data/subscriptions-commercial.preview-data.ts`.
- Reduced `dsh/frontend/app-client/loyaltyCommercialDeck.ts` to a compatibility wrapper and moved the live loyalty commercial preview exports to `dsh/frontend/app-client/data/loyalty-commercial.preview-data.ts`.
- Reduced `dsh/frontend/app-client/dshMySpaceOrdersFixture.ts` to a compatibility wrapper and moved the live my-space orders preview exports to `dsh/frontend/app-client/data/my-space-orders.preview-data.ts`.
- Reduced `dsh/frontend/app-client/DshCartDetails.tsx` to a compatibility wrapper, moved the live cart-details part to `dsh/frontend/app-client/parts/CartDetails.tsx`, and retargeted the live cart screen to the canonical part path.
- Reduced `dsh/frontend/app-client/DshHomeApprovedVideoReelsViewer.tsx` to a compatibility wrapper and moved the live approved-video viewer part to `dsh/frontend/app-client/parts/ApprovedVideoReelsViewer.tsx`.
- Reduced `dsh/frontend/app-client/DshOperationScreen.tsx` to a compatibility wrapper and moved the live operation-screen part to `dsh/frontend/app-client/parts/OperationScreen.tsx`.
- Reduced `dsh/frontend/app-client/dshClientBinding.contracts.ts` to a compatibility wrapper and moved the live client binding contracts to `dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts`.
- Reduced `dsh/frontend/app-client/DshLoyaltyRewardsScreen.tsx` to a compatibility wrapper and moved the live loyalty rewards UI to `dsh/frontend/app-client/parts/LoyaltyRewardsScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshSubscriptionsScreen.tsx` to a compatibility wrapper and moved the live subscriptions UI to `dsh/frontend/app-client/parts/SubscriptionsScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshMySpaceCommercialScreen.tsx` to a compatibility wrapper and moved the live my-space commercial UI to `dsh/frontend/app-client/parts/MySpaceCommercialScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshMySpaceOrdersScreen.tsx` to a compatibility wrapper and moved the live my-space orders UI to `dsh/frontend/app-client/parts/MySpaceOrdersScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshNotificationsScreen.tsx` to a compatibility wrapper and moved the live notifications screen UI to `dsh/frontend/app-client/screens/NotificationsScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshEntryScreen.tsx` to a compatibility wrapper and moved the live entry screen UI to `dsh/frontend/app-client/screens/EntryScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshSearchScreen.tsx` to a compatibility wrapper and moved the live search screen UI to `dsh/frontend/app-client/screens/SearchScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshFavoriteToggleScreen.tsx` to a compatibility wrapper and moved the live favorite-toggle UI to `dsh/frontend/app-client/screens/FavoriteToggleScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshFavoritesListScreen.tsx` to a compatibility wrapper and moved the live favorites-list UI to `dsh/frontend/app-client/screens/FavoritesScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshClientBellScreen.tsx` to a compatibility wrapper and moved the live bell screen UI to `dsh/frontend/app-client/screens/BellScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshHomeGetScreen.tsx` to a compatibility wrapper and moved the live home screen UI to `dsh/frontend/app-client/screens/HomeScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshStoreGetScreen.tsx` to a compatibility wrapper and moved the live store screen UI to `dsh/frontend/app-client/screens/StoreScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshStoreItemsScreen.tsx` to a compatibility wrapper and moved the live store-items screen UI to `dsh/frontend/app-client/screens/StoreItemsScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshAwnakOrderCreateScreen.tsx` to a compatibility wrapper and moved the live embedded Awnak order-create UI to `dsh/frontend/app-client/parts/AwnakOrderCreateScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshSheinOrderCreateScreen.tsx` to a compatibility wrapper and moved the live embedded SHEIN order-create UI to `dsh/frontend/app-client/parts/SheinOrderCreateScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshMySpaceScreen.tsx` to a compatibility wrapper and moved the live my-space screen UI to `dsh/frontend/app-client/screens/MySpaceScreen.tsx`.
- Reduced `dsh/frontend/app-client/SubscriptionsHubScreen.tsx` to a compatibility wrapper and moved the live benefits hub UI to `dsh/frontend/app-client/screens/BenefitsScreen.tsx`.
- Reduced `dsh/frontend/app-client/DshCartUnifiedScreen.tsx` to a compatibility wrapper and moved the live cart unified UI to `dsh/frontend/app-client/screens/CartScreen.tsx`.
- Reduced `dsh/frontend/app-client/checkoutTracking.tsx` to a compatibility wrapper and moved the live orders/tracking screens UI to `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx`.
- Reduced `dsh/frontend/app-client/DshClientOperationScreens.tsx` to a compatibility wrapper and moved the live client-operation screens UI to `dsh/frontend/app-client/screens/OperationScreens.tsx`.
- Reclassified `dsh/frontend/app-client/types.ts` as a compatibility type bridge over the canonical shared store product-card model in `dsh/frontend/shared/dshStoreProductCardModel`.
- Reduced `dsh/frontend/app-client/dshStoreTypes.ts` to a compatibility type wrapper over the canonical store item type exported from `dsh/frontend/app-client/types.ts`.
- Removed the legacy WLT compatibility wrappers after migrating the internal consumers to canonical bridge files.
- Kept the live wallet-link, wallet-balance, payment-option, payment-options-row, preview hook, and wallet adapter logic on `wlt/frontend/app-client/dsh/WltDshConnectorPanel.tsx`, `WltDshBalancePreview.tsx`, `WltDshPaymentOption.tsx`, `WltDshPaymentOptionsRow.tsx`, `useWltDshWalletPreview.ts`, and `wlt-dsh-client.adapter.ts`.
- Expanded `dsh-client-final-classification.csv` to cover the full closure scope, including internal runtime sources, shared support, app-client shell/composition, finance support, and DSH docs/blueprint files.
- Removed forbidden `export *` usage from `wlt/frontend/shared/finance/index.ts`.
- Captured runtime evidence with `CONTROL_PANEL_ROUTES=PASS` on port `3000` and `APP_CLIENT_ADB=PASS` in the active evidence pack.

## Current Live Canonical Paths

- `dsh/frontend/app-client/DshClientSurface.tsx`
- `dsh/frontend/app-client/dsh-client.routes.ts`
- `dsh/frontend/app-client/dsh-client.screen-registry.ts`
- `dsh/frontend/app-client/screens/*`
- `dsh/frontend/app-client/parts/*`
- `dsh/frontend/app-client/data/*`
- `dsh/frontend/app-client/shared/*`
- `wlt/frontend/app-client/dsh/index.ts`
- `wlt/frontend/app-client/dsh/useWltDshWalletPreview.ts`
- `wlt/frontend/app-client/dsh/wlt-dsh-client.adapter.ts`
- `wlt/frontend/app-client/dsh/WltDshClientBridge.tsx`
- `wlt/frontend/app-client/dsh/wlt-dsh-client.parts.tsx`

## Remaining Slices

- None. Refresh the evidence pack only if this closure scope changes again.

## Latest Static Validation

- `git --no-pager diff --check`: pass
- `pnpm -w exec tsc --noEmit`: pass
- Scoped `rg` static gate for `core`, `export *`, `any/as any`, and cross-app deep imports: pass

## Evidence Pack

- `tools/registry/runs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2-a56985ba/`

## Runtime Evidence

- `control-panel-route-smoke.csv`
- `adb-devices.txt`
- `app-client-adb-logcat.txt`

## Notes

- Windows line-ending normalization was required for `getDshCategoryIconUrl.ts` after `git diff --check` flagged a false-looking trailing-whitespace issue.
- The current strategy remains additive and compatibility-first: canonical wrappers are live, while deeper file relocation is deferred until it provides a concrete win.
