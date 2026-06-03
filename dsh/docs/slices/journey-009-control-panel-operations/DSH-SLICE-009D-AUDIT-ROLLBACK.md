# DSH-SLICE-009D — Audit & Rollback

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-009D` |
| Parent Journey | J-009 — Control Panel Operations |
| Business Outcome | Control-panel operators can audit all gate/status changes and roll back erroneous mutations |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / AuditLogScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No slice manifest yet; audit infrastructure not designed; depends on operations history from 009A |

## Scope
### Included
- Audit log of all CP gate changes and status mutations
- Rollback action for reversible mutations (e.g., catalog-approval, marketing-visibility)
- Audit log search/filter

### Excluded
| Surface | Reason |
|---|---|
| WLT finance mutations | WLT owned; DSH cannot rollback |
| Real-time operations | Covered in 009A/B |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009D-01 | control-panel | AuditLogScreen | DEFERRED_WITH_REASON |
| CM-009D-02 | backend | GET /audit-log + POST /mutations/{id}/rollback | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View audit log | control-panel | AuditLogScreen | GET /audit-log | DEFERRED_WITH_REASON |
| Rollback mutation | control-panel | AuditLogScreen | POST /mutations/{id}/rollback | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| audit entries present | yes | TBD |
| rollback in progress | yes | TBD |
| rollback confirmed | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-009A | upstream | gate mutations must be logged |
| DSH-SLICE-001C/D/E | lateral | visibility gate changes are auditable |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 009A PASS + audit infrastructure designed + rollback API + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No slice manifest; audit infrastructure not designed; no operations history yet |
| **Dependency** | DSH-SLICE-009A; audit infrastructure design |
| **Next Action** | Create audit infrastructure spec; design GET /audit-log + rollback endpoint |
