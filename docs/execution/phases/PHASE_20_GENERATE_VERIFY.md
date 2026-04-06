# PHASE_20_GENERATE_VERIFY

## 1. Purpose

Turn canonical contract truth into verified generated layers.

## 2. Why This Phase Exists

This phase prevents hand-maintained drift between contract truth and client or type layers.

## 3. Preconditions / Entry Conditions

- canonical contract updates are complete enough to generate from
- generate/verify readiness gate has passed

## 4. Inputs

- updated canonical contract
- contract-update pack
- generation tooling configuration
- binding and runtime execution runbook

## 5. Allowed Work

- define generation scope
- generate API types
- generate API clients
- verify parity and drift
- verify error typing

## 6. Forbidden Work

- hand-editing generated truth as canonical
- generating from unstable drafts
- binding screens before verify work completes

## 7. Exact Execution Order

1. open the `generate-verify` request
2. define the exact generation scope
3. generate types and clients from the canonical contract
4. write the verify report and parity report
5. verify error typing explicitly
6. record any drift or confirm that drift is zero
7. stop before binding if generation is not reproducible

## 8. Required Decisions

- which generated packages or roots are in scope now
- whether parity is acceptable
- whether any drift is a blocker

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_generate-verify.md`
- `kdt/factory/<service>/packs/generate-verify/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/generate-verify/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/generate-verify/02_GENERATION_SCOPE.md`
- `kdt/factory/<service>/packs/generate-verify/03_VERIFY_REPORT.md`
- `kdt/factory/<service>/packs/generate-verify/04_PARITY_REPORT.md`
- `kdt/factory/<service>/packs/generate-verify/05_ERROR_TYPING_REPORT.md`
- `kdt/factory/<service>/packs/generate-verify/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/generate-verify/07_EVIDENCE_INDEX.md`
- generated output under lawful package roots such as `packages/api-types/` and `packages/api-clients/` when introduced
- `kdt/factory/<service>/index/GENERATE_VERIFY_INDEX.md`

## 10. Artifact Schema Expectations

`02_GENERATION_SCOPE.md` must include:

- contract source
- output roots
- generation commands or tooling
- exclusions if any

`03_VERIFY_REPORT.md` must include:

- generation success or failure
- reproducibility status
- major issues

`04_PARITY_REPORT.md` must include:

- parity result
- drift summary
- explanation for any accepted drift if such acceptance is lawful

## 11. Cross-File Updates

- do not update binding files yet; binding begins only in Phase `21`
- ensure generated outputs remain derived truth rather than manually curated truth

## 12. Surface Impact

- no surface binding begins yet

## 13. UI Kit Impact

- no direct UI Kit impact

## 14. Contract Impact

- generated layers must remain faithful to the contract and not silently redefine it

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- generation is reproducible
- parity is verified
- error typing is verified
- no hand-edited generated truth is being treated as canonical

## 17. Exit Criteria

- derived layers are stable enough to support canonical binding

## 18. Failure Modes / Common Mistakes

- accepting drift without writing it
- editing generated output by hand
- binding to stale generated artifacts

## 19. Anti-Patterns

- "generated code can be fixed manually as needed"
- "parity is implied if the generator ran"

## 20. Handoff To Next Phase

Deliver:

- reproducible generated layers
- explicit verify and parity result

Next lawful file: `PHASE_21_BINDING_LOCK.md`