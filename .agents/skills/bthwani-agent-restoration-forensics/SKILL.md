---
name: bthwani-agent-restoration-forensics
description: Reconstruct useful agent rules from old branches, deleted files, or donor sources without direct restore. Use when comparing old agent trees or external skills.
version: 2026.05.17-v1
---

# bthwani-agent-restoration-forensics

## Purpose

Extract value from old/donor agent material while preventing noise restoration.

## Steps

1. Treat donor files as read-only.
2. Classify donor content:
   - `KEEP_AS_GENERAL_SKILL_PATTERN`
   - `MOVE_TO_GOVERNANCE`
   - `MOVE_TO_GUARD`
   - `REJECT_AS_NOISE_OR_DUPLICATE`
   - `TBD_NEEDS_HUMAN_REVIEW`
3. Never directly restore long trees or mirrors.
4. Summarize exact extracted rule and its target owner.

## Forbidden

- direct restore of `.github/agents` trees
- long copied donor docs inside `.agents`
- service-specific rules inside general skills

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