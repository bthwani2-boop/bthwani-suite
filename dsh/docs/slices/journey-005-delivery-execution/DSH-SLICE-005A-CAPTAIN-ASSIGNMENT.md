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
| Blocking Reason | J-004 is not closed |

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
| CM-005A-01 | control-panel | DispatchScreen | PASS |
| CM-005A-02 | backend | POST /orders/{id}/assign-captain | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Manual assign captain | control-panel | DispatchScreen | POST /orders/{id}/assign-captain | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| unassigned | yes | PASS |
| assignment in progress | yes | PASS |
| captain assigned | yes | PASS |
| no captains available | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-004 004B | upstream | order must be READY_FOR_PICKUP |
| DSH-SLICE-005B | downstream | captain must accept before pickup |
| DSH-SLICE-009B | lateral | dispatch screen overlap |

## Evidence and Gates
- Runtime evidence: tools/registry/runs/DSH_SLICE_005A_CAPTAIN_ASSIGNMENT_FINAL_CLOSURE-20260605-042600/03-verification.txt
- Visual evidence: CP DispatchScreen captain list state and manual assign trigger verified
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `DEFERRED_WITH_REASON` |
| **Reason** | Deferred pending J-004 order lifecycle/support full closure |
| **Dependency** | J-003 full closure |
| **Next Action** | Await upstream closure |
