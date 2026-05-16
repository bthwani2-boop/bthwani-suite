# 05 — Verification Commands

Run from:

```powershell
C:\bthwani-suite
```

## Standard verification

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
node tools/guards/platform-control-plane-uiux.guard.mjs
```

## Evidence packaging

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$SESSION_ID = "PLATFORM_CONTROL_PLANE_UIUX-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RUN_DIR = Join-Path "tools\registry\runs" $SESSION_ID
New-Item -ItemType Directory -Force -Path $RUN_DIR | Out-Null

git --no-pager status --short | Out-File "$RUN_DIR\git-status.txt" -Encoding utf8
git --no-pager diff --name-status | Out-File "$RUN_DIR\git-diff-name-status.txt" -Encoding utf8
git --no-pager diff --check 2>&1 | Out-File "$RUN_DIR\git-diff-check.txt" -Encoding utf8
pnpm -w exec tsc --noEmit 2>&1 | Out-File "$RUN_DIR\tsc-noemit.txt" -Encoding utf8
git ls-files --others --exclude-standard | Out-File "$RUN_DIR\untracked-files.txt" -Encoding utf8
node tools/guards/platform-control-plane-uiux.guard.mjs 2>&1 | Out-File "$RUN_DIR\platform-control-plane-uiux.guard.txt" -Encoding utf8

git --no-pager diff -- . > "$RUN_DIR\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > "$RUN_DIR\LOCAL_CHANGE_UNTRACKED_FILES.txt"

@"
# Visual Evidence Required

Open:
http://localhost:3000/platform

Capture:
- top Overview
- Services tab
- Vars tab
- Providers tab
- Appearance tab
- mobile/narrow viewport if possible

Check:
- RTL
- no overflow
- no developer/debug primary labels
- all live actions disabled
"@ | Out-File "$RUN_DIR\VISUAL_EVIDENCE_REQUIRED.md" -Encoding utf8

Compress-Archive -Path "$RUN_DIR\*" -DestinationPath "$RUN_DIR\$SESSION_ID.zip" -Force

Write-Host "Evidence ZIP: $RUN_DIR\$SESSION_ID.zip"
```

## Local dev server

If needed:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm --dir control-panel/runtime dev --port 3000
```

If port is busy:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force }
```
