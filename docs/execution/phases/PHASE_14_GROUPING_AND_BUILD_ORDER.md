# PHASE_14_GROUPING_AND_BUILD_ORDER

## 1. Purpose

Convert the completed registries and screen specs into exact groups, bundles, lanes, build order, validation order, and seal order.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/screen-master-census-and-normalization/MASTER_SCREEN_REGISTRY.csv`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/SCREEN_SPEC_INDEX.csv`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/OPERATION_TO_SCREEN_CHAIN.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SCREEN_WAVE_MATRIX.csv`
- `kdt/factory/<service>/exports/journey-chain-master/JOURNEY_MASTER.csv`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- previous-phase masters and registries only
- donor route trees and screen clusters as comparison evidence only
- current repo preview or shell structure only as target-fit evidence

Do not use donor route trees as ordering authority.

## 4. Exhaustive Extraction Scope

Define all of the following for the active service:

- screen groups
- bundles
- dependency lanes
- preview order
- redesign order
- implementation order
- validation order
- seal order
- compression and conversion decisions that remain after the registry and spec work

No retained screen may remain outside grouping or build order.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_grouping-and-build-order.md`
- `kdt/factory/<service>/packs/grouping-and-build-order/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/grouping-and-build-order/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/grouping-and-build-order/02_SCREEN_GROUPING_PLAN.csv`
- `kdt/factory/<service>/packs/grouping-and-build-order/03_BUILD_ORDER_PLAN.csv`
- `kdt/factory/<service>/packs/grouping-and-build-order/04_DEPENDENCY_LANE_MAP.csv`
- `kdt/factory/<service>/packs/grouping-and-build-order/05_CONVERSION_AND_COMPRESSION_DECISIONS.csv`
- `kdt/factory/<service>/packs/grouping-and-build-order/06_MANUAL_EXECUTION_ORDER.md`
- `kdt/factory/<service>/packs/grouping-and-build-order/07_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/grouping-and-build-order/08_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/grouping-and-build-order/09_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/grouping-and-build-order/SCREEN_GROUPING_PLAN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/BUILD_ORDER_PLAN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/DEPENDENCY_LANE_MAP.csv`
- `kdt/factory/<service>/index/GROUPING_AND_BUILD_ORDER_INDEX.md`

## 6. Required File Formats And Schemas

`02_SCREEN_GROUPING_PLAN.csv` must include at least:

- `group_id`
- `wave_id`
- `surface`
- `screens`
- `primary_operations`
- `business_reason`
- `dependency_lane`
- `preview_order`
- `implementation_order`
- `validation_order`
- `seal_order`
- `notes`

`03_BUILD_ORDER_PLAN.csv` must include at least:

- `build_step`
- `group_id`
- `surface`
- `screen_id`
- `prerequisite_steps`
- `ui_kit_dependency`
- `state_dependency`
- `api_pressure_class`
- `closure_rule`
- `notes`

`04_DEPENDENCY_LANE_MAP.csv` must include at least:

- `lane_id`
- `meaning`
- `allowed_parallelism`
- `blocking_prerequisites`
- `notes`

## 7. Manual Work Procedure

1. open the request file and confirm the retained-screen and screen-spec counts
2. assign every retained screen to exactly one screen group
3. assign every group to exactly one dependency lane
4. write preview, redesign, implementation, validation, and seal order for each group and each screen
5. record remaining conversion and compression decisions only after registry and spec completeness is proven
6. write `SCREEN_GROUPING_PLAN.csv`
7. write `BUILD_ORDER_PLAN.csv`
8. write `DEPENDENCY_LANE_MAP.csv`
9. write the manual execution order document in the exact sequence the team must follow
10. run duplicate-group, missing-build-step, dependency-cycle, and missing-seal-order checks
11. stop if any retained screen still lacks a group, a build step, or a closure rule

## 8. Grouping / Wave Logic

Rules:

- `entry-discovery` or the first lawful `core-task` group opens first
- `secondary-optional` never opens before the core path is stable
- `control-panel` groups do not open before upstream task groups are explicit unless the service itself starts internally
- only the current service may execute deeply; no cross-service build waves are allowed here

## 9. Decision Rules

- build order must follow dependency truth, not donor nostalgia
- compression decisions are lawful only after full registry and spec completeness
- a group may be empty only if it is explicitly absent and recorded as such
- dependency cycles must be broken before the phase can pass

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- a retained screen belongs to no group
- a retained screen belongs to multiple groups
- a retained screen has no build step
- preview, validation, or seal order is missing
- dependency cycles remain unresolved

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- retained screen count
- retained screens assigned to exactly one group = `100%`
- retained screens assigned to exactly one build step = `100%`
- duplicate group assignments = `0`
- unresolved dependency cycles = `0`
- screens missing validation or seal order = `0`

## 12. Exact Handoff To Next Phase

Deliver:

- `SCREEN_GROUPING_PLAN`
- `BUILD_ORDER_PLAN`
- dependency lane map
- conversion and compression decisions
- exact manual execution order for the active service

Next lawful file: `PHASE_15_UI_KIT_EXPANSION.md`