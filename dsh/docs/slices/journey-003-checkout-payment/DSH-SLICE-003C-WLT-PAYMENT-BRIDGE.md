# DSH-SLICE-003C — WLT Payment Bridge

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003C` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Payment executed through WLT wallet; DSH receives payment-confirmed callback and stores payment reference ID (read-only) |
| Primary Actor | Client (`app-client`) via WLT |
| Actor Chain | client → WLT (external) → DSH backend (callback receiver) |
| Operation Chain | client taps "Pay via WLT" → WLT executes payment → WLT sends payment-confirmed callback → DSH stores payment reference → triggers 003D order creation |
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
| API/Runtime Boundary | `POST /checkout/payment-callback` (DSH backend — receives WLT callback) — NOT YET DESIGNED; WLT payment execution API — WLT owned |
| Visual Evidence Required | yes — WltBoundaryBanner.tsx displayed; payment awaiting state; confirmed state |
| Runtime Evidence Required | yes — WLT payment E2E proof + DSH callback endpoint receiving confirmation |
| Current Status | `BLOCKED_WITH_REASON` |
| Blocking Reason | WLT owns payment execution; WLT runtime proof not yet available; DSH callback design requires WLT confirmation contract spec; upstream 003B not yet PASS |

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
| CM-003C-03 | DSH backend | POST /checkout/payment-callback | dependency | BLOCKED_WITH_REASON |
| CM-003C-04 | control-panel (finance) | Read-only payment reference view | supporting | BLOCKED_WITH_REASON — read-only only |
| CM-003C-05 | app-captain | — | excluded | NOT_APPLICABLE — not assigned at payment step |
| CM-003C-06 | app-partner | — | excluded | NOT_APPLICABLE — partner intake is 003D |
| CM-003C-07 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003C-08 | WLT wallet mutation | — | excluded | WLT owned — DSH never calls mutation APIs |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Pay via WLT | WLT surface | WLT-owned payment screen | WLT payment API | 003B checkout session token | BLOCKED_WITH_REASON — WLT owned |
| (Automatic) Receive callback | DSH backend | — | POST /checkout/payment-callback | WLT payment confirmation | BLOCKED_WITH_REASON |
| Retry (on WLT failure) | WLT surface | WLT-owned failure screen | Re-enter WLT payment | Previous payment failed | BLOCKED_WITH_REASON — WLT owned |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| awaiting_wlt_confirmation | yes | app-client WltBoundaryBanner | BLOCKED |
| payment_confirmed | yes | app-client / DSH backend | BLOCKED |
| payment_failed | yes | app-client (triggers 003E) | BLOCKED |
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
| GAP-003C-01 | WLT callback contract spec (event format, auth header, retry) | BLOCKED_WITH_REASON | WLT team must publish; DSH cannot design callback without it |
| GAP-003C-02 | Callback idempotency strategy (duplicate payment events) | BLOCKED_WITH_REASON | Requires WLT contract + DSH backend design; blocked |
| GAP-003C-03 | Notification trigger ownership (payment success/failure) | BLOCKED_WITH_REASON | Owner TBD — WLT or DSH notification service |

## Evidence and Gates
- Runtime evidence: none — blocked on WLT side
- Visual evidence: none — WltBoundaryBanner.tsx exists but payment flow not proven
- Evidence path: `tools/registry/runs/DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700/`

### Exit Gates (all must be proven before PASS)
1. WLT team publishes payment callback contract spec
2. DSH-SLICE-003B PASS (checkout session token available)
3. `POST /checkout/payment-callback` designed in `dsh/dsh.openapi.yaml`
4. Go backend handler implemented + unit-tested
5. WLT payment E2E runtime proof captured by WLT team
6. DSH callback endpoint proven to receive and store WLT confirmation
7. Visual proof: WltBoundaryBanner.tsx states (awaiting, confirmed, failed)

## Rollback / Disable Path
- WltBoundaryBanner.tsx is the only DSH surface element at this step
- No DSH finance mutation exists; rollback means clearing checkout session (no financial reversal in DSH)
- Financial reversal (refund) is WLT-owned via DSH-SLICE-004E

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | WLT owns payment execution; WLT runtime proof not available; callback contract spec not published; upstream 003B not yet PASS |
| **Dependency** | WLT runtime proof (external — WLT team); DSH-SLICE-003B PASS |
| **Next Action** | Await WLT callback contract spec + WLT runtime proof; then design POST /checkout/payment-callback |
| **Forward-Only Gate** | Do not start DSH-SLICE-003D or DSH-SLICE-003E until this slice reaches PASS |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700/` |
| **Closed By** | Antigravity — 2026-06-04T17:47:00Z |
