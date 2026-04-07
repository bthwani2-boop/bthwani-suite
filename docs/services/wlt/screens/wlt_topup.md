# Screen Contract - wlt_topup

1. Screen Identity: SCR_23
2. Purpose: execute topup mutation for wallet funding.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/topup
6. Entry Points: balance screen and wallet quick actions.
7. Exit Points: confirmation and balance refresh.
8. Primary CTA: submit_topup
9. Secondary Actions: retry, back, support_action.
10. Required Data: topup amount, source method, risk checks.
11. Displayed Blocks: header, topup form, confirmation preview, feedback.
12. Section Order: header -> form -> preview -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: amount constraints and policy validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_topup
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_topup.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
