# Screen Contract - wlt_field_collection_get

1. Screen Identity: SCR_9
2. Purpose: field collection read surface.
3. Actor: field
4. Surface: app-field
5. Canonical Route: /field/wlt/collection/get
6. Entry Points: field hub and direct link.
7. Exit Points: settlement submit and support flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: collection queue, cash status, pending handoff.
11. Displayed Blocks: header, queue cards, settlement preview, feedback.
12. Section Order: header -> queue -> settlement preview -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_field_collection_get
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_field_collection_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
