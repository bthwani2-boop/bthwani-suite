# GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1

Purpose: Commit and push the current branch in `C:\bthwani-suite` with evidence.

Shortcut: `gp`

Default command:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1" -CommitMessage "checkpoint: current branch update"
```

DryRun command:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1" -CommitMessage "checkpoint: current branch update" -DryRun
```

Output evidence:

```text
tools/registry/runs/GHB_COMMIT_PUSH-YYYYMMDD-HHMMSS/
  summary.txt
  evidence.json
  commands.log
  _HANDOFF.zip
```

Protected by default:

```text
main
master
stable
production
release
```

Use `-AllowProtectedBranch` only when intentionally approved.
