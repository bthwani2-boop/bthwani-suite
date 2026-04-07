# Screen Contract - kwd_jobs_list

1. Screen Identity: SCR_3
2. Purpose: list kwd jobs.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /kwd/jobs
6. Entry Points: kwd hub.
7. Exit Points: apply flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: jobs list and filters.
11. Displayed Blocks: list cards and filters.
12. Section Order: header -> filters -> list.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: query validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: kwd_jobs_list
17. Required UI-Kit Pieces: list cards, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/kwd/kwd_jobs_list.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/kwd/governance/KWD_OPERATION_CATALOG.csv
