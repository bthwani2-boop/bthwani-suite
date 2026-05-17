# DSH Golden Slice

**Status:** Canonical Governance Payload v2
**Owner:** `DSH Service Governance`

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
