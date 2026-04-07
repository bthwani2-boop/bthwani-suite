# Screen Contract - wlt_partner_ledger_get

1. Screen Identity: SCR_33
2. Purpose: display partner ledger entries and balances.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/ledger
6. Entry Points: partner finance overview.
7. Exit Points: payout flow and settlement flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: ledger entries, running balance, filters.
11. Displayed Blocks: header, ledger list, balance summary, feedback.
12. Section Order: header -> summary -> ledger -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and query constraints.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_partner_ledger_get
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_partner_ledger_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
