# Agent and AI Execution

## Purpose

This file governs ChatGPT, VS Code, Copilot, local scripts, generated files, patch review, and evidence handoff.

## Authority model

- ChatGPT chooses method and reviews evidence.
- Copilot executes locally only inside scope.
- Git evidence decides.
- User operates local repo and provides evidence.
- GitHub is read-only unless explicit write is requested.

## Delivery modes

- `DECISION_ONLY`
- `TERMINAL_COMMAND`
- `SINGLE_FILE`
- `ZIP_PACKAGE`
- `PATCH_HANDOFF`
- `EVIDENCE_BUNDLE`
- `VISUAL_REVIEW`
- `NO_ACTION`

## Method selection law

Do not force prompt-only work. Use the safest deterministic method:

- prompt for narrow local adaptation
- command for checks
- script for repeatable scans/fixes
- generated file for exact docs/config
- ZIP for multi-file payload
- patch handoff for sensitive changes

## Copilot contract

Copilot must:

- stay inside scope
- identify intended changed files before editing
- not delete/move/rename unless explicitly allowed
- not change dependencies/config/runtime/API/backend unless explicitly allowed
- not claim PASS/CLOSED/100%
- return changed files and verification commands

## Patch handoff

Sensitive local changes require:

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git --no-pager diff -- . > LOCAL_CHANGE_REVIEW.patch
git ls-files --others --exclude-standard > LOCAL_CHANGE_UNTRACKED_FILES.txt
```

## Scripts

PowerShell scripts for this project must start with:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
```

Scripts that write under `tools/registry/runs/` must produce `_HANDOFF.zip`.

## Decisions

Use only: `PASS`, `PASS_WITH_WARNINGS`, `FIX_REQUIRED`, `BLOCKED`, `READY_FOR_PR`, `REVERT_REQUIRED`, `NEEDS_EVIDENCE`, `NEEDS_VISUAL_EVIDENCE`
