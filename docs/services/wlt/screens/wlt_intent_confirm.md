# Screen Contract - wlt_intent_confirm

1. Screen Identity: SCR_18
2. Purpose: confirm payment intent and finalize transaction.
3. Actor: client
4. Surface: app-client
5. Canonical Route: /wlt/intent/confirm
6. Entry Points: intent create completion.
7. Exit Points: success receipt and wallet refresh.
8. Primary CTA: confirm_intent
9. Secondary Actions: retry, back, support_action.
10. Required Data: intent id, confirmation payload, risk checks.
11. Displayed Blocks: header, confirmation summary, receipt preview, feedback.
12. Section Order: header -> summary -> confirmation -> actions.
13. Interaction Rules: one canonical chain per action.
14. Validation Rules: entitlement, intent status, payload integrity.
15. Empty / Error / Loading / Offline / Disabled States: mandatory.
16. Dependent Operations: wlt_intent_confirm
17. Required UI-Kit Pieces: state shells, confirmation cards, feedback banners.
18. Local vs Shared Ownership: service composition on shared ui-kit primitives.
19. Files To Create / Files To Touch: packages/surfaces/src/wlt/wlt_intent_confirm.tsx
20. Acceptance Gate: gate_a_b_c_passed
21. Deferred Items: W08 binding and W09 runtime proof.
22. Notes from donor extraction: services/wlt/governance/WLT_TRACEABILITY.csv
