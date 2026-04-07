# W04_CAPTAIN_AND_PARTNER_SUPPORT

1. Wave Identity: W04_CAPTAIN_AND_PARTNER_SUPPORT
2. Wave Goal: Deliver scoped bundle for W04_CAPTAIN_AND_PARTNER_SUPPORT with gate-based progression.
3. Why This Wave Exists: isolate risk and enforce ordered execution by queue.
4. Included Screen Bundles: dsh_booking_create | dsh_captain_chat_read_ack | dsh_captain_chat_send | dsh_captain_cod_balance | dsh_captain_job_reject | dsh_captain_order_accept | dsh_captain_order_deliver | dsh_captain_order_details | dsh_captain_order_get | dsh_captain_order_pickup | dsh_captain_orders_list | dsh_captain_orders_offers_list | dsh_captain_profile_get | dsh_captain_proof_upload | dsh_captain_tier_evaluate | dsh_captain_tier_info | dsh_chat_read_ack | dsh_chat_send | dsh_entitlements_get | dsh_estimate_create | dsh_estimate_get | dsh_field_store_activation_request | dsh_field_store_geo_pin | dsh_field_store_visit_log | dsh_listing_status_update | dsh_partner_auction_status_update | dsh_partner_audience_insights_get | dsh_partner_chat_read_ack | dsh_partner_chat_send | dsh_partner_commission_by_mode_get | dsh_partner_delivery_ops_board | dsh_partner_delivery_zones_update | dsh_partner_doc_upload | dsh_partner_hours_update | dsh_partner_identity_submit | dsh_partner_intake_start | dsh_partner_inventory_adjust | dsh_partner_inventory_update | dsh_partner_items_upsert | dsh_partner_listing_status_update | dsh_partner_manager_invite | dsh_partner_order_accept | dsh_partner_order_get | dsh_partner_order_handoff | dsh_partner_order_issue_queue | dsh_partner_order_out_for_delivery | dsh_partner_order_prepare | dsh_partner_order_ready | dsh_partner_order_reject | dsh_partner_order_store_delivered | dsh_partner_orders_list | dsh_partner_profile_get | dsh_partner_quick_reply_config_get | dsh_partner_quick_reply_settings | dsh_partner_quick_reply_setup | dsh_partner_staff_analytics_get | dsh_partner_store_get | dsh_partner_store_nomination | dsh_partner_store_service_modes_update | dsh_partner_store_status_update | dsh_partner_store_update | dsh_partner_subscription | dsh_partner_zone_set | dsh_service_modes_resolve | dsh_zone_set
5. Included Operation Families: captain_partner_support
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/dsh | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all wave items reaching close-ready state.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.
