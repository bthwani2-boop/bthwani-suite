# DSH-SLICE-008A — Provider Policy

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-008A` |
| Parent Journey | J-008 — Platform Vars & Provider |
| Business Outcome | All DSH surfaces consume platform variables via a single provider; no scattered env-var reads |
| Primary Actor | All surfaces |
| Primary Surface | platform route / PlatformVarsProvider |
| WLT Boundary | N/A |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No slice manifest yet; platform route exists but provider policy not formally documented or enforced |

## Scope
### Included
- PlatformVarsProvider contract: which vars are exposed, types, defaults
- Policy: surfaces read from provider only; no direct process.env reads in UI code
- Provider initialization at app root

### Excluded
| Surface | Reason |
|---|---|
| Feature flags | Covered in 008B |
| Scope audit | Covered in 008C |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-008A-01 | all apps | PlatformVarsProvider root | DEFERRED_WITH_REASON |
| CM-008A-02 | platform route | vars contract | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A — provider is infrastructure, not a user CTA | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| provider initialized | yes | TBD |
| vars available | yes | TBD |
| provider error | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-008B | downstream | feature flags built on top of provider |
| DSH-SLICE-008C | downstream | scope audit requires provider policy to be defined |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: not applicable (infrastructure)
- Exit gate: provider policy documented + enforced in all app roots + guard added

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No slice manifest; provider policy not formally documented; platform route exists but policy unenforced |
| **Dependency** | J-008 roadmap prioritization |
| **Next Action** | Document provider policy; add guard for direct env-var reads in UI code |
