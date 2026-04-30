---
generatedFrom: governance/17_TESTING_AND_PRODUCTION_READINESS.md
generatedAt: 2026-04-30T04:48:37.2324006+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Testing and Production Readiness

Status: CANONICAL_STANDARD
Owner: BThwani Governance
Scope: verification matrix, runtime proof, test pyramid, traceability, and production-readiness gates

## Purpose

This contract defines minimum verification and release-readiness expectations for BThwani.

## Baseline Verification

Every phase must run:

```powershell
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

These are minimum gates, not complete production readiness.

## Test Pyramid

Use staged testing based on scope:

| Layer | Purpose |
|---|---|
| TypeScript | Catch type and import errors. |
| lint/format/diff-check | Catch syntax, whitespace, and style breakage. |
| unit tests | Validate pure logic and isolated helpers. |
| component tests | Validate reusable components and states. |
| integration tests | Validate flow wiring and API/binding behavior. |
| E2E tests | Validate critical user journeys. |
| visual checks | Validate UI/UX/RTL/layout/safe-area. |
| production-like runtime checks | Validate local runtime and deployment readiness. |

## Traceability Matrix

Every non-trivial governed change should be traceable across these fields when applicable:

- requirement or issue id
- owner
- service
- surface
- flow
- screen or route
- contract source
- binding layer
- test proof
- runtime or visual proof
- final decision

Traceability is incomplete when any mandatory downstream proof is missing.

## UI/UX Verification

For UI work, evidence must include:

- target screen/surface
- before/after screenshots when applicable
- RTL direction check
- overflow/clipping check
- color/design-system compliance
- state coverage
- interaction coverage

## API / Runtime Verification

For API/binding/runtime work, evidence must include:

- contract source
- generated or written types
- client usage
- binding layer
- runtime provider wiring
- error/loading/empty states
- auth/RBAC impact
- observability/logging behavior
- integration test or executable proof

## Production Readiness

A feature is not production-ready until:

- ownership is clear
- API/runtime path is verified
- errors and empty states are handled
- security/privacy impact is reviewed
- observability exists where required
- E2E or equivalent critical path verification exists
- rollback path is known
- evidence pack proves the above

## Verification Matrix

Minimum expected verification by change type:

- docs only: status, diff check, applicable guards
- TypeScript code: status, diff check, workspace typecheck
- UI or UX: typecheck, runtime or visual evidence, relevant guards
- API or contracts: typecheck, contract proof, client and binding proof
- scripts: script-safety review and dry-run when destructive
- governance: guards, evidence zip, and scope isolation

## Provenance

This file now absorbs the live authority previously split across `RUNTIME_VERIFICATION_POLICY.md`, `TRACEABILITY_MATRIX_STANDARD.md`, `TRACEABILITY_MATRIX.md`, and `VERIFICATION_MATRIX.md`.

## DSH Readiness

DSH must not start as implementation until governance reaches the explicit DSH-ready gate.

After that, DSH starts with forensics and matrices before UI/API/runtime implementation.

## Closure Language

Do not claim:

```text
CLOSED
READY
100%
FINAL
```

without evidence.

Use:

```text
READY_FOR_NEXT_PHASE
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
```

when closure is not fully proven.

