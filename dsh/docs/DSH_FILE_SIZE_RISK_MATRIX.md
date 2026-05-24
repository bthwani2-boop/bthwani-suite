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
