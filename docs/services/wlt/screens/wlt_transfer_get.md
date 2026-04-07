# Screen Contract - wlt_transfer_get

1. Screen Identity: SCR_27
2. Purpose: display transfer detail and lifecycle.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/transfers/get
6. Entry Points: transfer list.
7. Exit Points: back to list and support flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: transfer payload, status history, trace metadata.
11. Displayed Blocks: header, detail cards, lifecycle timeline, feedback.
12. Section Order: header -> detail -> timeline -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and transfer id validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_transfer_get
17. Required UI-Kit Pieces: state shells, detail cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_transfer_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
