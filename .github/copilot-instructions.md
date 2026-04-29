When the user sends exactly "ghb", run only:
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1"

Do not manually recreate the workflow.
Do not merge, promote, open PRs, delete branches, force push, or modify main/stable unless explicitly requested after the script recommendation.

<!-- BTHWANI_GP_SHORTCUT_START -->

## BThwani shortcut: gp

When the user types exactly `gp` in the VS Code agent chat, treat it as:

```text
gp = GitHub commit + push for the current branch
```

Run only this command inside `C:\bthwani-suite`:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1" -CommitMessage "checkpoint: current branch update"
```

Rules:

- Do not ask to continue.
- Do not switch branches.
- Do not modify files before running the script.
- Do not run unrelated commands.
- Do not push protected branches unless explicitly approved through the script options.
- Return only the script status, recommendation, branch, commit SHA, push result, evidence root, `_HANDOFF.zip`, errors, and warnings.

<!-- BTHWANI_GP_SHORTCUT_END -->
