# DSH-SLICE-010A — DSH Read-Only WLT Bridge

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-010A` |
| Parent Journey | J-010 — WLT Finance Boundary |
| Business Outcome | DSH reads wallet balance and transaction summary from WLT for display only; never mutates |
| Primary Actor | Client (app-client) / Control-Panel Operator |
| Primary Surface | app-client / WalletSummaryBanner; WltBoundaryBanner.tsx |
| WLT Boundary | DSH is read-only; WLT owns all finance data and mutations |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | WLT owns all finance; no WLT runtime proof yet; DSH read bridge cannot be designed without WLT read contract |

## Scope
### Included
- GET /wlt/wallet-summary (read-only DSH consumer)
- WltBoundaryBanner.tsx display in finance screens
- Display: balance, last transaction summary

### Excluded
| Surface | Reason |
|---|---|
| Settlement | Covered in 010B |
| Refund/payout rules | Governance rule (010C) |
| Finance screen ownership | Governance rule (010D) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-010A-01 | app-client | WalletSummaryBanner | BLOCKED_WITH_REASON |
| CM-010A-02 | WLT | wallet read API | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View wallet balance | app-client | WalletSummaryBanner | GET /wlt/wallet-summary | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| balance loaded | yes | BLOCKED |
| loading | yes | BLOCKED |
| WLT unavailable | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| WLT runtime proof | upstream | WLT read API contract required |
| DSH-SLICE-010B | downstream | settlement candidate requires read bridge |

## Evidence and Gates
- Runtime evidence: none yet — blocked on WLT
- Visual evidence: none yet
- Exit gate: WLT runtime proven + WLT read contract available + bridge endpoint designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | WLT owns all finance data; no WLT runtime proof available; DSH cannot design read bridge without WLT read API contract |
| **Dependency** | WLT runtime proof |
| **Next Action** | Await WLT runtime proof; get WLT read API contract; design DSH read-only bridge |
