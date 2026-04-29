# Warning Classification Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: GUARD warnings, baseline classification, promotion to errors

## 1. Why this policy exists

The guard system is intentionally warning-first while the governance framework is being normalized.

Warnings are not noise once classified. They become decisions.

## 2. Allowed classifications

Every warning must eventually become one of:

- ACCEPTED_BASELINE
- FALSE_POSITIVE
- NEEDS_OWNER_DECISION
- NEEDS_FIX
- PROMOTE_TO_ERROR_LATER
- BLOCKS_CLEANUP

## 3. Promotion rule

A warning may become an error only when:

- the rule is precise
- false positives are handled
- accepted baseline is documented
- rollback exists
- CI impact is known
- owner approves promotion

## 4. Cleanup blocking

Dead-code cleanup, docs cleanup, route cleanup, service blueprint claims, and CI hard gates must not proceed when related warnings are classified as:

- NEEDS_OWNER_DECISION
- NEEDS_FIX
- BLOCKS_CLEANUP

## 5. CI progression

CI activation order:

1. report-only
2. block on Errors only
3. promote selected warnings after classification
4. require governance summary in PR
5. enforce no new unclassified warnings in protected areas