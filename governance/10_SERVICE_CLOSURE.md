# Service Closure Protocol

## Purpose

This file defines what it means to close a service end-to-end. It is not merely a deprecation policy.

## Closure phases

| Phase | Meaning | Required proof |
|---|---|---|
| 0 Inventory | service exists and scope is known | service blueprint, owner, surfaces |
| 1 UI/UX/Flow | visible journeys exist and are coherent | screenshots, state coverage, RTL where relevant |
| 2 Binding | screens connect to typed clients/adapters | diff, typecheck, binding matrix |
| 3 API/Contract | API behavior is contract-backed | OpenAPI/contract tests |
| 4 Runtime | service works in target environment | logs, smoke, runtime proof |
| 5 Finance | WLT paths are correct if money involved | ledger/refund/settlement evidence |
| 6 Security | auth/secrets/privacy checked | security scan/audit note |
| 7 QA | tests and guards pass | test/CI output |
| 8 Traceability | requirements mapped to artifacts | traceability matrix |
| 9 Closure | decision issued | evidence pack and final decision |

## Golden slice rule

A service closure must start with one golden slice that crosses the most important surfaces. For DSH, use `22_DSH_GOLDEN_SLICE.md`.

## Phase separation

Do not mix phases silently. If a task is UI-only, API/runtime is out of scope unless explicitly approved.

## Closure blockers

- missing service blueprint
- missing surface matrix
- no evidence pack
- no WLT proof for money paths
- no runtime proof for binding claims
- UI screenshots missing for visual work
- untracked/staged changes not accounted for
- TypeScript or critical guard failure
