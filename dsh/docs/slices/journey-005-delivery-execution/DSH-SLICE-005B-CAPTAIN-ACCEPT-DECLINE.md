# DSH-SLICE-005B — Captain Accept / Decline

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005B` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Assigned captain can accept or decline a delivery task; decline triggers reassignment |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / TaskScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-005A (captain assignment) being proven |

## Scope
### Included
- Captain task notification with order details
- Accept action → status ACCEPTED_BY_CAPTAIN
- Decline action → triggers reassignment flow

### Excluded
| Surface | Reason |
|---|---|
| Captain assignment logic | Covered in 005A |
| Pickup handoff | Covered in 005C |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005B-01 | app-captain | TaskScreen | DEFERRED_WITH_REASON |
| CM-005B-02 | backend | POST /tasks/{id}/accept + /decline | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Accept task | app-captain | TaskScreen | POST /tasks/{id}/accept | DEFERRED_WITH_REASON |
| Decline task | app-captain | TaskScreen | POST /tasks/{id}/decline | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| task pending | yes | TBD |
| accepted | yes | TBD |
| declined | yes | TBD |
| timeout / auto-decline | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005A | upstream | assignment must exist |
| DSH-SLICE-005C | downstream | pickup handoff starts after accept |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 005A PASS + task accept/decline API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Captain assignment (005A) not proven |
| **Dependency** | DSH-SLICE-005A |
| **Next Action** | Await 005A PASS; then design captain accept/decline API |
