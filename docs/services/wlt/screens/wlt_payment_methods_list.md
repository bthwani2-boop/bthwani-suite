# Screen Contract - wlt_payment_methods_list

1. Screen Identity: SCR_16
2. Purpose: list available payment methods before intent creation.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/payment-methods
6. Entry Points: wallet hub and payment flow start.
7. Exit Points: intent create and support flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: methods list, default method, method availability.
11. Displayed Blocks: header, methods list, action cards, feedback.
12. Section Order: header -> methods -> actions -> feedback.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_payment_methods_list
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_payment_methods_list.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
