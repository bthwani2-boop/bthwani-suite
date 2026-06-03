# DSH-SLICE-002B — Category Structure

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002B` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Catalog items can be organized into categories and subcategories |
| Primary Actor | Partner (app-partner) / Control-Panel Operator |
| Primary Surface | app-partner / CategoryManagementScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No API contract; depends on 002A (product identity) being designed first |

## Scope
### Included
- Category create/edit/delete
- Category assignment to products
- Category hierarchy (parent/child)

### Excluded
| Surface | Reason |
|---|---|
| Media per category | Covered in 002C |
| Approval workflow | Covered in 002E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002B-01 | app-partner | CategoryManagementScreen | DEFERRED_WITH_REASON |
| CM-002B-02 | backend | GET/POST /categories | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Create category | app-partner | CategoryManagementScreen | POST /categories | DEFERRED_WITH_REASON |
| Assign product to category | app-partner | ProductEditScreen | PATCH /products/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| empty | yes | TBD |
| populated tree | yes | TBD |
| saving | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002A | upstream | product identity must exist before categorization |
| DSH-SLICE-002E | downstream | approval workflow depends on category structure |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 002A at PASS + API contract designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No API contract; depends on 002A |
| **Dependency** | DSH-SLICE-002A |
| **Next Action** | Design category API after 002A contract is complete |
