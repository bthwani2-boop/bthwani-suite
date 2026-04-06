# PHASE_27_NEXT_SERVICE_REPEAT

## 1. Purpose

Open the next service only after the current service is sealed and the repo is ready to repeat the same governed cycle.

## 2. Why This Phase Exists

This phase prevents the next service from opening while the previous one is still unresolved, weakly sealed, or still leaking donor residue.

## 3. Preconditions / Entry Conditions

- current service seal status is explicit
- legacy quarantine work is complete enough
- service build order still exists or is ready to be updated

## 4. Inputs

- service seal pack
- legacy quarantine pack
- `docs/services/00_SERVICE_BUILD_ORDER.md`
- current repo readiness observation

## 5. Allowed Work

- confirm current service seal
- confirm the repo is ready for the next deep service track
- update the service build order if needed
- open the next service request

## 6. Forbidden Work

- opening the next service while the current one is unsealed or ambiguously blocked
- pretending the next service cycle can skip governance and service-foundation discipline

## 7. Exact Execution Order

1. open the `next-service-unlock` request
2. confirm the current service seal status explicitly
3. confirm that legacy quarantine blockers are closed or explicitly bounded
4. review `docs/services/00_SERVICE_BUILD_ORDER.md`
5. update the build order only if a governed change is required
6. write the next-service unlock note
7. name the next starting point for the next service cycle

## 8. Required Decisions

- whether the current service is sealed enough to unlock the next one
- whether the next service already has a foundation or must start there
- whether the service order changed lawfully

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_next-service-unlock.md`
- `kdt/factory/<service>/packs/next-service-unlock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/next-service-unlock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/next-service-unlock/02_SERVICE_SEAL_CONFIRMATION.md`
- `kdt/factory/<service>/packs/next-service-unlock/03_NEXT_SERVICE_UNLOCK_NOTE.md`
- `kdt/factory/<service>/packs/next-service-unlock/04_UPDATED_SERVICE_ORDER.md`
- `kdt/factory/<service>/packs/next-service-unlock/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/next-service-unlock/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/NEXT_SERVICE_UNLOCK_INDEX.md`

## 10. Artifact Schema Expectations

`02_SERVICE_SEAL_CONFIRMATION.md` must include:

- current service verdict
- blocker status
- evidence references

`03_NEXT_SERVICE_UNLOCK_NOTE.md` must include:

- next service slug
- why it may now open
- which phase it re-enters at

`04_UPDATED_SERVICE_ORDER.md` must include:

- whether the order changed
- why it changed or why it remained stable

## 11. Cross-File Updates

- update `docs/services/00_SERVICE_BUILD_ORDER.md` only if the governed order truly changed
- prepare the next service root cleanly instead of reusing donor residue

## 12. Surface Impact

- the next service must not inherit current-service surface assumptions automatically

## 13. UI Kit Impact

- the next service may reuse shared UI lawfully, but it must not assume service-specific carryover is shared law

## 14. Contract Impact

- the next service begins with service truth first, not inherited contract-first behavior

## 15. Runtime Impact

- runtime proof from one service does not automatically grant runtime proof for the next service

## 16. Validation Checklist

- current service seal is explicit
- legacy quarantine does not leave active residue
- next service unlock rationale is explicit

## 17. Exit Criteria

- the repo can begin the next service cycle without lowering standards

## 18. Failure Modes / Common Mistakes

- opening the next service because momentum feels good
- treating one sealed service as permission to skip foundation work on the next

## 19. Anti-Patterns

- "the repo is warm now, so we can skip the early phases"
- "the next service can inherit the last service's surface model by default"

## 20. Handoff To Next Phase

Deliver:

- next-service unlock note
- updated service order when needed
- explicit re-entry point for the next service

Next lawful starting point for the next service:

- `PHASE_07_FIRST_SERVICE_FOUNDATION.md` if the next service still lacks its service-foundation layer
- `PHASE_08_ACTOR_CONTEXT_LOCK.md` if the next service foundation already exists and is still valid