# DSH-SLICE-002F — Listing Visibility

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002F` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Approved catalog items are visible to clients in discovery; unapproved are hidden |
| Primary Actor | Client (app-client) |
| Primary Surface | app-client / StoreDetailScreen / ProductListScreen |
| WLT Boundary | No finance mutation |
| Current Status | PASS |
| Blocking Reason | None |

## Scope
### Included
- Client-facing product listing filtered by approval state
- Visibility rules: approved + store-visible → shown; otherwise hidden
- GET /stores/{id}/products filtered by approval state

### Excluded
| Surface | Reason |
|---|---|
| Approval workflow | Covered in 002E |
| Store-level visibility gates | Covered in J-001 |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002F-01 | app-client | ProductListScreen | PASS |
| CM-002F-02 | backend | GET /stores/{id}/products (filtered) | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View product list | app-client | StoreDetailScreen | GET /stores/{id}/products | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| no approved products | yes | PASS |
| products listed | yes | PASS |
| loading | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002E | upstream | approval state drives visibility |
| DSH-SLICE-001A | upstream | store must be discoverable |

## Evidence and Gates
- Runtime evidence: `GET /stores/{store_id}/products?approval_status=catalog_adopted` endpoint implemented in Go backend repository (`postgres_products_repository.go`) and handler (`products_handler.go`). Client application (`DshClientSurface.tsx`) queries the products from the live API in parallel with store details using `createDshProductApiHttpClient` when configured. Evidence captured in: `tools/registry/runs/DSH_SLICE_002F_LISTING_VISIBILITY_FINAL_CLOSURE-20260604-154100/`
- Visual evidence: RTL Arabic store items screen renders approved/visible products and filters out unapproved ones (hidden/removed).
- Exit gate: 002F PASS.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Filtering parameter `approval_status` is fully supported by the Go backend, documented in OpenAPI schema, mapped in TypeScript client, and integrated in parallel in `app-client` StoreScreen / StoreItemsScreen. |
| **Dependency** | None |
| **Next Action** | Proceed to DSH-SLICE-002G catalog conflict / duplicate handling |
