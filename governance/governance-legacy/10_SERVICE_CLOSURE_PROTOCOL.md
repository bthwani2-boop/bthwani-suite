---
generatedFrom: governance/10_SERVICE_CLOSURE_PROTOCOL.md
generatedAt: 2026-04-30T04:48:37.1916274+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Service Closure Protocol

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: end-to-end closure of any BThwani service under `packages/surfaces/src/service-owned/<service>/`

## Purpose

This protocol defines how any BThwani service is closed end-to-end without gaps.

No service is complete merely because screens exist, a blueprint exists, or a local build passes.

## Closure Order

Use this order unless a narrower protocol explicitly governs a later phase:

```text
1. Reality and Boundary Audit
2. Service Identity and Metadata
3. Surface Coverage Classification
4. Flow Matrix
5. Screens Matrix
6. UI / UX / RTL / State Closure
7. Public Contract and API Forensics
8. API Types and Clients Closure
9. Binding Layer Closure
10. Integration Closure
11. Runtime / Local Production Readiness
12. Backend / Service Readiness
13. Security / RBAC / Privacy / Audit Closure
14. Observability / Monitoring / Incident Readiness
15. Test Pyramid / E2E Closure
16. Production Readiness / Release Gate
```

A later phase may not claim closure for an earlier missing phase.

## Golden Slice Rule

Close one service deeply before generalizing.

DSH remains the first intended golden slice after governance is ready.

The DSH service sequence is:

1. reality and boundary audit
2. service metadata and catalog truth
3. surface classification across all official surfaces
4. flow matrix and screen matrix
5. UI, state, and role closure
6. API, client, and binding proof
7. runtime, testing, and evidence pack closure

## Phase Separation

Do not mix in one claimed closure batch:

- UI and UX closure
- API contract work
- binding
- backend or runtime
- production readiness

Each phase needs its own evidence.

## Completion Rule

No service is considered complete unless it has, when applicable:

- service identity
- service metadata
- public contract
- surface coverage classification
- flow matrix
- screens matrix
- state model
- roles and permissions
- API contract
- binding proof
- tests
- runtime proof
- evidence pack
- service blueprint
- final closure decision

## Required Location And Blueprint

The service lives at:

```text
packages/surfaces/src/service-owned/<service>/
```

Its live blueprint lives at:

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```
`governance/` owns the protocol and standard only. It does not own the live truth of each service implementation.

## Service Identity And Metadata

Every service needs:

| Field | Required |
| --- | --- |
| id | yes |
| name ar | yes |
| name en | yes |
| description | yes |
| icon | when UI-facing |
| category | yes |
| status | yes |
| owner | yes |
| supported surfaces | yes |
| service path | yes |
| public export path | yes when exported |

Metadata must not duplicate contradictory truth across files.

## Canonical Service Catalog

The platform service slugs governed here are:

- `amn`
- `arb`
- `dsh`
- `esf`
- `knz`
- `kwd`
- `mrf`
- `snd`
- `wlt`

`hr` is not a standalone platform service slug. `exchangeprice` remains a WLT-owned capability rather than a parallel clean service.

## Public Contract Rule

Apps and external surfaces must not import service internals directly.

Cross-boundary use must go through:

```text
packages/surfaces/src/public
```

or another approved public export path.

Deep import exceptions require explicit owner approval and guard evidence.

## Surface Coverage Classification

A service closure must classify every relevant surface:

| Surface | Required classification |
| --- | --- |
| app-client | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |
| app-partner | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |
| app-captain | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |
| app-field | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |
| control-panel | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |
| webapp | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |
| website | SUPPORTED / NOT_APPLICABLE / OPEN_GAP |

`OPEN_GAP` is allowed only as an unresolved gap, not as closure.

## Flow And Screens Matrix

Each service flow must document:

- flow id
- actor or role
- entry point
- start state
- steps
- action owner
- success state
- failure state
- empty, loading, offline, and retry behavior
- end state
- evidence

Each service screen must map:

- screen name
- surface
- route or entrypoint
- owner
- UI source
- state coverage
- flow id
- API or client binding
- visual evidence
- runtime evidence
- closure decision

## Live Service Blueprint Standard

Each service-owned service must maintain exactly one live blueprint at:

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

The required blueprint sections are:

1. service identity
2. surface/app coverage matrix
3. current phase truth
4. verified capabilities
5. unverified capabilities
6. blocked gaps
7. evidence registry
8. ownership boundaries
9. public exports and runtime entrypoints
10. change log

## API Contract And Binding Proof

Any data or integration service must define:

- request schema
- response schema
- error schema
- permissions
- versioning
- contract tests
- client binding

If no API is required, record:

```text
NO_API_REQUIRED
Reason:
Owner:
Evidence:
```

Runtime data requires binding proof for:

- data source
- API, client, or function used
- data lifecycle
- loading state
- success state
- empty state
- error state
- retry, offline, and stale handling
- runtime proof

## State Model And Permissions

Service statuses must be explicitly defined.

Common labels such as draft, pending, active, approved, rejected, completed, or failed are allowed only when mapped in the service state model.

Every service must define who can:

- see
- create
- update
- approve
- reject
- cancel
- export
- manage
- audit

Unknown permissions are `OPEN_GAP` and block closure.

## UI Rule

If the service has UI, it must use:

- BThwani design identity
- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`
- RTL correctness for Arabic
- `@bthwani/ui-kit` public exports

## Provenance

This protocol now absorbs the live authority previously split across `11_DSH_GOLDEN_SLICE_PROTOCOL.md`, `SERVICE_CATALOG.md`, `SERVICE_BLUEPRINT_STANDARD.md`, `SERVICE_BLUEPRINT_TEMPLATE.md`, `SERVICE_CLOSURE_GUARDRAILS.md`, and `OPERATION_CATALOG_TEMPLATE.md`.

Forbidden inside service UI:

- local design systems
- random colors
- duplicated Button, Header, or Card primitives
- direct Tamagui imports outside ui-kit
- fixtures masquerading as runtime truth

## Verification And Evidence

Every service closure must produce evidence under `tools/registry/runs/{SESSION_ID}/`.

Evidence must include, when applicable:

- summary
- changed files
- git status
- diff check
- typecheck
- tests or build output
- runtime logs
- screenshots
- warnings
- decision
- unresolved gaps

Verification must include appropriate proof for risk level:

- typecheck
- unit tests where logic exists
- contract tests where API exists
- integration or smoke tests where runtime flow exists
- visual evidence where UI exists
- build or run evidence where routing or app-shell behavior is affected

## Service Blueprint Truth Model

`SERVICE_BLUEPRINT.md` must clearly separate:

- verified truth
- open gaps
- blocked items
- rejected items
- deprecated items
- stale paths
- evidence
- closure decision

A blueprint is not complete because it exists. It is complete only when its claims are evidence-backed.

## Final Closure Decisions

No service may be marked `100%`, `CLOSED`, or `READY_FOR_PR` by prose alone.

The only canonical final closure decisions are:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

Service fact states inside blueprints or matrices may use:

```text
VERIFIED
OPEN_GAP
BLOCKED
REJECTED
DEPRECATED
STALE_PATH
NOT_APPLICABLE
```

Closure is allowed only when the applicable metadata, matrices, contract proof, binding proof, permissions, runtime proof, tests, blueprint truth, and evidence pack are present.

This file is the service-closure authority.

