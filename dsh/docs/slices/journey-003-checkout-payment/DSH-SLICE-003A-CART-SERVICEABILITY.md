# DSH-SLICE-003A — Cart Serviceability

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003A` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client reviews cart and confirms that selected items and store are serviceable before checkout proceeds |
| Primary Actor | Client (`app-client`) |
| Actor Chain | client |
| Operation Chain | client opens cart → system checks store open + items available + delivery zone valid → proceed or block |
| Primary Surface | `app-client` / CartScreen |
| Supporting Surfaces | shared serviceability model (serviceability logic owner) |
| Dependency Surfaces | WLT auth proof (upstream blocker); DSH-SLICE-003B (downstream dependent) |
| Excluded Surfaces + Reason | app-captain (NOT_APPLICABLE: not yet assigned at cart stage); app-partner (NOT_APPLICABLE: partner readiness proven in J-001); app-field (NOT_APPLICABLE: J-006 scope); control-panel (NOT_APPLICABLE: no operator action at cart serviceability step); WLT payment (excluded: payment starts at 003C); order creation (excluded: covered in 003D) |
| Control Panel Owner | none — no control-panel action required at this slice |
| WLT Boundary | No finance mutation — WLT starts at payment intent (DSH-SLICE-003C) |
| Auth/Permission Boundary | **Client auth token REQUIRED** — cart must be associated with authenticated client identity. This is the primary blocker. |
| Vars/Provider Boundary | No provider policy in scope at this step |
| Notification Boundary | None — serviceability check is synchronous; no notification emitted |
| Account/Profile Boundary | Client account (identity) must exist and be authenticated |
| Data Ownership | DSH backend/domain owns serviceability response; app-client remains preview/local-state until live API wiring is proven |
| API/Runtime Boundary | GET /cart/serviceability — CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_AUTH_CLIENT_BOUND_RUNTIME_PENDING; backend production BearerAuth path exists and app-client checkout transport can send Bearer token; requires auth-service runtime proof before PASS |
| Visual Evidence Required | yes — CartScreen serviceability states: serviceable / not-serviceable / loading / blocked |
| Runtime Evidence Required | yes — GET /cart/serviceability runtime proof with auth token |
| Current Status | `CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_AUTH_CLIENT_BOUND_RUNTIME_PENDING — BLOCKED_WITH_REASON` |
| Blocking Reason | Go handler implemented. API contract in `dsh/dsh.openapi.yaml` v0.3.0. Backend production BearerAuth path exists (`DSH_AUTH_MODE=production` validates Bearer token against auth service) and app-client checkout transport can send Bearer token via `authToken` or `EXPO_PUBLIC_DSH_AUTH_BEARER_TOKEN`; DEV fallback remains `X-Client-Id`. Missing proof: live auth service session runtime, CartScreen visual/runtime proof, and WLT-adjacent checkout flow evidence. |

## Scope

### Included
- Cart serviceability check: store open, items available, delivery zone valid
- `GET /cart/serviceability` endpoint (contract designed and Go handler implemented; production BearerAuth backend path and app-client Bearer transport implemented; runtime proof pending)
- Client auth token required for cart association
- CartScreen states: serviceable, not-serviceable (with reason), loading, blocked, retry
- Proceed to checkout CTA (gated by serviceability PASS)
- Remove item CTA (always available)

### Excluded
| Surface | Reason |
|---|---|
| Payment execution | Covered in DSH-SLICE-003C (WLT bridge) |
| Order creation | Covered in DSH-SLICE-003D |
| Checkout intent (address/time selection) | Covered in DSH-SLICE-003B |
| Payment failure handling | Covered in DSH-SLICE-003E |
| WLT wallet balance | WLT owned — DSH never calls WLT financial mutation APIs |

## Coverage Matrix
| Row ID | Surface | Screen / Endpoint | Classification | Status |
|---|---|---|---|---|
| CM-003A-01 | app-client | CartScreen (`dsh/frontend/app-client/screens/CartScreen.tsx`) | primary | BLOCKED_WITH_REASON |
| CM-003A-02 | DSH backend | GET /cart/serviceability | dependency | CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_AUTH_CLIENT_BOUND_RUNTIME_PENDING |
| CM-003A-03 | shared | serviceability model (logic/domain) | dependency | BLOCKED_WITH_REASON |
| CM-003A-04 | app-client | DshCheckoutIntentScreen (downstream) | supporting | BLOCKED_WITH_REASON (depends on 003A) |
| CM-003A-05 | app-captain | — | excluded | NOT_APPLICABLE — not assigned at cart stage |
| CM-003A-06 | app-partner | — | excluded | NOT_APPLICABLE — partner readiness is J-001 |
| CM-003A-07 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003A-08 | control-panel | — | excluded | NOT_APPLICABLE — no operator action at this step |
| CM-003A-09 | WLT | — | excluded | NOT_APPLICABLE at this step — WLT starts at 003C |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Proceed to checkout | app-client | CartScreen | GET /cart/serviceability → DshCheckoutIntentScreen | client auth + serviceability PASS | BLOCKED_WITH_REASON |
| Remove item | app-client | CartScreen | local cart state mutation | none (preview-only until auth proven) | BLOCKED_WITH_REASON — local cart behavior only until live API/auth wiring is proven |
| Retry serviceability | app-client | CartScreen | re-invoke GET /cart/serviceability | previous check failed | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| loading | yes | app-client CartScreen | BLOCKED — live API wiring not proven |
| serviceable | yes | app-client CartScreen | BLOCKED — live API wiring not proven |
| not_serviceable (with reason code) | yes | app-client CartScreen | BLOCKED — live API wiring not proven |
| retry | yes | app-client CartScreen | BLOCKED — live API wiring not proven |
| blocked (auth required) | yes | app-client CartScreen | BLOCKED — primary blocker |
| empty (cart empty) | yes | app-client CartScreen | BLOCKED — no auth session yet |
| error (network/API failure) | yes | app-client CartScreen | BLOCKED — live API wiring not proven |

## Cross-Surface Impact
| Dependency | Direction | Slice | Impact |
|---|---|---|---|
| WLT auth proof | upstream | external | **Primary blocker** — client identity required to associate cart |
| DSH-SLICE-003B | downstream | J-003 | Checkout intent depends on serviceability PASS |
| DSH-SLICE-003C | downstream | J-003 | WLT payment bridge depends on 003A+003B |
| DSH-SLICE-003D | downstream | J-003 | Order creation depends on 003A+003B+003C |
| DSH-SLICE-003E | downstream | J-003 | Payment failure handling depends on 003C |

### Missing Logic / Screen / Process Proposals
| ID | Item | Classification | Reason |
|---|---|---|---|
| GAP-003A-01 | Not-serviceability reason codes | BLOCKED_WITH_REASON | Reason schema exists at API boundary but needs live runtime proof and screen mapping before PASS |
| GAP-003A-02 | Cart persistence model (server-side vs client-side) | BLOCKED_WITH_REASON | Cannot decide without auth proof — server-side cart requires client identity |
| GAP-003A-03 | Delivery zone validation logic | BLOCKED_WITH_REASON | Zone validation is part of serviceability check; contract/backend path exists but needs production auth, live runtime proof, and screen evidence before PASS |

## Evidence and Gates
- Runtime evidence: handler tests exist; backend production BearerAuth test coverage exists; app-client Bearer transport exists; no live auth service + live screen runtime proof yet
- Visual evidence: none — preview/local-state only; CartScreen exists but shows fixture data
- Existing screen: `CartScreen.tsx` registered as `client.dsh.cart.review` (routeId: `dsh-cart`), status: `VERIFIED` in screen registry (preview-only)
- Evidence path: `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/`

### Exit Gates (all must be proven before PASS)
1. BearerAuth runtime proof — client identity proven against live auth service at runtime
2. GET /cart/serviceability contract and backend handler remain aligned with tests
3. CartScreen wired to live API (not preview state)
4. Runtime proof: serviceable response → proceeds to checkout; not-serviceable response → blocks with reason
5. Visual proof: all required states captured
6. No DSH financial mutation introduced at serviceability stage

## Rollback / Disable Path
- CartScreen defaults to preview/local-state when serviceability API unavailable
- `blocked` state in screen registry ensures UI cannot proceed without API response
- Backend contract/handler remain available; rollback is limited to keeping CartScreen on blocked/preview state until live auth and API wiring are proven

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_AUTH_CLIENT_BOUND_RUNTIME_PENDING — BLOCKED_WITH_REASON` |
| **Reason** | Auth contract ready (`auth.openapi.yaml` AUTH_CONTRACT_MINIMAL_FOR_DSH_CHECKOUT). API endpoint `GET /cart/serviceability` is designed in `dsh/dsh.openapi.yaml` v0.3.0 and implemented in Go. Backend production BearerAuth path and app-client Bearer transport are implemented; DEV `X-Client-Id` remains only as fallback. Live auth service proof, CartScreen live runtime proof, and visual proof remain pending. |
| **Dependency** | Live auth service BearerAuth proof + CartScreen runtime/visual proof |
| **Next Action** | Run DSH_AUTH_MODE=production against live auth service; capture CartScreen serviceable/not-serviceable runtime + visual proof |
| **Forward-Only Gate** | All 6 exit gates must pass before PASS |
| **Evidence Folder** | `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/` |
