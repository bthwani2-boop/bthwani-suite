# PHASE_01_GOVERNANCE_FREEZE

## 1. Purpose

Freeze governance before structural growth so later work cannot invent authority ad hoc.

## 2. Why This Phase Exists

This phase prevents later implementation from hardcoding ownership, scope, or evidence behavior by accident.

## 3. Preconditions / Entry Conditions

- Phase `00` is complete
- repo sovereignty is explicit
- no feature or service implementation has started

## 4. Inputs

- `docs/00_REPO_RESET_DECISION.md`
- `docs/01_DONOR_REPO_POLICY.md`
- the governing reference
- current repo structure observation

## 5. Allowed Work

- define ownership
- define scope boundaries
- define repo boundaries
- define execution law
- define evidence-root law
- define move-don't-delete behavior

## 6. Forbidden Work

- service implementation
- screen work
- contract detail work
- UI Kit feature patterns
- runtime setup

## 7. Exact Execution Order

1. create or verify the `governance/` root
2. write `governance/OWNERSHIP.md`
3. write `governance/SCOPE_LOCK.md`
4. write `governance/REPO_BOUNDARY.md`
5. write `governance/EXECUTION_LAW.md`
6. write `governance/EVIDENCE_ROOT_RULE.md`
7. write `governance/CHANGE_ENTRY_RULE.md`
8. write `governance/MOVE_DONT_DELETE.md`
9. cross-check the files for contradictions
10. deposit governance review evidence

## 8. Required Decisions

- who owns governance, UI Kit, contracts, services, surfaces, and runtime
- what bootstrap may and may not touch
- what evidence root is canonical
- whether deletion is forbidden without quarantine

## 9. Required Artifacts

- `governance/OWNERSHIP.md`
- `governance/SCOPE_LOCK.md`
- `governance/REPO_BOUNDARY.md`
- `governance/EXECUTION_LAW.md`
- `governance/EVIDENCE_ROOT_RULE.md`
- `governance/CHANGE_ENTRY_RULE.md`
- `governance/MOVE_DONT_DELETE.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-01/governance-file-index.txt`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-01/governance-review.md`

## 10. Artifact Schema Expectations

`OWNERSHIP.md` must define:

- owner roles
- decision rights
- explicit non-rights

`SCOPE_LOCK.md` must define:

- bootstrap scope
- forbidden early work
- what requires later phases

`EXECUTION_LAW.md` must define:

- no API-first rebuild
- no binding-first rebuild
- no runtime-first rebuild
- no uncontrolled parallel deep work

`governance-review.md` must record:

- contradiction check
- missing-file check
- placeholder-only check

## 11. Cross-File Updates

- confirm README and repo reset notes do not contradict the new governance files
- ensure evidence root language is consistent everywhere it is already mentioned

## 12. Surface Impact

- no surface-level implementation is allowed
- surface ownership is defined conceptually only

## 13. UI Kit Impact

- UI Kit ownership may be defined
- UI Kit implementation may not start yet beyond lawful bootstrap shell preparation

## 14. Contract Impact

- contract ownership and sovereignty may be defined
- contract detail work remains forbidden

## 15. Runtime Impact

- runtime ownership may be defined
- runtime implementation remains forbidden

## 16. Validation Checklist

- all core governance files exist
- each file has real content rather than headings only
- no two governance files contradict each other
- evidence root is explicit
- quarantine-before-delete behavior is explicit

## 17. Exit Criteria

- governance authority is stable enough to guide later phases
- scope and boundary rules are explicit
- evidence law is explicit

## 18. Failure Modes / Common Mistakes

- writing ownership without decision rights
- writing scope without forbidden-work rules
- defining evidence without an actual root pattern

## 19. Anti-Patterns

- "we will decide ownership during implementation"
- "delete first, document later"
- "boundary rules are obvious and do not need to be written"

## 20. Handoff To Next Phase

Deliver:

- coherent governance core
- evidence-root law
- scope boundaries

Next lawful file: `PHASE_02_REALITY_INTAKE.md`