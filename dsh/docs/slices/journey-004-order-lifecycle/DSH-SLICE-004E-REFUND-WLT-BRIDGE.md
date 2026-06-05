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
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | J-003 is not closed |

## Scope
### Included
- DSH receives refund-confirmed callback from WLT (`POST /orders/{id}/refund-callback`)
- DSH handles FAILED and CONFIRMED statuses correctly
- DSH updates order status to REFUNDED only on CONFIRMED status
- Client notification and orders tracking UI correctly reflect the refund state

### Excluded
| Surface | Reason |
|---|---|
| Refund execution | WLT owned — DSH never calls WLT financial mutation APIs |
| Refund amount calculation | WLT responsibility |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004E-01 | WLT | Refund execution | PASS |
| CM-004E-02 | DSH backend | POST /orders/{id}/refund-callback | PASS |
| CM-004E-03 | app-client | Refund status notification | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| (Automatic) Receive refund callback | backend | — | POST /orders/{id}/refund-callback | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| refund initiated | yes | PASS |
| refund confirmed | yes | PASS |
| refund failed | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-004D | upstream | cancellation must be confirmed |
| WLT runtime proof | upstream | WLT must prove refund execution |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_004E_REFUND_WLT_BRIDGE_FINAL_CLOSURE-20260605-060000/`
- Visual evidence: client state mapping and orders tracking screen verified
- Exit gate: WLT refund callback integration verified with 9 E2E steps (all PASS)

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `DEFERRED_WITH_REASON` |
| **Reason** | Deferred pending J-003 checkout/payment full closure |
| **Dependency** | J-003 full closure |
| **Next Action** | Await upstream closure |
