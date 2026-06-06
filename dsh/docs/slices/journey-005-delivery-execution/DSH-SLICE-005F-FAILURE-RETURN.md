# DSH-SLICE-005F — Failure & Return

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005F` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | If delivery fails (client unreachable, wrong address), captain reports failure; order queued for ops; return flow managed |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / DshCaptainPoDSubmissionScreen (reportPodFailure CTA) |
| WLT Boundary | Refund execution owned by WLT (004E). DSH stores wlt_refund_trigger_ref as bridge reference only. Zero financial mutation in DSH. |
| Current Status | PASS |

## Scope
### Included
- Delivery failure reporting with reason
- Return-to-store instruction
- Exception created in CP queue (004F)
- Refund trigger sent to WLT bridge (004E)

### Excluded
| Surface | Reason |
|---|---|
| Proof of delivery (success path) | Covered in 005E |
| Refund execution | WLT owned (004E) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005F-01 | app-captain | DshCaptainPoDSubmissionScreen (reportPodFailure) | **PASS** |
| CM-005F-02 | backend | POST /orders/{id}/fail-delivery | **PASS** |
| CM-005F-03 | backend | POST /orders/{id}/confirm-return | **PASS** |
| CM-005F-04 | backend | DB migration 018 (delivery_failure_reason + wlt_refund_trigger_ref) | **PASS** |
| CM-005F-05 | shared | DshOrderLifecycleClient.failDelivery + confirmReturn | **PASS** |
| CM-005F-06 | openapi | /orders/{id}/fail-delivery + /orders/{id}/confirm-return paths + schema | **PASS** |
| CM-005F-07 | domain | FailDeliveryRequest + ConfirmReturnRequest + 3 new statuses | **PASS** |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Report delivery failure | app-captain | DshCaptainPoDSubmissionScreen (onReportFailure) | POST /orders/{id}/fail-delivery | **PASS** |
| Confirm return to store | app-captain | POST confirm-return flow | POST /orders/{id}/confirm-return | **PASS** |
| CP exception creation | control-panel | ExceptionQueueScreen | DSH-SLICE-004F (already PASS) | OUT_OF_SCOPE |

## State Matrix
| State | Required | Status |
|---|---|---|
| delivery attempted (ARRIVED) | yes | **PASS** — enforced: ARRIVED guard on POST /fail-delivery |
| FAILED_DELIVERY | yes | **PASS** — transition ARRIVED→FAILED_DELIVERY (no return) |
| RETURNING_TO_STORE | yes | **PASS** — transition ARRIVED→RETURNING_TO_STORE (return_required=true) |
| RETURNED | yes | **PASS** — transition RETURNING_TO_STORE→RETURNED via confirm-return |
| wlt_refund_trigger_ref stored | yes | **PASS** — bridge ref written to DB; WLT executes refund independently |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005E | upstream | failure is alt-path to proof of delivery |
| DSH-SLICE-004E | lateral | refund triggered on failure |
| DSH-SLICE-004F | lateral | exception created in CP queue |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_005F_FAILURE_RETURN_FINAL_CLOSURE-20260606-LOCAL/005F_api_results.json`
- Migration 018 applied: `018_delivery_failure_return.sql` — status constraint extended + 2 new columns
- Flow A: ARRIVED → FAILED_DELIVERY (no return) — wlt_refund_trigger_ref stored
- Flow B: ARRIVED → RETURNING_TO_STORE → RETURNED — full return chain verified
- Guard evidence: wrong captain → 403, missing reason → 400, idempotency → 409, double return → 409
- WLT boundary: zero financial mutation confirmed in E2E
- Session: `DSH_SLICE_005F_FAILURE_RETURN_FINAL_CLOSURE-20260606-LOCAL`
- Visual evidence: `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/dsh_j005_app_captain_order_detail.png`
- Current-session code evidence: app-captain uses injectable `captainId` for failure reporting through the typed lifecycle client; `wlt_refund_trigger_ref` remains a bridge reference only.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | J-004 closed. `POST /orders/{id}/fail-delivery` and `POST /orders/{id}/confirm-return` confirmed in production handler. Migration 018 applied (delivery_failure_reason + wlt_refund_trigger_ref). Flow A (FAILED_DELIVERY) and Flow B (RETURNING_TO_STORE→RETURNED) verified. Guards: wrong captain→403, missing reason→400, idempotency→409, double return→409. WLT boundary confirmed — wlt_refund_trigger_ref is bridge reference only; DSH does NOT execute refunds. |
| **WLT Boundary** | Confirmed — wlt_refund_trigger_ref is bridge reference only. DSH does NOT execute refunds. WLT (004E) owns refund. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |
