# DSH-SLICE-006B — Field Visit Evidence

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006B` |
| Parent Journey | J-006 — Field Readiness |
| Business Outcome | Field agent captures visit evidence (location check-in, photos, notes) linked to onboarded store |
| Primary Actor | Field Agent |
| Primary Surface | app-partner (field mode) / FieldVisitScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-006A (store onboarding) |

## Scope
### Included
- Field agent GPS check-in at store location
- Visit notes and observations
- POST /stores/{id}/field-visits

### Excluded
| Surface | Reason |
|---|---|
| Document/media upload | Covered in 006C |
| CP approval | Covered in 006E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006B-01 | app-partner | FieldVisitScreen | DEFERRED_WITH_REASON |
| CM-006B-02 | backend | POST /stores/{id}/field-visits | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit field visit | app-partner | FieldVisitScreen | POST /stores/{id}/field-visits | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| not visited | yes | TBD |
| visit in progress | yes | TBD |
| visit submitted | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006A | upstream | store must be onboarded |
| DSH-SLICE-006C | downstream | document upload follows field visit |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 006A PASS + field visit API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Store onboarding (006A) not proven |
| **Dependency** | DSH-SLICE-006A |
| **Next Action** | Await 006A PASS; then design field visit API |
