# PHASE_18_GAP_MAP

## 1. Purpose

Translate exact screen-proven API demand into explicit contract pressure, ranked gaps, and a formal contract-readiness decision.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/screen-api-matrix/SCREEN_API_MATRIX.csv`
- `kdt/factory/<service>/exports/state-lock/STATE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/exports/grouping-and-build-order/BUILD_ORDER_PLAN.csv`
- current canonical contract observation under `contracts/master/**`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`
- `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- `SCREEN_API_MATRIX`
- retained-screen state coverage from Phase `16`
- current canonical contract files only as observation inputs
- error, auth, and lifecycle pressure proven by retained-screen specs and chain rows

If `SCREEN_API_MATRIX` is incomplete or current contract observation is unavailable, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Define all of the following for every real contract pressure found in the active scope:

- underfit gaps
- overfetch gaps
- missing read or write operations
- missing error shapes
- missing auth or trust semantics
- missing lifecycle or state-support shapes
- naming drift
- severity and required change

No vague contract complaint is allowed.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_gap-map.md`
- `kdt/factory/<service>/packs/gap-map/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/gap-map/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/gap-map/02_GAP_MAP.csv`
- `kdt/factory/<service>/packs/gap-map/03_CONTRACT_PRESSURE_NOTES.md`
- `kdt/factory/<service>/packs/gap-map/04_CONTRACT_READINESS_DECISION.md`
- `kdt/factory/<service>/packs/gap-map/05_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/gap-map/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/gap-map/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/gap-map/GAP_MAP.csv`
- `kdt/factory/<service>/index/GAP_MAP_INDEX.md`

## 6. Required File Formats And Schemas

`02_GAP_MAP.csv` must include at least:

- `gap_id`
- `affected_screen_or_flow`
- `current_contract_artifact`
- `gap_type`
- `severity`
- `required_change`
- `auth_or_error_impact`
- `donor_reference`
- `decision_status`
- `notes`

`03_CONTRACT_PRESSURE_NOTES.md` must include at least:

- the major pressure themes
- which pressures are blockers for lawful contract work
- which pressures remain `BLOCKED`, `GAP`, or `UNPROVEN`

`04_CONTRACT_READINESS_DECISION.md` must include at least:

- `reviewed_scope`
- `blocking_gap_count`
- `non_blocking_gap_count`
- `contract_readiness_verdict`
- `why`

## 7. Manual Work Procedure

1. open the request file and confirm the active scope from `BUILD_ORDER_PLAN`
2. review `SCREEN_API_MATRIX` row by row against current contract observation
3. convert each real pressure into a specific gap row with severity and required change
4. record no-gap conclusions in the pressure notes where relevant so silence cannot hide skipped review
5. write `CONTRACT_READINESS_DECISION.md` only after the gap set is stable
6. run vague-gap, unnamed-gap, and orphan-pressure checks
7. stop before Phase `19` if contract pressure is still ambiguous

## 8. Grouping / Wave Logic

Rules:

- gap mapping must respect active build scope rather than reopening all surfaces at once
- downstream or optional bundles may not distort the blocking status of current-scope gaps
- gap severity must follow real flow impact, not team preference

## 9. Decision Rules

- no gap without a concrete screen or flow reason
- no severity without rationale
- no donor reference may act as contract authority; it is evidence only
- unresolved gap ambiguity must be marked `BLOCKED`, `GAP`, or `UNPROVEN`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- a gap row has no affected screen or flow
- a gap row has no severity or required change
- contract pressure notes stay generic instead of actionable
- contract readiness is implied before the gap set is explicit

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- reviewed active-scope screen count
- total gap row count
- unnamed gaps = `0`
- gaps missing severity = `0`
- gaps missing required change = `0`
- unresolved contract-readiness contradictions = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- `GAP_MAP`
- contract pressure notes
- exact contract-readiness decision
- blocker list for any unresolved pressure that still prevents lawful Phase `19` work

Next lawful file: `PHASE_19_MASTER_CONTRACT_UPDATE.md`