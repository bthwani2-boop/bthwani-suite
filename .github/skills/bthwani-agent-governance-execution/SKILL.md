---
name: bthwani-agent-governance-execution
description: Use for any BThwani AI-agent, Copilot, Codex, OpenCode, governance, script, evidence, or patch handoff task. Forces scoped DryRun/Apply, evidence, and no final claims without verification.
version: 2026.05.12-v2
---

# BThwani Agent Governance Execution

## Activation
Use this skill whenever the task touches:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/agents/**`
- `.github/skills/**`
- `.agents/skills/**`
- `.codex/**`
- `.cursor/**`
- `.opencode/**`
- `opencode.json`
- `governance/**`
- `tools/guards/**`
- `tools/scripts/**`

## Non-negotiable workflow

```text
CHECK -> FORENSICS -> DRYRUN -> APPLY -> VERIFY -> PATCH/EVIDENCE REVIEW
```

## Forbidden without explicit user approval

- GitHub write
- commit
- push
- PR
- merge
- force push
- dependency or lockfile changes
- broad refactor
- deleting, moving, or renaming files
- changing implementation code while doing governance-only work

## Evidence law
Any script that writes to `tools/registry/runs/{SESSION_ID}` must create:

```text
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
```

Do not create legacy handoff zip names in new BThwani scripts.

## Final decision vocabulary
Use only:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
NO_ACTION_REQUIRED
```

Agents may report `DONE` for local execution, but must not claim `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

## Required output

```text
method:
scope:
changed_files:
diff_check:
typecheck:
evidence_zip:
untracked_files:
decision: DONE / BLOCKED
```
