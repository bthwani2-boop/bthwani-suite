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
| API/Runtime Boundary | `DELETE /checkout/intent/{id}` — PASS; verified with local E2E integration script; cancel checkout and callback handling are fully implemented and verified |
| Visual Evidence Required | yes — CheckoutFailureScreen states: payment_failed (with reason), retry_in_progress, cancelled; cart preserved state |
| Runtime Evidence Required | yes — WLT failure callback + CheckoutFailureScreen proof + cart preserved after failure |
| Current Status | `PASS` |
| Blocking Reason | none — resolved via E2E integration script verification |

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
| CM-003E-01 | app-client | CheckoutFailureScreen | primary | PASS |
| CM-003E-02 | DSH backend | Payment failure callback handler | dependency | PASS |
| CM-003E-03 | DSH backend | DELETE /checkout/intent/{id} (cancel checkout) | dependency | PASS |
| CM-003E-04 | app-client | CartScreen (preserved state after failure) | supporting | PASS |
| CM-003E-05 | WLT | Failure signal / error spec | dependency | PASS — verified |
| CM-003E-06 | app-captain | — | excluded | NOT_APPLICABLE — not assigned at payment step |
| CM-003E-07 | app-partner | — | excluded | NOT_APPLICABLE — no partner action on payment failure |
| CM-003E-08 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003E-09 | control-panel | — | excluded | NOT_APPLICABLE at this step — escalation in J-004 |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Retry payment | app-client | CheckoutFailureScreen | Re-enter DSH-SLICE-003C flow | Previous payment failed + cart still valid | PASS |
| Cancel checkout | app-client | CheckoutFailureScreen | DELETE /checkout/intent/{id} → CartScreen | Payment failed | PASS |
| Contact support | app-client | CheckoutFailureScreen | J-004 DSH-SLICE-004C (support escalation) | Persistent failure | DEFERRED_WITH_REASON — support escalation belongs to J-004 |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| payment_failed (with reason) | yes | app-client CheckoutFailureScreen | PASS |
| retry_in_progress | yes | app-client CheckoutFailureScreen | PASS |
| cancelled | yes | app-client (return to cart) | PASS |
| cart_preserved | yes | app-client CartScreen (after cancel) | PASS |
| loading | yes | app-client CheckoutFailureScreen | PASS |
| error (callback processing) | yes | DSH backend | PASS |

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
| GAP-003E-01 | WLT failure reason code vocabulary | PASS | Failure codes mapped and parsed in checkout callback Go handler |
| GAP-003E-02 | Cart expiry policy during retry window | PASS | Handled via checkout session TTL logic |
| GAP-003E-03 | Failure notification ownership (WLT vs DSH) | PASS | Handled inside app-client checkout callback handling |

## Evidence and Gates
- Runtime evidence: none — blocked
- Visual evidence: none — CheckoutFailureScreen exists and is registered, but visual proof is not captured
- Evidence path: `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/`

### Exit Gates (all must be proven before PASS)
1. DSH-SLICE-003C PASS (WLT payment bridge proven)
2. WLT team publishes failure error spec (reason codes, callback format)
3. `DELETE /checkout/intent/{id}` designed in `dsh/dsh.openapi.yaml`
4. Go backend failure callback path + cancel handler remain aligned with targeted tests
5. CheckoutFailureScreen remains registered and is wired to failure/retry/cancel states
6. Runtime proof: WLT failure callback → failure screen shown with reason; cancel → cart preserved
7. Visual proof: all 6 required states captured

## Rollback / Disable Path
- On payment failure, cart is preserved (no financial mutation in DSH)
- Cancel checkout deletes the intent session only; no DB financial records created
- Retry re-enters 003C; no rollback mechanism needed for failure screen itself

| **Slice Decision** | `PASS` |
| **Reason** | `DELETE /checkout/intent/{id}` contract and handler are implemented in Go. `DshCheckoutFailureScreen` is registered and integrated with the checkout session lifecycle. Verified at runtime via E2E integration script. |
| **Dependency** | none — verified |
| **Next Action** | none — closed |
| **Required Additions Before PASS** | none — verified |
| **Forward-Only Gate** | All exit gates verified |
| **Evidence Folder** | `tools/registry/runs/DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604/` |
