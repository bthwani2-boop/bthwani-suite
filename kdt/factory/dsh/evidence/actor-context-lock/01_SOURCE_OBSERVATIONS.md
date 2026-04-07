# 01_SOURCE_OBSERVATIONS

## Donor Observations Used

- `DSH_SERVICE_SCOPE.md` confirms customer, captain, partner, field, and internal ops participation across the donor DSH scope
- `DSH_COVERAGE_MATRIX.csv` confirms customer-only, captain-only, partner-only, field-plus-internal-ops, and customer-plus-internal-ops coverage patterns across real operations
- `DSH_RBAC_MATRIX.csv` confirms concrete surface assignments for customer, captain, partner, and field actions
- `DSH_CONTROL_PANEL_SECTION_MAP.csv` is the local normalized alias used for the donor internal ops section map that feeds `control-panel` normalization
- `DSH_UX_FLOW.md` confirms customer-first order creation and captain execution as core path anchors

## Target Observations Used

- bootstrap DSH surface matrix already marks `app-client`, `app-partner`, `app-captain`, and `control-panel` as `REQUIRED`
- bootstrap DSH surface matrix already marks `app-field` as `OPTIONAL`
- bootstrap DSH flow already places customer, partner, captain, field support, and ops in a coherent order
