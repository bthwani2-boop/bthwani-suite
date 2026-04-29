Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_UIKIT_DEEP_DIR_RETIREMENT_PLAN"
$RepoRoot = "C:\bthwani-suite"
$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$IndexPath = Join-Path $UiKitSrc "index.ts"
$RunsRoot = Join-Path $RepoRoot "tools\registry\runs"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path $RunsRoot $SessionId

$DeepDirs = @(
  "_internal",
  "components",
  "foundation",
  "hooks",
  "patterns",
  "primitives",
  "providers",
  "root",
  "states",
  "utils"
)

$ThinFamilies = @(
  "foundation.ts",
  "providers.tsx",
  "primitives.tsx",
  "Header.tsx",
  "Button.tsx",
  "Card.tsx",
  "Form.tsx",
  "List.tsx",
  "Layout.tsx",
  "Overlay.tsx",
  "State.tsx",
  "Media.tsx",
  "mobile.ts",
  "web.ts",
  "next.ts",
  "preview.ts",
  "index.ts"
)

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

function Get-ImportSpecs {
  param([string]$Content)

  $specs = New-Object System.Collections.ArrayList
  if ([string]::IsNullOrWhiteSpace($Content)) { return @() }

  $pattern = '(?m)^\s*(?:import|export)\s+(?:type\s+)?(?:[^''"]*?\s+from\s+)?[''"]([^''"]+)[''"]'
  foreach ($m in [regex]::Matches($Content, $pattern)) {
    [void]$specs.Add([string]$m.Groups[1].Value)
  }

  return @($specs | Sort-Object -Unique)
}

function Get-ExportNames {
  param([string]$Content)

  $names = New-Object System.Collections.ArrayList
  if ([string]::IsNullOrWhiteSpace($Content)) { return @() }

  foreach ($m in [regex]::Matches($Content, '(?m)^\s*export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_][A-Za-z0-9_]*)')) {
    [void]$names.Add([string]$m.Groups[1].Value)
  }

  foreach ($m in [regex]::Matches($Content, '(?m)^\s*export\s+type\s*\{([^}]+)\}')) {
    foreach ($raw in ([string]$m.Groups[1].Value -split ",")) {
      $s = (($raw.Trim()) -replace '\s+as\s+.*$', '').Trim()
      if ($s.Length -gt 0) { [void]$names.Add($s) }
    }
  }

  foreach ($m in [regex]::Matches($Content, '(?m)^\s*export\s*\{([^}]+)\}')) {
    foreach ($raw in ([string]$m.Groups[1].Value -split ",")) {
      $s = (($raw.Trim()) -replace '\s+as\s+.*$', '').Trim()
      if ($s.Length -gt 0) { [void]$names.Add($s) }
    }
  }

  return @($names | Sort-Object -Unique)
}

function Resolve-RelativeImport {
  param(
    [string]$FromFile,
    [string]$ImportSpec,
    [hashtable]$FileMap
  )

  if ([string]::IsNullOrWhiteSpace($ImportSpec)) { return $null }
  if (-not $ImportSpec.StartsWith(".")) { return $null }

  $fromDir = Split-Path -Parent $FromFile
  $base = [System.IO.Path]::GetFullPath((Join-Path $fromDir $ImportSpec))

  $candidates = @(
    $base,
    ($base + ".ts"),
    ($base + ".tsx"),
    ($base + ".js"),
    ($base + ".jsx"),
    (Join-Path $base "index.ts"),
    (Join-Path $base "index.tsx")
  )

  foreach ($candidate in $candidates) {
    $key = Normalize-PathText ([System.IO.Path]::GetFullPath($candidate))
    if ($FileMap.ContainsKey($key)) {
      return [string]$FileMap[$key]
    }
  }

  return $null
}

function Get-FamilyTarget {
  param(
    [string]$RelativePath,
    [string]$FileName,
    [string]$Content
  )

  $signal = ((Normalize-PathText $RelativePath) + " " + $FileName + " " + $Content).ToLowerInvariant()
  if ($signal.Length -gt 10000) { $signal = $signal.Substring(0, 10000) }

  if ($signal -match 'topbar|top-bar|header|screenheader|screen-header|sectionheader|section-header|ticker|tabs|tab') { return "Header.tsx" }
  if ($signal -match 'provider|rootprovider|locale|locales|i18n|rtl|ltr|direction|context') { return "providers.tsx" }
  if ($signal -match 'foundation|token|tokens|theme|color|palette|spacing|radius|typography|font|elevation|shadow|motion|safearea|safe-area') { return "foundation.ts" }
  if ($signal -match 'primitive|box|text|surface|divider|scrollview|scroll-view|pressable') { return "primitives.tsx" }
  if ($signal -match 'button|cta|actionbutton|action-button|fab|segmented') { return "Button.tsx" }
  if ($signal -match 'card|tile|panel|statcard|stat-card|productcard|product-card|optionrow|option-row|details') { return "Card.tsx" }
  if ($signal -match 'form|input|field|search|select|picker|attachment|checkbox|switch|radio|textarea|text-area') { return "Form.tsx" }
  if ($signal -match 'list|row|rail|carousel|highlight|item|datatable|data-table|keyvalue|key-value') { return "List.tsx" }
  if ($signal -match 'modal|dialog|sheet|bottomsheet|bottom-sheet|overlay|drawer|popover|toast|portal') { return "Overlay.tsx" }
  if ($signal -match 'state|loading|empty|error|success|skeleton|offline|disabled|fallback') { return "State.tsx" }
  if ($signal -match 'media|image|avatar|banner|logo|icon|illustration|picture|photo') { return "Media.tsx" }
  if ($signal -match 'layout|shell|page|container|grid|section|stack|cluster|spacer|wrapper|frame') { return "Layout.tsx" }

  return "REVIEW_ONLY"
}

try {
  Write-Step "CHECK_ANALYZE_UIKIT_DEEP_DIR_RETIREMENT_PLAN"
  Write-Host "RepoRoot: $RepoRoot"
  Write-Host "UiKitSrc: $UiKitSrc"
  Write-Host "RunRoot:  $RunRoot"

  New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "ui-kit src not found: $UiKitSrc"
  }

  $AllUiFiles = @(
    Get-ChildItem -LiteralPath $UiKitSrc -Recurse -File |
      Where-Object {
        (-not (Test-ExcludedPath $_.FullName)) -and
        ($_.Extension -in @(".ts", ".tsx", ".js", ".jsx"))
      } |
      Sort-Object FullName
  )

  $FileMap = @{}
  foreach ($file in $AllUiFiles) {
    $FileMap[(Normalize-PathText ([System.IO.Path]::GetFullPath($file.FullName)))] = [string]$file.FullName
  }

  $DeepFiles = @()
  foreach ($dir in $DeepDirs) {
    $path = Join-Path $UiKitSrc $dir
    if (Test-Path -LiteralPath $path) {
      $DeepFiles += Get-ChildItem -LiteralPath $path -Recurse -File |
        Where-Object {
          (-not (Test-ExcludedPath $_.FullName)) -and
          ($_.Extension -in @(".ts", ".tsx", ".js", ".jsx"))
        }
    }
  }

  $DeepFileSet = @{}
  foreach ($file in $DeepFiles) {
    $DeepFileSet[(Normalize-PathText ([System.IO.Path]::GetFullPath($file.FullName)))] = $true
  }

  Write-Step "Collecting internal import graph"

  $InternalImportRows = New-Object System.Collections.ArrayList
  $ImporterCountByDeepFile = @{}

  foreach ($file in $DeepFiles) {
    $ImporterCountByDeepFile[(Normalize-PathText ([System.IO.Path]::GetFullPath($file.FullName)))] = 0
  }

  foreach ($file in $AllUiFiles) {
    $content = Read-TextFileSafe -Path $file.FullName
    $specs = @(Get-ImportSpecs -Content $content)

    foreach ($spec in $specs) {
      $resolved = Resolve-RelativeImport -FromFile $file.FullName -ImportSpec $spec -FileMap $FileMap
      if ($null -eq $resolved) { continue }

      $resolvedKey = Normalize-PathText ([System.IO.Path]::GetFullPath($resolved))
      if ($DeepFileSet.ContainsKey($resolvedKey)) {
        $ImporterCountByDeepFile[$resolvedKey] = [int]$ImporterCountByDeepFile[$resolvedKey] + 1

        [void]$InternalImportRows.Add([pscustomobject]@{
          Importer = Get-RelativePathSafe -BasePath $UiKitSrc -TargetPath $file.FullName
          ImportSpec = [string]$spec
          ImportedDeepFile = Get-RelativePathSafe -BasePath $UiKitSrc -TargetPath $resolved
        })
      }
    }
  }

  Write-Step "Collecting external/live direct deep imports"

  $ExternalImportRows = New-Object System.Collections.ArrayList

  $RepoFiles = @(
    Get-ChildItem -LiteralPath $RepoRoot -Recurse -File |
      Where-Object {
        (-not (Test-ExcludedPath $_.FullName)) -and
        (-not $_.FullName.StartsWith($UiKitSrc)) -and
        ($_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mdx"))
      }
  )

  foreach ($file in $RepoFiles) {
    $content = Read-TextFileSafe -Path $file.FullName
    if ([string]::IsNullOrWhiteSpace($content)) { continue }

    $specs = @(Get-ImportSpecs -Content $content)
    foreach ($spec in $specs) {
      if ($spec -match '^@bthwani/ui-kit/(src/)?(_internal|components|foundation|hooks|patterns|primitives|providers|root|states|utils)(/|$)') {
        [void]$ExternalImportRows.Add([pscustomobject]@{
          Importer = Get-RelativePathSafe -BasePath $RepoRoot -TargetPath $file.FullName
          ImportSpec = [string]$spec
          Risk = "EXTERNAL_DIRECT_DEEP_UIKIT_IMPORT"
        })
      }
    }
  }

  Write-Step "Analyzing index bridge dependencies"

  $IndexContent = ""
  if (Test-Path -LiteralPath $IndexPath) {
    $IndexContent = Read-TextFileSafe -Path $IndexPath
  }

  $IndexBridgeRows = New-Object System.Collections.ArrayList
  foreach ($line in @($IndexContent -split "`r?`n")) {
    $trim = $line.Trim()
    if ($trim -match '^export\s+(type\s+)?\{[^}]+\}\s+from\s+["'']\.\/([^"'']+)["''];?') {
      $source = [string]$Matches[2]
      foreach ($dir in $DeepDirs) {
        if ($source -eq $dir -or $source.StartsWith($dir + "/")) {
          [void]$IndexBridgeRows.Add([pscustomobject]@{
            ExportLine = $trim
            Source = $source
            DeepDir = $dir
          })
          break
        }
      }
    }
  }

  Write-Step "Building retirement plan"

  $PlanRows = New-Object System.Collections.ArrayList

  foreach ($file in $DeepFiles) {
    $rel = Get-RelativePathSafe -BasePath $UiKitSrc -TargetPath $file.FullName
    $content = Read-TextFileSafe -Path $file.FullName
    $exports = @(Get-ExportNames -Content $content)
    $key = Normalize-PathText ([System.IO.Path]::GetFullPath($file.FullName))
    $internalImporters = [int]$ImporterCountByDeepFile[$key]

    $relNoExt = $rel -replace '\.(tsx?|jsx?)$', ''
    $indexBridgeHits = @($IndexBridgeRows | Where-Object { $_.Source -eq $relNoExt })
    $familyTarget = Get-FamilyTarget -RelativePath $rel -FileName $file.Name -Content $content

    $externalHits = @(
      $ExternalImportRows |
        Where-Object {
          $_.ImportSpec -match [regex]::Escape($relNoExt)
        }
    )

    $action = "MIGRATE_TO_THIN_FAMILY"
    $blockers = New-Object System.Collections.ArrayList

    if ($internalImporters -gt 0) {
      [void]$blockers.Add("BLOCKED_BY_INTERNAL_IMPORT")
    }

    if ($externalHits.Count -gt 0) {
      [void]$blockers.Add("BLOCKED_BY_EXTERNAL_DIRECT_IMPORT")
    }

    if ($indexBridgeHits.Count -gt 0) {
      [void]$blockers.Add("BLOCKED_BY_INDEX_BRIDGE")
    }

    if ($exports.Count -gt 0 -and $familyTarget -ne "REVIEW_ONLY") {
      [void]$blockers.Add("NEEDS_SYMBOL_MIGRATION_TO_" + $familyTarget)
    }

    if ($exports.Count -eq 0 -and $internalImporters -eq 0 -and $externalHits.Count -eq 0 -and $indexBridgeHits.Count -eq 0) {
      $action = "READY_FOR_RETIREMENT_CANDIDATE"
    } elseif ($blockers.Count -gt 0) {
      $action = "BLOCKED_FOR_RETIREMENT"
    }

    [void]$PlanRows.Add([pscustomobject]@{
      RelativePath = $rel
      DeepDir = ($rel -split "/")[0]
      SizeBytes = [int64]$file.Length
      LineCount = [int](($content -split "`r?`n").Count)
      ExportCount = [int]$exports.Count
      ExportNames = [string]($exports -join ";")
      InternalImporterCount = [int]$internalImporters
      ExternalDirectImporterCount = [int]$externalHits.Count
      IndexBridgeExportCount = [int]$indexBridgeHits.Count
      ThinFamilyTarget = $familyTarget
      RetirementAction = $action
      Blockers = [string]($blockers -join ";")
    })
  }

  $DirSummary = @(
    $PlanRows |
      Group-Object DeepDir |
      Sort-Object Name |
      ForEach-Object {
        $rows = @($_.Group)
        [pscustomobject]@{
          DeepDir = [string]$_.Name
          FileCount = [int]$rows.Count
          TotalLines = [int](($rows | Measure-Object LineCount -Sum).Sum)
          ExportedFileCount = [int](@($rows | Where-Object { $_.ExportCount -gt 0 }).Count)
          BlockedFileCount = [int](@($rows | Where-Object { $_.RetirementAction -eq "BLOCKED_FOR_RETIREMENT" }).Count)
          ReadyCandidateCount = [int](@($rows | Where-Object { $_.RetirementAction -eq "READY_FOR_RETIREMENT_CANDIDATE" }).Count)
        }
      }
  )

  $FamilySummary = @(
    $PlanRows |
      Group-Object ThinFamilyTarget |
      Sort-Object Name |
      ForEach-Object {
        [pscustomobject]@{
          ThinFamilyTarget = [string]$_.Name
          SourceFileCount = [int]$_.Count
        }
      }
  )

  $BlockerSummary = @(
    $PlanRows |
      ForEach-Object {
        $row = $_
        foreach ($b in ([string]$row.Blockers -split ";" | Where-Object { $_ -ne "" })) {
          [pscustomobject]@{ Blocker = $b }
        }
      } |
      Group-Object Blocker |
      Sort-Object Count -Descending |
      ForEach-Object {
        [pscustomobject]@{
          Blocker = [string]$_.Name
          Count = [int]$_.Count
        }
      }
  )

  Write-Step "Running verification snapshot"

  $VerifyRows = New-Object System.Collections.ArrayList
  $TscOut = Join-Path $RunRoot "verify_uikit_tsc.txt"
  $tscOutput = cmd.exe /c "pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit --pretty false" 2>&1 | Out-String
  $tscExit = $LASTEXITCODE
  $tscOutput | Set-Content -LiteralPath $TscOut -Encoding UTF8

  [void]$VerifyRows.Add([pscustomobject]@{
    Name = "ui-kit TypeScript noEmit"
    Command = "pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit --pretty false"
    ExitCode = [int]$tscExit
    OutputPath = $TscOut
    Passed = [bool]($tscExit -eq 0)
  })

  $GitStatus = ""
  try {
    $GitStatus = (& git --no-pager status --short 2>$null | Out-String).Trim()
  } catch {
    $GitStatus = "[git unavailable]"
  }

  $Verdict = "BLOCKED_FOR_DELETE__RETIREMENT_PLAN_READY"
  if ($tscExit -ne 0) {
    $Verdict = "BLOCKED_FOR_DELETE__TYPECHECK_NOT_PASSING"
  }

  $Summary = [pscustomobject]@{
    IssueCode = $IssueCode
    SessionId = $SessionId
    RepoRoot = $RepoRoot
    UiKitSrc = $UiKitSrc
    EvidenceRoot = $RunRoot
    DeepDirCount = [int]$DeepDirs.Count
    DeepFileCount = [int]$PlanRows.Count
    ExternalDirectDeepImportCount = [int]$ExternalImportRows.Count
    InternalDeepImportEdgeCount = [int]$InternalImportRows.Count
    IndexBridgeDeepExportCount = [int]$IndexBridgeRows.Count
    ReadyRetirementCandidateCount = [int](@($PlanRows | Where-Object { $_.RetirementAction -eq "READY_FOR_RETIREMENT_CANDIDATE" }).Count)
    BlockedRetirementFileCount = [int](@($PlanRows | Where-Object { $_.RetirementAction -eq "BLOCKED_FOR_RETIREMENT" }).Count)
    UiKitTypecheckPassed = [bool]($tscExit -eq 0)
    MutationsPerformed = "NO"
    GitStatusShort = $GitStatus
    Verdict = $Verdict
  }

  Write-Step "Writing evidence pack"

  $Summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "summary.json") -Encoding UTF8

  Export-CsvSafe -Rows @($PlanRows) -Path (Join-Path $RunRoot "deep_dir_retirement_plan.csv") -Headers @(
    "RelativePath","DeepDir","SizeBytes","LineCount","ExportCount","ExportNames","InternalImporterCount","ExternalDirectImporterCount","IndexBridgeExportCount","ThinFamilyTarget","RetirementAction","Blockers"
  )

  Export-CsvSafe -Rows @($DirSummary) -Path (Join-Path $RunRoot "deep_dir_summary.csv") -Headers @(
    "DeepDir","FileCount","TotalLines","ExportedFileCount","BlockedFileCount","ReadyCandidateCount"
  )

  Export-CsvSafe -Rows @($FamilySummary) -Path (Join-Path $RunRoot "thin_family_migration_summary.csv") -Headers @(
    "ThinFamilyTarget","SourceFileCount"
  )

  Export-CsvSafe -Rows @($BlockerSummary) -Path (Join-Path $RunRoot "retirement_blocker_summary.csv") -Headers @(
    "Blocker","Count"
  )

  Export-CsvSafe -Rows @($InternalImportRows) -Path (Join-Path $RunRoot "internal_deep_imports.csv") -Headers @(
    "Importer","ImportSpec","ImportedDeepFile"
  )

  Export-CsvSafe -Rows @($ExternalImportRows) -Path (Join-Path $RunRoot "external_direct_deep_imports.csv") -Headers @(
    "Importer","ImportSpec","Risk"
  )

  Export-CsvSafe -Rows @($IndexBridgeRows) -Path (Join-Path $RunRoot "index_bridge_deep_exports.csv") -Headers @(
    "ExportLine","Source","DeepDir"
  )

  Export-CsvSafe -Rows @($VerifyRows) -Path (Join-Path $RunRoot "verify_results.csv") -Headers @(
    "Name","Command","ExitCode","OutputPath","Passed"
  )

  $SummaryText = @"
CHECK_ANALYZE_UIKIT_DEEP_DIR_RETIREMENT_PLAN

Verdict: $($Summary.Verdict)
MutationsPerformed: NO

Counts:
- Deep dirs: $($Summary.DeepDirCount)
- Deep files: $($Summary.DeepFileCount)
- External direct deep imports: $($Summary.ExternalDirectDeepImportCount)
- Internal deep import edges: $($Summary.InternalDeepImportEdgeCount)
- Index bridge deep exports: $($Summary.IndexBridgeDeepExportCount)
- Ready retirement candidates: $($Summary.ReadyRetirementCandidateCount)
- Blocked retirement files: $($Summary.BlockedRetirementFileCount)
- ui-kit typecheck passed: $($Summary.UiKitTypecheckPassed)

Evidence:
- summary.json
- deep_dir_retirement_plan.csv
- deep_dir_summary.csv
- thin_family_migration_summary.csv
- retirement_blocker_summary.csv
- internal_deep_imports.csv
- external_direct_deep_imports.csv
- index_bridge_deep_exports.csv
- verify_results.csv
- verify_uikit_tsc.txt

Rule:
This is CHECK_ANALYZE only.
It does not delete, rename, move files, change exports, or edit live screens.
Deep directories must not be deleted until their exported symbols are migrated into thin family files and all direct imports/bridges are removed.
"@

  $SummaryText | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

  Write-Step "Terminal summary"

  Write-Host ""
  Write-Host "VERDICT: $Verdict" -ForegroundColor Yellow
  Write-Host "MUTATIONS: NO"
  Write-Host "EVIDENCE: $RunRoot"

  Write-Host ""
  Write-Host "COUNTS" -ForegroundColor Cyan
  $Summary |
    Select-Object DeepFileCount,ExternalDirectDeepImportCount,InternalDeepImportEdgeCount,IndexBridgeDeepExportCount,ReadyRetirementCandidateCount,BlockedRetirementFileCount,UiKitTypecheckPassed |
    Format-List

  Write-Host ""
  Write-Host "DEEP DIR SUMMARY" -ForegroundColor Cyan
  $DirSummary | Format-Table -AutoSize

  Write-Host ""
  Write-Host "TOP BLOCKERS" -ForegroundColor Cyan
  if ($BlockerSummary.Count -gt 0) {
    $BlockerSummary | Select-Object -First 30 | Format-Table -AutoSize
  } else {
    Write-Pass "No blockers detected."
  }

  Write-Host ""
  Write-Host "NEXT SAFE STEP" -ForegroundColor Cyan
  Write-Host "Use deep_dir_retirement_plan.csv to select ONE thin family migration target only. Do not delete directories yet."

  $global:LASTEXITCODE = 1

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
