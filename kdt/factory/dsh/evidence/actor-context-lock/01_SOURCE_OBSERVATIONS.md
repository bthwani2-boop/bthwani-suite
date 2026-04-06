# 01_SOURCE_OBSERVATIONS

## Donor Observations Used

- `DSH_SERVICE_SCOPE.md` confirms APP_USER, APP_CAPTAIN, APP_PARTNER, APP_FIELD, and MCPW as DSH-relevant actors or surfaces
- `DSH_COVERAGE_MATRIX.csv` confirms customer-only, captain-only, partner-only, field-plus-MCPW, and customer-plus-MCPW coverage patterns across real operations
- `DSH_RBAC_MATRIX.csv` confirms concrete surface assignments such as APP_USER for `dsh_checkout_gate`, APP_CAPTAIN for captain job actions, APP_PARTNER for partner actions, and APP_FIELD for field actions
- `DSH_MCPW_SECTION_MAP.csv` confirms DSH internal routes live under MCPW operational sections, normalized to `control-panel`
- `DSH_UX_FLOW.md` confirms customer-first order creation and captain execution as core path anchors

## Target Observations Used

- bootstrap DSH surface matrix already marks `app-client`, `app-partner`, `app-captain`, and `control-panel` as `REQUIRED`
- bootstrap DSH surface matrix already marks `app-field` as `OPTIONAL`
- bootstrap DSH flow already places customer, partner, captain, field support, and ops in a coherent order
