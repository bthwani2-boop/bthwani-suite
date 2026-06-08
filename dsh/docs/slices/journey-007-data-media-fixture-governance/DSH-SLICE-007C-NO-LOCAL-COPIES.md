# DSH-SLICE-007C — No Local Copies

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-007C` |
| Parent Journey | J-007 — Data, Media & Fixture Governance |
| Business Outcome | No surface duplicates fixture data or media locally; all consumption is via shared-foundations imports |
| Primary Actor | All surfaces (enforced via build guard) |
| Primary Surface | N/A — perpetual build-time governance |
| WLT Boundary | N/A |
| Current Status | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| Blocking Reason | None for current closure. Perpetual governance rule; no runtime closure is possible or intended. |

## Scope
### Included
- Rule: no local copies of fixture data or media in surface packages
- Enforcement: guard detects duplicate asset files and local fixture definitions
- Violation = CI failure

### Excluded
| Surface | Reason |
|---|---|
| Runtime screens | Build-time governance rule only |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-007C-01 | all | build-time | NOT_APPLICABLE_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no local copies detected | yes | enforced via CI guard |
| local copy detected | yes | CI failure |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-007A | lateral | same principle — central data, no copies |
| DSH-SLICE-007B | lateral | media must also not be locally copied |

## Evidence and Gates
- Runtime evidence: not applicable — perpetual governance
- Visual evidence: not applicable
- Guard evidence: `guard-dsh-shared-foundations-final` PASS (fail=0, warn=0, info=54)
- Evidence path: `tools/registry/runs/DSH_ALL_SLICES_REALITY_LOCK_AND_J007_GUARDS-20260606-LOCAL/`
- Exit gate: no closure; perpetual — guard must always pass

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| **Reason** | Perpetual governance rule enforced by `guard-dsh-shared-foundations-final.mjs`; guard PASS proves current no-local-divergent-copy constraints without requiring runtime closure. |
| **Dependency** | CI guard enforcement |
| **Next Action** | Maintain guard; remove any local copies detected by violations |
