# 01_SOURCE_TRACE

## Confirmed Source Inputs

### Target repo inputs

- `docs/services/dsh/00_SERVICE_PROFILE.md`
- `docs/services/dsh/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/dsh/03_SURFACE_MATRIX.csv`
- `docs/services/dsh/04_PRIMARY_FLOW_NOTES.md`
- `docs/services/00_SERVICE_BUILD_ORDER.md`

### Donor repo inputs

- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_SERVICE_SCOPE.md`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_UX_FLOW.md`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_COVERAGE_MATRIX.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_RBAC_MATRIX.csv`
- `services/dsh/governance/internal ops section map`, normalized locally as `DSH_CONTROL_PANEL_SECTION_MAP.csv`

## Confirmed Facts

- the local normalized donor readout spans `app-client`, `app-captain`, `app-partner`, `app-field`, and `control-panel`
- donor coverage data shows customer, captain, partner, field, and internal ops participation across real DSH operations
- donor internal-ops mappings place DSH handling primarily under operational oversight routes, which normalize to `control-panel`
- current target bootstrap surface matrix already locks `app-client`, `app-partner`, `app-captain`, and `control-panel` as `REQUIRED` and `app-field` as `OPTIONAL`
- current target bootstrap flow places customer entry in `app-client`, partner work in `app-partner`, captain execution in `app-captain`, optional support in `app-field`, and internal oversight in `control-panel`

## Inferred But Controlled Conclusions

- `webapp` and `website` remain outside current DSH first-service ownership because no reviewed DSH evidence makes them core entry surfaces
- finance-only work is not a DSH actor context because governance already isolates money-moving ownership through `WLT`
