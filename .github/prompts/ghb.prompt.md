---
description: Run the repo-local ghb checkpoint flow from chat. USE WHEN user says "ghb", "غب", "checkpoint", or asks for commit + push + new branch without using the terminal.
argument-hint: '[optional message] [--branch BRANCH] [--no-push] [--allow-empty]'
---

# GHB Command

Use the repo-local workflow script at `tools/scripts/ghb.ps1`.

## Context

- Current branch: !`git branch --show-current`
- Git status: !`git status --short`
- Last commit: !`git rev-parse --short HEAD`

## User Input

${input:args}

## Instructions

1. Parse `${input:args}` for these optional flags:
   - `--branch <name>`
   - `--no-push`
   - `--allow-empty`
2. Treat the remaining free text as the commit message.
3. If no message is provided, infer a short message from the current changes. Avoid a generic one-word message unless the repo is clean and `--allow-empty` was requested.
4. Execute the script with PowerShell from the repo root:

   ```powershell
   pwsh -NoProfile -ExecutionPolicy Bypass -File ".\\tools\\scripts\\ghb.ps1" [-Message "..."] [-BranchName "..."] [-NoPush] [-AllowEmpty]
   ```

5. Summarize the result in chat with the commit message, the branch that was checkpointed, and the new branch that was created.
6. Do not tell the user to switch to the terminal.