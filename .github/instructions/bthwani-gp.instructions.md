# BThwani VS Code Agent Shortcut: gp

Status: ADOPTED_FOR_LOCAL_AGENT_USE
Scope: C:\bthwani-suite only
Shortcut: gp
Meaning: GitHub commit + push for the current branch
Script: tools/GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1

## Trigger

When the user types exactly:

```text
gp
```

execute immediately inside `C:\bthwani-suite`:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1" -CommitMessage "checkpoint: current branch update"
```

## Mandatory behavior

- Run the script only.
- Do not ask to continue.
- Do not switch branches.
- Do not modify files before running the script.
- Do not create another script.
- Do not change dependencies, package files, lockfiles, CI, config, runtime, API, or backend.
- Do not use or mention any old repo/path named `bth` as the active target; the active repo is only `C:\bthwani-suite`.
- Do not push `main`, `master`, `stable`, `production`, or `release` unless the script is intentionally rerun with explicit protected-branch approval.
- Do not claim PASS/CLOSED/READY/100% from your own summary.

## Return only

After execution, return only:

```text
status:
recommendation:
branch:
commit_sha_before:
commit_sha_after:
committed:
pushed:
evidence_root:
handoff_zip:
errors:
warnings:
```

If the script returns `BLOCKED`, report the exact script reason and stop.
