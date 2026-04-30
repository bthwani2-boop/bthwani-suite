Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_UIKIT_ORPHAN_SOURCE_CANDIDATES"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitSrc = Join-Path $RepoRoot "packages\ui-kit\src"
$IndexPath = Join-Path $UiKitSrc "index.ts"
$PreviewIndexPath = Join-Path $UiKitSrc "preview\index.ts"

$Findings = New-Object System.Collections.Generic.List[object]
$Rows = New-Object System.Collections.Generic.List[object]
$Edges = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$RowsPath = Join-Path $RunRoot "UIKIT_SOURCE_REACHABILITY.csv"
$EdgesPath = Join-Path $RunRoot "UIKIT_LOCAL_IMPORT_EDGES.csv"
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

function Add-Reachable {
  param(
    [string]$StartPath,
    [string]$Lane,
    [System.Collections.Generic.HashSet[string]]$Visited
  )

  if ([string]::IsNullOrWhiteSpace($StartPath)) { return }
  if (-not (Test-Path -LiteralPath $StartPath -PathType Leaf)) { return }

  $Full = [System.IO.Path]::GetFullPath($StartPath)
  if ($Visited.Contains($Full)) { return }

  [void]$Visited.Add($Full)

  $Text = ReadText $Full

  $ImportPatterns = @(
    '(?m)^\s*export\s+\*\s+from\s+["'']([^"'']+)["'']',
    '(?m)^\s*export\s+\{[^}]*\}\s+from\s+["'']([^"'']+)["'']',
    '(?m)^\s*import\s+[^;]*?\s+from\s+["'']([^"'']+)["'']',
    '(?m)^\s*import\s+["'']([^"'']+)["'']'
  )

  foreach ($Pattern in $ImportPatterns) {
    foreach ($Match in [regex]::Matches($Text, $Pattern)) {
      $Spec = $Match.Groups[1].Value
      $Resolved = ResolveRelative -FromFile $Full -Spec $Spec

      if (-not [string]::IsNullOrWhiteSpace($Resolved)) {
        $Edges.Add([pscustomobject]@{
          lane = $Lane
          from = RelPath $Full
          specifier = $Spec
          to = RelPath $Resolved
        }) | Out-Null

        Add-Reachable -StartPath $Resolved -Lane $Lane -Visited $Visited
      }
    }
  }
}

try {
  Write-Host ""
  Write-Host "CHECK UIKIT ORPHAN SOURCE CANDIDATES" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "Missing ui-kit src path: $UiKitSrc"
  }

  if (-not (Test-Path -LiteralPath $IndexPath)) {
    throw "Missing ui-kit root index: $IndexPath"
  }

  $AllFiles = @(Get-ChildItem -LiteralPath $UiKitSrc -Recurse -File -Include *.ts,*.tsx |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\|\\.next\\|\\.expo\\"
    })

  $PublicReachable = New-Object System.Collections.Generic.HashSet[string]
  $PreviewReachable = New-Object System.Collections.Generic.HashSet[string]
  $AnyReferenced = New-Object System.Collections.Generic.HashSet[string]

  Add-Reachable -StartPath $IndexPath -Lane "PUBLIC_ROOT" -Visited $PublicReachable

  if (Test-Path -LiteralPath $PreviewIndexPath) {
    Add-Reachable -StartPath $PreviewIndexPath -Lane "PREVIEW" -Visited $PreviewReachable
  }

  foreach ($File in $AllFiles) {
    $Text = ReadText $File.FullName
    $Full = [System.IO.Path]::GetFullPath($File.FullName)

    $ImportPatterns = @(
      '(?m)^\s*export\s+\*\s+from\s+["'']([^"'']+)["'']',
      '(?m)^\s*export\s+\{[^}]*\}\s+from\s+["'']([^"'']+)["'']',
      '(?m)^\s*import\s+[^;]*?\s+from\s+["'']([^"'']+)["'']',
      '(?m)^\s*import\s+["'']([^"'']+)["'']'
    )

    foreach ($Pattern in $ImportPatterns) {
      foreach ($Match in [regex]::Matches($Text, $Pattern)) {
        $Spec = $Match.Groups[1].Value
        $Resolved = ResolveRelative -FromFile $Full -Spec $Spec

        if (-not [string]::IsNullOrWhiteSpace($Resolved)) {
          [void]$AnyReferenced.Add($Resolved)
        }
      }
    }
  }

  foreach ($File in $AllFiles) {
    $Full = [System.IO.Path]::GetFullPath($File.FullName)
    $Rel = RelPath $Full

    $IsPublic = $PublicReachable.Contains($Full)
    $IsPreview = $PreviewReachable.Contains($Full)
    $IsReferenced = $AnyReferenced.Contains($Full)

    $Classification = if ($IsPublic) {
      "PUBLIC_ROOT_REACHABLE"
    } elseif ($IsPreview) {
      "PREVIEW_REACHABLE"
    } elseif ($IsReferenced) {
      "INTERNAL_REFERENCED"
    } else {
      "ORPHAN_CANDIDATE"
    }

    $Rows.Add([pscustomobject]@{
      path = $Rel
      classification = $Classification
      public_root_reachable = $IsPublic
      preview_reachable = $IsPreview
      internally_referenced = $IsReferenced
    }) | Out-Null
  }

  $Orphans = @($Rows | Where-Object { $_.classification -eq "ORPHAN_CANDIDATE" })
  $PublicCount = @($Rows | Where-Object { $_.classification -eq "PUBLIC_ROOT_REACHABLE" }).Count
  $PreviewCount = @($Rows | Where-Object { $_.classification -eq "PREVIEW_REACHABLE" }).Count
  $InternalCount = @($Rows | Where-Object { $_.classification -eq "INTERNAL_REFERENCED" }).Count

  Add-Finding `
    -Code "UIKIT_REACHABILITY_ANALYSIS_COMPLETED" `
    -Severity "PASS" `
    -Path "packages/ui-kit/src" `
    -Evidence "Files=$($AllFiles.Count); Public=$PublicCount; Preview=$PreviewCount; InternalReferenced=$InternalCount; OrphanCandidates=$($Orphans.Count)" `
    -Action "Review ORPHAN_CANDIDATE rows before deletion/quarantine."

  if ($Orphans.Count -gt 0) {
    Add-Finding `
      -Code "ORPHAN_CANDIDATES_FOUND" `
      -Severity "WARN" `
      -Path "packages/ui-kit/src" `
      -Evidence "Orphan candidates: $($Orphans.Count)" `
      -Action "Next step should quarantine/delete only these candidates after review."
  } else {
    Add-Finding `
      -Code "NO_ORPHAN_CANDIDATES_FOUND" `
      -Severity "PASS" `
      -Path "packages/ui-kit/src" `
      -Evidence "No orphan candidates detected." `
      -Action "Proceed to family-level consolidation checks."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_ANALYZE_UIKIT_ORPHAN_SOURCE_CANDIDATES" `
    -Evidence $_.Exception.Message `
    -Action "Fix this bounded check before cleanup."
}

$Rows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RowsPath
$Edges | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $EdgesPath
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Warns = @($Findings | Where-Object { $_.severity -eq "WARN" })
$Passes = @($Findings | Where-Object { $_.severity -eq "PASS" })
$Infos = @($Findings | Where-Object { $_.severity -eq "INFO" })

$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Warns.Count -gt 0) { "WARN" } else { "PASS" }

$OrphanCount = @($Rows | Where-Object { $_.classification -eq "ORPHAN_CANDIDATE" }).Count

$Evidence = [pscustomobject]@{
  session_id = $SessionId
  status = $Status
  run_root = $RunRoot
  counts = [pscustomobject]@{
    pass = $Passes.Count
    info = $Infos.Count
    warn = $Warns.Count
    fail = $Fails.Count
    files = $Rows.Count
    edges = $Edges.Count
    orphan_candidates = $OrphanCount
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK ANALYZE — UIKIT Orphan Source Candidates

Session: $SessionId
Status: $Status

## Scope

Only packages/ui-kit/src.

## Classification

- PUBLIC_ROOT_REACHABLE
- PREVIEW_REACHABLE
- INTERNAL_REFERENCED
- ORPHAN_CANDIDATE

## Evidence

- Findings: $FindingsPath
- Source reachability: $RowsPath
- Local import edges: $EdgesPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- INFO: $($Infos.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Files: $($Rows.Count)
- Edges: $($Edges.Count)
- Orphan candidates: $OrphanCount
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-14 UIKIT ORPHAN SOURCE CANDIDATES STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Files: $($Rows.Count)" -ForegroundColor Cyan
Write-Host "Edges: $($Edges.Count)" -ForegroundColor Cyan
Write-Host "Orphan candidates: $OrphanCount" -ForegroundColor Cyan
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Reachability: $RowsPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Top orphan candidates:" -ForegroundColor Yellow
$Rows | Where-Object { $_.classification -eq "ORPHAN_CANDIDATE" } | Select-Object -First 30 path,classification | Format-Table -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
