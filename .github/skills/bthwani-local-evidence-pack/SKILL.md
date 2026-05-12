---
name: bthwani-local-evidence-pack
description: Use to produce BThwani local evidence packs, patch handoff files, and registry run ZIPs with the correct {SESSION_ID}.zip naming rule.
version: 2026.05.12-v2
---

# BThwani Local Evidence Pack

## Canonical evidence root

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}
```

## Required minimum files

```text
SUMMARY.md
evidence.json
commands.log
status.txt
git-status.txt
git-diff-stat.txt
git-diff-name-status.txt
git-diff-check.txt
untracked-files.txt
```

## ZIP rule
The ZIP file must be named exactly:

```text
{SESSION_ID}.zip
```

placed inside the same session folder.

## Sensitive patch handoff
Create root-level files for ChatGPT review:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short > ".\LOCAL_CHANGE_STATUS.txt"
git --no-pager diff --stat > ".\LOCAL_CHANGE_DIFF_STAT.txt"
git --no-pager diff --name-status > ".\LOCAL_CHANGE_NAME_STATUS.txt"
git --no-pager diff --check > ".\LOCAL_CHANGE_DIFF_CHECK.txt"
git --no-pager diff --binary > ".\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > ".\LOCAL_CHANGE_UNTRACKED_FILES.txt"
```

## Acceptance
No evidence = no acceptance. No untracked accounting = no PASS. No verification = no READY_FOR_PR.
