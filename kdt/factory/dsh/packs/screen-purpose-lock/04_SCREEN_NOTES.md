# 04_SCREEN_NOTES

## Executive Verdict

The accepted Phase 12 DSH screen set is now stabilized into one canonical Phase 13 screen family model without reopening screen count inflation.

## Client Screen Notes

- `dsh_client_entry_discovery_home` and `dsh_client_category_or_store_detail` remain separate because entry and concrete selection are different jobs and should not compete on one surface.
- `dsh_client_cart_review` and `dsh_client_checkout_confirm` remain distinct so cart editing does not dilute the single submit intent.
- `dsh_client_active_order_tracking` stays observational and retains chat as a companion instead of a route.
- proxy customer entry and proxy customer tracking remain a narrow exception family and do not collapse back into generic order tracking.

## Partner Screen Notes

- partner handling stays compressed into one active workspace even though donor evidence split the step sequence across multiple screens.
- partner store maintenance remains separate because it repairs readiness and then returns to the main workspace.
- partner issue queue remains internal only and does not become a partner primary navigation destination.

## Captain Screen Notes

- captain offer acceptance remains the lawful entry family and does not merge into in-delivery execution.
- captain execution remains one workspace even when donor step variants split acceptance pickup and delivery.
- proof capture remains explicit because completion confidence is a different gate from normal execution progression.

## Field And Internal Ops Notes

- `dsh_field_activation_workspace` remains optional support only and does not justify a broader app-field route tree.
- `dsh_ops_orders_board` remains the single internal ops entry board and does not mirror partner or captain execution screens.
- proxy governance remains a separate internal review family with list and review workspace rather than being buried inside a generic ops detail view.

## Merge And Conversion Notes

- donor split variants are absorbed into canonical owners and do not survive as standalone clean routes.
- converted chat geo-pin visit-log schedule handoff and reject items stay subordinate to canonical owners.
- state-only items remain local to the owning canonical screens and do not reopen route count.

## Anti-Pattern Prevention

- do not turn observational tracking screens into action-heavy task screens
- do not let control-panel become a second partner or captain app
- do not recreate donor route splits just because fixture work later exposes more local states