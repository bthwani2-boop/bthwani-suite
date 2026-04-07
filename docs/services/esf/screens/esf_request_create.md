# Screen Contract - esf_request_create

1. Screen Identity: SCR_10
2. Purpose: create ESF request.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/requests/create
6. Entry Points: esf hub and requests list.
7. Exit Points: confirmation and request detail.
8. Primary CTA: submit_create
9. Secondary Actions: retry, back.
10. Required Data: request payload.
11. Displayed Blocks: form and feedback.
12. Section Order: header -> form -> actions.
13. Interaction Rules: one canonical chain.
14. Validation Rules: payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_request_create
17. Required UI-Kit Pieces: form controls, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_request_create.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
