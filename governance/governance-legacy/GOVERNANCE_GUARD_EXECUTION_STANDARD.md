---
generatedFrom: governance/GOVERNANCE_GUARD_EXECUTION_STANDARD.md
generatedAt: 2026-04-30T04:48:37.5389621+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance Guard Execution Standard

Status: CANONICAL_GUARD_STANDARD
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134
LastRebuiltBy: GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134

## Guard lifecycle

Guards must run in layers:

1. During development
2. Before commit
3. At commit/staged review
4. Before push
5. In Pull Request / CI when available
6. Before final closure decision

## Inventory Source

The canonical live inventory of guards, paths, and scan coverage lives in `GOVERNANCE_GUARD_CATALOG.md`.

This file governs execution timing and discipline only. It must not duplicate the catalog as a second inventory source.

## Non-negotiable rules

- A guard must be executable.
- A guard must produce evidence or a clear decision.
- A guard must not silently mutate broad repo state.
- Warning baselines must not become hard failures without a dedicated batch.
- New guards must pass in the same batch that introduces them.

