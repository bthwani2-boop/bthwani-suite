# Screen Contract - esf_availability_update

1. Screen Identity: SCR_12
2. Purpose: update ESF availability.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/availability/update
6. Entry Points: esf hub.
7. Exit Points: home feed.
8. Primary CTA: submit_update
9. Secondary Actions: retry, back.
10. Required Data: availability payload.
11. Displayed Blocks: schedule controls and feedback.
12. Section Order: header -> controls -> actions.
13. Interaction Rules: one canonical chain.
14. Validation Rules: payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_availability_update
17. Required UI-Kit Pieces: form controls, chips, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_availability_update.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
