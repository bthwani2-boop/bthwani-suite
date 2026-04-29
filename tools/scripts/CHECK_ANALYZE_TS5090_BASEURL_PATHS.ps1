Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_TS5090_BASEURL_PATHS"
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

function Read-JsonLoose {
  param([string]$Path)

  $raw = Get-Content -LiteralPath $Path -Raw -Encoding UTF8

  # Basic JSONC cleanup for comments/trailing commas.
  $clean = $raw -replace '(?m)//.*$', ''
  $clean = $clean -replace '(?s)/\*.*?\*/', ''
  $clean = $clean -replace ',(\s*[}\]])', '$1'

  try {
    return $clean | ConvertFrom-Json
  } catch {
    return $null
  }
}

Write-Section "CHECK: Locate tsconfig files"

$TsConfigFiles = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File -Filter "tsconfig*.json" |
  Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "\\.next\\" -and
    $_.FullName -notmatch "\\dist\\" -and
    $_.FullName -notmatch "\\build\\" -and
    $_.FullName -notmatch "\\coverage\\" -and
    $_.FullName -notmatch "\\tools\\registry\\runs\\" -and
    $_.FullName -notmatch "\\docs\\services\\"
  } |
  Sort-Object FullName

Write-Host "tsconfig files scanned: $($TsConfigFiles.Count)"

$Rows = @()
$Findings = @()

Write-Section "CHECK: Analyze paths/baseUrl"

foreach ($file in $TsConfigFiles) {
  $json = Read-JsonLoose -Path $file.FullName
  $rel = Get-RelPath $file.FullName

  if ($null -eq $json) {
    $Findings += [pscustomobject]@{
      level = "FAIL"
      code = "TSCONFIG_PARSE_FAIL"
      message = "Could not parse tsconfig."
      path = $rel
    }
    continue
  }

  $baseUrl = $null
  $pathsCount = 0
  $badPathTargets = @()
  $hasPaths = $false

  if ($json.compilerOptions) {
    if ($json.compilerOptions.PSObject.Properties.Name -contains "baseUrl") {
      $baseUrl = [string]$json.compilerOptions.baseUrl
    }

    if ($json.compilerOptions.paths) {
      $hasPaths = $true
      foreach ($p in $json.compilerOptions.paths.PSObject.Properties) {
        $alias = $p.Name
        $targets = @($p.Value)
        $pathsCount += $targets.Count

        foreach ($target in $targets) {
          $targetText = [string]$target

          $isRelative = (
            $targetText.StartsWith("./") -or
            $targetText.StartsWith("../") -or
            $targetText.StartsWith("/")
          )

          if ([string]::IsNullOrWhiteSpace($baseUrl) -and -not $isRelative) {
            $badPathTargets += "$alias => $targetText"
          }
        }
      }
    }
  }

  $status = "PASS"
  if ($badPathTargets.Count -gt 0) {
    $status = "FAIL"
    $Findings += [pscustomobject]@{
      level = "FAIL"
      code = "TS5090_BASEURL_MISSING_FOR_NON_RELATIVE_PATHS"
      message = "$($badPathTargets.Count) non-relative path target(s) found while baseUrl is missing."
      path = $rel
    }
  } elseif ($hasPaths -and [string]::IsNullOrWhiteSpace($baseUrl)) {
    $status = "WARN"
    $Findings += [pscustomobject]@{
      level = "WARN"
      code = "PATHS_PRESENT_WITHOUT_BASEURL"
      message = "compilerOptions.paths exists but compilerOptions.baseUrl is missing."
      path = $rel
    }
  }

  $Rows += [pscustomobject]@{
    path = $rel
    extends = if ($json.extends) { [string]$json.extends } else { "" }
    has_compiler_options = [bool]$json.compilerOptions
    baseUrl = if ($baseUrl) { $baseUrl } else { "" }
    has_paths = $hasPaths
    paths_count = $pathsCount
    bad_targets_count = $badPathTargets.Count
    bad_targets = ($badPathTargets -join " | ")
    status = $status
  }
}

$Rows | Format-Table -AutoSize -Wrap

Write-Section "CHECK: Run tsc to capture raw error"

$TscOutputPath = Join-Path $RunRoot "tsc_no_emit_output.txt"
$TscExitCode = 0

try {
  $output = & pnpm -w exec tsc --noEmit 2>&1
  $TscExitCode = $LASTEXITCODE
  $output | Set-Content -LiteralPath $TscOutputPath -Encoding UTF8
} catch {
  $TscExitCode = if ($LASTEXITCODE) { $LASTEXITCODE } else { 1 }
  $_.Exception.Message | Set-Content -LiteralPath $TscOutputPath -Encoding UTF8
}

Write-Host "tsc exit code: $TscExitCode"
Get-Content -LiteralPath $TscOutputPath -Raw -Encoding UTF8

Write-Section "ANALYZE: Judgment"

if ($TscExitCode -ne 0) {
  $Findings += [pscustomobject]@{
    level = "WARN"
    code = "TSC_NO_EMIT_FAILED"
    message = "pnpm -w exec tsc --noEmit failed. See tsc_no_emit_output.txt."
    path = "repo"
  }
}

$Verdict = "PASS"
if (($Findings | Where-Object { $_.level -eq "FAIL" }).Count -gt 0) {
  $Verdict = "FAIL"
} elseif (($Findings | Where-Object { $_.level -eq "WARN" }).Count -gt 0) {
  $Verdict = "WARN"
}

$EvidenceJson = Join-Path $RunRoot "evidence.json"
$SummaryTxt = Join-Path $RunRoot "summary.txt"
$RowsCsv = Join-Path $RunRoot "tsconfig_baseurl_paths_analysis.csv"
$FindingsCsv = Join-Path $RunRoot "findings.csv"
$MergedEvidence = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"

$Rows | Export-Csv -LiteralPath $RowsCsv -NoTypeInformation -Encoding UTF8
$Findings | Export-Csv -LiteralPath $FindingsCsv -NoTypeInformation -Encoding UTF8

$Summary = [ordered]@{
  issue_code = $IssueCode
  session_id = $SessionId
  verdict = $Verdict
  repo_root = $RepoRoot
  evidence_root = $RunRoot
  generated_at = (Get-Date).ToString("o")
  counts = [ordered]@{
    tsconfig_files_scanned = $TsConfigFiles.Count
    failing_tsconfigs = ($Rows | Where-Object { $_.status -eq "FAIL" }).Count
    warning_tsconfigs = ($Rows | Where-Object { $_.status -eq "WARN" }).Count
    tsc_exit_code = $TscExitCode
  }
  tsconfigs = $Rows
  findings = $Findings
}

$Summary | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $EvidenceJson -Encoding UTF8

@"
VERDICT: $Verdict
SESSION_ID: $SessionId
REPO_ROOT: $RepoRoot
EVIDENCE_ROOT: $RunRoot

COUNTS:
- tsconfig files scanned: $($TsConfigFiles.Count)
- failing tsconfigs: $(($Rows | Where-Object { $_.status -eq "FAIL" }).Count)
- warning tsconfigs: $(($Rows | Where-Object { $_.status -eq "WARN" }).Count)
- tsc exit code: $TscExitCode

FAILING / WARNING TSCONFIGS:
$(
  $problemRows = $Rows | Where-Object { $_.status -ne "PASS" }
  if ($problemRows.Count -eq 0) {
    "- PASS: No paths/baseUrl issue detected by static scan."
  } else {
    ($problemRows | ForEach-Object { "- $($_.status): $($_.path) | baseUrl='$($_.baseUrl)' | bad_targets=$($_.bad_targets)" }) -join "`n"
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
- tsconfig_baseurl_paths_analysis.csv
- findings.csv
- tsc_no_emit_output.txt
- MERGED_EVIDENCE_SINGLE_FILE.txt
"@ | Set-Content -LiteralPath $SummaryTxt -Encoding UTF8

Get-Content -LiteralPath $SummaryTxt -Raw -Encoding UTF8 | Set-Content -LiteralPath $MergedEvidence -Encoding UTF8

Write-Host ""
Write-Host "VERDICT: $Verdict" -ForegroundColor $(if ($Verdict -eq "PASS") { "Green" } elseif ($Verdict -eq "WARN") { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "EVIDENCE WRITTEN:" -ForegroundColor Cyan
Write-Host $RunRoot

Write-Host ""
Write-Host "DONE. TS5090 diagnosis completed. No source files were modified." -ForegroundColor Green

Read-Host "Press Enter to finish"
