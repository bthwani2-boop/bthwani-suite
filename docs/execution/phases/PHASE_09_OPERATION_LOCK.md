# PHASE_09_OPERATION_LOCK

## 1. Purpose

Lock the official operation set before screen growth begins.

## 2. Why This Phase Exists

This phase prevents screens, routes, and contract work from inventing or duplicating business operations.

## 3. Preconditions / Entry Conditions

- actor and visibility rules are explicit enough to define ownership
- the service profile is stable enough to express primary jobs

## 4. Inputs

- service profile
- actor/context lock pack
- baseline operations catalog
- generic screen execution runbook

## 5. Allowed Work

- define operation names
- define operation families
- define owners and primary surfaces
- define state effects at operation level
- define lifecycle notes where relevant

## 6. Forbidden Work

- screen implementation
- route design
- contract expansion
- duplicate operations under multiple names

## 7. Exact Execution Order

1. open the `operation-lock` request
2. review the service profile and actor-context result
3. list candidate operations as verb phrases tied to service truth
4. remove duplicates and split merged intents where necessary
5. assign one owner and primary surface set per operation
6. write lifecycle notes when the service has a real status flow
7. write the pack and export the catalog

## 8. Required Decisions

- which operations are in scope
- which operation names are canonical
- which operation families exist
- who owns each operation

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_operation-lock.md`
- `kdt/factory/<service>/packs/operation-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/operation-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/operation-lock/02_OPERATIONS_CATALOG.csv`
- `kdt/factory/<service>/packs/operation-lock/03_STATUS_LIFECYCLE.md`
- `kdt/factory/<service>/packs/operation-lock/04_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/operation-lock/05_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/operation-lock/OPERATIONS_CATALOG.csv`
- `kdt/factory/<service>/index/OPERATION_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`02_OPERATIONS_CATALOG.csv` must include at least:

- `operation_key`
- `operation_family`
- `primary_actor`
- `primary_surfaces`
- `service_purpose`
- `source_status`
- `source_trace`

`03_STATUS_LIFECYCLE.md` must define:

- major lifecycle stages when applicable
- state transitions that matter before screens exist
- what is not a real lifecycle state

## 11. Cross-File Updates

- align `docs/services/<service>/02_OPERATIONS_CATALOG.csv` with the stronger phase output when needed

## 12. Surface Impact

- surfaces are not yet sequenced visually, but operation ownership now constrains where they may appear

## 13. UI Kit Impact

- no direct UI Kit work is allowed

## 14. Contract Impact

- this phase prepares later contract demand, but no contract work starts yet

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- every critical operation has one owner
- operation names are canonical and non-duplicative
- operations expose real service truth or transitions

## 17. Exit Criteria

- operation truth is stable enough to support surface responsibility work

## 18. Failure Modes / Common Mistakes

- naming one operation for two unrelated business intents
- preserving donor names that are no longer clean
- keeping navigation-only behavior as an operation

## 19. Anti-Patterns

- "we can clean the operations after screens exist"
- "the donor endpoints already define the operation model"

## 20. Handoff To Next Phase

Deliver:

- canonical operation set
- lifecycle notes where relevant

Next lawful file: `PHASE_10_SURFACE_RESPONSIBILITY_LOCK.md`