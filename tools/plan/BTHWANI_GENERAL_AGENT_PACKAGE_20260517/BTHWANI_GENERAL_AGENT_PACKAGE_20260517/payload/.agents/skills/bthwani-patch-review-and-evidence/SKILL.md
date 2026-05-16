---
name: bthwani-patch-review-and-evidence
description: Review diffs, patches, and evidence packs before accepting BThwani changes. Use for any handoff, closure, evidence-pack validation, or READY_FOR_PR decision.
version: 2026.05.17-v1
---

# bthwani-patch-review-and-evidence

## Purpose

Audit actual changed lines and evidence, not narrative claims.

## Steps

1. Inspect `git status`, `diff --check`, and patch/evidence.
2. Compare changed files to scope.
3. Flag out-of-scope, risky, duplicate, noisy, scattered, or unverifiable changes.
4. Require screenshots for visible UI changes.
5. Return one narrow next action.

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
