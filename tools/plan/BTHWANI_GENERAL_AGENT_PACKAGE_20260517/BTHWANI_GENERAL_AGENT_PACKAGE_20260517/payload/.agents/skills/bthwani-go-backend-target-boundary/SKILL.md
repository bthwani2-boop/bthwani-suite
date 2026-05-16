---
name: bthwani-go-backend-target-boundary
description: Keep backend/API language and runtime decisions aligned to Go target boundary unless current repo evidence proves otherwise.
version: 2026.05.17-v1
---

# bthwani-go-backend-target-boundary

## Purpose

Avoid backend stack drift.

## Steps

1. Confirm current repo evidence.
2. Treat Go as intended backend target unless current repo evidence requires otherwise.
3. Do not assume NestJS for API/backend unless specific task or repo evidence requires it.
4. Keep frontend/UI work from silently adding backend responsibilities.

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
