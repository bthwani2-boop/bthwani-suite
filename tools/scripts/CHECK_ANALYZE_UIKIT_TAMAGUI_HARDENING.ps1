Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_UIKIT_TAMAGUI_HARDENING"
$RepoRoot = (Get-Location).Path
$RunsRoot = Join-Path $RepoRoot "tools\registry\runs"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path $RunsRoot $SessionId

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$UiKitPackageJson = Join-Path $RepoRoot "packages\ui-kit\package.json"
$RootTamaguiConfig = Join-Path $RepoRoot "tamagui.config.ts"
$RootTamaguiBuild = Join-Path $RepoRoot "tamagui.build.ts"
$RootGitIgnore = Join-Path $RepoRoot ".gitignore"

$TargetFiles = @(
  "packages/ui-kit/src/foundation.ts",
  "packages/ui-kit/src/primitives.tsx",
  "packages/ui-kit/src/components/button.tsx",
  "packages/ui-kit/src/components/card.tsx",
  "packages/ui-kit/src/components/field.tsx",
  "packages/ui-kit/src/providers.tsx",
  "packages/ui-kit/src/mobile/root.tsx",
  "packages/ui-kit/src/web/root-layout.tsx"
)

$PublicApiFiles = @(
  "packages/ui-kit/src/index.ts",
  "packages/ui-kit/src/mobile.ts",
  "packages/ui-kit/src/next.ts",
  "packages/ui-kit/src/web.ts"
)

$ProtectedLiveReferenceFiles = @(
  "packages/surfaces/src/service-owned/dsh/app-client/stores/screens/DshStoreGetScreen.tsx",
  "packages/surfaces/src/service-owned/dsh/app-client/home/screens/DshHomeGetScreen.tsx",
  "packages/surfaces/src/service-owned/dsh/app-client/home/components/StoreCardPremium.tsx",
  "packages/surfaces/src/service-owned/dsh/app-client/cart/screens/DshCartUnifiedScreen.tsx",
  "packages/surfaces/src/service-owned/dsh/app-client/checkout/screens/checkoutTracking.tsx",
  "packages/surfaces/src/service-owned/dsh/app-client/home/components/HomeBannerCarousel.tsx",
  "packages/surfaces/src/service-owned/dsh/app-client/home/components/DshHomeApprovedVideoReelsViewer.tsx",
  "packages/surfaces/src/surface-owned/app-client/client-entry/ClientEntrySurface.tsx"
)

$AllowedRawTamaguiImportFiles = @(
  "packages/ui-kit/src/tamagui-config.ts",
  "packages/ui-kit/src/providers.tsx",
  "tamagui.build.ts"
)

$Findings = New-Object System.Collections.Generic.List[object]
$TargetRows = New-Object System.Collections.Generic.List[object]
$PublicApiRows = New-Object System.Collections.Generic.List[object]
$RawTamaguiRows = New-Object System.Collections.Generic.List[object]
$ExportStarRows = New-Object System.Collections.Generic.List[object]
$AnyRows = New-Object System.Collections.Generic.List[object]
$ProtectedRows = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$TargetRowsPath = Join-Path $RunRoot "TARGET_READINESS.csv"
$PublicApiRowsPath = Join-Path $RunRoot "PUBLIC_EXPORT_DIFF.csv"
$RawTamaguiRowsPath = Join-Path $RunRoot "RAW_TAMAGUI_IMPORTS.csv"
$ExportStarRowsPath = Join-Path $RunRoot "EXPORT_STAR_SCAN.csv"
$AnyRowsPath = Join-Path $RunRoot "ANY_SCAN.csv"
$ProtectedRowsPath = Join-Path $RunRoot "PROTECTED_LIVE_REFERENCE_STATUS.csv"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$MergedEvidencePath = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"
$EvidenceJsonPath = Join-Path $RunRoot "evidence.json"

function Normalize-PathText {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return "" }
  return (($Path -replace "\\", "/") -replace "/+", "/")
}

function RelPath {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return "" }
  $Full = [System.IO.Path]::GetFullPath($Path)
  if ($Full.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return Normalize-PathText ($Full.Substring($RepoRoot.Length).TrimStart([char[]]@('\','/')))
  }
  return Normalize-PathText $Path
}

function ReadText {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return "" }
  try { return Get-Content -LiteralPath $Path -Raw -Encoding UTF8 } catch { return Get-Content -LiteralPath $Path -Raw }
}

function Get-GitText {
  param([string]$GitPath)
  try {
    $Text = & git show "HEAD:$GitPath" 2>$null
    if ($LASTEXITCODE -ne 0) { return "" }
    return [string]$Text
  } catch {
    return ""
  }
}

function Add-Finding {
  param(
    [string]$Code,
    [string]$Severity,
    [string]$Path,
    [string]$Evidence,
    [string]$Action
  )

  $Findings.Add([pscustomobject]@{
    code = $Code
    severity = $Severity
    path = $Path
    evidence = $Evidence
    action = $Action
  }) | Out-Null

  $Color = if ($Severity -eq "PASS") { "Green" } elseif ($Severity -eq "INFO") { "Cyan" } elseif ($Severity -eq "WARN") { "Yellow" } else { "Red" }
  Write-Host "[$Severity] $Code — $Path" -ForegroundColor $Color
}

function Write-Section {
  param([string]$Title)
  Write-Host ""
  Write-Host $Title -ForegroundColor Cyan
}

function Test-PathListChanged {
  param([string[]]$Paths)
  $Args = @("status", "--porcelain", "--") + $Paths
  $Output = & git @Args 2>$null
  if ($LASTEXITCODE -ne 0) { return @() }
  return @($Output)
}

function Get-CurrentExportNames {
  param([string]$Content)

  $Symbols = New-Object System.Collections.Generic.List[string]
  if ([string]::IsNullOrWhiteSpace($Content)) { return @() }

  $Pattern = '(?s)export\s+(?:type\s+)?\{(.*?)\}'
  foreach ($Match in [regex]::Matches($Content, $Pattern)) {
    $Block = [string]$Match.Groups[1].Value
    foreach ($Raw in ($Block -split ',')) {
      $Symbol = ([string]$Raw).Trim()
      if ($Symbol.Length -eq 0) { continue }
      $Symbol = $Symbol -replace '^type\s+', ''
      $Parts = $Symbol -split '\s+as\s+'
      $PublicName = ($Parts[-1]).Trim()
      if ($PublicName.Length -gt 0) { [void]$Symbols.Add($PublicName) }
    }
  }

  foreach ($Match in [regex]::Matches($Content, '(?m)^\s*export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_][A-Za-z0-9_]*)')) {
    [void]$Symbols.Add([string]$Match.Groups[1].Value)
  }

  return @($Symbols | Sort-Object -Unique)
}

function Compare-ExportSurface {
  param(
    [string]$RelativePath,
    [string]$CurrentContent,
    [string]$HeadContent
  )

  $CurrentExports = Get-CurrentExportNames -Content $CurrentContent
  $HeadExports = Get-CurrentExportNames -Content $HeadContent

  $Added = @($CurrentExports | Where-Object { $_ -notin $HeadExports } | Sort-Object)
  $Removed = @($HeadExports | Where-Object { $_ -notin $CurrentExports } | Sort-Object)

  $PublicApiRows.Add([pscustomobject]@{
    file = $RelativePath
    added_exports = ($Added -join '; ')
    removed_exports = ($Removed -join '; ')
    current_export_count = $CurrentExports.Count
    head_export_count = $HeadExports.Count
  }) | Out-Null

  Add-Finding -Code "PUBLIC_EXPORT_SURFACE_SCANNED" -Severity "PASS" -Path $RelativePath -Evidence ("current={0}, head={1}, added={2}, removed={3}" -f $CurrentExports.Count, $HeadExports.Count, $Added.Count, $Removed.Count) -Action "Review any additions for compatibility aliases."

  return [pscustomobject]@{
    current = $CurrentExports
    head = $HeadExports
    added = $Added
    removed = $Removed
  }
}

function Add-ReadinessRow {
  param(
    [string]$Path,
    [string]$Status,
    [string]$Signal,
    [string]$Notes
  )

  $TargetRows.Add([pscustomobject]@{
    path = $Path
    status = $Status
    signal = $Signal
    notes = $Notes
  }) | Out-Null
}

try {
  Write-Section "CHECK ANALYZE UIKIT TAMAGUI HARDENING"
  Write-Host "RepoRoot: $RepoRoot"
  Write-Host "RunRoot:  $RunRoot"

  $TargetChecks = @(
    @{ path = "packages/ui-kit/src/foundation.ts"; required = @("brandColorRoles", "surfaceContainerRoles", "semanticColorRoles", "shadowLaw", "typographyRoles", "directionConfig", "resolveSemanticTheme", "createTokenCssVariables", "createThemeCssVariables"); label = "foundation" },
    @{ path = "packages/ui-kit/src/primitives.tsx"; required = @("BthBox", "BthSurface", "BthText", "BthMobileScrollView", "surfaceToneLaw", "shadowLaw"); label = "primitives" },
    @{ path = "packages/ui-kit/src/components/button.tsx"; required = @("Button", "BthButton", "ButtonTone", "iconPosition", "Badge", "BthBadge", "Chip", "BthChip"); label = "button" },
    @{ path = "packages/ui-kit/src/components/card.tsx"; required = @("Card", "BthCard", "ProductCard", "BthProductCard", "StatCard", "BthStatCard", "ServiceTileCard", "BthServiceTileCard"); label = "card" },
    @{ path = "packages/ui-kit/src/components/field.tsx"; required = @("TextField", "BthTextField", "SearchField", "BthSearchField", "SelectField", "BthSelectField", "FormScreenShell", "BthFormScreenShell"); label = "field" },
    @{ path = "packages/ui-kit/src/providers.tsx"; required = @("TamaguiProvider", "tamaguiConfig", "RootProviders", "UiKitProvider", "PortalHost", "PortalLayer"); label = "providers" },
    @{ path = "packages/ui-kit/src/mobile/root.tsx"; required = @("RootProviders", "MobileRoot", "BthMobileRoot"); label = "mobile-root" },
    @{ path = "packages/ui-kit/src/web/root-layout.tsx"; required = @("RootProviders", "WebThemeStyle", "WebRootBody", "WebDocumentShell", "WebRootLayout", "buildWebThemeStyleSheet"); label = "web-root-layout" }
  )

  foreach ($Check in $TargetChecks) {
    $Path = Join-Path $RepoRoot $Check.path
    $Exists = Test-Path -LiteralPath $Path -PathType Leaf
    $Content = if ($Exists) { ReadText $Path } else { "" }
    $Missing = @()

    foreach ($Needle in $Check.required) {
      if ([string]::IsNullOrWhiteSpace($Content) -or $Content -notmatch [regex]::Escape($Needle)) {
        $Missing += $Needle
      }
    }

    if (-not $Exists) {
      Add-Finding -Code "TARGET_MISSING" -Severity "FAIL" -Path $Check.path -Evidence "Target file missing." -Action "Restore the file before hardening can be considered ready."
      Add-ReadinessRow -Path $Check.path -Status "MISSING" -Signal "missing-file" -Notes "File does not exist."
      continue
    }

    if ($Missing.Count -gt 0) {
      Add-Finding -Code "TARGET_NOT_READY" -Severity "WARN" -Path $Check.path -Evidence ("Missing signals: {0}" -f ($Missing -join ', ')) -Action "Complete local hardening contract for this file."
      Add-ReadinessRow -Path $Check.path -Status "PARTIAL" -Signal ($Missing -join '; ') -Notes "Missing one or more readiness markers."
    } else {
      Add-Finding -Code "TARGET_READY" -Severity "PASS" -Path $Check.path -Evidence "Readiness markers present." -Action "Keep compatible public surface stable."
      Add-ReadinessRow -Path $Check.path -Status "READY" -Signal "all-required-markers-present" -Notes "All key hardening markers present."
    }
  }

  $AllowedRawFiles = @{}
  foreach ($Item in $AllowedRawTamaguiImportFiles) { $AllowedRawFiles[$Item] = $true }

  $FileExtensions = @('.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.ps1')
  $ScanItems = @(
    (Join-Path $RepoRoot "packages\ui-kit\src"),
    $RootTamaguiConfig,
    $RootTamaguiBuild
  )

  Write-Section "Scanning for raw Tamagui imports"
  $ScanFiles = New-Object System.Collections.Generic.List[System.IO.FileInfo]
  foreach ($ScanItem in $ScanItems) {
    if (Test-Path -LiteralPath $ScanItem -PathType Leaf) {
      $ScanFiles.Add((Get-Item -LiteralPath $ScanItem)) | Out-Null
      continue
    }

    if (Test-Path -LiteralPath $ScanItem -PathType Container) {
      foreach ($Child in (Get-ChildItem -LiteralPath $ScanItem -Recurse -File)) {
        if ($Child.Extension -in $FileExtensions -and $Child.FullName -notmatch '\\node_modules\\|\\dist\\|\\build\\|\\coverage\\|\\.nx\\|\\.git\\|\\tools\\registry\\runs\\') {
          $ScanFiles.Add($Child) | Out-Null
        }
      }
    }
  }

  foreach ($File in $ScanFiles) {
    $Rel = RelPath $File.FullName
    $Content = ReadText $File.FullName
    if ([string]::IsNullOrWhiteSpace($Content)) { continue }

    $RawImportPattern = @'
(?m)from\s+["''](tamagui|@tamagui/config(?:\/v\d+)?)[''']
'@
    $Matches = [regex]::Matches($Content, $RawImportPattern)
    foreach ($Match in $Matches) {
      if ($AllowedRawFiles.ContainsKey($Rel)) { continue }
      $RawTamaguiRows.Add([pscustomobject]@{
        file = $Rel
        import_spec = [string]$Match.Groups[1].Value
        line_sample = ($Match.Value).Trim()
      }) | Out-Null
    }
  }

  if ($RawTamaguiRows.Count -gt 0) {
    Add-Finding -Code "RAW_TAMAGUI_IMPORTS_FOUND" -Severity "FAIL" -Path "repo" -Evidence ("{0} raw Tamagui import(s) found outside allowed bridge files." -f $RawTamaguiRows.Count) -Action "Move imports into allowed bridge files only."
  } else {
    Add-Finding -Code "RAW_TAMAGUI_IMPORTS_CLEAN" -Severity "PASS" -Path "repo" -Evidence "No raw Tamagui imports found outside allowed bridge files." -Action "Continue."
  }

  Write-Section "Scanning for export star usage"
  $ExportStarFiles = @(
    (Join-Path $RepoRoot "packages\ui-kit\src"),
    (Join-Path $RepoRoot "tamagui.config.ts"),
    (Join-Path $RepoRoot "packages\ui-kit\src\mobile.ts"),
    (Join-Path $RepoRoot "packages\ui-kit\src\next.ts"),
    (Join-Path $RepoRoot "packages\ui-kit\src\web.ts")
  )

  foreach ($Candidate in $ExportStarFiles) {
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      $Files = @((Get-Item -LiteralPath $Candidate))
    } elseif (Test-Path -LiteralPath $Candidate -PathType Container) {
      $Files = Get-ChildItem -LiteralPath $Candidate -Recurse -File |
        Where-Object { $_.Extension -in @('.ts', '.tsx') -and $_.FullName -notmatch '\\node_modules\\|\\dist\\|\\build\\|\\coverage\\|\\.nx\\|\\.git\\|\\tools\\registry\\runs\\' }
    } else {
      continue
    }

    foreach ($File in $Files) {
      $Rel = RelPath $File.FullName
      $Content = ReadText $File.FullName
      if ([string]::IsNullOrWhiteSpace($Content)) { continue }
      $ExportStarPattern = @'
(?m)^\s*export\s+\*\s+from\s+["''][^"'']+["''];?
'@
      foreach ($Match in [regex]::Matches($Content, $ExportStarPattern)) {
        $ExportStarRows.Add([pscustomobject]@{
          file = $Rel
          line_sample = ([string]$Match.Value).Trim()
        }) | Out-Null
      }
    }
  }

  if ($ExportStarRows.Count -gt 0) {
    Add-Finding -Code "EXPORT_STAR_FOUND" -Severity "FAIL" -Path "packages/ui-kit/src" -Evidence ("{0} export-star line(s) found." -f $ExportStarRows.Count) -Action "Replace with explicit exports or compatibility aliases."
  } else {
    Add-Finding -Code "EXPORT_STAR_CLEAN" -Severity "PASS" -Path "packages/ui-kit/src" -Evidence "No export-star usage found in ui-kit source or bridge files." -Action "Continue."
  }

  Write-Section "Scanning for any usage"
  foreach ($File in $ScanFiles | Where-Object { $_.Extension -in @('.ts', '.tsx', '.js', '.jsx') }) {
    $Rel = RelPath $File.FullName
    $Content = ReadText $File.FullName
    if ([string]::IsNullOrWhiteSpace($Content)) { continue }

    foreach ($Match in [regex]::Matches($Content, '(?<![A-Za-z0-9_])any(?![A-Za-z0-9_])')) {
      $AnyRows.Add([pscustomobject]@{
        file = $Rel
        line_sample = ([string]$Match.Value).Trim()
      }) | Out-Null
    }
  }

  if ($AnyRows.Count -gt 0) {
    Add-Finding -Code "ANY_USAGE_FOUND" -Severity "FAIL" -Path "packages/ui-kit/src" -Evidence ("{0} any token(s) found in ui-kit source files." -f $AnyRows.Count) -Action "Remove any usage from hardening surfaces."
  } else {
    Add-Finding -Code "ANY_USAGE_CLEAN" -Severity "PASS" -Path "packages/ui-kit/src" -Evidence "No any tokens found in ui-kit source files scanned by this gate." -Action "Continue."
  }

  Write-Section "Checking protected live references"
  $ProtectedChanged = Test-PathListChanged -Paths $ProtectedLiveReferenceFiles
  foreach ($Path in $ProtectedLiveReferenceFiles) {
    $ProtectedRows.Add([pscustomobject]@{
      path = $Path
      changed = ($ProtectedChanged -contains $Path)
    }) | Out-Null
  }

  if ($ProtectedChanged.Count -gt 0) {
    Add-Finding -Code "PROTECTED_LIVE_REFERENCES_CHANGED" -Severity "FAIL" -Path "packages/surfaces" -Evidence ($ProtectedChanged -join '; ') -Action "Revert or rebase protected live references before PASS."
  } else {
    Add-Finding -Code "PROTECTED_LIVE_REFERENCES_UNCHANGED" -Severity "PASS" -Path "packages/surfaces" -Evidence "Protected live references are unchanged in git status." -Action "Continue."
  }

  Write-Section "Comparing public export surfaces"
  foreach ($File in $PublicApiFiles) {
    $CurrentPath = Join-Path $RepoRoot $File
    $CurrentText = ReadText $CurrentPath
    $HeadText = Get-GitText -GitPath $File
    if ([string]::IsNullOrWhiteSpace($CurrentText)) {
      Add-Finding -Code "PUBLIC_EXPORT_FILE_MISSING" -Severity "FAIL" -Path $File -Evidence "Current file missing or unreadable." -Action "Restore the public API file."
      continue
    }

    $null = Compare-ExportSurface -RelativePath $File -CurrentContent $CurrentText -HeadContent $HeadText
  }

  $DiffNameOnly = @(& git diff --name-only -- packages/ui-kit tamagui.config.ts tamagui.build.ts .gitignore 2>$null)
  $ChangedReadiness = if ($DiffNameOnly.Count -gt 0) { "DIRTY" } else { "CLEAN" }
  Add-Finding -Code "SCOPE_DIFF_SCANNED" -Severity "PASS" -Path "repo" -Evidence ("changed_files={0}" -f ($DiffNameOnly -join '; ')) -Action "Review expected ui-kit hardening changes only."

  $Statuses = @($TargetRows | Select-Object -ExpandProperty status)
  $HasTargetReady = ($Statuses -contains "READY")
  $HasTargetMissing = ($Statuses -contains "MISSING")
  $HasWarnings = @($Findings | Where-Object { $_.severity -eq "WARN" }).Count -gt 0
  $HasFails = @($Findings | Where-Object { $_.severity -eq "FAIL" }).Count -gt 0

  $OverallStatus = if ($HasFails) { "FAIL" } elseif ($HasWarnings) { "READY_WITH_WARNINGS" } elseif ($HasTargetReady -and -not $HasTargetMissing) { "READY_FOR_HARDENING" } else { "BLOCKED" }

  $Summary = @"
# CHECK ANALYZE UIKIT TAMAGUI HARDENING

Session: $SessionId
Status: $OverallStatus

## What this checks

- ui-kit hardening readiness for foundation, primitives, button, card, field, providers, mobile root, and web root
- raw Tamagui import boundaries
- export-star usage
- any token usage
- protected live reference drift
- public export surface diff against HEAD

## Key evidence

- Run root: $RunRoot
- Merged evidence: $MergedEvidencePath
- Findings: $FindingsPath
- Target readiness: $TargetRowsPath
- Public export diff: $PublicApiRowsPath
- Raw Tamagui imports: $RawTamaguiRowsPath
- Export-star scan: $ExportStarRowsPath
- any scan: $AnyRowsPath
- Protected references: $ProtectedRowsPath

## High-level result

- Targets ready: $(@($TargetRows | Where-Object { $_.status -eq 'READY' }).Count)
- Targets partial: $(@($TargetRows | Where-Object { $_.status -eq 'PARTIAL' }).Count)
- Targets missing: $(@($TargetRows | Where-Object { $_.status -eq 'MISSING' }).Count)
- Raw Tamagui violations: $($RawTamaguiRows.Count)
- export * violations: $($ExportStarRows.Count)
- any violations: $($AnyRows.Count)
- Protected live reference changes: $($ProtectedChanged.Count)
"@

  $TargetRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $TargetRowsPath
  $PublicApiRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $PublicApiRowsPath
  $RawTamaguiRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RawTamaguiRowsPath
  $ExportStarRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ExportStarRowsPath
  $AnyRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $AnyRowsPath
  $ProtectedRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ProtectedRowsPath
  $Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath
  $SummaryLines = New-Object System.Collections.Generic.List[string]
  $SummaryLines.Add('# CHECK ANALYZE UIKIT TAMAGUI HARDENING') | Out-Null
  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add("Session: $SessionId") | Out-Null
  $SummaryLines.Add("Status: $OverallStatus") | Out-Null
  $SummaryLines.Add("Scope diff status: $ChangedReadiness") | Out-Null
  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## Target readiness') | Out-Null
  foreach ($Row in $TargetRows) {
    $SummaryLines.Add(('- {0} => {1} | {2} | {3}' -f $Row.path, $Row.status, $Row.signal, $Row.notes)) | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## Raw Tamagui imports') | Out-Null
  if ($RawTamaguiRows.Count -gt 0) {
    foreach ($Row in $RawTamaguiRows) {
      $SummaryLines.Add(('- {0} :: {1} :: {2}' -f $Row.file, $Row.import_spec, $Row.line_sample)) | Out-Null
    }
  } else {
    $SummaryLines.Add('- none found outside allowed bridge files') | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## export * scan') | Out-Null
  if ($ExportStarRows.Count -gt 0) {
    foreach ($Row in $ExportStarRows) {
      $SummaryLines.Add(('- {0} :: {1}' -f $Row.file, $Row.line_sample)) | Out-Null
    }
  } else {
    $SummaryLines.Add('- no export * usage found in scanned scope') | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## any scan') | Out-Null
  if ($AnyRows.Count -gt 0) {
    foreach ($Row in $AnyRows) {
      $SummaryLines.Add(('- {0} :: {1}' -f $Row.file, $Row.line_sample)) | Out-Null
    }
  } else {
    $SummaryLines.Add('- no any tokens found in scanned ui-kit source scope') | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## Protected live references') | Out-Null
  foreach ($Row in $ProtectedRows) {
    $SummaryLines.Add(('- {0} => changed={1}' -f $Row.path, $Row.changed)) | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## Public export diff summary') | Out-Null
  foreach ($Row in $PublicApiRows) {
    $SummaryLines.Add(('- {0} => added=[{1}] removed=[{2}] current={3} head={4}' -f $Row.file, $Row.added_exports, $Row.removed_exports, $Row.current_export_count, $Row.head_export_count)) | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## Findings') | Out-Null
  foreach ($Row in $Findings) {
    $SummaryLines.Add(('- [{0}] {1} :: {2} :: {3} :: {4}' -f $Row.severity, $Row.code, $Row.path, $Row.evidence, $Row.action)) | Out-Null
  }

  $SummaryLines.Add('') | Out-Null
  $SummaryLines.Add('## What to do next') | Out-Null
  $SummaryLines.Add('- If status is READY_FOR_HARDENING or READY_WITH_WARNINGS, proceed to the focused verification gates.') | Out-Null
  $SummaryLines.Add('- If status is FAIL, repair only the smallest local bridge or allowed ui-kit surface that controls the failure.') | Out-Null
  $SummaryLines.Add('- Do not touch protected live reference files in this phase.') | Out-Null

  $MergedText = ($SummaryLines -join [Environment]::NewLine)
  $SummaryText = $MergedText
  $SummaryText | Set-Content -Encoding UTF8 -Path $SummaryPath
  $MergedText | Set-Content -Encoding UTF8 -Path $MergedEvidencePath

  Write-Host ""
  Write-Host "CHECK_ANALYZE_UIKIT_TAMAGUI_HARDENING STATUS: $OverallStatus" -ForegroundColor $(if ($OverallStatus -eq "FAIL") { "Red" } elseif ($OverallStatus -eq "READY_FOR_HARDENING") { "Green" } else { "Yellow" })
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host "Merged evidence: $MergedEvidencePath" -ForegroundColor Cyan
  Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
  Write-Host ""
  $TargetRows | Format-Table path,status,signal,notes -Wrap
  Write-Host ""
  $Findings | Format-Table severity,code,path -Wrap
  Write-Host ""
  Write-Host "Done. Terminal remains open. No source files were changed by this script." -ForegroundColor Green

  if ($HasFails) { exit 1 }
  exit 0
}
catch {
  $FailureText = $_.Exception.Message
  Add-Finding -Code "SCRIPT_EXCEPTION" -Severity "FAIL" -Path $IssueCode -Evidence $FailureText -Action "Fix the script and rerun."
  $Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath
  $FailureText | Set-Content -Encoding UTF8 -Path $MergedEvidencePath
  Write-Host ""
  Write-Host "CHECK_ANALYZE_UIKIT_TAMAGUI_HARDENING STATUS: FAIL" -ForegroundColor Red
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host "Merged evidence: $MergedEvidencePath" -ForegroundColor Cyan
  Write-Host "Failure: $FailureText" -ForegroundColor Red
  exit 1
}
