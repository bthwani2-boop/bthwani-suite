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
| Current Status | NOT_APPLICABLE_WITH_REASON |
| Blocking Reason | Governance rule — no runtime closure needed; DSH never calls WLT financial mutation APIs |

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
| CM-010C-01 | all | architecture guard | NOT_APPLICABLE_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A — governance rule | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no DSH → WLT mutation calls | yes | enforced via code review + guard |
| violation detected | yes | code review block + CI failure |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-004E | lateral | refund bridge must comply |
| DSH-SLICE-003C | lateral | payment bridge must comply |
| DSH-SLICE-010B | lateral | settlement candidates only; no mutation |

## Evidence and Gates
- Runtime evidence: not applicable — governance rule
- Visual evidence: not applicable
- Exit gate: no closure; perpetual — DSH code must never contain direct WLT financial mutation calls

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | NOT_APPLICABLE_WITH_REASON |
| **Reason** | Governance rule — DSH never calls WLT financial mutation APIs; no runtime implementation or closure required |
| **Dependency** | Code review enforcement |
| **Next Action** | Add guard to CI detecting direct WLT mutation API calls from DSH packages |
