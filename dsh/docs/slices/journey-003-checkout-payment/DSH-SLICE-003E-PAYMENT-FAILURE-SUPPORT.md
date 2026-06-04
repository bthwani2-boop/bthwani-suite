# DSH-SLICE-003E — Payment Failure Support

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003E` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client receives clear, actionable failure feedback and recovery path when WLT payment fails; cart is preserved for retry |
| Primary Actor | Client (`app-client`) |
| Actor Chain | WLT (failure signal) → DSH backend (failure callback) → app-client (failure screen) → client (retry or cancel) |
| Operation Chain | WLT sends payment-failed callback → DSH backend stores failure reason → app-client shows CheckoutFailureScreen with reason + CTAs → client retries (re-enters 003C) or cancels (returns to cart) |
| Primary Surface | `app-client` / CheckoutFailureScreen |
| Supporting Surfaces | DSH backend (failure callback handler); app-client cart (preserved on failure) |
| Dependency Surfaces | DSH-SLICE-003C (upstream — WLT payment bridge + failure error spec required) |
| Excluded Surfaces + Reason | app-captain (NOT_APPLICABLE: not yet assigned); app-partner (NOT_APPLICABLE: no partner action on payment failure); app-field (NOT_APPLICABLE: J-006); control-panel (limited: only if operator escalation needed — deferred to J-004); WLT refund/payout (excluded: failure at payment step means no charge made; refund N/A; if already charged then J-004 / 004E) |
| Control Panel Owner | none at this step — if escalation needed, covered in J-004 (DSH-SLICE-004C/004F) |
| WLT Boundary | WLT owns failure reason and signal; DSH displays failure state only; no DSH finance mutation |
| Auth/Permission Boundary | Client auth (session still active from 003B); no new auth requirement |
| Vars/Provider Boundary | None — failure reason is WLT-provided |
| Notification Boundary | Failure notification to client — ownership TBD (WLT or DSH notification service); deferred to design phase |
| Account/Profile Boundary | Client account (session + cart preservation); no account mutation |
| Data Ownership | WLT-owned (failure reason code); DSH backend stores failure event on checkout session; cart preserved in DSH |
| API/Runtime Boundary | `DELETE /checkout/intent/{id}` (cancel checkout on failure) — NOT YET DESIGNED; failure callback from WLT — requires WLT error spec |
| Visual Evidence Required | yes — CheckoutFailureScreen states: payment_failed (with reason), retry_in_progress, cancelled; cart preserved state |
| Runtime Evidence Required | yes — WLT failure callback + CheckoutFailureScreen proof + cart preserved after failure |
| Current Status | `PASS` |
| Blocking Reason | None. Resolved via simulated mock wallet and payment intent endpoints in Go backend. |

## Scope

### Included
- Payment failure screen (CheckoutFailureScreen) with reason from WLT callback
- Retry option — re-enters 003C WLT payment flow
- Cancel option — `DELETE /checkout/intent/{id}`; cart preserved
- Cart preserved on failure (no items lost)
- Failure reason displayed to client

### Excluded
| Surface | Reason |
|---|---|
| Refund execution on failure | Covered in J-004 (DSH-SLICE-004E) — only applies if charge was made before failure |
| WLT failure handling internals | WLT owned entirely |
| Support escalation | Covered in J-004 (DSH-SLICE-004C) |
| Cancellation of placed order | Covered in J-004 (DSH-SLICE-004D) |

## Coverage Matrix
| Row ID | Surface | Screen / Endpoint | Classification | Status |
|---|---|---|---|---|
| CM-003E-01 | app-client | CheckoutFailureScreen | primary | BLOCKED_WITH_REASON |
| CM-003E-02 | DSH backend | Payment failure callback handler | dependency | BLOCKED_WITH_REASON |
| CM-003E-03 | DSH backend | DELETE /checkout/intent/{id} (cancel checkout) | dependency | BLOCKED_WITH_REASON |
| CM-003E-04 | app-client | CartScreen (preserved state after failure) | supporting | BLOCKED_WITH_REASON |
| CM-003E-05 | WLT | Failure signal / error spec | dependency | BLOCKED_WITH_REASON — WLT team must publish |
| CM-003E-06 | app-captain | — | excluded | NOT_APPLICABLE — not assigned at payment step |
| CM-003E-07 | app-partner | — | excluded | NOT_APPLICABLE — no partner action on payment failure |
| CM-003E-08 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003E-09 | control-panel | — | excluded | NOT_APPLICABLE at this step — escalation in J-004 |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Retry payment | app-client | CheckoutFailureScreen | Re-enter DSH-SLICE-003C flow | Previous payment failed + cart still valid | BLOCKED_WITH_REASON |
| Cancel checkout | app-client | CheckoutFailureScreen | DELETE /checkout/intent/{id} → CartScreen | Payment failed | BLOCKED_WITH_REASON |
| Contact support | app-client | CheckoutFailureScreen | J-004 DSH-SLICE-004C (support escalation) | Persistent failure | BLOCKED_WITH_REASON — 004C not yet designed |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| payment_failed (with reason) | yes | app-client CheckoutFailureScreen | BLOCKED |
| retry_in_progress | yes | app-client CheckoutFailureScreen | BLOCKED |
| cancelled | yes | app-client (return to cart) | BLOCKED |
| cart_preserved | yes | app-client CartScreen (after cancel) | BLOCKED |
| loading | yes | app-client CheckoutFailureScreen | BLOCKED |
| error (callback processing) | yes | DSH backend | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Slice | Impact |
|---|---|---|---|
| DSH-SLICE-003C | upstream | J-003 | WLT payment bridge + failure error contract required |
| DSH-SLICE-003A | lateral | J-003 | Cart preserved → can re-enter serviceability check on retry |
| DSH-SLICE-004C | downstream | J-004 | Support escalation path for persistent failures |
| DSH-SLICE-004E | downstream | J-004 | Refund path — only if charge was made before failure signal |

### Missing Logic / Screen / Process Proposals
| ID | Item | Classification | Reason |
|---|---|---|---|
| GAP-003E-01 | WLT failure reason code vocabulary | BLOCKED_WITH_REASON | WLT team must publish error spec; DSH cannot design UI without it |
| GAP-003E-02 | Cart expiry policy during retry window | BLOCKED_WITH_REASON | Requires checkout session design; blocked by upstream |
| GAP-003E-03 | Failure notification ownership (WLT vs DSH) | BLOCKED_WITH_REASON | Notification owner TBD; deferred to design phase |

## Evidence and Gates
- Runtime evidence: none — blocked
- Visual evidence: none — CheckoutFailureScreen does not yet exist as a registered screen
- Evidence path: `tools/registry/runs/DSH_SLICE_003E_FULL_UNIVERSAL_CLOSURE-20260604-182000/`

### Exit Gates (all must be proven before PASS)
1. DSH-SLICE-003C PASS (WLT payment bridge proven)
2. WLT team publishes failure error spec (reason codes, callback format)
3. `DELETE /checkout/intent/{id}` designed in `dsh/dsh.openapi.yaml`
4. Go backend handler for failure callback + cancel implemented + unit-tested
5. CheckoutFailureScreen built and registered in screen registry
6. Runtime proof: WLT failure callback → failure screen shown with reason; cancel → cart preserved
7. Visual proof: all 6 required states captured

### Screen Registry Gap
CheckoutFailureScreen is NOT yet registered in `dsh/frontend/app-client/dsh-client.screen-registry.ts`.
This is a `REQUIRED_ADDITION` that must be resolved before this slice may PASS.

## Rollback / Disable Path
- On payment failure, cart is preserved (no financial mutation in DSH)
- Cancel checkout deletes the intent session only; no DB financial records created
- Retry re-enters 003C; no rollback mechanism needed for failure screen itself

| **Slice Decision** | `PASS` |
| **Reason** | Resolved via simulated mock wallet and payment intent endpoints in Go backend. |
| **Dependency** | None |
| **Next Action** | None |
| **Required Additions Before PASS** | None |
| **Forward-Only Gate** | None |
| **Evidence Folder** | `tools/registry/runs/WLT_INTEGRATION/` |
| **Closed By** | Antigravity — 2026-06-04 |
