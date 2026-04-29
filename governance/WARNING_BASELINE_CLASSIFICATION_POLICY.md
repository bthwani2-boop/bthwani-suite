# Warning Baseline Classification Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: all guard warnings, baseline warnings, accepted debt, and warning-to-error promotion

## 1. Purpose

Warnings are not ignored. They are temporarily tolerated only while classified, tracked, and promoted safely.

## 2. Required classifications

Every warning must become one of:

- ACCEPTED_BASELINE
- FALSE_POSITIVE
- NEEDS_OWNER_DECISION
- NEEDS_FIX
- PROMOTE_TO_ERROR_LATER
- BLOCKS_CLEANUP

## 3. Classification rules

| Classification | Meaning |
|---|---|
| ACCEPTED_BASELINE | known warning accepted temporarily with owner and reason |
| FALSE_POSITIVE | guard detected non-issue and config/guard should be calibrated |
| NEEDS_OWNER_DECISION | requires product/architecture/governance decision |
| NEEDS_FIX | valid issue that must be fixed |
| PROMOTE_TO_ERROR_LATER | valid issue class to become hard gate after baseline cleanup |
| BLOCKS_CLEANUP | warning blocks deletion, migration, or closure |

## 4. Required metadata

Each warning classification must include:

- guard id/name
- file/path
- warning type
- current severity
- classification
- owner
- reason
- target action
- target phase
- evidence root

## 5. Promotion rule

No warning may be promoted to Error unless:

- false positives are handled
- accepted baseline is documented
- owner approves promotion
- CI impact is understood
- rollback exists
- current repo passes with Errors: 0

## 6. Closure rule

No service, screen, API, flow, or governance area may claim 100% closure while relevant warnings remain unclassified.
