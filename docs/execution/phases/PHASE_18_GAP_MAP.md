# PHASE_18_GAP_MAP

## 1. Purpose

Translate screen-proven API demand into explicit contract pressure and ranked gaps.

## 2. Why This Phase Exists

This phase prevents vague complaints about the contract and turns screen pressure into actionable, ranked change inputs.

## 3. Preconditions / Entry Conditions

- Screen/API Matrix exists for the active scope
- state and flow work are stable enough to explain what the contract is failing to serve

## 4. Inputs

- Screen/API Matrix
- state-lock pack
- flow-compression pack
- current contract observation when relevant

## 5. Allowed Work

- record underfit, overfetch, missing operations, missing shapes, and drift
- rank gaps by severity
- tie every gap to a screen or flow need
- prepare clear input for contract readiness

## 6. Forbidden Work

- editing the canonical contract
- vague gap statements with no affected screen or flow
- ranking gaps without rationale

## 7. Exact Execution Order

1. open the `gap-map` request
2. review the Screen/API Matrix row by row
3. convert each contract pressure into a specific gap record
4. classify the gap type and severity
5. tie each gap to the affected screen or flow
6. write contract-pressure notes and target-fit summary
7. stop before contract work begins

## 8. Required Decisions

- which gaps are real and not merely nice-to-have improvements
- severity of each gap
- whether a donor reference is useful for evidence only

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_gap-map.md`
- `kdt/factory/<service>/packs/gap-map/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/gap-map/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/gap-map/02_GAP_MAP.csv`
- `kdt/factory/<service>/packs/gap-map/03_CONTRACT_PRESSURE_NOTES.md`
- `kdt/factory/<service>/packs/gap-map/04_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/gap-map/05_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/gap-map/GAP_MAP.csv`
- `kdt/factory/<service>/index/GAP_MAP_INDEX.md`

## 10. Artifact Schema Expectations

`02_GAP_MAP.csv` must include at least:

- `gap_id`
- `affected_screen_or_flow`
- `current_contract_artifact`
- `gap_type`
- `severity`
- `required_change`
- `donor_reference`
- `decision_status`
- `notes`

`03_CONTRACT_PRESSURE_NOTES.md` must define:

- the major pressure themes
- which pressures are blockers for lawful contract work
- which pressures remain `[TBD]`

## 11. Cross-File Updates

- open or prepare the contract-update request only after the gap set is stable enough to support Phase `19`

## 12. Surface Impact

- the gap map must still respect current-wave scope rather than becoming an excuse to analyze every surface at once

## 13. UI Kit Impact

- no direct UI Kit changes occur here

## 14. Contract Impact

- this phase is the final lawful input layer before contract work begins

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- each gap is specific
- each gap is tied to a screen or flow
- severity exists
- required change exists

## 17. Exit Criteria

- contract readiness can now be judged from explicit screen-proven pressure

## 18. Failure Modes / Common Mistakes

- writing generic complaints such as "API is weak"
- ranking by personal preference rather than flow impact
- jumping into contract edits before the map is stable

## 19. Anti-Patterns

- "the gap is obvious and does not need a record"
- "we can fix contract drift directly and write the gap later"

## 20. Handoff To Next Phase

Deliver:

- explicit contract pressure map
- ranked, screen-proven gaps

Next lawful file: `PHASE_19_MASTER_CONTRACT_UPDATE.md`