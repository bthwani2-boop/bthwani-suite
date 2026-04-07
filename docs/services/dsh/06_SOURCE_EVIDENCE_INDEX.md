# 06_SOURCE_EVIDENCE_INDEX

## Mandatory Header

- WorkMode: `REFERENCE-ONLY MODE`
- CurrentPhase: `Phase 09 complete; Phase 10 next`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `source evidence indexed and normalized for the phase 07-09 rerun`
- BlockingGaps: `Some donor master files remain broad support evidence and later screen-flow appendices remain downstream references only`
- NextAllowed: `Use this index while preparing Phase 10 - Surface Responsibility Lock`

## Evidence Tiers

## Tier 1 - Primary Donor DSH Service Evidence

- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_SERVICE_SCOPE.md` - donor service boundary, actor, and surface statement
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_OPERATION_CATALOG.csv` - donor service catalog; service-scope files claim `92` while the captured local appendix currently carries `98` rows
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_COVERAGE_MATRIX.csv` - donor operation-to-surface coverage
- `services/dsh/governance/internal ops section map` - donor internal ops section map, normalized locally as `DSH_CONTROL_PANEL_SECTION_MAP.csv` for dossier consistency
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_RBAC_MATRIX.csv` - donor role and access evidence
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_UX_FLOW.md` - donor journey compression intent
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_TRACEABILITY.csv` - donor traceability appendix and implementation evidence
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_UNIFIED_OPERATIONS_REFERENCE.csv` - donor wrapper-operation map outside the `92`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_SERVICE_SEAL_STATUS.yaml` - donor subsystem seal and implementation-claim file

## Tier 2 - Donor Master Support Evidence

- `C:\Users\b\Documents\GitHub\bthfinal\contracts\master\Master_OpenAPI.yaml` - donor sovereign API contract source
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\operations_inventory.json` - donor global operation inventory containing `dsh_*`
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\ui\Master_SCREENS_CATALOG.csv` - donor global screen universe
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\trace\Master_TRACEABILITY.csv` - donor cross-service trace support file
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\routing\Master_SURFACE_ROUTE_MAP.json` - donor route and surface reference map
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\rbac\RBAC_MATRIX.csv` - donor global RBAC support evidence
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\rbac\ABAC_MATRIX.csv` - donor global ABAC support evidence
- `C:\Users\b\Documents\GitHub\bthfinal\contracts\runtime\Master_RUNTIME_VARS_CATALOG.csv` - donor global runtime variable register

## Tier 3 - Current Target Normalization Inputs

- `kdt/factory/dsh/exports/actor-context-lock/ACTOR_CONTEXT_MATRIX.csv` - current normalized actor truth
- `kdt/factory/dsh/exports/operation-lock/OPERATIONS_CATALOG.csv` - current normalized operation-family truth
- `kdt/factory/dsh/exports/surface-responsibility-lock/SURFACE_MATRIX.csv` - current normalized surface truth
- `kdt/factory/dsh/exports/surface-responsibility-lock/OPERATION_SURFACE_COVERAGE.csv` - current family-to-surface mapping
- `kdt/factory/dsh/exports/journey-lock/PRIMARY_FLOW_MAP.csv` - current primary and fast path map
- `kdt/factory/dsh/exports/journey-lock/STAFF_FLOW_MAP.csv` - current staff flow map
- `kdt/factory/dsh/exports/journey-lock/FAILURE_RECOVERY_FLOW_MAP.csv` - current failure and recovery map
- `kdt/factory/dsh/exports/screen-inventory-and-rationalization/SCREEN_CATALOG.csv` - current candidate screen inventory
- `kdt/factory/dsh/exports/screen-purpose-lock/CANONICAL_SCREEN_CATALOG.csv` - current canonical screen set
- `kdt/factory/dsh/exports/screen-purpose-lock/SCREEN_PURPOSE_LOCK.csv` - current purpose and CTA lock

## Source Handling Rule

- Tier 1 files are the highest-value donor service evidence
- Tier 2 files are support evidence and must not overrule the clean target model by themselves
- Tier 3 files are the active normalized truth for the target repo
- when Tier 1 and Tier 2 conflict, donor conflict is recorded and not hidden
- when Tier 1 conflicts with Tier 3 because of clean normalization, Tier 3 wins for target-repo adoption
- local dossier aliases normalize the donor customer surface to `app-client` and the donor internal ops surface to `control-panel`; the frozen donor repo remains the source of exact historical basenames