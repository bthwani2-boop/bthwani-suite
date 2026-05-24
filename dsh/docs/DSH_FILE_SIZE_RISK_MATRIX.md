# DSH File Size and Complexity Risk Matrix

Status: BATCH_9C_FRONTEND_RUNTIME_TRANSPORT
Decision: FIX_REQUIRED_RUNTIME_EVIDENCE

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

### Batch 7 Visual Regression + Gates Result

- **Static gates passed:** `git --no-pager diff --check`; `pnpm -w exec tsc --noEmit` after sandbox `EPERM` rerun; `pnpm run guard:tamagui-import-boundary`; `pnpm run guard:service-blueprint`; `pnpm run guard:binding-proof`; `pnpm run guard:secret-scan`.
- **Runtime smoke passed:** `pnpm --dir app-client/runtime exec expo export --platform android --output-dir C:\tmp\bthwani-app-client-export-batch7 --no-minify --no-bytecode --clear --max-workers 1` completed and bundled `app-client\runtime\index.js`.
- **Visual regression evidence:** ADB device `SM-A125F`, viewport `720x1600`, RTL, package `com.bthwani.client.dev`; evidence root `tools/registry/runs/DSH_BATCH7_ADB_VISUAL_SWEEP-20260524-082321`.
- **Screenshots captured:** Home feed `P6__app-client__relaunched-home-feed__SM-A125F__rtl__ADB_CAPTURE.png`; Home inline search `P8__app-client__home-inline-search-second-tap__SM-A125F__rtl__ADB_CAPTURE.png`; Store details `P3__app-client__after-store-card-double-tap__SM-A125F__rtl__ADB_CAPTURE.png`.
- **Warnings/deferred evidence:** `guard:protected-tokens` remained warning-only with `DESIGN-TOKEN-DRIFT: WARN (fail=0, warn=4)`; ADB `uiautomator dump` failed with idle-state error, so the accepted visual proof is PNG screenshot evidence plus focused-window and filtered-log evidence.
- **No-behavior-change confirmation:** Batch 7 made no UI, JSX, props, routes, runtime/API, Typed Client, Binding, backend, OpenAPI, WLT/cart/checkout/payment, or business-logic changes; it only added gate/evidence documentation and registry evidence metadata.
- **Final Decision:** BATCH_7_GATES_PASSED_READY_FOR_BATCH_8

### Remaining Batch Gate Status

- **Batch 7:** Complete for DSH-SLICE-001 decomposition regression gates.
- **Batch 8:** Allowed next by sequencing, but no Typed Client/API Binding was executed in Batch 7.
- **Final Decision:** BATCH_7_GATES_PASSED_READY_FOR_BATCH_8

### Batch 8 Preflight Result

- **Preflight scope:** documentation-only planning for `DSH-SAPI-P014-01` / `GET /stores`; no Typed Client, API Binding, runtime, backend, OpenAPI, route, UI, WLT/cart/checkout/payment, Docker, database, or dependency change is executed here.
- **Tooling inspection:** root `package.json` exposes guard scripts only; `tools/guards` and `tools/scripts` do not provide a dedicated OpenAPI validator or typed-client generator command for `dsh/dsh.openapi.yaml`.
- **Preflight decision:** `BLOCKED_TYPED_CLIENT_TOOLING_MISSING`.
- **Contract validation command:** `BLOCKED_TYPED_CLIENT_TOOLING_MISSING`; no dedicated validator command exists yet. Existing `pnpm run guard:service-blueprint` and `pnpm run guard:binding-proof` remain evidence guards, not OpenAPI validation or typed-client generation.
- **Typed client owner:** future API types/client boundary must live outside `HomeScreen.tsx`, `StoreScreen.tsx`, `HomeScreenContent.tsx`, and `StoreScreenContent.tsx`; the contract/type target is `dsh/frontend/app-client/contracts/`, with any non-UI client adapter under `dsh/frontend/app-client/shared/`.
- **Typed client generation/definition target:** blocked until an approved generator/definition command exists; when tooling exists, target only the single `listDiscoveryStores` operation for `GET /stores`.
- **Mapper target:** `dsh/frontend/app-client/shared/` maps the future `listDiscoveryStores` response into the existing `DshHomeGetStore` and store-detail props; UI parts continue to receive props and must not fetch.
- **State bridge:** loading, empty, error, and offline remain explicit screen-state props before they reach UI parts; no runtime success claim is allowed until trusted request/response evidence exists.
- **Preview fallback rule:** `dsh/frontend/app-client/data/*.preview-data.ts` remains `UI_PREVIEW_ONLY` fallback data and must not be treated as backend, API binding, or runtime truth.
- **Evidence commands for scoped Batch 8 work:** `git --no-pager diff --check`; `pnpm -w exec tsc --noEmit`; `pnpm run guard:tamagui-import-boundary`; `pnpm run guard:service-blueprint`; `pnpm run guard:binding-proof`; `pnpm run guard:secret-scan`.

### Batch 8A Typed Client Tooling Result

- **Tooling scope:** limited to `dsh/dsh.openapi.yaml` for DSH-SLICE-001 / `DSH-SAPI-P014-01`; no API Binding, runtime call, backend, domain, route, UI, mapper, data-preview, WLT/cart/checkout/payment, Docker, PostgreSQL, or endpoint expansion was executed.
- **Tooling added:** `@stoplight/spectral-cli@6.16.0` for OpenAPI lint/validation and `openapi-typescript@7.13.0` for type generation; `.spectral.yaml` was normalized to a valid Spectral ruleset shape.
- **Scripts added:** `pnpm run openapi:lint:dsh` and `pnpm run openapi:types:dsh`.
- **Generated types path:** `dsh/frontend/app-client/contracts/dsh-openapi.types.ts`.
- **Validation result:** `pnpm run openapi:lint:dsh` passed with 0 errors and 3 warnings (`oas3-api-servers`, `info-contact`, `operation-tag-defined`); these are documentation/governance warnings and do not require expanding the endpoint in Batch 8A.
- **Generation result:** `pnpm run openapi:types:dsh` generated types for `GET /stores` / `listDiscoveryStores` only.
- **Owner boundary:** generated OpenAPI types live under `dsh/frontend/app-client/contracts/`; no direct fetch belongs in `HomeScreen.tsx`, `StoreScreen.tsx`, UI parts, or preview data, and no binding belongs in backend/domain during this batch.
- **Backend/domain decision:** no files or scaffolds are added under `dsh/backend` or `dsh/domain` in Batch 8A; those remain blocked until a later scoped runtime/backend batch has contract, auth, persistence, and observability proof.
- **No-binding confirmation:** Batch 8A added tooling and generated types only; runtime remains preview/local-state and no Typed Client/API Binding was executed.
- **Final Decision:** BATCH_8A_TYPED_CLIENT_TOOLING_READY

### Batch 8B Scoped Typed Client Boundary Result

- **Binding scope:** scoped to the frontend client boundary for `DSH-SAPI-P014-01` / `GET /stores`; no backend, domain, route, UI part, Home/Store screen fetch, mapper inflation, WLT/cart/checkout/payment, Docker, PostgreSQL, or endpoint expansion was executed.
- **Typed client owner:** `dsh/frontend/app-client/shared/dsh-discovery-stores-client.ts` defines the typed `listDiscoveryStores` boundary from `dsh-openapi.types.ts` with an injected transport only; it does not import or call `fetch`.
- **Mapper target:** `dsh/frontend/app-client/shared/dsh-discovery-stores-mappers.ts` maps the generated OpenAPI response into existing `DshHomeGetStore` and discovery summary shapes.
- **State/fallback bridge:** `dsh/frontend/app-client/shared/dsh-discovery-stores-bridge.ts` owns `ready`, `empty`, `loading`, `error`, and `offline` bridge states and keeps preview fallback explicit when no runtime response exists.
- **Surface wiring:** `dsh/frontend/app-client/DshClientSurface.tsx` reads stores through the bridge and still passes props into `HomeScreen` / `StoreScreen`; no direct fetch or binding was added inside screens or UI parts.
- **Runtime decision:** unchanged. Current source is still `preview-fallback` / local-state; there is no runtime success claim.
- **Backend/domain decision:** still blocked. Nothing is added under `dsh/backend` or `dsh/domain` until a later runtime/backend batch has approved auth, persistence, transport, observability, and smoke evidence.
- **Evidence result:** `pnpm run openapi:lint:dsh` passed with 0 errors and the same 3 warnings; `pnpm run openapi:types:dsh`; `git --no-pager diff --check`; `pnpm -w exec tsc --noEmit`; `pnpm run guard:tamagui-import-boundary`; `pnpm run guard:service-blueprint`; `pnpm run guard:binding-proof`; and `pnpm run guard:secret-scan` passed.
- **Final Decision:** BATCH_8B_SCOPED_TYPED_CLIENT_BOUNDARY_READY_FOR_RUNTIME_TRANSPORT

### Batch 8C Runtime Transport Decision

- **Decision scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Runtime opening decision:** Batch 8C authorizes the next batch to create the Go backend/domain slice for real runtime transport, but does not implement Go, backend handlers, Docker, PostgreSQL, or frontend runtime calls.
- **Current frontend truth:** the typed client boundary, mapper, and bridge are ready as frontend boundary proof; `DshClientSurface.tsx` still uses the bridge without a real runtime response, so current data remains `preview-fallback` / local-state.
- **Future proof requirement:** real runtime remains unproven until later evidence shows UI -> typed client -> Go -> PostgreSQL -> response -> screen for `GET /stores`.
- **Explicit exclusions:** no UI change, no route change, no `dsh.openapi.yaml` change, no WLT/cart/checkout/payment, no partner/captain/field action, no endpoint beyond `GET /stores`.
- **Next allowed batch:** Batch 9A may create `dsh/domain` and `dsh/backend` Go skeleton for `GET /stores` only.
- **Final Decision:** READY_FOR_GO_BACKEND_SLICE

### Batch 9A Go Backend Skeleton Result

- **Implementation scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Domain owner:** `dsh/domain/store_discovery.go` defines `StoreSummary`, `StoreDiscoveryQuery`, `Pagination`, error codes, and the visibility/serviceability input shape required by store discovery.
- **Backend owner:** `dsh/backend` now has a Go module with `cmd/dsh-api/main.go`, `internal/http/stores_handler.go`, `internal/store/store_repository.go`, and a temporary `internal/store/memory_repository.go`.
- **Contract alignment:** the handler accepts only `category_id`, `query`, `filter`, `limit`, and `offset`, and returns the `DiscoveryStoresResponse` / `ErrorResponse` JSON shapes from `dsh/dsh.openapi.yaml`.
- **Persistence decision:** PostgreSQL, Docker Compose, migrations, seed, and real DB runtime are deferred to Batch 9B.
- **Frontend decision:** no frontend runtime transport or UI binding changed in Batch 9A; `DshClientSurface.tsx` remains preview-fallback until Batch 9C.
- **Explicit exclusions:** no cart, checkout, WLT, payment, partner/captain/field actions, Docker, PostgreSQL, frontend binding, route change, or endpoint beyond `GET /stores`.
- **Next allowed batch:** Batch 9B may add local PostgreSQL runtime for this same endpoint only.
- **Final Decision:** BATCH_9A_GO_BACKEND_SKELETON_READY_FOR_POSTGRES

### Batch 9C Frontend Runtime Transport Result

- **Implementation scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Transport owner:** `dsh/frontend/app-client/shared/dsh-discovery-stores-transport.ts` — creates the HTTP transport using native `fetch`; no UI framework imports; no direct fetch in screens or UI parts.
- **Config owner:** `dsh/frontend/app-client/shared/dsh-discovery-stores-runtime-config.ts` — reads `EXPO_PUBLIC_DSH_API_BASE_URL`; returns null when absent (preview fallback remains active).
- **DshClientSurface binding:** `dsh/frontend/app-client/DshClientSurface.tsx` now holds `runtimeBridge` as React state; a single `useEffect` on mount resolves the config, transitions to `loading`, calls `listDiscoveryStores()`, and sets the bridge to `ready`/`empty`/`error`/`offline` depending on the response.
- **Preview fallback preserved:** the bridge stays on `preview-fallback` when no config is found, when the request fails, or when the device is offline; explicit preview mode also stays on fallback.
- **Frontend boundary:** no fetch inside `HomeScreen.tsx`, `StoreScreen.tsx`, `HomeScreenContent.tsx`, `StoreScreenContent.tsx`, or any UI part.
- **UI change:** none — all five bridge states (loading, success, empty, error, offline) were already handled by existing UI parts from Batch 7 visual sweep; no JSX, props, routes, or visual behavior changed.
- **Backend/domain decision:** no change — backend, domain, docker-compose, OpenAPI, or endpoint work was not touched.
- **Explicit exclusions:** no cart, checkout, WLT, payment, partner/captain/field actions, route change, `dsh.openapi.yaml` change, or endpoint beyond `GET /stores`.
- **Evidence result:** `docker compose -f dsh/backend/docker-compose.local.yml ps` (no container running — local-only environment); `pnpm run openapi:lint:dsh` passed with 0 errors and 3 pre-existing warnings; `pnpm run openapi:types:dsh` passed; `git --no-pager diff --check` clean; `pnpm -w exec tsc --noEmit` passed (0 errors); `guard:tamagui-import-boundary` PASS; `guard:service-blueprint` PASS; `guard:binding-proof` PASS; `guard:secret-scan` WARN (fail=0, warn=1, pre-existing `dsh_local_password` in docker-compose).
- **Next allowed batch:** Batch 9D may provide E2E proof: start the Go backend, run `GET /stores`, confirm real response reaches `DshClientSurface` and the screen renders runtime data (not preview).
- **Final Decision:** `BATCH_9C_FRONTEND_RUNTIME_TRANSPORT_READY_FOR_E2E_PROOF`

### Post-9C Reality Reset (2026-05-24)

- **Runtime scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Decision:** `FIX_REQUIRED_RUNTIME_EVIDENCE`.
- **Reason:** the local Batch 9D evidence folder lacks required screenshot evidence, so it cannot prove UI -> typed client -> Go -> PostgreSQL -> response -> screen.
- **Guard path:** DSH-specific runtime wrappers were removed. Use generic service guards with `--service dsh`.
- **Next allowed batch:** Re-run Batch 9D E2E proof with complete request/response, DB, bridge-source, performance, and screenshot evidence.

### Batch 9B PostgreSQL Runtime Result

- **Runtime scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **PostgreSQL owner:** `dsh/backend/docker-compose.local.yml` adds one local PostgreSQL service and no Redis, broker, Kubernetes, or extra service.
- **Migration/seed owner:** `dsh/backend/migrations/001_store_discovery.sql` and `dsh/backend/seed/002_store_discovery_seed.sql` create and seed the discovery summary table for the single endpoint.
- **Backend owner:** `dsh/backend/internal/store/postgres_repository.go` adds a PostgreSQL repository behind the existing `store.Repository` interface; `cmd/dsh-api/main.go` selects it through `DATABASE_URL` and keeps the memory repository as a fallback.
- **Runtime proof:** Docker daemon and Compose were available, the PostgreSQL container reached healthy state, seed rows were queried, `go test ./...` passed, and local `GET /stores` smoke returned success, empty, and invalid-limit responses.
- **Frontend decision:** no frontend runtime transport or UI binding changed in Batch 9B; `DshClientSurface.tsx` remains preview-fallback until Batch 9C.
- **Explicit exclusions:** no cart, checkout, WLT, payment, partner/captain/field actions, frontend binding, route change, `dsh.openapi.yaml` change, or endpoint beyond `GET /stores`.
- **Next allowed batch:** Batch 9C may add frontend runtime transport for the same endpoint only.
- **Final Decision:** BATCH_9B_POSTGRES_RUNTIME_READY_FOR_FRONTEND_TRANSPORT
