# PHASE_24_PRODUCTION_LIKE_VERIFICATION

## 1. Purpose

Prove the current service works end to end under the required real conditions.

## 2. Why This Phase Exists

This phase prevents optimistic sign-off from preview-only review, partial surface coverage, or misunderstood propagation behavior.

## 3. Preconditions / Entry Conditions

- runtime mode policy is explicit
- production-like proof gate has passed
- required surfaces and truth sources are known

## 4. Inputs

- binding-chain map
- runtime-truth lock pack
- runtime-mode policy pack
- required-surface list

## 5. Allowed Work

- verify happy path
- verify failure path
- verify recovery path
- verify staff or internal path when relevant
- verify required surfaces
- verify persistence and propagation when relevant
- record runtime health separately from functional results

## 6. Forbidden Work

- claiming production-like proof from browser-only or fixture-only review
- equating correct propagation with same-second visibility for every actor

## 7. Exact Execution Order

1. open the `production-like-verification` request
2. define the verification scope explicitly
3. execute happy-path verification
4. execute failure-path verification
5. execute recovery-path verification
6. execute staff or internal-path verification when relevant
7. verify all required surfaces
8. verify persistence and storage behavior when the service truly needs them
9. verify lifecycle-correct propagation where propagation matters
10. write runtime health separately from functional proof
11. export the verification matrix and results

## 8. Required Decisions

- what counts as required surface coverage
- what counts as critical propagation for this service
- what storage or persistence proof is actually required

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_production-like-verification.md`
- `kdt/factory/<service>/packs/production-like-verification/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/production-like-verification/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/production-like-verification/02_VERIFICATION_SCOPE.md`
- `kdt/factory/<service>/packs/production-like-verification/03_END_TO_END_RESULTS.md`
- `kdt/factory/<service>/packs/production-like-verification/04_PROPAGATION_VERIFICATION_MATRIX.csv`
- `kdt/factory/<service>/packs/production-like-verification/05_RUNTIME_HEALTH_REPORT.md`
- `kdt/factory/<service>/packs/production-like-verification/06_PERSISTENCE_AND_STORAGE_VERIFICATION.md`
- `kdt/factory/<service>/packs/production-like-verification/07_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/production-like-verification/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/production-like-verification/PROPAGATION_VERIFICATION_MATRIX.csv`
- `kdt/factory/<service>/index/PRODUCTION_LIKE_VERIFICATION_INDEX.md`

## 10. Artifact Schema Expectations

`02_VERIFICATION_SCOPE.md` must include:

- required surfaces
- required truth sources
- paths covered
- exclusions and why they are lawful

`04_PROPAGATION_VERIFICATION_MATRIX.csv` must include at least:

- `lifecycle_event`
- `actor`
- `surface`
- `expected_visibility_moment`
- `forbidden_early_visibility`
- `acceptable_reflected_state`
- `evidence_artifact`
- `notes`

`05_RUNTIME_HEALTH_REPORT.md` must define:

- service availability observations
- infrastructure or runtime issues observed
- whether the proof result is blocked or only degraded

## 11. Cross-File Updates

- update service evidence references so later sign-off can point to the full proof set cleanly

## 12. Surface Impact

- all required surfaces must be proven, not just one convenient surface

## 13. UI Kit Impact

- no new UI Kit work should be introduced here except separately tracked defects that do not invalidate phase order

## 14. Contract Impact

- no new contract work should be introduced here unless the proof reveals a blocker that forces formal rollback to an earlier phase

## 15. Runtime Impact

- this is the highest proof phase before final evidence sealing

## 16. Validation Checklist

- happy path is proven
- failure path is proven
- recovery path is proven
- required surfaces are proven
- lifecycle-correct propagation is proven where relevant
- runtime health is explicit

## 17. Exit Criteria

- the service has earned production-like proof for the required scope

## 18. Failure Modes / Common Mistakes

- proving one surface and assuming the rest
- ignoring propagation timing rules
- mixing runtime health issues into functional results without distinction

## 19. Anti-Patterns

- "the browser demo is enough"
- "if every actor sees something quickly, propagation is correct"

## 20. Handoff To Next Phase

Deliver:

- explicit production-like proof set
- explicit runtime health status

Next lawful file: `PHASE_25_EVIDENCE_AND_SIGN_OFF.md`