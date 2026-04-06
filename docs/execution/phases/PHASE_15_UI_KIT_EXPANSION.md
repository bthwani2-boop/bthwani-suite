# PHASE_15_UI_KIT_EXPANSION

## 1. Purpose

Grow UI Kit only from real retained screens rather than speculation.

## 2. Why This Phase Exists

This phase prevents shared design-system entropy and keeps service-specific work out of the shared layer.

## 3. Preconditions / Entry Conditions

- route compression is complete enough for the active screen groups
- retained screens now represent real reusable demand

## 4. Inputs

- flow-compression pack
- screen-purpose lock pack
- UI Kit foundation scope
- generic screen execution runbook

## 5. Allowed Work

- add shared patterns proven by retained screens
- refine primitives when real screens reveal gaps
- rerun UI Kit Expansion Review after meaningful screen-group growth

## 6. Forbidden Work

- speculative shared patterns
- service widgets promoted into UI Kit
- duplicate component families
- business logic in shared UI

## 7. Exact Execution Order

1. open the `ui-kit-expansion` request
2. review retained screens and identify shared demand only
3. add or refine the minimum shared patterns needed
4. rerun the UI Kit Expansion Review
5. record duplicate-family checks and cleanup actions
6. stop before state lock if UI Kit blockers remain unresolved

## 8. Required Decisions

- which new shared patterns are justified
- which candidate patterns remain local to the service
- whether any existing primitive should be extended rather than duplicated

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_ui-kit-expansion.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/02_UI_KIT_EXPANSION_REVIEW.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/03_NEW_SHARED_PATTERNS.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/04_DUPLICATE_FAMILY_CHECK.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/ui-kit-expansion/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/UI_KIT_EXPANSION_INDEX.md`

## 10. Artifact Schema Expectations

`02_UI_KIT_EXPANSION_REVIEW.md` must include:

- current service
- current surface wave
- current screen group
- new shared patterns introduced
- primitives touched
- duplicate-family check
- service-leakage check
- cleanup required
- decision status

`03_NEW_SHARED_PATTERNS.md` must define:

- pattern name
- source screens that proved demand
- why the pattern belongs in UI Kit
- what remains local to the service

## 11. Cross-File Updates

- update `packages/ui-kit/docs/FOUNDATION_SCOPE.md` only when shared scope meaningfully changes
- do not move local preview concerns into UI Kit docs as if they were shared law

## 12. Surface Impact

- the current wave may continue only after shared blockers are handled or bounded explicitly

## 13. UI Kit Impact

- this is the first phase where real UI Kit growth is lawful
- every change must remain screen-proven and service-clean

## 14. Contract Impact

- contract work remains forbidden

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- each new shared pattern traces back to retained screens
- no duplicate family exists
- no service-specific leakage exists

## 17. Exit Criteria

- shared UI is ready to support full state definition and API demand mapping

## 18. Failure Modes / Common Mistakes

- calling a local workaround reusable before it is proven
- duplicating an existing primitive under a new name
- moving service policy into UI Kit for convenience

## 19. Anti-Patterns

- "we may need this pattern later"
- "it is in many screens in one service, so it must be shared"

## 20. Handoff To Next Phase

Deliver:

- screen-proven UI Kit growth
- updated UI Kit review

Next lawful file: `PHASE_16_STATE_LOCK.md`