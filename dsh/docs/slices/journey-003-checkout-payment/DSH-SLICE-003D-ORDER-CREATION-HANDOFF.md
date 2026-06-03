# DSH-SLICE-003D — Order Creation Handoff

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003D` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Upon WLT payment confirmation, DSH creates order record and hands off to J-004 lifecycle |
| Primary Actor | DSH backend (automated on payment callback) |
| Primary Surface | DSH backend / order service |
| WLT Boundary | DSH creates order record; no WLT mutation |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Depends on 003B (checkout intent) and 003C (WLT payment) both being proven |

## Scope
### Included
- POST /orders — created on payment confirmation
- Order record with status CREATED
- Notification to partner and delivery system

### Excluded
| Surface | Reason |
|---|---|
| Payment execution | Covered in 003C |
| Order tracking | Covered in J-004 |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-003D-01 | backend | POST /orders (on callback) | BLOCKED_WITH_REASON |
| CM-003D-02 | app-client | Order confirmation screen | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| (Automatic) Create order on payment confirm | backend | — | POST /orders | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| payment confirmed | yes | BLOCKED |
| order CREATED | yes | BLOCKED |
| order creation failed | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003B | upstream | checkout intent required |
| DSH-SLICE-003C | upstream | WLT payment confirmation required |
| DSH-SLICE-004B | downstream | partner order lifecycle starts after order created |
| DSH-SLICE-004D | downstream | cancellation depends on order existing |

## Evidence and Gates
- Runtime evidence: none yet — blocked
- Visual evidence: none yet
- Exit gate: 003B + 003C PASS + order creation API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | Upstream 003B and 003C not proven; cannot design order creation without confirmed payment contract |
| **Dependency** | DSH-SLICE-003B, DSH-SLICE-003C |
| **Next Action** | Await 003B + 003C proof; then design POST /orders |
