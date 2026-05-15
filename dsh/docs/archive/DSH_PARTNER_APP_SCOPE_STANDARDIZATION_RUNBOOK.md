# DSH Partner App-Scope Standardization Runbook

1. Preflight.
2. Inventory.
3. Data contracts and finance ownership.
4. Routes and screen registry.
5. Public API and placeholder cleanup.
6. WLT partner bridge simplification.
7. Classification and docs consistency.
8. Final closure gate.

Phase outputs:
- P0 proves scoped truth only; it does not imply closure.
- P1 removes or isolates DSH-owned finance artifacts and leaves WLT as the only live finance owner.
- P2 proves routes and registry coverage for the canonical DSH partner screens.
- P3 trims the public API to the minimal partner surface contract and documents any temporary compat alias.
- P4 reduces `wlt/frontend/app-partner/dsh/` to the explicit bridge target files only.
- P5 regenerates classification from live files only and updates docs to match the live surface.
- P6 may declare `PASS` only when diff-check, typecheck, static gates, classification integrity, finance ownership, and runtime smoke all pass or runtime is explicitly skipped with reason.
