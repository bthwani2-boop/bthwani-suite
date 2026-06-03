# DSH-SLICE-004F — CP Exception Queue

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-004F` |
| Parent Journey | J-004 — Order Lifecycle |
| Business Outcome | Control-panel has a unified exception queue for orders needing manual intervention |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / ExceptionQueueScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on J-003/J-004 runtime; no exception data exists yet |

## Scope
### Included
- Exception queue listing: failed payments, unaccepted orders, delivery failures
- CP intervention actions per exception type
- Exception resolution audit trail

### Excluded
| Surface | Reason |
|---|---|
| Dispatch exceptions | Covered in 009C |
| Refund execution | Covered in 004E (WLT) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004F-01 | control-panel | ExceptionQueueScreen | DEFERRED_WITH_REASON |
| CM-004F-02 | backend | GET /exceptions | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Resolve exception | control-panel | ExceptionQueueScreen | PATCH /exceptions/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| open exception | yes | TBD |
| in-review | yes | TBD |
| resolved | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-003 runtime | upstream | payment/order exceptions need live data |
| J-004 runtime | upstream | order lifecycle exceptions need live data |
| DSH-SLICE-009C | lateral | dispatch exceptions overlap |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: J-003 + J-004 runtime proven + exception API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No live order/exception data; J-003/J-004 runtime not proven |
| **Dependency** | J-003 and J-004 runtime closure |
| **Next Action** | Await J-003/J-004 close; then design exception queue API |
