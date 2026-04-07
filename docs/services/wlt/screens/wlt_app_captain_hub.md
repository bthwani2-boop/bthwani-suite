# Screen Contract - wlt_app_captain_hub

1. Screen Identity: SCR_3
2. Purpose: captain earnings and payout workspace.
3. Actor: captain
4. Surface: app-captain
5. Canonical Route: /captain/wlt/home
6. Entry Points: route entry and workflow continuation.
7. Exit Points: earnings detail and payout request.
8. Primary CTA: open_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: earnings summary and payout eligibility.
11. Displayed Blocks: header, earnings cards, action cards, feedback.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_captain_earnings_get, wlt_captain_payout_request
17. Required UI-Kit Pieces: state shells, action card, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_app_captain_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
