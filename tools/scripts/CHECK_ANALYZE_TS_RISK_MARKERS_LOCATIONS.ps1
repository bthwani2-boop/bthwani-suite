Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_TS_RISK_MARKERS_LOCATIONS"
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

function Get-RelPath {
  param([string]$Path)
  return $Path.Substring($RepoRoot.Length).TrimStart("\")
}

$GeneratedOrIgnoredRegex = "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\|\\tools\\registry\\runs\\"
$LegacyTrashRegex = "\\docs\\services\\surfaces-legacy-trash\\"

Write-Section "CHECK: Active Source Files"

$ActiveSourceFiles = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File |
  Where-Object {
    $_.FullName -notmatch $GeneratedOrIgnoredRegex -and
    $_.FullName -notmatch $LegacyTrashRegex -and
    $_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs")
  } |
  Sort-Object FullName

Write-Host "Active source files scanned: $($ActiveSourceFiles.Count)"

$Patterns = @(
  [pscustomobject]@{
    code = "TS_IGNORE"
    regex = "@ts-ignore"
    severity = "WARN"
  },
  [pscustomobject]@{
    code = "TS_EXPECT_ERROR"
    regex = "@ts-expect-error"
    severity = "INFO"
  },
  [pscustomobject]@{
    code = "ANY_TYPE"
    regex = ":\s*any\b"
    severity = "WARN"
  },
  [pscustomobject]@{
    code = "REQUIRE_USAGE"
    regex = "\brequire\s*\("
    severity = "WARN"
  }
)

Write-Section "CHECK: Risk Marker Locations"

$Matches = @()

foreach ($pattern in $Patterns) {
  $hits = Select-String -LiteralPath ($ActiveSourceFiles.FullName) -Pattern $pattern.regex -ErrorAction SilentlyContinue

  foreach ($hit in $hits) {
    $Matches += [pscustomobject]@{
      severity = $pattern.severity
      code = $pattern.code
      path = Get-RelPath $hit.Path
      line = $hit.LineNumber
      text = $hit.Line.Trim()
    }
  }
}

$Grouped = $Matches |
  Group-Object code |
  Sort-Object Name |
  ForEach-Object {
    [pscustomobject]@{
      code = $_.Name
      matches = $_.Count
      files = ($_.Group | Select-Object -ExpandProperty path -Unique).Count
    }
  }

$Grouped | Format-Table -AutoSize

Write-Section "DETAIL: Exact Locations"

if ($Matches.Count -eq 0) {
  Write-Host "PASS: No ts-ignore / any / require risk markers found." -ForegroundColor Green
} else {
  $Matches |
    Sort-Object code,path,line |
    Format-Table severity,code,path,line,text -AutoSize -Wrap
}

Write-Section "ANALYZE: Judgment"

$Findings = @()

$TsIgnoreCount = ($Matches | Where-Object { $_.code -eq "TS_IGNORE" }).Count
$AnyCount = ($Matches | Where-Object { $_.code -eq "ANY_TYPE" }).Count
$RequireCount = ($Matches | Where-Object { $_.code -eq "REQUIRE_USAGE" }).Count

if ($TsIgnoreCount -gt 0) {
  $Findings += [pscustomobject]@{
    level = "WARN"
    code = "TS_IGNORE_PRESENT"
    message = "$TsIgnoreCount @ts-ignore marker(s) found. This must be justified or removed."
  }
}

if ($AnyCount -gt 0) {
  $Findings += [pscustomobject]@{
    level = "WARN"
    code = "ANY_TYPE_PRESENT"
    message = "$AnyCount explicit any type marker(s) found. Replace with precise types where possible."
  }
}

if ($RequireCount -gt 0) {
  $Findings += [pscustomobject]@{
    level = "WARN"
    code = "REQUIRE_USAGE_PRESENT"
    message = "$RequireCount require(...) usage marker(s) found. Classify config/runtime/tooling before conversion."
  }
}

$Verdict = if ($Findings.Count -gt 0) { "WARN" } else { "PASS" }

$EvidenceJson = Join-Path $RunRoot "evidence.json"
$SummaryTxt = Join-Path $RunRoot "summary.txt"
$LocationsCsv = Join-Path $RunRoot "risk_marker_locations.csv"
$GroupedCsv = Join-Path $RunRoot "risk_marker_summary.csv"
$FindingsCsv = Join-Path $RunRoot "findings.csv"

$Summary = [ordered]@{
  issue_code = $IssueCode
  session_id = $SessionId
  verdict = $Verdict
  repo_root = $RepoRoot
  evidence_root = $RunRoot
  generated_at = (Get-Date).ToString("o")
  counts = [ordered]@{
    active_source_files_scanned = $ActiveSourceFiles.Count
    total_risk_matches = $Matches.Count
    ts_ignore = $TsIgnoreCount
    any_type = $AnyCount
    require_usage = $RequireCount
  }
  risk_marker_summary = $Grouped
  risk_marker_locations = $Matches
  findings = $Findings
}

$Summary | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $EvidenceJson -Encoding UTF8
$Matches | Export-Csv -LiteralPath $LocationsCsv -NoTypeInformation -Encoding UTF8
$Grouped | Export-Csv -LiteralPath $GroupedCsv -NoTypeInformation -Encoding UTF8

if ($Findings.Count -eq 0) {
  [pscustomobject]@{
    level = "PASS"
    code = "NO_RISK_MARKERS"
    message = "No risk markers found."
  } | Export-Csv -LiteralPath $FindingsCsv -NoTypeInformation -Encoding UTF8
} else {
  $Findings | Export-Csv -LiteralPath $FindingsCsv -NoTypeInformation -Encoding UTF8
}

@"
VERDICT: $Verdict
SESSION_ID: $SessionId
REPO_ROOT: $RepoRoot
EVIDENCE_ROOT: $RunRoot

COUNTS:
- active source files scanned: $($ActiveSourceFiles.Count)
- total risk matches: $($Matches.Count)
- TS_IGNORE: $TsIgnoreCount
- ANY_TYPE: $AnyCount
- REQUIRE_USAGE: $RequireCount

FINDINGS:
$(
  if ($Findings.Count -eq 0) {
    "- PASS: No risk markers found."
  } else {
    ($Findings | ForEach-Object { "- $($_.level): $($_.code) — $($_.message)" }) -join "`n"
  }
)

EVIDENCE FILES:
- evidence.json
- summary.txt
- risk_marker_locations.csv
- risk_marker_summary.csv
- findings.csv
"@ | Set-Content -LiteralPath $SummaryTxt -Encoding UTF8

Write-Host ""
Write-Host "VERDICT: $Verdict" -ForegroundColor $(if ($Verdict -eq "PASS") { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "COUNTS:" -ForegroundColor Cyan
Write-Host "active source files scanned: $($ActiveSourceFiles.Count)"
Write-Host "total risk matches         : $($Matches.Count)"
Write-Host "TS_IGNORE                  : $TsIgnoreCount"
Write-Host "ANY_TYPE                   : $AnyCount"
Write-Host "REQUIRE_USAGE              : $RequireCount"

Write-Host ""
Write-Host "EVIDENCE WRITTEN:" -ForegroundColor Cyan
Write-Host $RunRoot

Write-Host ""
Write-Host "DONE. Exact locations printed and evidence generated." -ForegroundColor Green

Read-Host "Press Enter to finish"
