# API, Binding, Runtime

## Purpose

This file owns contract format, binding rules, bootstrap vs steady-state truth, and runtime verification.

## Canonical contract root

```text
contracts/master/
```

## Contract format

OpenAPI is the canonical public HTTP contract format for public endpoints.

## Bootstrap phase

During bootstrap, development may start from:

- screen/flow evidence
- runtime logs
- API discovery
- UX need
- request/response observation

But no public endpoint is closed until its public contract exists under `contracts/master/`.

## Steady-state phase

When a contract exists:

- OpenAPI is the legal schema/endpoint reference.
- runtime drift from contract is a defect.
- generated types/clients must derive from contract truth.
- changes require compatibility review.

## Binding chain

```text
Contract -> api-types -> api-clients -> service adapter -> surface binding -> screen state -> runtime proof -> evidence pack
```

## NestJS/backend law

Backend/API work must identify:

- controller/module/provider owner
- DTO/schema
- validation
- auth/permissions
- persistence model
- error model
- observability/logging
- contract/test proof

## Non-HTTP binding

Non-HTTP binding requires:

- adapter owner
- equivalent contract representation
- runtime proof
- failure modes
- security review

## Runtime verification

For API/binding changes, evidence must include:

- contract artifact
- request/response sample or test
- integration/contract test output
- relevant logs
- TypeScript output
- rollback/compatibility note

## Forbidden

- no UI-only task may silently change API/backend
- no backend task may bypass contract evidence
- no secrets in contracts or evidence
- no fixture-only runtime readiness claim
