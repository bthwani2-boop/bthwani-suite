# DSH-SLICE-003D — Order Creation Handoff

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003D` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Upon WLT payment confirmation, DSH creates order record, assigns status CREATED, and hands off to J-004 order lifecycle |
| Primary Actor | DSH backend (automated — triggered by WLT payment callback) |
| Actor Chain | DSH backend (automated) → app-partner (intake receiver) → control-panel (ops monitor) |
| Operation Chain | WLT sends payment-confirmed callback (003C) → DSH backend creates order record → pushes notification to partner → control-panel ops monitor receives new order event → J-004 lifecycle begins |
| Primary Surface | DSH backend / order service |
| Supporting Surfaces | app-partner (order intake receiver); control-panel / operations (ops monitor) |
| Dependency Surfaces | DSH-SLICE-003B (upstream — checkout session); DSH-SLICE-003C (upstream — WLT payment confirmation required); DSH-SLICE-004B (downstream — partner order lifecycle) |
| Excluded Surfaces + Reason | app-client (NOT_APPLICABLE at this step: client sees order confirmation screen only, covered in 003D visual); app-captain (NOT_APPLICABLE: captain assigned in J-005); app-field (NOT_APPLICABLE: J-006); WLT (excluded at this step: WLT already provided payment confirmation; no further WLT action) |
| Control Panel Owner | operations — ops monitor shows new order event; no operator action required at creation step |
| WLT Boundary | DSH creates order record using WLT payment reference ID (read-only); no DSH finance mutation |
| Auth/Permission Boundary | DSH backend internal auth (callback from WLT); partner auth (order intake); operator auth (ops monitor) |
| Vars/Provider Boundary | Delivery provider assignment may affect order routing — deferred to J-005 dispatch |
| Notification Boundary | Order creation triggers partner notification; client receives order confirmation; owned by DSH notification service |
| Account/Profile Boundary | Client account (order owner); partner account (order assignee) |
| Data Ownership | DSH backend domain (order record); WLT provides payment reference ID (read-only) |
| API/Runtime Boundary | `POST /orders` (DSH backend — created on payment callback) — NOT YET DESIGNED (blocked by 003B + 003C); `GET /orders/{id}` (client order confirmation) — NOT YET DESIGNED |
| Visual Evidence Required | yes — app-client order confirmation screen; app-partner new order notification; control-panel ops monitor |
| Runtime Evidence Required | yes — POST /orders runtime proof triggered by WLT callback + partner notification proven |
| Current Status | `BLOCKED_WITH_REASON` |
| Blocking Reason | Upstream DSH-SLICE-003B (checkout intent) and DSH-SLICE-003C (WLT payment) not yet PASS; order creation cannot be designed without confirmed payment contract |

## Scope

### Included
- `POST /orders` — created on WLT payment confirmation
- Order record with status `CREATED`, linked to payment reference ID (read-only)
- Notification to partner (new order)
- Client order confirmation screen (order confirmation view)
- Control-panel ops monitor receives new order event

### Excluded
| Surface | Reason |
|---|---|
| Payment execution | Covered in DSH-SLICE-003C |
| Order tracking / lifecycle | Covered in J-004 |
| Captain assignment / dispatch | Covered in J-005 |
| Refund / cancellation | Covered in J-004 (004D, 004E) |

## Coverage Matrix
| Row ID | Surface | Screen / Endpoint | Classification | Status |
|---|---|---|---|---|
| CM-003D-01 | DSH backend | POST /orders (triggered by WLT callback) | primary | BLOCKED_WITH_REASON |
| CM-003D-02 | app-client | Order confirmation screen (GET /orders/{id}) | supporting | BLOCKED_WITH_REASON |
| CM-003D-03 | app-partner | New order notification + intake screen | supporting | BLOCKED_WITH_REASON |
| CM-003D-04 | control-panel (operations) | Ops monitor — new order event | supporting | BLOCKED_WITH_REASON |
| CM-003D-05 | app-captain | — | excluded | NOT_APPLICABLE — captain assigned in J-005 |
| CM-003D-06 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003D-07 | WLT | — | excluded | WLT already provided payment confirmation; no further WLT action at this step |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| (Automatic) Create order | DSH backend | — | POST /orders | WLT payment-confirmed callback received | BLOCKED_WITH_REASON |
| View order | app-client | Order confirmation screen | GET /orders/{id} | order CREATED | BLOCKED_WITH_REASON |
| View new order | app-partner | Partner order intake screen | GET /orders/{id} (partner view) | partner notification received | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| payment_confirmed (trigger) | yes | DSH backend | BLOCKED |
| order_CREATED | yes | DSH backend / app-client / app-partner | BLOCKED |
| order_creation_failed | yes | DSH backend | BLOCKED |
| notification_sent (partner) | yes | app-partner | BLOCKED |
| loading | yes | app-client order confirmation | BLOCKED |
| error | yes | DSH backend / app-client | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Slice | Impact |
|---|---|---|---|
| DSH-SLICE-003B | upstream | J-003 | Checkout session required |
| DSH-SLICE-003C | upstream | J-003 | WLT payment confirmation required |
| DSH-SLICE-004B | downstream | J-004 | Partner order lifecycle starts after order CREATED |
| DSH-SLICE-004D | downstream | J-004 | Cancellation depends on order existing |
| DSH-SLICE-005A | downstream | J-005 | Captain assignment depends on order CREATED |
| DSH-SLICE-009A | lateral | J-009 | CP ops monitor receives new order event |

### Missing Logic / Screen / Process Proposals
| ID | Item | Classification | Reason |
|---|---|---|---|
| GAP-003D-01 | Order ID generation strategy | BLOCKED_WITH_REASON | Requires backend design; blocked by upstream |
| GAP-003D-02 | Notification channel for partner (push vs in-app) | BLOCKED_WITH_REASON | Notification service ownership TBD |
| GAP-003D-03 | Order confirmation screen design | BLOCKED_WITH_REASON | Requires order API + auth; blocked |

## Evidence and Gates
- Runtime evidence: none — blocked
- Visual evidence: none
- Evidence path: `tools/registry/runs/DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700/`

### Exit Gates (all must be proven before PASS)
1. DSH-SLICE-003B PASS
2. DSH-SLICE-003C PASS (WLT payment confirmation available)
3. `POST /orders` designed in `dsh/dsh.openapi.yaml`
4. Go backend handler + order domain model implemented + unit-tested
5. DB migration for orders table applied
6. Partner notification proven (new order event delivered)
7. Runtime proof: order CREATED record in DB after WLT callback
8. Visual proof: app-client confirmation screen + app-partner intake screen

## Rollback / Disable Path
- If order creation fails, checkout session remains in `payment_confirmed` state
- Retry is possible via re-invocation of POST /orders
- Financial reversal (if needed) is WLT-owned via DSH-SLICE-004E

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | Upstream 003B and 003C not yet PASS; order creation cannot be designed or implemented without confirmed payment contract from WLT |
| **Dependency** | DSH-SLICE-003B PASS; DSH-SLICE-003C PASS |
| **Next Action** | Await 003B + 003C PASS; then design POST /orders + order domain model |
| **Forward-Only Gate** | Do not start DSH-SLICE-004B (partner lifecycle) until this slice reaches PASS |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700/` |
| **Closed By** | Antigravity — 2026-06-04T17:47:00Z |
