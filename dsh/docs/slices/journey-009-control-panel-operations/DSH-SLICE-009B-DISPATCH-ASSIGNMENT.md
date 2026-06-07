# DSH-SLICE-009B — Dispatch Assignment

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-009B` |
| Parent Journey | J-009 — Control Panel Operations |
| Business Outcome | Control-panel can view active deliveries and manually reassign captains when needed |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / DispatchScreen |
| WLT Boundary | No finance mutation |
| Current Status | NEEDS_VISUAL_AND_RUNTIME_EVIDENCE |

## Scope
### Included
- Live delivery map view in DispatchScreen
- Manual captain assignment/reassignment via `POST /orders/{id}/assign-captain` (idempotent — covers initial and override)
- Delivery status override

### Excluded
| Surface | Reason |
|---|---|
| Captain assignment algorithm | Covered in 005A |
| Exception escalation | Covered in 009C |
| Distinct `/reassign-captain` endpoint | Deferred to infra layer; assign-captain is idempotent and covers CP manual override |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009B-01 | control-panel | DispatchScreen | PASS |
| CM-009B-02 | backend | POST /orders/{id}/assign-captain (covers initial + CP override) | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Assign / reassign captain | control-panel | DispatchScreen | POST /orders/{id}/assign-captain | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| active deliveries list | yes | PASS — GET /orders with status filter |
| captain selected | yes | PASS |
| reassigned | yes | PASS — assign-captain idempotent override |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-005 | upstream | J-005 now PASS; live delivery data proven |
| DSH-SLICE-005A | upstream | captain assignment baseline — PASS |

## Evidence and Gates
- Runtime evidence: tools/registry/runs/DSH_SLICE_009B_DISPATCH_ASSIGNMENT_FINAL_CLOSURE-20260606-LOCAL/
- Backend confirmation: `POST /orders/{id}/assign-captain` confirmed in orders_handler.go
- J-005 upstream closure: PASS (005A–005F all closed)
- J-004 upstream closure: PASS
- Dispatch board uses assign-captain idempotent endpoint; distinct `/reassign-captain` deferred to infra
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | NEEDS_VISUAL_AND_RUNTIME_EVIDENCE |
| **Reason** | J-005 fully closed. Backend `POST /orders/{id}/assign-captain` is idempotent and serves both initial assignment and CP manual override/reassignment. Live delivery data now proven through J-005 E2E chain. Distinct `/reassign-captain` endpoint is a future infra-layer enhancement — not a blocker for CP dispatch operations. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |
