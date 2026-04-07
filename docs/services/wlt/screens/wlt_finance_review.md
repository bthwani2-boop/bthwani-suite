# Screen Contract - wlt_finance_review

1. Screen Identity: SCR_10
2. Purpose: finance review and approval execution surface.
3. Actor: ops|finance
4. Surface: control-panel
5. Canonical Route: /finance/wlt/review
6. Entry Points: finance queue and workflow continuation.
7. Exit Points: approve, reject, reconcile actions.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: review queue, risk flags, audit metadata.
11. Displayed Blocks: header, review cards, risk indicators, feedback.
12. Section Order: header -> queue -> detail -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_finance_review
17. Required UI-Kit Pieces: state shells, review cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_finance_review.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
