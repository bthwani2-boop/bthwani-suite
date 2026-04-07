# PHASE_12_SCREEN_INVENTORY_AND_RATIONALIZATION

## 1. Purpose

Open the first lawful candidate-screen layer in grouped, wave-based, fixtures-only preview form across web and mobile surfaces.

## 2. Why This Phase Exists

This phase prevents donor screen sprawl, route inflation, premature Expo Go proof claims, and early screen ingestion into `packages/surfaces/` without UI Kit readiness.

## 3. Preconditions / Entry Conditions

- Journey Lock is complete
- the current surface activation wave is explicit
- UI Kit Foundation Compatibility Review is ready to run

## 4. Inputs

- journey-lock pack
- surface activation plan
- UI Kit foundation package
- thin app shell on the current surface when preview navigation is needed
- generic screen execution runbook

## 5. Allowed Work

- run the UI Kit Foundation Compatibility Review
- define the current screen-group order
- inventory candidate screens and related units
- classify each candidate
- create fixtures-only preview routes and registry notes
- open lawful preview on the active web or mobile surface only

## 6. Forbidden Work

- bound screen implementation
- generated client use
- runtime truth use
- opening every surface wave together
- preview before Journey Lock

## 7. Exact Execution Order

1. open the `screen-inventory-and-rationalization` request
2. run the UI Kit Foundation Compatibility Review and stop if the result is `FAIL`
3. confirm the current surface wave and do not open other waves
4. confirm the thin shell is ready for the active surface when preview navigation is needed
5. define the screen-group order for the active surface
6. inventory all candidate screens, sheets, modals, sections, inline steps, and state-only items
7. classify each candidate as `Keep`, `Merge`, `Convert`, `Internal`, or `Move to Legacy`
8. write preview-registry notes and fixture notes
9. if preview is needed, expose fixtures-only preview routes for the current wave only on the active web or mobile shell
10. export the catalog and stop before purpose lock

## 8. Required Decisions

- current surface wave
- current screen-group order
- which candidates are retained
- which candidates are merged or converted
- whether web preview, mobile preview, or neither is needed for the active wave

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_screen-inventory-and-rationalization.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/02_UI_KIT_FOUNDATION_COMPATIBILITY_REVIEW.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/03_SCREEN_GROUP_PLAN.csv`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/04_SCREEN_CATALOG.csv`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/05_SCREEN_RATIONALIZATION_REPORT.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/06_PREVIEW_REGISTRY_NOTES.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/07_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-inventory-and-rationalization/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/screen-inventory-and-rationalization/SCREEN_GROUP_PLAN.csv`
- `kdt/factory/<service>/exports/screen-inventory-and-rationalization/SCREEN_CATALOG.csv`
- `kdt/factory/<service>/index/SCREEN_INVENTORY_AND_RATIONALIZATION_INDEX.md`

## 10. Artifact Schema Expectations

`02_UI_KIT_FOUNDATION_COMPATIBILITY_REVIEW.md` must include:

- review status as `PASS`, `PARTIAL`, or `FAIL`
- token coverage
- typography coverage
- spacing coverage
- direction coverage
- primitive coverage
- state-shell coverage
- export cleanliness
- no-service-leakage check
- no-business-logic check
- blocker list

`03_SCREEN_GROUP_PLAN.csv` must include at least:

- `service`
- `surface`
- `screen_group`
- `business_reason`
- `entry_priority`
- `expected_screens_or_candidate_count`
- `fixture_mode`
- `preview_need`
- `notes`

`04_SCREEN_CATALOG.csv` must include at least:

- `candidate_id`
- `candidate_label`
- `surface`
- `journey_coverage`
- `item_kind`
- `decision`
- `canonical_target`
- `primary_operation_keys`
- `entry_trigger`
- `exit_trigger`
- `source_status`
- `source_trace`
- `notes`

## 11. Cross-File Updates

- create or update the preview registry under `packages/surfaces/` using service, surface, then screen-group structure
- update the active web or mobile app shell with fixtures-only preview routes only when preview is needed for the current wave

## 12. Surface Impact

- only the current wave opens
- no next surface is allowed to open because the current one is inconvenient

## 13. UI Kit Impact

- UI Kit must pass or bounded-pass compatibility review before screen ingestion
- blockers discovered here must be tracked before the next screen group opens

## 14. Contract Impact

- no contract change is allowed
- early pressure notes may be recorded only as observations

## 15. Runtime Impact

- the phase remains fixtures-only by default
- runtime truth is not allowed

## 16. Validation Checklist

- UI Kit review passed or bounded-passed
- current wave and screen-group order are explicit
- every candidate is classified
- preview entrypoint is explicit for the active web or mobile surface when needed
- preview work is fixtures-only and unbound

## 17. Exit Criteria

- the service has a lawful candidate-screen layer for the active wave

## 18. Failure Modes / Common Mistakes

- starting browser or Expo preview before the UI Kit review
- opening all waves together
- creating screens before defining groups
- treating state-only items as routes by default

## 19. Anti-Patterns

- "preview first, rationalize later"
- "the donor route tree already is the group model"
- "the shell exists, so preview is automatically lawful"
- "Expo Go preview equals readiness proof"

## 20. Handoff To Next Phase

Deliver:

- current-wave candidate catalog
- screen-group plan
- UI Kit compatibility result

Next lawful file: `PHASE_13_SCREEN_PURPOSE_LOCK.md`