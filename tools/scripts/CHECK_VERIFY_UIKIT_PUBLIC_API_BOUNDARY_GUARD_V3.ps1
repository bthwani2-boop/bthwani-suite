Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_VERIFY_UIKIT_PUBLIC_API_BOUNDARY_GUARD_V3"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$IndexPath = Join-Path $UiKitSrc "index.ts"
$PackageJsonPath = Join-Path $RepoRoot "packages\ui-kit\package.json"

$AllowedPreviewConsumers = @(
  "apps/web/website/app/ui-kit/ui-kit-preview-page.tsx"
)

$Findings = New-Object System.Collections.Generic.List[object]
$RootExports = New-Object System.Collections.Generic.List[object]
$Violations = New-Object System.Collections.Generic.List[object]
$AllowedRows = New-Object System.Collections.Generic.List[object]
$PackageExports = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$RootExportsPath = Join-Path $RunRoot "ROOT_EXPORTS.csv"
$ViolationsPath = Join-Path $RunRoot "PUBLIC_API_VIOLATIONS.csv"
$AllowedPath = Join-Path $RunRoot "ALLOWED_PREVIEW_CONSUMERS.csv"
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

function Test-RootExportTarget {
  param([string]$Spec)

  $Candidates = @(
    (Join-Path $UiKitSrc "$Spec.ts"),
    (Join-Path $UiKitSrc "$Spec.tsx"),
    (Join-Path $UiKitSrc "$Spec.js"),
    (Join-Path $UiKitSrc "$Spec.jsx"),
    (Join-Path $UiKitSrc "$Spec\index.ts"),
    (Join-Path $UiKitSrc "$Spec\index.tsx")
  )

  foreach ($Candidate in $Candidates) {
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      return $true
    }
  }

  return $false
}

function ParseGitGrep {
  param([string]$Line)

  if ($Line -notmatch '^(.+?):(\d+):(.*)$') {
    return $null
  }

  return [pscustomobject]@{
    path = $Matches[1]
    line = [int]$Matches[2]
    text = $Matches[3]
  }
}

try {
  Write-Host ""
  Write-Host "CHECK UIKIT PUBLIC API BOUNDARY GUARD V3" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "Missing ui-kit src path: $UiKitSrc"
  }

  if (-not (Test-Path -LiteralPath $IndexPath)) {
    throw "Missing ui-kit root index: $IndexPath"
  }

  $IndexText = ReadText $IndexPath

  foreach ($Match in [regex]::Matches($IndexText, "(?m)^\s*export\s+\*\s+from\s+['""]\.\/([^'""]+)['""];")) {
    $Spec = $Match.Groups[1].Value
    $Exists = Test-RootExportTarget -Spec $Spec

    $RootExports.Add([pscustomobject]@{
      specifier="./$Spec"
      target_exists=$Exists
    }) | Out-Null

    if (-not $Exists) {
      Add-Finding `
        -Code "BROKEN_ROOT_EXPORT" `
        -Severity "FAIL" `
        -Path "packages/ui-kit/src/index.ts" `
        -Evidence "export * from './$Spec' points to no file/folder owner." `
        -Action "Remove broken export or restore canonical owner."
    }
  }

  if ($IndexText -match "(?m)^\s*export\s+\*\s+from\s+['""]\.\/patterns['""];") {
    Add-Finding `
      -Code "ROOT_EXPORTS_PATTERNS_FORBIDDEN" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Root index exports ./patterns." `
      -Action "Patterns must not leak through root public API."
  }

  if ($IndexText -match "(?m)^\s*export\s+\*\s+from\s+['""]\.\/(_internal|preview|lab|proof)(\/[^'""]*)?['""];") {
    Add-Finding `
      -Code "ROOT_EXPORTS_INTERNAL_PREVIEW_LAB_FORBIDDEN" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Root index exports internal/preview/lab/proof lane." `
      -Action "Root production API must stay clean."
  }

  Add-Finding `
    -Code "ROOT_EXPORTS_SCANNED" `
    -Severity "PASS" `
    -Path "packages/ui-kit/src/index.ts" `
    -Evidence "Root export statements scanned: $($RootExports.Count)" `
    -Action "Continue if no FAIL findings."

  $PackageHasPreviewExport = $false

  if (Test-Path -LiteralPath $PackageJsonPath) {
    $PackageText = ReadText $PackageJsonPath

    try {
      $PackageJson = $PackageText | ConvertFrom-Json

      if ($PackageJson.exports) {
        foreach ($Prop in $PackageJson.exports.PSObject.Properties) {
          $Name = $Prop.Name
          $Value = ($Prop.Value | ConvertTo-Json -Depth 10 -Compress)

          $PackageExports.Add([pscustomobject]@{
            export_name=$Name
            value=$Value
          }) | Out-Null

          if ($Value -match "_internal") {
            Add-Finding `
              -Code "PACKAGE_EXPORTS_INTERNAL_FORBIDDEN" `
              -Severity "FAIL" `
              -Path "packages/ui-kit/package.json" `
              -Evidence "exports.$Name contains _internal path." `
              -Action "Remove internal package export."
          }

          if ($Name -eq "./preview") {
            $PackageHasPreviewExport = $true
          }
        }
      }
    } catch {
      Add-Finding `
        -Code "PACKAGE_JSON_PARSE_FAILED" `
        -Severity "FAIL" `
        -Path "packages/ui-kit/package.json" `
        -Evidence $_.Exception.Message `
        -Action "Fix package.json before boundary cleanup."
    }
  } else {
    Add-Finding `
      -Code "PACKAGE_JSON_MISSING" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/package.json" `
      -Evidence "package.json does not exist." `
      -Action "Restore package manifest."
  }

  $GitOk = $true
  try {
    & git --version | Out-Null
    if ($LASTEXITCODE -ne 0) { $GitOk = $false }
  } catch {
    $GitOk = $false
  }

  if (-not $GitOk) {
    Add-Finding `
      -Code "GIT_NOT_AVAILABLE" `
      -Severity "FAIL" `
      -Path "repo" `
      -Evidence "git command unavailable." `
      -Action "Run from Git-enabled terminal."
  } else {
    $StrictForbiddenPatterns = @(
      "packages[\\/]+ui-kit[\\/]+src",
      "@bthwani/ui-kit[\\/]+src",
      "@bthwani/ui-kit[\\/]+_internal",
      "@bthwani/ui-kit/_internal"
    )

    foreach ($Pattern in $StrictForbiddenPatterns) {
      $Matches = @(& git grep -n -I -E -e $Pattern -- ':*.ts' ':*.tsx' ':*.js' ':*.jsx' ':!packages/ui-kit/**' ':!tools/**' 2>$null)

      foreach ($Line in $Matches) {
        if ([string]::IsNullOrWhiteSpace($Line)) { continue }

        $Parsed = ParseGitGrep $Line
        if ($null -eq $Parsed) { continue }

        $Violations.Add([pscustomobject]@{
          type="STRICT_FORBIDDEN"
          pattern=$Pattern
          path=$Parsed.path
          line=$Parsed.line
          text=$Parsed.text
          action="Replace with lawful public @bthwani/ui-kit entrypoint."
        }) | Out-Null
      }
    }

    $PreviewMatches = @(& git grep -n -I -E -e "@bthwani/ui-kit[\\/]preview|@bthwani/ui-kit/preview" -- ':*.ts' ':*.tsx' ':*.js' ':*.jsx' ':!packages/ui-kit/**' ':!tools/**' 2>$null)

    foreach ($Line in $PreviewMatches) {
      if ([string]::IsNullOrWhiteSpace($Line)) { continue }

      $Parsed = ParseGitGrep $Line
      if ($null -eq $Parsed) { continue }

      $IsAllowed = $false
      foreach ($Allowed in $AllowedPreviewConsumers) {
        if ($Parsed.path -eq $Allowed) {
          $IsAllowed = $true
          break
        }
      }

      if ($IsAllowed) {
        $AllowedRows.Add([pscustomobject]@{
          path=$Parsed.path
          line=$Parsed.line
          text=$Parsed.text
          reason="Allowed preview/showcase consumer."
        }) | Out-Null
      } else {
        $Violations.Add([pscustomobject]@{
          type="PREVIEW_USED_BY_PRODUCTION_CONSUMER"
          pattern="@bthwani/ui-kit/preview"
          path=$Parsed.path
          line=$Parsed.line
          text=$Parsed.text
          action="Move this consumer to preview/showcase lane or remove preview import."
        }) | Out-Null
      }
    }
  }

  if ($Violations.Count -gt 0) {
    Add-Finding `
      -Code "PUBLIC_API_VIOLATIONS_FOUND" `
      -Severity "FAIL" `
      -Path "repo" `
      -Evidence "Violations: $($Violations.Count)" `
      -Action "Patch violations before deleting/moving ui-kit internals."
  } else {
    Add-Finding `
      -Code "NO_PUBLIC_API_VIOLATIONS_FOUND" `
      -Severity "PASS" `
      -Path "repo" `
      -Evidence "No forbidden src/internal/production-preview imports found." `
      -Action "Boundary is clean for next cleanup."
  }

  if ($PackageHasPreviewExport) {
    if ($AllowedRows.Count -gt 0 -and $Violations.Count -eq 0) {
      Add-Finding `
        -Code "PACKAGE_PREVIEW_EXPORT_ALLOWED" `
        -Severity "PASS" `
        -Path "packages/ui-kit/package.json" `
        -Evidence "Package exports ./preview and all preview consumers are allowlisted showcase/preview consumers." `
        -Action "Keep preview entrypoint isolated from root production API."
    } elseif ($AllowedRows.Count -eq 0) {
      Add-Finding `
        -Code "PACKAGE_PREVIEW_EXPORT_UNUSED_REVIEW" `
        -Severity "WARN" `
        -Path "packages/ui-kit/package.json" `
        -Evidence "Package exports ./preview but no allowlisted preview consumer was found." `
        -Action "Remove ./preview if not needed."
    }
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_VERIFY_UIKIT_PUBLIC_API_BOUNDARY_GUARD_V3" `
    -Evidence $_.Exception.Message `
    -Action "Fix this bounded check before continuing."
}

$RootExports | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RootExportsPath
$Violations | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ViolationsPath
$AllowedRows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $AllowedPath
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
    root_exports=$RootExports.Count
    violations=$Violations.Count
    allowed_preview_consumers=$AllowedRows.Count
    package_exports=$PackageExports.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK VERIFY — UIKIT Public API Boundary Guard V3

Session: $SessionId
Status: $Status

## Scope

One issue only:
ui-kit public API boundary with correct preview/showcase allowlist.

## Rules

- Root public API must not expose preview/internal/lab/proof.
- Consumers must not import ui-kit/src or _internal.
- Production consumers must not import @bthwani/ui-kit/preview.
- The dedicated preview page may import @bthwani/ui-kit/preview.

## Evidence

- Findings: $FindingsPath
- Root exports: $RootExportsPath
- Violations: $ViolationsPath
- Allowed preview consumers: $AllowedPath
- Package exports: $PackageExportsPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- INFO: $($Infos.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Root exports: $($RootExports.Count)
- Violations: $($Violations.Count)
- Allowed preview consumers: $($AllowedRows.Count)
- Package exports: $($PackageExports.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-12 V3 UIKIT PUBLIC API BOUNDARY STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Root exports: $($RootExports.Count)" -ForegroundColor Cyan
Write-Host "Violations: $($Violations.Count)" -ForegroundColor Cyan
Write-Host "Allowed preview consumers: $($AllowedRows.Count)" -ForegroundColor Cyan
Write-Host "Package exports: $($PackageExports.Count)" -ForegroundColor Cyan
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
