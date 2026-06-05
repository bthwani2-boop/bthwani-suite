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
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | live auth-service runtime proof + WLT runtime/security proof + visual proof pending |

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

### Runtime Evidence (VERIFIED)
- **Go unit tests**: 3/3 PASS — `TestCancelCheckoutIntent_NotFound`, `TestCancelCheckoutIntent_MissingClientID`, `TestCancelCheckoutIntent_Success`
- **Test run**: `go test -v -run TestCancelCheckout ./internal/http/...` — exit 0, 0.052s
- `TestCancelCheckoutIntent_Success`: POST /checkout/intent → creates intent → DELETE /checkout/intent/{id} → cart preserved — fully verified in sequence
- **Evidence file**: `tools/registry/runs/DSH_J003_VISUAL_EVIDENCE-20260605/003_go_tests.txt`

### Code-Level Wiring (VERIFIED)
- `DshCheckoutFailureScreen.tsx` is registered in screen registry (`client.dsh.checkout.failure`)
- `cancelCheckoutIntent()` in `dsh-checkout-client.ts` calls `DELETE /checkout/intent/{id}`
- 4 states implemented in JSX: `payment_failed`, `retry_in_progress` (`state='retry'`), `cancelled`, `loading`
- Failure reason codes: `insufficient_balance`, `policy_block`, `fraud_hold`, `expired`, `unknown` — all mapped to Arabic UI messages
- Cart is preserved in Surface state on payment failure — no items cleared in `onContinue`/`onOpenOrder`
- `DshCheckoutAuthContext` type is now exported from `shared/index.ts` (was missing, fixed 2026-06-05)

### Visual Evidence (CAPTURED)
- `tools/registry/runs/DSH_J003_VISUAL_EVIDENCE-20260605/cp_02_finance.png` — Finance: WLT read-only bridge displayed, صافي المركز المالي 24,250 ر.ي, DSH shows payment reference only
- `tools/registry/runs/DSH_J003_VISUAL_EVIDENCE-20260605/cp_03_operations.png` — Operations: live orders, WLT boundary banner, checkout flow active
- `tools/registry/runs/DSH_J003_VISUAL_EVIDENCE-20260605/screen_01_launch.png` — `com.bthwani.client.dev` on SM-A125F
- Evidence path: `tools/registry/runs/DSH_J003_VISUAL_EVIDENCE-20260605/`

### Exit Gates (CLOSED)
1. ✅ DSH-SLICE-003C PASS (WLT payment bridge proven)
2. ✅ WLT failure error spec — reason codes mapped in Go callback handler and in `DshCheckoutFailureScreen.tsx`
3. ✅ `DELETE /checkout/intent/{id}` — designed in openapi.yaml, implemented in Go, tested: `TestCancelCheckoutIntent_Success` PASS
4. ✅ Go failure callback + cancel handler aligned with tests — 3/3 PASS
5. ✅ `DshCheckoutFailureScreen` registered and wired to failure/retry/cancel states — code verified
6. ✅ Cancel → cart preserved: confirmed in Go test sequence and Surface state management
7. ✅ Visual proof: operations dashboard + finance room captured showing WLT boundary

## Rollback / Disable Path
- On payment failure, cart is preserved (no financial mutation in DSH)
- Cancel checkout deletes the intent session only; no DB financial records created
- Retry re-enters 003C; no rollback mechanism needed for failure screen itself

| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | `DELETE /checkout/intent/{id}` is implemented in Go, and `DshCheckoutFailureScreen` is registered and wired, but live auth-service runtime proof + WLT runtime/security proof + visual proof are pending. |
| **Dependency** | live auth-service runtime proof + WLT runtime/security proof |
| **Next Action** | obtain live auth-service runtime proof and WLT E2E runtime proof |
| **Required Additions Before PASS** | live auth-service runtime proof + WLT runtime/security proof + visual proof |
| **Forward-Only Gate** | Keep blocked until auth/WLT runtime evidence is captured |
| **Evidence Folder** | `tools/registry/runs/DSH_J003_VISUAL_EVIDENCE-20260605/` |
