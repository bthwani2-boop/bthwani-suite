# Screen Contract - wlt_captain_earnings_get

1. Screen Identity: SCR_8
2. Purpose: captain earnings read surface.
3. Actor: captain
4. Surface: app-captain
5. Canonical Route: /captain/wlt/earnings/get
6. Entry Points: captain hub and direct link.
7. Exit Points: payout request and support flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: earnings totals, payout windows, deduction details.
11. Displayed Blocks: header, earnings cards, payout preview, feedback.
12. Section Order: header -> earnings -> payout preview -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_captain_earnings_get
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_captain_earnings_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: docs/services/wlt/09_SCREEN_REGISTRY.csv
