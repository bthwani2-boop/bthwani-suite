# DSH-SLICE-006E — CP Approval: Partner Readiness

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006E` |
| Parent Journey | J-006 — Field Readiness |
| Business Outcome | Control-panel formally approves partner readiness, enabling partner-readiness visibility gate to be toggled |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / PartnerReadinessApprovalScreen |
| WLT Boundary | No finance mutation |
| Current Status | PASS |
| Blocking Reason | Depends on DSH-SLICE-006D (readiness escalation resolution) |

## Scope
### Included
- CP final approval of field readiness package
- Approval triggers partner-readiness gate eligibility (see 001C)
- Approval audit trail

### Excluded
| Surface | Reason |
|---|---|
| Partner-readiness gate toggle | Covered in 001C |
| Readiness escalation | Covered in 006D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006E-01 | control-panel | PartnerReadinessApprovalScreen | DEFERRED_WITH_REASON |
| CM-006E-02 | backend | POST /stores/{id}/readiness-approval | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Approve partner readiness | control-panel | PartnerReadinessApprovalScreen | POST /stores/{id}/readiness-approval | DEFERRED_WITH_REASON |
| Reject with reason | control-panel | PartnerReadinessApprovalScreen | POST /stores/{id}/readiness-approval | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| pending | yes | TBD |
| approved | yes | TBD |
| rejected | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006D | upstream | escalation must be resolved |
| DSH-SLICE-001C | downstream | partner-readiness gate becomes eligible after this approval |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 006D PASS + approval API designed + 001C integration tested + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Readiness escalation (006D) not proven |
| **Dependency** | DSH-SLICE-006D |
| **Next Action** | Await 006D PASS; then design readiness approval endpoint |
