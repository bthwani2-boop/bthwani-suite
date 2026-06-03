# DSH-SLICE-003B — Checkout Intent

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003B` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client submits checkout intent; system reserves items and prepares order for payment |
| Primary Actor | Client (app-client) |
| Primary Surface | app-client / CheckoutScreen |
| WLT Boundary | No finance mutation at this step; payment handled in 003C |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Blocked by WLT/auth proof; also depends on 003A serviceability |

## Scope
### Included
- POST /checkout/intent — creates checkout session with reserved items
- CheckoutScreen address/delivery-time selection
- Session token returned for payment step

### Excluded
| Surface | Reason |
|---|---|
| Payment execution | Covered in 003C (WLT bridge) |
| Order creation | Covered in 003D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-003B-01 | app-client | CheckoutScreen | BLOCKED_WITH_REASON |
| CM-003B-02 | backend | POST /checkout/intent | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Confirm checkout | app-client | CheckoutScreen | POST /checkout/intent | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| address entry | yes | BLOCKED |
| intent created | yes | BLOCKED |
| intent failed | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-003A | upstream | serviceability must pass |
| WLT auth proof | upstream | client identity required |
| DSH-SLICE-003C | downstream | WLT payment bridge receives session token |
| DSH-SLICE-003D | downstream | order creation depends on intent + payment |

## Evidence and Gates
- Runtime evidence: none yet — blocked
- Visual evidence: none yet
- Exit gate: WLT auth proven + 003A PASS + checkout intent API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | WLT/auth proof pending; 003A not yet proven |
| **Dependency** | WLT auth proof; DSH-SLICE-003A |
| **Next Action** | Await WLT auth proof + 003A close |
