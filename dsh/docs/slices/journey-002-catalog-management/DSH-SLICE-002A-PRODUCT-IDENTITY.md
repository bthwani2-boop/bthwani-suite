# DSH-SLICE-002A — Product Identity

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002A` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Partner can create and manage product identity (name, SKU, description, price) |
| Primary Actor | Partner (app-partner) |
| Primary Surface | app-partner / ProductEditScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No slice manifest; no API endpoint designed for product CRUD |

## Scope
### Included
- Product create/edit form
- POST /products + PATCH /products/{id} endpoints (not yet designed)
- Product identity fields: name, SKU, description, base price

### Excluded
| Surface | Reason |
|---|---|
| Category structure | Covered in 002B |
| Media | Covered in 002C |
| Partner local overrides | Covered in 002D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002A-01 | app-partner | ProductEditScreen | DEFERRED_WITH_REASON |
| CM-002A-02 | backend | POST /products | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Create product | app-partner | ProductEditScreen | POST /products | DEFERRED_WITH_REASON |
| Edit product | app-partner | ProductEditScreen | PATCH /products/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| empty form | yes | TBD |
| validation error | yes | TBD |
| saving | yes | TBD |
| saved | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-001 | upstream | store must be discoverable before catalog is relevant |
| DSH-SLICE-002B | downstream | category structure depends on product identity |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: API contract designed + screen built + runtime proof captured

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No API contract; no slice manifest; J-002 not yet started |
| **Dependency** | API design for product CRUD |
| **Next Action** | Design POST /products + PATCH /products/{id} contract |
