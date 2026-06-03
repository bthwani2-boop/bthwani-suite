# DSH-SLICE-002D — Partner Local Overrides

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002D` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Partner can apply local price/availability overrides without modifying the central catalog |
| Primary Actor | Partner (app-partner) |
| Primary Surface | app-partner / ProductOverridesScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No API contract; depends on 002A product identity |

## Scope
### Included
- Partner-local price override (does not mutate central catalog)
- Availability toggle per partner
- Override audit trail

### Excluded
| Surface | Reason |
|---|---|
| Central catalog mutation | Covered in 002A |
| Approval workflow for overrides | Covered in 002E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002D-01 | app-partner | ProductOverridesScreen | DEFERRED_WITH_REASON |
| CM-002D-02 | backend | PATCH /stores/{id}/catalog-overrides | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Set local price override | app-partner | ProductOverridesScreen | PATCH /stores/{id}/catalog-overrides | DEFERRED_WITH_REASON |
| Toggle product availability | app-partner | ProductOverridesScreen | PATCH /stores/{id}/catalog-overrides | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no overrides | yes | TBD |
| override active | yes | TBD |
| saving | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002A | upstream | product identity required |
| DSH-SLICE-002E | downstream | overrides subject to approval workflow |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 002A PASS + override API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No API contract; J-002 not yet started |
| **Dependency** | DSH-SLICE-002A |
| **Next Action** | Design override API after 002A contract is complete |
