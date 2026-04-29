# Execution Law

Status: CANONICAL
Owner: BThwani Governance
Scope: phased execution, acceleration, closure, and promotion from legacy-extracted governance content

## 1. Execution principle

BThwani execution must be fast, scoped, evidence-backed, and non-random.

Speed is achieved by batching cohesive tasks, not by removing verification.

## 2. Phase model

Allowed phase sequence:

1. AUDIT
2. CLASSIFY
3. WRITE_SCOPED
4. VERIFY
5. COMMIT_SCOPED
6. PUSH
7. EVIDENCE_HANDOFF
8. PROMOTE_OR_CLOSE
9. NEXT_SCOPE

A later phase may not claim closure for an earlier skipped phase.

## 3. Batch sizing rule

A batch may include multiple tasks only when they share:

- same owner
- same root
- same risk class
- same verification path
- same commit purpose

Examples of valid batches:

- six canonical governance policies
- multiple policy docs under `governance/`
- guard documentation plus matching guard config
- service blueprint repairs for one service only

Examples of invalid batches:

- governance docs + UI redesign + API binding
- multiple services without service matrix
- deletion plus unrelated refactor
- CI hardening plus UI fixes

## 4. Stop conditions

Execution must stop on:

- wrong branch
- dirty working tree outside expected scope
- missing expected file
- unexpected staged file
- diff-check failure
- typecheck failure
- guard Errors > 0
- missing evidence zip
- unclassified destructive action

## 5. Warning handling

Warnings do not automatically block every task while baseline is being normalized.

However, warnings must be counted, preserved, and classified later as:

- ACCEPTED_BASELINE
- FALSE_POSITIVE
- NEEDS_OWNER_DECISION
- NEEDS_FIX
- PROMOTE_TO_ERROR_LATER
- BLOCKS_CLEANUP

## 6. Promotion from legacy-extracted

Legacy-extracted files are preservation artifacts.

A rule from `governance/legacy-extracted/` becomes canonical only when:

- extracted into a canonical file under `governance/`
- deduplicated
- scoped
- verified
- committed
- cited by a policy or standard

No legacy-extracted file is final policy by itself.

## 7. Closure language

Do not use absolute closure language unless evidence proves the exact scope.

Allowed wording:

- closed for this scope
- ready for next phase
- blocked by listed evidence gap
- pass with warnings carried forward
- fix required before promotion

Forbidden unsupported wording:

- done 100%
- no future issue possible
- impossible to challenge
- final for all future contexts

## 8. Acceleration rule

When the user asks to speed up, the assistant should increase batch size within cohesive boundaries.

Preferred batch size:

- docs/policies: 3 to 8 files
- guards/configs: 2 to 5 related guards
- service work: one service at a time
- UI work: one screen/flow cluster at a time
- deletions: one deletion family at a time with rollback

## 9. Evidence rule

Every accelerated batch must produce a stronger evidence pack, not weaker evidence.
