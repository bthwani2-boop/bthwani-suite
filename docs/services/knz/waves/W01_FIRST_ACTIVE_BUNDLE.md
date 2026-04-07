# W01_FIRST_ACTIVE_BUNDLE

1. Wave Identity: W01_FIRST_ACTIVE_BUNDLE
2. Wave Goal: Deliver scoped bundle for W01_FIRST_ACTIVE_BUNDLE with gate-based progression.
3. Why This Wave Exists: isolate risk and enforce ordered execution by queue.
4. Included Screen Bundles: knz_cart_get | knz_cart_item_add | knz_categories_list | knz_favorite_toggle | knz_favorites_list | knz_home_get | knz_listings_list | knz_listings_search
5. Included Operation Families: discovery_read
6. UI-Kit Prerequisites: state shells + navigation + form/list primitives as required by bundle.
7. Repo Code Touch Targets: packages/surfaces | services/knz | packages/api-clients | apps thin shells.
8. Dependencies: W00 foundational locks and queue item dependencies.
9. Hard Stops: no bypass of gates, no raw fetch production path, no unowned target path.
10. Acceptance Gate: Gate A -> Gate B -> Gate C required.
11. What Opens Next Wave: all wave items reaching close-ready state.
12. What Remains Deferred: runtime-ready proof to W09 unless explicitly unlocked.
