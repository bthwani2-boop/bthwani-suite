# Screen Contract - esf_app_client_hub

1. Screen Identity: SCR_1
2. Purpose: app-client entry surface for esf flows.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/home
6. Entry Points: app route and workflow continuation.
7. Exit Points: requests and matches flows.
8. Primary CTA: open_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: esf summary and status cards.
11. Displayed Blocks: header, cards, quick actions, feedback.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_home_get, esf_requests_list, esf_matches_inbox
17. Required UI-Kit Pieces: state shells, cards, feedback banners.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_app_client_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_TRACEABILITY.csv
