# DSH-SLICE-009C — Exception Escalation

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-009C` |
| Parent Journey | J-009 — Control Panel Operations |
| Business Outcome | Control-panel has a unified exception escalation surface for all order, delivery, and support exceptions |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / ExceptionEscalationScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on J-004 order lifecycle being proven; no live exception data exists |

## Scope
### Included
- Unified exception queue: order exceptions (004F) + delivery exceptions (005F) + support escalations (004C)
- CP intervention actions per exception type
- Escalation audit trail

### Excluded
| Surface | Reason |
|---|---|
| Dispatch reassignment | Covered in 009B |
| Refund execution | WLT owned (004E) |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009C-01 | control-panel | ExceptionEscalationScreen | DEFERRED_WITH_REASON |
| CM-009C-02 | backend | GET /exceptions (unified) | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Resolve exception | control-panel | ExceptionEscalationScreen | PATCH /exceptions/{id} | DEFERRED_WITH_REASON |
| Escalate to senior CP | control-panel | ExceptionEscalationScreen | POST /exceptions/{id}/escalate | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| open | yes | TBD |
| in-review | yes | TBD |
| escalated | yes | TBD |
| resolved | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-004F | upstream | order exceptions feed this queue |
| DSH-SLICE-004C | upstream | support escalations feed this queue |
| DSH-SLICE-005F | upstream | delivery failures feed this queue |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: J-004 runtime proven + unified exception API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | J-004 order lifecycle not proven; no live exception data |
| **Dependency** | J-004 runtime closure |
| **Next Action** | Await J-004 close; then design unified exception API |
