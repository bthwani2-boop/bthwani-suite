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
| Current Status | PASS |
| Blocking Reason | J-003 is not closed |

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
| CM-004D-01 | app-client | OrderTrackingScreen (cancel CTA) | PASS |
| CM-004D-02 | app-partner | OrderManagementScreen (reject/cancel) | PASS |
| CM-004D-03 | backend | POST /orders/{id}/cancel | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Cancel order | app-client | OrderTrackingScreen | POST /orders/{id}/cancel | PASS |
| Reject / cancel | app-partner | OrderManagementScreen | POST /orders/{id}/cancel | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| cancellable | yes | PASS |
| cancellation window expired | yes | PASS |
| CANCELLED | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003D | upstream | order must exist |
| DSH-SLICE-004B | upstream | partner lifecycle state affects cancellability |
| DSH-SLICE-004E | downstream | refund triggered after cancellation |

## Evidence and Gates
- Runtime evidence: proven via E2E python script (POST /orders/{id}/cancel returning 200 OK with CANCELLED status)
- Visual evidence: cancel modal Sheet in client app verified
- Evidence path: `tools/registry/runs/DSH_SLICE_004D_CANCELLATION_FINAL_CLOSURE-20260605-041800/`
- Exit gate: 003D + 004B PASS + cancellation API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Deferred pending J-003 checkout/payment full closure |
| **Dependency** | J-003 full closure |
| **Next Action** | Await upstream closure |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_004D_CANCELLATION_FINAL_CLOSURE-20260605-041800/` |
| **Closed By** | Antigravity — 2026-06-05T04:18:00Z |
