# Screen Contract - esf_matches_inbox

1. Screen Identity: SCR_4
2. Purpose: list ESF match inbox.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/matches/inbox
6. Entry Points: esf hub.
7. Exit Points: match detail.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: inbox list.
11. Displayed Blocks: list cards and statuses.
12. Section Order: header -> list -> states.
13. Interaction Rules: one canonical chain.
14. Validation Rules: query validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_matches_inbox
17. Required UI-Kit Pieces: list cards, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_matches_inbox.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
