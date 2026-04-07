# Screen Contract - esf_request_cancel

1. Screen Identity: SCR_11
2. Purpose: cancel ESF request.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/requests/cancel
6. Entry Points: request detail.
7. Exit Points: requests list.
8. Primary CTA: submit_cancel
9. Secondary Actions: retry, back.
10. Required Data: cancel payload.
11. Displayed Blocks: reason form and confirmation.
12. Section Order: header -> reason -> actions.
13. Interaction Rules: one canonical chain.
14. Validation Rules: payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_request_cancel
17. Required UI-Kit Pieces: form controls, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_request_cancel.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
