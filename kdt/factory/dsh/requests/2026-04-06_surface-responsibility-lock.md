# DSH Surface Responsibility Lock Request

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 10 - Surface Responsibility Lock`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `accepted from Phase 09 baseline`
- BlockingGaps: `Journey Lock remains the next downstream phase`
- NextAllowed: `Phase 11 - Journey Lock`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- lock where each canonical DSH operation family lives
- mark each clean surface as `REQUIRED`, `OPTIONAL`, or `OUT` per operation
- define the current surface activation order and current wave model explicitly
- declare thin shell readiness expectations without opening preview yet
- preserve only evidence-backed multi-surface coverage
- reject donor blanket control-panel mirroring where no distinct internal operation exists
- keep `webapp` and `website` outside current `dsh` first-service ownership

## Required Inputs

- `kdt/factory/dsh/exports/actor-context-lock/ACTOR_CONTEXT_MATRIX.csv`
- `kdt/factory/dsh/exports/operation-lock/OPERATIONS_CATALOG.csv`
- `docs/services/dsh/03_SURFACE_MATRIX.csv`
- donor DSH coverage, RBAC, CONTROL_PANEL section, and service-scope evidence

## Required Outputs

- clean surface matrix
- surface activation plan
- operation surface coverage matrix
- source trace summary
- target-fit summary
- evidence index