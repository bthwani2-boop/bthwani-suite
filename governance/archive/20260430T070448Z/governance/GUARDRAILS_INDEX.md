---
generatedFrom: governance/GUARDRAILS_INDEX.md
generatedAt: 2026-04-30T04:48:37.7777441+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Guardrails Index

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Guardrail layers

| Layer | Purpose | Primary files |
|---|---|---|
| Architecture | Prevent ownership/import/export drift | `ARCHITECTURE_GUARDRAILS.md` |
| UI/UX | Prevent visual, RTL, state, and design-system drift | `UI_UX_GUARDRAILS.md` |
| Flow/API/Binding/Runtime | Prevent incomplete flows and unproven data wiring | `FLOW_API_BINDING_RUNTIME_GUARDRAILS.md` |
| Service closure | Prevent declaring services complete without matrices/contracts/evidence | `SERVICE_CLOSURE_GUARDRAILS.md` |
| Evidence/closure | Prevent acceptance without proof | `EVIDENCE_AND_CLOSURE_GATES.md` |
| AI execution | Prevent broad Copilot/script drift | `AI_EXECUTION_GOVERNANCE.md` |
| Repo ownership | Prevent unclear ownership and duplicate source of truth | `REPO_BOUNDARIES_AND_OWNERSHIP.md` |
| Branch/checkpoint | Prevent unsafe commit/push/PR decisions | `BRANCH_AND_CHECKPOINT_POLICY.md` |
| Security | Prevent secrets and unauthorized GitHub write | `SECURITY_AND_SECRETS_GUARDRAILS.md` |
| Verification | Define commands and proof by change type | `VERIFICATION_MATRIX.md` |
| Traceability | Tie requirements to screens, contracts, tests, evidence, decisions | `TRACEABILITY_MATRIX.md` |
| Cleanup | Prevent destructive cleanup without proof | `CLEANUP_AND_DEPRECATION_POLICY.md` |

## 2. Guardrail enforcement stages

```text
During development = prevent error early
Before commit       = prevent bad change entering Git
At commit           = staged-file checks
Before push         = heavier verification
PR/CI               = official enforcement
Before closure      = evidence and decision
```

## 3. Minimum universal gates

Every non-trivial change must pass:

```text
Scope Gate
Git Gate
Diff Gate
Untracked Gate
Staged Gate
Evidence Gate
Verification Gate
Decision Gate
```

## 4. UI-specific gates

UI changes additionally require:

```text
Screenshot Gate
RTL Gate
Overflow/Clipping Gate
State Gate
Visual Identity Gate
No Local Design System Gate
```

## 5. API/data-specific gates

API or data changes additionally require:

```text
Contract Gate
Binding Gate
Permission Gate
Error Schema Gate
Runtime Proof Gate
```

## 6. Final acceptance

Only these final decisions are allowed:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
NO_ACTION_REQUIRED
```

