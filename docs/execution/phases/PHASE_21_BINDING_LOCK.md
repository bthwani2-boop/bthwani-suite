# PHASE_21_BINDING_LOCK

## 1. Purpose

Begin real bound implementation only after contract and generated layers are stable.

## 2. Why This Phase Exists

This phase prevents hidden competing chains, raw fetch, and contract bypass on canonical screens.

## 3. Preconditions / Entry Conditions

- generated layers are verified
- binding readiness gate has passed
- the active screens are stable enough to bind

## 4. Inputs

- generated layers
- contract-update pack
- generate-verify pack
- screen-purpose lock pack
- binding and runtime execution runbook

## 5. Allowed Work

- bind screens through the canonical chain
- define hooks or viewmodels
- define proxy paths only where justified
- normalize binding notes

## 6. Forbidden Work

- raw fetch inside canonical screens
- multiple competing chains for one operation
- proxy creation without necessity

## 7. Exact Execution Order

1. open the `binding-lock` request
2. map each critical screen to one canonical operation chain
3. define hooks or viewmodels and their client usage
4. define proxy routes only where the necessity test passes
5. write normalization notes for the bound chain
6. review canonical paths for raw fetch or hidden adapters
7. export the binding chain map

## 8. Required Decisions

- what the primary chain is per operation
- whether a proxy is truly necessary
- which helpers are allowed without breaking traceability

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_binding-lock.md`
- `kdt/factory/<service>/packs/binding-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/binding-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/binding-lock/02_BINDING_CHAIN_MAP.md`
- `kdt/factory/<service>/packs/binding-lock/03_PROXY_ROUTE_MAP.md`
- `kdt/factory/<service>/packs/binding-lock/04_NORMALIZATION_NOTES.md`
- `kdt/factory/<service>/packs/binding-lock/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/binding-lock/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/BINDING_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`02_BINDING_CHAIN_MAP.md` must define at least:

- screen or surface entry
- operation key
- hook or viewmodel
- API client
- proxy if any
- service or controller entry
- repository entry
- runtime truth source

`03_PROXY_ROUTE_MAP.md` must define:

- proxy path
- upstream target
- why the proxy exists
- why direct client use is not lawful

## 11. Cross-File Updates

- update any preview-route documentation so canonical bound paths are no longer confused with fixtures-only preview paths

## 12. Surface Impact

- the active surfaces now gain real bound chains
- no new surfaces should be opened here merely because binding became possible

## 13. UI Kit Impact

- no direct UI Kit changes unless a binding issue reveals a real shared state-shell or primitive defect that must be handled lawfully

## 14. Contract Impact

- binding must consume contract truth, not redefine it

## 15. Runtime Impact

- runtime truth work is the next phase; it is not implied by binding alone

## 16. Validation Checklist

- each critical operation has one explicit chain
- raw fetch is absent from canonical paths
- proxy usage is justified
- hidden adapters are not bypassing the chain

## 17. Exit Criteria

- binding is explicit enough to define runtime truth boundaries

## 18. Failure Modes / Common Mistakes

- keeping raw fetch as a shortcut in one screen
- letting two chains exist for one operation during transition
- writing proxy routes with no central policy reason

## 19. Anti-Patterns

- "temporary raw fetch is harmless"
- "the proxy can exist just in case"

## 20. Handoff To Next Phase

Deliver:

- explicit canonical binding chains
- proxy necessity evidence when relevant

Next lawful file: `PHASE_22_RUNTIME_TRUTH_LOCK.md`