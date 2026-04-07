# W03_CONTROL_PANEL_PROXY

1. Wave Identity: W03_CONTROL_PANEL_PROXY
2. Wave Goal: Deliver scoped bundle for W03_CONTROL_PANEL_PROXY with gate-based progression.
3. Why This Wave Exists: isolate risk and enforce ordered execution by queue.
4. Included Screen Bundles: admin_dsh_store_items_list_screen | arrival_bell_settings_screen | dsh_cart_item_add_screen | dsh_delivery_reassign_screen | dsh_finance_dsh | dsh_operations_dsh | dsh_operations_dsh_arrival-bell | dsh_operations_dsh_orders | dsh_operations_dsh_orders_[id] | dsh_operations_dsh_peak-mode | dsh_operations_dsh_reassign | dsh_operations_dsh_sheinproxy | dsh_operations_dsh_sheinproxy_[id] | dsh_operations_dsh_sheinproxy_[id]_estimate | dsh_operations_dsh_sheinproxy_[id]_offer | dsh_operations_dsh_sheinproxy_[id]_schedule | dsh_operations_dsh_zone-set | dsh_operations_hub_surface | dsh_operations_screen | dsh_order_detail_screen | dsh_orders_screen | dsh_peak_mode_screen | dsh_service-catalog_services_dsh | dsh_zone_set_screen | shein-proxy-request-details | shein-proxy-request-estimate | shein-proxy-request-estimate-and-offer | shein-proxy-request-offer | shein-proxy-request-schedule | shein-proxy-requests-list
5. Included Operation Families: proxy_ops_control
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/dsh | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all wave items reaching close-ready state.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.
