---
name: bthwani-data-fixture-simulation-contract
description: Separate preview data, fixtures, seeds, mocks, simulation, demo data, and live runtime truth. Use for any data source or sample-state task.
version: 2026.05.17-v1
---

# bthwani-data-fixture-simulation-contract

## Purpose

Prevent fixtures from becoming runtime truth.

## Steps

1. Classify data source: `FIXTURE`, `PREVIEW`, `SEED`, `SIMULATION`, `MOCK`, `LIVE`, or `UNKNOWN`.
2. Identify owner and exit path.
3. Require labels in UI/control panel when data is preview/simulation.
4. Block live-readiness claims when fixture exit path is missing.
5. Verify no hidden `USE_FIXTURES` or stale local runtime truth is treated as production.

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; do not use npm/npx shims for local execution.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.

## Output contract

```text
skill:
scope:
governance_sources:
evidence_used:
findings:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```
