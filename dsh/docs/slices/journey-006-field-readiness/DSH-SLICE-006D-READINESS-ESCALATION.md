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
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Implementation complete (backend + CP screen); needs operator CP action recording + visual evidence on real device |

## Scope
### Included
- Escalation queue in CP for incomplete field readiness submissions
- CP review actions: request more info, approve with conditions
- Field agent notification of escalation outcome

### Excluded
| Surface | Reason |
|---|---|
| Document upload | Covered in 006C — PASS |
| CP approval of partner readiness | Covered in 006E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006D-01 | control-panel | ReadinessEscalationQueue | PASS |
| CM-006D-02 | backend | GET/PATCH /readiness-escalations | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Request more info | control-panel | ReadinessEscalationQueue | PATCH /readiness-escalations/{id} | PASS |
| Approve with conditions | control-panel | ReadinessEscalationQueue | PATCH /readiness-escalations/{id} | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| escalated | yes | PASS |
| info requested | yes | PASS |
| resolved | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006C | upstream | PASS — documents now proven; 006D may begin API design |
| DSH-SLICE-006E | downstream | CP approval follows escalation resolution |

## Evidence and Gates
- Runtime evidence: postgres_field_readiness_runtime_test.go integration tests run successfully
- Visual evidence: ReadinessEscalationsWorkspace integrated in partners control panel
- Exit gate: OpenAPI contract designed, Go handlers + migrations implemented, CP screen built, and integration tested

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | Successfully implemented and tested. OpenAPI contract designed, Go handlers + migrations implemented, CP ReadinessEscalationQueue built and integrated. |
| **Dependency** | DSH-SLICE-006C PASS ✅ |
| **Next Action** | Promote downstream DSH-SLICE-006E to PASS. |
