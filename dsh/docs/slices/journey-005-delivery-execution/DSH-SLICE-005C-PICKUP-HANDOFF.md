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
| Current Status | PASS |

## Scope
### Included
- Captain confirms arrival at store
- Partner confirms handoff (optional scan/code)
- Order status → PICKED_UP
- Client notification of pickup

## Excluded
| Surface | Reason |
|---|---|
| Captain accept/decline | Covered in 005B |
| Trip milestones | Covered in 005D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005C-01 | app-captain | PickupScreen / CaptainPickupConfirmSheet | PASS |
| CM-005C-02 | app-partner | HandoffConfirmationScreen | PASS |
| CM-005C-03 | backend | POST /orders/{id}/pickup | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Confirm pickup | app-captain | PickupScreen / CaptainPickupConfirmSheet | POST /orders/{id}/pickup | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| en route to store | yes | PASS |
| arrived | yes | PASS |
| PICKED_UP | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005B | upstream | captain must have accepted — 005B PASS |
| DSH-SLICE-005D | downstream | trip milestones start after pickup |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_005C_PICKUP_HANDOFF_FINAL_CLOSURE-20260606-LOCAL/`
- Backend confirmation: `POST /orders/{id}/pickup` registered in orders_handler.go
- Visual evidence: `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/dsh_j005_app_captain_order_detail.png`
- Code evidence: app-captain uses injectable `captainId` for pickup; normalizes preview order ids before calling typed lifecycle client
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | J-004 closed. `POST /orders/{id}/pickup` confirmed in production handler. E2E evidence covers pickup flow. App-captain identity injectable. Partner handoff confirmation scoped: optional scan/code deferred to infra layer; core pickup endpoint proven. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |
