# Screen Contract - wlt_partner_payout_request

1. Screen Identity: SCR_12
2. Purpose: execute partner payout request mutation.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/payout/request
6. Entry Points: partner hub and settlement view continuation.
7. Exit Points: request confirmation, retry flow, and settlement refresh.
8. Primary CTA: submit_payout_request
9. Secondary Actions: retry, back, support_action.
10. Required Data: payout amount, destination account, and cutoff constraints.
11. Displayed Blocks: header, payout form, confirmation card, feedback.
12. Section Order: header -> form -> confirmation -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, payout policy, and payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_partner_payout_request
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_partner_payout_request.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
