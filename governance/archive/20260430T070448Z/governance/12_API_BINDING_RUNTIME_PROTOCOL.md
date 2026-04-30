---
generatedFrom: governance/12_API_BINDING_RUNTIME_PROTOCOL.md
generatedAt: 2026-04-30T04:48:37.2047799+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# API / Binding / Runtime Protocol

## Purpose

This protocol defines the mandatory order for API, binding, integration, runtime, backend, and production readiness.

## Order

```text
1. Contract / API Forensics
2. OpenAPI / contract source decision
3. API types generation or alignment
4. API clients generation or alignment
5. Binding layer design
6. Surface binding integration
7. Runtime provider wiring
8. Backend/service readiness
9. Auth/RBAC/privacy/audit
10. Observability/logging/monitoring
11. Test pyramid/E2E
12. Production readiness gate
```

## Ownership

| Layer | Owner |
|---|---|
| Contracts | `contracts` when present |
| API Types | `packages/api-types` when present |
| API Clients | `packages/api-clients` when present |
| UI Binding | surfaces or dedicated binding package when defined |
| Runtime Providers | app-shell/app integration layer when defined |
| Backend | `services` when present |

## Forbidden Shortcuts

- UI must not call backend implementation directly.
- app-shells must not hide service-specific API binding.
- ui-kit must not know API or service runtime.
- fake fixtures must not be treated as production binding.
- runtime work must not start before contract/API ownership is decided.

## DSH Application

For DSH, API/binding/runtime starts only after DSH UI/flow and gap map are clear, unless a separate phase explicitly targets contract forensics.

## Verification

Each layer must prove:

- owner path
- public exports
- generated or hand-written source
- consumer path
- test/verification command
- evidence pack

No API/binding/integration claim is accepted without runnable verification.

