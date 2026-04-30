# Control Panel and Operating Model

## Purpose

This file governs the control panel as a web-first operating control room, not a collection of scattered pages.

## Control panel role

`apps/web/control-panel` owns platform/admin operations:

- service operations
- partner/store oversight
- customer/support visibility
- finance read models from WLT
- audit
- reports
- workflows
- risk/incident queues
- settings and provider controls

## Control room UX law

The control panel should prefer:

- fewer routes
- dense but clear information design
- tabs/accordions/drawers/sheets/popovers for progressive disclosure
- fixed/collapsible sidebar
- one/two-click primary flows
- clear top summaries
- audit and action trail
- premium 2026 visual identity

## Forbidden

- long unstructured pages for complex operations
- duplicate service logic outside `packages/surfaces`
- finance truth outside WLT
- local UI design system
- random colors/tokens
- route sprawl without workflow reason

## Domain grouping

| Domain | Source of truth |
|---|---|
| DSH operations | DSH service-owned surfaces + control-panel views |
| WLT finance | WLT contracts/read models |
| Partner/business | ARB/DSH as applicable |
| Safety/security | AMN/security governance |
| Community services | ESF/MRF/SND/KWD |
| HR/internal admin | control-panel domain only, not canonical service |

## Evidence

Control panel changes require:

- route/surface impact
- UI evidence
- role/permission impact
- data/binding source
- no service ownership violation
