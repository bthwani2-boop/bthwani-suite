# W02_PROXY_USER_FLOW

1. Wave Identity: W02_PROXY_USER_FLOW
2. Wave Goal: Deliver scoped bundle for W02_PROXY_USER_FLOW with gate-based progression.
3. Why This Wave Exists: isolate risk and enforce ordered execution by queue.
4. Included Screen Bundles: dsh_awnak_order_create | dsh_checkout_gate | dsh_delivery_attempt_create | dsh_delivery_attempts_list | dsh_delivery_close | dsh_delivery_eta_get | dsh_delivery_get | dsh_delivery_reassign | dsh_delivery_track_get | dsh_external_order_create | dsh_gas_refill_order_create | dsh_loyalty_points_redeem | dsh_loyalty_points_user_balance | dsh_loyalty_points_user_history | dsh_order_accept | dsh_order_cancel | dsh_order_complete | dsh_order_create | dsh_order_escrow_hold | dsh_order_escrow_release | dsh_order_get | dsh_order_issue_flag | dsh_order_proof_code_generate | dsh_order_proof_verify | dsh_order_rate | dsh_order_receipt_get | dsh_order_status_get | dsh_order_status_update | dsh_orders_list | dsh_pricing_preview | dsh_pricing_snapshot_get | dsh_promo_apply | dsh_proxy_request_approve | dsh_proxy_request_review | dsh_proxy_request_tracking | dsh_review_create | dsh_reviews_list | dsh_shein_info | dsh_subscription_family_get | dsh_subscription_family_members_get | dsh_subscription_family_members_post | dsh_subscription_pro_catalog | dsh_subscription_sync | dsh_subscription_tier_get | dsh_subscription_upgrade_post
5. Included Operation Families: proxy_user_flow
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/dsh | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all wave items reaching close-ready state.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.
