# Screen Contract - wlt_balance_get

1. Screen Identity: SCR_22
2. Purpose: present current wallet balance projection.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/balance
6. Entry Points: wallet hub and payment flow continuation.
7. Exit Points: topup, withdraw, and transfer actions.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: available balance, held balance, pending adjustments.
11. Displayed Blocks: header, balance cards, status indicators, feedback.
12. Section Order: header -> balances -> indicators -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and query validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_balance_get
17. Required UI-Kit Pieces: state shells, cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_balance_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
