# Screen Contract - wlt_app_client_hub

1. Screen Identity: SCR_1
2. Purpose: entry workspace for client wallet tasks.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/home
6. Entry Points: route entry and workflow continuation.
7. Exit Points: wallet detail and payment actions.
8. Primary CTA: open_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: wallet summary and pending payment state.
11. Displayed Blocks: header, wallet summary, action cards, feedback.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_wallet_get, wlt_payment_create
17. Required UI-Kit Pieces: state shells, action card, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_app_client_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
