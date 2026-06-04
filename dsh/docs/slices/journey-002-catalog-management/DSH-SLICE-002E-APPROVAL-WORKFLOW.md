# DSH-SLICE-002E — Approval Workflow

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002E` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Control-panel can approve or reject catalog changes before they go live |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / CatalogApprovalQueue |
| WLT Boundary | No finance mutation |
| Current Status | PASS |
| Blocking Reason | None |

## Scope
### Included
- Catalog change approval queue in control-panel
- Approve/reject actions with reason
- Notification to partner on decision

### Excluded
| Surface | Reason |
|---|---|
| Partner override submission | Covered in 002D |
| Listing visibility post-approval | Covered in 002F |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002E-01 | control-panel | CatalogApprovalQueue | PASS |
| CM-002E-02 | backend | POST /catalog-approvals | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Approve catalog change | control-panel | CatalogApprovalQueue | POST /catalog-approvals | PASS |
| Reject catalog change | control-panel | CatalogApprovalQueue | POST /catalog-approvals | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| pending review | yes | PASS |
| approved | yes | PASS |
| rejected | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002A through 002D | upstream | changes to approve must exist |
| DSH-SLICE-002F | downstream | listing visibility unlocked after approval |

## Evidence and Gates
- Runtime evidence: `POST /catalog-approvals` endpoint saves log details and updates `dsh_catalog_products` `approval_status` inside a transaction.
- Visual evidence: RTL Arabic approval screen inside control-panel triggers TypeScript client endpoints.
- Exit gate: 002E is fully validated and connected.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Approval API backend, schema migration, TS client transport, and UI screen integration are fully functional. |
| **Dependency** | None |
| **Next Action** | Deploy to production and start DSH-SLICE-002F |
