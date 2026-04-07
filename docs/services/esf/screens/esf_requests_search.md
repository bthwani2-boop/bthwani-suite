# Screen Contract - esf_requests_search

1. Screen Identity: SCR_8
2. Purpose: search ESF requests.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /esf/requests/search
6. Entry Points: requests list.
7. Exit Points: request detail.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: query and results.
11. Displayed Blocks: search form, filters, result list.
12. Section Order: header -> search -> results.
13. Interaction Rules: one canonical chain.
14. Validation Rules: query validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_requests_search
17. Required UI-Kit Pieces: search controls, list cards, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_requests_search.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_OPERATION_CATALOG.csv
