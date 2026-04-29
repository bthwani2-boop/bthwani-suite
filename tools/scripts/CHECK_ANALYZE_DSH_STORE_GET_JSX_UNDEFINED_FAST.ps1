Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_DSH_STORE_GET_JSX_UNDEFINED_FAST"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$TargetPath = Join-Path $RepoRoot "packages\surfaces\src\service-owned\dsh\app-client\stores\screens\DshStoreGetScreen.tsx"

$Findings = New-Object System.Collections.Generic.List[object]
$Rows = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$RowsPath = Join-Path $RunRoot "JSX_SOURCE_CHECKS.csv"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"

function Add-Finding {
  param([string]$Code,[string]$Severity,[string]$Path,[string]$Evidence,[string]$Action)
  $Findings.Add([pscustomobject]@{
    code=$Code; severity=$Severity; path=$Path; evidence=$Evidence; action=$Action
  }) | Out-Null

  $Color = if ($Severity -eq "PASS") { "Green" } elseif ($Severity -eq "INFO") { "Cyan" } elseif ($Severity -eq "WARN") { "Yellow" } else { "Red" }
  Write-Host "[$Severity] $Code — $Path" -ForegroundColor $Color
}

try {
  Write-Host ""
  Write-Host "CHECK DSH STORE GET JSX UNDEFINED FAST" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $TargetPath)) {
    throw "Missing target file: $TargetPath"
  }

  $Text = Get-Content -LiteralPath $TargetPath -Raw -Encoding UTF8

  $Known = New-Object System.Collections.Generic.HashSet[string]

  foreach ($m in [regex]::Matches($Text, '(?m)^\s*(?:export\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)\b')) {
    [void]$Known.Add($m.Groups[1].Value)
  }

  foreach ($m in [regex]::Matches($Text, '(?m)^\s*import\s+([A-Z][A-Za-z0-9_]*)\s+from\s+["''][^"'']+["'']')) {
    [void]$Known.Add($m.Groups[1].Value)
  }

  foreach ($m in [regex]::Matches($Text, '(?m)^\s*import\s+\*\s+as\s+([A-Z][A-Za-z0-9_]*)\s+from\s+["''][^"'']+["'']')) {
    [void]$Known.Add($m.Groups[1].Value)
  }

  foreach ($m in [regex]::Matches($Text, '(?s)import\s+\{([^}]+)\}\s+from\s+["''][^"'']+["'']')) {
    foreach ($raw in $m.Groups[1].Value.Split(",")) {
      $name = $raw.Trim()
      if ([string]::IsNullOrWhiteSpace($name)) { continue }
      if ($name.StartsWith("type ")) { continue }

      if ($name -match '^([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$') {
        [void]$Known.Add($Matches[2])
      } elseif ($name -match '^([A-Za-z_][A-Za-z0-9_]*)$') {
        [void]$Known.Add($Matches[1])
      }
    }
  }

  $JsxNames = New-Object System.Collections.Generic.HashSet[string]

  foreach ($m in [regex]::Matches($Text, '<([A-Z][A-Za-z0-9_\.]*)\b')) {
    [void]$JsxNames.Add($m.Groups[1].Value)
  }

  foreach ($jsx in $JsxNames) {
    $root = ($jsx -split '\.')[0]
    $knownRoot = $Known.Contains($root)

    $Rows.Add([pscustomobject]@{
      jsx = $jsx
      root = $root
      root_has_static_source = $knownRoot
      decision = if ($knownRoot) { "STATIC_SOURCE_FOUND" } else { "UNRESOLVED_STATIC_SOURCE" }
    }) | Out-Null

    if (-not $knownRoot) {
      Add-Finding `
        -Code "JSX_ROOT_UNRESOLVED" `
        -Severity "BLOCKER" `
        -Path "DshStoreGetScreen.tsx" `
        -Evidence "<$jsx> root '$root' is not local/imported." `
        -Action "Fix missing import/local definition for this JSX component."
    }
  }

  $Blockers = @($Findings | Where-Object { $_.severity -eq "BLOCKER" })

  if ($Blockers.Count -eq 0) {
    Add-Finding `
      -Code "NO_STATIC_JSX_SOURCE_GAP_FOUND" `
      -Severity "INFO" `
      -Path "DshStoreGetScreen.tsx" `
      -Evidence "All JSX roots have local/import static source." `
      -Action "If runtime persists, next step is a tiny runtime probe for actual undefined values."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_ANALYZE_DSH_STORE_GET_JSX_UNDEFINED_FAST" `
    -Evidence $_.Exception.Message `
    -Action "Fix this bounded check only."
}

$Rows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RowsPath
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Blockers = @($Findings | Where-Object { $_.severity -eq "BLOCKER" })
$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Blockers.Count -gt 0) { "BLOCKED" } else { "PASS" }

$Summary = @"
# CHECK ANALYZE — DshStoreGetScreen JSX Undefined FAST

Session: $SessionId
Status: $Status

## Scope

Only DshStoreGetScreen.tsx.
No repo scan.
No tsc.
No Metro.

## Evidence

- Findings: $FindingsPath
- JSX checks: $RowsPath
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-09 DSH STORE GET JSX STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "BLOCKED") { "Red" } else { "Red" })
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
Write-Host "JSX checks: $RowsPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
