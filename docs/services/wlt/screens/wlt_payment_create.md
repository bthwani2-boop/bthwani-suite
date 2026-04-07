# Screen Contract - wlt_payment_create

1. Screen Identity: SCR_11
2. Purpose: execute client payment mutation with explicit validation and confirmation.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/payment/create
6. Entry Points: client hub and wallet view continuation.
7. Exit Points: success confirmation, retry flow, and wallet refresh.
8. Primary CTA: submit_payment
9. Secondary Actions: retry, back, support_action.
10. Required Data: payable amount, method selection, and validation hints.
11. Displayed Blocks: header, payment form, confirmation card, feedback.
12. Section Order: header -> form -> confirmation -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, amount constraints, and payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_payment_create
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_payment_create.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
