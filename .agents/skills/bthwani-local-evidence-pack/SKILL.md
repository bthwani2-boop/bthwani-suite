---
name: bthwani-local-evidence-pack
description: Build BThwani local evidence only when task risk justifies it. ZIP handoff is optional and used only when explicitly needed.
version: 2026.05.17-v1
---

# bthwani-local-evidence-pack

## Purpose

Create auditable local evidence without forcing ZIP creation for every task.

## Smart use rule

Do not use this skill for low-risk terminal-only, decision-only, or prompt-only work.

Use it when one of these is true:

1. The change is high-risk, scripted, or multi-file.
2. The user needs to upload several evidence files as one artifact.
3. The task changes governance, guards, scripts, UI-kit boundaries, imports/exports, or other sensitive ownership paths.
4. The user explicitly requests an evidence bundle or ZIP.

## Steps

1. Classify task risk first.
2. Create tools/registry/runs/{SESSION_ID}/ only when justified.
3. Capture branch, commit, status, untracked files, diff-stat, name-status, and diff-check when relevant.
4. Capture verification outputs required by the task type.
5. Write SUMMARY.md and evidence.json when a registry folder is created.
6. Create {SESSION_ID}.zip only when -CreateZip / explicit ZIP handoff is requested or one upload artifact is actually needed.
7. Export root review artifacts only when patch review is needed.

## Required files when registry evidence is justified

- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- git-untracked.txt
- evidence.json

## Optional handoff artifact

- {SESSION_ID}.zip only when explicitly requested or practically needed.

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
