---
name: bthwani-local-evidence-pack
description: Build BThwani local registry evidence packs and root review artifacts with the correct {SESSION_ID}.zip naming rule. Use after any write-capable execution.
version: 2026.05.17-v1
---

# bthwani-local-evidence-pack

## Purpose

Create auditable local evidence.

## Steps

1. Create `tools/registry/runs/{SESSION_ID}/`.
2. Capture branch, commit, status, untracked files, diff-stat, name-status, diff-check.
3. Capture verification outputs.
4. Write `SUMMARY.md` and `evidence.json`.
5. Create `{SESSION_ID}.zip` inside the same folder.
6. Export root review artifacts when needed.

## Required files

- `git-status.txt`
- `git-diff-stat.txt`
- `git-diff-name-status.txt`
- `git-diff-check.txt`
- `git-untracked.txt`
- `evidence.json`
- `{SESSION_ID}.zip`

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