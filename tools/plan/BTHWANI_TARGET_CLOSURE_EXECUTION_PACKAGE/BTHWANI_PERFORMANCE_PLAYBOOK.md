# BTHWANI PERFORMANCE PLAYBOOK — V7

Performance is checked while coding.

## 1. Web/control-panel metrics

Use when measurable:

```text
LCP <= 2.5s
INP <= 200ms
CLS <= 0.1
75th percentile when field data exists
```

If not measurable:

```text
PERFORMANCE_NUMBERS_UNPROVEN_WITH_REASON
```

Do not call this PASS.

## 2. During-code checkpoints

Run this checkpoint whenever adding:

```text
list/table
search/filter/sort
drawer/modal/sheet
image/media
chart/map/editor
data fetch
global state/context
form
tabs/navigation
bulk actions
dashboard widgets
new dependency/import
```

## 3. Web/control-panel checks

```text
no unnecessary client component
no heavy import in initial shell
lazy-load heavy charts/maps/editors/modals
pagination/virtualization for tables
debounced search/filter
no full payload in list rows
no fetch per row
no layout shift from images
no repeated request on back/navigation
```

## 4. Mobile checks

```text
no long list inside ScrollView
FlatList/SectionList/VirtualizedList or equivalent for large lists
light row component
thumbnail in list
full image detail-on-open
no heavy JS-thread animation
no excessive console logs
test on real device when possible
```

## 5. Performance Risk Classification by Diagnostic Area

Classify each area before claiming a performance decision. Every area that applies must carry one of the evidence statuses in section 6.

```text
RENDER_RISK
  — excessive re-renders, inline objects/functions in props, oversized Context,
    useEffect loops, heavy calculations inside render

RETRIEVAL_RISK
  — full payload loaded on screen open, no summary-first, no pagination,
    repeated fetches on back-navigation, per-row fetching

MEDIA_RISK
  — uncompressed images, no thumbnails in lists, base64 inside data payloads,
    demo media scattered outside dsh/frontend/media-fixtures

BUNDLE_IMPORT_RISK
  — full library imports instead of selective, heavy charts/maps/editors in
    initial shell, unnecessary client components, icon library fully imported

NAVIGATION_RISK
  — route sprawl, full layout reload on every tab switch, no scroll/state
    preservation on back, excessive nested navigators in mobile

LIST_TABLE_RISK
  — ScrollView for large lists, no virtualization, heavy renderItem logic,
    per-row API fetch, client-side filter/sort on large datasets without debounce

FORM_RISK
  — validation on every keypress when expensive, full form re-render on single
    input change, large dropdowns loaded all at once

LOGGING_MEMORY_RISK
  — console.log inside renders or loops, uncleaned timers/subscriptions/listeners,
    screens/modals retained in memory after unmount
```

## 5a. 7-Gate Testing Approach

Run gates in this order while building, not after completion:

```text
Gate 1 — Design gate (before code)
  Screen density audit: does the screen need all these elements?
  Is summary-first respected? Is primary CTA single and clear?

Gate 2 — Web measurement gate
  LCP / INP / CLS via Chrome DevTools Performance / Lighthouse.
  Target: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.

Gate 3 — React render gate
  React Profiler / DevTools: render count, which component is slow,
  does a small input change re-render the whole screen?

Gate 4 — Lists/tables gate
  Test at 20, 200, and 1000 items. Check: scroll, search, filter,
  sort, drawer open, bulk select, images in rows.

Gate 5 — Network/data gate
  Network tab waterfall: request count, payload size, repeated requests,
  refetch on back-navigation, eager loading beyond summary.

Gate 6 — Images/media gate
  Check size, dimensions, thumbnails present, lazy loading active,
  layout shift absent, no base64 in data, no scattered demo media.

Gate 7 — JavaScript/bundle gate
  First load JS size, route chunk sizes, dynamic import for heavy
  components, no full icon library import, no unused dependencies.
```

## 6. Evidence

Use one of:

```text
PERFORMANCE_MEASURED_WITH_RESULT
PERFORMANCE_RISK_CLASSIFIED_AND_MITIGATED
PERFORMANCE_NUMBERS_UNPROVEN_WITH_REASON
PERFORMANCE_BLOCKED_WITH_REASON
```

## 7. No guessing

Forbidden wording:

```text
looks faster
should be faster
performance improved
```

Allowed without numeric measurement:

```text
performance risk reduced by avoiding eager load / full payload / heavy import
numbers unproven
```

## 8. 22 Comprehensive Performance & UI/UX Standards

You must adhere to the following 22 rigorous standards for UI/UX flow and performance during all development stages:

1. **Light First Render**: Start with light, useful content. No heavy empty screens.
2. **Summary-First & Detail-on-Demand**: Never load full data objects on initial load. Load summaries; details on click.
3. **No Unjustified Elements**: No excessive cards, heroes, or nested layouts without reason.
4. **List Optimization**: Pagination/virtualization is mandatory for any large list.
5. **Clear Flows**: Each flow has one primary CTA and the minimum number of steps.
6. **No Route Sprawl**: Use tabs, drawers, or split panes for details instead of full new routes.
7. **Immediate Feedback**: Every tap/click must have immediate visual feedback.
8. **Skeletons over Spinners**: Use light skeletons instead of long blocking spinners.
9. **Mandatory States**: Every screen MUST cover: loading, empty, error, offline, blocked, disabled, success.
10. **RTL Correctness**: 100% correct Arabic RTL. No misplaced chevrons. LTR for raw data/SKUs.
11. **No Clipping/Overflow**: Prevent visual noise and layout bugs.
12. **Centralized UI-Kit**: No local design patterns. Every reusable component comes from `@bthwani/ui-kit`.
13. **Core Web Vitals**: Strict adherence to LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
14. **Lazy Loading**: Heavy components, maps, charts, editors, and modals must be lazy-loaded.
15. **Optimized Media**: Thumbnails in lists. Full images only in detail view. Explicit width/height.
16. **No Duplicate Demo Data**: ALL DSH demo data and media must point exclusively to `dsh/frontend/data` and `dsh/media-fixtures`.
17. **Optimized React Renders**: Strict state partitioning. Use `memo` / `useMemo` / `useCallback` appropriately. No object creation in heavy list row props.
18. **Mobile Efficiency**: No `ScrollView` for lists. Use `FlatList`/`FlashList`. Light row components. Reduce JS thread animations.
19. **Control Panel Density**: Calculated density, fixed table toolbar, deferred/debounced filters, bulk actions only on selection.
20. **Network Efficiency**: Separate summary vs detail endpoints. Debounce requests. Cache repeat queries. No `N+1` fetches.
21. **Security without Lag**: No secrets in logs. No heavy decryption on UI thread.
22. **Evidence-Driven**: No claim of "faster" without before/after evidence (Git status, network waterfall, bundle size, render count, screenshot).
