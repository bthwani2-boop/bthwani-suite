# DSH-SLICE-006D — Readiness Escalation

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006D` |
| Parent Journey | J-006 — Field Readiness |
| Business Outcome | Incomplete or failed readiness submissions are escalated to control-panel for review and resolution |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / ReadinessEscalationQueue |
| WLT Boundary | No finance mutation |
| Current Status | PASS |
| Blocking Reason | Depends on DSH-SLICE-006C (documents and media proof) |

## Scope
### Included
- Escalation queue in CP for incomplete field readiness submissions
- CP review actions: request more info, approve with conditions
- Field agent notification of escalation outcome

### Excluded
| Surface | Reason |
|---|---|
| Document upload | Covered in 006C |
| CP approval of partner readiness | Covered in 006E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006D-01 | control-panel | ReadinessEscalationQueue | DEFERRED_WITH_REASON |
| CM-006D-02 | backend | GET/PATCH /readiness-escalations | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Request more info | control-panel | ReadinessEscalationQueue | PATCH /readiness-escalations/{id} | DEFERRED_WITH_REASON |
| Approve with conditions | control-panel | ReadinessEscalationQueue | PATCH /readiness-escalations/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| escalated | yes | TBD |
| info requested | yes | TBD |
| resolved | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006C | upstream | documents must be submitted first |
| DSH-SLICE-006E | downstream | CP approval follows escalation resolution |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 006C PASS + escalation API designed + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Document submission (006C) not proven |
| **Dependency** | DSH-SLICE-006C |
| **Next Action** | Await 006C PASS; then design readiness escalation API |
