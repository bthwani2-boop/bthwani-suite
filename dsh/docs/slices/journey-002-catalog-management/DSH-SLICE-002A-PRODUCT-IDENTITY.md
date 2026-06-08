# DSH-SLICE-002A — Product Identity

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002A` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Partner can create and manage product identity (name, SKU, description, price label) |
| Primary Actor | Partner (app-partner) |
| Primary Surface | app-partner / ProductEditScreen |
| WLT Boundary | No finance mutation — base_price_label is display-only label |
| Current Status | **PASS** |
| Blocking Reason | None — all gates cleared |

## Scope
### Included
- Product create/edit form (`ProductEditScreen.tsx`)
- `POST /stores/{store_id}/products` — create product
- `PATCH /products/{id}` — update product identity fields
- `GET /stores/{store_id}/products` — list products for a store
- `GET /products/{id}` — get single product
- Product identity fields: name, SKU, GTIN, barcode, description, base_price_label, category_id
- All states: form / loading / saving / saved / error / offline / not_found
- RTL-correct UI (Arabic, right-to-left)
- Typed client + transport in `dsh/frontend/shared/`

### Excluded
| Surface | Reason |
|---|---|
| Category structure | Covered in 002B |
| Media | Covered in 002C |
| Partner local overrides | Covered in 002D |
| Approval actions (approve/reject) | control-panel owns approval pipeline |

## Coverage Matrix
| Row ID | Surface | Screen / Component | Status |
|---|---|---|---|
| CM-002A-01 | app-partner | ProductEditScreen | **PASS** |
| CM-002A-02 | backend | `POST /stores/{store_id}/products` | **PASS** |
| CM-002A-03 | backend | `PATCH /products/{id}` | **PASS** |
| CM-002A-04 | backend | `GET /stores/{store_id}/products` | **PASS** |
| CM-002A-05 | backend | `GET /products/{id}` | **PASS** |
| CM-002A-06 | backend | DB migration `003_product_catalog.sql` | **PASS** |
| CM-002A-07 | shared | `dsh-product-api.client.ts` | **PASS** |
| CM-002A-08 | shared | `dsh-product-api.transport.ts` | **PASS** |
| CM-002A-09 | docs | `dsh.openapi.yaml` — product schemas + paths | **PASS** |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Create product | app-partner | ProductEditScreen | `POST /stores/{store_id}/products` | **PASS** |
| Edit product | app-partner | ProductEditScreen | `PATCH /products/{id}` | **PASS** |

## State Matrix
| State | Required | Status |
|---|---|---|
| empty form | yes | **PASS** |
| loading (edit mode) | yes | **PASS** |
| validation error | yes | **PASS** |
| saving | yes | **PASS** |
| saved | yes | **PASS** |
| error | yes | **PASS** |
| offline | yes | **PASS** |
| not_found | yes | **PASS** |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-001 | upstream | store must exist and have store_id before product can be created |
| DSH-SLICE-002B | downstream | category structure depends on product identity |
| `dsh/domain/product.go` | cross | domain types shared between backend handler and DB layer |
| `dsh-product-identity.model.ts` | cross | approval pipeline types shared with frontend |
| control-panel | lateral | catalog approval flow reads these products; approval status transitions owned by control-panel |

## Evidence and Gates
- **Runtime evidence**: `tools/registry/runs/DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE-20260604-050000/09-runtime-request-response-proof.txt`
- **API evidence**: 6/6 calls PASS (POST 201, PATCH 200, GET 200, LIST 200, validation 400, not-found 404)
- **Go test**: `ok  bthwani.local/dsh/backend/internal/http  0.077s`
- **Migration**: `003_product_catalog.sql` — CREATE TABLE + 3 indexes applied
- **Exit gate**: ✅ API contract designed + screen built + runtime proof captured

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | **PASS** |
| **Reason** | Full stack implemented: migration, Go domain+repository+handler, typed client/transport, ProductEditScreen, OpenAPI, runtime proof 6/6 |
| **Dependency** | None outstanding |
| **Next Action** | Proceed to DSH-SLICE-002B (Category Structure) |
