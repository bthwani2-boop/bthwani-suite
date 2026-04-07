# Screen Classification Model - dsh

## Goal
- classify every screen into deterministic execution groups to remove ambiguity in wave placement.

## Classification Rules
- control-panel + proxy/shein keywords -> control_proxy_ops
- control-panel non-proxy -> control_general_ops
- app-client discovery/commerce keywords -> client_discovery_commerce
- app-client proxy/shein keywords -> client_proxy_flow
- app-client lifecycle keywords (order/delivery/checkout/pricing/promo/review/loyalty/subscription) -> client_order_lifecycle
- app-partner -> partner_ops
- app-captain -> captain_ops
- app-field -> field_ops
- shared surface -> shared_components

## Wave Mapping
- client_discovery_commerce + shared_components -> W01_FIRST_ACTIVE_BUNDLE
- client_proxy_flow + client_order_lifecycle -> W02_PROXY_USER_FLOW
- control_proxy_ops + control_general_ops -> W03_CONTROL_PANEL_PROXY
- partner_ops + captain_ops + field_ops -> W04_CAPTAIN_AND_PARTNER_SUPPORT

## Execution Strategy
- contract_first_binding_first for proxy-related groups
- rebuild_clean_ui_first for normal surface groups
- extract_partial_then_rebuild_clean for shared components
