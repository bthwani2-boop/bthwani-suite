# PHASE_11_JOURNEY_CHAIN_MASTER

## 1. Purpose

Write the exact journey chain for the active service before any screen census, preview, or UI growth begins.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/operation-master-extraction/MASTER_OPERATION_REGISTRY.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SURFACE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SCREEN_WAVE_MATRIX.csv`
- `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- `<legacy_repo_root>/services/<service>/**ux*flow*`
- `<legacy_repo_root>/services/<service>/**trace*`
- `<legacy_repo_root>/services/<service>/**route*`
- `<legacy_repo_root>/packages/surfaces/src/**` only when donor route or screen files expose real entrypoint or transition evidence

If the donor source root is unavailable, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract all of the following for the active service:

- initiating journeys
- happy paths
- fast paths when real
- return or resumption paths
- failure paths
- recovery paths
- support or staff intervention paths
- route entrypoints
- transitions between operations and surfaces

No screen census is allowed until these chains exist.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_journey-chain-master.md`
- `kdt/factory/<service>/packs/journey-chain-master/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/journey-chain-master/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/journey-chain-master/02_JOURNEY_MASTER.csv`
- `kdt/factory/<service>/packs/journey-chain-master/03_HAPPY_FAILURE_RECOVERY_MAP.md`
- `kdt/factory/<service>/packs/journey-chain-master/04_ROUTE_ENTRYPOINT_AND_TRANSITION_MATRIX.csv`
- `kdt/factory/<service>/packs/journey-chain-master/05_JOURNEY_RISKS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/journey-chain-master/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/journey-chain-master/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/journey-chain-master/JOURNEY_MASTER.csv`
- `kdt/factory/<service>/exports/journey-chain-master/ROUTE_ENTRYPOINT_AND_TRANSITION_MATRIX.csv`
- `kdt/factory/<service>/index/JOURNEY_CHAIN_MASTER_INDEX.md`

## 6. Required File Formats And Schemas

`02_JOURNEY_MASTER.csv` must include at least:

- `journey_id`
- `actor`
- `initiating_surface`
- `wave_id`
- `entry_trigger`
- `happy_path_operations`
- `failure_path_operations`
- `recovery_path_operations`
- `support_path_operations`
- `exit_condition`
- `donor_sources`
- `decision_status`
- `notes`

`04_ROUTE_ENTRYPOINT_AND_TRANSITION_MATRIX.csv` must include at least:

- `journey_id`
- `route_or_entrypoint`
- `surface`
- `predecessor_step`
- `successor_step`
- `operation_id`
- `state_effect`
- `notes`

## 7. Manual Work Procedure

1. open the request file and confirm the donor source root used
2. read all donor journey, UX flow, traceability, and route-transition evidence for the active service
3. write one `journey_id` per distinct initiating path or material support path
4. tie each journey to canonical operations and surface waves
5. write explicit happy, failure, recovery, and support branches
6. record route entrypoints and transitions without promoting route strings into canonical truth
7. write risks and blockers where the donor contradicts itself or leaves the path incomplete
8. run orphan-operation, missing-branch, and transition-integrity checks
9. stop if any primary operation still sits outside the journey set

## 8. Grouping / Wave Logic

Rules:

- use the wave order from Phase `10`; do not invent a second wave model here
- do not open screen work until the current-wave journey rows are complete enough to seed screen census
- support or staff journeys may exist, but they do not replace primary-path journeys

## 9. Decision Rules

- one journey must have one initiating surface
- route strings are evidence, not authority
- staff or internal oversight paths must be separate from primary customer or execution paths when the purpose differs materially
- unresolved donor contradictions must be recorded, not flattened away

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- happy path is missing
- failure path is missing on a critical journey
- recovery path is missing on a critical journey
- a retained operation belongs to no journey
- transition rules are still implied rather than written

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- journey count
- retained operations covered by at least one journey = `100%`
- orphan retained operations = `0`
- critical journeys missing failure or recovery = `0`
- unresolved transition contradictions = `0` or explicitly `BLOCKED`
- route entrypoint rows are present for every initiating journey

## 12. Exact Handoff To Next Phase

Deliver:

- `JOURNEY_MASTER`
- route entrypoint and transition matrix
- explicit journey blocker log

Next lawful file: `PHASE_12_SCREEN_MASTER_CENSUS_AND_NORMALIZATION.md`