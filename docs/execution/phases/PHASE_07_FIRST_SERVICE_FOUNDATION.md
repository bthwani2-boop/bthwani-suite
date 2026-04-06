# PHASE_07_FIRST_SERVICE_FOUNDATION

## 1. Purpose

Establish one service foundation only and stop before detailed execution begins.

## 2. Why This Phase Exists

This phase prevents the repo from entering screen, contract, or runtime work before the service has a stable profile, actor model, operation set, and surface participation map.

## 3. Preconditions / Entry Conditions

- the first service is selected
- UI Kit foundation exists
- service naming and surface naming are canonical

## 4. Inputs

- service build order
- naming law
- approved surface naming
- UI Kit foundation scope
- observed target and donor reality

## 5. Allowed Work

- define the service profile
- define actor context
- define operations at the foundation level
- define participating surfaces
- define non-goals
- prepare the service root under `docs/services/<service>/`

## 6. Forbidden Work

- multiple active service foundations
- screen implementation
- preview registry work
- Expo Go routes
- contract detail work
- binding or runtime work

## 7. Exact Execution Order

1. create or verify `docs/services/<service>/`
2. write `00_SERVICE_PROFILE.md`
3. write `01_ACTOR_CONTEXT_MATRIX.csv`
4. write `02_OPERATIONS_CATALOG.csv`
5. write `03_SURFACE_MATRIX.csv`
6. write `04_PRIMARY_FLOW_NOTES.md`
7. write `05_NON_GOALS.md`
8. explicitly classify `app-field`
9. review the foundation for contradictions between actors, operations, and surfaces
10. prepare the service to enter Phase `08`, but do not open execution packs yet unless the service is actually moving beyond bootstrap now

## 8. Required Decisions

- the service slug and business role
- primary actors and excluded actors
- primary operations
- participating surfaces
- explicit non-goals for the service
- explicit `app-field` classification

## 9. Required Artifacts

- `docs/services/<service>/00_SERVICE_PROFILE.md`
- `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<service>/02_OPERATIONS_CATALOG.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/services/<service>/05_NON_GOALS.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-07/service-foundation-review.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-07/first-service-consistency-check.md`

## 10. Artifact Schema Expectations

`00_SERVICE_PROFILE.md` must include:

- service slug
- primary job
- secondary jobs when relevant
- major dependencies
- failure modes
- `[TBD]` gaps

`01_ACTOR_CONTEXT_MATRIX.csv` must include at least:

- actor id
- actor label
- normalized surface
- context role
- primary jobs
- source status
- notes

`02_OPERATIONS_CATALOG.csv` must include at least:

- operation key
- operation family
- primary actor
- primary surfaces
- service purpose
- source status
- source trace

`03_SURFACE_MATRIX.csv` must include at least:

- surface
- classification
- primary actor
- service role on that surface
- source status
- notes

## 11. Cross-File Updates

- ensure service profile and surface matrix agree with `docs/services/00_SERVICE_BUILD_ORDER.md`
- if the repo is moving directly into Phase `08`, prepare the service factory root under `kdt/factory/<service>/` without starting detailed packs prematurely

## 12. Surface Impact

- surfaces are classified at the foundation level only
- no candidate screens or preview routes are allowed yet

## 13. UI Kit Impact

- UI Kit foundation may be referenced as a dependency boundary
- UI Kit expansion remains forbidden until later phases

## 14. Contract Impact

- service implications for future contract work may be noted
- service-specific contract detail remains forbidden

## 15. Runtime Impact

- runtime expectations may be noted only as future concerns
- no runtime implementation is allowed

## 16. Validation Checklist

- one service foundation exists
- all foundation files contain real content
- actor, operation, and surface files do not contradict each other
- `app-field` is explicit
- no preview or screen work has begun

## 17. Exit Criteria

- the first service is stable enough to enter detailed execution in Phase `08`
- bootstrap is complete

## 18. Failure Modes / Common Mistakes

- writing service profile text with no actor or operation clarity
- leaving `app-field` implicit
- letting service foundation slip into screen-level detail or preview work

## 19. Anti-Patterns

- "we can start screens while the service foundation is still fuzzy"
- "app-field can be ignored until later"
- "service foundation files are optional because later packs are more detailed"

## 20. Handoff To Next Phase

Deliver:

- one stable service foundation
- explicit `app-field` classification
- bootstrap completion readiness

Next lawful file: `PHASE_08_ACTOR_CONTEXT_LOCK.md`