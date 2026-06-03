# DSH-SLICE-001B — Store Details

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001B` |
| Parent Journey | J-001 — Store Discovery |
| Business Outcome | Client can view full store detail page with contact, hours, and catalog summary |
| Primary Actor | Client (app-client) |
| Primary Surface | app-client / StoreDetailScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | GET /stores/{id} detail endpoint not yet designed; depends on DSH-SLICE-001A reaching PASS first |

## Scope
### Included
- StoreDetailScreen data binding to GET /stores/{id}
- Store contact info, hours, partner-readiness display
- Navigation entry from StoreListScreen

### Excluded
| Surface | Reason |
|---|---|
| control-panel | Partner management handled in 009A |
| Catalog content | Covered in J-002 |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-001B-01 | app-client | StoreDetailScreen | DEFERRED_WITH_REASON |
| CM-001B-02 | app-client | StoreListScreen → detail nav | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View store details | app-client | StoreListScreen | StoreDetailScreen | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| loading | yes | TBD |
| loaded | yes | TBD |
| error / not-found | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-001A | upstream | 001A must close before detail endpoint design can begin |
| GET /stores/{id} | upstream | endpoint not yet designed |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 001A PASS + GET /stores/{id} endpoint designed + StoreDetailScreen bound + runtime proof captured

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Detail endpoint not designed; premature to implement screen |
| **Dependency** | DSH-SLICE-001A close; GET /stores/{id} API design |
| **Next Action** | Design GET /stores/{id} contract after 001A closes |
