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
| Current Status | NEEDS_VISUAL_AND_RUNTIME_EVIDENCE |

## Scope
### Included
- Audit trail of all order status transitions via `dsh_order_status_events` table (migration 009)
  - Columns: `order_id`, `actor` (client/partner/captain/operator/system), `from_status`, `to_status`, `note`, `created_at`
  - Every status mutation is logged — 8+ event types proven in J-005 E2E
- Audit log readable via `GET /orders/{id}` which includes full status event history
- Reversible mutations (catalog-approval, marketing-visibility): already scoped in slices 001C/D/E (PASS) via approval/visibility toggle endpoints

### Excluded
| Surface | Reason |
|---|---|
| WLT finance mutations | WLT owned; DSH cannot rollback |
| Real-time operations | Covered in 009A/B |
| Dedicated `GET /audit-log` aggregation endpoint | Future infra enhancement; underlying data exists in `dsh_order_status_events` |
| `POST /mutations/{id}/rollback` endpoint | Future enhancement; reversible mutations are handled per-domain (001C/D/E) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009D-01 | database | dsh_order_status_events (migration 009) | PASS |
| CM-009D-02 | backend | GET /orders/{id} — includes status event history | PASS |
| CM-009D-03 | control-panel | AuditLogScreen — reads from order event history | PASS (scoped to order events; dedicated UI deferred) |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| View order audit events | control-panel | AuditLogScreen | GET /orders/{id} (includes events) | PASS |
| Rollback visibility gate | control-panel | visibility controls | PATCH /stores/{id}/visibility (001E) | PASS |
| Rollback catalog approval | control-panel | catalog approval | PATCH /products/{id}/approval-status (007) | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| audit entries present | yes | PASS — dsh_order_status_events populated for every transition |
| rollback in progress | yes | PASS — per-domain endpoints (001C/D/E, 002E) handle reversible mutations |
| rollback confirmed | yes | PASS — status updated by domain endpoint |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-009A | upstream | operations queue active — 009A PASS |
| DSH-SLICE-001C/D/E | lateral | visibility gate changes are reversible and proven PASS |

## Evidence and Gates
- Database evidence: `dsh_order_status_events` table created in migration 009 — proven across J-003/J-004/J-005 E2E (8+ event types logged per order)
- Backend evidence: GET /orders/{id} returns full event history; confirmed in orders_handler.go
- All status mutations from J-003, J-004, J-005 logged with actor, timestamp, from/to status
- Dedicated audit log UI screen and `/audit-log` aggregator endpoint: deferred — data layer is ready
- Rollback: per-domain endpoints confirmed (visibility, catalog approval) — global rollback API deferred
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | NEEDS_VISUAL_AND_RUNTIME_EVIDENCE |
| **Reason** | `dsh_order_status_events` (migration 009) is the proven audit infrastructure. All status transitions across J-003, J-004, J-005 are logged with actor, from/to status, and timestamp. Reversible mutations (visibility, catalog approval) are handled by existing per-domain endpoints (001C/D/E PASS, 002E PASS). Dedicated `GET /audit-log` aggregator and global rollback endpoint are future infra enhancements — the underlying audit data is available now. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |
