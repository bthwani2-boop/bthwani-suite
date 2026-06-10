Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "DESIGN_GUARD_READINESS_FAST_V3"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path -Path $RepoRoot -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"

function Write-Log {
  param([string]$Message)
  $Line = "[{0}] {1}" -f (Get-Date).ToString("s"), $Message
  Write-Host $Line
  Add-Content -LiteralPath $CommandLog -Value $Line -Encoding UTF8
}

function Run-Capture {
  param(
    [string]$Name,
    [scriptblock]$Command,
    [string]$OutFile
  )
  Write-Log "RUN $Name"
  $OutPath = Join-Path $RunRoot $OutFile
  $ErrPath = Join-Path $RunRoot "$OutFile.stderr.txt"
  try {
    & $Command 1> $OutPath 2> $ErrPath
    $Exit = if ($LASTEXITCODE -ne $null) { $LASTEXITCODE } else { 0 }
    Write-Log "EXIT $Name :: $Exit -> $OutFile"
  } catch {
    $_ | Out-String | Set-Content -LiteralPath $ErrPath -Encoding UTF8
    Write-Log "ERROR $Name :: $($_.Exception.Message)"
  }
}

function To-RepoRelative {
  param([string]$FullName)
  $rel = $FullName
  if ($rel.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    $rel = $rel.Substring($RepoRoot.Length).TrimStart('\')
  }
  return ".\" + ($rel -replace '/', '\')
}

function Test-UiKitPath {
  param([string]$RelativePath)
  $p = $RelativePath -replace '/', '\'
  return ($p -match '^(?:\.\\)?ui-kit\\')
}

function Test-ExcludedDirectory {
  param([string]$FullName)
  $p = $FullName -replace '/', '\'
  $segments = $p.Split('\') | Where-Object { $_ -ne "" }
  $excludedNames = @(
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".expo",
    ".turbo",
    ".nx",
    ".cache",
    ".vercel",
    ".tamagui",
    "graphify-out",
    "android",
    "ios"
  )
  foreach ($seg in $segments) {
    if ($excludedNames -contains $seg) { return $true }
  }
  if ($p -match '\\tools\\registry\\runs(\\|$)') { return $true }
  if ($p -match '\\tools\\analysis(\\|$)') { return $true }
  return $false
}

function Get-SafeFiles {
  param(
    [string[]]$Roots,
    [string[]]$Extensions
  )

  $seen = New-Object "System.Collections.Generic.HashSet[string]" ([System.StringComparer]::OrdinalIgnoreCase)

  foreach ($root in $Roots) {
    if (!(Test-Path -LiteralPath $root)) { continue }

    $rootInfo = Get-Item -LiteralPath $root
    if (-not $rootInfo.PSIsContainer) { continue }

    Write-Log "SCAN root: $root"

    $stack = New-Object "System.Collections.Generic.Stack[System.IO.DirectoryInfo]"
    $stack.Push([System.IO.DirectoryInfo]::new($rootInfo.FullName))

    while ($stack.Count -gt 0) {
      $dir = $stack.Pop()
      if (Test-ExcludedDirectory -FullName $dir.FullName) { continue }

      try {
        foreach ($sub in $dir.EnumerateDirectories()) {
          if (-not (Test-ExcludedDirectory -FullName $sub.FullName)) {
            $stack.Push($sub)
          }
        }
      } catch {
        continue
      }

      try {
        foreach ($file in $dir.EnumerateFiles()) {
          if (Test-ExcludedDirectory -FullName $file.DirectoryName) { continue }
          if ($Extensions -contains $file.Extension.ToLowerInvariant()) {
            if ($seen.Add($file.FullName)) {
              $file
            }
          }
        }
      } catch {
        continue
      }
    }
  }
}

Write-Log "START $SessionId"
Write-Log "Checking current repo path structure"

$PathChecks = @(
  ".\ui-kit",
  ".\graphify-out",
  ".\.tamagui",
  ".\tools\guards",
  ".\tools\registry\runs",
  ".\dsh",
  ".\wlt",
  ".\control-panel\runtime",
  ".\app-client\runtime",
  ".\app-partner\runtime",
  ".\app-captain\runtime",
  ".\app-field\runtime",
  ".\webapp\runtime",
  ".\website\runtime",
  ".\auth.openapi.yaml",
  ".\master.openapi.yaml"
) | ForEach-Object {
  [pscustomobject]@{
    path = $_
    exists = Test-Path -LiteralPath $_
  }
}
$PathChecks | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "path-existence.json") -Encoding UTF8

Run-Capture -Name "git branch" -OutFile "git-branch.txt" -Command { git branch --show-current }
Run-Capture -Name "git status" -OutFile "git-status.txt" -Command { git --no-pager status --short }
Run-Capture -Name "git diff check" -OutFile "git-diff-check.txt" -Command { git --no-pager diff --check }
Run-Capture -Name "pnpm version" -OutFile "pnpm-version.txt" -Command { pnpm --version }

try {
  Run-Capture -Name "vscode extensions" -OutFile "vscode-extensions.txt" -Command { code --list-extensions }
} catch {
  "VS Code CLI unavailable: $($_.Exception.Message)" | Set-Content -LiteralPath (Join-Path $RunRoot "vscode-extensions.txt") -Encoding UTF8
}

$toolNames = @(
  "react-scanner",
  "@ast-grep/cli",
  "knip",
  "dependency-cruiser",
  "stylelint",
  "style-dictionary",
  "@playwright/test",
  "backstopjs",
  "storybook"
)

$rootPackagePath = Join-Path $RepoRoot "package.json"
$toolInventory = @()
if (Test-Path -LiteralPath $rootPackagePath) {
  $pkg = Get-Content -LiteralPath $rootPackagePath -Raw | ConvertFrom-Json
  foreach ($tool in $toolNames) {
    $section = $null
    $version = $null
    foreach ($candidateSection in @("dependencies","devDependencies","optionalDependencies")) {
      if ($pkg.PSObject.Properties.Name -contains $candidateSection) {
        $deps = $pkg.$candidateSection
        if ($deps.PSObject.Properties.Name -contains $tool) {
          $section = $candidateSection
          $version = $deps.$tool
          break
        }
      }
    }
    $toolInventory += [pscustomobject]@{
      tool = $tool
      installed = [bool]$section
      version = $version
      section = $section
    }
  }
}
$toolInventory | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "design-tool-inventory-root-package.json") -Encoding UTF8

# Prefer leaf runtime roots. Do not scan parent control-panel when control-panel\runtime exists.
$ScanRoots = @(
  ".\dsh",
  ".\wlt",
  ".\app-client\runtime",
  ".\app-partner\runtime",
  ".\app-captain\runtime",
  ".\app-field\runtime",
  ".\control-panel\runtime",
  ".\webapp\runtime",
  ".\website\runtime",
  ".\ui-kit"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -Unique

$ScanRoots | Set-Content -LiteralPath (Join-Path $RunRoot "scanned-roots.txt") -Encoding UTF8

Write-Log "Scanning code roots safely with directory pruning"
$Extensions = @(".ts",".tsx",".js",".jsx",".css",".scss",".mjs",".cjs")
$Files = @(Get-SafeFiles -Roots $ScanRoots -Extensions $Extensions)

$RuntimeGeneratedHits = New-Object System.Collections.Generic.List[object]
$DirectTamaguiHits = New-Object System.Collections.Generic.List[object]
$RawHexHits = New-Object System.Collections.Generic.List[object]
$SeenHits = New-Object "System.Collections.Generic.HashSet[string]" ([System.StringComparer]::OrdinalIgnoreCase)

foreach ($file in $Files) {
  $relative = To-RepoRelative -FullName $file.FullName
  $isUiKit = Test-UiKitPath -RelativePath $relative

  try {
    $lineNo = 0
    foreach ($line in [System.IO.File]::ReadLines($file.FullName)) {
      $lineNo++

      if ($line -match 'graphify-out|\.tamagui|tools[\\/]registry[\\/]runs|tools[\\/]analysis') {
        $key = "runtime|$relative|$lineNo|$line"
        if ($SeenHits.Add($key)) {
          $RuntimeGeneratedHits.Add([pscustomobject]@{
            rule = "RUNTIME_GENERATED_OR_EVIDENCE_REFERENCE"
            file = $relative
            line = $lineNo
            match = $line.Trim()
          })
        }
      }

      if (-not $isUiKit -and $line -match "from\s+['""]tamagui['""]|from\s+['""]@tamagui/|import\s+.*['""]@tamagui/|require\(['""]tamagui['""]\)|require\(['""]@tamagui/") {
        $key = "tamagui|$relative|$lineNo|$line"
        if ($SeenHits.Add($key)) {
          $DirectTamaguiHits.Add([pscustomobject]@{
            rule = "DIRECT_TAMAGUI_OUTSIDE_UI_KIT"
            file = $relative
            line = $lineNo
            match = $line.Trim()
          })
        }
      }

      if (-not $isUiKit -and $line -match '#[0-9A-Fa-f]{3,8}\b') {
        $key = "hex|$relative|$lineNo|$line"
        if ($SeenHits.Add($key)) {
          $RawHexHits.Add([pscustomobject]@{
            rule = "RAW_HEX_OUTSIDE_UI_KIT_REVIEW"
            file = $relative
            line = $lineNo
            match = $line.Trim()
          })
        }
      }
    }
  } catch {
    continue
  }
}

$RuntimeGeneratedHits | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "runtime-generated-reference-review.json") -Encoding UTF8
$DirectTamaguiHits | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "direct-tamagui-outside-ui-kit.json") -Encoding UTF8
$RawHexHits | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "raw-hex-outside-ui-kit-review.json") -Encoding UTF8

$Warnings = New-Object System.Collections.Generic.List[string]
if ($RuntimeGeneratedHits.Count -gt 0) { $Warnings.Add("Found runtime references to generated/evidence roots. Review runtime-generated-reference-review.json") }
if ($DirectTamaguiHits.Count -gt 0) { $Warnings.Add("Found direct Tamagui imports outside ui-kit. Review direct-tamagui-outside-ui-kit.json") }
if ($RawHexHits.Count -gt 0) { $Warnings.Add("Found raw hex colors outside ui-kit. Review raw-hex-outside-ui-kit-review.json") }

$Status = if ($Warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

$SafeSummary = [pscustomobject]@{
  scanned_roots = $ScanRoots
  scanned_file_count = $Files.Count
  runtime_generated_import_count = $RuntimeGeneratedHits.Count
  direct_tamagui_outside_ui_kit_count = $DirectTamaguiHits.Count
  raw_hex_outside_ui_kit_count = $RawHexHits.Count
}
$SafeSummary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "safe-scan-summary.json") -Encoding UTF8

$Evidence = [pscustomobject]@{
  status = $Status
  session_id = $SessionId
  repo = $RepoRoot
  evidence_root = $RunRoot
  handoff_zip = (Join-Path $RunRoot "_HANDOFF.zip")
  warnings = $Warnings
  errors = @()
  scanned_roots = $ScanRoots
  scanned_file_count = $Files.Count
  raw_hex_outside_ui_kit_count = $RawHexHits.Count
  direct_tamagui_outside_ui_kit_count = $DirectTamaguiHits.Count
  runtime_generated_import_count = $RuntimeGeneratedHits.Count
}
$Evidence | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

$Findings = @"
# DESIGN_GUARD_READINESS_FAST_V3_FINDINGS

status: $Status
session_id: $SessionId
scanned_file_count: $($Files.Count)
runtime_generated_import_count: $($RuntimeGeneratedHits.Count)
direct_tamagui_outside_ui_kit_count: $($DirectTamaguiHits.Count)
raw_hex_outside_ui_kit_count: $($RawHexHits.Count)

## Interpretation

- This version prunes node_modules and generated/build/cache directories before traversal.
- Tamagui imports inside .\ui-kit are allowed and are not counted.
- Raw hex inside .\ui-kit is allowed as token/foundation authority and is not counted.
- graphify-out, .tamagui, tools\analysis, and tools\registry\runs must remain generated/evidence roots, not runtime dependencies.
- This script is read-only except evidence output under tools\registry\runs.
"@
$Findings | Set-Content -LiteralPath (Join-Path $RunRoot "DESIGN_GUARD_READINESS_FAST_V3_FINDINGS.md") -Encoding UTF8

$Summary = @"
# DESIGN_GUARD_READINESS_FAST_V3

status: $Status
session_id: $SessionId
repo: $RepoRoot
evidence_root: $RunRoot
handoff_zip: $(Join-Path $RunRoot "_HANDOFF.zip")

## What this checked

- Current repo path structure.
- Git status and diff check.
- Root package.json design tool inventory.
- VS Code extension inventory when available.
- Runtime references to generated/evidence roots.
- Direct Tamagui imports outside .\ui-kit only.
- Raw hex colors outside .\ui-kit only.
- Duplicate scanned roots removed.
- node_modules and generated/build/cache directories pruned before traversal.

## Safety

This script is read-only except writing evidence under tools\registry\runs. It does not modify runtime code and does not install packages.
"@
$Summary | Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8

$ZipPath = Join-Path $RunRoot "_HANDOFF.zip"
if (Test-Path -LiteralPath $ZipPath) {
  Remove-Item -LiteralPath $ZipPath -Force
}
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Log "DONE"
Write-Host "status: $Status"
Write-Host "evidence_root: $RunRoot"
Write-Host "handoff_zip: $ZipPath"
