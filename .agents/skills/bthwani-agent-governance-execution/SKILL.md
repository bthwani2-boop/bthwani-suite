---
name: bthwani-agent-governance-execution
description: Enforce scoped execution, forensics, dry-run, apply, verification, rollback, and evidence for agent/governance work. Use for any task touching AGENTS.md, .agents, governance, adapters, or guards.
version: 2026.05.17-v1
---

# bthwani-agent-governance-execution

## Purpose

Force agent-related work through a controlled execution flow.

## Steps

1. CHECK current Git state and target files.
2. FORENSICS current and donor references.
3. DRYRUN before writes.
4. APPLY only approved paths.
5. VERIFY diff, registry, frontmatter, and project gates.
6. EXPORT patch/evidence/rollback instructions.

## Forbidden

- commit, push, PR, merge, rebase without explicit request
- dependency or lockfile changes
- broad refactor while doing agent-only work

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