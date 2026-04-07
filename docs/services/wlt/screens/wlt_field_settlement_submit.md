# Screen Contract - wlt_field_settlement_submit

1. Screen Identity: SCR_14
2. Purpose: execute field settlement submit mutation.
3. Actor: field
4. Surface: app-field
5. Canonical Route: /field/wlt/settlement/submit
6. Entry Points: field hub and collection view continuation.
7. Exit Points: submission confirmation, retry flow, and collection refresh.
8. Primary CTA: submit_settlement
9. Secondary Actions: retry, back, support_action.
10. Required Data: settlement payload, handoff references, and validation hints.
11. Displayed Blocks: header, settlement form, confirmation card, feedback.
12. Section Order: header -> form -> confirmation -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, settlement rules, and payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_field_settlement_submit
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_field_settlement_submit.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
