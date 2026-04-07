# Screen Contract - wlt_payout_approve

1. Screen Identity: SCR_32
2. Purpose: execute payout approval mutation.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/payouts/approve
6. Entry Points: payout detail and approval queue.
7. Exit Points: approval confirmation and list refresh.
8. Primary CTA: submit_payout_approve
9. Secondary Actions: retry, back, support_action.
10. Required Data: payout id, approval payload, policy checks.
11. Displayed Blocks: header, approval form, risk summary, feedback.
12. Section Order: header -> detail -> approval -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, policy checks, payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_payout_approve
17. Required UI-Kit Pieces: state shells, approval cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_payout_approve.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
