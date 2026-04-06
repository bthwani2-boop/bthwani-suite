# PHASE_19_MASTER_CONTRACT_UPDATE

## 1. Purpose

Update canonical contract truth only after screen and gap evidence exists.

## 2. Why This Phase Exists

This phase prevents API-first rebuild, donor-name leakage, and contract growth that is disconnected from actual screen demand.

## 3. Preconditions / Entry Conditions

- Gap Map exists
- Screen/API Matrix exists
- contract readiness gate has passed

## 4. Inputs

- gap-map pack
- screen-api-matrix pack
- naming law
- OpenAPI sovereignty law
- binding and runtime execution runbook

## 5. Allowed Work

- define the contract change set
- add or refine canonical operations
- tune schemas
- refine error shapes and auth notes
- update canonical contract files under `contracts/master/`

## 6. Forbidden Work

- contract edits driven by preference only
- donor naming leakage
- rogue contract truth outside `contracts/master/`

## 7. Exact Execution Order

1. open the `contract-update` request
2. review the Gap Map and Screen/API Matrix
3. write the contract change set before editing canonical files
4. normalize operation names, schema names, and error names
5. update the canonical contract only after the change set is explicit
6. record schema and operation changes in the phase pack
7. verify naming cleanliness and target fit

## 8. Required Decisions

- which operations are added or refined
- which schema shapes change
- how errors are normalized
- what is still out of scope despite pressure notes

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_contract-update.md`
- `kdt/factory/<service>/packs/contract-update/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/contract-update/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/contract-update/02_CONTRACT_CHANGESET.md`
- `kdt/factory/<service>/packs/contract-update/03_SCHEMA_CHANGE_NOTES.md`
- `kdt/factory/<service>/packs/contract-update/04_OPERATION_CHANGESET.csv`
- `kdt/factory/<service>/packs/contract-update/05_ERROR_SHAPE_RULES.md`
- `kdt/factory/<service>/packs/contract-update/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/contract-update/07_EVIDENCE_INDEX.md`
- canonical changes inside `contracts/master/`
- `kdt/factory/<service>/index/CONTRACT_UPDATE_INDEX.md`

## 10. Artifact Schema Expectations

`02_CONTRACT_CHANGESET.md` must include:

- changed operations
- why they changed
- linked screen or flow pressure
- naming normalization notes

`04_OPERATION_CHANGESET.csv` must include at least:

- `operation_key`
- `change_type`
- `reason`
- `affected_screens_or_flows`
- `auth_note`
- `status`

`05_ERROR_SHAPE_RULES.md` must define:

- canonical error families
- consistency rules
- screen-facing implications when relevant

## 11. Cross-File Updates

- update any service-level contract notes that now need to reference canonical contract truth
- do not update generated layers yet; that belongs to Phase `20`

## 12. Surface Impact

- surfaces are not reopened here; contract work still follows screen-proven demand

## 13. UI Kit Impact

- no direct UI Kit impact

## 14. Contract Impact

- this phase is the first lawful point for real canonical contract change

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- every contract change traces back to screen or gap evidence
- naming is clean
- the canonical contract and the phase pack agree

## 17. Exit Criteria

- canonical contract truth is updated cleanly enough to generate from

## 18. Failure Modes / Common Mistakes

- editing the contract first and explaining later
- letting donor names survive in operations or schemas
- using generic "future-proofing" as the reason for change

## 19. Anti-Patterns

- "the contract should be richer because it feels better"
- "we can normalize names in generated code later"

## 20. Handoff To Next Phase

Deliver:

- updated canonical contract
- explicit contract change set

Next lawful file: `PHASE_20_GENERATE_VERIFY.md`