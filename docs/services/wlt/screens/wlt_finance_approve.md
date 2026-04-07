# Screen Contract - wlt_finance_approve

1. Screen Identity: SCR_15
2. Purpose: execute finance approval mutation from control panel.
3. Actor: ops|finance
4. Surface: control-panel
5. Canonical Route: /finance/wlt/approve
6. Entry Points: finance hub and review queue continuation.
7. Exit Points: approval confirmation, rejection fallback, and queue refresh.
8. Primary CTA: submit_approval
9. Secondary Actions: retry, back, support_action.
10. Required Data: approval payload, risk gates, and audit metadata.
11. Displayed Blocks: header, approval form, risk summary, feedback.
12. Section Order: header -> approval detail -> decision -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, policy checks, and payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_finance_approve
17. Required UI-Kit Pieces: state shells, approval cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_finance_approve.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
