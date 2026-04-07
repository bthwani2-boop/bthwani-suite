# Screen Contract - esf_home_get

1. Screen Identity: SCR_3
2. Purpose: display ESF home feed.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/feed
6. Entry Points: esf hub.
7. Exit Points: requests and matches.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: home aggregate payload.
11. Displayed Blocks: summary cards, feed list.
12. Section Order: header -> summary -> feed.
13. Interaction Rules: one canonical chain.
14. Validation Rules: entitlement and query validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_home_get
17. Required UI-Kit Pieces: cards, list, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_home_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
