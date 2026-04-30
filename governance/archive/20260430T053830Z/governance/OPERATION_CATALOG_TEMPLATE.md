# OPERATION_CATALOG_TEMPLATE

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 05 - Master Foundation Minimal`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 05 active`
- BlockingGaps: `No service-specific operation catalogs are finalized yet`
- NextAllowed: `Use this template for later service operation work`

## Required Fields

Every canonical operation record should capture at least:

- `operation_id`
- `service_slug`
- `operation_name`
- `purpose`
- `primary_actor`
- `secondary_actor`
- `surface_scope`
- `state_effect`
- `source_status` (`observed`, `inferred`, `approved`)
- `contract_status`
- `notes`

## Rule

- one operation must map to one service owner
- one operation must not spawn multiple competing binding chains later
- service operation truth must be defined before contract finalization
