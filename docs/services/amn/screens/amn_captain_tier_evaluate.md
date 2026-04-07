# Screen Contract - amn_captain_tier_evaluate

1. Screen Identity: SCR_4
2. Purpose: Operational AMN workflow surface.
3. Actor: captain
4. Surface: app-captain
5. Canonical Route: /captain/amn/captain/tier/evaluate
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
16. Dependent Operations: amn_captain_tier_evaluate
17. Required UI-Kit Pieces: state shells, action card, form primitives, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/amn/amn_captain_tier_evaluate.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof-only closure.
22. Notes from donor extraction: services/amn/governance/operations/amn_captain_tier_evaluate/OP_SCREENS_MAP.csv
