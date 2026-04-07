# Screen Contract - wlt_app_field_hub

1. Screen Identity: SCR_4
2. Purpose: field collection and settlement workspace.
3. Actor: field
4. Surface: app-field
5. Canonical Route: /field/wlt/home
6. Entry Points: route entry and workflow continuation.
7. Exit Points: collection detail and settlement submit.
8. Primary CTA: open_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: collection queue and settlement state.
11. Displayed Blocks: header, queue cards, action cards, feedback.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_field_collection_get, wlt_field_settlement_submit
17. Required UI-Kit Pieces: state shells, action card, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_app_field_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
