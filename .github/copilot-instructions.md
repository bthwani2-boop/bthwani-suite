Read first:

- `.agents/INDEX.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/adapters/copilot.md`

When the user sends exactly `ghb`, run only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1"
```

Do not manually recreate the workflow.
Do not merge, promote, open PRs, delete branches, force push, or modify main/stable unless the user explicitly asks for that after the script recommendation.

## Shortcut: gp

When the user types exactly `gp`, treat it as Git commit plus push for the current branch and run only:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1" -CommitMessage "checkpoint: current branch update"
```

Keep Copilot guidance thin. Use `.agents/skills/*` for workflow rules. No `PASS`, `CLOSED`, `FINAL`, or `100%` without diff, verification, and evidence.