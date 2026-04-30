---
generatedFrom: governance/REPO_BOUNDARY.md
generatedAt: 2026-04-30T04:48:37.8660210+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# REPO_BOUNDARY

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `No additional blocker recorded in this file`
- NextAllowed: `Keep all new governed implementation inside bthwani-suite only`

## Boundary Rule

`bthwani-suite` is the active primary repository.
`bthfinal` is the legacy donor/reference repository.

## Allowed Work In `bthwani-suite`

- governance creation and maintenance
- bootstrap artifacts
- service packs and evidence packs
- future clean implementation work after the correct phase unlocks

## Allowed Work With `bthfinal`

- reading
- tracing
- comparison
- extraction planning
- anti-pattern identification

## Forbidden Boundary Violations

- implementing new work in `bthfinal`
- copying donor folders wholesale into `bthwani-suite`
- treating donor structure as automatic target structure
- letting donor naming override approved target naming
- skipping target-fit review when donor material is reused

## Target-First Rule

Every serious request must resolve truth in this order:

1. current state of `bthwani-suite`
2. approved naming and structure decisions for `bthwani-suite`
3. local governance and bootstrap law
4. donor evidence from `bthfinal`

## Product Tree Protection Rule

Historical or donor residue must not be parked inside live product roots as a convenience copy.

This means:

- no donor holding area under `apps/`
- no donor holding area under `services/`
- no donor holding area under `packages/`
- no donor holding area under `contracts/`

