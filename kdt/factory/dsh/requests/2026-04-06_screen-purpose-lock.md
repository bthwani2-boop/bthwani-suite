# DSH Canonical Families And Screen Purpose Lock Request

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 13 - Canonical Families And Screen Purpose Lock`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `ready to package`
- BlockingGaps: `Phase 14 flow compression remains open and later state coverage work remains downstream`
- NextAllowed: `Phase 14 - Flow Compression`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- stabilize the accepted Phase 12 DSH canonical screen set into explicit screen families
- assign one clear primary CTA per canonical screen or an explicit no-primary-CTA reason
- attach converted companions inline steps and state-only items to their owning canonical screens
- keep donor spillover out of the clean DSH screen tree

## Current Target Context

- related thin shells already exist under `apps/mobile/*/src/shell/` and `apps/web/control-panel/src/shell/`
- Phase 12 preview route registries already exist under `packages/surfaces/src/dsh/`
- no Phase 13 pack exists yet under `kdt/factory/dsh/`

## Required Inputs

- `kdt/factory/dsh/exports/screen-inventory-and-rationalization/SCREEN_CATALOG.csv`
- `kdt/factory/dsh/packs/screen-inventory-and-rationalization/03_SCREEN_RATIONALIZATION_REPORT.md`
- `kdt/factory/dsh/exports/operation-lock/OPERATIONS_CATALOG.csv`
- `kdt/factory/dsh/exports/journey-lock/PRIMARY_FLOW_MAP.csv`
- `kdt/factory/dsh/exports/journey-lock/STAFF_FLOW_MAP.csv`
- `kdt/factory/dsh/exports/journey-lock/FAILURE_RECOVERY_FLOW_MAP.csv`
- `kdt/factory/dsh/exports/surface-responsibility-lock/SURFACE_MATRIX.csv`

## Required Outputs

- canonical screen catalog
- screen purpose lock
- screen notes
- state notes
- target-fit summary
- implant guide
- evidence index