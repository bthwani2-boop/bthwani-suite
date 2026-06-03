# DSH-SLICE-005C — Pickup Handoff

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005C` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Captain arrives at partner store and confirms pickup; order status updates to PICKED_UP |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / PickupScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-005B (captain acceptance) |

## Scope
### Included
- Captain confirms arrival at store
- Partner confirms handoff (optional scan/code)
- Order status → PICKED_UP
- Client notification of pickup

### Excluded
| Surface | Reason |
|---|---|
| Captain accept/decline | Covered in 005B |
| Trip milestones | Covered in 005D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005C-01 | app-captain | PickupScreen | DEFERRED_WITH_REASON |
| CM-005C-02 | app-partner | HandoffConfirmationScreen | DEFERRED_WITH_REASON |
| CM-005C-03 | backend | POST /orders/{id}/pickup | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Confirm pickup | app-captain | PickupScreen | POST /orders/{id}/pickup | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| en route to store | yes | TBD |
| arrived | yes | TBD |
| PICKED_UP | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005B | upstream | captain must have accepted |
| DSH-SLICE-005D | downstream | trip milestones start after pickup |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 005B PASS + pickup API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Captain acceptance (005B) not proven |
| **Dependency** | DSH-SLICE-005B |
| **Next Action** | Await 005B PASS; then design pickup handoff API |
