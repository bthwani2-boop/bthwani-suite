# Screen Contract - kwd_job_apply

1. Screen Identity: SCR_4
2. Purpose: submit job application.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /kwd/jobs/apply
6. Entry Points: jobs list.
7. Exit Points: my applications.
8. Primary CTA: submit_apply
9. Secondary Actions: retry, back.
10. Required Data: application payload.
11. Displayed Blocks: form and feedback.
12. Section Order: header -> form -> actions.
13. Interaction Rules: one canonical chain.
14. Validation Rules: payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: kwd_job_apply
17. Required UI-Kit Pieces: form controls and state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/kwd/kwd_job_apply.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/kwd/governance/KWD_OPERATION_CATALOG.csv
