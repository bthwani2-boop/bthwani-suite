Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_PLAN_TS_FIX_LANES_CURRENT"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "$IssueCode-$Timestamp"
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Write-Section {
  param([string]$Title)
  Write-Host ""
  Write-Host "============================================================" -ForegroundColor DarkGray
  Write-Host $Title -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor DarkGray
}

function Get-LatestRun {
  param([string]$Prefix)

  $RunsRoot = Join-Path $RepoRoot "tools\registry\runs"
  return Get-ChildItem -LiteralPath $RunsRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "$Prefix-*" } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
}

function Get-Lane {
  param(
    [string]$Classification,
    [string]$Path,
    [string]$Action
  )

  if ($Action -eq "KEEP") {
    return "LANE-04_ACCEPTED_REQUIRE_UNTOUCHED"
  }

  if ($Path -match "^packages\\ui-kit\\src\\") {
    return "LANE-03_UIKIT_ROOT_SHIM_PROXY_CLEANUP"
  }

  if ($Path -eq "packages\surfaces\src\service-owned\dsh\app-client\DshSurfaceHost.tsx") {
    return "LANE-02_DSH_APP_CLIENT_SURFACEHOST_REGISTRY_CASTS"
  }

  if ($Path -match "^packages\\surfaces\\") {
    return "LANE-01_SURFACE_SMALL_TYPE_FIXES"
  }

  return "LANE-99_REVIEW_REQUIRED"
}

Write-Section "CHECK: Locate Evidence Sources"

$LatestRebase = Get-LatestRun -Prefix "CHECK_REBASE_ACTIVE_TS_RISK_QUEUE_CURRENT"
$LatestUnknown = Get-LatestRun -Prefix "CHECK_CLASSIFY_UNKNOWN_ANY_MARKERS_CURRENT"

if (-not $LatestRebase) {
  throw "Missing CHECK_REBASE_ACTIVE_TS_RISK_QUEUE_CURRENT evidence run."
}

if (-not $LatestUnknown) {
  throw "Missing CHECK_CLASSIFY_UNKNOWN_ANY_MARKERS_CURRENT evidence run."
}

$RebaseFixQueueCsv = Join-Path $LatestRebase.FullName "current_fix_queue.csv"
$AcceptedCsv = Join-Path $LatestRebase.FullName "accepted_markers.csv"
$UnknownReclassCsv = Join-Path $LatestUnknown.FullName "unknown_any_reclassification.csv"

if (-not (Test-Path -LiteralPath $RebaseFixQueueCsv)) {
  throw "Missing current_fix_queue.csv: $RebaseFixQueueCsv"
}

if (-not (Test-Path -LiteralPath $AcceptedCsv)) {
  throw "Missing accepted_markers.csv: $AcceptedCsv"
}

if (-not (Test-Path -LiteralPath $UnknownReclassCsv)) {
  throw "Missing unknown_any_reclassification.csv: $UnknownReclassCsv"
}

Write-Host "Rebase run  : $($LatestRebase.FullName)"
Write-Host "Unknown run : $($LatestUnknown.FullName)"
Write-Host "RunRoot     : $RunRoot"

Write-Section "CHECK: Load Queues"

$FixQueueRaw = Import-Csv -LiteralPath $RebaseFixQueueCsv
$AcceptedRaw = Import-Csv -LiteralPath $AcceptedCsv
$UnknownReclass = Import-Csv -LiteralPath $UnknownReclassCsv

$ReclassMap = @{}
foreach ($row in $UnknownReclass) {
  $key = "$($row.path)|$($row.line)|$($row.text)"
  $ReclassMap[$key] = $row
}

$FinalFixQueue = @()

foreach ($row in $FixQueueRaw) {
  $key = "$($row.path)|$($row.line)|$($row.text)"

  $classification = [string]$row.classification
  $action = [string]$row.action
  $priority = [string]$row.priority
  $reason = [string]$row.reason

  if ($ReclassMap.ContainsKey($key)) {
    $replacement = $ReclassMap[$key]
    $classification = [string]$replacement.new_classification
    $action = [string]$replacement.action
    $priority = [string]$replacement.priority
    $reason = [string]$replacement.reason
  }

  $lane = Get-Lane -Classification $classification -Path ([string]$row.path) -Action $action

  $FinalFixQueue += [pscustomobject]@{
    lane = $lane
    priority = $priority
    code = [string]$row.code
    classification = $classification
    action = $action
    path = [string]$row.path
    line = [int]$row.line
    text = [string]$row.text
    reason = $reason
    sha256 = [string]$row.sha256
  }
}

$AcceptedFinal = @()
foreach ($row in $AcceptedRaw) {
  $lane = Get-Lane -Classification ([string]$row.classification) -Path ([string]$row.path) -Action ([string]$row.action)

  $AcceptedFinal += [pscustomobject]@{
    lane = $lane
    priority = [string]$row.priority
    code = [string]$row.code
    classification = [string]$row.classification
    action = [string]$row.action
    path = [string]$row.path
    line = [int]$row.line
    text = [string]$row.text
    reason = [string]$row.reason
    sha256 = [string]$row.sha256
  }
}

$StillUnknown = $FinalFixQueue | Where-Object { $_.classification -match "^UNKNOWN_" -or $_.action -eq "REVIEW_REQUIRED" }

Write-Section "SUMMARY: Lane Counts"

$LaneSummary = $FinalFixQueue |
  Group-Object lane |
  Sort-Object Name |
  ForEach-Object {
    [pscustomobject]@{
      lane = $_.Name
      markers = $_.Count
      files = ($_.Group | Select-Object -ExpandProperty path -Unique).Count
      classifications = (($_.Group | Select-Object -ExpandProperty classification -Unique) -join "; ")
    }
  }

$LaneSummary | Format-Table -AutoSize -Wrap

Write-Section "SUMMARY: Accepted Markers"

$AcceptedSummary = $AcceptedFinal |
  Group-Object classification |
  Sort-Object Name |
  ForEach-Object {
    [pscustomobject]@{
      classification = $_.Name
      markers = $_.Count
      files = ($_.Group | Select-Object -ExpandProperty path -Unique).Count
    }
  }

$AcceptedSummary | Format-Table -AutoSize -Wrap

Write-Section "ANALYZE: Judgment"

$Findings = @()

if ($StillUnknown.Count -gt 0) {
  $Findings += [pscustomobject]@{
    level = "FAIL"
    code = "UNKNOWN_MARKERS_STILL_PRESENT"
    message = "$($StillUnknown.Count) marker(s) still unknown after lane planning."
    path = "repo"
  }
}

$UiKitLane = $FinalFixQueue | Where-Object { $_.lane -eq "LANE-03_UIKIT_ROOT_SHIM_PROXY_CLEANUP" }
if ($UiKitLane.Count -gt 0) {
  $Findings += [pscustomobject]@{
    level = "WARN"
    code = "UIKIT_ROOT_LANE_REQUIRES_SEPARATE_GATE"
    message = "$($UiKitLane.Count) ui-kit marker(s) require a separate root shim/proxy cleanup gate."
    path = "packages\ui-kit\src"
  }
}

$SurfaceLane = $FinalFixQueue | Where-Object { $_.lane -eq "LANE-01_SURFACE_SMALL_TYPE_FIXES" }
if ($SurfaceLane.Count -gt 0) {
  $Findings += [pscustomobject]@{
    level = "WARN"
    code = "SURFACE_SMALL_FIXES_READY_FOR_CONTEXT"
    message = "$($SurfaceLane.Count) surface marker(s) are ready for context capture and targeted patching."
    path = "packages\surfaces"
  }
}

$Verdict = "PASS"
if (($Findings | Where-Object { $_.level -eq "FAIL" }).Count -gt 0) {
  $Verdict = "FAIL"
} elseif (($Findings | Where-Object { $_.level -eq "WARN" }).Count -gt 0) {
  $Verdict = "WARN"
}

$FinalFixQueueCsv = Join-Path $RunRoot "final_fix_queue_by_lane.csv"
$LaneSummaryCsv = Join-Path $RunRoot "lane_summary.csv"
$AcceptedFinalCsv = Join-Path $RunRoot "accepted_markers_final.csv"
$FindingsCsv = Join-Path $RunRoot "findings.csv"
$EvidenceJson = Join-Path $RunRoot "evidence.json"
$SummaryTxt = Join-Path $RunRoot "summary.txt"
$MergedEvidence = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"

$FinalFixQueue | Export-Csv -LiteralPath $FinalFixQueueCsv -NoTypeInformation -Encoding UTF8
$LaneSummary | Export-Csv -LiteralPath $LaneSummaryCsv -NoTypeInformation -Encoding UTF8
$AcceptedFinal | Export-Csv -LiteralPath $AcceptedFinalCsv -NoTypeInformation -Encoding UTF8

if ($Findings.Count -gt 0) {
  $Findings | Export-Csv -LiteralPath $FindingsCsv -NoTypeInformation -Encoding UTF8
} else {
  [pscustomobject]@{ level="PASS"; code="NO_FINDINGS"; message="No findings."; path="" } |
    Export-Csv -LiteralPath $FindingsCsv -NoTypeInformation -Encoding UTF8
}

$Summary = [ordered]@{
  issue_code = $IssueCode
  session_id = $SessionId
  verdict = $Verdict
  repo_root = $RepoRoot
  evidence_root = $RunRoot
  source_rebase_run = $LatestRebase.FullName
  source_unknown_run = $LatestUnknown.FullName
  generated_at = (Get-Date).ToString("o")
  counts = [ordered]@{
    final_fix_queue = $FinalFixQueue.Count
    accepted_markers = $AcceptedFinal.Count
    lanes = $LaneSummary.Count
    still_unknown = $StillUnknown.Count
  }
  lane_summary = $LaneSummary
  accepted_summary = $AcceptedSummary
  findings = $Findings
}

$Summary | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $EvidenceJson -Encoding UTF8

@"
VERDICT: $Verdict
SESSION_ID: $SessionId
REPO_ROOT: $RepoRoot
EVIDENCE_ROOT: $RunRoot
SOURCE_REBASE_RUN: $($LatestRebase.FullName)
SOURCE_UNKNOWN_RUN: $($LatestUnknown.FullName)

COUNTS:
- final fix queue: $($FinalFixQueue.Count)
- accepted markers: $($AcceptedFinal.Count)
- lanes: $($LaneSummary.Count)
- still unknown: $($StillUnknown.Count)

LANE SUMMARY:
$(
  if ($LaneSummary.Count -eq 0) {
    "- PASS: No fix lanes."
  } else {
    ($LaneSummary | ForEach-Object { "- $($_.lane) | markers=$($_.markers) | files=$($_.files) | classifications=$($_.classifications)" }) -join "`n"
  }
)

ACCEPTED SUMMARY:
$(
  if ($AcceptedSummary.Count -eq 0) {
    "- No accepted markers."
  } else {
    ($AcceptedSummary | ForEach-Object { "- $($_.classification) | markers=$($_.markers) | files=$($_.files)" }) -join "`n"
  }
)

FINDINGS:
$(
  if ($Findings.Count -eq 0) {
    "- PASS: No findings."
  } else {
    ($Findings | ForEach-Object { "- $($_.level): $($_.code) — $($_.message) $($_.path)" }) -join "`n"
  }
)

EVIDENCE FILES:
- evidence.json
- summary.txt
- final_fix_queue_by_lane.csv
- lane_summary.csv
- accepted_markers_final.csv
- findings.csv
- MERGED_EVIDENCE_SINGLE_FILE.txt
"@ | Set-Content -LiteralPath $SummaryTxt -Encoding UTF8

Get-Content -LiteralPath $SummaryTxt -Raw -Encoding UTF8 | Set-Content -LiteralPath $MergedEvidence -Encoding UTF8

Write-Host ""
Write-Host "VERDICT: $Verdict" -ForegroundColor $(if ($Verdict -eq "PASS") { "Green" } elseif ($Verdict -eq "WARN") { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "COUNTS:" -ForegroundColor Cyan
Write-Host "final fix queue : $($FinalFixQueue.Count)"
Write-Host "accepted markers: $($AcceptedFinal.Count)"
Write-Host "lanes           : $($LaneSummary.Count)"
Write-Host "still unknown   : $($StillUnknown.Count)"

Write-Host ""
Write-Host "EVIDENCE WRITTEN:" -ForegroundColor Cyan
Write-Host $RunRoot
Write-Host ""
Write-Host "DONE. Lane planning completed. No source files were modified." -ForegroundColor Green

Read-Host "Press Enter to finish"
