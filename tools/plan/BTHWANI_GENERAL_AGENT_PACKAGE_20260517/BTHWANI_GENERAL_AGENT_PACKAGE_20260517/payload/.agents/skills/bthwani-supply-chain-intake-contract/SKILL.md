---
name: bthwani-supply-chain-intake-contract
description: Evaluate external skills, packages, MCP servers, hooks, custom commands, and donor sources before adoption.
version: 2026.05.17-v1
---

# bthwani-supply-chain-intake-contract

## Purpose

Prevent unreviewed external code/instructions from becoming active authority.

## Steps

1. Classify source: official, curated, experimental, community, donor, unknown.
2. Inspect license, scripts, hooks, MCP config, dependencies, install commands, permissions, and instruction scope.
3. Decide: `REFERENCE_ONLY`, `TRANSFORM_TO_BTHWANI_SKILL`, `MOVE_TO_GOVERNANCE`, `REJECT`, or `TBD`.
4. Never install bulk community skills into active `.agents`.
5. Never trust external descriptions without local review.

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
