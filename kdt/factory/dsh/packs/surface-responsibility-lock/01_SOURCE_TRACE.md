# 01_SOURCE_TRACE

## Confirmed Source Inputs

### Target repo inputs

- `docs/services/dsh/03_SURFACE_MATRIX.csv`
- `kdt/factory/dsh/exports/actor-context-lock/ACTOR_CONTEXT_MATRIX.csv`
- `kdt/factory/dsh/exports/operation-lock/OPERATIONS_CATALOG.csv`
- `kdt/factory/dsh/packs/operation-lock/02_STATUS_LIFECYCLE.md`

### Donor repo inputs

- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_SERVICE_SCOPE.md`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_COVERAGE_MATRIX.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_RBAC_MATRIX.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_MCPW_SECTION_MAP.csv`

## Confirmed Facts

- current target `dsh` lock already keeps `app-client`, `app-partner`, `app-captain`, and `control-panel` as core surfaces
- current target `dsh` lock keeps `app-field` optional and keeps `webapp` and `website` out
- current canonical operation lock exports 13 DSH operation families rather than the full donor operation list
- donor RBAC still ties real action invocation to concrete app surfaces rather than to a generic mirrored admin layer
- donor MCPW routing shows a broad internal route umbrella for many DSH operations, but that route cluster does not by itself prove clean internal ownership for every family

## Controlled Conclusions

- mirrored state visibility must not be treated as operation ownership
- customer entry families stay in `app-client` unless donor evidence proves a true dual-surface operation
- partner and captain action families remain in their own surfaces even when internal ops can observe outcomes
- `control-panel` is retained for explicit internal governance and proxy-flow handling only

## Rejected Carryover

- blanket donor MCPW mirroring for nearly all DSH operations is rejected for the clean target model
- donor per-endpoint sprawl is not re-expanded after Phase 09 compaction into canonical families
- donor naming such as `APP_USER` and `MCPW` does not leak into target outputs beyond source trace