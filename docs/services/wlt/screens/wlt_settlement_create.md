# Screen Contract - wlt_settlement_create

1. Screen Identity: SCR_21
2. Purpose: create partner settlement request with guarded mutation flow.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/settlements/create
6. Entry Points: partner finance and settlement hub.
7. Exit Points: create confirmation and settlement detail.
8. Primary CTA: submit_settlement_create
9. Secondary Actions: retry, back, support_action.
10. Required Data: settlement payload, cutoff window, policy constraints.
11. Displayed Blocks: header, create form, preview, feedback.
12. Section Order: header -> form -> preview -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, policy checks, payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_settlement_create
17. Required UI-Kit Pieces: state shells, form controls, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_settlement_create.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
