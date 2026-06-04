# DSH-SLICE-004A — Client Order Tracking

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-004A` |
| Parent Journey | J-004 — Order Lifecycle |
| Business Outcome | Client can track their order status in real time from creation to delivery |
| Primary Actor | Client (app-client) |
| Primary Surface | app-client / OrderTrackingScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on J-003 close (order must exist before it can be tracked) |

## Scope
### Included
- GET /orders/{id} polling or push for status updates
- Order status timeline: CREATED → ACCEPTED → PICKED_UP → DELIVERED
- Map integration placeholder

### Excluded
| Surface | Reason |
|---|---|
| Delivery map real-time | Covered in J-005 (005D) |
| Cancellation | Covered in 004D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004A-01 | app-client | OrderTrackingScreen | DEFERRED_WITH_REASON |
| CM-004A-02 | backend | GET /orders/{id} | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View order status | app-client | OrderTrackingScreen | GET /orders/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| CREATED | yes | TBD |
| ACCEPTED | yes | TBD |
| PICKED_UP | yes | TBD |
| DELIVERED | yes | TBD |
| CANCELLED | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-003 | upstream | order must exist |
| DSH-SLICE-005D | lateral | delivery map view |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Evidence path: `tools/registry/runs/DSH_SLICE_004A_FULL_UNIVERSAL_CLOSURE-20260604-182500/`
- Exit gate: J-003 closed + order tracking API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `DEFERRED_WITH_REASON` |
| **Reason** | J-003 not closed; no order exists to track |
| **Dependency** | J-003 full closure |
| **Next Action** | Await J-003 close; then design GET /orders/{id} |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_004A_FULL_UNIVERSAL_CLOSURE-20260604-182500/` |
| **Closed By** | Antigravity — 2026-06-04T18:25:00Z |
