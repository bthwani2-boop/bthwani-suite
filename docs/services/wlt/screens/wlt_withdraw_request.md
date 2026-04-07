# Screen Contract - wlt_withdraw_request

1. Screen Identity: SCR_24
2. Purpose: execute withdrawal request from wallet.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/withdrawals/request
6. Entry Points: balance screen and transfer menu.
7. Exit Points: request confirmation and history refresh.
8. Primary CTA: submit_withdraw
9. Secondary Actions: retry, back, support_action.
10. Required Data: withdraw amount, destination, limits, compliance flags.
11. Displayed Blocks: header, withdraw form, policy hints, feedback.
12. Section Order: header -> form -> policy -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, limits, payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_withdraw_request
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_withdraw_request.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
