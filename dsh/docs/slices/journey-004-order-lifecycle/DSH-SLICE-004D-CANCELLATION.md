# DSH-SLICE-004D — Cancellation

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-004D` |
| Parent Journey | J-004 — Order Lifecycle |
| Business Outcome | Client or partner can cancel an order within the cancellation window; refund initiated via WLT bridge |
| Primary Actor | Client (app-client) / Partner (app-partner) |
| Primary Surface | app-client / OrderTrackingScreen; app-partner / OrderManagementScreen |
| WLT Boundary | Refund execution owned by WLT (004E); DSH sends cancellation signal only |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-003D (order creation) and DSH-SLICE-004B (partner lifecycle) |

## Scope
### Included
- Client cancel within window (before PICKED_UP)
- Partner cancel / reject
- Cancellation reason collection
- Trigger refund bridge (004E) after cancellation confirmed

### Excluded
| Surface | Reason |
|---|---|
| Refund execution | Covered in 004E (WLT) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004D-01 | app-client | OrderTrackingScreen (cancel CTA) | DEFERRED_WITH_REASON |
| CM-004D-02 | app-partner | OrderManagementScreen (reject/cancel) | DEFERRED_WITH_REASON |
| CM-004D-03 | backend | POST /orders/{id}/cancel | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Cancel order | app-client | OrderTrackingScreen | POST /orders/{id}/cancel | DEFERRED_WITH_REASON |
| Reject / cancel | app-partner | OrderManagementScreen | POST /orders/{id}/cancel | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| cancellable | yes | TBD |
| cancellation window expired | yes | TBD |
| CANCELLED | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003D | upstream | order must exist |
| DSH-SLICE-004B | upstream | partner lifecycle state affects cancellability |
| DSH-SLICE-004E | downstream | refund triggered after cancellation |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Evidence path: `tools/registry/runs/DSH_SLICE_004D_CANCELLATION_FINAL_CLOSURE-20260604-185000/`
- Exit gate: 003D + 004B PASS + cancellation API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `DEFERRED_WITH_REASON` |
| **Reason** | Upstream 003D and 004B not proven |
| **Dependency** | DSH-SLICE-003D, DSH-SLICE-004B |
| **Next Action** | Await 003D + 004B close; then design cancellation API |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_004D_CANCELLATION_FINAL_CLOSURE-20260604-185000/` |
| **Closed By** | Antigravity — 2026-06-04T18:50:00Z |
