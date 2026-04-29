Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_UIKIT_PUBLIC_EXPORT_BRIDGE_SOURCES"
$RepoRoot = "C:\bthwani-suite"
$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$RunsRoot = Join-Path $RepoRoot "tools\registry\runs"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path $RunsRoot $SessionId

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host $Message -ForegroundColor Cyan
}

function Write-Warn {
  param([string]$Message)
  Write-Host ("WARN: " + $Message) -ForegroundColor Yellow
}

function Write-Pass {
  param([string]$Message)
  Write-Host ("PASS: " + $Message) -ForegroundColor Green
}

function Write-Fail {
  param([string]$Message)
  Write-Host ("FAIL: " + $Message) -ForegroundColor Red
}

function Normalize-PathText {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return "" }
  return (($Path -replace "\\", "/") -replace "/+", "/")
}

function Get-RelativePathSafe {
  param([string]$BasePath, [string]$TargetPath)

  $baseFull = [System.IO.Path]::GetFullPath($BasePath)
  if (-not $baseFull.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $baseFull = $baseFull + [System.IO.Path]::DirectorySeparatorChar
  }

  $targetFull = [System.IO.Path]::GetFullPath($TargetPath)
  $baseUri = New-Object System.Uri($baseFull)
  $targetUri = New-Object System.Uri($targetFull)
  $relative = $baseUri.MakeRelativeUri($targetUri).ToString()
  $relative = [System.Uri]::UnescapeDataString($relative)
  return Normalize-PathText ($relative -replace "/", [System.IO.Path]::DirectorySeparatorChar)
}

function Read-TextFileSafe {
  param([string]$Path)
  try {
    return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  } catch {
    try { return Get-Content -LiteralPath $Path -Raw } catch { return "" }
  }
}

function Test-ExcludedPath {
  param([string]$Path)

  $p = Normalize-PathText $Path
  $excluded = @(
    "/node_modules/",
    "/.git/",
    "/.next/",
    "/dist/",
    "/build/",
    "/coverage/",
    "/.turbo/",
    "/.nx/",
    "/android/",
    "/ios/",
    "/docs/services/surfaces-legacy-trash/",
    "/tools/registry/runs/"
  )

  foreach ($x in $excluded) {
    if ($p.Contains($x)) { return $true }
  }

  return $false
}

function Find-LatestRunFile {
  param(
    [string]$RunName,
    [string]$FileName
  )

  if (-not (Test-Path -LiteralPath $RunsRoot)) {
    return $null
  }

  $files = Get-ChildItem -LiteralPath $RunsRoot -Recurse -File -Filter $FileName |
    Where-Object { $_.FullName -match [regex]::Escape($RunName) } |
    Sort-Object LastWriteTime -Descending

  if (@($files).Count -eq 0) {
    return $null
  }

  return $files[0].FullName
}

function Export-CsvSafe {
  param(
    [object[]]$Rows,
    [string]$Path,
    [string[]]$Headers
  )

  if ($Rows.Count -gt 0) {
    $Rows | Export-Csv -LiteralPath $Path -NoTypeInformation -Encoding UTF8
    return
  }

  ($Headers -join ",") | Set-Content -LiteralPath $Path -Encoding UTF8
}

function Test-SymbolExportedInContent {
  param(
    [string]$Content,
    [string]$Symbol
  )

  $escaped = [regex]::Escape($Symbol)

  $patterns = @(
    "(?m)^\s*export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+$escaped\b",
    "(?m)^\s*export\s*\{[^}]*\b$escaped\b[^}]*\}",
    "(?m)^\s*export\s+type\s*\{[^}]*\b$escaped\b[^}]*\}"
  )

  foreach ($pattern in $patterns) {
    if ($Content -match $pattern) {
      return $true
    }
  }

  return $false
}

function Test-SymbolDeclaredButNotExported {
  param(
    [string]$Content,
    [string]$Symbol
  )

  $escaped = [regex]::Escape($Symbol)

  $patterns = @(
    "(?m)^\s*(?:const|let|var|function|class|interface|type|enum)\s+$escaped\b",
    "(?m)^\s*type\s+$escaped\b",
    "(?m)^\s*interface\s+$escaped\b"
  )

  foreach ($pattern in $patterns) {
    if ($Content -match $pattern) {
      return $true
    }
  }

  return $false
}

try {
  Write-Step "CHECK_ANALYZE_UIKIT_PUBLIC_EXPORT_BRIDGE_SOURCES"
  Write-Host "RepoRoot: $RepoRoot"
  Write-Host "UiKitSrc: $UiKitSrc"
  Write-Host "RunRoot:  $RunRoot"

  New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "ui-kit src not found: $UiKitSrc"
  }

  $PublicExportGapsPath = Find-LatestRunFile -RunName "CHECK_ANALYZE_UIKIT_COMPAT_BRIDGE_PLAN" -FileName "public_export_gaps.csv"

  if (-not $PublicExportGapsPath) {
    throw "Missing latest public_export_gaps.csv from CHECK_ANALYZE_UIKIT_COMPAT_BRIDGE_PLAN"
  }

  Write-Step "Loading public export gaps"
  Write-Host "public_export_gaps.csv: $PublicExportGapsPath"

  $PublicExportGaps = @(Import-Csv -LiteralPath $PublicExportGapsPath)

  $UiFiles = @(
    Get-ChildItem -LiteralPath $UiKitSrc -Recurse -File |
      Where-Object {
        (-not (Test-ExcludedPath $_.FullName)) -and
        ($_.Extension -in @(".ts", ".tsx"))
      } |
      Sort-Object FullName
  )

  Write-Step "Scanning ui-kit source files"

  $SourceMatches = New-Object System.Collections.ArrayList
  $BridgePlan = New-Object System.Collections.ArrayList
  $Blockers = New-Object System.Collections.ArrayList

  foreach ($gap in $PublicExportGaps) {
    $symbol = [string]$gap.Symbol
    if ([string]::IsNullOrWhiteSpace($symbol)) {
      continue
    }

    $matches = New-Object System.Collections.ArrayList

    foreach ($file in $UiFiles) {
      $content = Read-TextFileSafe -Path $file.FullName
      if ([string]::IsNullOrWhiteSpace($content)) {
        continue
      }

      $isExported = Test-SymbolExportedInContent -Content $content -Symbol $symbol
      $isDeclared = Test-SymbolDeclaredButNotExported -Content $content -Symbol $symbol

      if ($isExported -or $isDeclared) {
        $rel = Get-RelativePathSafe -BasePath $UiKitSrc -TargetPath $file.FullName

        [void]$matches.Add([pscustomobject]@{
          Symbol = $symbol
          SourcePath = $rel
          MatchKind = $(if ($isExported) { "EXPORTED" } else { "DECLARED_NOT_EXPORTED" })
          RiskCount = [int]$gap.RiskCount
          AffectedFileCount = [int]$gap.AffectedFileCount
          ExampleImporter = [string]$gap.ExampleImporter
        })
      }
    }

    foreach ($m in $matches) {
      [void]$SourceMatches.Add($m)
    }

    if ($matches.Count -eq 0) {
      [void]$BridgePlan.Add([pscustomobject]@{
        Symbol = $symbol
        Status = "BLOCKED_SOURCE_NOT_FOUND"
        SourcePath = ""
        RecommendedExportLine = ""
        RiskCount = [int]$gap.RiskCount
        AffectedFileCount = [int]$gap.AffectedFileCount
        ExampleImporter = [string]$gap.ExampleImporter
      })

      [void]$Blockers.Add([pscustomobject]@{
        BlockerType = "SOURCE_NOT_FOUND"
        Severity = "HIGH"
        Symbol = $symbol
        Detail = "No exported or declared symbol found in ui-kit src."
      })

      continue
    }

    $exportedMatches = @($matches | Where-Object { $_.MatchKind -eq "EXPORTED" })

    if ($exportedMatches.Count -eq 1) {
      $source = [string]$exportedMatches[0].SourcePath
      $sourceNoExt = $source -replace '\.tsx?$', ''
      $sourceNoExt = "./" + $sourceNoExt

      [void]$BridgePlan.Add([pscustomobject]@{
        Symbol = $symbol
        Status = "READY_ADD_PUBLIC_EXPORT"
        SourcePath = $source
        RecommendedExportLine = "export { $symbol } from '$sourceNoExt';"
        RiskCount = [int]$gap.RiskCount
        AffectedFileCount = [int]$gap.AffectedFileCount
        ExampleImporter = [string]$gap.ExampleImporter
      })

      continue
    }

    if ($exportedMatches.Count -gt 1) {
      [void]$BridgePlan.Add([pscustomobject]@{
        Symbol = $symbol
        Status = "BLOCKED_AMBIGUOUS_EXPORTED_SOURCES"
        SourcePath = [string](($exportedMatches | Select-Object -ExpandProperty SourcePath) -join ";")
        RecommendedExportLine = ""
        RiskCount = [int]$gap.RiskCount
        AffectedFileCount = [int]$gap.AffectedFileCount
        ExampleImporter = [string]$gap.ExampleImporter
      })

      [void]$Blockers.Add([pscustomobject]@{
        BlockerType = "AMBIGUOUS_EXPORTED_SOURCES"
        Severity = "HIGH"
        Symbol = $symbol
        Detail = [string](($exportedMatches | Select-Object -ExpandProperty SourcePath) -join ";")
      })

      continue
    }

    $declaredMatches = @($matches | Where-Object { $_.MatchKind -eq "DECLARED_NOT_EXPORTED" })

    if ($declaredMatches.Count -gt 0) {
      [void]$BridgePlan.Add([pscustomobject]@{
        Symbol = $symbol
        Status = "BLOCKED_DECLARED_NOT_EXPORTED"
        SourcePath = [string](($declaredMatches | Select-Object -ExpandProperty SourcePath) -join ";")
        RecommendedExportLine = ""
        RiskCount = [int]$gap.RiskCount
        AffectedFileCount = [int]$gap.AffectedFileCount
        ExampleImporter = [string]$gap.ExampleImporter
      })

      [void]$Blockers.Add([pscustomobject]@{
        BlockerType = "DECLARED_NOT_EXPORTED"
        Severity = "MEDIUM"
        Symbol = $symbol
        Detail = [string](($declaredMatches | Select-Object -ExpandProperty SourcePath) -join ";")
      })
    }
  }

  $ReadyRows = @($BridgePlan | Where-Object { $_.Status -eq "READY_ADD_PUBLIC_EXPORT" })
  $BlockedRows = @($BridgePlan | Where-Object { $_.Status -ne "READY_ADD_PUBLIC_EXPORT" })

  $Verdict = "PASS_BRIDGE_SOURCE_MAP_READY_FOR_REVIEW"
  if ($BlockedRows.Count -gt 0) {
    $Verdict = "BLOCKED_BRIDGE_SOURCE_MAP_HAS_GAPS"
  }

  $Summary = [pscustomobject]@{
    IssueCode = $IssueCode
    SessionId = $SessionId
    RepoRoot = $RepoRoot
    UiKitSrc = $UiKitSrc
    EvidenceRoot = $RunRoot
    PublicExportGapCount = [int]$PublicExportGaps.Count
    UiKitScannedFileCount = [int]$UiFiles.Count
    SourceMatchCount = [int]$SourceMatches.Count
    ReadyExportBridgeCount = [int]$ReadyRows.Count
    BlockedBridgeCount = [int]$BlockedRows.Count
    BlockerCount = [int]$Blockers.Count
    MutationsPerformed = "NO"
    Verdict = $Verdict
  }

  Write-Step "Writing evidence pack"

  $Summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "summary.json") -Encoding UTF8

  Export-CsvSafe -Rows $SourceMatches -Path (Join-Path $RunRoot "source_matches.csv") -Headers @(
    "Symbol","SourcePath","MatchKind","RiskCount","AffectedFileCount","ExampleImporter"
  )

  Export-CsvSafe -Rows $BridgePlan -Path (Join-Path $RunRoot "bridge_export_plan.csv") -Headers @(
    "Symbol","Status","SourcePath","RecommendedExportLine","RiskCount","AffectedFileCount","ExampleImporter"
  )

  Export-CsvSafe -Rows $Blockers -Path (Join-Path $RunRoot "blockers.csv") -Headers @(
    "BlockerType","Severity","Symbol","Detail"
  )

  $SummaryText = @"
CHECK_ANALYZE_UIKIT_PUBLIC_EXPORT_BRIDGE_SOURCES

Verdict: $Verdict
MutationsPerformed: NO

Counts:
- Public export gaps: $($Summary.PublicExportGapCount)
- ui-kit scanned files: $($Summary.UiKitScannedFileCount)
- Source matches: $($Summary.SourceMatchCount)
- Ready export bridges: $($Summary.ReadyExportBridgeCount)
- Blocked bridge rows: $($Summary.BlockedBridgeCount)
- Blockers: $($Summary.BlockerCount)

Evidence:
- summary.json
- source_matches.csv
- bridge_export_plan.csv
- blockers.csv

Rule:
This script is CHECK_ANALYZE only.
It does not edit ui-kit, exports, or live screens.
"@

  $SummaryText | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

  Write-Step "Terminal summary"

  $color = "Green"
  if ($BlockedRows.Count -gt 0) { $color = "Yellow" }

  Write-Host ""
  Write-Host "VERDICT: $Verdict" -ForegroundColor $color
  Write-Host "MUTATIONS: NO"
  Write-Host "EVIDENCE: $RunRoot"

  Write-Host ""
  Write-Host "COUNTS" -ForegroundColor Cyan
  $Summary |
    Select-Object PublicExportGapCount,UiKitScannedFileCount,SourceMatchCount,ReadyExportBridgeCount,BlockedBridgeCount,BlockerCount |
    Format-List

  Write-Host ""
  Write-Host "READY EXPORT BRIDGES" -ForegroundColor Cyan
  if ($ReadyRows.Count -gt 0) {
    $ReadyRows | Select-Object -First 60 Symbol,SourcePath,RecommendedExportLine,RiskCount,AffectedFileCount | Format-Table -AutoSize
  } else {
    Write-Warn "No ready bridge exports found."
  }

  Write-Host ""
  Write-Host "BLOCKERS" -ForegroundColor Cyan
  if ($Blockers.Count -gt 0) {
    $Blockers | Format-Table -AutoSize
  } else {
    Write-Pass "No blockers in bridge source mapping."
  }

  Write-Host ""
  Write-Host "FINAL DECISION" -ForegroundColor Cyan
  Write-Host "No cleanup is allowed. Next APPLY, if any, must only add verified public export bridge lines."
  Write-Host "No delete/rename/move/import migration is allowed."

  if ($BlockedRows.Count -gt 0) {
    $global:LASTEXITCODE = 1
  } else {
    $global:LASTEXITCODE = 0
  }

} catch {
  Write-Fail $_.Exception.Message

  New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

  $failure = [pscustomobject]@{
    IssueCode = $IssueCode
    SessionId = $SessionId
    RepoRoot = $RepoRoot
    UiKitSrc = $UiKitSrc
    EvidenceRoot = $RunRoot
    MutationsPerformed = "NO"
    Verdict = "FAIL_CHECK_ANALYZE"
    Error = $_.Exception.Message
    ScriptStackTrace = $_.ScriptStackTrace
    PositionMessage = $_.InvocationInfo.PositionMessage
  }

  $failure | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "failure.json") -Encoding UTF8
  $failure | Format-List

  Write-Host ""
  Write-Host "No repository mutations were performed." -ForegroundColor Yellow
  $global:LASTEXITCODE = 1
}
