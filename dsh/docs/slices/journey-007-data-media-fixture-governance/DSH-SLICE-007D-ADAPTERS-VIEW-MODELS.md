# DSH-SLICE-007D — Adapters & View Models

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-007D` |
| Parent Journey | J-007 — Data, Media & Fixture Governance |
| Business Outcome | All API response → screen data transformations happen in adapters/view-models; no raw API shapes in components |
| Primary Actor | All surfaces (enforced via architecture rule) |
| Primary Surface | N/A — perpetual architecture governance |
| WLT Boundary | N/A |
| Current Status | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| Blocking Reason | None for current closure. Perpetual architecture governance rule; no standalone runtime closure is possible or intended. |

## Scope
### Included
- Rule: components consume view-model types only, never raw API response types
- Adapters transform API shapes → view models at transport boundary
- Violation = code review block + guard failure

### Excluded
| Surface | Reason |
|---|---|
| Runtime screens | Architecture governance only |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-007D-01 | all | architecture layer | NOT_APPLICABLE_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| adapter present | yes | enforced via architecture review |
| raw API shape in component | yes | violation — code review block |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| All slices J-001 through J-010 | lateral | all transport bindings must follow adapter pattern |

## Evidence and Gates
- Runtime evidence: not applicable — perpetual governance
- Visual evidence: not applicable
- Guard evidence: J-007 data/media guard pair PASS (`guard-dsh-shared-foundations-final` fail=0/warn=0; `guard-dsh-media-manifest` fail=0/warn=0)
- Evidence path: `tools/registry/runs/DSH_ALL_SLICES_REALITY_LOCK_AND_J007_GUARDS-20260606-LOCAL/`
- Exit gate: no closure; perpetual — adapter pattern enforced in all transport bindings

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | ACTIVE_GOVERNANCE__GUARD_PROVEN |
| **Reason** | Perpetual adapter/view-model rule. Current J-007 guard pair proves shared-foundation and media ownership integrity; runtime closure is not applicable. |
| **Dependency** | Architecture review process |
| **Next Action** | Enforce adapter pattern in all new transport bindings; include in slice review checklist |
