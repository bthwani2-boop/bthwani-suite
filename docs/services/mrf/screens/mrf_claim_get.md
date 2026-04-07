# Screen Contract - mrf_claim_get

1. Screen Identity: SCR_6
2. Purpose: display claim details.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /mrf/claims/get
6. Entry Points: report and match flows.
7. Exit Points: match response.
8. Primary CTA: open_view
9. Secondary Actions: retry, back.
10. Required Data: claim details.
11. Displayed Blocks: detail cards, status timeline.
12. Section Order: header -> details -> states -> actions.
13. Interaction Rules: one canonical chain.
14. Validation Rules: claim id validation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: mrf_claim_get
17. Required UI-Kit Pieces: detail cards, state shells.
18. Local vs Shared Ownership: shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/mrf/mrf_claim_get.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08/W09.
22. Notes from donor extraction: services/mrf/governance/MRF_OPERATION_CATALOG.csv
