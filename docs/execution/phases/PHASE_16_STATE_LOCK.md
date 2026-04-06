# PHASE_16_STATE_LOCK

## 1. Purpose

Complete state coverage before contract work begins to feel justified.

## 2. Why This Phase Exists

This phase prevents contract demand from being inferred from ideal-only screens and forces the service to account for real operational states.

## 3. Preconditions / Entry Conditions

- retained screens are purpose-locked
- UI Kit can support the required shared state shells

## 4. Inputs

- screen-purpose lock pack
- flow-compression pack
- UI Kit expansion pack

## 5. Allowed Work

- define critical states
- define user-facing responses
- define retry behavior
- define fallback or no-fallback rules

## 6. Forbidden Work

- naming states without behavior
- skipping error, offline, or stale states because they are inconvenient
- starting contract work early

## 7. Exact Execution Order

1. open the `state-lock` request
2. review retained screens and their required state shells
3. define the critical states that exist for the current scope
4. define user-facing behavior for each state
5. define retry, fallback, and telemetry expectations where relevant
6. write the matrix and notes
7. stop before Screen/API Matrix if critical state ambiguity remains

## 8. Required Decisions

- which states are critical for the current service scope
- whether fallback is lawful
- whether retry is allowed and how it behaves

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_state-lock.md`
- `kdt/factory/<service>/packs/state-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/state-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/state-lock/02_STATE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/packs/state-lock/03_STATE_HANDLING_NOTES.md`
- `kdt/factory/<service>/packs/state-lock/04_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/state-lock/05_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/state-lock/STATE_COVERAGE_MATRIX.csv`
- `kdt/factory/<service>/index/STATE_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`02_STATE_COVERAGE_MATRIX.csv` must include at least:

- `state_name`
- `trigger`
- `user_facing_response`
- `retry_behavior`
- `telemetry_expectation`
- `lawful_fallback`
- `notes`

Critical states to review include at least:

- loading
- empty
- filtered empty
- offline
- disabled
- unauthorized
- forbidden
- not found
- upstream error
- validation error
- duplicate submit
- success
- stale data
- archived

## 11. Cross-File Updates

- update `kdt/factory/<service>/packs/screen-purpose-lock/05_STATE_NOTES.md` if state-lock clarifies or changes earlier assumptions

## 12. Surface Impact

- state coverage must exist for the active wave before next-wave unlocking

## 13. UI Kit Impact

- shared state-shell pressure must now be explicit
- new shared state needs must flow through UI Kit review, not surface-local shortcuts

## 14. Contract Impact

- this phase prepares later API demand by exposing error, retry, and aggregation needs
- no contract change is allowed yet

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- critical states are explicit
- each critical state has user-facing behavior
- retry and fallback rules are explicit where relevant

## 17. Exit Criteria

- state coverage is complete enough to drive real Screen/API analysis

## 18. Failure Modes / Common Mistakes

- naming states without handling them
- skipping stale data or offline states
- hiding duplicate submit or validation failure behavior

## 19. Anti-Patterns

- "we can add error states after the contract exists"
- "not found is just another empty state"

## 20. Handoff To Next Phase

Deliver:

- explicit state coverage
- explicit handling rules

Next lawful file: `PHASE_17_SCREEN_API_MATRIX.md`