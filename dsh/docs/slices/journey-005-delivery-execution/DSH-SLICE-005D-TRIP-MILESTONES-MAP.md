# DSH-SLICE-005D — Trip Milestones & Map

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005D` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Client and captain see real-time delivery map with trip milestones during active delivery |
| Primary Actor | Client (app-client) / Captain (app-captain) |
| Primary Surface | app-client / LiveTrackingScreen; app-captain / NavigationScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-005C (pickup handoff); location streaming infra not designed |

## Scope
### Included
- Captain real-time location push to DSH
- Client live map view of captain position
- Milestone events: PICKED_UP → EN_ROUTE → ARRIVED → DELIVERED

### Excluded
| Surface | Reason |
|---|---|
| Proof of delivery | Covered in 005E |
| Navigation algorithm | Third-party map integration |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005D-01 | app-client | LiveTrackingScreen | DEFERRED_WITH_REASON |
| CM-005D-02 | app-captain | NavigationScreen | DEFERRED_WITH_REASON |
| CM-005D-03 | backend | location streaming / WebSocket | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View live tracking | app-client | LiveTrackingScreen | WS /track/{orderId} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| PICKED_UP | yes | TBD |
| EN_ROUTE | yes | TBD |
| ARRIVED | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005C | upstream | pickup must have occurred |
| DSH-SLICE-005E | downstream | proof of delivery follows |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 005C PASS + location streaming designed + map integration + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Pickup handoff (005C) not proven; location streaming infra not designed |
| **Dependency** | DSH-SLICE-005C |
| **Next Action** | Await 005C PASS; design location streaming |
