# PHASE_13_SCREEN_SPEC_AND_PURPOSE_SYSTEM

## 1. Purpose

Turn every retained screen into an exact screen spec and complete the operation-to-screen chain before grouping or UI growth begins.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/screen-master-census-and-normalization/MASTER_SCREEN_REGISTRY.csv`
- `kdt/factory/<service>/exports/journey-chain-master/JOURNEY_MASTER.csv`
- `kdt/factory/<service>/exports/operation-master-extraction/MASTER_OPERATION_REGISTRY.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SCREEN_WAVE_MATRIX.csv`
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- retained-screen donor evidence from Phase `12`
- donor UI files used to prove current component, interaction, and variant behavior
- repo-local UI Kit primitives and foundation scope
- actor, operation, surface, and journey masters

If the retained-screen census is incomplete, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract and define all of the following for every retained screen:

- UX goal
- business goal
- actor and context
- data blocks
- required states
- component map
- UI Kit primitives
- interaction rules
- validation rules
- error patterns
- RTL/LTR notes
- mobile or web variants
- acceptance checklist
- operation-to-screen chain placement

No retained screen may remain a vague container.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_screen-spec-and-purpose-system.md`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/02_SCREEN_SPEC_INDEX.csv`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/03_OPERATION_TO_SCREEN_CHAIN.csv`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/04_SPEC_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/packs/screen-spec-and-purpose-system/specs/{screen_id}.md`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/SCREEN_SPEC_INDEX.csv`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/OPERATION_TO_SCREEN_CHAIN.csv`
- `kdt/factory/<service>/index/SCREEN_SPEC_AND_PURPOSE_SYSTEM_INDEX.md`

## 6. Required File Formats And Schemas

`02_SCREEN_SPEC_INDEX.csv` must include at least:

- `screen_id`
- `ux_goal`
- `business_goal`
- `actor_context`
- `surface`
- `primary_operation`
- `primary_cta`
- `required_states`
- `ui_kit_primitives`
- `variant_count`
- `acceptance_status`
- `notes`

`03_OPERATION_TO_SCREEN_CHAIN.csv` must include at least:

- `operation_id`
- `journey_id`
- `surface`
- `screen_id`
- `state_dependencies`
- `future_api_demand`
- `binding_path_status`
- `notes`

Each `specs/{screen_id}.md` file must include these exact sections:

- `UX Goal`
- `Business Goal`
- `Actor / Context`
- `Data Blocks`
- `States`
- `Component Map`
- `UI Kit Primitives`
- `Interaction Rules`
- `Validation Rules`
- `Error Patterns`
- `RTL / LTR Notes`
- `Mobile / Web Variants`
- `Acceptance Checklist`

## 7. Manual Work Procedure

1. open the request file and confirm the retained-screen count from Phase `12`
2. create one spec file per retained screen; do not batch screens into vague group notes
3. write one primary purpose and one primary CTA or explicit no-primary-CTA reason for each retained screen
4. define data blocks, states, component map, UI Kit primitives, and interaction rules per screen
5. define validation, error patterns, RTL/LTR notes, and mobile/web variants per screen
6. write `SCREEN_SPEC_INDEX.csv`
7. write `OPERATION_TO_SCREEN_CHAIN.csv`
8. run retained-screen-without-spec, missing-purpose, missing-CTA, missing-states, and orphan-operation checks
9. stop if any retained screen still behaves like an unnamed or multi-purpose container

## 8. Grouping / Wave Logic

Rules:

- use current wave seeds only; no build order is final here
- every retained screen must declare the wave and surface it belongs to indirectly through the chain and spec index
- no next-wave expansion is justified by missing specs in the current wave

## 9. Decision Rules

- each retained screen gets one primary purpose
- each retained screen gets one primary CTA or explicit no-primary-CTA reason
- surface variants are allowed only when the behavior or ownership is materially different
- UI Kit pressure must be recorded here when retained screens expose it, but shared growth remains deferred to Phase `15`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- a retained screen has no spec file
- a retained screen has no primary purpose
- a retained screen has no primary CTA and no explicit no-primary-CTA reason
- a retained screen has no required-state definition
- an operation has no retained screen mapping or explicit no-screen reason

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- retained screen count
- screen spec count matching retained screen count = `100%`
- retained screens missing purpose = `0`
- retained screens missing CTA rule = `0`
- retained screens missing state definition = `0`
- orphan retained operations in `OPERATION_TO_SCREEN_CHAIN` = `0`

## 12. Exact Handoff To Next Phase

Deliver:

- `SCREEN_SPEC_PACKS`
- `SCREEN_SPEC_INDEX`
- `OPERATION_TO_SCREEN_CHAIN`
- blocker list for any unresolved spec gap that prevents grouping

Next lawful file: `PHASE_14_GROUPING_AND_BUILD_ORDER.md`