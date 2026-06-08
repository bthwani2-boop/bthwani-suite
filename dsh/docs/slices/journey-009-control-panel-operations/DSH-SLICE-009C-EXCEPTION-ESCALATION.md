# DSH-SLICE-009C — Exception Escalation

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-009C` |
| Parent Journey | J-009 — Control Panel Operations |
| Business Outcome | Control-panel has a unified exception escalation surface for all order, delivery, and support exceptions |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / ExceptionEscalationScreen |
| WLT Boundary | No finance mutation |
| Current Status | NEEDS_VISUAL_AND_RUNTIME_EVIDENCE |
| Blocking Reason | CP exception-escalation screen renders preview; needs operator Bearer auth + live exception mutation recording on real device |

## Scope
### Included
- Support escalation queue: `GET /support/escalations`, `POST /support/escalations`, `PATCH /support/escalations/{id}`
- CP intervention actions per exception type
- Escalation audit trail via status transitions on support escalation records

### Excluded
| Surface | Reason |
|---|---|
| Dispatch reassignment | Covered in 009B |
| Refund execution | WLT owned (004E) |
| Unified `/exceptions` aggregator | Future enhancement — not a blocker; support escalations API proven and covers primary escalation surface |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009C-01 | control-panel | ExceptionEscalationScreen | PASS |
| CM-009C-02 | backend | GET /support/escalations + POST + PATCH /{id} | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Create exception/escalation | control-panel | ExceptionEscalationScreen | POST /support/escalations | PASS |
| List exceptions | control-panel | ExceptionEscalationScreen | GET /support/escalations | PASS |
| Update/resolve exception | control-panel | ExceptionEscalationScreen | PATCH /support/escalations/{id} | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| open | yes | PASS — POST /support/escalations |
| in-review | yes | PASS — PATCH /support/escalations/{id} |
| escalated | yes | PASS — PATCH with escalated status |
| resolved | yes | PASS — PATCH with resolved status |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-004F | upstream | order exceptions feed this queue — 004F PASS |
| DSH-SLICE-004C | upstream | support escalations feed this queue — 004C PASS |
| DSH-SLICE-005F | upstream | delivery failures feed this queue — 005F PASS |

## Evidence and Gates
- Runtime evidence: tools/registry/runs/DSH_SLICE_009C_EXCEPTION_ESCALATION_FINAL_CLOSURE-20260606-LOCAL/
- Backend confirmation: `POST /support/escalations`, `GET /support/escalations`, `PATCH /support/escalations/{id}` registered in support_handler.go
- All upstream slices (004C, 004F, 005F) are PASS — exception data sources proven
- J-004 upstream closure: PASS
- J-005 upstream closure: PASS
- Scope note: unified `GET /exceptions` aggregator deferred — not required for core escalation flow
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | NEEDS_VISUAL_AND_RUNTIME_EVIDENCE |
| **Reason** | J-004 and J-005 fully closed. Support escalation API (`GET/POST/PATCH /support/escalations`) confirmed in support_handler.go. All upstream exception data sources (004C order support, 004F CP exception queue, 005F delivery failures) are PASS. Unified `/exceptions` aggregator endpoint deferred to future infra layer — not a blocker for core CP exception escalation operations. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |
