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
- Return only the script status, recommendation, branch, commit SHA, push result, evidence root, `{SESSION_ID}.zip`, errors, and warnings.

<!-- BTHWANI_GP_SHORTCUT_END -->

<!-- BTHWANI_CURRENT_COPILOT_AGENT_CONTRACT_START -->

## BThwani current Copilot agent contract

Operate only inside `C:\bthwani-suite` unless the user explicitly says otherwise.

Before editing, read `pnpm-workspace.yaml` and classify active paths from repo evidence. Do not use legacy nested app/package roots or the donor absolute checkout path as active targets unless current repo evidence proves them active.

For agent/governance work:

1. CHECK current Git status and relevant files.
2. DRYRUN any script before Apply.
3. APPLY only inside stated scope.
4. VERIFY with Git diff and typecheck when code changed.
5. Export patch/evidence for review.

No commit, push, PR, merge, delete, move, dependency change, lockfile change, or GitHub write unless explicitly requested.

Use project-owned skills under `.github/skills/bthwani-*` when relevant. Skills guide execution; governance decides authority.

New evidence ZIPs under `tools/registry/runs/{SESSION_ID}` must be named `{SESSION_ID}.zip`, not the legacy handoff zip pattern.

<!-- BTHWANI_CURRENT_COPILOT_AGENT_CONTRACT_END -->
