# Screen Waves - dsh

## Coverage Summary
- W01_FIRST_ACTIVE_BUNDLE: screens=29 | groups=[client_discovery_commerce=14; shared_components=15]
- W02_PROXY_USER_FLOW: screens=45 | groups=[client_order_lifecycle=41; client_proxy_flow=4]
- W03_CONTROL_PANEL_PROXY: screens=30 | groups=[control_general_ops=19; control_proxy_ops=11]
- W04_CAPTAIN_AND_PARTNER_SUPPORT: screens=65 | groups=[captain_ops=15; client_misc=9; field_ops=3; partner_ops=38]

## Deterministic Mapping
- W01_FIRST_ACTIVE_BUNDLE: discovery/commerce + shared components
- W02_PROXY_USER_FLOW: app-client proxy + lifecycle flows
- W03_CONTROL_PANEL_PROXY: control-panel operational flows
- W04_CAPTAIN_AND_PARTNER_SUPPORT: partner/captain/field execution bundles
- W08_BINDING_AND_CONTRACT: binding and contract closure stage
- W09_RUNTIME_AND_PROOF: runtime/proof closure stage

## Rule Source
- 27_SCREEN_CLASSIFICATION_MODEL.md
- 28_SCREEN_GROUP_MATRIX.csv
