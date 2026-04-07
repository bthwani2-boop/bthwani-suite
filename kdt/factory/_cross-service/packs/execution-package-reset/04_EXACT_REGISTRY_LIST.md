# Exact Registry List

## Executive Verdict

The new execution package is invalid unless the following registries and structured artifacts exist exactly as named.

## Required Registries

1. `DONOR_EXHAUSTIVE_CENSUS.csv`
   - scope: donor reality recovery
   - owner phase: `08`, updated again in `09` and `12`
2. `ACTOR_CONTEXT_MASTER.csv`
   - scope: actors, contexts, entitlements, exclusions
   - owner phase: `08`
3. `MASTER_OPERATION_REGISTRY.csv`
   - scope: canonical operation universe
   - owner phase: `09`
4. `SURFACE_COVERAGE_MATRIX.csv`
   - scope: operation-to-surface legality and ownership
   - owner phase: `10`
5. `SCREEN_WAVE_MATRIX.csv`
   - scope: wave seeds and unlock order
   - owner phase: `10`
6. `OPERATION_TO_SURFACE_CHAIN.csv`
   - scope: exact surface coverage chain for operations
   - owner phase: `10`
7. `JOURNEY_MASTER.csv`
   - scope: happy, failure, recovery, and support chains
   - owner phase: `11`
8. `ROUTE_ENTRYPOINT_AND_TRANSITION_MATRIX.csv`
   - scope: route and transition evidence
   - owner phase: `11`
9. `MASTER_SCREEN_REGISTRY.csv`
   - scope: retained screen universe and normalized screen truth
   - owner phase: `12`
10. `SCREEN_SPEC_INDEX.csv`
   - scope: retained screen spec completeness
   - owner phase: `13`
11. `OPERATION_TO_SCREEN_CHAIN.csv`
   - scope: operation/journey/surface/screen linkage
   - owner phase: `13`
12. `SCREEN_GROUPING_PLAN.csv`
   - scope: final group assignment
   - owner phase: `14`
13. `BUILD_ORDER_PLAN.csv`
   - scope: implementation and validation order
   - owner phase: `14`
14. `DEPENDENCY_LANE_MAP.csv`
   - scope: lawful parallelism and blockers
   - owner phase: `14`
15. `CONVERSION_AND_COMPRESSION_DECISIONS.csv`
   - scope: final compression decisions after completeness
   - owner phase: `14`

## Required Non-CSV Artifacts

- per-screen spec files under `kdt/factory/<service>/packs/screen-spec-and-purpose-system/specs/`
- exact evidence indexes in every phase pack
- explicit blocker and contradiction reports in every phase pack

## Final Readiness Verdict

`ACCEPT_FOR_PACKAGING`