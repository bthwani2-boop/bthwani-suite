# Screen Contract - snd_requests_list

1. Screen Identity: SCR_3
2. Purpose: list SND requests.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /snd/requests
6. Entry Points: snd hub.
7. Exit Points: request create and status update.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: request list payload.
11. Displayed Blocks: request cards and states.
12. Section Order: header -> list -> states.
13. Interaction Rules: one canonical chain.
14. Validation Rules: query validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: snd_requests_list
17. Required UI-Kit Pieces: list cards, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/snd/snd_requests_list.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/snd/governance/SND_OPERATION_CATALOG.csv
