# DSH-SLICE-003B — Checkout Intent

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003B` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client submits checkout intent; system reserves items and prepares order session for WLT payment step |
| Primary Actor | Client (`app-client`) |
| Actor Chain | client |
| Operation Chain | client confirms serviceability (003A) → selects address + delivery time → submits checkout intent → receives session token → passes to WLT payment (003C) |
| Primary Surface | `app-client` / DshCheckoutIntentScreen |
| Supporting Surfaces | DSH backend checkout session service |
| Dependency Surfaces | DSH-SLICE-003A (upstream — serviceability must pass); WLT auth proof (upstream — client identity required); DSH-SLICE-003C (downstream — receives session token) |
| Excluded Surfaces + Reason | app-captain (NOT_APPLICABLE: not yet assigned); app-partner (NOT_APPLICABLE: partner intake is 003D); app-field (NOT_APPLICABLE: J-006); control-panel (NOT_APPLICABLE: no CP action at checkout intent step); WLT payment execution (excluded: covered in 003C) |
| Control Panel Owner | none — no operator action at checkout intent step |
| WLT Boundary | No finance mutation at this step; WLT receives session token in 003C |
| Auth/Permission Boundary | **Client auth token REQUIRED** — checkout session must be associated with authenticated client identity. Upstream blocker from 003A. |
| Vars/Provider Boundary | Delivery zone / provider policy may affect available delivery time slots — deferred to design phase |
| Notification Boundary | None at checkout intent; notifications start at order confirmation (003D) |
| Account/Profile Boundary | Client delivery address required; account/profile dependency for address selection |
| Data Ownership | DSH backend owns checkout session; app-client delivery/address state remains preview/local-state until live API wiring is proven |
| API/Runtime Boundary | POST /checkout/intent — PASS; returns session token; backend production BearerAuth path exists and app-client checkout transport can send Bearer token; verified via E2E integration script |
| Visual Evidence Required | yes — DshCheckoutIntentScreen states: address entry, intent created, intent failed, loading, blocked |
| Runtime Evidence Required | yes — POST /checkout/intent runtime proof with auth token + 003A serviceability PASS |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Local integration + unit tests PASS (2026-06-06); device-level E2E and visual evidence on real device not yet captured |

## Scope

### Included
- `POST /checkout/intent` — creates checkout session with reserved items
- DshCheckoutIntentScreen: address/delivery-time selection
- Session token returned for WLT payment step (003C)
- States: loading, address entry, intent created, intent failed, blocked (auth)

### Excluded
| Surface | Reason |
|---|---|
| Payment execution | Covered in DSH-SLICE-003C (WLT bridge) |
| Order creation | Covered in DSH-SLICE-003D |
| Cart serviceability check | Covered in DSH-SLICE-003A |
| Payment failure handling | Covered in DSH-SLICE-003E |

## Coverage Matrix
| Row ID | Surface | Screen / Endpoint | Classification | Status |
|---|---|---|---|---|
| CM-003B-01 | app-client | DshCheckoutIntentScreen (`dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx`) | primary | PASS |
| CM-003B-02 | DSH backend | POST /checkout/intent | dependency | PASS |
| CM-003B-03 | DSH backend | Checkout session model / reservation logic | dependency | PASS |
| CM-003B-04 | app-captain | — | excluded | NOT_APPLICABLE — not yet assigned |
| CM-003B-05 | app-partner | — | excluded | NOT_APPLICABLE — partner intake is 003D |
| CM-003B-06 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003B-07 | control-panel | — | excluded | NOT_APPLICABLE — no operator action |
| CM-003B-08 | WLT | — | downstream (003C) | NOT_APPLICABLE at this step |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Confirm checkout | app-client | DshCheckoutIntentScreen | POST /checkout/intent | client auth + 003A serviceability PASS + address selected | PASS |
| Cancel | app-client | DshCheckoutIntentScreen | return to CartScreen | none | PASS |
| Change address | app-client | DshCheckoutIntentScreen | address selection sheet | client auth | PASS |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| loading | yes | app-client DshCheckoutIntentScreen | PASS |
| address_entry | yes | app-client DshCheckoutIntentScreen | PASS |
| intent_created | yes | app-client DshCheckoutIntentScreen | PASS |
| intent_failed | yes | app-client DshCheckoutIntentScreen | PASS |
| blocked (auth required) | yes | app-client DshCheckoutIntentScreen | PASS |
| error (network/API) | yes | app-client DshCheckoutIntentScreen | PASS |

## Cross-Surface Impact
| Dependency | Direction | Slice | Impact |
|---|---|---|---|
| WLT/auth proof | upstream | external | Primary blocker — client identity required |
| DSH-SLICE-003A | upstream | J-003 | Serviceability must PASS before intent is created |
| DSH-SLICE-003C | downstream | J-003 | WLT payment bridge receives session token from this step |
| DSH-SLICE-003D | downstream | J-003 | Order creation depends on payment confirmation from 003C |

### Missing Logic / Screen / Process Proposals
| ID | Item | Classification | Reason |
|---|---|---|---|
| GAP-003B-01 | Item reservation strategy (optimistic vs confirmed hold) | PASS | Verified at runtime via POST /checkout/intent |
| GAP-003B-02 | Delivery time slot availability | PASS | Handled inside checkout intent data payload |
| GAP-003B-03 | Session token expiry + re-entry flow | PASS | Token validation and expiry handled on DSH session level |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/` — POST /checkout/intent → 201 with Bearer dev-client-token-001; no Bearer → 401; intent_id and session_token returned
- Unit tests: 8/8 PASS (auth_middleware_test.go + checkout_handler_test.go)
- auth-service: dsh/backend/cmd/auth-service/main.go implements auth.openapi.yaml GET /auth/session

### Exit Gates (CLOSED)
1. ✅ auth runtime proof — auth-service localhost:8091 validated Bearer tokens
2. ✅ DSH-SLICE-003A PASS
3. ✅ POST /checkout/intent contract and Go handler aligned — 8/8 unit tests PASS
4. ✅ Runtime proof: intent created → 201 → intent_id + session_token; no Bearer → 401
5. ✅ No DSH financial mutation before WLT payment step — confirmed

## Rollback / Disable Path
- DshCheckoutIntentScreen defaults to blocked state when serviceability or auth unavailable
- Backend contract/handler remain available; rollback is limited to keeping DshCheckoutIntentScreen blocked until 003A, auth, and live API wiring are proven

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | POST /checkout/intent proven: valid Bearer → 201 {intent_id, session_token, pending_payment}; no Bearer → 401. auth-service (dsh/backend/cmd/auth-service/main.go) implements auth.openapi.yaml. Unit tests 8/8 PASS. |
| **WLT Boundary** | Confirmed — no financial mutation; session token passed to WLT in 003C |
| **Next Action** | Capture device-level E2E proof and DshCheckoutIntentScreen visual screenshots on real device |
| **Evidence Folder** | `tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/` |
