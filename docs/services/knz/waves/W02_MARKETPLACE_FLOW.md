# W02_MARKETPLACE_FLOW

1. Wave Identity: W02_MARKETPLACE_FLOW
2. Wave Goal: Deliver scoped bundle for W02_MARKETPLACE_FLOW with gate-based progression.
3. Why This Wave Exists: isolate risk and enforce ordered execution by queue.
4. Included Screen Bundles: knz_account_screen | knz_auction_get | knz_auctions_list | knz_chat_message_send | knz_chat_thread_list | knz_delivery_by_seller_notice | knz_listing_create | knz_listing_delete | knz_listing_get | knz_listing_report | knz_listing_type_badge | knz_listing_update | knz_my_listings | knz_page_screen | knz_policy_disclaimer | knz_promoted_badge | knz_promotion_sheet | knz_rating_submit_sheet | knz_rating_summary | knz_ratings_list
5. Included Operation Families: marketplace_actions
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/knz | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all wave items reaching close-ready state.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.
