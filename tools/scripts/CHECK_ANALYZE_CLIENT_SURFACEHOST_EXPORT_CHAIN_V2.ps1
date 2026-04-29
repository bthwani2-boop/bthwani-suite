Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_CLIENT_SURFACEHOST_EXPORT_CHAIN_V2"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$TargetPath = Join-Path $RepoRoot "packages\app-shells\mobile\client\ClientSurfaceHost.tsx"
$UiKitIndexPath = Join-Path $RepoRoot "packages\ui-kit\src\index.ts"
$SurfacesPublicPath = Join-Path $RepoRoot "packages\surfaces\src\public\app-client.ts"

$Findings = New-Object System.Collections.Generic.List[object]
$Checks = New-Object System.Collections.Generic.List[object]
$Imports = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$ChecksPath = Join-Path $RunRoot "COMPONENT_EXPORT_CHAIN_CHECKS.csv"
$ImportsPath = Join-Path $RunRoot "IMPORTS.csv"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"

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

function RelPath {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return "" }
  $Full = [System.IO.Path]::GetFullPath($Path)
  if ($Full.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $Full.Substring($RepoRoot.Length).TrimStart([char[]]@('\','/'))
  }
  return $Path
}

function ReadText {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return "" }
  return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
}

function Resolve-Module {
  param(
    [string]$FromFile,
    [string]$Spec
  )

  if ($Spec -eq "@bthwani/ui-kit") {
    return $UiKitIndexPath
  }

  if ($Spec -eq "@bthwani/surfaces/app-client") {
    return $SurfacesPublicPath
  }

  if ($Spec.StartsWith(".")) {
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
        return $Candidate
      }
    }
  }

  return ""
}

function Get-NamespaceExportMap {
  param([string]$FilePath)

  $Map = @{}

  if (-not (Test-Path -LiteralPath $FilePath)) {
    return $Map
  }

  $Text = ReadText $FilePath

  foreach ($Match in [regex]::Matches($Text, '(?m)^\s*export\s+\*\s+as\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s+["'']([^"'']+)["'']')) {
    $Name = $Match.Groups[1].Value
    $Spec = $Match.Groups[2].Value
    $Resolved = Resolve-Module -FromFile $FilePath -Spec $Spec
    $Map[$Name] = $Resolved
  }

  return $Map
}

function Get-ExportedNames {
  param(
    [string]$FilePath,
    [int]$Depth = 0
  )

  $Names = New-Object System.Collections.Generic.HashSet[string]

  if ($Depth -gt 8) { return $Names }
  if ([string]::IsNullOrWhiteSpace($FilePath)) { return $Names }
  if (-not (Test-Path -LiteralPath $FilePath)) { return $Names }

  $Text = ReadText $FilePath

  foreach ($Match in [regex]::Matches($Text, '(?m)^\s*export\s+(?:type\s+)?(?:function|const|class|interface|type|enum)\s+([A-Za-z_][A-Za-z0-9_]*)')) {
    [void]$Names.Add($Match.Groups[1].Value)
  }

  foreach ($Match in [regex]::Matches($Text, '(?m)^\s*export\s*\{([^}]+)\}')) {
    $Items = $Match.Groups[1].Value.Split(",")
    foreach ($Item in $Items) {
      $Clean = $Item.Trim()
      if ($Clean -match '\bas\s+([A-Za-z_][A-Za-z0-9_]*)$') {
        [void]$Names.Add($Matches[1])
      } elseif ($Clean -match '^([A-Za-z_][A-Za-z0-9_]*)$') {
        [void]$Names.Add($Matches[1])
      }
    }
  }

  foreach ($Match in [regex]::Matches($Text, '(?m)^\s*export\s+\*\s+as\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s+["'']([^"'']+)["'']')) {
    [void]$Names.Add($Match.Groups[1].Value)
  }

  foreach ($Match in [regex]::Matches($Text, '(?m)^\s*export\s+\*\s+from\s+["'']([^"'']+)["'']')) {
    $Spec = $Match.Groups[1].Value
    $Resolved = Resolve-Module -FromFile $FilePath -Spec $Spec
    if (-not [string]::IsNullOrWhiteSpace($Resolved)) {
      $ChildNames = Get-ExportedNames -FilePath $Resolved -Depth ($Depth + 1)
      foreach ($Name in $ChildNames) {
        [void]$Names.Add($Name)
      }
    }
  }

  return $Names
}

function Add-Check {
  param(
    [string]$LocalName,
    [string]$SourceExpression,
    [string]$ResolvedPath,
    [bool]$Exists,
    [string]$Reason
  )

  $Checks.Add([pscustomobject]@{
    local_name = $LocalName
    source_expression = $SourceExpression
    resolved_path = RelPath $ResolvedPath
    exists = $Exists
    reason = $Reason
  }) | Out-Null

  if (-not $Exists) {
    Add-Finding `
      -Code "CLIENT_SURFACEHOST_UNDEFINED_COMPONENT_CANDIDATE" `
      -Severity "BLOCKER" `
      -Path "packages\app-shells\mobile\client\ClientSurfaceHost.tsx" `
      -Evidence "$LocalName from $SourceExpression is not exported by $(RelPath $ResolvedPath)" `
      -Action "Fix the export chain or replace the import. This can directly cause Element type is invalid."
  }
}

try {
  Write-Host ""
  Write-Host "CHECK CLIENT SURFACEHOST EXPORT CHAIN V2" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $TargetPath)) {
    throw "Missing target: $TargetPath"
  }

  if (-not (Test-Path -LiteralPath $UiKitIndexPath)) {
    throw "Missing ui-kit index: $UiKitIndexPath"
  }

  if (-not (Test-Path -LiteralPath $SurfacesPublicPath)) {
    throw "Missing surfaces public app-client: $SurfacesPublicPath"
  }

  $Text = ReadText $TargetPath

  Add-Finding `
    -Code "TARGETS_FOUND" `
    -Severity "PASS" `
    -Path "ClientSurfaceHost + ui-kit + surfaces public" `
    -Evidence "Required files exist." `
    -Action "Proceed with export-chain checks."

  # 1) Check named ui-kit imports.
  $UiKitExports = Get-ExportedNames -FilePath $UiKitIndexPath

  foreach ($Match in [regex]::Matches($Text, '(?s)import\s+\{([^}]+)\}\s+from\s+["'']@bthwani/ui-kit["'']')) {
    $Names = $Match.Groups[1].Value.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    foreach ($RawName in $Names) {
      $Imported = $RawName
      $Local = $RawName
      if ($RawName -match '^([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$') {
        $Imported = $Matches[1]
        $Local = $Matches[2]
      }

      $Exists = $UiKitExports.Contains($Imported)
      Add-Check -LocalName $Local -SourceExpression "@bthwani/ui-kit::$Imported" -ResolvedPath $UiKitIndexPath -Exists $Exists -Reason "Named ui-kit import check"
    }
  }

  # 2) Map namespaced exports from @bthwani/surfaces/app-client.
  $SurfaceNamespaceMap = Get-NamespaceExportMap -FilePath $SurfacesPublicPath

  foreach ($Ns in @("amnAppClient","arbAppClient","dshAppClient","esfAppClient","knzAppClient","kwdAppClient","mrfAppClient","sndAppClient","wltAppClient","appClientSurfaceOwned")) {
    if (-not $SurfaceNamespaceMap.ContainsKey($Ns)) {
      Add-Finding `
        -Code "SURFACE_NAMESPACE_EXPORT_MISSING" `
        -Severity "BLOCKER" `
        -Path "packages\surfaces\src\public\app-client.ts" `
        -Evidence "$Ns is not exported as namespace." `
        -Action "Restore namespace export in public app-client contract."
    } else {
      $Imports.Add([pscustomobject]@{
        namespace = $Ns
        resolved = RelPath $SurfaceNamespaceMap[$Ns]
      }) | Out-Null
    }
  }

  # 3) Check destructured symbols such as const { DshSurfaceHost } = dshAppClient;
  foreach ($Match in [regex]::Matches($Text, '(?m)^\s*const\s+\{\s*([^}]+)\s*\}\s*=\s*([A-Za-z_][A-Za-z0-9_]*)(?:\.([A-Za-z_][A-Za-z0-9_]*))?\s*;')) {
    $RawNames = $Match.Groups[1].Value
    $BaseNs = $Match.Groups[2].Value
    $SubNs = $Match.Groups[3].Value

    $Names = $RawNames.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ }

    if (-not $SurfaceNamespaceMap.ContainsKey($BaseNs)) {
      continue
    }

    $BasePath = $SurfaceNamespaceMap[$BaseNs]
    $ResolvedPath = $BasePath
    $SourceExpression = $BaseNs

    if (-not [string]::IsNullOrWhiteSpace($SubNs)) {
      $NestedMap = Get-NamespaceExportMap -FilePath $BasePath
      $SourceExpression = "$BaseNs.$SubNs"

      if ($NestedMap.ContainsKey($SubNs)) {
        $ResolvedPath = $NestedMap[$SubNs]
      } else {
        foreach ($Name in $Names) {
          Add-Check -LocalName $Name -SourceExpression $SourceExpression -ResolvedPath $BasePath -Exists $false -Reason "Nested namespace not exported"
        }
        continue
      }
    }

    $AvailableNames = Get-ExportedNames -FilePath $ResolvedPath

    foreach ($NameRaw in $Names) {
      $Name = $NameRaw
      if ($NameRaw -match ':\s*([A-Za-z_][A-Za-z0-9_]*)$') {
        $Name = $Matches[1]
      }

      $Exists = $AvailableNames.Contains($Name)
      Add-Check -LocalName $Name -SourceExpression $SourceExpression -ResolvedPath $ResolvedPath -Exists $Exists -Reason "Destructured surface component check"
    }
  }

  $Blockers = @($Findings | Where-Object { $_.severity -eq "BLOCKER" })

  if ($Blockers.Count -eq 0) {
    Add-Finding `
      -Code "NO_EXPORT_CHAIN_BLOCKERS_FOUND" `
      -Severity "INFO" `
      -Path "packages\app-shells\mobile\client\ClientSurfaceHost.tsx" `
      -Evidence "Static export-chain checks found no missing component exports." `
      -Action "If runtime persists, add temporary runtime probe to print actual undefined values."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_ANALYZE_CLIENT_SURFACEHOST_EXPORT_CHAIN_V2" `
    -Evidence $_.Exception.Message `
    -Action "Fix diagnostic script before applying any source change."
}

$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath
$Checks | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ChecksPath
$Imports | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ImportsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Blockers = @($Findings | Where-Object { $_.severity -eq "BLOCKER" })
$Warns = @($Findings | Where-Object { $_.severity -eq "WARN" })
$Passes = @($Findings | Where-Object { $_.severity -eq "PASS" })
$Infos = @($Findings | Where-Object { $_.severity -eq "INFO" })

$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Blockers.Count -gt 0) { "BLOCKED" } elseif ($Warns.Count -gt 0) { "WARN" } else { "PASS" }

$Evidence = [pscustomobject]@{
  session_id = $SessionId
  status = $Status
  run_root = $RunRoot
  target = "packages/app-shells/mobile/client/ClientSurfaceHost.tsx"
  counts = [pscustomobject]@{
    pass = $Passes.Count
    info = $Infos.Count
    warn = $Warns.Count
    blocker = $Blockers.Count
    fail = $Fails.Count
    checks = $Checks.Count
    imports = $Imports.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK ANALYZE — ClientSurfaceHost Export Chain V2

Session: $SessionId
Status: $Status

## Problem

ClientSurfaceHost renders an undefined component.

## Evidence

- Findings: $FindingsPath
- Checks: $ChecksPath
- Imports: $ImportsPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- INFO: $($Infos.Count)
- WARN: $($Warns.Count)
- BLOCKER: $($Blockers.Count)
- FAIL: $($Fails.Count)
- Checks: $($Checks.Count)
- Imports: $($Imports.Count)

## Next

If BLOCKED:
Use COMPONENT_EXPORT_CHAIN_CHECKS.csv to patch the exact missing export only.

If PASS but runtime remains:
Run a temporary runtime probe inside ClientSurfaceHost.
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK CLIENT SURFACEHOST EXPORT CHAIN V2 STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } elseif ($Status -eq "BLOCKED") { "Red" } else { "Red" })
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
Write-Host "Checks: $ChecksPath" -ForegroundColor Cyan
Write-Host ""

if ($Findings.Count -gt 0) {
  $Findings | Format-Table severity,code,path,action -Wrap
}

Write-Host ""
Write-Host "Top failed checks:" -ForegroundColor Yellow
$Checks | Where-Object { $_.exists -eq $false } | Select-Object -First 20 | Format-Table local_name,source_expression,resolved_path,reason -Wrap

Write-Host ""
Write-Host "Done. Terminal remains open. No production source was changed." -ForegroundColor Green
