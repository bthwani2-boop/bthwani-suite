# PHASE_08_ACTOR_CONTEXT_LOCK

## 1. Purpose

Lock who the service is for, who sees what, and on which surface that visibility is lawful.

## 2. Why This Phase Exists

This phase prevents donor habit, UI convenience, or assumed actor symmetry from defining the service.

## 3. Preconditions / Entry Conditions

- bootstrap is complete
- one service foundation exists
- the service is ready to leave foundation-only mode

## 4. Inputs

- `docs/services/<service>/00_SERVICE_PROFILE.md`
- `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- the generic screen execution runbook

## 5. Allowed Work

- refine actor participation
- refine actor exclusions
- define visibility rules per surface and context
- write a phase pack under `kdt/factory/<service>/`

## 6. Forbidden Work

- screen work
- preview-route work
- contract work
- runtime work
- assuming donor actor visibility without evidence

## 7. Exact Execution Order

1. open the `actor-context-lock` request for the current service
2. review the service profile and baseline actor matrix
3. list participating actors explicitly
4. list excluded or non-participating actors explicitly
5. define visibility conditions per surface and context
6. write the phase pack and export the matrix
7. review the result for hidden actor assumptions

## 8. Required Decisions

- primary actors
- secondary actors
- excluded actors
- actor-to-surface legality
- context-specific visibility restrictions

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_actor-context-lock.md`
- `kdt/factory/<service>/packs/actor-context-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/actor-context-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/actor-context-lock/02_ACTOR_CONTEXT_MATRIX.csv`
- `kdt/factory/<service>/packs/actor-context-lock/03_VISIBILITY_RULES.md`
- `kdt/factory/<service>/packs/actor-context-lock/04_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/actor-context-lock/05_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/actor-context-lock/ACTOR_CONTEXT_MATRIX.csv`
- `kdt/factory/<service>/index/ACTOR_CONTEXT_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`02_ACTOR_CONTEXT_MATRIX.csv` must include at least:

- `actor_id`
- `actor_label`
- `normalized_surface`
- `context_role`
- `primary_jobs`
- `source_status`
- `notes`

`03_VISIBILITY_RULES.md` must define:

- who is included
- who is excluded
- why each exclusion exists
- what context changes visibility legally

## 11. Cross-File Updates

- align `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv` with the stronger phase result when the phase adds clarity beyond the bootstrap foundation file

## 12. Surface Impact

- actor legality on surfaces becomes explicit
- no preview or screen creation is allowed yet

## 13. UI Kit Impact

- no direct UI Kit expansion is allowed

## 14. Contract Impact

- no direct contract work is allowed

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- participating actors are explicit
- excluded actors are explicit
- no actor is implied by donor habit alone
- each actor has a lawful surface context

## 17. Exit Criteria

- the service can now lock operations without actor ambiguity

## 18. Failure Modes / Common Mistakes

- merging distinct actors into one vague "user"
- assuming staff visibility without writing it
- leaving `webapp` or `website` implied rather than explicit

## 19. Anti-Patterns

- "all actors can probably see the same thing"
- "we will decide exclusions during screens"

## 20. Handoff To Next Phase

Deliver:

- explicit actor visibility model
- explicit exclusions

Next lawful file: `PHASE_09_OPERATION_LOCK.md`