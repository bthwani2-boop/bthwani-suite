# Screen Contract: shein-proxy-request-estimate

1. Screen Identity: shein-proxy-request-estimate
2. Purpose: execute primary user task for shein-proxy-request-estimate within dsh.
3. Actor: ops|admin
4. Surface: control-panel
5. Canonical Route: no_route_component
6. Entry Points: no_route_component entry
7. Exit Points: next route by CTA
8. Primary CTA: execute_estimate
9. Secondary Actions: retry | back | support_action
10. Required Data: models required by dependent operations and route context.
11. Displayed Blocks: header | content blocks | feedback blocks | action footer.
12. Section Order: header -> primary content -> secondary content -> action area.
13. Interaction Rules: CTA and secondary actions must respect actor entitlements.
14. Validation Rules: input validation and transition guards before state mutation.
15. Empty / Error / Loading / Offline / Disabled States: mandatory and explicit.
16. Dependent Operations: dsh_shein_proxy_request_estimate
17. Required UI-Kit Pieces: layout primitives | cards/inputs | state shells.
18. Local vs Shared Ownership: shared in packages/surfaces with thin shell routes.
19. Files To Create / Files To Touch: component + hook/viewmodel + route shell mapping.
20. Acceptance Gate: Gate A + Gate B + Gate C.
21. Deferred Items: non-critical enhancement items outside current queue order.
22. Notes from donor extraction: packages/surfaces/src/web/control-panel/operations/dsh/shein-proxy/shein-proxy-request-estimate.tsx

