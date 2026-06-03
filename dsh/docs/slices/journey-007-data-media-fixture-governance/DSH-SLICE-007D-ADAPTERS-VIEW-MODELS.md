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
| Current Status | NOT_APPLICABLE_WITH_REASON |
| Blocking Reason | Perpetual architecture governance rule; no runtime closure possible or intended |

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
- Exit gate: no closure; perpetual — adapter pattern enforced in all transport bindings

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | NOT_APPLICABLE_WITH_REASON |
| **Reason** | Perpetual architecture governance rule; no runtime closure possible or required |
| **Dependency** | Architecture review process |
| **Next Action** | Enforce adapter pattern in all new transport bindings; include in slice review checklist |
