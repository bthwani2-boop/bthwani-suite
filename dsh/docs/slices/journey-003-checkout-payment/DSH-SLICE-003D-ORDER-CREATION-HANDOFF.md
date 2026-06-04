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
| API/Runtime Boundary | `POST /orders` and `GET /orders/{id}` — CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_POSTGRES_REQUIRED in `dsh/dsh.openapi.yaml`; order creation is a separate post-callback step and is not executed inside `POST /checkout/payment-callback`; PASS remains blocked by 003B/003C runtime proof and cross-surface visual/runtime proof |
| Visual Evidence Required | yes — app-client order confirmation screen; app-partner new order notification; control-panel ops monitor |
| Runtime Evidence Required | yes — POST /orders runtime proof triggered by WLT callback + partner notification proven |
| Current Status | `OPEN_BLOCKED_BY_003C_RUNTIME` |
| Blocking Reason | Blocked on DSH-SLICE-003C (WLT payment confirmation runtime proof). `POST /orders` contract exists in `dsh/dsh.openapi.yaml`. Cannot proceed to PASS without confirmed WLT payment callback. |

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
| CM-003D-01 | DSH backend | POST /orders (separate post-callback step) | primary | BLOCKED_WITH_REASON — contract/backend implemented; WLT runtime proof pending |
| CM-003D-02 | app-client | Order confirmation screen (GET /orders/{id}) | supporting | BLOCKED_WITH_REASON — contract/backend implemented; visual/runtime proof pending |
| CM-003D-03 | app-partner | New order notification + intake screen | supporting | BLOCKED_WITH_REASON |
| CM-003D-04 | control-panel (operations) | Ops monitor — new order event | supporting | BLOCKED_WITH_REASON |
| CM-003D-05 | app-captain | — | excluded | NOT_APPLICABLE — captain assigned in J-005 |
| CM-003D-06 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003D-07 | WLT | — | excluded | WLT already provided payment confirmation; no further WLT action at this step |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| (Automatic) Create order | DSH backend | — | POST /orders | confirmed `wlt_payment_ref_id` stored from 003C | BLOCKED_WITH_REASON |
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
| GAP-003D-01 | Idempotent order creation from confirmed checkout intent | BLOCKED_WITH_REASON | Backend order creation exists, but the confirmed-intent handoff and replay-safe order creation proof remain blocked by 003C runtime |
| GAP-003D-02 | Notification channel for partner (push vs in-app) | BLOCKED_WITH_REASON | Notification service ownership TBD |
| GAP-003D-03 | Order confirmation screen design | BLOCKED_WITH_REASON | Requires order API + auth; blocked |

## Evidence and Gates
- Runtime evidence: none — blocked
- Visual evidence: none
- Evidence path: `tools/registry/runs/DSH_SLICE_003D_FULL_UNIVERSAL_CLOSURE-20260604-181500/`

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

| **Slice Decision** | `OPEN_BLOCKED_BY_003C_RUNTIME` |
| **Reason** | `POST /orders` and `GET /orders/{id}` contracts exist in `dsh/dsh.openapi.yaml` and backend implementation exists for the Postgres runtime. Cannot prove real order handoff until DSH-SLICE-003C WLT payment callback is proven at runtime. `POST /orders` must only run after a confirmed `wlt_payment_ref_id` is stored from the callback. |
| **Dependency** | DSH-SLICE-003B pass + DSH-SLICE-003C WLT runtime proof |
| **Next Action** | Await 003C WLT runtime proof; then prove the separate post-callback order creation handoff across backend, app-client confirmation, app-partner intake, and control-panel ops |
| **Forward-Only Gate** | All 8 exit gates must pass before PASS |
| **Evidence Folder** | `tools/registry/runs/DSH_JOURNEY_001_002_003_FINAL_TRUTH_CLOSURE-20260604/` |
