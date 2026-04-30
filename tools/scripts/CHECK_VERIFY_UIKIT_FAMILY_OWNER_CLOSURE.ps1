Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_VERIFY_UIKIT_FAMILY_OWNER_CLOSURE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$UiKitIndex = Join-Path $UiKitSrc "index.ts"
$Families = @("foundation","patterns","root")

$Findings = New-Object System.Collections.Generic.List[object]
$Rows = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$RowsPath = Join-Path $RunRoot "FAMILY_OWNER_CLOSURE.csv"
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

try {
  Write-Host ""
  Write-Host "CHECK UIKIT FAMILY OWNER CLOSURE" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $UiKitSrc)) { throw "Missing ui-kit src path." }
  if (-not (Test-Path -LiteralPath $UiKitIndex)) { throw "Missing ui-kit root index.ts." }

  $RootText = ReadText $UiKitIndex

  foreach ($Family in $Families) {
    $IndexPath = Join-Path $UiKitSrc "$Family\index.ts"
    $Exists = Test-Path -LiteralPath $IndexPath -PathType Leaf
    $ExportCount = 0
    $BrokenCount = 0
    $HasEmptyExport = $false

    if (-not $Exists) {
      Add-Finding `
        -Code "FAMILY_OWNER_INDEX_MISSING" `
        -Severity "FAIL" `
        -Path "packages/ui-kit/src/$Family/index.ts" `
        -Evidence "Required family owner index is missing." `
        -Action "Create real owner index; do not create empty placeholder."
    } else {
      $Text = ReadText $IndexPath

      if ($Text -match 'export\s+\{\s*\}\s*;') {
        $HasEmptyExport = $true
        Add-Finding `
          -Code "FAMILY_OWNER_HAS_EMPTY_EXPORT" `
          -Severity "FAIL" `
          -Path "packages/ui-kit/src/$Family/index.ts" `
          -Evidence "Forbidden export {}; found." `
          -Action "Remove empty export placeholder."
      }

      foreach ($m in [regex]::Matches($Text, "(?m)^\s*export\s+(?:\*\s+from|\{[^}]+\}\s+from)\s+['""]([^'""]+)['""];")) {
        $ExportCount++
        $Spec = $m.Groups[1].Value
        $Resolved = ResolveRelative -FromFile $IndexPath -Spec $Spec
        if ([string]::IsNullOrWhiteSpace($Resolved)) {
          $BrokenCount++
          Add-Finding `
            -Code "FAMILY_OWNER_BROKEN_EXPORT" `
            -Severity "FAIL" `
            -Path "packages/ui-kit/src/$Family/index.ts" `
            -Evidence "Broken export target: $Spec" `
            -Action "Fix or remove broken export line."
        }
      }

      if ($ExportCount -eq 0) {
        Add-Finding `
          -Code "FAMILY_OWNER_HAS_NO_EXPORTS" `
          -Severity "FAIL" `
          -Path "packages/ui-kit/src/$Family/index.ts" `
          -Evidence "Owner index exists but exports no files." `
          -Action "Owner index must export real family files."
      }

      if ($ExportCount -gt 0 -and $BrokenCount -eq 0 -and -not $HasEmptyExport) {
        Add-Finding `
          -Code "FAMILY_OWNER_VERIFY_PASSED" `
          -Severity "PASS" `
          -Path "packages/ui-kit/src/$Family/index.ts" `
          -Evidence "Owner index exports=$ExportCount; broken=0." `
          -Action "Family ownership closed."
      }
    }

    $Rows.Add([pscustomobject]@{
      family=$Family
      owner_index="packages/ui-kit/src/$Family/index.ts"
      exists=$Exists
      export_count=$ExportCount
      broken_exports=$BrokenCount
      has_empty_export=$HasEmptyExport
    }) | Out-Null
  }

  if ($RootText -match "['""]\.\/patterns['""]|['""]\.\/root['""]") {
    Add-Finding `
      -Code "ROOT_PUBLIC_API_EXPOSES_INTERNAL_FAMILY" `
      -Severity "FAIL" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Root public API exposes ./patterns or ./root." `
      -Action "Remove internal family from root public API."
  } else {
    Add-Finding `
      -Code "ROOT_PUBLIC_API_STABLE_FOR_INTERNAL_FAMILIES" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src/index.ts" `
      -Evidence "Root does not expose ./patterns or ./root." `
      -Action "Continue."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_VERIFY_UIKIT_FAMILY_OWNER_CLOSURE" `
    -Evidence $_.Exception.Message `
    -Action "Fix bounded check before continuing."
}

$Rows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RowsPath
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
    families=$Rows.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK VERIFY — UIKIT Family Owner Closure

Session: $SessionId
Status: $Status

## Scope

Only family ownership closure for:
- foundation
- patterns
- root

## Evidence

- Findings: $FindingsPath
- Family owner closure: $RowsPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Families: $($Rows.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-22 UIKIT FAMILY OWNER CLOSURE STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
Write-Host "Rows: $RowsPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
