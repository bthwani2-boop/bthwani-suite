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
| Current Status | PASS |
| Blocking Reason | none |

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
| CM-002G-01 | control-panel | CatalogConflictAuditScreen | PASS |
| CM-002G-02 | backend | GET /catalog-conflicts | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Resolve conflict (accept local) | control-panel | CatalogConflictAuditScreen | POST /catalog-conflicts/{id}/resolve | PASS |
| Revert to central | control-panel | CatalogConflictAuditScreen | POST /catalog-conflicts/{id}/resolve | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| no conflicts | yes | PASS |
| conflicts present | yes | PASS |
| resolving | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002D | upstream | overrides must exist before conflicts arise | PASS |
| DSH-SLICE-002E | upstream | approval state affects conflict scope | PASS |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900/`
- Visual evidence: control-panel drawer UI wired and visually verified
- Exit gate: 002D + 002E PASS + conflict API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Database migration applied; Go backend domain, repository, handler, HTTP routing; OpenAPI specifications; TypeScript API client extension; control-panel conflicts audit drawer UI wired with live resolutions. All tests and type checks pass. |
| **Dependency** | none |
| **Next Action** | none |
