# 10_SCREEN_WAVES

## Wave Set

- `W00_FOUNDATION`
  - scope: handoff, target-fit, queue stabilization
- `W01_CLIENT_ENTRY_AND_CHECKOUT`
  - screens: `dsh_client_entry_discovery_home`, `dsh_client_category_or_store_detail`, `dsh_client_cart_review`, `dsh_client_checkout_confirm`
- `W02_ORDER_VISIBILITY_AND_PARTNER_ENTRY`
  - screens: `dsh_client_active_order_tracking`, `dsh_partner_orders_board`, `dsh_partner_order_workspace`
- `W03_STORE_AND_CAPTAIN_EXECUTION`
  - screens: `dsh_partner_store_maintenance_workspace`, `dsh_captain_offers_list`, `dsh_captain_execution_workspace`, `dsh_captain_proof_capture`
- `W04_GOVERNANCE_AND_PROXY`
  - screens: `dsh_client_proxy_request_entry`, `dsh_client_proxy_request_tracking`, `dsh_partner_order_issue_queue`, `dsh_ops_orders_board`, `dsh_ops_order_detail_exception_workspace`, `dsh_ops_peak_mode_control`, `dsh_proxy_requests_list`, `dsh_proxy_request_review_workspace`
- `W05_FIELD_SUPPORT_OPTIONAL`
  - screens: `dsh_field_activation_workspace`
- `W08_BINDING_AND_CONTRACT`
  - scope: viewmodels, service methods, contract deltas, binding targets
- `W09_RUNTIME_AND_PROOF`
  - scope: runtime target class and proof execution

## Wave Law

- no wave may skip Gate A, Gate B, or Gate C
- no later wave may open because a donor route exists
- W08 and W09 remain documentation and target-planning only until earlier waves are sealed