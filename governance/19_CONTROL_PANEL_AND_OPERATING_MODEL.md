# Control Panel and Operating Model

**Status:** Canonical Governance Payload v2
**Owner:** `Control Panel Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** GOVERNANCE_CONTROL_PLANE_STANDARD, PLATFORM_OPERATING_MODEL, PLATFORM_BLUEPRINT

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


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
