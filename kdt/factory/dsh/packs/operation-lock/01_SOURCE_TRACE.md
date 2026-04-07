# 01_SOURCE_TRACE

## Confirmed Target Inputs

- `kdt/factory/dsh/exports/actor-context-lock/ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/dsh/00_SERVICE_PROFILE.md`
- `docs/services/dsh/02_OPERATIONS_CATALOG.csv`
- `docs/services/dsh/03_SURFACE_MATRIX.csv`
- `docs/services/dsh/04_PRIMARY_FLOW_NOTES.md`

## Confirmed Donor Inputs

- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_OPERATION_CATALOG.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_TRACEABILITY.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_UX_FLOW.md`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_COVERAGE_MATRIX.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_RBAC_MATRIX.csv`
- `services/dsh/governance/internal ops section map`, normalized locally as `DSH_CONTROL_PANEL_SECTION_MAP.csv`

## Confirmed Facts

- donor DSH contains rich raw operation coverage across customer, partner, captain, field, and internal ops
- donor DSH UX explicitly locks a simple visible order status set: `pending`, `accepted`, `in_delivery`, `completed`, `cancelled`
- donor DSH includes customer checkout, partner order handling, captain execution, field support, and internal control-plane actions
- current target DSH actor lock already excludes `webapp` and `website` from first-service DSH ownership

## Controlled Inferences

- canonical DSH operations in the target repo should be operation families, not a verbatim copy of every donor endpoint
- any operation whose real ownership is money movement must remain outside DSH ownership and route through `WLT`
- internal DSH ops actions belong to `control-panel`, not to a separate admin app root
