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
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on 002E approval workflow and 001A store visibility; neither closed yet |

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
| CM-002F-01 | app-client | ProductListScreen | DEFERRED_WITH_REASON |
| CM-002F-02 | backend | GET /stores/{id}/products (filtered) | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View product list | app-client | StoreDetailScreen | GET /stores/{id}/products | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no approved products | yes | TBD |
| products listed | yes | TBD |
| loading | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002E | upstream | approval state drives visibility |
| DSH-SLICE-001A | upstream | store must be discoverable |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 002E PASS + 001A PASS + listing endpoint designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Upstream approval workflow (002E) not yet built |
| **Dependency** | DSH-SLICE-002E; DSH-SLICE-001A |
| **Next Action** | Close 002E; then design filtered listing endpoint |
