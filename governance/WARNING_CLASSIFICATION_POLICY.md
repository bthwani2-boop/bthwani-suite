# Warning Classification Policy

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: guard warnings, baseline warnings, accepted debt, and warning-to-error promotion

## 1. Why This Policy Exists

The guard system is intentionally warning-first while the governance framework is being normalized.

Warnings are not noise once classified. They become decisions.

## 2. Allowed Classifications

Every warning must eventually become one of:

- ACCEPTED_BASELINE
- FALSE_POSITIVE
- NEEDS_OWNER_DECISION
- NEEDS_FIX
- PROMOTE_TO_ERROR_LATER
- BLOCKS_CLEANUP

## 3. Classification Rules

| Classification | Meaning |
|---|---|
| ACCEPTED_BASELINE | Known warning accepted temporarily with owner and reason. |
| FALSE_POSITIVE | Guard detected a non-issue and the guard or config should be calibrated. |
| NEEDS_OWNER_DECISION | Requires product, architecture, or governance owner decision. |
| NEEDS_FIX | Valid issue that must be fixed. |
| PROMOTE_TO_ERROR_LATER | Valid issue class that should become a hard gate after baseline cleanup. |
| BLOCKS_CLEANUP | Warning blocks deletion, migration, closure, or promotion. |

## 4. Required Metadata

Each warning classification must include:

- guard id or name
- file or path
- warning type
- current severity
- classification
- owner
- reason
- target action
- target phase
- evidence root

## 5. Promotion Rule

A warning may become an error only when:

- the rule is precise
- false positives are handled
- accepted baseline is documented
- rollback exists
- CI impact is known
- owner approves promotion
- the current repo passes with `Errors: 0`

## 6. Cleanup Blocking

Dead-code cleanup, docs cleanup, route cleanup, service blueprint claims, service closure claims, and CI hard gates must not proceed when related warnings are classified as:

- NEEDS_OWNER_DECISION
- NEEDS_FIX
- BLOCKS_CLEANUP

## 7. Closure Rule

No service, screen, API, flow, or governance area may claim `100%` closure while relevant warnings remain unclassified.

## 8. CI Progression

CI activation order:

1. report-only
2. block on Errors only
3. promote selected warnings after classification
4. require governance summary in PR
5. enforce no new unclassified warnings in protected areas