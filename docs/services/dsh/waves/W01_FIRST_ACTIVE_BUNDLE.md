# W01_FIRST_ACTIVE_BUNDLE

1. Wave Identity: W01_FIRST_ACTIVE_BUNDLE
2. Wave Goal: Deliver scoped bundle for W01_FIRST_ACTIVE_BUNDLE with gate-based progression.
3. Why This Wave Exists: isolate risk and enforce ordered execution by queue.
4. Included Screen Bundles: dsh_banners_list | dsh_cart_get | dsh_cart_init | dsh_cart_item_add | dsh_cart_item_remove | dsh_cart_item_update | dsh_cart_price | dsh_categories_list | dsh_categories_list_shared | dsh_category_detail | dsh_category_get | dsh_checkout_payment_method_select | dsh_customer_preferences_detail | dsh_customer_profile_detail | dsh_customer_profile_update | dsh_favorite_toggle | dsh_favorites_list | dsh_home_get | dsh_orders_create_screen | dsh_partner_order_accept_alt_screen | dsh_partner_order_chat_message_create_screen | dsh_partner_order_chat_messages_list_screen | dsh_partner_order_chat_read_ack_screen | dsh_partner_orders_list_shared | dsh_search | dsh_store_get | dsh_store_items_list | dsh_store_items_list_shared | dsh_stores_list
5. Included Operation Families: discovery_read
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/dsh | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all wave items reaching close-ready state.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.
