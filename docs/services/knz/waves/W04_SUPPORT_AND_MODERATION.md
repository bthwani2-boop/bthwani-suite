# W04_SUPPORT_AND_MODERATION

1. Wave Identity: W04_SUPPORT_AND_MODERATION
2. Wave Goal: Execute active support/moderation bundle after marketplace flow and control core shell.
3. Why This Wave Exists: isolate utility/support and moderation-sensitive surfaces into a dedicated wave for cleaner closure.
4. Included Screen Bundles: knz_account_screen | knz_delivery_by_seller_notice | knz_my_listings | knz_page_screen | knz_policy_disclaimer | knz_promoted_badge | knz_listing_create_screen | knz_listing_delete_screen | knz_listing_update_screen | knz_listings_list_screen
5. Included Operation Families: support_moderation_edges
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/knz | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all support/moderation queue rows closed and reviewed.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.

## Current Support/Moderation Screen Inventory (From Active Queue)
- W04_SUPPORT_AND_MODERATION: knz_account_screen
- W04_SUPPORT_AND_MODERATION: knz_delivery_by_seller_notice
- W04_SUPPORT_AND_MODERATION: knz_my_listings
- W04_SUPPORT_AND_MODERATION: knz_page_screen
- W04_SUPPORT_AND_MODERATION: knz_policy_disclaimer
- W04_SUPPORT_AND_MODERATION: knz_promoted_badge
- W04_SUPPORT_AND_MODERATION: knz_listing_create_screen
- W04_SUPPORT_AND_MODERATION: knz_listing_delete_screen
- W04_SUPPORT_AND_MODERATION: knz_listing_update_screen
- W04_SUPPORT_AND_MODERATION: knz_listings_list_screen

## Injection Rule
- if any new support/moderation screen is added after W03 freeze, it must be inserted into W04 with explicit queue row, target path, and gate path.
