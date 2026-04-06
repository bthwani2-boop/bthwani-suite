# PHASE_10_SURFACE_RESPONSIBILITY_LOCK

## 1. Purpose

Lock where each operation lives and sequence surfaces into lawful execution waves.

## 2. Why This Phase Exists

This phase prevents catch-all surfaces, hidden ownership drift, and uncontrolled parallel opening of every surface.

## 3. Preconditions / Entry Conditions

- actor visibility is explicit
- operations are explicit
- the service can explain who starts the primary job and who receives it next

## 4. Inputs

- actor-context lock pack
- operation lock pack
- service foundation surface matrix
- generic screen execution runbook

## 5. Allowed Work

- classify each approved surface as `REQUIRED`, `OPTIONAL`, or `OUT`
- map operations to surfaces
- declare the current surface activation order and wave model
- justify thin app-shell eligibility for participating surfaces

## 6. Forbidden Work

- candidate-screen creation
- preview-route creation
- implicit handling of `app-field`
- using `control-panel` as a generic catch-all

## 7. Exact Execution Order

1. open the `surface-responsibility-lock` request
2. review operations and actor contexts
3. classify every approved surface explicitly
4. map each operation to the surfaces that lawfully participate
5. define the current surface activation order and wave sequence
6. define which surface opens first and why
7. write the pack, export the key matrices, and stop before Journey Lock

## 8. Required Decisions

- which surfaces are `REQUIRED`, `OPTIONAL`, or `OUT`
- which surface starts the primary job
- which surface receives the next lifecycle handoff
- when `control-panel` opens
- when optional surfaces may open

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_surface-responsibility-lock.md`
- `kdt/factory/<service>/packs/surface-responsibility-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/surface-responsibility-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/surface-responsibility-lock/02_SURFACE_MATRIX.csv`
- `kdt/factory/<service>/packs/surface-responsibility-lock/03_SURFACE_ACTIVATION_PLAN.csv`
- `kdt/factory/<service>/packs/surface-responsibility-lock/04_OPERATION_SURFACE_COVERAGE.csv`
- `kdt/factory/<service>/packs/surface-responsibility-lock/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/surface-responsibility-lock/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/surface-responsibility-lock/SURFACE_MATRIX.csv`
- `kdt/factory/<service>/exports/surface-responsibility-lock/SURFACE_ACTIVATION_PLAN.csv`
- `kdt/factory/<service>/index/SURFACE_RESPONSIBILITY_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`02_SURFACE_MATRIX.csv` must include at least:

- `surface`
- `classification`
- `primary_actor`
- `service_role`
- `source_status`
- `notes`

`03_SURFACE_ACTIVATION_PLAN.csv` must include at least:

- `service`
- `wave_id`
- `surface`
- `activation_reason`
- `predecessor_surface`
- `successor_surface`
- `screen_groups_opened_first`
- `gating_status`
- `notes`

`04_OPERATION_SURFACE_COVERAGE.csv` must include at least:

- `operation_key`
- `surface`
- `why_here`
- `owner`
- `lifecycle_position`
- `notes`

## 11. Cross-File Updates

- align `docs/services/<service>/03_SURFACE_MATRIX.csv` with the stronger phase output when needed
- if a surface becomes `REQUIRED` or `OPTIONAL`, its thin app shell may be verified for later preview, but no preview routes start yet

## 12. Surface Impact

- this phase decides which surfaces are lawful for the service
- this phase decides the wave order
- this phase does not permit screen creation yet

## 13. UI Kit Impact

- UI Kit may now understand which surfaces are likely to consume later screen groups
- no UI Kit expansion work is allowed yet

## 14. Contract Impact

- no direct contract work is allowed

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- every approved surface is classified explicitly
- `app-field` is explicit
- current surface activation order is explicit
- `control-panel` has a lawful reason rather than a convenience reason

## 17. Exit Criteria

- the service is ready to lock journeys on a known surface wave model

## 18. Failure Modes / Common Mistakes

- opening all surfaces together
- choosing `control-panel` first because it demos well
- leaving optional surfaces ambiguous

## 19. Anti-Patterns

- "surface order can be inferred later from screens"
- "app-field is optional, so it does not need classification"

## 20. Handoff To Next Phase

Deliver:

- explicit surface classifications
- explicit activation order
- explicit current wave

Next lawful file: `PHASE_11_JOURNEY_LOCK.md`