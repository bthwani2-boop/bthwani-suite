# Screen Contract - wlt_settlements_list

1. Screen Identity: SCR_19
2. Purpose: list settlements and expose settlement status timeline.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/settlements
6. Entry Points: wallet flow and settlement navigation.
7. Exit Points: settlement detail and support flow.
8. Primary CTA: open_view
9. Secondary Actions: retry, back, support_action.
10. Required Data: settlements list, status filters, pagination cursor.
11. Displayed Blocks: header, list cards, status chips, feedback.
12. Section Order: header -> filters -> list -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement and query constraints.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_settlements_list
17. Required UI-Kit Pieces: state shells, list cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_settlements_list.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
