# PHASE_25_EVIDENCE_AND_SIGN_OFF

## 1. Purpose

Seal the service with indexed proof, guard guidance, and formal sign-off material.

## 2. Why This Phase Exists

This phase prevents closure from becoming a verbal claim or a memory of what was tested.

## 3. Preconditions / Entry Conditions

- production-like verification is complete for the required scope
- evidence sources are available and traceable

## 4. Inputs

- production-like verification pack
- binding-lock pack
- generate-verify pack
- relevant screen and contract packs

## 5. Allowed Work

- gather and index evidence
- write guard guidance
- write parity and binding proof summary
- write service seal status

## 6. Forbidden Work

- declaring closure without indexed evidence
- mixing unresolved blockers into a clean sign-off statement

## 7. Exact Execution Order

1. open the `service-seal` request
2. gather all phase evidence relevant to the final scope
3. write the final evidence index
4. write the guards report and prevention notes
5. write parity and binding proof summary
6. write service seal status with explicit verdict

## 8. Required Decisions

- whether the service is sealed
- which guards are recommended from observed risk
- whether any blocker prevents sign-off

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_service-seal.md`
- `kdt/factory/<service>/packs/service-seal/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/service-seal/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/service-seal/02_FINAL_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/packs/service-seal/03_GUARDS_REPORT.md`
- `kdt/factory/<service>/packs/service-seal/04_PARITY_AND_BINDING_PROOF.md`
- `kdt/factory/<service>/packs/service-seal/05_SERVICE_SEAL_STATUS.md`
- `kdt/factory/<service>/packs/service-seal/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/index/SERVICE_SEAL_INDEX.md`

## 10. Artifact Schema Expectations

`02_FINAL_EVIDENCE_INDEX.md` must include:

- artifact path
- artifact purpose
- confidence level
- source origin
- target status

`03_GUARDS_REPORT.md` must include:

- guard proposals
- what risk each guard addresses
- whether the guard is advisory or already adopted

`05_SERVICE_SEAL_STATUS.md` must include:

- final verdict
- blockers if any
- proof scope
- unresolved but non-blocking follow-up items

## 11. Cross-File Updates

- update any top-level service-order or service-status note only after the service seal verdict is explicit

## 12. Surface Impact

- no new surface work should begin here

## 13. UI Kit Impact

- only guard or follow-up notes may reference UI Kit concerns

## 14. Contract Impact

- only evidence references and guard notes may reference contract concerns

## 15. Runtime Impact

- runtime concerns are summarized as evidence and guard input, not as new execution work

## 16. Validation Checklist

- the evidence index is complete
- sign-off language matches the actual proof level
- blockers are visible if they exist

## 17. Exit Criteria

- the service is formally sealed or formally blocked with explicit reasons

## 18. Failure Modes / Common Mistakes

- declaring closure from memory instead of indexed evidence
- hiding blockers inside prose
- confusing recommended guards with already-adopted guards

## 19. Anti-Patterns

- "everyone knows the service is done"
- "we can write the evidence index later"

## 20. Handoff To Next Phase

Deliver:

- final evidence index
- service seal verdict
- guard guidance

Next lawful file: `PHASE_26_LEGACY_QUARANTINE.md`