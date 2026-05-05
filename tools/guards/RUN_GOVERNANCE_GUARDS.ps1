$RepoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Get-Location).Path
}
Set-Location -LiteralPath $RepoRoot
$ErrorActionPreference = "Stop"

$Mode = "Local"
$FailOnWarning = $false
for ($i = 0; $i -lt $args.Count; $i++) {
  switch -Regex ($args[$i]) {
    '^-Mode$' {
      if (($i + 1) -ge $args.Count) { throw "-Mode requires Local or CI." }
      $Mode = $args[$i + 1]
      $i++
      continue
    }
    '^-FailOnWarning$' { $FailOnWarning = $true; continue }
    default { throw "Unknown argument: $($args[$i])" }
  }
}

if ($Mode -notin @('Local','CI')) { throw "Invalid -Mode: $Mode" }

$RepoRoot = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "GOVERNANCE_GUARDS-$Timestamp"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

$CommandLog = Join-Path $EvidenceRoot "command-log.txt"
function Log-Line([string]$Message) {
  $line = "$(Get-Date -Format o) $Message"
  $line | Tee-Object -FilePath $CommandLog -Append | Out-Host
}

$Guards = @(
  "guard-governance-sovereignty.mjs",
  "guard-governance-boundaries.mjs",
  "guard-governance-canonical-control-plane.mjs",
  "guard-ui-architecture-boundary.mjs",
  "guard-design-token-drift.mjs",
  "guard-service-contract-matrix.mjs",
  "guard-api-binding-runtime.mjs",
  "guard-evidence-closure.mjs",
  "guard-workflow-ci-parity.mjs"
)

Log-Line "SessionId=$SessionId"
Log-Line "Mode=$Mode"
Log-Line "FailOnWarning=$FailOnWarning"

& git --no-pager status --short 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-status.txt") -Encoding UTF8
& git --no-pager diff --check 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot "diff-check.txt") -Encoding UTF8

$Results = @()
foreach ($Guard in $Guards) {
  $GuardPath = Join-Path $RepoRoot "tools\guards\$Guard"
  if (-not (Test-Path -LiteralPath $GuardPath)) {
    $Results += [pscustomobject]@{
      guardId = $Guard
      status = "FAIL"
      failCount = 1
      warnCount = 0
      error = "Guard file missing"
    }
    Log-Line "MISSING $Guard"
    continue
  }

  $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($Guard)
  $JsonOut = Join-Path $EvidenceRoot "$BaseName.json"
  $MdOut = Join-Path $EvidenceRoot "$BaseName.md"
  $StdOut = Join-Path $EvidenceRoot "$BaseName.stdout.txt"
  $StdErr = Join-Path $EvidenceRoot "$BaseName.stderr.txt"

  Log-Line "RUN node $Guard"
  $Process = Start-Process -FilePath "node" -ArgumentList @($GuardPath, "--root", $RepoRoot, "--mode", $Mode, "--json-out", $JsonOut, "--md-out", $MdOut) -NoNewWindow -Wait -PassThru -RedirectStandardOutput $StdOut -RedirectStandardError $StdErr
  Log-Line "EXIT $Guard code=$($Process.ExitCode)"

  if (Test-Path -LiteralPath $JsonOut) {
    $Result = Get-Content -LiteralPath $JsonOut -Raw | ConvertFrom-Json
    $Results += $Result
  } else {
    $StdOutText = if (Test-Path -LiteralPath $StdOut) { Get-Content -LiteralPath $StdOut -Raw } else { '' }
    $WarnMatch = [regex]::Match($StdOutText, 'Warnings:\s*(\d+)')
    $WarnCount = if ($WarnMatch.Success) { [int]$WarnMatch.Groups[1].Value } elseif ($StdOutText -match '\bWARN\b|PASS_WITH_WARNINGS') { 1 } else { 0 }
    $Status = if ($Process.ExitCode -ne 0 -or $StdOutText -match '\bFAILED\b') {
      'FAIL'
    } elseif ($WarnCount -gt 0) {
      'WARN'
    } else {
      'PASS'
    }

    $Results += [pscustomobject]@{
      guardId = $Guard
      status = $Status
      failCount = if ($Status -eq 'FAIL') { 1 } else { 0 }
      warnCount = $WarnCount
      infoCount = 0
      error = if ($Status -eq 'FAIL') { if ($StdOutText) { $StdOutText.Trim() } else { "Guard did not produce JSON output. ExitCode=$($Process.ExitCode)" } } else { $null }
    }
  }
}

$FailCount = @($Results | Where-Object { $_.status -eq 'FAIL' }).Count
$WarnCount = @($Results | Where-Object { $_.status -eq 'WARN' }).Count
$FinalStatus = if ($FailCount -gt 0) { "FAIL" } elseif ($WarnCount -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }
if ($FailOnWarning -and $WarnCount -gt 0 -and $FailCount -eq 0) { $FinalStatus = "FAIL" }

$Summary = @"
status: $FinalStatus
recommendation: $(if ($FinalStatus -eq 'PASS') { 'READY_FOR_PATCH_REVIEW_OR_PR_GATE' } elseif ($FinalStatus -eq 'PASS_WITH_WARNINGS') { 'REVIEW_WARNINGS_BEFORE_PR' } else { 'FIX_REQUIRED' })
session_id: $SessionId
repo: $RepoRoot
mode: $Mode
evidence_root: $EvidenceRoot
handoff_zip: $EvidenceRoot\_HANDOFF.zip
guards_total: $($Guards.Count)
guards_fail: $FailCount
guards_warn: $WarnCount
"@
$Summary | Set-Content -LiteralPath (Join-Path $EvidenceRoot "summary.txt") -Encoding UTF8

$Evidence = [ordered]@{
  status = $FinalStatus
  recommendation = if ($FinalStatus -eq 'PASS') { 'READY_FOR_PATCH_REVIEW_OR_PR_GATE' } elseif ($FinalStatus -eq 'PASS_WITH_WARNINGS') { 'REVIEW_WARNINGS_BEFORE_PR' } else { 'FIX_REQUIRED' }
  session_id = $SessionId
  repo = $RepoRoot
  mode = $Mode
  evidence_root = $EvidenceRoot
  handoff_zip = "$EvidenceRoot\_HANDOFF.zip"
  guards_total = $Guards.Count
  guards_fail = $FailCount
  guards_warn = $WarnCount
  results = $Results
}
$Evidence | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $EvidenceRoot "evidence.json") -Encoding UTF8

$ZipPath = Join-Path $EvidenceRoot "_HANDOFF.zip"
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
Compress-Archive -Path (Join-Path $EvidenceRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "status: $FinalStatus"
Write-Host "evidence_root: $EvidenceRoot"
Write-Host "handoff_zip: $ZipPath"
Write-Host "guards_fail: $FailCount"
Write-Host "guards_warn: $WarnCount"

if ($FinalStatus -eq 'FAIL') { exit 1 }
if ($FailOnWarning -and $WarnCount -gt 0) { exit 1 }
exit 0
