# Screen Contract - mrf_match_respond

1. Screen Identity: SCR_7
2. Purpose: respond to MRF match.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /mrf/matches/respond
6. Entry Points: claim details.
7. Exit Points: confirmation and back to matches.
8. Primary CTA: submit_respond
9. Secondary Actions: retry, back.
10. Required Data: response payload.
11. Displayed Blocks: decision controls and feedback.
12. Section Order: header -> decision -> actions -> states.
13. Interaction Rules: one canonical chain.
14. Validation Rules: payload and policy validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: mrf_match_respond
17. Required UI-Kit Pieces: form controls, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/mrf/mrf_match_respond.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/mrf/governance/MRF_OPERATION_CATALOG.csv
