# DSH Agent Context — Loop 0

Status: DONE_LOCAL
Loop: 0
Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

## Current phase

UI/UX Flow Logic Closure — not final visual design, not runtime, not API, not WLT ledger.

Target: `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE`

## Service scope

DSH is a world-class delivery platform service. It owns the full order lifecycle from client discovery
to captain proof-of-delivery, across mobile apps and a control-panel command room.

## Ownership model

| Owner | Scope |
|---|---|
| DSH | Service UI/UX flow, order lifecycle logic, operational meaning |
| WLT | All money semantics: wallet, ledger, settlement, payout, refund, commission, compensation, cashback, platform fee, financial closure |
| Field | Partner onboarding/activation only — exits order flow after partner activation |
| App shells | Mounting, bootstrap, providers only |
| `@bthwani/ui-kit` | Reusable UI primitives, tokens, design system — no Tamagui direct imports outside ui-kit |
| Control Panel | Operational command room presentation, not DSH service truth |

## Actors covered

- Client (discovery, ordering, tracking, support, rating)
- Partner (intake, prep, handoff, issues)
- Captain (offer, pickup, dropoff, proof, issues)
- Operations (review, monitoring, manual/auto assignment, reassignment, exceptions, audit)
- Field (partner onboarding/activation only)

## Control-panel sections in scope

operations | partners | marketing | finance | support | catalogs

## Contract sequencing rule

OpenAPI is not first.

Sequence:
1. Screen/API Matrix (no invented endpoints)
2. Contract Gap Map (no premature OpenAPI edits)
3. Only then: OpenAPI P0 design, blocked by WLT readiness

`dsh/dsh.openapi.yaml` remains `CONTRACT_TBD` until Screen/API Matrix + Contract Gap Map are complete.

## No final closure

No `PASS`, `CLOSED`, `FINAL`, `100%`, `PRODUCTION READY`, or `RUNTIME CLOSED` without:
- Git diff
- Verification output
- Evidence ZIP
- Screenshots/visual review by human
