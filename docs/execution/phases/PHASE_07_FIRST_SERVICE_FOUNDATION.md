# PHASE_07_FIRST_SERVICE_FOUNDATION

## 1. Purpose

Establish one exact first-service foundation and stop before exhaustive donor recovery begins.

## 2. Exact Inputs

- `docs/services/00_SERVICE_BUILD_ORDER.md`
- `governance/APPROVED_SURFACE_NAMING.md`
- `governance/SERVICE_CATALOG.md`
- `governance/SURFACE_CATALOG.md`
- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`
- `docs/reality-intake/02_CURRENT_SERVICES_MAP.md`
- `docs/reality-intake/03_CURRENT_SURFACES_MAP.md`
- `docs/reality-intake/04_CURRENT_SCREENS_INVENTORY.md`
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`

## 3. Exact Source-Of-Truth Inputs

- repo-local service order law
- repo-local naming and ownership law
- observed target repo reality from Phase `02`
- donor service-scope evidence only at foundation depth when needed to avoid naming or actor drift

This phase is not the exhaustive donor-recovery phase.
If first-service selection, naming, or surface legality is ambiguous, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract and lock exactly these foundation truths for the first service:

- service slug and service role
- primary job and bounded secondary jobs
- primary actors and excluded actors at foundation depth
- primary operation families at foundation depth
- participating surfaces
- explicit `app-field` classification
- explicit non-goals
- major dependencies and boundary risks

Do not claim donor completeness, screen completeness, or operation completeness in this phase.

## 5. Mandatory Output Artifacts

- `docs/services/<service>/00_SERVICE_PROFILE.md`
- `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<service>/02_OPERATIONS_CATALOG.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/services/<service>/05_NON_GOALS.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-07/service-foundation-review.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-07/first-service-consistency-check.md`

## 6. Required File Formats And Schemas

`00_SERVICE_PROFILE.md` must include at least:

- `service_slug`
- `service_role`
- `primary_job`
- `secondary_jobs`
- `major_dependencies`
- `failure_modes`
- `boundary_risks`
- `decision_status`

`01_ACTOR_CONTEXT_MATRIX.csv` must include at least:

- `actor_id`
- `actor_label`
- `normalized_surface`
- `context_role`
- `primary_jobs`
- `source_status`
- `decision_status`
- `notes`

`02_OPERATIONS_CATALOG.csv` must include at least:

- `operation_key`
- `operation_family`
- `primary_actor`
- `primary_surfaces`
- `service_purpose`
- `source_status`
- `source_trace`
- `decision_status`

`03_SURFACE_MATRIX.csv` must include at least:

- `surface`
- `classification`
- `primary_actor`
- `service_role_on_surface`
- `source_status`
- `decision_status`
- `notes`

Use only `BLOCKED`, `GAP`, or `UNPROVEN` for unresolved status.

## 7. Manual Work Procedure

1. confirm the first service from `docs/services/00_SERVICE_BUILD_ORDER.md`
2. create or verify `docs/services/<service>/`
3. write the service profile with exact service role, job, boundary, and dependency language
4. write the actor context matrix at foundation depth without pretending it is exhaustive
5. write the operations catalog at family depth only
6. write the surface matrix and classify `app-field` explicitly
7. write primary flow notes and non-goals
8. run contradiction checks across actors, operations, surfaces, and non-goals
9. stop if the foundation still depends on unnamed actors, ambiguous surfaces, or implied non-goals

## 8. Grouping / Wave Logic

This phase does not open waves, screen groups, build bundles, preview routes, or screen-registry rows.

Rules:

- surface participation is foundation truth only here
- no screen sequencing or preview sequencing is lawful here

## 9. Decision Rules

- foundation depth only; no detailed donor recovery claims
- `app-field` must be `REQUIRED`, `OPTIONAL`, or `OUT`
- non-goals must be explicit rather than implied from silence
- service boundary ambiguity must be marked `BLOCKED`, `GAP`, or `UNPROVEN`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- the first service is not explicit
- the service slug or surface naming is ambiguous
- `app-field` is still implicit
- actors, operations, and surfaces contradict each other
- preview, screen, contract, binding, or runtime work has started

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- first-service count = `1`
- service foundation file count matches the required set = `100%`
- cross-file contradictions = `0`
- unnamed participating surfaces = `0`
- unresolved `app-field` classifications = `0`
- unresolved foundation blockers = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- one stable first-service foundation
- explicit `app-field` classification
- exact service-root files for the active service
- blocker list for any unresolved foundation ambiguity

Next lawful file: `PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION.md`