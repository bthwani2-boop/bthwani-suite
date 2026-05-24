# DSH File Size and Complexity Risk Matrix

Status: DECOMPOSITION_PLAN_READY
Decision: DECOMPOSITION_PLAN_READY

## DSH-SLICE-001 Safe Decomposition Plan

Both `HomeScreen.tsx` (2180 lines) and `StoreScreen.tsx` (2343 lines) are currently "God Objects". Before any Typed Client or OpenAPI binding can happen, these screens must be structurally decomposed following a strict, zero-behavior-change execution plan.

### Owner Map

| Folder | Ownership Rule |
|---|---|
| `contracts/` | Only contract/binding boundary types (e.g. interfaces, DTO shapes). No UI, no state. |
| `data/` | Only preview fixtures and hardcoded mock arrays. No state, no UI, no framework logic. |
| `parts/` | App-specific, domain-bound UI sections (e.g., Hero, Feed, Carousel). Not generic components. |
| `screens/` | Thin entry shells. Will eventually only hold the screen layout and wire up parts/hooks. |
| `shared/` | Non-UI mappers, formatting helpers, and search algorithms. No UI framework imports allowed. |
| `sheets/` | Modals and Bottom Sheets (e.g., measurement picker, info sheet, filter sheet). |

### No Duplication with Existing Logic

| Existing Central Logic | Rule |
|---|---|
| `dsh/frontend/shared/dsh-client-visibility.model.ts` | Do not duplicate client visibility, serviceability, or preview gating. Use the existing model. |
| `dsh/frontend/shared/` existing formatting | If measurement or currency formatting exists centrally, reuse it. Do not create new copies in `app-client/shared/` unless strictly isolated to discovery. |

### Reuse Existing Before Creating New

| Category | Rule |
|---|---|
| **Design System** | Do not migrate or create design-system logic in `app-client`. Use `@bthwani/ui-kit`. |
| **Icons & Tokens** | Use existing icons and tokens. Do not introduce new SVG assets or random colors. |
| **State Models** | If a centralized state model exists for cart or store, do not rebuild it locally. |

### Exact Extraction Units: HomeScreen

| Unit Type | Current Location | Target Extraction Unit |
|---|---|---|
| Thin Shell | `HomeScreen.tsx` | `screens/HomeScreen.tsx` |
| UI Parts | `HomeScreen.tsx` | `parts/home/HomeHeader.tsx`, `parts/home/HomeCategoryCarousel.tsx`, `parts/home/HomeStoreFeed.tsx`, `parts/home/HomeInlineSearch.tsx` |
| Helpers | `HomeScreen.tsx` | `shared/home-search-helpers.ts`, `shared/home-visibility-mappers.ts` (if not in central model) |
| Fixtures | `HomeScreen.tsx` | `data/home-preview-fixtures.ts` |
| Types | `HomeScreen.tsx` | `contracts/dsh-home-types.ts` |
| Sheets | `HomeScreen.tsx` | `sheets/HomeFilterSheet.tsx` |

**Do Not Move:**
- Do not move global app providers or central navigation configuration.
- Do not move `dsh-client-visibility.model.ts` logic into `HomeScreen`.

### Exact Extraction Units: StoreScreen

| Unit Type | Current Location | Target Extraction Unit |
|---|---|---|
| Thin Shell | `StoreScreen.tsx` | `screens/StoreScreen.tsx` |
| UI Parts | `StoreScreen.tsx` | `parts/store/StoreHero.tsx`, `parts/store/StoreInfoSection.tsx`, `parts/store/StoreCatalogFeed.tsx`, `parts/store/StoreInlineSearch.tsx` |
| Helpers | `StoreScreen.tsx` | `shared/store-search-helpers.ts`, `shared/store-formatting.ts` |
| Fixtures | `StoreScreen.tsx` | `data/store-preview-fixtures.ts` |
| Types | `StoreScreen.tsx` | `contracts/dsh-store-types.ts` |
| Sheets | `StoreScreen.tsx` | `sheets/StoreMeasurementSheet.tsx`, `sheets/StoreInfoSheet.tsx`, `sheets/StoreCartSheet.tsx` |

**Do Not Move:**
- Do not extract global cart logic or fulfillment ownership. Reuse central mechanisms if they exist, or defer.
- Do not extract UI elements that belong in the global `ui-kit`.

### Safe Execution Batches

| Batch | Action | Constraint |
|---|---|---|
| **Batch 0** | No-code inventory / owner map | Verify existing central models and ui-kit before touching code. |
| **Batch 1** | Extract pure types | Move interfaces to `contracts/`. No functional changes. |
| **Batch 2** | Extract pure helpers/mappers | Move formatting/search to `shared/`. No UI imports. |
| **Batch 3** | Extract preview fixtures | Move hardcoded arrays to `data/` only if inside the screen. |
| **Batch 4** | Extract UI parts | Extract small visual sections to `parts/` without changing props. |
| **Batch 5** | Extract state hooks | Move local state to `useHomeState.ts`/`useStoreState.ts` after parts stabilize. |
| **Batch 6** | Thin screen shell | Assemble the thin `screens/HomeScreen.tsx` and `screens/StoreScreen.tsx`. |
| **Batch 7** | Visual regression + gates | Run tests, guard scripts, and verify zero UI differences. |
| **Batch 8** | API Binding | Only after Batch 7 passes can Typed Client/OpenAPI binding begin. |

### Forbidden Moves

- **NO generic `components/`**: Leads to "dumping ground" folders. Use `parts/` or `sheets/`.
- **NO Tamagui imports in data/shared**: UI framework is restricted to `.tsx` UI components.
- **NO UI changes**: This is purely structural. Do not change colors, sizes, or behavior.
- **NO endpoint edits**: `dsh.openapi.yaml` is locked for this decomposition phase.
- **NO routing changes**: Do not add or remove navigation routes. Search stays inline.
- **NO Typed Client binding yet**: We decompose first, bind later.
- **NO Backend/DB/Go**: This is strictly frontend decomposition.
- **NO WLT/cart/checkout/payment mutation**: Only structural refactoring of the discovery view.
- **NO new ui-kit files**: Do not add to `@bthwani/ui-kit`.

### Acceptance Criteria

- No UI change.
- No route change.
- No behavior change.
- No duplicate owners (rely on central visibility/serviceability/measurement).
- No generic `components/` folders.
- No new `ui-kit` files.
- No binding before decomposition closure.
- No backend/Go/DB touches.
- `HomeScreen` and `StoreScreen` become progressively smaller (not strictly required to be under 300 lines in the first batch, but shrinking).
- Each batch is reviewable and rollback-safe.

### Batch 0 Inventory Result

- **Home type candidates:** `DshHomeGetScreenProps`, `DshHomeCategory`, `DshHomeBannerActionType`, `DiscoveryFilter`, `StorePagerPage`, `DshHomeGetPromo`, `DshHomeGetStore`, `DshHomeRecentOrder`, `DshServiceId`.
- **Store type candidates:** `DshStoreGetScreenProps`, `DshStoreOperationalState`, `DshStoreGetScreenContentProps`.
- **Existing contract reuse decision:** `dsh-client-binding.contracts.ts` is strictly for global client logic. Screen-specific discovery contracts belong in their own boundaries to prevent a dumping ground. We will create `contracts/dsh-home-types.ts` and `contracts/dsh-store-types.ts` as defined in the Matrix.
- **Files planned for Batch 1:** `contracts/dsh-home-types.ts`, `contracts/dsh-store-types.ts`, `HomeScreen.tsx`, `StoreScreen.tsx`.
- **No-duplicate confirmation:** Validated. No central models are duplicated.

### Batch 1 Cleanup Result

- **Types kept in contracts:** DshServiceId, DshHomeBannerActionType, DiscoveryFilter, DshHomeCategory, DshHomeGetPromo, DshHomeGetStore, DshHomeRecentOrder, StorePagerPage, DshStoreOperationalState.
- **Types returned to screens temporarily:** DshHomeGetScreenProps, DshStoreGetScreenProps, DshStoreGetScreenContentProps (due to UI/React dependencies).
- **Purity confirmation:** Validated. No React, @bthwani/ui-kit, or parts imports exist in contracts/.
- **Final Decision:** BATCH_1_TYPES_EXTRACTED_READY_FOR_BATCH_2

### Batch 2 Helper/Mapper Extraction Result

- **Helpers extracted:** `home-promo-mappers.ts` (`normalizeHomePromoActionType`, `resolveHomePromoPublishStage`, `resolveHomeCategoryContext`), `home-search-helpers.ts` (`buildHomeCategoryFilterId`, `buildHomeModeFilterId`, `resolveHomeStoresForCategory`), `store-formatting.ts` (`getAllDeliveryModes`, `normalizeDisplayText`, `normalizeTagLabel`, `isDeliveryBenefitLabel`, `resolveStoreOperationalState`, `resolveMeasurementOptions`, `extractPriceValue`, `formatCurrencyValue`, `resolveMeasurementUnitPrice`), `store-search-helpers.ts` (`isOfferItem`, `isNewItem`, `isFavoriteItem`, `buildStoreSearchCategories`, `resolveStoreItemsForCategory`).
- **Helpers deferred with reason:** `resolveDshHomeStoreImageSource`, `resolveDshHomeBannerImageSource`, `resolveDshStoreMenuItemImageSource`, and `resolveDshStoreCoverImageSource` stayed in screens because they depend on image/media ownership and `react-native` image types; `isWithinOperatingHours` stayed deferred because the same logic already exists under `dsh/frontend/shared/news-ticker.preview-store.ts`; `hexToRgba` stayed local because it is styling-adjacent rather than discovery search/formatting logic.
- **Files created/modified:** created `dsh/frontend/app-client/shared/home-promo-mappers.ts`, `dsh/frontend/app-client/shared/home-search-helpers.ts`, `dsh/frontend/app-client/shared/store-formatting.ts`, `dsh/frontend/app-client/shared/store-search-helpers.ts`; modified `dsh/frontend/app-client/screens/HomeScreen.tsx`, `dsh/frontend/app-client/screens/StoreScreen.tsx`, `dsh/docs/DSH_FILE_SIZE_RISK_MATRIX.md`.
- **Purity confirmation:** Validated. New helpers import only contract/shared model modules and contain no JSX, React hooks, `react-native`, or `@bthwani/ui-kit` imports.
- **Final Decision:** BATCH_2_HELPERS_EXTRACTED_READY_FOR_BATCH_3

### Batch 3 Fixture Extraction Result

- **Fixtures extracted:** moved Home static service dial fixtures and discovery filter fixtures into `dsh/frontend/app-client/data/home.preview-data.ts`; moved Home category/subcategory icon fixture maps and Store category icon fixture map into `dsh/frontend/app-client/data/categories.preview-data.ts`.
- **Fixtures deferred with reason:** `serviceDialAnchorLayout` stayed in `HomeScreen.tsx` because it is layout positioning, not preview data; `ACTIVE_PROMO_INTERVAL_MS` stayed in `HomeScreen.tsx` because it is behavior timing; `renderState` title/description maps stayed local because they are UI state copy; dynamic `mockPromo`, `StoreCardPremiumItem` card mapping, and Store smart rail objects stayed local because they bind callbacks/images/state and are not static preview fixtures.
- **Data files created/modified:** modified existing owners `dsh/frontend/app-client/data/home.preview-data.ts` and `dsh/frontend/app-client/data/categories.preview-data.ts`; no new data file was created because suitable data owners already existed.
- **No-behavior-change confirmation:** Screens still consume the same data shape through imported preview fixtures; no JSX, props, routes, runtime/API logic, visibility/serviceability logic, Typed Client, or Binding changes were made.
- **Final Decision:** BATCH_3_FIXTURES_EXTRACTED_READY_FOR_BATCH_4

### Batch 4 UI Parts Extraction Result

- **UI parts extracted:** moved Home category carousel primitives (`CategoryIconImage`, `CategoryHubIcon`, `CategorySelectorItem`) into `dsh/frontend/app-client/parts/home/HomeCategoryCarousel.tsx`; moved Home empty feed view (`EmptyFeed`) into `dsh/frontend/app-client/parts/home/HomeStoreFeed.tsx`; moved Store menu item card view (`MenuItemCard`) with its UI-media image resolver into `dsh/frontend/app-client/parts/store/StoreMenuItemCard.tsx`.
- **UI parts deferred with reason:** Home hero/promo/search/feed blocks stayed local because they are still interleaved with screen state, callbacks, refs, and animation ownership; `renderState` and Store `renderNonReadyState` stayed local because they own non-ready screen-state copy; Store hero/search/measurement/image-preview/cart blocks stayed local because they bind sheets, modal state, gestures, animations, and cart-intent callbacks.
- **Parts files created/modified:** created `dsh/frontend/app-client/parts/home/HomeCategoryCarousel.tsx`, `dsh/frontend/app-client/parts/home/HomeStoreFeed.tsx`, and `dsh/frontend/app-client/parts/store/StoreMenuItemCard.tsx`; modified `dsh/frontend/app-client/screens/HomeScreen.tsx`, `dsh/frontend/app-client/screens/StoreScreen.tsx`, and this matrix.
- **No-behavior-change confirmation:** Extracted parts preserve the same props, UI-kit components, media gating, callback behavior, and call sites; no route, state hook, sheet, runtime/API logic, Typed Client, Binding, backend, or OpenAPI changes were made.
- **Final Decision:** BATCH_4_UI_PARTS_EXTRACTED_READY_FOR_BATCH_5

### Batch 5 State Hook Extraction Result

- **State hooks extracted:** moved Home local `useState` initialization into `dsh/frontend/app-client/hooks/useHomeState.ts`; moved Store local `useState` initialization into `dsh/frontend/app-client/hooks/useStoreState.ts`.
- **State ownership deferred with reason:** refs, timers, derived memos, effects, animation values, PanResponder ownership, image preview animation, back-handler registration, and sheet/modal callbacks stayed in the screens because moving them now would change behavior ownership rather than only extracting state initialization.
- **Hook files created/modified:** created `dsh/frontend/app-client/hooks/useHomeState.ts` and `dsh/frontend/app-client/hooks/useStoreState.ts`; modified `dsh/frontend/app-client/screens/HomeScreen.tsx`, `dsh/frontend/app-client/screens/StoreScreen.tsx`, and this matrix.
- **No-behavior-change confirmation:** The hooks preserve the same initial values and setter usage; no JSX, props, routes, sheets, runtime/API logic, Typed Client, Binding, backend, OpenAPI, or WLT/cart/checkout/payment changes were made.
- **Final Decision:** BATCH_5_STATE_HOOKS_EXTRACTED_READY_FOR_BATCH_6

### Batch 6 Thin Screen Shell Result

- **Thin shells assembled:** `dsh/frontend/app-client/screens/HomeScreen.tsx` now re-exports the Home screen implementation from `dsh/frontend/app-client/parts/home/HomeScreenContent.tsx`; `dsh/frontend/app-client/screens/StoreScreen.tsx` now re-exports the Store screen implementation from `dsh/frontend/app-client/parts/store/StoreScreenContent.tsx`.
- **Implementation moved:** moved the existing Home and Store screen implementation bodies without JSX or behavior rewrites; import paths were adjusted only for the new owner folders.
- **Shell files created/modified:** created `dsh/frontend/app-client/parts/home/HomeScreenContent.tsx` and `dsh/frontend/app-client/parts/store/StoreScreenContent.tsx`; modified `dsh/frontend/app-client/screens/HomeScreen.tsx`, `dsh/frontend/app-client/screens/StoreScreen.tsx`, and this matrix.
- **No-behavior-change confirmation:** Screen public exports, component names, route owner paths, props, callbacks, state hooks, sheets/modals, runtime/API logic, Typed Client, Binding, backend, OpenAPI, and WLT/cart/checkout/payment scope were not changed.
- **Final Decision:** BATCH_6_THIN_SHELL_ASSEMBLED_READY_FOR_BATCH_7

### Remaining Batch Gate Status

- **Batch 7:** Pending. Visual regression and runtime sweep must run after Batch 6 because source-level TypeScript and guards do not prove visual equality.
- **Batch 8:** Blocked by sequencing. Typed Client/API Binding remains forbidden until Batch 7 visual regression and gates pass.
- **Final Decision:** FIX_REQUIRED_BATCH_7
