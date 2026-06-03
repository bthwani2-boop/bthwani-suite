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
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No API contract; depends on 002A–002D being defined first |

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
| CM-002E-01 | control-panel | CatalogApprovalQueue | DEFERRED_WITH_REASON |
| CM-002E-02 | backend | POST /catalog-approvals | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Approve catalog change | control-panel | CatalogApprovalQueue | POST /catalog-approvals | DEFERRED_WITH_REASON |
| Reject catalog change | control-panel | CatalogApprovalQueue | POST /catalog-approvals | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| pending review | yes | TBD |
| approved | yes | TBD |
| rejected | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002A through 002D | upstream | changes to approve must exist |
| DSH-SLICE-002F | downstream | listing visibility unlocked after approval |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 002A–D at PASS + approval API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No upstream changes to approve yet; J-002 not started |
| **Dependency** | DSH-SLICE-002A through 002D |
| **Next Action** | Design approval API after upstream slices are contracted |
