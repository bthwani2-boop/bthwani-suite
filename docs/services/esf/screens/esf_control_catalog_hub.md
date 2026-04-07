# Screen Contract - esf_control_catalog_hub

1. Screen Identity: SCR_2
2. Purpose: control-panel catalog governance for esf.
3. Actor: ops|catalog
4. Surface: control-panel
5. Canonical Route: /catalog/esf
6. Entry Points: control-panel catalog IA.
7. Exit Points: sync operations.
8. Primary CTA: open_catalog_workspace
9. Secondary Actions: retry, back, support_action.
10. Required Data: sync health and audit summary.
11. Displayed Blocks: header, health cards, actions, feedback.
12. Section Order: header -> cards -> actions -> states.
13. Interaction Rules: one canonical chain.
14. Validation Rules: entitlement and payload validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: esf_sync_catalog
17. Required UI-Kit Pieces: state shells and admin cards.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/esf/esf_control_catalog_hub.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/esf/governance/ESF_CONTROL_PANEL_SECTION_MAP.csv

