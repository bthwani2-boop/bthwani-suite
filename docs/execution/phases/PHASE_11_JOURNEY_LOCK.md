# PHASE_11_JOURNEY_LOCK

## 1. Purpose

Lock the journey before candidate screens exist.

## 2. Why This Phase Exists

This phase prevents preview work from inventing the flow and prevents surfaces from acting like journey truth owners.

## 3. Preconditions / Entry Conditions

- the service has explicit actors, operations, and surfaces
- the current surface wave is explicit

## 4. Inputs

- actor-context lock pack
- operation lock pack
- surface-responsibility lock pack
- service foundation primary flow notes

## 5. Allowed Work

- define happy path
- define fast path when relevant
- define returning-user path when relevant
- define staff path when relevant
- define failure and recovery paths
- define key journey risks

## 6. Forbidden Work

- candidate-screen creation
- preview-route creation
- Expo Go routes
- preview registry work

## 7. Exact Execution Order

1. open the `journey-lock` request
2. define the primary happy path for the current wave
3. define fast-path shortcuts when they are truly distinct
4. define returning-user resumption when the service is resumable
5. define staff or ops path when relevant
6. define failure and recovery paths explicitly
7. record journey risks and unresolved blockers
8. write the pack and stop before candidate-screen work

## 8. Required Decisions

- what the shortest lawful happy path is
- whether a true fast path exists
- whether returning-user resumption exists
- where staff or ops intervention enters
- how recovery works

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_journey-lock.md`
- `kdt/factory/<service>/packs/journey-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/journey-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/journey-lock/02_FLOW_MAP_PRIMARY.md`
- `kdt/factory/<service>/packs/journey-lock/03_FLOW_MAP_STAFF.md`
- `kdt/factory/<service>/packs/journey-lock/04_FLOW_MAP_FAILURE_RECOVERY.md`
- `kdt/factory/<service>/packs/journey-lock/05_FLOW_RISKS.md`
- `kdt/factory/<service>/packs/journey-lock/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/journey-lock/07_IMPLANT_GUIDE.md`
- `kdt/factory/<service>/packs/journey-lock/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/JOURNEY_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

Each flow-map file must include at least:

- entry condition
- preconditions
- major steps
- likely failure points or branch logic
- completion signal

`05_FLOW_RISKS.md` must include:

- unresolved branch ambiguity
- actor confusion risks
- surface handoff risks
- path inflation risks

## 11. Cross-File Updates

- align `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md` with the stable high-level journey summary
- do not open preview work in app shells yet
- thin web or mobile shell preparation may continue, but no browseable preview route, registry, or device preview may open yet

## 12. Surface Impact

- the current surface wave becomes journey-ready
- no next-wave opening occurs until the current wave journey is explicit enough

## 13. UI Kit Impact

- UI Kit is now ready to be reviewed for compatibility against known journey-driven screen demand in the next phase

## 14. Contract Impact

- no direct contract work is allowed

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- happy path is explicit
- failure path is explicit
- recovery path is explicit
- no preview work started early

## 17. Exit Criteria

- the service is ready to begin candidate-screen inventory lawfully

## 18. Failure Modes / Common Mistakes

- treating surface participation as if it were enough to begin screens
- leaving recovery implicit
- skipping returning-user logic when the flow is resumable

## 19. Anti-Patterns

- "we can discover the journey while building screens"
- "Expo Go can help us find the flow before the flow is written"

## 20. Handoff To Next Phase

Deliver:

- explicit journey maps
- explicit path risks
- current-wave readiness for candidate-screen work

Next lawful file: `PHASE_12_SCREEN_INVENTORY_AND_RATIONALIZATION.md`