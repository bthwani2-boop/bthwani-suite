# DSH-SLICE-010C — Refund & Payout Rules

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-010C` |
| Parent Journey | J-010 — WLT Finance Boundary |
| Business Outcome | Governance rule establishes that DSH never calls WLT financial mutation APIs directly |
| Primary Actor | N/A — governance rule |
| Primary Surface | N/A — architecture governance |
| WLT Boundary | WLT owns all financial mutations; DSH trigger-only via callback |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | WLT-owned; DSH is read-only bridge only |

## Scope
### Included
- Rule: DSH never calls WLT refund or payout APIs directly
- Rule: DSH sends cancellation/failure signals only; WLT decides refund amount and timing
- Enforcement: code review + guard preventing direct WLT mutation calls from DSH code

### Excluded
| Surface | Reason |
|---|---|
| Refund execution | WLT owned — excluded by this very rule |
| Settlement execution | WLT owned — excluded by this rule |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-010C-01 | all | architecture guard | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A — governance rule | N/A | N/A | N/A | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| no DSH → WLT mutation calls | yes | PASS |
| violation detected | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-004E | lateral | refund bridge must comply |
| DSH-SLICE-003C | lateral | payment bridge must comply |
| DSH-SLICE-010B | lateral | settlement candidates only; no mutation |

## Evidence and Gates
- Runtime evidence: Enforced by `guard-platform-vars-control.mjs` checking all DSH directories against forbidden mutation patterns (`ledger/wallet/refund/settlement mutation/write/update`). Verification run `UNIFIED_GUARDS-governance-UI_UX_FLOW-20260605-062940` returned EXIT code 0 (all checks pass successfully).
- Visual evidence: not applicable
- Exit gate: no direct WLT financial mutation calls present in DSH packages; validated and enforced by automated guards.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | WLT-owned read-only bridge; DSH contains zero financial mutation |
| **Dependency | none |
| **Next Action** | Enforce via service boundaries |
