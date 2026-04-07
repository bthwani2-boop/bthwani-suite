# Screen Contract - wlt_intent_create

1. Screen Identity: SCR_17
2. Purpose: create payment intent with validation before confirmation.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/intent/create
6. Entry Points: payment methods list and wallet flow.
7. Exit Points: intent confirmation and cancel flow.
8. Primary CTA: submit_intent
9. Secondary Actions: retry, back, support_action.
10. Required Data: amount, method, memo, policy constraints.
11. Displayed Blocks: header, intent form, validation summary, feedback.
12. Section Order: header -> form -> validation -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, amount policy, payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_intent_create
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_intent_create.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
