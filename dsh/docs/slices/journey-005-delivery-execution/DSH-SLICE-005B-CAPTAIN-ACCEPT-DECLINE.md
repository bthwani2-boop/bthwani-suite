# DSH-SLICE-005B — Captain Accept / Decline

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005B` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Assigned captain can accept or decline a delivery task; decline triggers reassignment |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / TaskScreen |
| WLT Boundary | No finance mutation |
| Current Status | PASS |
| Blocking Reason | none — runtime API/client binding and app-captain device evidence captured |

## Scope
### Included
- Captain task notification with order details
- Accept action → status ACCEPTED_BY_CAPTAIN
- Decline action → triggers reassignment flow

### Excluded
| Surface | Reason |
|---|---|
| Captain assignment logic | Covered in 005A |
| Pickup handoff | Covered in 005C |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005B-01 | app-captain | TaskScreen | PASS |
| CM-005B-02 | backend | POST /orders/{id}/accept-task + /decline-task | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Accept task | app-captain | TaskScreen | POST /orders/{id}/accept-task | PASS |
| Decline task | app-captain | TaskScreen | POST /orders/{id}/decline-task | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| task pending | yes | PASS |
| accepted | yes | PASS |
| declined | yes | PASS |
| timeout / auto-decline | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005A | upstream | assignment must exist |
| DSH-SLICE-005C | downstream | pickup handoff starts after accept |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_005B_CAPTAIN_ACCEPT_DECLINE_FINAL_CLOSURE-20260605-043000/005B_api_results.json`
- Visual evidence: `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/dsh_j005_app_captain_orders.png` and `dsh_j005_app_captain_order_detail.png`
- Current-session code evidence: app-captain uses injectable `captainId` for accept/decline and normalizes preview order ids before calling the typed lifecycle client.
- Exit gate: 005A PASS + task accept/decline API designed + runtime proof verified E2E + app-captain device proof captured.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Existing E2E evidence covers accept/decline API; current session removed hardcoded captain identity from app-captain callbacks and captured real app-captain device evidence. |
| **Dependency** | 005A assignment runtime state |
| **Next Action** | none — monitor only for real auth/captain identity provider integration |
