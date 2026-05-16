---
name: bthwani-agent-registry-validator
description: Validate .agents registry coverage, skill frontmatter, duplicate capabilities, risky terms, orphan adapters, missing governance routes, and evidence readiness.
version: 2026.05.17-v1
---

# bthwani-agent-registry-validator

## Purpose

Keep `.agents` complete but not noisy.

## Checks

1. Every required capability has one owner skill.
2. Every skill has valid frontmatter.
3. No duplicate skills own the same capability.
4. No service/application-specific truth is embedded in general skills.
5. No active mirrors under `.github/skills`, `.github/agents`, `.opencode/skills`.
6. Risk terms are flagged: npm install, pnpm add, git push, git commit, force push, _HANDOFF, rm -rf, secrets, MCP, hooks.
7. Skill catalog and index match actual files.

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
