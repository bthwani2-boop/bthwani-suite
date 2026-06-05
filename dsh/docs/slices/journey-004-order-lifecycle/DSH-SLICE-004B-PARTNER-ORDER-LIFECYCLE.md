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
| Blocking Reason | J-003 is not closed |

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
| CM-004B-01 | app-partner | OrderManagementScreen | PASS |
| CM-004B-02 | backend | PATCH /orders/{id}/status | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Accept order | app-partner | OrderManagementScreen | PATCH /orders/{id}/status (ACCEPTED) | PASS |
| Mark ready for pickup | app-partner | OrderManagementScreen | PATCH /orders/{id}/status (READY) | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| CREATED (new order) | yes | PASS |
| ACCEPTED | yes | PASS |
| READY_FOR_PICKUP | yes | PASS |
| REJECTED | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003D | upstream | order must be created |
| DSH-SLICE-005A | downstream | captain assignment starts after READY |
| DSH-SLICE-004D | lateral | cancellation interacts with partner lifecycle |

## Evidence and Gates
- Runtime evidence: proven via E2E python script (PATCH status changes returning 200 OK)
- Visual evidence: OrderManagementScreen verified responsive
- Evidence path: `tools/registry/runs/DSH_SLICE_004B_PARTNER_ORDER_LIFECYCLE_FINAL_CLOSURE-20260605-041000/`
- Exit gate: 003D PASS + order lifecycle API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `DEFERRED_WITH_REASON` |
| **Reason** | Deferred pending J-003 checkout/payment full closure |
| **Dependency** | J-003 full closure |
| **Next Action** | Await upstream closure |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_004B_PARTNER_ORDER_LIFECYCLE_FINAL_CLOSURE-20260605-041000/` |
| **Closed By** | Antigravity — 2026-06-05T04:10:00Z |
