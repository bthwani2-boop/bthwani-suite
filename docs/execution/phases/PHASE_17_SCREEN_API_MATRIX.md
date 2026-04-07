# PHASE_17_SCREEN_API_MATRIX

## 1. Purpose

Let retained screens define exact API demand rather than guessing contract shape from backend preference or donor nostalgia.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/SCREEN_SPEC_INDEX.csv`
- `kdt/factory/<service>/exports/screen-spec-and-purpose-system/OPERATION_TO_SCREEN_CHAIN.csv`
- `kdt/factory/<service>/exports/state-lock/STATE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/SCREEN_GROUPING_PLAN.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/BUILD_ORDER_PLAN.csv`
- `kdt/factory/<service>/exports/operation-master-extraction/MASTER_OPERATION_REGISTRY.csv`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- retained screen spec files from Phase `13`
- state coverage outputs from Phase `16`
- operation-to-screen chain outputs from Phase `13`
- current contract observation only as comparison evidence, not as editing authority
- limited-api preview evidence only when fixtures cannot test a concrete bounded risk

If screen specs, chain outputs, or state coverage are incomplete, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Define all of the following for every in-scope retained screen:

- required reads
- required writes
- required summaries
- required aggregations
- request-count pressure
- overfetch risk
- underfit risk
- auth or trust concerns
- bounded limited-api preview need when truly necessary

No in-scope retained screen may remain with vague demand language.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_screen-api-matrix.md`
- `kdt/factory/<service>/packs/screen-api-matrix/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-api-matrix/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/screen-api-matrix/02_SCREEN_API_MATRIX.csv`
- `kdt/factory/<service>/packs/screen-api-matrix/03_AGGREGATION_AND_OVERFETCH_NOTES.md`
- `kdt/factory/<service>/packs/screen-api-matrix/04_LIMITED_API_PREVIEW_BOUNDARY.md`
- `kdt/factory/<service>/packs/screen-api-matrix/05_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/screen-api-matrix/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-api-matrix/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/screen-api-matrix/SCREEN_API_MATRIX.csv`
- `kdt/factory/<service>/index/SCREEN_API_MATRIX_INDEX.md`

## 6. Required File Formats And Schemas

`02_SCREEN_API_MATRIX.csv` must include at least:

- `screen_id`
- `operation_id`
- `journey_id`
- `required_reads`
- `required_writes`
- `required_summaries`
- `required_aggregations`
- `request_count_estimate`
- `overfetch_risk`
- `underfit_risk`
- `auth_concern`
- `limited_api_preview_need`
- `notes`

`03_AGGREGATION_AND_OVERFETCH_NOTES.md` must include at least:

- where client stitching would be noisy or fragile
- where current shape would overfetch
- where current shape would underfit the retained screen
- which demand pressures are blockers rather than observations

`04_LIMITED_API_PREVIEW_BOUNDARY.md` must include at least:

- `preview_needed`
- `why_fixtures_are_insufficient`
- `bounded_scope`
- `forbidden_proof_claims`
- `decision_status`

## 7. Manual Work Procedure

1. open the request file and confirm the in-scope build rows from `BUILD_ORDER_PLAN`
2. review retained-screen specs, chain rows, and state coverage for each in-scope screen
3. write one API-demand row per retained screen before making any contract recommendation
4. record aggregation and overfetch notes with screen-specific reasons
5. write `LIMITED_API_PREVIEW_BOUNDARY.md` as `not_needed` unless a bounded preview is truly required
6. run missing-demand, orphan-demand, and vague-demand checks
7. stop if any retained screen still uses generic phrases such as "needs data"

## 8. Grouping / Wave Logic

Rules:

- API demand mapping follows approved build scope; it may not reopen all surfaces at once
- downstream waves may not force demand work before upstream retained screens are explicit
- limited-api preview, if any, must stay within the current approved scope

## 9. Decision Rules

- screen demand first, contract preference never first
- one-off layout convenience does not justify a canonical aggregation by itself
- limited-api preview is exceptional, bounded, and non-proof-bearing
- unresolved demand ambiguity must be marked `BLOCKED`, `GAP`, or `UNPROVEN`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- an in-scope retained screen has no API-demand row
- a demand row has no retained-screen or operation linkage
- aggregation need is asserted without screen evidence
- limited-api preview is implied rather than bounded explicitly

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- in-scope retained-screen count
- screens with API-demand rows = `100%`
- orphan demand rows = `0`
- unresolved aggregation contradictions = `0` or explicitly `BLOCKED`
- bounded limited-api preview decisions are explicit for every row that needs them

## 12. Exact Handoff To Next Phase

Deliver:

- `SCREEN_API_MATRIX`
- aggregation and overfetch notes
- limited-api preview boundary decision
- blocker list for any unresolved screen-demand ambiguity

Next lawful file: `PHASE_18_GAP_MAP.md`