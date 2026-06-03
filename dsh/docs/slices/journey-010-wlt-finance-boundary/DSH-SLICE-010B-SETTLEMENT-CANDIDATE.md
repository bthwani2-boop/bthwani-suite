# DSH-SLICE-010B — Settlement Candidate

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-010B` |
| Parent Journey | J-010 — WLT Finance Boundary |
| Business Outcome | DSH identifies eligible orders as settlement candidates; WLT executes settlement; DSH reads result |
| Primary Actor | DSH backend (automated) / WLT |
| Primary Surface | control-panel / SettlementScreen (read-only view) |
| WLT Boundary | WLT executes settlement; DSH submits candidates and reads results only |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | WLT settlement not proven; DSH cannot design candidate submission without WLT settlement contract |

## Scope
### Included
- DSH POST /settlement/candidates — submits eligible delivered orders
- DSH reads settlement result from WLT callback
- Control-panel settlement summary view (read-only)

### Excluded
| Surface | Reason |
|---|---|
| Settlement execution | WLT owned |
| Refund/payout rules | Governance rule (010C) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-010B-01 | DSH backend | POST /settlement/candidates | BLOCKED_WITH_REASON |
| CM-010B-02 | control-panel | SettlementScreen | BLOCKED_WITH_REASON |
| CM-010B-03 | WLT | Settlement execution | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View settlement summary | control-panel | SettlementScreen | GET /settlements | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| candidate submitted | yes | BLOCKED |
| settlement pending | yes | BLOCKED |
| settlement confirmed | yes | BLOCKED |
| settlement failed | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-010A | upstream | read bridge must be proven first |
| WLT settlement proof | upstream | WLT must prove settlement execution |

## Evidence and Gates
- Runtime evidence: none yet — blocked on WLT
- Visual evidence: none yet
- Exit gate: WLT settlement runtime proven + candidate API designed + DSH read of result + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | WLT settlement not proven; cannot design candidate submission or read result without WLT settlement contract |
| **Dependency** | WLT settlement runtime proof; DSH-SLICE-010A |
| **Next Action** | Await WLT settlement proof; then design settlement candidate API |
