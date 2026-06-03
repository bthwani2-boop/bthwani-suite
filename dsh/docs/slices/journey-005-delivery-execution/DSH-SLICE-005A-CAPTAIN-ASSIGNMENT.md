# DSH-SLICE-005A — Captain Assignment

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005A` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | DSH assigns an available captain to a ready order; captain receives delivery task |
| Primary Actor | DSH backend (automated) / Control-Panel Operator (manual override) |
| Primary Surface | control-panel / DispatchScreen; DSH backend |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on J-004 partner-ready state; no captain pool API designed |

## Scope
### Included
- Automatic captain assignment algorithm (zone-based)
- Manual override from control-panel dispatch screen
- Captain notification of new task

### Excluded
| Surface | Reason |
|---|---|
| Captain accept/decline | Covered in 005B |
| Dispatch exception queue | Covered in 009B |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005A-01 | control-panel | DispatchScreen | DEFERRED_WITH_REASON |
| CM-005A-02 | backend | POST /orders/{id}/assign-captain | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Manual assign captain | control-panel | DispatchScreen | POST /orders/{id}/assign-captain | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| unassigned | yes | TBD |
| assignment in progress | yes | TBD |
| captain assigned | yes | TBD |
| no captains available | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-004 004B | upstream | order must be READY_FOR_PICKUP |
| DSH-SLICE-005B | downstream | captain must accept before pickup |
| DSH-SLICE-009B | lateral | dispatch screen overlap |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: J-004 004B PASS + captain pool API designed + assignment runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | J-004 partner-ready not proven; captain pool not designed |
| **Dependency** | DSH-SLICE-004B |
| **Next Action** | Await 004B PASS; then design captain assignment API |
