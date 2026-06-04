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
- Evidence path: `tools/registry/runs/DSH_SLICE_004A_CLIENT_ORDER_TRACKING_FINAL_CLOSURE-20260605-001200/`
- Exit gate: J-003 closed + order tracking API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `DEFERRED_WITH_REASON` |
| **Reason** | J-003 checkout/payment is not fully closed (remains BLOCKED_WITH_REASON due to pending auth/WLT runtime proofs); no live order exists to track at runtime |
| **Dependency** | J-003 checkout/payment full closure |
| **Next Action** | Await J-003 full closure; then wire/activate OrderTrackingScreen and capture E2E API runtime + visual proof. |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_004A_CLIENT_ORDER_TRACKING_FINAL_CLOSURE-20260605-001200/` |
| **Closed By** | Antigravity — 2026-06-05T00:12:00Z |
