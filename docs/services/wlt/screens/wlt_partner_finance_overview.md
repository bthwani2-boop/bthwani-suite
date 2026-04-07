# Screen Contract - wlt_partner_finance_overview

1. Screen Identity: SCR_34
2. Purpose: present partner finance overview KPIs and status.
3. Actor: partner
4. Surface: app-partner
5. Canonical Route: /partner/wlt/finance/overview
6. Entry Points: partner hub and control finance jump links.
7. Exit Points: ledger, payouts, and settlements views.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: finance totals, payout pipeline, settlement health.
11. Displayed Blocks: header, KPI cards, pipeline cards, feedback.
12. Section Order: header -> KPIs -> pipeline -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and aggregation validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_partner_finance_overview
17. Required UI-Kit Pieces: state shells, KPI cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_partner_finance_overview.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
