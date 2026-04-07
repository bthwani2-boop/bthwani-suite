# Screen Contract - wlt_settlement_get

1. Screen Identity: SCR_20
2. Purpose: present settlement detail and settlement lifecycle transitions.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/settlements/get
6. Entry Points: settlements list.
7. Exit Points: back to list and support flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: settlement payload, status history, amount breakdown.
11. Displayed Blocks: header, detail cards, timeline, feedback.
12. Section Order: header -> detail -> timeline -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and settlement id integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_settlement_get
17. Required UI-Kit Pieces: state shells, detail cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_settlement_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
