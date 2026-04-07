# W04_GOVERNANCE_AND_PROXY

## Objective

Open the proxy exception branch and the narrow control-panel governance layer.

## Included Screens

- `dsh_client_proxy_request_entry`
- `dsh_client_proxy_request_tracking`
- `dsh_partner_order_issue_queue`
- `dsh_ops_orders_board`
- `dsh_ops_order_detail_exception_workspace`
- `dsh_ops_peak_mode_control`
- `dsh_proxy_requests_list`
- `dsh_proxy_request_review_workspace`

## Required Before Open

- W02 closed for issue handling
- W03 closed for downstream execution visibility
- proxy branch kept separate from the mainline order flow

## Forbidden Scope Drift

- no broad admin shell growth
- no partner or captain execution copied into `control-panel`

## Closure Rule

W04 closes only when governance remains oversight-only and proxy remains a separate exception chain.