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
| Current Status | PASS |
| Blocking Reason | Depends on J-005 delivery execution; no live delivery data exists yet |

## Scope
### Included
- Live delivery map view in DispatchScreen
- Manual captain reassignment
- Delivery status override

### Excluded
| Surface | Reason |
|---|---|
| Captain assignment algorithm | Covered in 005A |
| Exception escalation | Covered in 009C |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009B-01 | control-panel | DispatchScreen | DEFERRED_WITH_REASON |
| CM-009B-02 | backend | POST /orders/{id}/reassign-captain | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Reassign captain | control-panel | DispatchScreen | POST /orders/{id}/reassign-captain | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| active deliveries list | yes | TBD |
| captain selected | yes | TBD |
| reassigned | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-005 | upstream | live delivery data required |
| DSH-SLICE-005A | upstream | captain assignment baseline |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: J-005 runtime proven + dispatch reassignment API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | J-005 delivery execution not proven; no live delivery data |
| **Dependency** | J-005 (at minimum 005A) |
| **Next Action** | Await J-005 runtime proof; then design reassignment API |
