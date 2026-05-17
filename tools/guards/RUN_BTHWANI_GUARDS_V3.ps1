param(
  [ValidateSet('fast','prepush','governance','architecture','ui','dsh','finance','agent','release')]
  [string]$Profile = 'governance',

  [ValidateSet('GOVERNANCE','ARCHITECTURE','UI_UX_FLOW','API_BINDING','RUNTIME','PRODUCTION','PR_MERGE')]
  [string]$Phase = 'UI_UX_FLOW',

  [ValidateSet('Audit','Ratchet','Release')]
  [string]$Mode = 'Audit',

  [switch]$Strict
)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = 'Stop'
$RepoRoot = (Get-Location).Path
$SessionId = "GUARDS_ROOT_V3-$Profile-$Phase-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Path $EvidenceRoot -Force | Out-Null
$CommandLog = Join-Path $EvidenceRoot 'commands.log'
function Log-Line([string]$Message) { $line = "$(Get-Date -Format o) $Message"; $line | Tee-Object -FilePath $CommandLog -Append | Out-Host }
Log-Line "SessionId=$SessionId"
Log-Line "Profile=$Profile"
Log-Line "Phase=$Phase"
Log-Line "Mode=$Mode"
Log-Line "Strict=$Strict"

git --no-pager status --short 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-status.txt') -Encoding UTF8
git --no-pager diff --check 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-diff-check.txt') -Encoding UTF8

$Guards = @('guard-steward-v3.mjs','guard-phase-scope-v3.mjs')
if ($Profile -in @('ui','dsh','prepush','release')) { $Guards += 'guard-uiux-ratchet-v3.mjs' }
if ($Profile -in @('dsh','finance','release')) { $Guards += 'guard-dsh-platform-vars-v3.mjs' }
if ($Profile -in @('prepush','release')) { $Guards += 'guard-release-readiness-v3.mjs' }

$Results = @()
foreach ($Guard in $Guards) {
  $GuardPath = Join-Path $RepoRoot "tools\guards\$Guard"
  if (-not (Test-Path -LiteralPath $GuardPath)) { throw "Missing guard: $GuardPath" }
  $Base = [System.IO.Path]::GetFileNameWithoutExtension($Guard)
  $JsonOut = Join-Path $EvidenceRoot "$Base.json"
  $MdOut = Join-Path $EvidenceRoot "$Base.md"
  $StdOut = Join-Path $EvidenceRoot "$Base.stdout.txt"
  $StdErr = Join-Path $EvidenceRoot "$Base.stderr.txt"
  $NodeArgs = @($GuardPath, '--root', $RepoRoot, '--profile', $Profile, '--phase', $Phase, '--mode', $Mode, '--json-out', $JsonOut, '--md-out', $MdOut)
  if ($Strict) { $NodeArgs += '--strict' }
  Log-Line "RUN node $Guard"
  $Process = Start-Process -FilePath 'node' -ArgumentList $NodeArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $StdOut -RedirectStandardError $StdErr
  Log-Line "EXIT $Guard code=$($Process.ExitCode)"
  if (Test-Path -LiteralPath $JsonOut) { $Results += (Get-Content -LiteralPath $JsonOut -Raw | ConvertFrom-Json) }
  else { $Results += [pscustomobject]@{ guardId=$Guard; status='FAIL'; failCount=1; warnCount=0; infoCount=0; findings=@() } }
}

$FailCount = @($Results | Where-Object { $_.status -eq 'FAIL' }).Count
$WarnCount = @($Results | Where-Object { $_.status -eq 'WARN' }).Count
$FinalStatus = if ($FailCount -gt 0) { 'FAIL' } elseif ($WarnCount -gt 0) { 'WARN' } else { 'PASS' }
$ZipPath = Join-Path $EvidenceRoot "$SessionId.zip"
$Summary = @("# BThwani Root Guards V3 Run", "", "- status: $FinalStatus", "- session_id: $SessionId", "- profile: $Profile", "- phase: $Phase", "- mode: $Mode", "- evidence_root: $EvidenceRoot", "- zip: $ZipPath", "- fail_count: $FailCount", "- warn_count: $WarnCount", "", "| Guard | Status | Fail | Warn | Info |", "|---|---|---:|---:|---:|")
foreach ($R in $Results) { $Summary += "| $($R.guardId) | $($R.status) | $($R.failCount) | $($R.warnCount) | $($R.infoCount) |" }
$Summary | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'SUMMARY.md') -Encoding UTF8
[ordered]@{ status=$FinalStatus; session_id=$SessionId; profile=$Profile; phase=$Phase; mode=$Mode; evidence_root=$EvidenceRoot; zip=$ZipPath; results=$Results } | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'evidence.json') -Encoding UTF8
Compress-Archive -Path (Join-Path $EvidenceRoot '*') -DestinationPath $ZipPath -Force
Write-Host ""
Write-Host "status: $FinalStatus"
Write-Host "evidence_root: $EvidenceRoot"
Write-Host "zip: $ZipPath"
Write-Host "guards_fail: $FailCount"
Write-Host "guards_warn: $WarnCount"
if ($FinalStatus -eq 'FAIL') { exit 1 }
exit 0
