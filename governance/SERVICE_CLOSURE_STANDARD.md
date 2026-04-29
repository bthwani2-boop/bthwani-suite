# Service Closure Standard

Status: CANONICAL
Owner: BThwani Governance
Scope: every service under `packages/surfaces/src/service-owned/<service>/`

## 1. Completion rule

No service is considered complete unless it has:

- service identity
- service metadata
- public contract
- surface coverage
- flow matrix
- screens matrix
- state model
- roles and permissions
- API contract when data/integration exists
- binding proof when runtime data exists
- tests
- runtime proof
- evidence pack
- service blueprint
- closure decision

## 2. Required location

The service lives at:

```text
packages/surfaces/src/service-owned/<service>/
```

Its live blueprint lives at:

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

`governance/` owns the standard and template only. It does not own the live truth of every service.

## 3. Service identity

Every service needs:

| Field | Required |
|---|---|
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

## 4. Service metadata

Each service should have `service-meta` or equivalent canonical metadata when the service appears in UI, discovery, dashboard, catalog, permissions, routing, or public exports.

Metadata must not duplicate contradictory truth across files.

## 5. Public contract

Apps and external surfaces must not import service internals directly.

Cross-boundary use must go through:

```text
packages/surfaces/src/public
```

or an approved public export path.

Deep import exceptions require explicit owner approval and guard evidence.

## 6. Surface coverage

Each service must classify every relevant surface:

| Surface | Required classification |
|---|---|
| app-client | SUPPORTED / NOT_APPLICABLE / TBD |
| app-partner | SUPPORTED / NOT_APPLICABLE / TBD |
| app-captain | SUPPORTED / NOT_APPLICABLE / TBD |
| app-field | SUPPORTED / NOT_APPLICABLE / TBD |
| control-panel | SUPPORTED / NOT_APPLICABLE / TBD |
| webapp | SUPPORTED / NOT_APPLICABLE / TBD |
| website | SUPPORTED / NOT_APPLICABLE / TBD |

A `TBD` is allowed only as an open gap, not as closure.

## 7. Flow matrix

Each service flow must document:

- flow id
- actor/role
- entry point
- start state
- steps
- action owner
- success state
- failure state
- empty/loading/offline/retry behavior
- end state
- evidence

## 8. Screens matrix

Each service screen must map:

- screen name
- surface
- route/entrypoint
- owner
- UI source
- state coverage
- flow id
- API/client binding
- visual evidence
- runtime evidence
- closure decision

## 9. API contract rule

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

## 10. Binding proof

Runtime data requires binding proof:

- data source
- API/client/function used
- data lifecycle
- loading state
- success state
- empty state
- error state
- retry/offline/stale handling
- runtime proof

## 11. State model

Service statuses must be explicitly defined.

Common status names such as draft, pending, active, approved, rejected, completed, failed are allowed only when defined in the service state model.

No random status labels may appear in UI, API, docs, or tests without mapping to the state model.

## 12. Roles and permissions

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

Unknown permissions are `TBD` and block closure.

## 13. UI rules

If the service has UI, it must use:

- BThwani design identity
- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`
- RTL correctness for Arabic
- premium 2026 visual standard
- `@bthwani/ui-kit` public exports

Forbidden inside service UI:

- local design systems
- random colors
- duplicated Button/Header/Card primitives
- direct Tamagui imports outside ui-kit
- fixtures masquerading as runtime truth

## 14. Tests and runtime proof

Every service must have verification appropriate to its risk:

- typecheck
- unit tests where logic exists
- contract tests where API exists
- integration or smoke tests where runtime flow exists
- visual evidence where UI exists
- build/run evidence where app-shell or routing is affected

## 15. Evidence pack

A service evidence pack must include:

- summary
- changed files
- git status
- diff check
- typecheck
- tests/build output where applicable
- runtime logs
- screenshots where applicable
- warnings
- decision
- unresolved gaps

## 16. Service blueprint

`SERVICE_BLUEPRINT.md` must clearly separate:

- verified truth
- unverified claims
- open gaps
- blocked items
- rejected items
- deprecated items
- evidence
- closure decision

A blueprint is not complete because it exists. It is complete only when its claims are evidence-backed.

## 17. Service closure rule

No service may be marked `100%`, `CLOSED`, or `READY_FOR_PR` unless:

- service metadata exists or is proven not applicable
- public contract is present or proven not applicable
- flow matrix exists
- screens matrix exists when UI exists
- API contract exists when data/integration exists
- binding proof exists when runtime data exists
- state model exists
- roles and permissions exist
- runtime proof exists where applicable
- test evidence exists
- evidence pack exists
- blueprint decision is explicit