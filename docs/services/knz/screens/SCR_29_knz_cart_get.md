# Screen Contract: knz_cart_get

1. Screen Identity: knz_cart_get
2. Purpose: execute primary user task for knz_cart_get within knz.
3. Actor: customer
4. Surface: app-client
5. Canonical Route: no_route_component
6. Entry Points: no_route_component entry
7. Exit Points: next route by CTA
8. Primary CTA: open_get_view
9. Secondary Actions: retry | back | support_action
10. Required Data: models required by dependent operations and route context.
11. Displayed Blocks: header | content blocks | feedback blocks | action footer.
12. Section Order: header -> primary content -> secondary content -> action area.
13. Interaction Rules: CTA and secondary actions must respect actor entitlements.
14. Validation Rules: input validation and transition guards before state mutation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory and explicit.
16. Dependent Operations: knz_cart_get
17. Required UI-Kit Pieces: layout primitives | cards/inputs | state shells.
18. Local vs Shared Ownership: shared in packages/surfaces with thin shell routes.
19. Files To Create / Files To Touch: component + hook/viewmodel + route shell mapping.
20. Acceptance Gate: Gate A + Gate B + Gate C.
21. Deferred Items: non-critical enhancement items outside current queue order.
22. Notes from donor extraction: packages/surfaces/src/knz/app-client/mobile/auto_knz_cart_get.tsx

