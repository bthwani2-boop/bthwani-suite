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

## 5. Evidence

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
