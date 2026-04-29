Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_UIKIT_LIVE_SCREEN_BREAKAGE_GUARD"
$RepoRoot = "C:\bthwani-suite"
$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

$LiveRoots = @(
  "apps\mobile\app-client",
  "apps\mobile\app-partner",
  "apps\mobile\app-captain",
  "apps\mobile\app-field",
  "apps\web\control-panel",
  "apps\web\webapp",
  "apps\web\website",
  "packages\surfaces"
)

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host $Message -ForegroundColor Cyan
}

function Write-Pass {
  param([string]$Message)
  Write-Host ("PASS: " + $Message) -ForegroundColor Green
}

function Write-Warn {
  param([string]$Message)
  Write-Host ("WARN: " + $Message) -ForegroundColor Yellow
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

function Read-TextFileSafe {
  param([string]$Path)
  try {
    return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  } catch {
    try { return Get-Content -LiteralPath $Path -Raw } catch { return "" }
  }
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

function Get-LatestFamilyPlan {
  $runsRoot = Join-Path $RepoRoot "tools\registry\runs"
  if (-not (Test-Path -LiteralPath $runsRoot)) {
    return $null
  }

  $plans = Get-ChildItem -LiteralPath $runsRoot -Recurse -File -Filter "family_plan.csv" |
    Where-Object { $_.FullName -match "CHECK_ANALYZE_UIKIT_LEAN_FAMILY_RESET" } |
    Sort-Object LastWriteTime -Descending

  if (@($plans).Count -eq 0) {
    return $null
  }

  return $plans[0].FullName
}

function Get-NamedImportsFromUiKit {
  param(
    [string]$Content,
    [string]$FilePath
  )

  $rows = New-Object System.Collections.ArrayList

  if ([string]::IsNullOrWhiteSpace($Content)) {
    return @()
  }

  $patterns = @(
    'import\s*\{([^}]+)\}\s*from\s*["'']@bthwani/ui-kit["'']',
    'import\s+type\s*\{([^}]+)\}\s*from\s*["'']@bthwani/ui-kit["'']'
  )

  foreach ($pattern in $patterns) {
    foreach ($m in [regex]::Matches($Content, $pattern, "Singleline")) {
      $chunk = [string]$m.Groups[1].Value
      foreach ($raw in ($chunk -split ",")) {
        $item = $raw.Trim()
        if ($item.Length -eq 0) { continue }

        $symbol = ($item -replace '\s+as\s+.*$', '').Trim()
        if ($symbol.Length -eq 0) { continue }

        [void]$rows.Add([pscustomobject]@{
          File = Get-RelativePathSafe -BasePath $RepoRoot -TargetPath $FilePath
          ImportKind = "NAMED_PUBLIC_PACKAGE_IMPORT"
          ImportSpec = "@bthwani/ui-kit"
          Symbol = $symbol
        })
      }
    }
  }

  foreach ($m in [regex]::Matches($Content, 'from\s*["''](@bthwani/ui-kit/[^"'']+)["'']')) {
    [void]$rows.Add([pscustomobject]@{
      File = Get-RelativePathSafe -BasePath $RepoRoot -TargetPath $FilePath
      ImportKind = "SUBPATH_IMPORT"
      ImportSpec = [string]$m.Groups[1].Value
      Symbol = ""
    })
  }

  return @($rows)
}

function Get-ExportedSymbolsFromFile {
  param([string]$Path)

  $symbols = New-Object System.Collections.ArrayList

  if (-not (Test-Path -LiteralPath $Path)) {
    return @()
  }

  $content = Read-TextFileSafe -Path $Path

  foreach ($m in [regex]::Matches($content, '(?m)^\s*export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_][A-Za-z0-9_]*)')) {
    [void]$symbols.Add([string]$m.Groups[1].Value)
  }

  foreach ($m in [regex]::Matches($content, '(?m)^\s*export\s*\{([^}]+)\}')) {
    $chunk = [string]$m.Groups[1].Value
    foreach ($raw in ($chunk -split ",")) {
      $item = $raw.Trim()
      if ($item.Length -eq 0) { continue }
      $clean = ($item -replace '\s+as\s+.*$', '').Trim()
      if ($clean.Length -gt 0) {
        [void]$symbols.Add($clean)
      }
    }
  }

  return @($symbols | Sort-Object -Unique)
}

function Get-PublicUiKitSymbols {
  $symbols = New-Object System.Collections.ArrayList

  $rootFiles = @(
    "index.ts",
    "Button.tsx",
    "Card.tsx",
    "Form.tsx",
    "Header.tsx",
    "List.tsx",
    "Layout.tsx",
    "Media.tsx",
    "Overlay.tsx",
    "State.tsx",
    "foundation.ts",
    "providers.tsx",
    "primitives.tsx",
    "mobile.ts",
    "web.ts",
    "next.ts",
    "preview.ts"
  )

  foreach ($fileName in $rootFiles) {
    $path = Join-Path $UiKitSrc $fileName
    foreach ($s in (Get-ExportedSymbolsFromFile -Path $path)) {
      [void]$symbols.Add($s)
    }
  }

  $indexPath = Join-Path $UiKitSrc "index.ts"
  if (Test-Path -LiteralPath $indexPath) {
    $indexContent = Read-TextFileSafe -Path $indexPath

    foreach ($m in [regex]::Matches($indexContent, '(?m)^\s*export\s+\*\s+from\s+["'']([^"'']+)["'']')) {
      $spec = [string]$m.Groups[1].Value
      if ($spec.StartsWith(".")) {
        $base = [System.IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $indexPath) $spec))
        $candidates = @(
          $base,
          ($base + ".ts"),
          ($base + ".tsx"),
          (Join-Path $base "index.ts"),
          (Join-Path $base "index.tsx")
        )

        foreach ($candidate in $candidates) {
          if (Test-Path -LiteralPath $candidate) {
            foreach ($s in (Get-ExportedSymbolsFromFile -Path $candidate)) {
              [void]$symbols.Add($s)
            }
            break
          }
        }
      }
    }
  }

  return @($symbols | Sort-Object -Unique)
}

try {
  Write-Step "CHECK_ANALYZE_UIKIT_LIVE_SCREEN_BREAKAGE_GUARD"
  Write-Host "RepoRoot: $RepoRoot"
  Write-Host "UiKitSrc: $UiKitSrc"
  Write-Host "RunRoot:  $RunRoot"

  New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

  if (-not (Test-Path -LiteralPath $RepoRoot)) {
    throw "Repo root not found: $RepoRoot"
  }

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "ui-kit src not found: $UiKitSrc"
  }

  $GitStatus = ""
  try {
    $GitStatus = (& git --no-pager status --short 2>$null | Out-String).Trim()
  } catch {
    $GitStatus = "[git unavailable]"
  }

  Write-Step "Loading latest Lean Family Reset evidence"

  $LatestFamilyPlan = Get-LatestFamilyPlan
  $FamilyPlanRows = @()

  if ($null -ne $LatestFamilyPlan -and (Test-Path -LiteralPath $LatestFamilyPlan)) {
    $FamilyPlanRows = @(Import-Csv -LiteralPath $LatestFamilyPlan)
    Write-Host "Latest family_plan.csv: $LatestFamilyPlan"
  } else {
    Write-Warn "No latest family_plan.csv found. Guard will still inspect live imports."
  }

  Write-Step "Collecting live screen/source files"

  $LiveFiles = New-Object System.Collections.ArrayList

  foreach ($rootRel in $LiveRoots) {
    $root = Join-Path $RepoRoot $rootRel
    if (-not (Test-Path -LiteralPath $root)) {
      continue
    }

    $files = Get-ChildItem -LiteralPath $root -Recurse -File |
      Where-Object {
        (-not (Test-ExcludedPath $_.FullName)) -and
        ($_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mdx"))
      }

    foreach ($file in $files) {
      [void]$LiveFiles.Add($file.FullName)
    }
  }

  Write-Step "Extracting live ui-kit imports"

  $LiveImports = New-Object System.Collections.ArrayList

  foreach ($filePath in $LiveFiles) {
    $content = Read-TextFileSafe -Path $filePath
    if ([string]::IsNullOrWhiteSpace($content)) {
      continue
    }

    foreach ($row in (Get-NamedImportsFromUiKit -Content $content -FilePath $filePath)) {
      [void]$LiveImports.Add($row)
    }
  }

  Write-Step "Resolving current public ui-kit symbols"

  $PublicSymbols = @(Get-PublicUiKitSymbols)
  $PublicSymbolMap = @{}
  foreach ($s in $PublicSymbols) {
    $PublicSymbolMap[$s] = $true
  }

  Write-Step "Classifying breakage risks"

  $Risks = New-Object System.Collections.ArrayList

  foreach ($imp in $LiveImports) {
    if ($imp.ImportKind -eq "SUBPATH_IMPORT") {
      [void]$Risks.Add([pscustomobject]@{
        RiskType = "LIVE_SUBPATH_IMPORT"
        Severity = "HIGH"
        File = $imp.File
        Symbol = $imp.Symbol
        ImportSpec = $imp.ImportSpec
        Reason = "Live code imports ui-kit subpath. Any path cleanup can break this."
      })
      continue
    }

    if ($imp.Symbol -ne "" -and -not $PublicSymbolMap.ContainsKey($imp.Symbol)) {
      [void]$Risks.Add([pscustomobject]@{
        RiskType = "LIVE_SYMBOL_NOT_FOUND_IN_PUBLIC_EXPORTS"
        Severity = "HIGH"
        File = $imp.File
        Symbol = $imp.Symbol
        ImportSpec = $imp.ImportSpec
        Reason = "Live code imports symbol that is not detected in current public ui-kit exports."
      })
    }
  }

  $AtRiskPlanRows = New-Object System.Collections.ArrayList

  if (@($FamilyPlanRows).Count -gt 0) {
    foreach ($row in $FamilyPlanRows) {
      $action = [string]$row.Action
      if ($action -in @("MERGE_TO_FAMILY","RENAME_CANDIDATE","DELETE_CANDIDATE_UNREFERENCED","REVIEW_ONLY")) {
        $exports = @(([string]$row.ExportNames) -split ";" | Where-Object { $_ -ne "" })
        foreach ($sym in $exports) {
          $used = @($LiveImports | Where-Object { [string]$_.Symbol -eq [string]$sym })
          if ($used.Count -gt 0) {
            foreach ($u in $used) {
              [void]$AtRiskPlanRows.Add([pscustomobject]@{
                RelativePath = [string]$row.RelativePath
                Action = [string]$row.Action
                FamilyTarget = [string]$row.FamilyTarget
                ExportSymbol = [string]$sym
                LiveImporter = [string]$u.File
                Severity = "HIGH"
                Reason = "Planned cleanup touches an exported symbol currently used by live code."
              })
            }
          }
        }
      }
    }
  }

  foreach ($row in $AtRiskPlanRows) {
    [void]$Risks.Add([pscustomobject]@{
      RiskType = "PLANNED_CLEANUP_TOUCHES_LIVE_SYMBOL"
      Severity = "HIGH"
      File = [string]$row.LiveImporter
      Symbol = [string]$row.ExportSymbol
      ImportSpec = "@bthwani/ui-kit"
      Reason = "Family plan action $($row.Action) on $($row.RelativePath)"
    })
  }

  $UniqueLiveImportFiles = @($LiveImports | Select-Object -ExpandProperty File -Unique)
  $UniqueLiveSymbols = @($LiveImports | Where-Object { $_.Symbol -ne "" } | Select-Object -ExpandProperty Symbol -Unique)

  $Verdict = "PASS_LIVE_SCREEN_GUARD__NO_DIRECT_BREAKAGE_RISK_DETECTED"
  if ($Risks.Count -gt 0) {
    $Verdict = "BLOCKED_FOR_APPLY__LIVE_SCREEN_BREAKAGE_RISK"
  }

  $Summary = [pscustomobject]@{
    IssueCode = $IssueCode
    SessionId = $SessionId
    RepoRoot = $RepoRoot
    UiKitSrc = $UiKitSrc
    EvidenceRoot = $RunRoot
    LatestFamilyPlan = $(if ($LatestFamilyPlan) { $LatestFamilyPlan } else { "" })
    LiveRootCount = $LiveRoots.Count
    LiveSourceFileCount = $LiveFiles.Count
    LiveUiKitImportRowCount = $LiveImports.Count
    LiveUiKitImporterFileCount = $UniqueLiveImportFiles.Count
    LiveUiKitSymbolCount = $UniqueLiveSymbols.Count
    PublicUiKitSymbolCount = $PublicSymbols.Count
    PlannedCleanupLiveSymbolRiskCount = $AtRiskPlanRows.Count
    RiskCount = $Risks.Count
    GitStatusShort = $GitStatus
    MutationsPerformed = "NO"
    Verdict = $Verdict
  }

  Write-Step "Writing evidence pack"

  $Summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "summary.json") -Encoding UTF8
  $LiveImports | Export-Csv -LiteralPath (Join-Path $RunRoot "live_uikit_imports.csv") -NoTypeInformation -Encoding UTF8
  $PublicSymbols | ForEach-Object { [pscustomobject]@{ Symbol = $_ } } | Export-Csv -LiteralPath (Join-Path $RunRoot "public_uikit_symbols.csv") -NoTypeInformation -Encoding UTF8
  $AtRiskPlanRows | Export-Csv -LiteralPath (Join-Path $RunRoot "planned_cleanup_live_symbol_risks.csv") -NoTypeInformation -Encoding UTF8
  $Risks | Export-Csv -LiteralPath (Join-Path $RunRoot "live_breakage_risks.csv") -NoTypeInformation -Encoding UTF8

  $SummaryText = @"
CHECK_ANALYZE_UIKIT_LIVE_SCREEN_BREAKAGE_GUARD

Verdict: $($Summary.Verdict)
MutationsPerformed: NO

Counts:
- Live source files: $($Summary.LiveSourceFileCount)
- Live ui-kit import rows: $($Summary.LiveUiKitImportRowCount)
- Live importer files: $($Summary.LiveUiKitImporterFileCount)
- Live ui-kit symbols: $($Summary.LiveUiKitSymbolCount)
- Public ui-kit symbols detected: $($Summary.PublicUiKitSymbolCount)
- Planned cleanup live symbol risks: $($Summary.PlannedCleanupLiveSymbolRiskCount)
- Risk count: $($Summary.RiskCount)

Evidence:
- summary.json
- live_uikit_imports.csv
- public_uikit_symbols.csv
- planned_cleanup_live_symbol_risks.csv
- live_breakage_risks.csv

Rule:
This script is CHECK_ANALYZE only.
It does not edit ui-kit or any live screen.
"@

  $SummaryText | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

  Write-Step "Terminal summary"

  $color = "Green"
  if ($Risks.Count -gt 0) { $color = "Yellow" }

  Write-Host ""
  Write-Host "VERDICT: $Verdict" -ForegroundColor $color
  Write-Host "MUTATIONS: NO"
  Write-Host "EVIDENCE: $RunRoot"

  Write-Host ""
  Write-Host "COUNTS" -ForegroundColor Cyan
  $Summary |
    Select-Object LiveSourceFileCount,LiveUiKitImportRowCount,LiveUiKitImporterFileCount,LiveUiKitSymbolCount,PublicUiKitSymbolCount,PlannedCleanupLiveSymbolRiskCount,RiskCount |
    Format-List

  Write-Host ""
  Write-Host "TOP LIVE BREAKAGE RISKS" -ForegroundColor Cyan
  if ($Risks.Count -gt 0) {
    $Risks |
      Sort-Object Severity,RiskType,File,Symbol |
      Select-Object -First 80 |
      Format-Table RiskType,Severity,File,Symbol,ImportSpec,Reason -AutoSize
  } else {
    Write-Pass "No direct live breakage risk detected from current imports."
  }

  Write-Host ""
  Write-Host "TOP LIVE UI-KIT IMPORTS" -ForegroundColor Cyan
  if ($LiveImports.Count -gt 0) {
    $LiveImports |
      Sort-Object File,Symbol |
      Select-Object -First 80 |
      Format-Table File,ImportKind,ImportSpec,Symbol -AutoSize
  } else {
    Write-Warn "No live @bthwani/ui-kit imports detected in configured live roots."
  }

  Write-Host ""
  Write-Host "FINAL SAFETY RULE" -ForegroundColor Cyan
  Write-Host "Do not run APPLY for ui-kit cleanup unless this guard is PASS and typecheck/build verification is PASS."
  Write-Host "Bridge-first is mandatory: keep old exports alive before moving/removing files."

  if ($Risks.Count -gt 0) {
    Write-Warn "APPLY is blocked because live screen breakage risk exists."
    $global:LASTEXITCODE = 1
  } else {
    Write-Pass "Live screen guard passed for direct import/export risk. APPLY still requires separate verification."
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
  Write-Host "Failure evidence: $(Join-Path $RunRoot "failure.json")" -ForegroundColor Yellow

  $global:LASTEXITCODE = 1
}
