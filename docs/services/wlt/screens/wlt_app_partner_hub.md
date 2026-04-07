# Screen Contract - wlt_app_partner_hub

1. Screen Identity: SCR_2
2. Purpose: partner settlement workspace.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/home
6. Entry Points: route entry and workflow continuation.
7. Exit Points: settlement details and payout request.
8. Primary CTA: open_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: settlement balance and payout eligibility.
11. Displayed Blocks: header, settlement cards, action cards, feedback.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_partner_settlement_get, wlt_partner_payout_request
17. Required UI-Kit Pieces: state shells, action card, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_app_partner_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
