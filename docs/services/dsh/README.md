# DSH Service Dossier

## Mandatory Header

- WorkMode: `BOOTSTRAP GATE REVIEW MODE`
- CurrentPhase: `Phase 07 sealed baseline with downstream reference appendices retained`
- TargetService: `dsh`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `files 00-05 now carry the active Phase 07 foundation; files 06-24 remain reference appendices only`
- BlockingGaps: `Phase 08 and all later post-bootstrap phases remain downstream`
- NextAllowed: `Use files 00-05 for Phase 07 handoff and consult files 06-24 only when their lawful phases open`

## Purpose

This directory is the stable DSH dossier for the active target repo.

It now consolidates:

- the active Phase 07 service-foundation baseline in files `00` through `05`
- donor service evidence from `bthfinal`
- current normalized DSH truth from `kdt/factory/dsh/`
- explicit drift and contradiction notes instead of hiding them

## Current Snapshot

- donor service-scope claim: `92` in-scope `dsh_*` operations
- donor catalog rows captured in the local appendix: `98`
- donor operation dossier directories physically present: `96`
- donor route-binding rows captured: `94`
- donor unified wrapper operations tied to DSH but outside the claimed `92`: `5`
- current normalized operation families in target repo: `13`
- downstream reference screen candidates retained in the dossier: `43`
- downstream reference canonical screens retained in the dossier: `20`
- current normalized operation/surface coverage rows: `17`

Files `09` through `24` are retained as downstream reference appendices.
Files `00` through `05` are the active Phase 07 baseline.
Files `06` through `24` remain available for later-phase reference, but they do not count as bootstrap completion proof.

## File Map

1. `00_SERVICE_PROFILE.md` - Phase 07 service identity, role, dependencies, risks, and boundary lock
2. `01_ACTOR_CONTEXT_MATRIX.csv` - Phase 07 actor and context foundation
3. `02_OPERATIONS_CATALOG.csv` - Phase 07 DSH operation families at foundation depth
4. `03_SURFACE_MATRIX.csv` - Phase 07 surface participation and classification
5. `04_PRIMARY_FLOW_NOTES.md` - Phase 07 primary flow and bootstrap handoff notes
6. `05_NON_GOALS.md` - Phase 07 exclusions and phase-boundary guardrails
7. `06_SOURCE_EVIDENCE_INDEX.md` - exact donor and target evidence set used here
8. `07_STATUS_AND_SCOPE_AUDIT.md` - numeric audit, contradictions, and readiness summary
9. `08_OPERATION_SURFACE_COVERAGE.csv` - normalized family-to-surface mapping
10. `09_SCREEN_CATALOG.csv` - full current DSH candidate inventory
11. `10_CANONICAL_SCREEN_CATALOG.csv` - accepted canonical screen set
12. `11_SCREEN_PURPOSE_LOCK.csv` - purpose and CTA lock for canonical screens
13. `12_PRIMARY_FLOW_MAP.csv` - normalized happy path and fast path map
14. `13_STAFF_FLOW_MAP.csv` - partner, captain, ops, and field flow map
15. `14_FAILURE_RECOVERY_FLOW_MAP.csv` - failure and recovery map
16. `15_DONOR_OPERATION_INVENTORY.csv` - donor `98`-row catalog appendix with the scope contradiction preserved
17. `16_DONOR_UNIFIED_OPERATIONS_REFERENCE.csv` - donor wrapper-operation appendix outside the claimed `92`
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