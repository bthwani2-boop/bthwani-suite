---
name: bthwani-ui-kit-surface-contract
description: Use for BThwani UI, UX, screen, surface, dashboard, web, mobile, DSH, or ui-kit work. Enforces central ui-kit authority, RTL correctness, and brand identity.
version: 2026.05.12-v2
---

# BThwani UI Kit / Surface Contract

## Architecture ladder

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

Current path authority is the flat workspace. Treat `ui-kit` as the active current UI kit root unless repo evidence says otherwise.

## Forbidden

- Raw Tamagui imports outside `ui-kit`
- local design systems inside apps/surfaces
- duplicated headers/cards/tabs/tickers outside ui-kit ownership
- random colors outside BThwani identity
- centered Arabic list rows unless intentionally justified
- separated icon/text clusters in Arabic rows caused by careless `space-between`
- direct API/provider/integration logic inside screen UI components

## Visual identity

```text
deepBlue: #0A2F5C
orange:   #FF500D
white:    #FFFFFF
```

Allowed supporting colors must be centralized and low-noise.

## RTL contract
Arabic/RTL UI must verify:

- text aligned right
- icon + label clustered on the right when they belong together
- chevron/action placed opposite the content cluster
- safe area correct
- no clipping or overflow
- states: loading, empty, error, success, offline, disabled

## Required output for UI work

```text
owner_path:
ui_kit_dependencies:
rtl_contract:
states_covered:
visual_evidence_required: yes/no
verification:
decision:
```
