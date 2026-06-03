# DSH-SLICE-004E — Refund WLT Bridge

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-004E` |
| Parent Journey | J-004 — Order Lifecycle |
| Business Outcome | After cancellation or failure, refund is executed by WLT; DSH receives confirmation callback |
| Primary Actor | WLT (automated) |
| Primary Surface | WLT (external boundary) |
| WLT Boundary | WLT owns refund execution entirely; DSH is read-only |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | WLT owns refund execution; no WLT refund runtime proof available |

## Scope
### Included
- DSH receives refund-confirmed callback from WLT
- DSH updates order status to REFUNDED
- Client notification of refund status

### Excluded
| Surface | Reason |
|---|---|
| Refund execution | WLT owned — DSH never calls WLT financial mutation APIs |
| Refund amount calculation | WLT responsibility |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004E-01 | WLT | Refund execution | BLOCKED_WITH_REASON |
| CM-004E-02 | DSH backend | POST /orders/{id}/refund-callback | BLOCKED_WITH_REASON |
| CM-004E-03 | app-client | Refund status notification | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| (Automatic) Receive refund callback | backend | — | POST /orders/{id}/refund-callback | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| refund initiated | yes | BLOCKED |
| refund confirmed | yes | BLOCKED |
| refund failed | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-004D | upstream | cancellation must be confirmed |
| WLT runtime proof | upstream | WLT must prove refund execution |

## Evidence and Gates
- Runtime evidence: none yet — blocked on WLT
- Visual evidence: none yet
- Exit gate: WLT refund runtime proven + DSH callback contract designed + integration test

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | WLT owns refund execution; no WLT runtime proof; DSH cannot design callback without WLT contract |
| **Dependency** | WLT refund runtime proof |
| **Next Action** | Await WLT refund proof; then design DSH refund-callback endpoint |
