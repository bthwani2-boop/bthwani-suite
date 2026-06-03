# DSH-SLICE-002G — Catalog Conflict Audit

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002G` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Control-panel can detect and resolve conflicts between central catalog and partner local overrides |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / CatalogConflictAuditScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on 002D (partner overrides) and 002E (approval workflow) existing first |

## Scope
### Included
- Conflict detection: central vs local override divergence
- Audit log of conflicts and resolutions
- CP resolution actions (accept local / revert to central)

### Excluded
| Surface | Reason |
|---|---|
| Approval workflow | Covered in 002E |
| Partner override submission | Covered in 002D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002G-01 | control-panel | CatalogConflictAuditScreen | DEFERRED_WITH_REASON |
| CM-002G-02 | backend | GET /catalog-conflicts | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Resolve conflict (accept local) | control-panel | CatalogConflictAuditScreen | POST /catalog-conflicts/{id}/resolve | DEFERRED_WITH_REASON |
| Revert to central | control-panel | CatalogConflictAuditScreen | POST /catalog-conflicts/{id}/resolve | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no conflicts | yes | TBD |
| conflicts present | yes | TBD |
| resolving | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002D | upstream | overrides must exist before conflicts arise |
| DSH-SLICE-002E | upstream | approval state affects conflict scope |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 002D + 002E PASS + conflict API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No upstream overrides or approval workflow yet built |
| **Dependency** | DSH-SLICE-002D, DSH-SLICE-002E |
| **Next Action** | Design conflict resolution API after 002D/E are contracted |
