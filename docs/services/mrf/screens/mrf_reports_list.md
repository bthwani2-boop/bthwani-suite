# Screen Contract - mrf_reports_list

1. Screen Identity: SCR_3
2. Purpose: list MRF reports.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /mrf/reports
6. Entry Points: mrf hub.
7. Exit Points: search and detail flows.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: reports list and filters.
11. Displayed Blocks: list cards and filter controls.
12. Section Order: header -> filters -> list -> states.
13. Interaction Rules: one canonical chain.
14. Validation Rules: query and entitlement validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: mrf_reports_list
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/mrf/mrf_reports_list.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/mrf/governance/MRF_OPERATION_CATALOG.csv
