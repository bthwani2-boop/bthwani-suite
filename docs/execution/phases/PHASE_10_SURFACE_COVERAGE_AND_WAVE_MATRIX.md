# PHASE_10_SURFACE_COVERAGE_AND_WAVE_MATRIX

## 1. Purpose

Map every canonical operation to lawful surfaces and write the explicit surface and wave model that later screen work must obey.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/actor-context-exhaustive-extraction/ACTOR_CONTEXT_MASTER.csv`
- `kdt/factory/<service>/exports/operation-master-extraction/MASTER_OPERATION_REGISTRY.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- `governance/PLATFORM_OPERATING_MODEL.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- `<legacy_repo_root>/services/<service>/governance/**coverage*`
- `<legacy_repo_root>/services/<service>/governance/**rbac*`
- `<legacy_repo_root>/services/<service>/**route*`
- `<legacy_repo_root>/packages/surfaces/src/**` only when donor route structure provides real internal or external surface evidence
- repo-local approved internal surface registry and platform operating model

If the donor source root is unavailable, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract all of the following for the active service:

- every approved surface
- `REQUIRED`, `OPTIONAL`, or `OUT` classification per surface
- operation-to-surface coverage
- initiating surface
- handoff surface
- oversight surface
- shell-readiness need
- wave order
- screen-group seeds per wave

No surface may remain implied.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_surface-coverage-and-wave-matrix.md`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/02_SURFACE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/03_SCREEN_WAVE_MATRIX.csv`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/04_OPERATION_TO_SURFACE_CHAIN.csv`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/05_SURFACE_WAVE_DECISIONS.md`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/06_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/07_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/surface-coverage-and-wave-matrix/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SURFACE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SCREEN_WAVE_MATRIX.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/OPERATION_TO_SURFACE_CHAIN.csv`
- `kdt/factory/<service>/index/SURFACE_COVERAGE_AND_WAVE_MATRIX_INDEX.md`

## 6. Required File Formats And Schemas

`02_SURFACE_COVERAGE_MATRIX.csv` must include at least:

- `service`
- `surface`
- `classification`
- `primary_actor`
- `legal_operations`
- `entry_rule`
- `shell_readiness`
- `source_trace`
- `decision_status`
- `notes`

`03_SCREEN_WAVE_MATRIX.csv` must include at least:

- `wave_id`
- `surface`
- `screen_group_seed`
- `primary_operations`
- `unlock_rule`
- `predecessor_wave`
- `successor_wave`
- `preview_eligibility`
- `notes`

`04_OPERATION_TO_SURFACE_CHAIN.csv` must include at least:

- `operation_id`
- `surface`
- `coverage_type`
- `lifecycle_position`
- `entry_trigger`
- `hand_off_to`
- `notes`

## 7. Manual Work Procedure

1. open the request file and confirm the donor source root used
2. classify every approved surface as `REQUIRED`, `OPTIONAL`, or `OUT`
3. map every retained canonical operation to one or more lawful surfaces
4. decide which surface starts the primary job and which surfaces receive the next lifecycle handoff
5. write `SURFACE_COVERAGE_MATRIX.csv`
6. write `SCREEN_WAVE_MATRIX.csv` with exact wave order and unlock rules
7. write `OPERATION_TO_SURFACE_CHAIN.csv`
8. record shell-readiness needs without opening preview early
9. run unclassified-surface, unmapped-operation, and wave-integrity checks
10. stop if `control-panel` is compensating for unresolved ownership

## 8. Grouping / Wave Logic

Use the governed default unless evidence requires a tighter order:

- `Wave 0` = truth only
- `Wave 1` = primary job start surface
- `Wave 2` = immediate lifecycle handoff surface
- `Wave 3` = fulfillment or execution continuation surface
- `Wave 4` = `control-panel` oversight and intervention
- `Wave 5` = tracking and reflection surfaces
- `Wave 6` = issue and recovery surfaces
- `Wave 7` = optional surfaces

No downstream wave opens until the upstream wave is lawful and explicit.

## 9. Decision Rules

- `control-panel` may not open first merely because it is easier to model
- `app-field` must be classified explicitly
- `webapp` and `website` must be classified explicitly, even when they are `OUT`
- screen-group seeds must be recorded only as provisional wave seeds; no final group, bundle, or build-order decision is lawful until Phase `14`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- an approved surface remains unclassified
- a retained operation lacks a lawful surface chain
- wave order is implicit rather than written
- shell-readiness need is unclear for a surface expected to preview later
- `control-panel` is acting as a convenience catch-all

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- approved surface count
- classified surface count
- unclassified approved surfaces = `0`
- retained operations with surface coverage = `100%`
- unmapped retained operations = `0`
- duplicate wave ids = `0`
- unresolved wave-order contradictions = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- `SURFACE_COVERAGE_MATRIX`
- `SCREEN_WAVE_MATRIX`
- `OPERATION_TO_SURFACE_CHAIN`
- explicit shell-readiness notes
- blocker list for any unresolved surface ownership conflict

Next lawful file: `PHASE_11_JOURNEY_CHAIN_MASTER.md`