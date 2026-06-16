---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-closure-by-journeys-and-slices
language: ar
---

# 17 — أوامر PowerShell مختصرة للأدلة

## بدء جلسة رحلة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$IssueCode = "DSH_LIVE_JOURNEY_XX"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RunRoot "screenshots") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RunRoot "api") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RunRoot "db") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RunRoot "runtime-logs") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RunRoot "code-hygiene") | Out-Null

"session_id=$SessionId" | Set-Content -Encoding UTF8 (Join-Path $RunRoot "status.txt")
```

## Snapshot قبل التعديل

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git branch --show-current | Tee-Object -FilePath "$RunRoot\branch.txt"
git rev-parse HEAD | Tee-Object -FilePath "$RunRoot\commit.txt"
git --no-pager status --short | Tee-Object -FilePath "$RunRoot\git-status-before.txt"
git ls-files --others --exclude-standard | Tee-Object -FilePath "$RunRoot\untracked-before.txt"
```

## فحص Preview/Fixture

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

rg -n --hidden --glob '!node_modules/**' --glob '!tools/registry/runs/**' "preview|fixture|mock|demo|local-state|hardcoded|dev-only" dsh wlt control-panel app-client app-partner app-captain app-field packages > "$RunRoot\code-hygiene\preview-fixture-scan.txt"
```

## فحص المكرر والميت مبدئيًا

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

pnpm run guard:jscpd:live | Tee-Object -FilePath "$RunRoot\code-hygiene\jscpd-live.txt"
pnpm run guard:depcruise:live-boundaries | Tee-Object -FilePath "$RunRoot\code-hygiene\depcruise-live-boundaries.txt"
pnpm run guard:no-broken-imports | Tee-Object -FilePath "$RunRoot\code-hygiene\no-broken-imports.txt"
```

## إغلاق الجلسة وتجهيز ZIP

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short | Tee-Object -FilePath "$RunRoot\git-status-after.txt"
git --no-pager diff --stat | Tee-Object -FilePath "$RunRoot\git-diff-stat.txt"
git --no-pager diff --name-status | Tee-Object -FilePath "$RunRoot\git-diff-name-status.txt"
git --no-pager diff --check | Tee-Object -FilePath "$RunRoot\git-diff-check.txt"
pnpm -w exec tsc --noEmit | Tee-Object -FilePath "$RunRoot\tsc-noemit.txt"

Compress-Archive -Path (Join-Path $RunRoot '*') -DestinationPath (Join-Path $RunRoot '_HANDOFF.zip') -Force
Write-Host "HANDOFF: $RunRoot\_HANDOFF.zip"
```
