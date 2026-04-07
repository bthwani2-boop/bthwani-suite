# PHASE_15_UI_KIT_EXPANSION

## 1. Purpose

Grow UI Kit only from retained-screen demand already proven by screen specs and build order.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/SCREEN_SPEC_INDEX.csv`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/OPERATION_TO_SCREEN_CHAIN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/SCREEN_GROUPING_PLAN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/BUILD_ORDER_PLAN.csv`
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- retained screen spec files from Phase `13`
- grouping and build-order outputs from Phase `14`
- current UI Kit primitives, tokens, and state shells
- current build-scope screens only; not future speculative bundles

If grouping, build order, or retained-screen specs are incomplete, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract and decide all of the following for the active service and current build scope:

- every shared primitive gap demanded by retained screens
- every repeated interaction pattern that truly crosses screens or groups
- state-shell gaps demanded by the current bundle
- duplicate families already present in UI Kit
- service leakage risks
- extension-vs-new-primitive decisions

No speculative shared-pattern discovery is allowed.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_ui-kit-expansion.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/02_UI_KIT_EXPANSION_REVIEW.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/03_SHARED_PATTERN_DEMAND_MATRIX.csv`
- `kdt/factory/<service>/packs/ui-kit-expansion/04_NEW_SHARED_PATTERNS.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/05_DUPLICATE_FAMILY_CHECK.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/06_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/07_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/ui-kit-expansion/SHARED_PATTERN_DEMAND_MATRIX.csv`
- `kdt/factory/<service>/index/UI_KIT_EXPANSION_INDEX.md`

## 6. Required File Formats And Schemas

`02_UI_KIT_EXPANSION_REVIEW.md` must include at least:

- `current_service`
- `current_wave`
- `current_groups`
- `reviewed_screen_count`
- `primitives_touched`
- `duplicate_family_count`
- `service_leakage_check`
- `cleanup_required`
- `decision_status`

`03_SHARED_PATTERN_DEMAND_MATRIX.csv` must include at least:

- `pattern_id`
- `source_screen_ids`
- `source_group_ids`
- `current_primitive`
- `decision`
- `shared_reason`
- `local_if_rejected`
- `blocker_status`
- `notes`

`04_NEW_SHARED_PATTERNS.md` must include at least:

- pattern name
- source screens that proved demand
- source groups that proved demand
- why the pattern belongs in UI Kit
- what remains local to the service

## 7. Manual Work Procedure

1. open the request file and confirm the active build scope from `BUILD_ORDER_PLAN`
2. review retained screen specs and group assignments for the current wave only
3. write `SHARED_PATTERN_DEMAND_MATRIX.csv` before editing shared primitives
4. extend existing primitives before creating new ones when the current primitive can lawfully absorb the demand
5. record every new or extended shared pattern with source-screen proof
6. run duplicate-family and service-leakage checks
7. update `FOUNDATION_SCOPE.md` only when shared scope meaningfully changes
8. stop if any unresolved shared blocker would force local hacks into canonical shared UI

## 8. Grouping / Wave Logic

Rules:

- only the current approved bundle or group may drive shared growth
- downstream waves may not open shared UI demand early
- support or optional groups may not force shared expansion ahead of the core path

## 9. Decision Rules

- extend before duplicate
- local remains local until retained-screen repetition proves otherwise
- shared UI may not carry service policy, service logic, or donor-specific residue
- unresolved shared scope ambiguity must be marked `BLOCKED`, `GAP`, or `UNPROVEN`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- a shared addition has no retained-screen trace
- duplicate families remain unresolved
- service-specific widgets entered `packages/ui-kit/`
- shared expansion outran grouping or build-order truth

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- reviewed retained-screen count
- shared-pattern demand row count
- shared additions traced to retained screens = `100%`
- duplicate family count = `0`
- service leakage count = `0`
- unresolved shared blockers = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- `UI_KIT_EXPANSION_REVIEW`
- `SHARED_PATTERN_DEMAND_MATRIX`
- exact shared-pattern decisions
- blocker list for any unresolved shared primitive gap

Next lawful file: `PHASE_16_STATE_LOCK.md`