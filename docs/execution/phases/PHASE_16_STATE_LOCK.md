# PHASE_16_STATE_LOCK

## 1. Purpose

Complete exact state coverage for retained screens before API demand or contract pressure is allowed to grow.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/SCREEN_SPEC_INDEX.csv`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/OPERATION_TO_SCREEN_CHAIN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/SCREEN_GROUPING_PLAN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/BUILD_ORDER_PLAN.csv`
- `kdt/factory/<service>/packs/ui-kit-expansion/02_UI_KIT_EXPANSION_REVIEW.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- retained screen spec files from Phase `13`
- approved grouping and build-order outputs from Phase `14`
- current UI Kit state shells after Phase `15`
- donor state evidence only when it explains real operational behavior rather than donor noise

If retained-screen specs, grouping, or shared state-shell readiness are incomplete, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Define all of the following for every retained screen in the active build scope:

- loading behavior
- empty and filtered-empty behavior when relevant
- disabled, unauthorized, forbidden, and not-found behavior when relevant
- validation, duplicate-submit, upstream-error, and stale-data behavior when relevant
- success behavior
- retry rules
- fallback or no-fallback rules
- telemetry expectation when relevant

No retained screen may keep implicit state behavior.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_state-lock.md`
- `kdt/factory/<service>/packs/state-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/state-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/state-lock/02_STATE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/packs/state-lock/03_SCREEN_STATE_ANATOMY.csv`
- `kdt/factory/<service>/packs/state-lock/04_STATE_HANDLING_NOTES.md`
- `kdt/factory/<service>/packs/state-lock/05_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/state-lock/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/state-lock/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/state-lock/STATE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/exports/state-lock/SCREEN_STATE_ANATOMY.csv`
- `kdt/factory/<service>/index/STATE_LOCK_INDEX.md`

## 6. Required File Formats And Schemas

`02_STATE_COVERAGE_MATRIX.csv` must include at least:

- `screen_id`
- `state_name`
- `trigger`
- `user_facing_response`
- `retry_behavior`
- `telemetry_expectation`
- `lawful_fallback`
- `decision_status`
- `notes`

`03_SCREEN_STATE_ANATOMY.csv` must include at least:

- `screen_id`
- `required_states`
- `blocking_states`
- `optional_states`
- `state_shell_source`
- `decision_status`
- `notes`

Critical states to review include at least:

- `loading`
- `empty`
- `filtered_empty`
- `offline`
- `disabled`
- `unauthorized`
- `forbidden`
- `not_found`
- `upstream_error`
- `validation_error`
- `duplicate_submit`
- `success`
- `stale_data`
- `archived`

## 7. Manual Work Procedure

1. open the request file and confirm the active build scope from `BUILD_ORDER_PLAN`
2. review retained-screen specs and chain rows for the in-scope screens
3. write `SCREEN_STATE_ANATOMY.csv` before finalizing handling rules
4. define user-facing behavior, retry behavior, and fallback behavior for every required state
5. record shared state-shell pressure only through UI Kit outputs already approved in Phase `15`
6. write `STATE_COVERAGE_MATRIX.csv`
7. run missing-state, missing-behavior, and contradiction checks
8. stop if any critical path still hides error, stale, or authorization behavior

## 8. Grouping / Wave Logic

Rules:

- state coverage must close for the active build scope before next-scope API demand work is trusted
- downstream bundles may not borrow unfinished state assumptions from upstream bundles
- support or optional groups may not dilute core-path state rigor

## 9. Decision Rules

- name no state without behavior
- prefer explicit no-fallback over silent fallback
- retry must be explicit, bounded, and screen-specific when relevant
- unresolved state ambiguity must be marked `BLOCKED`, `GAP`, or `UNPROVEN`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- an in-scope retained screen lacks state anatomy
- a critical state lacks user-facing behavior
- retry or fallback behavior is implied rather than written where it matters
- error, offline, stale, or authorization behavior is skipped on a critical path

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- in-scope retained-screen count
- screens with state anatomy rows = `100%`
- screens missing required-state coverage = `0`
- critical states missing behavior = `0`
- unresolved state contradictions = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- `STATE_COVERAGE_MATRIX`
- `SCREEN_STATE_ANATOMY`
- explicit state handling rules
- blocker list for any unresolved critical-state ambiguity

Next lawful file: `PHASE_17_SCREEN_API_MATRIX.md`