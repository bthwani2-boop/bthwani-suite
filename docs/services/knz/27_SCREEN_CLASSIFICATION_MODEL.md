# Screen Classification Model - knz

## Goal
- classify every screen into deterministic execution groups to remove ambiguity in wave placement.

## Classification Rules
- control-panel moderation/report/listing governance keywords -> control_moderation_ops
- control-panel non-moderation -> control_general_ops
- app-client discovery keywords -> client_market_discovery
- app-client listing/auction/deal/chat/rating/promotion keywords -> client_market_actions
- app-client other flows -> client_misc
- app-partner -> partner_ops
- app-captain -> captain_ops
- app-field -> field_ops
- shared surface -> shared_components

## Wave Mapping
- client_market_discovery + shared_components -> W01_FIRST_ACTIVE_BUNDLE
- client_market_actions -> W02_MARKETPLACE_FLOW
- control_general_ops -> W03_CONTROL_PANEL_CORE
- client_misc + control_moderation_ops + partner_ops + captain_ops + field_ops -> W04_SUPPORT_AND_MODERATION

## Execution Strategy
- contract_first_binding_first for moderation-governed groups
- rebuild_clean_ui_first for normal surface groups
- extract_partial_then_rebuild_clean for shared components
