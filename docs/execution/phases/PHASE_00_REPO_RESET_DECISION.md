# PHASE_00_REPO_RESET_DECISION

## 1. Purpose

Lock the clean build-line decision before any structural, service, or feature work begins.

## 2. Why This Phase Exists

This phase prevents the donor repo from silently remaining the real authority while the new repo only pretends to be sovereign.

## 3. Preconditions / Entry Conditions

- the target repo is known
- the donor repo is known
- no one is treating donor material as the active build line
- no feature work is being justified under vague migration language

## 4. Inputs

- the governing reference
- the bootstrap runbook
- the current root tree observation
- any existing README or repo reset notes

## 5. Allowed Work

- capture the current root state
- write or revise the repo reset decision
- write or revise the donor policy note
- state prohibitions on blind copy and donor-first architecture
- deposit bootstrap evidence

## 6. Forbidden Work

- feature implementation
- app or service creation
- package feature work
- contract detail work
- runtime work
- donor subtree copying

## 7. Exact Execution Order

1. capture the current root tree and repo state in evidence before changing decision files
2. verify the exact target repo name and donor repo name
3. write `docs/00_REPO_RESET_DECISION.md`
4. write `docs/01_DONOR_REPO_POLICY.md`
5. state explicitly that `bthwani-suite` is the clean build line and `bthfinal` is reference-only
6. record explicit prohibitions on blind copy, big-bang rebuild, and donor-first architecture
7. verify that no feature work is being justified under Phase `00`
8. deposit evidence and stop

## 8. Required Decisions

- the target repo is the final authority
- the donor repo is evidence-only
- the default adoption mode is `REBUILD_CLEAN`
- blind carryover is rejected

## 9. Required Artifacts

- `docs/00_REPO_RESET_DECISION.md`
- `docs/01_DONOR_REPO_POLICY.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-00/root-state.txt`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-00/decision-review.md`

## 10. Artifact Schema Expectations

`docs/00_REPO_RESET_DECISION.md` must state:

- target repo role
- donor repo role
- clean-build-line decision
- prohibited shortcuts
- explicit approval language

`docs/01_DONOR_REPO_POLICY.md` must state:

- allowed donor uses
- forbidden donor uses
- naming normalization reminder
- extraction must be target-driven rule

`decision-review.md` must state:

- what was reviewed
- whether conflicting language still exists
- whether any early implementation already violated the phase

## 11. Cross-File Updates

- align `README.md` with the clean build-line decision if README already exists
- ensure later bootstrap files do not describe donor material as an active line

## 12. Surface Impact

- no surface work is allowed in this phase
- no app-shell decisions are made in this phase

## 13. UI Kit Impact

- no UI Kit work is allowed in this phase

## 14. Contract Impact

- no contract work is allowed in this phase

## 15. Runtime Impact

- runtime work is forbidden in this phase

## 16. Validation Checklist

- decision files exist
- the target repo is named explicitly as the clean build line
- the donor repo is named explicitly as reference-only
- blind copy is rejected explicitly
- no feature code is being justified under this phase

## 17. Exit Criteria

- repo roles are explicit
- donor usage protocol is explicit
- no feature implementation has been smuggled into the repo reset decision

## 18. Failure Modes / Common Mistakes

- using vague language such as "migration in progress" without naming authority
- keeping donor and target repo roles blurred
- allowing implementation to start while decision law is still ambiguous

## 19. Anti-Patterns

- "write the code first and explain repo roles later"
- "copy now, normalize later"
- "the donor repo still knows better because it is larger"

## 20. Handoff To Next Phase

Deliver:

- explicit repo reset law
- explicit donor policy
- root-state evidence

Next lawful file: `PHASE_01_GOVERNANCE_FREEZE.md`