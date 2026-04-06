# DSH Journey Lock Request

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 11 - Journey Lock`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `accepted from Phase 10 baseline`
- BlockingGaps: `Screen Inventory And Rationalization remains the next downstream phase`
- NextAllowed: `Phase 12 - Screen Inventory And Rationalization`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- define the lawful DSH journeys before any screen inventory work
- lock one primary customer-to-delivery path
- lock the partner, captain, ops, and optional field staff paths
- lock failure, recovery, and unavailable paths without creating screens
- preserve clean service boundaries and keep finance truth outside DSH

## Required Inputs

- `docs/services/dsh/04_PRIMARY_FLOW_NOTES.md`
- `kdt/factory/dsh/exports/surface-responsibility-lock/OPERATION_SURFACE_COVERAGE.csv`
- `kdt/factory/dsh/exports/surface-responsibility-lock/SURFACE_MATRIX.csv`
- donor DSH UX flow, traceability, and service-scope evidence

## Required Outputs

- primary flow map
- staff flow map
- failure/recovery flow map
- flow risks
- target-fit summary