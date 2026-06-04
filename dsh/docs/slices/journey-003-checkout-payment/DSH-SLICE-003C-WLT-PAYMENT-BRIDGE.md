# DSH-SLICE-003C — WLT Payment Bridge

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003C` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Payment executed through WLT wallet; DSH receives payment-confirmed callback and stores payment reference ID (read-only) |
| Primary Actor | Client (`app-client`) via WLT |
| Actor Chain | client → WLT (external) → DSH backend (callback receiver) |
| Operation Chain | client taps "Pay via WLT" → WLT executes payment → WLT sends payment-confirmed/failed callback → DSH stores payment reference + updates intent status → 003D order creation is a SEPARATE subsequent step NOT triggered here |
| Primary Surface | WLT (external boundary — WLT team owns) |
| Supporting Surfaces | app-client (WltBoundaryBanner.tsx displayed during payment step); DSH backend (callback endpoint) |
| Dependency Surfaces | DSH-SLICE-003B (upstream — checkout session token required); WLT runtime proof (upstream — WLT team must prove payment E2E) |
| Excluded Surfaces + Reason | app-captain (NOT_APPLICABLE: not yet assigned at payment step); app-partner (NOT_APPLICABLE: partner intake is 003D); app-field (NOT_APPLICABLE: J-006); control-panel (NOT_APPLICABLE: payment is WLT-owned; DSH CP reads only); wallet balance mutation (WLT owned — DSH never calls WLT financial mutation APIs) |
| Control Panel Owner | finance (read-only WLT bridge) — DSH CP shows payment reference only; no mutation |
| WLT Boundary | **Full WLT ownership** — WLT executes payment, manages wallet balance, issues confirmation. DSH receives callback only and stores reference ID (read-only). No DSH finance mutation. |
| Auth/Permission Boundary | WLT-managed auth for payment; client identity proven upstream in 003A |
| Vars/Provider Boundary | WLT payment provider policy — WLT team owns; DSH does not configure payment providers |
| Notification Boundary | Payment success/failure notification — emitted after this step; owner TBD (WLT or DSH notification service) |
| Account/Profile Boundary | WLT wallet account — WLT owned; DSH reads only |
| Data Ownership | WLT-owned (payment execution); DSH stores payment reference ID only in backend database |
| API/Runtime Boundary | `POST /checkout/payment-callback` — CONTRACT_DESIGNED_BACKEND_IMPLEMENTED in dsh.openapi.yaml v0.3.0; backend handler validates X-WLT-Callback-Token, X-WLT-Event-Id, and Idempotency-Key; repository persists `wlt_callback_event_id` for replay protection; ARCHITECTURAL_DECISION: callback-primary flow (WLT calls DSH) is PRIMARY; polling fallback is SECONDARY; WLT runtime/security proof remains required before PASS — WLT payment execution API is WLT-owned |
| Visual Evidence Required | yes — WltBoundaryBanner.tsx displayed; payment awaiting state; confirmed state |
| Runtime Evidence Required | yes — WLT payment E2E proof + DSH callback endpoint receiving confirmation |
| Current Status | `BLOCKED_WITH_REASON — CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_WLT_RUNTIME_PENDING` |
| Blocking Reason | DSH callback endpoint `POST /checkout/payment-callback` designed in `dsh/dsh.openapi.yaml` v0.3.0 and backend handler implemented (X-WLT-Callback-Token + X-WLT-Event-Id + Idempotency-Key validation, `wlt_callback_event_id` persistence, 003C/003D separation enforced). WLT bridge contract published in `wlt/wlt.openapi.yaml`. Remaining: WLT team must publish final callback security/runtime proof and prove E2E payment. 003B PASS required. |

## Scope

### Included
- DSH receives `payment-confirmed` callback from WLT
- DSH backend stores payment reference ID (read-only field on checkout session)
- `WltBoundaryBanner.tsx` displayed in app-client during payment step
- DSH callback endpoint: `POST /checkout/payment-callback`

### Excluded
| Surface | Reason |
|---|---|
| Payment execution logic | WLT owns entirely — no DSH involvement |
| Wallet balance mutation | WLT owned — DSH never calls WLT financial mutation APIs |
| Refund execution | Covered in DSH-SLICE-004E (WLT bridge) |
| Order creation | Covered in DSH-SLICE-003D (triggered after this step) |

## Coverage Matrix
| Row ID | Surface | Screen / Endpoint | Classification | Status |
|---|---|---|---|---|
| CM-003C-01 | WLT | Payment execution (WLT-owned screens) | primary | BLOCKED_WITH_REASON — WLT team must prove |
| CM-003C-02 | app-client | WltBoundaryBanner.tsx (payment step) | supporting | BLOCKED_WITH_REASON |
| CM-003C-03 | DSH backend | POST /checkout/payment-callback | dependency | CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_AUTH_HEADERS_ENFORCED |
| CM-003C-04 | control-panel (finance) | Read-only payment reference view | supporting | BLOCKED_WITH_REASON — read-only only |
| CM-003C-05 | app-captain | — | excluded | NOT_APPLICABLE — not assigned at payment step |
| CM-003C-06 | app-partner | — | excluded | NOT_APPLICABLE — partner intake is 003D |
| CM-003C-07 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003C-08 | WLT wallet mutation | — | excluded | WLT owned — DSH never calls mutation APIs |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Pay via WLT | WLT surface | WLT-owned payment screen | WLT payment API | 003B checkout session token | BLOCKED_WITH_REASON — WLT owned |
| (Automatic) Receive callback | DSH backend | — | POST /checkout/payment-callback | WLT payment confirmation | BLOCKED_WITH_REASON — DSH receiver implemented; WLT runtime proof pending |
| Retry (on WLT failure) | WLT surface | WLT-owned failure screen | Re-enter WLT payment | Previous payment failed | BLOCKED_WITH_REASON — WLT owned |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| awaiting_wlt_confirmation | yes | app-client WltBoundaryBanner | BLOCKED |
| payment_confirmed | yes | app-client / DSH backend | BLOCKED — backend state path implemented; WLT runtime + app-client visual proof pending |
| payment_failed | yes | app-client (triggers 003E) | BLOCKED — backend state path implemented; WLT runtime + app-client visual proof pending |
| loading | yes | app-client WltBoundaryBanner | BLOCKED |
| error (callback failure) | yes | DSH backend | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Slice | Impact |
|---|---|---|---|
| WLT runtime proof | upstream | external | Primary blocker — WLT must prove payment execution |
| DSH-SLICE-003B | upstream | J-003 | Checkout session token required |
| DSH-SLICE-003D | downstream | J-003 | Order creation triggered by payment confirmation callback |
| DSH-SLICE-003E | downstream | J-003 | Payment failure handling triggered by failure callback |
| DSH-SLICE-010A | lateral | J-010 | CP finance (DSH read-only WLT bridge) sees payment reference |

### Missing Logic / Screen / Process Proposals
| ID | Item | Classification | Reason |
|---|---|---|---|
| GAP-003C-01 | WLT final callback runtime/security proof (event format, auth header, retry) | BLOCKED_WITH_REASON | WLT OpenAPI bridge exists, but WLT team must prove the final runtime/security behavior before PASS |
| GAP-003C-02 | WLT retry/idempotency semantics beyond DSH event persistence | BLOCKED_WITH_REASON | DSH stores `wlt_callback_event_id` and returns idempotent acknowledgement for repeated events; WLT final retry/security runtime proof remains pending |
| GAP-003C-03 | Notification trigger ownership (payment success/failure) | BLOCKED_WITH_REASON | Owner TBD — WLT or DSH notification service |

## Evidence and Gates
- Runtime evidence: none — blocked on WLT side
- Visual evidence: none — WltBoundaryBanner.tsx exists but payment flow not proven
- Evidence path: `tools/registry/runs/DSH_JOURNEY_001_002_003_FINAL_TRUTH_CLOSURE-20260604/`

### Exit Gates (all must be proven before PASS)
1. WLT team publishes/proves final payment callback runtime/security behavior
2. DSH-SLICE-003B PASS (checkout session token available)
3. `POST /checkout/payment-callback` contract, Go handler, and idempotency header requirements remain aligned with tests
4. `wlt_callback_event_id` persistence/replay behavior remains proven in targeted checkout tests
5. WLT payment E2E runtime proof captured by WLT team
6. DSH callback endpoint proven to receive and store WLT confirmation
7. Visual proof: WltBoundaryBanner.tsx states (awaiting, confirmed, failed)

## Rollback / Disable Path
- WltBoundaryBanner.tsx is the only DSH surface element at this step
- No DSH finance mutation exists; rollback means clearing checkout session (no financial reversal in DSH)
- Financial reversal (refund) is WLT-owned via DSH-SLICE-004E

| **Slice Decision** | `OPEN_CONTRACT_DESIGNED_BACKEND_IMPLEMENTED_WLT_RUNTIME_PENDING` |
| **Reason** | DSH callback endpoint `POST /checkout/payment-callback` designed in `dsh/dsh.openapi.yaml` v0.3.0 and implemented in Go with required callback headers plus `wlt_callback_event_id` replay protection. WLT payment bridge contract is published in `wlt/wlt.openapi.yaml`. WLT team must still prove E2E runtime/security before PASS. |
| **Dependency** | WLT team E2E runtime/security proof; DSH-SLICE-003B pass; WltBoundaryBanner visual/runtime proof |
| **Next Action** | WLT team publishes runtime/security proof; wire/prove WltBoundaryBanner states; capture DSH callback runtime evidence with WLT confirmation/failure |
| **Forward-Only Gate** | All 7 exit gates must pass before PASS |
| **Evidence Folder** | `tools/registry/runs/DSH_JOURNEY_001_002_003_FINAL_TRUTH_CLOSURE-20260604/` |
