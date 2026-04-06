# PHASE_17_SCREEN_API_MATRIX

## 1. Purpose

Let screens define API demand rather than guessing contract shape from backend preference.

## 2. Why This Phase Exists

This phase prevents contract growth that mirrors donor endpoints or local implementation convenience instead of actual screen need.

## 3. Preconditions / Entry Conditions

- retained screens are purpose-locked
- state coverage exists for the active scope

## 4. Inputs

- screen-purpose lock pack
- state-lock pack
- current preview and flow artifacts

## 5. Allowed Work

- list required reads, writes, summaries, and aggregations per screen
- estimate request-count pressure
- identify overfetch and underfit risk
- note auth concerns

## 6. Forbidden Work

- direct contract changes
- inventing APIs without screen evidence
- treating one-off layout convenience as lawful aggregation demand

## 7. Exact Execution Order

1. open the `screen-api-matrix` request
2. review each retained in-scope screen
3. record reads, writes, summaries, and aggregations needed by that screen
4. estimate request-count pressure and note overfetch or underfit risks
5. flag auth or trust concerns when the screen needs them
6. write the matrix and supporting notes
7. stop before Gap Map if demand is still ambiguous

## 8. Required Decisions

- which screens are in scope for current API demand mapping
- where summaries are truly needed
- where aggregations are truly needed
- where current shape risks overfetch or underfit

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_screen-api-matrix.md`
- `kdt/factory/<service>/packs/screen-api-matrix/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-api-matrix/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/screen-api-matrix/02_SCREEN_API_MATRIX.csv`
- `kdt/factory/<service>/packs/screen-api-matrix/03_AGGREGATION_AND_OVERFETCH_NOTES.md`
- `kdt/factory/<service>/packs/screen-api-matrix/04_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-api-matrix/05_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/screen-api-matrix/SCREEN_API_MATRIX.csv`
- `kdt/factory/<service>/index/SCREEN_API_MATRIX_INDEX.md`

## 10. Artifact Schema Expectations

`02_SCREEN_API_MATRIX.csv` must include at least:

- `screen_id`
- `required_reads`
- `required_writes`
- `required_summaries`
- `required_aggregations`
- `request_count_estimate`
- `overfetch_risk`
- `underfit_risk`
- `auth_concern`
- `notes`

`03_AGGREGATION_AND_OVERFETCH_NOTES.md` must define:

- where client stitching would be noisy or fragile
- where current shape would overfetch
- where current shape underfits the screen

## 11. Cross-File Updates

- align preview assumptions if some screens were previously treated as simple but actually need lawful aggregation or write behavior

## 12. Surface Impact

- API demand must still follow the active waves rather than reopening all surfaces at once

## 13. UI Kit Impact

- no direct UI Kit impact beyond confirming which state or layout patterns remain necessary

## 14. Contract Impact

- this phase is the direct precursor to Gap Map and later contract work
- no contract edits are allowed yet

## 15. Runtime Impact

- limited-api preview may be noted only when explicitly bounded and necessary
- runtime truth remains out of scope

## 16. Validation Checklist

- each in-scope screen has explicit demand entries
- overfetch and underfit risks are explicit
- auth concerns are explicit when relevant

## 17. Exit Criteria

- screen-proven API demand is explicit enough to turn into a concrete Gap Map

## 18. Failure Modes / Common Mistakes

- treating a screen as simple when it really requires aggregation
- using vague phrases like "needs data" without structure
- jumping from one screen to a full contract proposal directly

## 19. Anti-Patterns

- "the backend already has endpoints, so the screen demand does not matter"
- "one layout quirk justifies a new endpoint"

## 20. Handoff To Next Phase

Deliver:

- explicit screen-proven API demand
- explicit overfetch and underfit notes

Next lawful file: `PHASE_18_GAP_MAP.md`