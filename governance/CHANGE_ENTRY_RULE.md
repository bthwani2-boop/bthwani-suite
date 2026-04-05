# CHANGE_ENTRY_RULE

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `No change log registry exists beyond phase evidence yet`
- NextAllowed: `Record phase and reason with each serious change`

## Change Entry Rule

Every serious change must be traceable to the current allowed phase and to a concrete reason.

## Minimum Change Entry Requirements

Each serious change should record:

- current phase
- reason for the change
- affected artifact or path
- evidence location
- whether the change creates, revises, defers, or rejects something

## Bootstrap Rule

During bootstrap, the phase evidence files are the minimum required change-entry surface.

This means:

- each bootstrap phase must include a review artifact under its phase evidence folder
- major changes outside the current phase are not allowed
- if a cross-phase change becomes necessary, it must first be classified as correction, not silent expansion

## No Silent Drift Rule

Do not make untracked structural changes that are not explained by the current phase.
