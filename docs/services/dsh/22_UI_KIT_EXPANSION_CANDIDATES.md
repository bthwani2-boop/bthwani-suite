# DSH UI Kit Expansion Candidates (Wave 1)

Status: SEEDED
Scope: app-client create/review/tracking/orders-list
Updated At: 2026-04-08

## Candidate Patterns

- candidate_id: ui_review_compact_block
  source_screen: SCR_W1_003 (dsh_review_order_screen)
  need: compact review block with 2-column key/value rhythm
  reason: keeps review short and decision-focused
  priority: high

- candidate_id: ui_bottom_action_bar_dual_cta
  source_screen: SCR_W1_003 (dsh_review_order_screen)
  need: primary/secondary action bar with stable spacing and safe tap zones
  reason: submit/edit click budget should stay predictable
  priority: high

- candidate_id: ui_tracking_timeline_step_block
  source_screen: SCR_W1_005 (dsh_tracking_screen)
  need: standardized timeline step block with done/pending status chip
  reason: tracking summary must be readable in seconds
  priority: high

- candidate_id: ui_tracking_delay_support_state
  source_screen: SCR_W1_005 (dsh_tracking_screen)
  need: warning state variant with support and retry affordance
  reason: delayed/no-captain states recur and need consistency
  priority: high

- candidate_id: ui_order_list_item_compact
  source_screen: SCR_W1_006 (dsh_orders_list_screen)
  need: compact order list item with title/subtitle/meta/status
  reason: returning-user flow needs repeatable list readability
  priority: medium

## Notes

- Screen/API matrix dependency to register later:
  - SCR_W1_005 requires summary/aggregation endpoint candidates for tracking status timeline.
  - SCR_W1_006 requires orders summary payload contract for compact list rendering.
