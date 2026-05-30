# BTHWANI PERFORMANCE PLAYBOOK — V6

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

## 6. No guessing

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
