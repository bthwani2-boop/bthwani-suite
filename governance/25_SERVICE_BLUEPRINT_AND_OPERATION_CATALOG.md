# Service Blueprint and Operation Catalog

## Purpose

This file defines the required structure for service blueprints and operation catalogs. It prevents service closure from becoming vague or purely verbal.

## Service blueprint path

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

A blueprint is a living control file for verified service truth only.

## Service blueprint required sections

```text
# <SERVICE> Service Blueprint

status:
owner:
surfaces:
canonical paths:
runtime/backend paths:
contracts:
api clients:
screens:
states:
roles and permissions:
money/WLT involvement:
provider variables:
tests:
guards:
evidence:
known gaps:
closure decision:
```

## Blueprint status vocabulary

- `TEMPLATE`
- `TBD`
- `UNPROVEN`
- `VERIFIED`
- `CLOSED`
- `BLOCKED`
- `STALE_PATH`
- `DEPRECATED`
- `REJECTED`

## Operation catalog

Every non-trivial service should maintain an operation catalog.

Required columns:

```text
operation_id | service | surface | actor | trigger | input | output | contract | state_change | evidence | status
```

## Operation categories

- create
- read
- update
- delete/archive
- approve/reject
- assign
- cancel
- refund
- settle
- notify
- audit
- provider call
- retry/compensate

## Actor model

Every operation must identify actor:

- customer
- partner
- captain
- field
- admin
- system
- provider
- support

## State machine requirement

For each service flow, define:

- states
- allowed transitions
- forbidden transitions
- terminal states
- retry/rollback behavior
- audit event

## WLT binding

If an operation has money impact, it must reference WLT operation or ledger proof. Service-local financial assumptions are not accepted.

## Acceptance

A service blueprint or operation catalog is accepted only when:

- paths exist or are marked `TBD`
- contracts are linked or marked `TBD`
- runtime proof exists for closed operations
- traceability rows map requirements to evidence
- unknowns are explicit
