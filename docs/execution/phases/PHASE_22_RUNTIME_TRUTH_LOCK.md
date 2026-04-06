# PHASE_22_RUNTIME_TRUTH_LOCK

## 1. Purpose

Define what the real truth source is and what it is not for the now-bound service paths.

## 2. Why This Phase Exists

This phase prevents fixtures, simulated responses, and hidden local shortcuts from continuing to masquerade as canonical truth once binding exists.

## 3. Preconditions / Entry Conditions

- binding chains exist for critical operations
- runtime truth readiness gate has passed

## 4. Inputs

- binding-lock pack
- current environment expectations
- storage or persistence requirements when relevant

## 5. Allowed Work

- define live truth sources
- define seed and demo boundaries
- define forbidden fixture truth on canonical paths
- define runtime-unavailable behavior

## 6. Forbidden Work

- hiding fixture truth on canonical bound paths
- calling simulated responses canonical truth
- using runtime seed as proof by itself

## 7. Exact Execution Order

1. open the `runtime-truth-lock` request
2. list each critical bound path and its intended truth source
3. classify each path by truth class
4. define non-truth sources and forbidden uses
5. define runtime availability behavior for critical paths
6. export classification and register artifacts

## 8. Required Decisions

- which sources are canonical truth
- which sources are preview-only or support-only
- how the system behaves when runtime is unavailable

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_runtime-truth-lock.md`
- `kdt/factory/<service>/packs/runtime-truth-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/runtime-truth-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/runtime-truth-lock/02_TRUTH_SOURCE_REGISTER.md`
- `kdt/factory/<service>/packs/runtime-truth-lock/03_TRUTH_CLASSIFICATION.csv`
- `kdt/factory/<service>/packs/runtime-truth-lock/04_RUNTIME_AVAILABILITY_LOCK.md`
- `kdt/factory/<service>/packs/runtime-truth-lock/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/runtime-truth-lock/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/runtime-truth-lock/TRUTH_CLASSIFICATION.csv`
- `kdt/factory/<service>/index/RUNTIME_TRUTH_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`03_TRUTH_CLASSIFICATION.csv` must include at least:

- `path_or_operation`
- `truth_classification`
- `source`
- `fallback`
- `forbidden_uses`
- `notes`

`02_TRUTH_SOURCE_REGISTER.md` must define:

- canonical truth sources
- preview-only sources
- support-only sources
- known boundaries and exclusions

## 11. Cross-File Updates

- update preview documentation where necessary so preview-only paths are not mistaken for canonical truth paths

## 12. Surface Impact

- required surfaces now have explicit truth-source expectations

## 13. UI Kit Impact

- no direct UI Kit impact

## 14. Contract Impact

- no contract changes are introduced here

## 15. Runtime Impact

- this phase is the first lawful phase for explicit runtime truth classification and availability behavior

## 16. Validation Checklist

- every critical bound path has a truth classification
- non-truth sources are explicit
- runtime-unavailable behavior is explicit

## 17. Exit Criteria

- runtime mode policy can now be written precisely

## 18. Failure Modes / Common Mistakes

- treating fixtures as harmless hidden truth
- leaving fallback behavior implicit
- classifying every path as equal proof

## 19. Anti-Patterns

- "if it returns data, it counts as runtime truth"
- "seed data is close enough to proof"

## 20. Handoff To Next Phase

Deliver:

- truth-source register
- explicit truth classification

Next lawful file: `PHASE_23_RUNTIME_MODE_POLICY.md`