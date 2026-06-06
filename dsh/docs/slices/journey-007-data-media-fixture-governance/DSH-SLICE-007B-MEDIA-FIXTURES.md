# DSH-SLICE-007B — Media Fixtures

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-007B` |
| Parent Journey | J-007 — Data, Media & Fixture Governance |
| Business Outcome | All media (images, icons, assets) governed by DSH media manifest; no unregistered media in surfaces |
| Primary Actor | All surfaces (enforced via build guard) |
| Primary Surface | N/A — perpetual build-time governance |
| WLT Boundary | N/A |
| Current Status | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| Blocking Reason | None for current closure. Perpetual governance rule; enforced via guard-dsh-media-manifest.mjs; no runtime closure. |

## Scope
### Included
- Rule: all media assets registered in DSH media manifest
- Enforcement: `guard-dsh-media-manifest.mjs` CI guard
- New media must be added to manifest before use

### Excluded
| Surface | Reason |
|---|---|
| Runtime screens | Build-time governance rule only |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-007B-01 | all | build-time | NOT_APPLICABLE_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| manifest valid | yes | enforced via guard-dsh-media-manifest.mjs |
| unregistered media detected | yes | CI failure |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002C | lateral | product media uploads must comply |
| DSH-SLICE-006C | lateral | field readiness media must comply |

## Evidence and Gates
- Runtime evidence: not applicable — perpetual governance
- Visual evidence: not applicable
- Guard evidence: `guard-dsh-media-manifest` PASS (fail=0, warn=0, info=50)
- Evidence path: `tools/registry/runs/DSH_ALL_SLICES_REALITY_LOCK_AND_J007_GUARDS-20260606-LOCAL/`
- Exit gate: no closure; perpetual — guard must always pass

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| **Reason** | Perpetual governance rule enforced by `guard-dsh-media-manifest.mjs`; guard PASS proves current media manifest integrity without requiring runtime closure. |
| **Dependency** | CI guard enforcement |
| **Next Action** | Maintain guard; register all new media in manifest before use |
