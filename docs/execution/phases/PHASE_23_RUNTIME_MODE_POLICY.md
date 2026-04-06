# PHASE_23_RUNTIME_MODE_POLICY

## 1. Purpose

Use only the runtime level justified by the current phase and keep proof language precise.

## 2. Why This Phase Exists

This phase prevents inflated claims such as calling a limited preview "production-like" or calling any running server "runtime verified".

## 3. Preconditions / Entry Conditions

- runtime truth sources are explicit
- the team can distinguish preview from canonical truth

## 4. Inputs

- runtime-truth lock pack
- environment expectations
- binding and runtime execution runbook

## 5. Allowed Work

- define runtime modes
- define preview and simulation policy
- define proof language restrictions
- define what each mode may and may not claim

## 6. Forbidden Work

- proof inflation
- mode ambiguity
- claiming high-proof modes from low-proof setups

## 7. Exact Execution Order

1. open the `runtime-mode-policy` request
2. define the allowed runtime modes for the current service
3. define what counts as preview, limited-api, canonical local truth, and production-like proof
4. define proof language restrictions
5. write preview and simulation policy
6. export the phase pack and stop before production-like verification

## 8. Required Decisions

- which modes exist now
- what each mode may claim
- what each mode may not claim

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_runtime-mode-policy.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/02_RUNTIME_MODE_POLICY.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/03_PREVIEW_AND_SIMULATION_POLICY.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/04_PROOF_LANGUAGE_RULES.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/runtime-mode-policy/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/RUNTIME_MODE_POLICY_INDEX.md`

## 10. Artifact Schema Expectations

`02_RUNTIME_MODE_POLICY.md` must define:

- each mode name
- enabling conditions
- allowed data classes
- allowed claim level

`04_PROOF_LANGUAGE_RULES.md` must define:

- allowed phrases
- disallowed phrases
- required qualifiers

## 11. Cross-File Updates

- align any preview documentation so it uses the approved proof language rather than informal optimism

## 12. Surface Impact

- all required surfaces must use the same mode language for the current proof level

## 13. UI Kit Impact

- no direct UI Kit impact

## 14. Contract Impact

- no direct contract impact

## 15. Runtime Impact

- this phase defines the runtime policy vocabulary used in proof and sign-off

## 16. Validation Checklist

- every mode is explicit
- proof claims are bounded
- disallowed claims are explicit

## 17. Exit Criteria

- production-like verification can be executed without proof-language ambiguity

## 18. Failure Modes / Common Mistakes

- calling any connected environment "production-like"
- mixing preview and truth classes in one phrase
- forgetting to bound limited-api preview claims

## 19. Anti-Patterns

- "everyone understands what we mean by end-to-end"
- "running equals verified"

## 20. Handoff To Next Phase

Deliver:

- explicit runtime mode ladder
- explicit proof-language rules

Next lawful file: `PHASE_24_PRODUCTION_LIKE_VERIFICATION.md`