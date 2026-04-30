---
name: gp
description: BThwani commit + push current branch with evidence
agent: agent
---

Execute the BThwani `gp` shortcut now.

Run only this command inside `C:\bthwani-suite`:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1" -CommitMessage "checkpoint: current branch update"
```

Rules:

- Run the script only.
- Do not ask to continue.
- Do not switch branches.
- Do not modify files before running the script.
- Do not run unrelated commands.
- Do not create or edit files.
- Do not change dependencies, lockfiles, package files, CI, config, runtime, API, or backend.
- Do not claim PASS/CLOSED/READY/100% from your own summary.

Return only:

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
warnings:
errors:
```
