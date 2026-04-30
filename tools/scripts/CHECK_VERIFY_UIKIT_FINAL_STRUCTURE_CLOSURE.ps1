Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_VERIFY_UIKIT_FINAL_STRUCTURE_CLOSURE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$UiKitIndex = Join-Path $UiKitSrc "index.ts"
$UiKitPackageJson = Join-Path $RepoRoot "packages\ui-kit\package.json"

$OwnerFamilies = @("foundation","patterns","root")
$AllowedPreviewConsumers = @(
  "apps/web/website/app/ui-kit/ui-kit-preview-page.tsx"
)

$Findings = New-Object System.Collections.Generic.List[object]
$Rows = New-Object System.Collections.Generic.List[object]
$Violations = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$RowsPath = Join-Path $RunRoot "STRUCTURE_CHECKS.csv"
$ViolationsPath = Join-Path $RunRoot "PUBLIC_API_VIOLATIONS.csv"
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

function ResolveRelative {
  param([string]$FromFile,[string]$Spec)

  if (-not $Spec.StartsWith(".")) { return "" }

  $Base = Split-Path -Parent $FromFile
  $Raw = Join-Path $Base $Spec

  $Candidates = @(
    $Raw,
    "$Raw.ts",
    "$Raw.tsx",
    "$Raw.js",
    "$Raw.jsx",
    "$Raw.d.ts",
    (Join-Path $Raw "index.ts"),
    (Join-Path $Raw "index.tsx")
  )

  foreach ($Candidate in $Candidates) {
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      return [System.IO.Path]::GetFullPath($Candidate)
    }
  }

  return ""
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
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) { return $true }
  }

  return $false
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

function ResolvePackagePath {
  param([string]$PackageRelative)

  if ([string]::IsNullOrWhiteSpace($PackageRelative)) { return "" }

  $Clean = $PackageRelative -replace "^\./", ""
  $Raw = Join-Path (Join-Path $RepoRoot "packages\ui-kit") $Clean

  $Candidates = @(
    $Raw,
    "$Raw.ts",
    "$Raw.tsx",
    "$Raw.js",
    "$Raw.jsx",
    "$Raw.d.ts",
    (Join-Path $Raw "index.ts"),
    (Join-Path $Raw "index.tsx")
  )

  foreach ($Candidate in $Candidates) {
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      return [System.IO.Path]::GetFullPath($Candidate)
    }
  }

  return ""
}

function ParseGitGrep {
  param([string]$Line)

  if ($Line -notmatch '^(.+?):(\d+):(.*)$') { return $null }

  return [pscustomobject]@{
    path=$Matches[1]
    line=[int]$Matches[2]
    text=$Matches[3]
  }
}

try {
  Write-Host ""
  Write-Host "CHECK UIKIT FINAL STRUCTURE CLOSURE" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $UiKitSrc)) { throw "Missing ui-kit src path." }
  if (-not (Test-Path -LiteralPath $UiKitIndex)) { throw "Missing ui-kit root index.ts." }
  if (-not (Test-Path -LiteralPath $UiKitPackageJson)) { throw "Missing ui-kit package.json." }

  foreach ($Family in $OwnerFamilies) {
    $IndexPath = Join-Path $UiKitSrc "$Family\index.ts"
    $Exists = Test-Path -LiteralPath $IndexPath -PathType Leaf
    $ExportCount = 0
    $BrokenCount = 0
    $HasEmptyExport = $false

    if (-not $Exists) {
      Add-Finding `
        -Code "OWNER_INDEX_MISSING" `
        -Severity "FAIL" `
        -Path "packages/ui-kit/src/$Family/index.ts" `
        -Evidence "Required owner index missing." `
        -Action "Restore real owner index."
    } else {
      $Text = ReadText $IndexPath

      if ($Text -match 'export\s+\{\s*\}\s*;') {
        $HasEmptyExport = $true
        Add-Finding `
          -Code "OWNER_INDEX_HAS_EMPTY_EXPORT" `
          -Severity "FAIL" `
          -Path "packages/ui-kit/src/$Family/index.ts" `
          -Evidence "Forbidden export {}; found." `
          -Action "Remove placeholder export."
      }

      foreach ($m in [regex]::Matches($Text, "(?m)^\s*export\s+(?:\*\s+from|\{[^}]+\}\s+from)\s+['""]([^'""]+)['""];")) {
        $ExportCount++
        $Spec = $m.Groups[1].Value
        $Resolved = ResolveRelative -FromFile $IndexPath -Spec $Spec
        if ([string]::IsNullOrWhiteSpace($Resolved)) {
          $BrokenCount++
          Add-Finding `
            -Code "OWNER_INDEX_BROKEN_EXPORT" `
            -Severity "FAIL" `
            -Path "packages/ui-kit/src/$Family/index.ts" `
            -Evidence "Broken export target: $Spec" `
            -Action "Fix broken export."
        }
      }

      if ($ExportCount -eq 0) {
        Add-Finding `
          -Code "OWNER_INDEX_HAS_NO_EXPORTS" `
          -Severity "FAIL" `
          -Path "packages/ui-kit/src/$Family/index.ts" `
          -Evidence "Owner index has no real exports." `
          -Action "Owner index must export real family files."
      }

      if ($ExportCount -gt 0 -and $BrokenCount -eq 0 -and -not $HasEmptyExport) {
        Add-Finding `
          -Code "OWNER_INDEX_VERIFY_PASSED" `
          -Severity "PASS" `
          -Path "packages/ui-kit/src/$Family/index.ts" `
          -Evidence "exports=$ExportCount; broken=0." `
          -Action "Closed."
      }
    }

    $Rows.Add([pscustomobject]@{
      check="owner_index"
      target=$Family
      exists=$Exists
      exports=$ExportCount
      broken=$BrokenCount
      empty_export=$HasEmptyExport
    }) | Out-Null
  }

  $RootText = ReadText $UiKitIndex
  $RootBroken = New-Object System.Collections.Generic.List[string]

  foreach ($m in [regex]::Matches($RootText, "(?m)^\s*export\s+\*\s+from\s+['""]\.\/([^'""]+)['""];")) {
    $Spec = $m.Groups[1].Value
    if (-not (Test-RootExportTarget -Spec $Spec)) {
      $RootBroken.Add("./$Spec") | Out-Null
    }
  }

  if ($RootBroken.Count -gt 0) {
    Add-Finding `
      -Code "ROOT_EXPORT_BROKEN" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Broken root exports: $($RootBroken -join ', ')" `
      -Action "Restore owner or remove broken export."
  } else {
    Add-Finding `
      -Code "ROOT_EXPORT_VERIFY_PASSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "No broken root exports." `
      -Action "Continue."
  }

  if ($RootText -match "['""]\.\/(foundation|patterns|root)['""]") {
    Add-Finding `
      -Code "ROOT_PUBLIC_API_EXPOSES_INTERNAL_OWNER_FAMILY" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Root exposes foundation/patterns/root." `
      -Action "Root public API must not expose internal owner families."
  } else {
    Add-Finding `
      -Code "ROOT_PUBLIC_API_INTERNAL_FAMILIES_NOT_EXPOSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Root does not expose foundation/patterns/root." `
      -Action "Continue."
  }

  $AllUiFiles = @(Get-ChildItem -LiteralPath $UiKitSrc -Recurse -File -Include *.ts,*.tsx |
    Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\|\\.next\\|\\.expo\\" })

  $EmptyExportFiles = @()
  foreach ($File in $AllUiFiles) {
    $Text = ReadText $File.FullName
    if (($Text -replace "\s+","") -eq "export{};") {
      $EmptyExportFiles += $File.FullName
    }
  }

  if ($EmptyExportFiles.Count -gt 0) {
    Add-Finding `
      -Code "EMPTY_EXPORT_ONLY_FILES_FOUND" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src" `
      -Evidence "Files: $($EmptyExportFiles.Count)" `
      -Action "Delete or replace real owner files."
  } else {
    Add-Finding `
      -Code "NO_EMPTY_EXPORT_ONLY_FILES" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src" `
      -Evidence "No export-only placeholder files found." `
      -Action "Continue."
  }

  $PackageJson = ReadText $UiKitPackageJson | ConvertFrom-Json
  $BrokenPackageExports = New-Object System.Collections.Generic.List[string]

  if ($PackageJson.exports) {
    foreach ($Prop in $PackageJson.exports.PSObject.Properties) {
      $Targets = @(ResolvePackageExportTarget $Prop.Value | Select-Object -Unique)
      foreach ($Target in $Targets) {
        $Resolved = ResolvePackagePath $Target
        if ([string]::IsNullOrWhiteSpace($Resolved)) {
          $BrokenPackageExports.Add("$($Prop.Name) -> $Target") | Out-Null
        }
      }
    }
  }

  if ($BrokenPackageExports.Count -gt 0) {
    Add-Finding `
      -Code "PACKAGE_EXPORT_BROKEN" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/package.json" `
      -Evidence "Broken exports: $($BrokenPackageExports -join '; ')" `
      -Action "Restore target or fix package exports."
  } else {
    Add-Finding `
      -Code "PACKAGE_EXPORT_VERIFY_PASSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit/package.json" `
      -Evidence "No broken package exports." `
      -Action "Continue."
  }

  $GitOk = $true
  try {
    & git --version | Out-Null
    if ($LASTEXITCODE -ne 0) { $GitOk = $false }
  } catch {
    $GitOk = $false
  }

  if ($GitOk) {
    $StrictPatterns = @(
      "packages[\\/]+ui-kit[\\/]+src",
      "@bthwani/ui-kit[\\/]+src",
      "@bthwani/ui-kit[\\/]+_internal",
      "@bthwani/ui-kit/_internal"
    )

    foreach ($Pattern in $StrictPatterns) {
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

      if (-not $IsAllowed) {
        $Violations.Add([pscustomobject]@{
          type="PREVIEW_FORBIDDEN_OUTSIDE_ALLOWLIST"
          pattern="@bthwani/ui-kit/preview"
          path=$Parsed.path
          line=$Parsed.line
          text=$Parsed.text
        }) | Out-Null
      }
    }

    if ($Violations.Count -gt 0) {
      Add-Finding `
        -Code "PUBLIC_API_VIOLATIONS_FOUND" `
        -Severity "FAIL" `
        -Path "repo" `
        -Evidence "Violations=$($Violations.Count)" `
        -Action "Patch consumers before final closure."
    } else {
      Add-Finding `
        -Code "PUBLIC_API_BOUNDARY_VERIFY_PASSED" `
        -Severity "PASS" `
        -Path "repo" `
        -Evidence "No forbidden ui-kit src/internal/preview consumer imports." `
        -Action "Continue."
    }
  } else {
    Add-Finding `
      -Code "GIT_NOT_AVAILABLE" `
      -Severity "FAIL" `
      -Path "repo" `
      -Evidence "git unavailable." `
      -Action "Run in Git-enabled terminal."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_VERIFY_UIKIT_FINAL_STRUCTURE_CLOSURE" `
    -Evidence $_.Exception.Message `
    -Action "Fix bounded closure guard."
}

$Rows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RowsPath
$Violations | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ViolationsPath
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Warns = @($Findings | Where-Object { $_.severity -eq "WARN" })
$Passes = @($Findings | Where-Object { $_.severity -eq "PASS" })

$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Warns.Count -gt 0) { "WARN" } else { "PASS" }

$Evidence = [pscustomobject]@{
  session_id=$SessionId
  status=$Status
  run_root=$RunRoot
  counts=[pscustomobject]@{
    pass=$Passes.Count
    warn=$Warns.Count
    fail=$Fails.Count
    structure_rows=$Rows.Count
    public_api_violations=$Violations.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK VERIFY — UIKIT Final Structure Closure

Session: $SessionId
Status: $Status

## Scope

Final structural closure guard for ui-kit cleanup.

## Evidence

- Findings: $FindingsPath
- Structure checks: $RowsPath
- Public API violations: $ViolationsPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Structure rows: $($Rows.Count)
- Public API violations: $($Violations.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-23 UIKIT FINAL STRUCTURE CLOSURE STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Public API violations: $($Violations.Count)" -ForegroundColor Cyan
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
Write-Host "Violations: $ViolationsPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
