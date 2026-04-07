# Screen Contract - esf_match_get

1. Screen Identity: SCR_5
2. Purpose: display match detail.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/matches/get
6. Entry Points: matches inbox.
7. Exit Points: respond flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: match detail payload.
11. Displayed Blocks: detail cards and timeline.
12. Section Order: header -> details -> actions.
13. Interaction Rules: one canonical chain.
14. Validation Rules: match id validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_match_get
17. Required UI-Kit Pieces: detail cards, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_match_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
