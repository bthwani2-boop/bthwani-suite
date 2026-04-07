# Screen Contract - wlt_payout_get

1. Screen Identity: SCR_30
2. Purpose: display payout detail for partner workflows.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/payouts/get
6. Entry Points: payouts list and payout request continuation.
7. Exit Points: approve flow and back to list.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: payout payload, payout status, settlement references.
11. Displayed Blocks: header, detail cards, status timeline, feedback.
12. Section Order: header -> detail -> timeline -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payout id validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_payout_get
17. Required UI-Kit Pieces: state shells, detail cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_payout_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
