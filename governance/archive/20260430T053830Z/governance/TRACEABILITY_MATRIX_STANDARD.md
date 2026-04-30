# Traceability Matrix Standard

Status: CANONICAL
Owner: BThwani Governance
Scope: mapping requirements to implementation, verification, evidence, and decisions

## 1. Purpose

The traceability matrix prevents gaps between requirements, UI, flows, APIs, bindings, tests, runtime evidence, and final decisions.

No major task, service closure, or PR readiness claim is valid without traceability appropriate to its scope.

## 2. Required matrix columns

| Column | Meaning |
|---|---|
| requirement_id | stable requirement identifier |
| requirement | clear requirement text |
| owner | responsible owner/path |
| service | related service or NOT_APPLICABLE |
| surface | app/surface/control panel/web |
| screen_or_route | screen, route, or entrypoint |
| component_or_module | implementation component/module |
| ui_kit_dependency | ui-kit export used or NOT_APPLICABLE |
| api_contract | contract/schema or NO_API_REQUIRED |
| binding_source | data/client binding or NOT_APPLICABLE |
| states | loading/error/empty/success/offline/retry coverage |
| permissions | roles/permissions or NOT_APPLICABLE |
| tests | tests/checks executed |
| runtime_proof | logs/screenshots/smoke/build proof |
| evidence_root | `tools/registry/runs/<SESSION_ID>` |
| decision | final decision |
| open_gaps | unresolved gaps |

## 3. Requirement rules

Every requirement must be:

- atomic enough to verify
- linked to path ownership
- testable or evidence-verifiable
- classified as functional, UI/UX, flow, API, binding, security, governance, or operational

## 4. UI traceability

UI/UX requirements must trace to:

- screen
- surface
- component
- ui-kit dependency
- brand/RTL proof
- screenshot or visual evidence
- state coverage

## 5. Flow traceability

Flow requirements must trace to:

- entry point
- actor
- steps
- state transitions
- success/failure endpoints
- runtime evidence

## 6. API traceability

API requirements must trace to:

- contract/schema
- request type
- response type
- error type
- permission model
- client binding
- contract proof

If no API is required, the matrix must state `NO_API_REQUIRED`.

## 7. Binding traceability

Binding requirements must trace to:

- data source
- client/function/hook/module
- loading state
- success state
- empty state
- error state
- retry/offline/stale behavior
- runtime proof

## 8. Test traceability

Tests/checks must be tied to the relevant requirement.

Allowed evidence includes:

- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit`
- unit tests
- contract tests
- integration tests
- smoke tests
- build logs
- guard outputs
- screenshots
- runtime logs

## 9. Decision traceability

Every final decision must point to evidence.

Allowed decisions:

- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- READY_FOR_PR
- REVERT_REQUIRED
- NEEDS_EVIDENCE
- NEEDS_VISUAL_EVIDENCE

Warnings must also point to a warning classification when relevant.

## 10. Matrix closure rule

A row is closed only if:

- requirement is clear
- implementation path is known
- verification exists
- evidence root exists
- decision is explicit
- open gaps are empty or carried forward with classification

A matrix is closed only if all rows are closed or explicitly classified as carried-forward gaps.

## 11. Minimal template

| requirement_id | requirement | owner | service | surface | screen_or_route | component_or_module | ui_kit_dependency | api_contract | binding_source | states | permissions | tests | runtime_proof | evidence_root | decision | open_gaps |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-001 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | NEEDS_EVIDENCE | TBD |