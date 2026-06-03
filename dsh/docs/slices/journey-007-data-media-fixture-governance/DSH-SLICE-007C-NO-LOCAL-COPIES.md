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
| Current Status | NOT_APPLICABLE_WITH_REASON |
| Blocking Reason | Perpetual governance rule; no runtime closure possible or intended |

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
- Exit gate: no closure; perpetual — guard must always pass

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | NOT_APPLICABLE_WITH_REASON |
| **Reason** | Perpetual governance rule; no runtime closure possible or required; enforced by CI guard |
| **Dependency** | CI guard enforcement |
| **Next Action** | Maintain guard; remove any local copies detected by violations |
