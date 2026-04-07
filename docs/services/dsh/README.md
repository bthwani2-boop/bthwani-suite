# DSH Service Dossier

## Mandatory Header

- WorkMode: `TARGET-FIT MODE`
- CurrentPhase: `Phase 13 complete; Phase 14 next`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `stable docs layer refreshed from donor evidence and current normalized packs`
- BlockingGaps: `Phase 14 flow compression remains open; contract, binding, runtime, and closure phases remain downstream`
- NextAllowed: `Use this dossier to drive Phase 14 - Flow Compression only`

## Purpose

This directory is the stable DSH dossier for the active target repo.

It now consolidates:

- donor service evidence from `bthfinal`
- current normalized DSH truth from `kdt/factory/dsh/`
- the current lawful phase position in `bthwani-suite`
- explicit drift and contradiction notes instead of hiding them

## Current Snapshot

- donor DSH service scope: `92` `dsh_*` operations
- donor DSH operation dossiers: `92`
- donor unified wrapper operations tied to DSH but outside the `92`: `5`
- current normalized operation families in target repo: `13`
- current normalized screen candidates in target repo: `43`
- current canonical screens in target repo: `20`
- current normalized operation/surface coverage rows: `17`

## File Map

1. `00_SERVICE_PROFILE.md` - current DSH identity, boundaries, counts, and phase status
2. `01_ACTOR_CONTEXT_MATRIX.csv` - normalized actor and context truth
3. `02_OPERATIONS_CATALOG.csv` - normalized DSH operation families
4. `03_SURFACE_MATRIX.csv` - normalized surface ownership truth
5. `04_PRIMARY_FLOW_NOTES.md` - service flow summary and route rules
6. `05_NON_GOALS.md` - current DSH exclusions and deferred areas
7. `06_SOURCE_EVIDENCE_INDEX.md` - exact donor and target evidence set used here
8. `07_STATUS_AND_SCOPE_AUDIT.md` - numeric audit, contradictions, and readiness summary
9. `08_OPERATION_SURFACE_COVERAGE.csv` - normalized family-to-surface mapping
10. `09_SCREEN_CATALOG.csv` - full current DSH candidate inventory
11. `10_CANONICAL_SCREEN_CATALOG.csv` - accepted canonical screen set
12. `11_SCREEN_PURPOSE_LOCK.csv` - purpose and CTA lock for canonical screens
13. `12_PRIMARY_FLOW_MAP.csv` - normalized happy path and fast path map
14. `13_STAFF_FLOW_MAP.csv` - partner, captain, ops, and field flow map
15. `14_FAILURE_RECOVERY_FLOW_MAP.csv` - failure and recovery map
16. `15_DONOR_OPERATION_INVENTORY.csv` - donor `92`-operation appendix
17. `16_DONOR_UNIFIED_OPERATIONS_REFERENCE.csv` - donor wrapper-operation appendix
18. `17_DONOR_MASTER_REFERENCES.md` - DSH-related donor master files and how to use them safely
19. `18_DONOR_IMPLEMENTATION_AND_DRIFT_AUDIT.md` - donor implementation facts, contradictions, and anti-patterns
20. `19_DONOR_REPO_DSH_FILE_CENSUS.csv` - exhaustive donor file census for all direct DSH-related files
21. `20_DONOR_OPERATION_ROW_AUDIT.csv` - row-by-row donor operation audit across inventory, dossiers, traceability, and target mapping
22. `21_DONOR_ROUTE_BINDING_CENSUS.csv` - donor route and screen-binding census from all operation dossiers
23. `22_DONOR_UI_FILE_TO_TARGET_MAPPING.csv` - donor UI files mapped to current target candidate or canonical screens where possible
24. `23_DONOR_OMISSION_CONTROL_REPORT.md` - explicit omission-control report, contradiction list, and census summary
25. `24_UNMAPPED_OR_REVIEW_REQUIRED_ITEMS.csv` - explicit unresolved donor items file; empty means no unresolved rows remain after the current audit pass

## Precision Rule

Where donor evidence agrees, this dossier records confirmed fact.
Where donor evidence conflicts, this dossier records the conflict explicitly and does not promote a false single truth.
Where current target normalization intentionally rejects donor sprawl, this dossier keeps the clean target model and records the rejected carryover separately.