# Screen Contract - wlt_payouts_list

1. Screen Identity: SCR_31
2. Purpose: list partner payouts and payout statuses.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/payouts
6. Entry Points: partner hub and finance overview.
7. Exit Points: payout detail and approval flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: payouts list, status filters, paging cursor.
11. Displayed Blocks: header, list cards, status chips, feedback.
12. Section Order: header -> filters -> list -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and filter validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_payouts_list
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_payouts_list.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
