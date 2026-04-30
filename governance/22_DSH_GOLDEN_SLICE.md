# DSH Golden Slice

**Status:** Canonical Governance Payload v2
**Owner:** `DSH Service Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0106-20260430-221753-governance`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 11_DSH_GOLDEN_SLICE_PROTOCOL, BTHWANI_PLATFORM_DSH_FULL_END_TO_END_ROADMAP_V2

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Purpose

DSH is the first official golden slice. It must prove the governance model works across all relevant surfaces before the platform claims maturity.

## DSH actors

| Actor | Surface | Core goals |
|---|---|---|
| Client | app-client | discover store, cart, order, pay, track, rate |
| Partner | app-partner | receive/accept/prepare order, manage catalog/ops |
| Captain | app-captain | accept assignment, pickup, deliver, prove completion |
| Field | app-field | onboard/verify partner and operational readiness |
| Operator | control-panel | monitor, intervene, configure, audit |
| Finance | control-panel/WLT | settle, refund, reconcile via WLT |

## DSH flow closure

Minimum flows:

```text
store discovery
store details
cart
checkout
payment decision via WLT
order creation
partner acceptance/preparation
captain assignment
pickup
delivery
completion/rating
refund/issue path
ops intervention
```

## DSH must not own

- wallet balance,
- ledger mutation,
- final settlement,
- refund finalization,
- financial reconciliation.

These belong to WLT.

## DSH evidence matrices

### Surface matrix

```text
surface | screen | route | state coverage | screenshot | API binding | status
```

### Order state matrix

```text
state | actor who sees it | next actions | failure state | evidence
```

### Control-panel operations

```text
operation | permission | side effect | audit | rollback | evidence
```

## Golden slice acceptance

DSH is not closed until:

- all required surfaces are mapped,
- WLT financial boundary is respected,
- UI uses ui-kit,
- API binding is typed,
- runtime evidence exists,
- control-panel ops are defined,
- warnings are classified,
- evidence pack is complete.

{standard_footer()}
