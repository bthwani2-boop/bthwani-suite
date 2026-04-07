# Screen Contract - mrf_app_client_hub

1. Screen Identity: SCR_1
2. Purpose: app-client entry surface for mrf flows.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /mrf/home
6. Entry Points: app route and workflow continuation.
7. Exit Points: reports, claim, match actions.
8. Primary CTA: open_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: mrf summary cards and statuses.
11. Displayed Blocks: header, cards, quick actions, feedback.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: mrf_reports_list, mrf_reports_search, mrf_report_create, mrf_claim_get, mrf_match_respond
17. Required UI-Kit Pieces: state shells, cards, feedback banners.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/mrf/mrf_app_client_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/mrf/governance/MRF_TRACEABILITY.csv
