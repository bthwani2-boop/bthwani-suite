# Screen Contract - wlt_control_finance_hub

1. Screen Identity: SCR_5
2. Purpose: central control-panel finance workspace for WLT governance.
3. Actor: ops|finance
4. Surface: control-panel
5. Canonical Route: /finance/wlt
6. Entry Points: route entry and workflow continuation.
7. Exit Points: review queue, approvals, reconciliation screens.
8. Primary CTA: open_finance_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: approval queue, reconciliation summary, sync health.
11. Displayed Blocks: header, finance queue, approval cards, sync cards, feedback.
12. Section Order: header -> finance summary -> queues -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_finance_review, wlt_finance_approve, wlt_sync_dsh, wlt_sync_amn, wlt_sync_arb, wlt_sync_knz
17. Required UI-Kit Pieces: state shells, approval cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_control_finance_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
