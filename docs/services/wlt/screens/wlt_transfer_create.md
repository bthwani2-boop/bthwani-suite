# Screen Contract - wlt_transfer_create

1. Screen Identity: SCR_25
2. Purpose: execute wallet transfer creation.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/transfers/create
6. Entry Points: wallet actions and balance context.
7. Exit Points: transfer confirmation and transfer list.
8. Primary CTA: submit_transfer
9. Secondary Actions: retry, back, support_action.
10. Required Data: source, destination, amount, transfer policy.
11. Displayed Blocks: header, transfer form, policy summary, feedback.
12. Section Order: header -> form -> summary -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and transfer policy checks.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_transfer_create
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_transfer_create.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
