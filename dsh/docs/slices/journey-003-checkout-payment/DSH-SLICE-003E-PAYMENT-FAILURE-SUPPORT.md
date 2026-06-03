# DSH-SLICE-003E — Payment Failure Support

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003E` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client receives clear failure feedback and recovery path when WLT payment fails |
| Primary Actor | Client (app-client) |
| Primary Surface | app-client / CheckoutFailureScreen |
| WLT Boundary | DSH displays failure state only; WLT owns failure reason |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Depends on 003C WLT payment bridge being proven; failure contract requires WLT error spec |

## Scope
### Included
- Payment failure screen with reason from WLT callback
- Retry and cancel options
- Cart preserved on failure

### Excluded
| Surface | Reason |
|---|---|
| Refund/payout on failure | Covered in J-004 (004E) |
| WLT failure handling internals | WLT owned |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-003E-01 | app-client | CheckoutFailureScreen | BLOCKED_WITH_REASON |
| CM-003E-02 | backend | payment failure callback handling | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Retry payment | app-client | CheckoutFailureScreen | Re-enter 003C flow | BLOCKED_WITH_REASON |
| Cancel checkout | app-client | CheckoutFailureScreen | DELETE /checkout/intent/{id} | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| payment failed | yes | BLOCKED |
| retry in progress | yes | BLOCKED |
| cancelled | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003C | upstream | WLT payment bridge + error contract needed |

## Evidence and Gates
- Runtime evidence: none yet — blocked
- Visual evidence: none yet
- Exit gate: 003C PASS + WLT failure error spec available + failure screen built + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | WLT payment bridge (003C) not proven; failure contract requires WLT error specification |
| **Dependency** | DSH-SLICE-003C |
| **Next Action** | Await 003C proof; get WLT failure error spec; design failure screen |
