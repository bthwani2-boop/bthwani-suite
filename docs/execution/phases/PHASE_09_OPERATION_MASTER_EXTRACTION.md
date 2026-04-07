# PHASE_09_OPERATION_MASTER_EXTRACTION

## 1. Purpose

Recover the full operation universe for the active service and normalize it into one canonical `MASTER_OPERATION_REGISTRY`.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/donor-exhaustive-census/DONOR_EXHAUSTIVE_CENSUS.csv`
- `kdt/factory/<service>/exports/actor-context-exhaustive-extraction/ACTOR_CONTEXT_MASTER.csv`
- `docs/services/<service>/02_OPERATIONS_CATALOG.csv`
- `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- `<legacy_repo_root>/services/<service>/governance/**operation*`
- `<legacy_repo_root>/services/<service>/**trace*`
- `<legacy_repo_root>/services/<service>/**controller*`
- `<legacy_repo_root>/services/<service>/**routes*`
- `<legacy_repo_root>/packages/surfaces/src/**` only when donor operation identity is embedded in route or generated surface metadata

If the donor source root is unavailable, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract all of the following for the active service:

- donor operation ids
- donor aliases and duplicate names
- wrapper or support operations that touch the active service
- deprecated operations
- deferred operations
- operation owners
- actors
- surfaces
- entry triggers
- state effects
- current status and implementation status

No selective or happy-path-only operation recovery is allowed.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_operation-master-extraction.md`
- `kdt/factory/<service>/packs/operation-master-extraction/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/operation-master-extraction/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/operation-master-extraction/02_OPERATION_SOURCE_COUNTS.md`
- `kdt/factory/<service>/packs/operation-master-extraction/03_MASTER_OPERATION_REGISTRY.csv`
- `kdt/factory/<service>/packs/operation-master-extraction/04_OPERATION_CLASSIFICATION_NOTES.md`
- `kdt/factory/<service>/packs/operation-master-extraction/05_OPERATION_DUPLICATE_AND_ALIAS_REPORT.md`
- `kdt/factory/<service>/packs/operation-master-extraction/06_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/operation-master-extraction/07_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/operation-master-extraction/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/donor-exhaustive-census/DONOR_EXHAUSTIVE_CENSUS.csv`
- `kdt/factory/<service>/exports/operation-master-extraction/MASTER_OPERATION_REGISTRY.csv`
- `kdt/factory/<service>/index/OPERATION_MASTER_EXTRACTION_INDEX.md`

## 6. Required File Formats And Schemas

`03_MASTER_OPERATION_REGISTRY.csv` must include at least:

- `operation_id`
- `canonical_name`
- `donor_sources`
- `donor_aliases`
- `owning_service`
- `actors`
- `surfaces`
- `entry_triggers`
- `state_effects`
- `current_status`
- `classification`
- `decision_status`
- `notes`

`02_OPERATION_SOURCE_COUNTS.md` must include at least:

- donor operation count claims
- observed donor row counts
- wrapper or support operation counts
- contradictions between counts
- whether the phase is blocked by unresolved count drift

## 7. Manual Work Procedure

1. open the request file and confirm the donor source root used
2. read the donor operation sources exhaustively; do not stop at the happy path
3. update `DONOR_EXHAUSTIVE_CENSUS.csv` with every operation-like donor item that touches the service
4. normalize names and merge aliases only after the raw donor list is complete
5. assign one owner, one classification, and one canonical name to each retained operation
6. record deprecated, deferred, reference-only, or rejected donor operations explicitly
7. write `MASTER_OPERATION_REGISTRY.csv`
8. write the duplicate and alias report with every merge justified
9. run duplicate, unmapped, unowned, and contradiction checks
10. stop if any donor operation remains silent, unmapped, or ownerless

## 8. Grouping / Wave Logic

This phase does not open screen groups.

Rules:

- operation families may seed later waves, but they do not unlock preview
- every operation must be ready for surface mapping in the next phase

## 9. Decision Rules

- use one canonical operation name per business intent
- classify every operation as `business`, `support`, `internal`, `shared`, `deferred`, `reference_only`, or `rejected`
- default adoption decision = `REBUILD_CLEAN`
- use `REFERENCE_ONLY` when donor evidence is real but current target adoption is not justified
- use `REJECT` when the operation is donor noise, duplicate spillover, or out of current service scope

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- donor operations remain unmapped silently
- duplicate canonical names remain unresolved
- an operation has no owner
- an operation has no classification
- an operation is retained with no entry trigger or state effect note

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- donor operation count claim
- observed donor operation row count
- retained canonical operation count
- duplicate canonical names = `0`
- unowned retained operations = `0`
- unmapped donor operations = `0`
- unresolved alias collisions = `0`
- unresolved contradictions = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- updated `DONOR_EXHAUSTIVE_CENSUS`
- `MASTER_OPERATION_REGISTRY`
- duplicate and alias report
- blocker list for any unresolved count drift or classification conflict

Next lawful file: `PHASE_10_SURFACE_COVERAGE_AND_WAVE_MATRIX.md`