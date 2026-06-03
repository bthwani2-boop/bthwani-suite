# DSH-SLICE-004C — Support Escalation

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-004C` |
| Parent Journey | J-004 — Order Lifecycle |
| Business Outcome | Client or partner can escalate order issues to control-panel support queue |
| Primary Actor | Client (app-client) / Partner (app-partner) |
| Primary Surface | app-client / SupportEscalationScreen; control-panel / SupportQueueScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on J-003/J-004 runtime; support escalation requires live order context |

## Scope
### Included
- Escalation submission from client or partner
- Support queue in control-panel
- Escalation status tracking

### Excluded
| Surface | Reason |
|---|---|
| Refund decisions | Covered in 004E (WLT bridge) |
| Dispatch exceptions | Covered in 009C |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-004C-01 | app-client | SupportEscalationScreen | DEFERRED_WITH_REASON |
| CM-004C-02 | control-panel | SupportQueueScreen | DEFERRED_WITH_REASON |
| CM-004C-03 | backend | POST /support/escalations | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit escalation | app-client | SupportEscalationScreen | POST /support/escalations | DEFERRED_WITH_REASON |
| Resolve escalation | control-panel | SupportQueueScreen | PATCH /support/escalations/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| open | yes | TBD |
| in-review | yes | TBD |
| resolved | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| J-003 / J-004 runtime | upstream | live order context required |
| DSH-SLICE-009C | lateral | exception escalation overlaps |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: J-003 + J-004 runtime proven + support API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | No live order context; J-003/J-004 not proven |
| **Dependency** | J-003 and J-004 runtime closure |
| **Next Action** | Await J-003/J-004 close; then design support escalation API |
