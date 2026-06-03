# DSH-SLICE-006A — Store Onboarding

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006A` |
| Parent Journey | J-006 — Field Readiness |
| Business Outcome | New partner store is onboarded into DSH with all required information captured for field readiness review |
| Primary Actor | Partner (app-partner) / Field Agent |
| Primary Surface | app-partner / StoreOnboardingScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No slice manifest yet; J-006 not yet started; no onboarding API designed |

## Scope
### Included
- Store registration form: name, address, contact, hours, zone
- POST /stores onboarding submission
- Initial store status: ONBOARDING_PENDING

### Excluded
| Surface | Reason |
|---|---|
| Field visit evidence | Covered in 006B |
| Documents and media | Covered in 006C |
| Visibility gates | Covered in J-001 |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006A-01 | app-partner | StoreOnboardingScreen | DEFERRED_WITH_REASON |
| CM-006A-02 | backend | POST /stores (onboarding) | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit store onboarding | app-partner | StoreOnboardingScreen | POST /stores | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| form entry | yes | TBD |
| submitted | yes | TBD |
| ONBOARDING_PENDING | yes | TBD |
| validation error | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006B | downstream | field visit requires onboarded store |
| J-001 | downstream | visibility gates only available after onboarding |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: onboarding API designed + screen built + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No slice manifest; J-006 not started |
| **Dependency** | J-006 roadmap prioritization; onboarding API design |
| **Next Action** | Create J-006 slice manifest; design POST /stores onboarding endpoint |
