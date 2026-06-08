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
| Current Status | PASS |
| Blocking Reason | None — verified locally with smoke tests on 2026-06-08 (evidence WLT_INTEGRATION_SMOKE_TEST-20260608-024445) |

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
| CM-010B-01 | DSH backend | POST /settlement/candidates | PASS |
| CM-010B-02 | control-panel | SettlementScreen | PASS |
| CM-010B-03 | WLT | Settlement execution | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View settlement summary | control-panel | SettlementScreen | GET /settlements | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| candidate submitted | yes | PASS |
| settlement pending | yes | PASS |
| settlement confirmed | yes | PASS |
| settlement failed | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-010A | upstream | read bridge must be proven first |
| WLT settlement proof | upstream | WLT must prove settlement execution |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_WLT_SLICE_010B_FINAL_CLOSURE-20260605-062000/` E2E python integration test output (`010b_api_results.json`) showing 4/4 tests passed including authenticated candidate submission, callback handling, read-only list checks, and unauthenticated error cases.
- Visual evidence: Integrated read-only settlement views and summaries on the control panel.
- Exit gate: WLT settlement runtime proven via callback simulation + candidate API designed + DSH read of result + E2E runtime proof.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Eligible orders classification and settlement candidate workflow successfully implemented and E2E tested; final settlement mutations are processed by WLT only |
| **Dependency** | None |
| **Next Action** | None — slice closed |
