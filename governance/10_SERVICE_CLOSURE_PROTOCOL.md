# Service Closure Protocol

## Purpose

This protocol defines how any BThwani service is closed end-to-end without gaps.

## Closure Order

Use this order unless a phase explicitly says otherwise:

```text
1. Reality and Boundary Audit
2. Logic / Flow Matrix
3. Gap Map
4. Screen Model Contract
5. UI / UX / RTL / State Closure
6. Contract / API Forensics
7. API Types and Clients Closure
8. Binding Layer Closure
9. Integration Closure
10. Runtime / Local Production Readiness
11. Backend / Service Readiness
12. Security / RBAC / Privacy / Audit Closure
13. Observability / Monitoring / Incident Readiness
14. Test Pyramid / E2E Closure
15. Production Readiness / Release Gate
```

## Golden Slice Rule

Close one service deeply before generalizing. DSH is the first intended golden slice after governance is ready.

## Phase Separation

Do not mix:

- UI/UX closure
- API contract work
- binding
- backend/runtime
- production readiness

Each phase needs its own evidence.

## Required Statuses

Use:

```text
VERIFIED
UNPROVEN
BLOCKED
TBD
CLOSED
STALE_PATH
DEPRECATED
REJECTED
```

Do not use `CLOSED` unless evidence proves closure.

## Surface Coverage

A service closure must cover every relevant surface:

- app-client
- app-partner
- app-captain
- app-field
- control-panel
- webapp
- website when relevant

## Verification

Every service closure must produce an evidence pack under `tools/registry/runs`.
