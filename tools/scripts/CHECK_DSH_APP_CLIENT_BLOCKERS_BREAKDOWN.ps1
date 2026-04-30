Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_DSH_APP_CLIENT_BLOCKERS_BREAKDOWN"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$LatestEvidence = Get-ChildItem -LiteralPath "C:\bthwani-suite\tools\registry\runs" -Recurse -File -Filter "evidence.json" |
  Where-Object { $_.FullName -match "CHECK_DSH_APP_CLIENT_UI_UX_FLOW_CLOSURE" } |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $LatestEvidence) {
  Write-Host "FAIL: No prior CHECK_DSH_APP_CLIENT_UI_UX_FLOW_CLOSURE evidence.json found." -ForegroundColor Red
  return
}

$Evidence = Get-Content -Raw -LiteralPath $LatestEvidence.FullName | ConvertFrom-Json
$Findings = @($Evidence.findings)

$ByCode = $Findings |
  Group-Object code |
  Sort-Object Count -Descending |
  Select-Object Count, Name

$ByFile = $Findings |
  Group-Object path |
  Sort-Object Count -Descending |
  Select-Object Count, Name

$BlockersByFile = $Findings |
  Where-Object { $_.severity -eq "BLOCKER" } |
  Group-Object path |
  Sort-Object Count -Descending |
  Select-Object Count, Name

$Report = [pscustomobject]@{
  issue_code = $IssueCode
  session_id = $SessionId
  source_evidence = $LatestEvidence.FullName
  source_result = $Evidence.result
  source_blockers = $Evidence.blockers
  source_warnings = $Evidence.warnings
  by_code = $ByCode
  by_file = $ByFile
  blockers_by_file = $BlockersByFile
}

$ReportPath = Join-Path $RunRoot "blockers_breakdown.json"
$Report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $ReportPath -Encoding UTF8

Write-Host ""
Write-Host "=== DSH APP-CLIENT BLOCKERS BREAKDOWN ===" -ForegroundColor Cyan
Write-Host "SESSION_ID      : $SessionId"
Write-Host "SOURCE_EVIDENCE : $($LatestEvidence.FullName)"
Write-Host "SOURCE_RESULT   : $($Evidence.result)"
Write-Host "BLOCKERS        : $($Evidence.blockers)"
Write-Host "WARNINGS        : $($Evidence.warnings)"

Write-Host ""
Write-Host "By blocker/warning code:" -ForegroundColor Yellow
$ByCode | Format-Table -AutoSize

Write-Host ""
Write-Host "Top files by finding count:" -ForegroundColor Yellow
$ByFile | Select-Object -First 20 | Format-Table -AutoSize

Write-Host ""
Write-Host "Top files by BLOCKER count:" -ForegroundColor Yellow
$BlockersByFile | Select-Object -First 20 | Format-Table -AutoSize

Write-Host ""
Write-Host "RESULT: FAIL - DSH app-client is NOT UI/UX/Flow sealed." -ForegroundColor Red
Write-Host "Evidence written to:"
Write-Host $RunRoot
