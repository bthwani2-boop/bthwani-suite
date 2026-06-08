# DSH-SLICE-007A — Central Preview Data

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-007A` |
| Parent Journey | J-007 — Data, Media & Fixture Governance |
| Business Outcome | All preview/fixture data consumed from central shared-foundations; no per-surface copies |
| Primary Actor | All surfaces (enforced via build guard) |
| Primary Surface | N/A — perpetual build-time governance |
| WLT Boundary | N/A |
| Current Status | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| Blocking Reason | None for current closure. This is a perpetual governance rule; no runtime closure is possible or intended. |

## Scope
### Included
- Rule: all preview data sourced from `dsh-shared-foundations` package
- Enforcement: `guard-dsh-shared-foundations-final.mjs` CI guard
- Violation = CI failure

### Excluded
| Surface | Reason |
|---|---|
| Runtime screens | This is a build-time governance rule, not a screen slice |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-007A-01 | all | build-time | NOT_APPLICABLE_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| guard passing | yes | enforced via guard-dsh-shared-foundations-final.mjs |
| guard failing (violation) | yes | CI failure |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| All J-002 through J-010 | lateral | all surfaces must comply; violations block CI |

## Evidence and Gates
- Runtime evidence: not applicable — perpetual governance
- Visual evidence: not applicable
- Guard evidence: `guard-dsh-shared-foundations-final` PASS (fail=0, warn=0, info=54)
- Evidence path: `tools/registry/runs/DSH_ALL_SLICES_REALITY_LOCK_AND_J007_GUARDS-20260606-LOCAL/`
- Exit gate: no closure; perpetual — guard must always pass in CI

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| **Reason** | Perpetual governance rule enforced by `guard-dsh-shared-foundations-final.mjs`; guard PASS proves current central preview-data ownership constraints without requiring runtime closure. |
| **Dependency** | CI guard enforcement |
| **Next Action** | Maintain guard; ensure all new fixture usage routes through shared-foundations |
