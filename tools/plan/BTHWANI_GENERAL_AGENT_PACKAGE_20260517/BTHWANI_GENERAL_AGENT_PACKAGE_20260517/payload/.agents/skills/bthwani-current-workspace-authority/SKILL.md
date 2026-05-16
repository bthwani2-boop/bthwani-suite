---
name: bthwani-current-workspace-authority
description: Resolve active roots, stale paths, and donor-vs-current path authority in BThwani. Use before any task that names repo paths, apps, packages, services, surfaces, governance, or donor sources.
version: 2026.05.17-v1
---

# bthwani-current-workspace-authority

## Purpose

Confirm live workspace roots and block stale/donor-only paths before any mutation.

## Steps

1. Read `pnpm-workspace.yaml`.
2. Confirm active roots from current repo evidence.
3. Classify every path as `ACTIVE`, `STALE`, `DONOR_ONLY`, `UNKNOWN`, or `OUT_OF_SCOPE`.
4. Block mutation against stale/donor-only paths unless current branch proves them active.
5. Return allowed mutation scope before implementation.

## Required evidence

- current branch
- `pnpm-workspace.yaml`
- path existence scan
- relevant `git ls-files` results

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
