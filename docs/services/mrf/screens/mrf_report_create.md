# Screen Contract - mrf_report_create

1. Screen Identity: SCR_5
2. Purpose: create MRF report.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /mrf/reports/create
6. Entry Points: mrf hub and reports list.
7. Exit Points: confirmation and report list.
8. Primary CTA: submit_create
9. Secondary Actions: retry, back.
10. Required Data: report payload and attachments.
11. Displayed Blocks: form fields, attachment section, feedback.
12. Section Order: header -> form -> actions -> states.
13. Interaction Rules: one canonical chain.
14. Validation Rules: payload and media validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: mrf_report_create
17. Required UI-Kit Pieces: form controls, state shells, feedback banners.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/mrf/mrf_report_create.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/mrf/governance/MRF_OPERATION_CATALOG.csv
