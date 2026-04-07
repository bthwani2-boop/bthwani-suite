# Screen Contract - amn_trip_status_update

1. Screen Identity: SCR_17
2. Purpose: Operational AMN workflow surface.
3. Actor: passenger
4. Surface: app-client
5. Canonical Route: /amn/trip/status/update
6. Entry Points: route entry and workflow continuation.
7. Exit Points: navigation back or next workflow step.
8. Primary CTA: open_amn_workspace
9. Secondary Actions: contextual support actions.
10. Required Data: operation payloads and normalized read models.
11. Displayed Blocks: header, content, feedback, action footer.
12. Section Order: header -> content -> states -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: local input validation and server error normalization.
15. Empty / Error / Loading / Offline / Disabled States: all required and blocked from omission.
16. Dependent Operations: amn_trip_status_update
17. Required UI-Kit Pieces: state shells, action card, form primitives, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/amn/amn_trip_status_update.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof-only closure.
22. Notes from donor extraction: services/amn/governance/operations/amn_trip_status_update/OP_SCREENS_MAP.csv
