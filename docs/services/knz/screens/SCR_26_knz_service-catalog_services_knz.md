# Screen Contract: knz_service-catalog_services_knz

1. Screen Identity: knz_service-catalog_services_knz
2. Purpose: execute primary user task for knz_service-catalog_services_knz within knz.
3. Actor: ops|admin
4. Surface: control-panel
5. Canonical Route: /service-catalog/services/knz
6. Entry Points: /service-catalog/services/knz entry
7. Exit Points: next route by CTA
8. Primary CTA: open_service_catalog
9. Secondary Actions: retry | back | support_action
10. Required Data: models required by dependent operations and route context.
11. Displayed Blocks: header | content blocks | feedback blocks | action footer.
12. Section Order: header -> primary content -> secondary content -> action area.
13. Interaction Rules: CTA and secondary actions must respect actor entitlements.
14. Validation Rules: input validation and transition guards before state mutation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory and explicit.
16. Dependent Operations: knz_moderation_action|knz_moderation_scan_submit
17. Required UI-Kit Pieces: layout primitives | cards/inputs | state shells.
18. Local vs Shared Ownership: shared in packages/surfaces with thin shell routes.
19. Files To Create / Files To Touch: component + hook/viewmodel + route shell mapping.
20. Acceptance Gate: Gate A + Gate B + Gate C.
21. Deferred Items: non-critical enhancement items outside current queue order.
22. Notes from donor extraction: apps/web/control-panel/app/service-catalog/services/knz/page.tsx

