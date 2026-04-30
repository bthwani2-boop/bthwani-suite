---
generatedFrom: governance/CHANGE_ENTRY_RULE.md
generatedAt: 2026-04-30T04:48:37.3621831+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
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

## Operating Model Trigger Rule

If a serious change touches platform finance, mutable operating policy, service-to-surface attachment, or typed actor-account gates, the change entry must also record:

- whether `governance/PLATFORM_OPERATING_MODEL.md` is preserved or amended
- whether the change keeps platform financial effect inside `WLT` only
- whether mutable policy is implemented through `VAR_*` rather than hardcoded execution logic
- whether surface attachment or typed-account gates changed
- whether audit, preview, or rollback expectations changed

No silent change may introduce:

- a side-money path or alternate financial write path
- hardcoded mutable policy that should be governed through `VAR_*`
- a new governed surface attachment or typed actor gate without explicit governance change first

## No Silent Drift Rule

Do not make untracked structural changes that are not explained by the current phase.

