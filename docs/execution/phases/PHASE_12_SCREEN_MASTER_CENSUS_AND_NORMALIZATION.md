# PHASE_12_SCREEN_MASTER_CENSUS_AND_NORMALIZATION

## 1. Purpose

Recover the full screen and unit universe for the active service and normalize it into one `MASTER_SCREEN_REGISTRY` before any screen spec, preview claim, or implementation claim is allowed.

## 2. Exact Inputs

- `kdt/factory/<service>/exports/donor-exhaustive-census/DONOR_EXHAUSTIVE_CENSUS.csv`
- `kdt/factory/<service>/exports/operation-master-extraction/MASTER_OPERATION_REGISTRY.csv`
- `kdt/factory/<service>/exports/journey-chain-master/JOURNEY_MASTER.csv`
- `kdt/factory/<service>/exports/surface-coverage-and-wave-matrix/SCREEN_WAVE_MATRIX.csv`
- `packages/surfaces/docs/PHASE_12_SCOPE.md` when the current service already has a preview package
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- `<legacy_repo_root>/packages/surfaces/src/<service>/**`
- `<legacy_repo_root>/apps/**/<service>/**`
- `<legacy_repo_root>/services/<service>/**trace*`
- `<legacy_repo_root>/services/<service>/**route*`
- current repo preview registries under `packages/surfaces/` and thin app shells only as target-fit evidence, not as proof of completeness

If the donor source root is unavailable, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract all of the following for the active service:

- screens
- routes
- modals
- sheets
- sections
- inline steps
- state-only units
- donor names and aliases
- target normalized names
- related operations
- related journeys
- related surfaces

No donor UI cluster may be skipped because it is outside the preferred happy path.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_screen-master-census-and-normalization.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/02_DONOR_SCREEN_CENSUS.csv`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/03_MASTER_SCREEN_REGISTRY.csv`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/04_UNIT_CLASSIFICATION_AND_NORMALIZATION_REPORT.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/05_DUPLICATE_OR_ORPHAN_SCREEN_REPORT.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/06_GAPS_AND_BLOCKERS.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/07_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-master-census-and-normalization/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/donor-exhaustive-census/DONOR_EXHAUSTIVE_CENSUS.csv`
- `kdt/factory/<service>/exports/screen-master-census-and-normalization/MASTER_SCREEN_REGISTRY.csv`
- `kdt/factory/<service>/index/SCREEN_MASTER_CENSUS_AND_NORMALIZATION_INDEX.md`

## 6. Required File Formats And Schemas

`03_MASTER_SCREEN_REGISTRY.csv` must include at least:

- `screen_id`
- `canonical_name`
- `donor_names`
- `service`
- `surface`
- `route_or_entrypoint`
- `actor`
- `family`
- `purpose`
- `entry_exit`
- `primary_cta`
- `secondary_actions`
- `required_states`
- `related_operations`
- `donor_evidence_paths`
- `unit_type`
- `decision_status`
- `notes`

`02_DONOR_SCREEN_CENSUS.csv` must include at least:

- `donor_path`
- `surface_guess`
- `donor_unit_name`
- `derived_operation_id`
- `unit_type`
- `mapping_status`
- `notes`

Fields not fully known yet must be populated as `BLOCKED`, `GAP`, or `UNPROVEN`, not left implicit.

## 7. Manual Work Procedure

1. open the request file and confirm the donor source root used
2. scan donor UI, route, and traceability sources exhaustively for the active service
3. write every screen-like and unit-like donor item into `02_DONOR_SCREEN_CENSUS.csv`
4. normalize names to target-repo standards without erasing donor trace
5. classify each item as `screen`, `modal`, `sheet`, `section`, `inline_step`, `internal_unit`, or `state_only_unit`
6. map each retained item to at least one operation and one journey or mark it `Move to Legacy`, `REFERENCE_ONLY`, or `REJECT`
7. write `MASTER_SCREEN_REGISTRY.csv`
8. record duplicate, merge, conversion, orphan, and out-of-scope decisions explicitly
9. run unnamed-retained, duplicate-name, orphan-screen, and unmapped-surface checks
10. stop if any retained screen still lacks canonical naming, unit type, or operation/journey linkage

## 8. Grouping / Wave Logic

Rules:

- use the wave seeds from `SCREEN_WAVE_MATRIX`; do not finalize build order here
- group only at census depth in this phase; final grouping waits for Phase `14`
- preview remains registry-only and fixtures-only here

## 9. Decision Rules

- `Keep` only when the unit owns independent meaning
- `Merge` when donor duplicates split one clean responsibility across multiple screens
- `Convert` when a donor route is better expressed as a modal, sheet, section, inline step, or state-only unit
- `Move to Legacy` when the donor unit is outside current service scope
- `REFERENCE_ONLY` when the donor unit informs future work but is not retained now

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- donor UI trees were not scanned exhaustively
- a retained screen has no canonical name
- a retained screen has no unit type
- a retained screen has no operation or journey relation
- an approved surface has donor screens that were not mapped or rejected explicitly

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- donor screen and unit count
- retained screen count
- unnamed retained screens = `0`
- duplicate retained canonical names = `0`
- orphan retained screens = `0`
- approved-surface donor screens left unmapped = `0`
- unresolved count contradictions = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- updated `DONOR_EXHAUSTIVE_CENSUS`
- `MASTER_SCREEN_REGISTRY`
- unit classification and normalization report
- explicit duplicate, merge, conversion, and orphan report

Next lawful file: `PHASE_13_SCREEN_SPEC_AND_PURPOSE_SYSTEM.md`