Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_VERIFY_UIKIT_POST_DELETE_CLEANUP_GUARD"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$UiKitIndex = Join-Path $UiKitSrc "index.ts"
$UiKitPackageJson = Join-Path $RepoRoot "packages\ui-kit\package.json"

$DeletedExpected = @(
  "packages/ui-kit/src/_internal/dev/index.ts",
  "packages/ui-kit/src/_internal/proof/index.ts",
  "packages/ui-kit/src/patterns/index.ts",
  "packages/ui-kit/src/primitives/index.ts",
  "packages/ui-kit/src/root/index.ts"
)

$Findings = New-Object System.Collections.Generic.List[object]
$Checks = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$ChecksPath = Join-Path $RunRoot "CHECKS.csv"
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
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      return $true
    }
  }

  return $false
}

try {
  Write-Host ""
  Write-Host "CHECK UIKIT POST DELETE CLEANUP GUARD" -ForegroundColor Cyan
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

  foreach ($Rel in $DeletedExpected) {
    $Abs = Join-Path $RepoRoot ($Rel -replace "/", "\")
    $Exists = Test-Path -LiteralPath $Abs

    $Checks.Add([pscustomobject]@{
      check="expected_deleted_file_absent"
      path=$Rel
      pass=(-not $Exists)
    }) | Out-Null

    if ($Exists) {
      Add-Finding `
        -Code "DELETED_FILE_STILL_EXISTS" `
        -Severity "FAIL" `
        -Path $Rel `
        -Evidence "Expected deleted file still exists." `
        -Action "Remove only if still proven delete-ready."
    }
  }

  $IndexText = ReadText $UiKitIndex
  $BrokenRoot = New-Object System.Collections.Generic.List[string]

  foreach ($m in [regex]::Matches($IndexText, "(?m)^\s*export\s+\*\s+from\s+['""]\.\/([^'""]+)['""];")) {
    $Spec = $m.Groups[1].Value
    if (-not (Test-RootExportTarget -Spec $Spec)) {
      $BrokenRoot.Add("./$Spec") | Out-Null
    }
  }

  if ($BrokenRoot.Count -gt 0) {
    Add-Finding `
      -Code "BROKEN_ROOT_EXPORT_FOUND" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Broken root exports: $($BrokenRoot -join ', ')" `
      -Action "Restore owner or remove invalid export."
  } else {
    Add-Finding `
      -Code "ROOT_EXPORT_VERIFY_PASSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "No broken root exports." `
      -Action "Continue."
  }

  $UiFiles = @(Get-ChildItem -LiteralPath $UiKitSrc -Recurse -File -Include *.ts,*.tsx,*.d.ts |
    Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\|\\.next\\|\\.expo\\" })

  $BrokenLocalRefs = New-Object System.Collections.Generic.List[string]

  foreach ($File in $UiFiles) {
    $Text = ReadText $File.FullName
    $Full = [System.IO.Path]::GetFullPath($File.FullName)

    foreach ($Pattern in @(
      '(?m)^\s*export\s+\*\s+from\s+["'']([^"'']+)["'']',
      '(?m)^\s*export\s+\{[^}]*\}\s+from\s+["'']([^"'']+)["'']',
      '(?m)^\s*import\s+[^;]*?\s+from\s+["'']([^"'']+)["'']',
      '(?m)^\s*import\s+["'']([^"'']+)["'']'
    )) {
      foreach ($Match in [regex]::Matches($Text, $Pattern)) {
        $Spec = $Match.Groups[1].Value
        if ($Spec.StartsWith(".")) {
          $Resolved = ResolveRelative -FromFile $Full -Spec $Spec
          if ([string]::IsNullOrWhiteSpace($Resolved)) {
            $BrokenLocalRefs.Add("$($File.FullName) -> $Spec") | Out-Null
          }
        }
      }
    }
  }

  if ($BrokenLocalRefs.Count -gt 0) {
    Add-Finding `
      -Code "BROKEN_LOCAL_IMPORTS_FOUND" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src" `
      -Evidence "Broken local refs: $($BrokenLocalRefs.Count)" `
      -Action "Fix local import/export chain before continuing."
  } else {
    Add-Finding `
      -Code "LOCAL_IMPORT_VERIFY_PASSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src" `
      -Evidence "No broken relative imports/exports." `
      -Action "Continue."
  }

  $StillExistingDeleted = @($Checks | Where-Object { $_.check -eq "expected_deleted_file_absent" -and $_.pass -eq $false })

  if ($StillExistingDeleted.Count -eq 0) {
    Add-Finding `
      -Code "EXPECTED_DELETED_FILES_ABSENT" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src" `
      -Evidence "All 5 delete-ready files are absent." `
      -Action "Proceed to family consolidation."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_VERIFY_UIKIT_POST_DELETE_CLEANUP_GUARD" `
    -Evidence $_.Exception.Message `
    -Action "Fix bounded verification before continuing."
}

$Checks | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ChecksPath
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
    checks=$Checks.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK VERIFY — UIKIT Post Delete Cleanup Guard

Session: $SessionId
Status: $Status

## Scope

Only post-delete verification for the 5 files removed by APPLY-16.

## Evidence

- Findings: $FindingsPath
- Checks: $ChecksPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- INFO: $($Infos.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Checks: $($Checks.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-17 UIKIT POST DELETE CLEANUP STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
Write-Host "Checks: $ChecksPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
