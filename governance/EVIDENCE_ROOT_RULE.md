# EVIDENCE_ROOT_RULE

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `Only phase-00 and phase-01 evidence exist yet`
- NextAllowed: `All later phases must continue using the same evidence root pattern`

## Canonical Evidence Root

Use this root pattern for governed evidence artifacts:

- `kdt/volatile/registry/runs/{SESSION_ID}/`

## Phase Subpath Rule

Each phase must deposit evidence under its own phase folder:

- `phase-00/`
- `phase-01/`
- `phase-02/`
- `phase-03/`
- `phase-04/`
- `phase-05/`
- `phase-06/`
- `phase-07/`

## Current Session Evidence Path

For the current session, the active root is:

- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/`

## Evidence Quality Rule

Evidence is not satisfied by empty files or placeholder headings.

Evidence should show:

- what was created
- why it was created
- what current repo state was observed
- why the phase passes or fails

## Evidence Mutation Rule

If a phase artifact is materially revised, the related evidence for that phase must be revised as well.
