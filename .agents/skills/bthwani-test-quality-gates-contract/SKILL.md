---
name: bthwani-test-quality-gates-contract
description: Select and enforce verification gates for each BThwani change type: typecheck, lint, test, build, smoke, visual evidence, and patch review.
version: 2026.05.17-v1
---

# bthwani-test-quality-gates-contract

## Purpose

Make verification proportional and complete.

## Steps

1. Classify change type: docs/policy/agents/governance, UI, runtime, API, backend, config, dependency, data, release.
2. Select minimum applicable gates only — not all gates for every change:
   - `docs / policy / agents / governance only` → Git proof only (`git status`, `git diff --name-status`, `git diff --check`). No tsc, no build, no evidence pack.
   - `TS/TSX / config / exports` → targeted typecheck for affected project/path; workspace `tsc` only for high-risk, release, broad architecture, or explicit human request. Otherwise record `NOT_RUN_REASON`.
   - `UI visible change` → screenshots required; targeted type verification when needed.
   - `runtime / behavior change` → runtime smoke or log evidence.
   - `release / deploy / native / dependency` → build output required.
3. Require `git diff --check` always after writes.
4. Return `NEEDS_EVIDENCE` when applicable gates are missing.

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
