---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: سكريبتات التحقق الطرفية
---

# 33 — سكريبت التحقق قبل الاختبار اليدوي الحي

نفّذ هذا بعد أن ينتهي الوكيل من التصحيح.

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$SessionId = "BTHWANI_PRE_MANUAL_LIVE_VERIFICATION-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
$Results = New-Object System.Collections.Generic.List[object]

function Invoke-Step {
  param([string]$Name,[scriptblock]$Command)
  $OutFile = Join-Path $RunRoot $Name
  "`n>>> $Name" | Tee-Object -FilePath (Join-Path $RunRoot "commands.log") -Append | Out-Null
  $Start = Get-Date
  $ExitCode = 0
  try {
    & $Command *>&1 | Tee-Object -FilePath $OutFile
    if ($null -ne $LASTEXITCODE) { $ExitCode = $LASTEXITCODE }
  } catch {
    $ExitCode = 1
    $_ | Out-String | Tee-Object -FilePath $OutFile -Append
  }
  $End = Get-Date
  $Results.Add([pscustomobject]@{ Step=$Name; ExitCode=$ExitCode; StartedAt=$Start.ToString('o'); FinishedAt=$End.ToString('o') }) | Out-Null
  "`nEXIT_CODE=$ExitCode" | Tee-Object -FilePath $OutFile -Append | Out-Null
}

function Stop-Port3000IfOwnedByDev {
  $Conns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
  if (-not $Conns) { Write-Host "PORT_3000_FREE"; return }
  foreach ($ProcessId in ($Conns | Select-Object -ExpandProperty OwningProcess -Unique)) {
    $Proc = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if (-not $Proc) { continue }
    $Proc | Select-Object Id,ProcessName,Path | Format-List
    if ($Proc.ProcessName -in @('node','pwsh','powershell')) {
      Stop-Process -Id $ProcessId -Force
      Write-Host "STOPPED_PROCESS=$ProcessId"
    } else {
      throw "PORT_3000_OWNED_BY_UNEXPECTED_PROCESS: $($Proc.ProcessName) PID=$ProcessId"
    }
  }
  Start-Sleep -Seconds 3
  if (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue) { throw "PORT_3000_STILL_IN_USE" }
}

Invoke-Step "00-git-status.txt" { git branch --show-current; git rev-parse HEAD; git status --short; git --no-pager diff --stat; git --no-pager diff --name-status }
Invoke-Step "01-runtime-health.txt" {
  docker compose -f .\docker-compose.local.yml ps
  Invoke-WebRequest -Uri "http://localhost:18082/health" -UseBasicParsing -TimeoutSec 10 | Select-Object StatusCode,Content
  Invoke-WebRequest -Uri "http://localhost:8080/stores" -UseBasicParsing -TimeoutSec 20 | Select-Object StatusCode,Content
  Invoke-WebRequest -Uri "http://localhost:18083/health" -UseBasicParsing -TimeoutSec 10 | Select-Object StatusCode,Content
  Invoke-WebRequest -Uri "http://localhost:9000/minio/health/live" -UseBasicParsing -TimeoutSec 10 | Select-Object StatusCode,Content
}
Invoke-Step "02-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
Invoke-Step "03-control-panel-build.txt" { pnpm --dir control-panel/runtime build }
Invoke-Step "04-openapi.txt" { pnpm run openapi:lint:dsh; pnpm run openapi:types:dsh; pnpm run openapi:lint:wlt; pnpm run openapi:types:wlt }
Invoke-Step "05-stop-port-3000.txt" { Stop-Port3000IfOwnedByDev }
Invoke-Step "06-clear-next-cache.txt" { if (Test-Path "control-panel\runtime\.next\cache") { Remove-Item "control-panel\runtime\.next\cache" -Recurse -Force; Write-Host "CACHE_REMOVED" } else { Write-Host "CACHE_NOT_FOUND" } }
Invoke-Step "07-start-control-panel-dev.txt" {
  $ChildScript = Join-Path $RunRoot "start-control-panel-runtime.ps1"
  $StdOut = Join-Path $RunRoot "control-panel.stdout.log"
  $StdErr = Join-Path $RunRoot "control-panel.stderr.log"
@'
Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"
$env:NEXT_PUBLIC_DSH_API_BASE_URL = "http://localhost:8080"
$env:NEXT_PUBLIC_AUTH_BASE_URL = "http://localhost:18082"
$env:EXPO_PUBLIC_AUTH_BASE_URL = "http://localhost:18082"
$env:NEXT_PUBLIC_WLT_DSH_API_BASE_URL = "http://localhost:18083"
$env:BTHWANI_ENV = "local"
$env:BTHWANI_LOCAL_LIVE_TEST = "1"
pnpm --dir control-panel/runtime dev
'@ | Set-Content -LiteralPath $ChildScript -Encoding UTF8
  $Pwsh = (Get-Command pwsh -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -First 1)
  if (-not $Pwsh) { $Pwsh = (Get-Command powershell -ErrorAction Stop | Select-Object -ExpandProperty Source -First 1) }
  $Proc = Start-Process -FilePath $Pwsh -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',$ChildScript) -WorkingDirectory "C:\bthwani-suite" -RedirectStandardOutput $StdOut -RedirectStandardError $StdErr -PassThru
  $Proc.Id | Set-Content -LiteralPath (Join-Path $RunRoot "control-panel.pid") -Encoding UTF8
  Write-Host "CONTROL_PANEL_PID=$($Proc.Id)"
}
Invoke-Step "08-probe-routes.txt" {
  foreach ($Route in @('http://localhost:3000/','http://localhost:3000/administration')) {
    $Ready = $false
    for ($i=1; $i -le 30; $i++) {
      try { $Resp = Invoke-WebRequest -Uri $Route -UseBasicParsing -TimeoutSec 20; Write-Host "ROUTE_OK status=$($Resp.StatusCode) route=$Route"; $Ready = $true; break }
      catch { Write-Host "ROUTE_WAIT attempt=$i route=$Route error=$($_.Exception.Message)"; Start-Sleep -Seconds 3 }
    }
    if (-not $Ready) { throw "ROUTE_NOT_READY: $Route" }
  }
}
Invoke-Step "09-log-regression-scan.txt" {
  $StdErr = Join-Path $RunRoot "control-panel.stderr.log"
  $Snap = Join-Path $RunRoot "control-panel.stderr.snapshot.log"
  if (Test-Path $StdErr) { Get-Content $StdErr -Tail 320 | Tee-Object -FilePath $Snap } else { Write-Host "NO_STDERR_FILE"; return }
  $Blocking = @('Attempted import error','conflicting star exports','Cannot find module','has no exported member','DshPartnerActivationStatus','administration.types','buildStoreCategories','buildStoreDeliveryModes','buildStoreTags','mapStoreDetailToScreenStore')
  $Hits = Select-String -Path $Snap -Pattern $Blocking -SimpleMatch -ErrorAction SilentlyContinue
  if ($Hits) { $Hits | ForEach-Object { "$($_.LineNumber): $($_.Line)" }; throw "BLOCKING_LOG_REGRESSION" }
  $Cache = Select-String -Path $Snap -Pattern 'PackFileCacheStrategy','unexpected end of file','Caching failed for pack' -SimpleMatch -ErrorAction SilentlyContinue
  if ($Cache) { Write-Host "WEBPACK_CACHE_WARNING_NON_BLOCKING"; $Cache | ForEach-Object { "$($_.LineNumber): $($_.Line)" } }
  Write-Host "NO_BLOCKING_LOG_REGRESSION"
}
Invoke-Step "10-guards.txt" {
  node tools/guards/guard-service-runtime.mjs --service dsh
  node tools/guards/guard-service-runtime.mjs --service wlt
  pnpm run guard:service-postgres-runtime
  pnpm run guard:no-broken-imports
  pnpm run guard:ui-kit-central-design-ownership
  pnpm run guard:tamagui-import-boundary
}
Invoke-Step "11-diff-check.txt" { git --no-pager diff --check }
Invoke-Step "12-final-status.txt" { git status --short; git --no-pager diff --stat; git ls-files --others --exclude-standard }

$Failed = $Results | Where-Object { $_.ExitCode -ne 0 }
$StatusAfter = git status --short
$Results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "results.json") -Encoding UTF8

$Summary = @"
# Pre Manual Live Verification

Session: $SessionId
RunRoot: $RunRoot

Failed command count: $($Failed.Count)

Current git status:
$($StatusAfter -join "`n")

Decision:
- If failed count is 0: manual live testing may start gradually.
- If failed count is not 0: fix the failed step first.
"@
$Summary | Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8

$ArchiveSource = Get-ChildItem -LiteralPath $RunRoot -File | Where-Object { $_.Name -notin @('control-panel.stdout.log','control-panel.stderr.log') } | Select-Object -ExpandProperty FullName
Compress-Archive -Path $ArchiveSource -DestinationPath (Join-Path $RunRoot "_HANDOFF.zip") -Force

Write-Host "RESULT: PRE_MANUAL_LIVE_VERIFICATION_CREATED"
Write-Host "RunRoot: $RunRoot"
Write-Host "Open: http://localhost:3000"
Write-Host "Open: http://localhost:3000/administration"
```
