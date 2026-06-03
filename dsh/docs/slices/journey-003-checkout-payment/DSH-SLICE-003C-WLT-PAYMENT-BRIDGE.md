# DSH-SLICE-003C — WLT Payment Bridge

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003C` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Payment executed through WLT wallet; DSH receives confirmation callback only |
| Primary Actor | Client (app-client) via WLT |
| Primary Surface | WLT (external boundary) |
| WLT Boundary | WLT owns all payment execution; DSH is read-only post-confirmation |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | WLT owns this surface; no DSH finance mutation; WLT runtime proof not yet available |

## Scope
### Included
- DSH receives payment-confirmed callback from WLT
- DSH stores payment reference ID (read-only)
- WltBoundaryBanner.tsx displayed during payment step

### Excluded
| Surface | Reason |
|---|---|
| Payment execution logic | WLT owns entirely |
| Wallet balance mutation | WLT owned — DSH never calls WLT financial mutation APIs |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-003C-01 | WLT | Payment execution | BLOCKED_WITH_REASON |
| CM-003C-02 | DSH backend | POST /checkout/payment-callback | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Pay via WLT | WLT surface | WLT-owned screen | WLT payment API | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| awaiting WLT confirmation | yes | BLOCKED |
| payment confirmed | yes | BLOCKED |
| payment failed | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| WLT runtime proof | upstream | WLT must prove payment execution |
| DSH-SLICE-003B | upstream | checkout intent required |
| DSH-SLICE-003D | downstream | order creation triggered by confirmed payment |
| DSH-SLICE-003E | downstream | payment failure handling |

## Evidence and Gates
- Runtime evidence: none yet — blocked on WLT side
- Visual evidence: none yet
- Exit gate: WLT payment runtime proven + DSH callback endpoint designed + integration test

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | WLT owns payment execution; no WLT runtime proof available; DSH cannot proceed without WLT confirmation contract |
| **Dependency** | WLT runtime proof |
| **Next Action** | Await WLT payment proof; design DSH callback contract |
