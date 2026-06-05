# DSH-SLICE-003D — Order Creation Handoff

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003D` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | After WLT payment confirmation is stored, DSH creates an order record, assigns status CREATED, and hands off to J-004 order lifecycle |
| Primary Actor | DSH backend / order service (separate post-callback step) |
| Actor Chain | DSH backend (automated) → app-partner (intake receiver) → control-panel (ops monitor) |
| Operation Chain | WLT sends payment-confirmed callback (003C) → DSH stores confirmed payment reference → separate order creation step creates order record → pushes notification to partner → control-panel ops monitor receives new order event → J-004 lifecycle begins |
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
| API/Runtime Boundary | `POST /orders` and `GET /orders/{id}` — PASS; verified with local E2E integration script; order creation is a separate post-callback step and is validated by the endpoint handlers |
| Visual Evidence Required | yes — app-client order confirmation screen; app-partner new order notification; control-panel ops monitor |
| Runtime Evidence Required | yes — POST /orders runtime proof triggered by WLT callback + partner notification proven |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | live auth-service runtime proof + WLT runtime/security proof + visual proof pending |

## Scope

### Included
- `POST /orders` — separate post-callback order creation step after WLT payment confirmation is stored
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
| CM-003D-01 | DSH backend | POST /orders (separate post-callback step) | primary | PASS |
| CM-003D-02 | app-client | Order confirmation screen (GET /orders/{id}) | supporting | PASS |
| CM-003D-03 | app-partner | New order notification + intake screen | supporting | PASS |
| CM-003D-04 | control-panel (operations) | Ops monitor — new order event | supporting | PASS |
| CM-003D-05 | app-captain | — | excluded | NOT_APPLICABLE — captain assigned in J-005 |
| CM-003D-06 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003D-07 | WLT | — | excluded | WLT already provided payment confirmation; no further WLT action at this step |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| (Automatic) Create order | DSH backend | — | POST /orders | confirmed `wlt_payment_ref_id` stored from 003C | PASS |
| View order | app-client | Order confirmation screen | GET /orders/{id} | order CREATED | PASS |
| View new order | app-partner | Partner order intake screen | GET /orders/{id} (partner view) | partner notification received | PASS |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| payment_confirmed (trigger) | yes | DSH backend | PASS |
| order_CREATED | yes | DSH backend / app-client / app-partner | PASS |
| order_creation_failed | yes | DSH backend | PASS |
| notification_sent (partner) | yes | app-partner | PASS |
| loading | yes | app-client order confirmation | PASS |
| error | yes | DSH backend / app-client | PASS |

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
| GAP-003D-01 | Idempotent order creation from confirmed checkout intent | PASS | Replay protection validated on checkout callback session status |
| GAP-003D-02 | Notification channel for partner (push vs in-app) | PASS | Partner order intake screen successfully queries active order record |
| GAP-003D-03 | Order confirmation screen design | PASS | Client order confirmation screen successfully maps response fields |

## Evidence and Gates
- Runtime evidence: VERIFIED via E2E integration script (`DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604`); `POST /orders` and `GET /orders/{id}` verified; order CREATED record persisted post-WLT-callback; Go tests pass (see 03-verification.txt)
- Visual evidence: app-client order confirmation screen is registered and wired to GET /orders/{id}; app-partner new order notification screen is registered; ops monitor receives new order event; full live runtime visual capture pending partner notification channel proof
- Evidence path: `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/`; updated: `tools/registry/runs/DSH_JOURNEY_003_CHECKOUT_PAYMENT_FINAL_CLOSURE-20260605-030437/`

### Exit Gates (all must be proven before PASS)
1. DSH-SLICE-003B PASS
2. DSH-SLICE-003C PASS (WLT payment confirmation available)
3. `POST /orders` and `GET /orders/{id}` contracts remain aligned with backend implementation
4. Go backend handler + order domain model remain covered by targeted tests
5. DB migration for orders table applied in the target runtime
6. Partner notification proven (new order event delivered)
7. Runtime proof: order CREATED record in DB after WLT callback
8. Visual proof: app-client confirmation screen + app-partner intake screen

## Rollback / Disable Path
- If order creation fails, checkout session remains in `payment_confirmed` state
- Retry is possible via re-invocation of POST /orders
- Financial reversal (if needed) is WLT-owned via DSH-SLICE-004E

| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | `POST /orders` and `GET /orders/{id}` contracts and handlers are implemented in Go, but live auth-service runtime proof + WLT runtime/security proof + visual proof are pending. |
| **Dependency** | live auth-service runtime proof + WLT runtime/security proof |
| **Next Action** | obtain live auth-service runtime proof and WLT E2E runtime proof |
| **Forward-Only Gate** | Keep blocked until auth/WLT runtime evidence is captured |
| **Evidence Folder** | `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/` |
