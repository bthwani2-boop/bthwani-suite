Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_UIKIT_FAMILY_CONSOLIDATION_MAP"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$UiKitIndex = Join-Path $UiKitSrc "index.ts"
$UiKitPackageJson = Join-Path $RepoRoot "packages\ui-kit\package.json"

$Findings = New-Object System.Collections.Generic.List[object]
$Families = New-Object System.Collections.Generic.List[object]
$RootExports = New-Object System.Collections.Generic.List[object]
$PackageExports = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$FamiliesPath = Join-Path $RunRoot "UIKIT_FAMILY_CONSOLIDATION_MAP.csv"
$RootExportsPath = Join-Path $RunRoot "ROOT_EXPORTS.csv"
$PackageExportsPath = Join-Path $RunRoot "PACKAGE_EXPORTS.csv"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"

function Add-Finding {
  param([string]$Code,[string]$Severity,[string]$Path,[string]$Evidence,[string]$Action)

  $Findings.Add([pscustomobject]@{
    code=$Code; severity=$Severity; path=$Path; evidence=$Evidence; action=$Action
  }) | Out-Null

  $Color = if ($Severity -eq "PASS") { "Green" } elseif ($Severity -eq "INFO") { "Cyan" } elseif ($Severity -eq "WARN") { "Yellow" } else { "Red" }
  Write-Host "[$Severity] $Code — $Path" -ForegroundColor $Color
}

function ReadText {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return "" }
  return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
}

function RelPath {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return "" }

  $Full = [System.IO.Path]::GetFullPath($Path)
  if ($Full.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return ($Full.Substring($RepoRoot.Length).TrimStart([char[]]@('\','/')) -replace "\\","/")
  }

  return ($Path -replace "\\","/")
}

function ResolvePackageExportTarget {
  param([object]$ExportValue)

  $Values = New-Object System.Collections.Generic.List[string]

  if ($null -eq $ExportValue) { return $Values }

  if ($ExportValue -is [string]) {
    $Values.Add($ExportValue) | Out-Null
    return $Values
  }

  foreach ($Prop in $ExportValue.PSObject.Properties) {
    if ($Prop.Value -is [string]) {
      $Values.Add($Prop.Value) | Out-Null
    } elseif ($Prop.Value -ne $null) {
      foreach ($Nested in ResolvePackageExportTarget $Prop.Value) {
        $Values.Add($Nested) | Out-Null
      }
    }
  }

  return $Values
}

function Get-TopSegmentFromRel {
  param([string]$Rel)

  $Clean = $Rel -replace "\\","/"
  $Clean = $Clean -replace "^packages/ui-kit/src/",""
  $Parts = $Clean.Split("/")
  if ($Parts.Count -eq 0) { return "" }

  if ($Parts[0] -match "\.tsx?$|\.d\.ts$") {
    return "__root_files__"
  }

  return $Parts[0]
}

function Classify-Family {
  param(
    [string]$Family,
    [int]$FileCount,
    [bool]$HasDirectoryIndex,
    [bool]$HasRootFacade,
    [bool]$RootExported,
    [bool]$PackageExported
  )

  if ($Family -eq "__root_files__") {
    return "ROOT_ENTRYPOINT_SURFACE"
  }

  if ($Family -in @("preview")) {
    return "KEEP_ISOLATED_PACKAGE_ENTRYPOINT"
  }

  if ($Family -in @("_internal")) {
    return "INTERNAL_ONLY_REVIEW"
  }

  if ($PackageExported -and -not $RootExported) {
    return "KEEP_PACKAGE_ENTRYPOINT"
  }

  if ($RootExported -or $HasRootFacade) {
    return "PUBLIC_FAMILY_OWNER"
  }

  if ($Family -in @("patterns","root","components","hooks","foundation","providers","primitives")) {
    return "CONSOLIDATION_REVIEW"
  }

  return "REVIEW"
}

try {
  Write-Host ""
  Write-Host "CHECK UIKIT FAMILY CONSOLIDATION MAP" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "Missing ui-kit src path: $UiKitSrc"
  }

  if (-not (Test-Path -LiteralPath $UiKitIndex)) {
    throw "Missing ui-kit index.ts"
  }

  if (-not (Test-Path -LiteralPath $UiKitPackageJson)) {
    throw "Missing ui-kit package.json"
  }

  $IndexText = ReadText $UiKitIndex

  $RootExportSpecs = New-Object System.Collections.Generic.HashSet[string]

  foreach ($m in [regex]::Matches($IndexText, "(?m)^\s*export\s+\*\s+from\s+['""]\.\/([^'""]+)['""];")) {
    $Spec = $m.Groups[1].Value
    [void]$RootExportSpecs.Add($Spec)

    $RootExports.Add([pscustomobject]@{
      specifier="./$Spec"
    }) | Out-Null
  }

  $PackageExportSegments = New-Object System.Collections.Generic.HashSet[string]

  $PackageJson = ReadText $UiKitPackageJson | ConvertFrom-Json
  if ($PackageJson.exports) {
    foreach ($Prop in $PackageJson.exports.PSObject.Properties) {
      $ExportName = $Prop.Name
      $Targets = @(ResolvePackageExportTarget $Prop.Value | Select-Object -Unique)

      foreach ($Target in $Targets) {
        $Clean = $Target -replace "^\./",""
        $Clean = $Clean -replace "^src/",""
        $Segment = if ($Clean -match "/") { $Clean.Split("/")[0] } else { "__root_files__" }

        [void]$PackageExportSegments.Add($Segment)

        $PackageExports.Add([pscustomobject]@{
          export_name=$ExportName
          target=$Target
          segment=$Segment
        }) | Out-Null
      }
    }
  }

  $AllFiles = @(Get-ChildItem -LiteralPath $UiKitSrc -Recurse -File -Include *.ts,*.tsx,*.d.ts |
    Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\|\\.next\\|\\.expo\\" })

  $Groups = $AllFiles | Group-Object { Get-TopSegmentFromRel (RelPath $_.FullName) } | Sort-Object Name

  foreach ($Group in $Groups) {
    $Family = $Group.Name
    $Files = @($Group.Group)
    $FileCount = $Files.Count

    $DirPath = if ($Family -eq "__root_files__") { $UiKitSrc } else { Join-Path $UiKitSrc $Family }
    $HasDirectoryIndex = if ($Family -eq "__root_files__") {
      $true
    } else {
      (Test-Path -LiteralPath (Join-Path $DirPath "index.ts")) -or
      (Test-Path -LiteralPath (Join-Path $DirPath "index.tsx"))
    }

    $HasRootFacade = if ($Family -eq "__root_files__") {
      $true
    } else {
      (Test-Path -LiteralPath (Join-Path $UiKitSrc "$Family.ts")) -or
      (Test-Path -LiteralPath (Join-Path $UiKitSrc "$Family.tsx"))
    }

    $RootExported = $RootExportSpecs.Contains($Family)
    $PackageExported = $PackageExportSegments.Contains($Family)

    $RootTs = Join-Path $UiKitSrc "$Family.ts"
    $RootTsx = Join-Path $UiKitSrc "$Family.tsx"
    $RootFacadePath = if (Test-Path -LiteralPath $RootTs) {
      RelPath $RootTs
    } elseif (Test-Path -LiteralPath $RootTsx) {
      RelPath $RootTsx
    } else {
      ""
    }

    $IndexPath = if ($Family -eq "__root_files__") {
      RelPath $UiKitIndex
    } elseif (Test-Path -LiteralPath (Join-Path $DirPath "index.ts")) {
      RelPath (Join-Path $DirPath "index.ts")
    } elseif (Test-Path -LiteralPath (Join-Path $DirPath "index.tsx")) {
      RelPath (Join-Path $DirPath "index.tsx")
    } else {
      ""
    }

    $Decision = Classify-Family `
      -Family $Family `
      -FileCount $FileCount `
      -HasDirectoryIndex $HasDirectoryIndex `
      -HasRootFacade $HasRootFacade `
      -RootExported $RootExported `
      -PackageExported $PackageExported

    $Families.Add([pscustomobject]@{
      family=$Family
      file_count=$FileCount
      has_directory_index=$HasDirectoryIndex
      directory_index=$IndexPath
      has_root_facade=$HasRootFacade
      root_facade=$RootFacadePath
      root_exported=$RootExported
      package_exported=$PackageExported
      decision=$Decision
    }) | Out-Null
  }

  $ConsolidationReviewCount = @($Families | Where-Object { $_.decision -eq "CONSOLIDATION_REVIEW" }).Count
  $InternalReviewCount = @($Families | Where-Object { $_.decision -eq "INTERNAL_ONLY_REVIEW" }).Count
  $PublicOwnerCount = @($Families | Where-Object { $_.decision -eq "PUBLIC_FAMILY_OWNER" }).Count
  $PackageOwnerCount = @($Families | Where-Object { $_.decision -like "KEEP_*" }).Count

  Add-Finding `
    -Code "FAMILY_MAP_COMPLETED" `
    -Severity "PASS" `
    -Path "packages/ui-kit/src" `
    -Evidence "Families=$($Families.Count); PublicOwners=$PublicOwnerCount; PackageOwners=$PackageOwnerCount; ConsolidationReview=$ConsolidationReviewCount; InternalReview=$InternalReviewCount" `
    -Action "Use consolidation map to choose the next single bounded APPLY."

  if ($ConsolidationReviewCount -gt 0) {
    Add-Finding `
      -Code "CONSOLIDATION_REVIEW_REQUIRED" `
      -Severity "WARN" `
      -Path "packages/ui-kit/src" `
      -Evidence "Families needing review: $ConsolidationReviewCount" `
      -Action "Next APPLY should target one family only."
  } else {
    Add-Finding `
      -Code "NO_CONSOLIDATION_REVIEW_FAMILIES" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src" `
      -Evidence "No consolidation-review families detected." `
      -Action "Proceed to runtime/type guard."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_ANALYZE_UIKIT_FAMILY_CONSOLIDATION_MAP" `
    -Evidence $_.Exception.Message `
    -Action "Fix bounded family-map check before continuing."
}

$Families | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FamiliesPath
$RootExports | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RootExportsPath
$PackageExports | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $PackageExportsPath
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Warns = @($Findings | Where-Object { $_.severity -eq "WARN" })
$Passes = @($Findings | Where-Object { $_.severity -eq "PASS" })
$Infos = @($Findings | Where-Object { $_.severity -eq "INFO" })

$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Warns.Count -gt 0) { "WARN" } else { "PASS" }

$Evidence = [pscustomobject]@{
  session_id=$SessionId
  status=$Status
  run_root=$RunRoot
  counts=[pscustomobject]@{
    pass=$Passes.Count
    info=$Infos.Count
    warn=$Warns.Count
    fail=$Fails.Count
    families=$Families.Count
    root_exports=$RootExports.Count
    package_exports=$PackageExports.Count
    consolidation_review=(@($Families | Where-Object { $_.decision -eq "CONSOLIDATION_REVIEW" }).Count)
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK ANALYZE — UIKIT Family Consolidation Map

Session: $SessionId
Status: $Status

## Scope

Only packages/ui-kit/src family-level structure.

## Evidence

- Findings: $FindingsPath
- Family map: $FamiliesPath
- Root exports: $RootExportsPath
- Package exports: $PackageExportsPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- INFO: $($Infos.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Families: $($Families.Count)
- Root exports: $($RootExports.Count)
- Package exports: $($PackageExports.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-19 UIKIT FAMILY CONSOLIDATION MAP STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Families: $($Families.Count)" -ForegroundColor Cyan
Write-Host "Root exports: $($RootExports.Count)" -ForegroundColor Cyan
Write-Host "Package exports: $($PackageExports.Count)" -ForegroundColor Cyan
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Family map: $FamiliesPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Top consolidation-review families:" -ForegroundColor Yellow
$Families | Where-Object { $_.decision -eq "CONSOLIDATION_REVIEW" } | Format-Table family,file_count,has_directory_index,has_root_facade,root_exported,package_exported,decision -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
