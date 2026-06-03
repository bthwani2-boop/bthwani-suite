# DSH-SLICE-003A — Cart Serviceability

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003A` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client cart validates that selected items and store are serviceable before checkout proceeds |
| Primary Actor | Client (app-client) |
| Primary Surface | app-client / CartScreen |
| WLT Boundary | No finance mutation |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Blocked by WLT/auth proof; client identity required to associate cart |

## Scope
### Included
- Cart serviceability check: store open, items available, delivery zone valid
- GET /cart/serviceability endpoint
- Client auth token required

### Excluded
| Surface | Reason |
|---|---|
| Payment | Covered in 003C |
| Order creation | Covered in 003D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-003A-01 | app-client | CartScreen | BLOCKED_WITH_REASON |
| CM-003A-02 | backend | GET /cart/serviceability | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Proceed to checkout | app-client | CartScreen | GET /cart/serviceability | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| serviceable | yes | BLOCKED |
| not serviceable (reason) | yes | BLOCKED |
| loading | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| WLT auth proof | upstream | client identity required |
| DSH-SLICE-003B | downstream | checkout intent depends on serviceability pass |

## Evidence and Gates
- Runtime evidence: none yet — blocked
- Visual evidence: none yet
- Exit gate: WLT auth proven + serviceability API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | Client identity (WLT/auth) not yet proven; cannot associate cart without auth |
| **Dependency** | WLT auth proof |
| **Next Action** | Await WLT auth proof; then design serviceability endpoint |
