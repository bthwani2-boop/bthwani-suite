# DSH-SLICE-008C — Vars Scope Audit

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-008C` |
| Parent Journey | J-008 — Platform Vars & Provider |
| Business Outcome | Audit confirms all platform vars are correctly scoped (client-safe vs server-only); no secrets leak to client |
| Primary Actor | Engineering (audit process) |
| Primary Surface | platform route / vars config |
| WLT Boundary | N/A |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on 008A provider policy; scope rules cannot be audited without defined policy |

## Scope
### Included
- Classify all vars: NEXT_PUBLIC_ (client-safe) vs server-only
- Audit for secret leakage to client bundle
- Guard to prevent server-only vars being accessed in client code

### Excluded
| Surface | Reason |
|---|---|
| Provider infrastructure | Covered in 008A |
| Feature flags | Covered in 008B |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-008C-01 | all | build-time audit | DEFERRED_WITH_REASON |
| CM-008C-02 | platform route | vars classification | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A — audit process | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| audit clean | yes | TBD |
| secret leakage detected | yes | CI failure |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-008A | upstream | provider policy must be defined |
| DSH-SLICE-008D | downstream | policy impact requires clean audit |

## Evidence and Gates
- Runtime evidence: not applicable — audit process
- Visual evidence: not applicable
- Exit gate: 008A PASS + all vars classified + no leakage detected + guard in CI

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Provider policy (008A) not defined; cannot audit scope without knowing what vars exist |
| **Dependency** | DSH-SLICE-008A |
| **Next Action** | Await 008A PASS; then classify all vars and run scope audit |
