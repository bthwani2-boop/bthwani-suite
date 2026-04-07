# W02_ORDER_VISIBILITY_AND_PARTNER_ENTRY

## Objective

Open the first downstream visibility after submission and the partner entry path.

## Included Screens

- `dsh_client_active_order_tracking`
- `dsh_partner_orders_board`
- `dsh_partner_order_workspace`

## Required Before Open

- W01 closed
- tracking lifecycle states explicit
- partner queue and workspace split explicit

## Forbidden Scope Drift

- no partner store maintenance inside the partner order workspace
- no control-panel mirrored execution

## Closure Rule

W02 closes only when customer visibility and partner action ownership are both explicit and separate.