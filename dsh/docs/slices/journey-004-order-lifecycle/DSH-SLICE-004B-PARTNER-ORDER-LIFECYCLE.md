# DSH-SLICE-004B — Partner Order Lifecycle

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-004B` |
| Parent Journey | J-004 — Order Lifecycle |
| Business Outcome | Partner can view, accept, and prepare incoming orders; status updates flow to client |
| Primary Actor | Partner (app-partner) |
| Primary Surface | app-partner / OrderManagementScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-003D (order creation) being proven |

## Scope
### Included
- Incoming order notification to partner
- Accept / reject order action
- Mark as READY_FOR_PICKUP action

### Excluded
| Surface | Reason |
|---|---|
| Captain assignment | Covered in J-005 (005A) |
| Cancellation | Covered in 004D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004B-01 | app-partner | OrderManagementScreen | DEFERRED_WITH_REASON |
| CM-004B-02 | backend | PATCH /orders/{id}/status | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Accept order | app-partner | OrderManagementScreen | PATCH /orders/{id}/status (ACCEPTED) | DEFERRED_WITH_REASON |
| Mark ready for pickup | app-partner | OrderManagementScreen | PATCH /orders/{id}/status (READY) | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| CREATED (new order) | yes | TBD |
| ACCEPTED | yes | TBD |
| READY_FOR_PICKUP | yes | TBD |
| REJECTED | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003D | upstream | order must be created |
| DSH-SLICE-005A | downstream | captain assignment starts after READY |
| DSH-SLICE-004D | lateral | cancellation interacts with partner lifecycle |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 003D PASS + order lifecycle API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Order creation (003D) not yet proven |
| **Dependency** | DSH-SLICE-003D |
| **Next Action** | Await 003D close; then design partner order lifecycle API |
