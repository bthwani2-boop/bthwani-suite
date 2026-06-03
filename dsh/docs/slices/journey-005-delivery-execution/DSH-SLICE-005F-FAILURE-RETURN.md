# DSH-SLICE-005F — Failure & Return

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005F` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | If delivery fails (client unreachable, wrong address), captain returns item; exception queued for CP |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / DeliveryFailureScreen |
| WLT Boundary | Refund execution (if applicable) owned by WLT (004E) |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-005E (proof of delivery flow) to establish the normal path first |

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
| CM-005F-01 | app-captain | DeliveryFailureScreen | DEFERRED_WITH_REASON |
| CM-005F-02 | backend | POST /orders/{id}/fail-delivery | DEFERRED_WITH_REASON |
| CM-005F-03 | control-panel | ExceptionQueueScreen (new exception) | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Report delivery failure | app-captain | DeliveryFailureScreen | POST /orders/{id}/fail-delivery | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| delivery attempted | yes | TBD |
| FAILED | yes | TBD |
| returning to store | yes | TBD |
| returned | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005E | upstream | failure is alt-path to proof of delivery |
| DSH-SLICE-004E | lateral | refund triggered on failure |
| DSH-SLICE-004F | lateral | exception created in CP queue |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 005E PASS + failure API designed + CP exception created + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Normal delivery path (005E) not proven; failure path cannot be tested without it |
| **Dependency** | DSH-SLICE-005E |
| **Next Action** | Await 005E PASS; then design delivery failure endpoint |
