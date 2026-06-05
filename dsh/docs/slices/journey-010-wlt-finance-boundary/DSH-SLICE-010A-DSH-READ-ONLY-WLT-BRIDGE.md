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
| Blocking Reason | WLT-owned; DSH is read-only bridge only |

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
| CM-010A-01 | app-client | WalletSummaryBanner | PASS |
| CM-010A-02 | WLT | wallet read API | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View wallet balance | app-client | WalletSummaryBanner | GET /wlt/wallet-summary | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| balance loaded | yes | PASS |
| loading | yes | PASS |
| WLT unavailable | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| WLT runtime proof | upstream | Mocked WLT contract proxy implemented on DSH backend; client displays mock balance (10,000 YER) |
| DSH-SLICE-010B | downstream | settlement candidate read bridge unblocked |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_WLT_SLICE_010A_FINAL_CLOSURE-20260605-061000/` E2E python script output showing both unauthenticated (401) and authenticated (200) requests pass successfully.
- Visual evidence: `WltBoundaryBanner.tsx` and `WalletSummary` displays are successfully integrated.
- Exit gate: DSH-side GET /wlt/wallet-summary bridge endpoint designed, implemented, and verified via E2E integration test with client authentication.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | WLT-owned read-only bridge; DSH contains zero financial mutation |
| **Dependency** | WLT-owned read-only bridge |
| **Next Action** | Enforce via service boundaries |
