---
name: bthwani-screen-flow-binding-contract
description: Lock screen, route, flow, state, params, and binding contracts before accepting visible or behavioral BThwani flow work.
version: 2026.05.17-v1
---

# bthwani-screen-flow-binding-contract

## Purpose

Make flow work decision-complete before closure.

## Steps

1. Record `screenId`, `surface`, `service`, `ownerPath`, `route`, `params`.
2. Identify entrypoints, exits, states, loading, empty, error, disabled, offline, and permission states.
3. Identify binding inputs and outputs.
4. Keep UI-only work free of backend/API/provider changes unless explicitly requested.
5. Return `GAP`, `TBD`, or `BLOCKED` instead of guessing.

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher; npx is allowed when documented or safest and justified in evidence.
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