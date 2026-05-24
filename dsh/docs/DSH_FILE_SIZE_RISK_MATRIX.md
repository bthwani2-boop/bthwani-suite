# DSH File Size and Complexity Risk Matrix

Status: DECOMPOSITION_PLAN_READY
Decision: FIX_REQUIRED_DECOMPOSITION_PLAN

## DSH-SLICE-001 Safe Decomposition Plan

Both `HomeScreen.tsx` (2180 lines) and `StoreScreen.tsx` (2343 lines) are currently "God Objects". Before any Typed Client or OpenAPI binding can happen, these screens must be structurally decomposed.

**Rule:** We do not use generic `components/` folders. All logic is mapped to strict semantic owners.

### HomeScreen.tsx Decomposition Strategy

| Responsibility | Current Location | Target Destination | Rationale |
|---|---|---|---|
| Screen Entry & Layout Shell | `HomeScreen.tsx` | `screens/HomeScreen.tsx` | Keeps the screen thin (under 200 lines). Only renders the main layout and parts. |
| UI Sections (Header, Categories, Feed) | `HomeScreen.tsx` | `parts/home/HomeHeader.tsx`, `parts/home/HomeCategoryCarousel.tsx`, `parts/home/HomeStoreFeed.tsx` | App-specific domain UI parts belong in `parts/`. |
| Inline Search UI | `HomeScreen.tsx` | `parts/home/HomeInlineSearch.tsx` | Encapsulates the same-page search UI. |
| Preview Data & Fixtures | `HomeScreen.tsx` | `data/home-preview-fixtures.ts` | Hardcoded data must be isolated from UI rendering. |
| Formatting & Measurement Helpers | `HomeScreen.tsx` | `shared/dsh-formatting-helpers.ts` | Reusable utilities. |
| Client Visibility & Serviceability Logic | `HomeScreen.tsx` | `shared/dsh-store-visibility-model.ts` | Centralizes gating logic. |
| Bottom Sheets & Modals | `HomeScreen.tsx` | `sheets/HomeFilterSheet.tsx` | Modals have their own lifecycle. |
| Local State Hook | `HomeScreen.tsx` | `screens/useHomeState.ts` | Separates React hook state from UI render. |
| Data Contracts & Types | `HomeScreen.tsx` | `contracts/dsh-home-types.ts` | Future seam for Typed Client data binding. |

### StoreScreen.tsx Decomposition Strategy

| Responsibility | Current Location | Target Destination | Rationale |
|---|---|---|---|
| Screen Entry & Layout Shell | `StoreScreen.tsx` | `screens/StoreScreen.tsx` | Thin entry shell. |
| UI Sections (Hero, Info, Catalog) | `StoreScreen.tsx` | `parts/store/StoreHero.tsx`, `parts/store/StoreInfoSection.tsx`, `parts/store/StoreCatalogFeed.tsx` | Isolates complex scrolling lists and banners. |
| Inline Product Search | `StoreScreen.tsx` | `parts/store/StoreInlineSearch.tsx` | Local product filter UI. |
| Gestures & Animations (PanResponder) | `StoreScreen.tsx` | `parts/store/StoreCartAnimation.tsx` | Isolates React Native animation logic. |
| Preview Data & Fixtures | `StoreScreen.tsx` | `data/store-preview-fixtures.ts` | Isolates hardcoded products and store info. |
| Formatting (Hours, Distances) | `StoreScreen.tsx` | `shared/dsh-formatting-helpers.ts` | Shared domain formatting. |
| Modals (Measurement Picker, Info) | `StoreScreen.tsx` | `sheets/StoreMeasurementSheet.tsx`, `sheets/StoreInfoSheet.tsx` | Isolates modal presentation. |
| Local State Hook | `StoreScreen.tsx` | `screens/useStoreState.ts` | Separates React hook state. |
| Data Contracts & Types | `StoreScreen.tsx` | `contracts/dsh-store-types.ts` | Future seam for catalog data binding. |

## Execution Order

| Step | Action | Description |
|---|---|---|
| 1 | **Extract Types** | Move interface and type definitions into `contracts/`. |
| 2 | **Extract Fixtures** | Move all hardcoded preview arrays/objects to `data/`. |
| 3 | **Extract Helpers** | Move formatting, sanitation, and visibility logic to `shared/`. |
| 4 | **Extract Sheets** | Move BottomSheet components to `sheets/`. |
| 5 | **Extract UI Parts** | Move distinct UI sections (Hero, Carousel, Feed) to `parts/`. |
| 6 | **Extract State Hook** | Create `useHomeState`/`useStoreState` to manage local variables and handlers. |
| 7 | **Wire Shells** | Refactor `HomeScreen.tsx` and `StoreScreen.tsx` to import the new parts and hooks. |

## Forbidden Moves

| Constraint | Reason |
|---|---|
| **NO generic `components/`** | Leads to "dumping ground" folders. Use `parts/` or `sheets/`. |
| **NO Tamagui imports in data/shared** | UI framework is restricted to `.tsx` UI components. |
| **NO UI changes** | This is purely structural. Do not change colors, sizes, or behavior. |
| **NO endpoint edits** | `dsh.openapi.yaml` is locked for this decomposition phase. |
| **NO routing changes** | Do not add or remove navigation routes. Search stays inline. |
| **NO Typed Client binding yet** | We decompose first, bind later. |

## Acceptance Criteria

1. Both `HomeScreen.tsx` and `StoreScreen.tsx` are under 300 lines each.
2. All logic is strictly mapped to `parts/`, `contracts/`, `data/`, `shared/`, `sheets/`, `screens/`.
3. Running `git --no-pager diff --check` shows no trailing whitespace issues.
4. Running `pnpm -w exec tsc --noEmit` passes.
5. `pnpm run guard:service-blueprint` and `pnpm run guard:secret-scan` pass.
6. The UI runs locally with zero visual changes.
