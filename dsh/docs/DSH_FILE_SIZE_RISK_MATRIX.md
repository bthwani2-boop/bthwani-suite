# DSH File Size and Complexity Risk Matrix

Status: ACTIVE_DECOMPOSITION_CONTROL
Decision: SPLIT_REQUIRED_BEFORE_BINDING

## Screen File Analysis

| Screen File | Line Count | Complexity Level | Responsibilities Mixed | Decision | Rationale / Risk |
|---|---|---|---|---|---|
| [HomeScreen.tsx](file:///C:/bthwani-suite/dsh/frontend/app-client/screens/HomeScreen.tsx) | 2180 | Critical | Render UI, local state, category/mode filtering, inline global search, visibility calculation, animations, Orbit carousel, sheets. | `SPLIT_NOW_BEFORE_BINDING` | Mixing preview data mapping, client visibility calculations (`resolveDshStoreClientVisibility`), local filtering, and layout rendering in a single file introduces massive risk before binding a real Typed Client. |
| [StoreScreen.tsx](file:///C:/bthwani-suite/dsh/frontend/app-client/screens/StoreScreen.tsx) | 2343 | Critical | Render UI, store hero, PanResponder gestures, measurement multipliers, category selection, inline product search, local state, measurement picker, cart animations. | `SPLIT_NOW_BEFORE_BINDING` | Heavy mix of UI gestures, formatting helpers (`normalizeDisplayText`), measurement calculation logic, and UI states. It must be decomposed to isolate UI rendering from the upcoming API client binding. |

## Refactoring Recommendations

1. **Isolate State & Data Hook**: Extract a custom hook (e.g., `useHomeScreenState.ts` and `useStoreScreenState.ts`) to handle state management, search filters, and visibility filtering.
2. **Decompose UI Components**: Move inline components (`CategorySelectorItem`, `MenuItemCard`, `EmptyFeed`, etc.) to separate files in a `components/` directory.
3. **Move Formatting Helpers**: Extract all static text sanitization, measurement rules, and hours calculators to shared domain utility files.
