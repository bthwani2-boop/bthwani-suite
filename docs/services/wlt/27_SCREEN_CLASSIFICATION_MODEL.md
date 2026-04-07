# Screen Classification Model - wlt

## Goal
- classify every screen into deterministic execution groups to remove ambiguity in wave placement.

## Classification Rules
- control-panel -> control_finance_ops
- app-client -> client_wallet_flow
- app-partner -> partner_wallet_flow
- app-captain -> captain_wallet_flow
- app-field -> field_wallet_flow

## Wave Mapping
- client_wallet_flow -> W01_CLIENT_FOUNDATION
- partner/captain/field wallet flows -> W02_PARTNER_CAPTAIN_FIELD
- control_finance_ops -> W03_CONTROL_FINANCE

## Execution Strategy
- contract_first_binding_first for control-panel finance operations
- rebuild_clean_ui_first for mobile consumer and operator surfaces
