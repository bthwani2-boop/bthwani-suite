---
name: bthwani-agent-skill-authoring-contract
description: Create or update BThwani skills with trigger clarity, minimal context burden, eval prompts, source attribution, and registry validation.
version: 2026.05.17-v1
---

# bthwani-agent-skill-authoring-contract

## Purpose

Make every skill precise, general, executable, and testable.

## Steps

1. Define capability, trigger contexts, non-trigger contexts, inputs, steps, forbidden actions, and output contract.
2. Keep `SKILL.md` concise; move large project truth to `governance/`.
3. Include 3 trigger examples and 3 non-trigger examples in design notes when creating a new skill.
4. Validate frontmatter: `name`, `description`, `version`.
5. Avoid duplicated skills and vague descriptions.
6. Run registry validator before acceptance.

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
