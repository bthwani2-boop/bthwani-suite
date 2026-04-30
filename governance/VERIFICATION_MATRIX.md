---
generatedFrom: governance/VERIFICATION_MATRIX.md
generatedAt: 2026-04-30T04:48:37.9732622+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Verification Matrix

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Universal verification

| Change type | Required checks |
|---|---|
| Any file change | `git status`, `git diff --check`, changed-file review |
| Code change | Universal + `pnpm -w exec tsc --noEmit` |
| Script change | Universal + script DryRun/Apply evidence |
| Guard change | Universal + guard runner output |
| Governance doc change | Universal + governance guard output when available |
| UI change | Code checks + screenshots + RTL/overflow/state review |
| API/data change | Code checks + contract/binding/runtime evidence |
| Runtime change | Code checks + logs/smoke proof |
| CI/workflow change | YAML review + scope review + CI reasoning |
| Dependency/config change | Explicit approval + lockfile review + build/test proof |

## 2. Standard commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## 3. Guard command

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_GOVERNANCE_GUARDS.ps1"
```

## 4. UI evidence checklist

```text
before screenshot when available
after screenshot
device/viewport
language/direction
state
overflow/clipping
visual identity
no unrelated drift
```

## 5. Patch handoff checklist

```text
LOCAL_CHANGE_STATUS.txt
LOCAL_CHANGE_DIFF_STAT.txt
LOCAL_CHANGE_NAME_STATUS.txt
LOCAL_CHANGE_DIFF_CHECK.txt
LOCAL_CHANGE_REVIEW.patch
LOCAL_CHANGE_UNTRACKED_FILES.txt
TSC_NOEMIT.txt when code changed
```

## 6. Acceptance

Verification output must be reviewed before any final decision.

