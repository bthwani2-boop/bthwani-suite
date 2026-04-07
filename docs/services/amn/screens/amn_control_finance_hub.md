# Screen Contract - amn_control_finance_hub

1. Screen Identity: SCR_22
2. Purpose: Operational AMN workflow surface.
3. Actor: ops|finance|support
4. Surface: control-panel
5. Canonical Route: /operations/amn/finance
6. Entry Points: route entry and workflow continuation.
7. Exit Points: navigation back or next workflow step.
8. Primary CTA: open_operations_workspace
9. Secondary Actions: contextual support actions.
10. Required Data: operation payloads and normalized read models.
11. Displayed Blocks: header, content, feedback, action footer.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: local input validation and server error normalization.
15. Empty / Error / Loading / Offline / Disabled States: all required and blocked from omission.
16. Dependent Operations: amn_captain_tier_evaluate|amn_captain_tier_info|amn_trip_complete|amn_trip_receipt_get
17. Required UI-Kit Pieces: state shells, action card, form primitives, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/amn/amn_control_finance_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof-only closure.
22. Notes from donor extraction: services/amn/governance/AMN_CONTROL_PANEL_SECTION_MAP.csv

