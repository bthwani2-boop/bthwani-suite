# Control Panel and Operating Model

**Status:** Canonical Governance Payload v2
**Owner:** `Control Panel Governance`

## Control-panel definition

The control panel is a web-first control room for operations, not a collection of long mobile-like pages. It must expose service operations, evidence, approvals, provider controls, and monitoring with dense, clear, low-noise information design.

## Control room principles

- fewer routes,
- more tabs/drawers/sheets/accordions for progressive disclosure,
- fixed/collapsible sidebar,
- high-signal summaries,
- service-oriented operations,
- one/two-click primary tasks,
- audit and permission awareness,
- no huge explanatory blocks replacing tools.

## Domain groups

| Group | Includes |
|---|---|
| DSH Operations | stores, orders, delivery, captain assignment, partner ops |
| WLT Finance | ledger, settlements, refunds, reconciliation |
| Community Services | esf, mrf, snd, kwd |
| Safety/Trust | amn, incidents, verification |
| Growth/Content | knz/arb where approved |
| Governance/Ops | evidence, guards, branch/checkpoint, runtime health |

## Control-panel operation record

Every operation must define:

```text
operation_id
service
surface
role/permission
input
validation
side effect
audit log
rollback/undo
evidence
```

## Forbidden control-panel patterns

- treating HR as one of the nine platform services,
- owning WLT money logic outside WLT,
- implementing service state machines locally,
- adding new route per small action,
- mixing Arabic/English labels randomly,
- ignoring web-first density.

## Operations evidence

For a control-panel change, provide:

- route/screen path,
- operation catalog row,
- permission model,
- screenshot,
- API/runtime evidence if action has side effect,
- audit/rollback note.
