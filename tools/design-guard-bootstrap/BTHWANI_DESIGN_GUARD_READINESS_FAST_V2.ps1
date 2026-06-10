Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "DESIGN_GUARD_READINESS_FAST_V2"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path -Path $RepoRoot -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Write-Step {
  param([string]$Message)
  $ts = (Get-Date).ToString("s")
  Write-Host "[$ts] $Message"
  Add-Content -LiteralPath (Join-Path $RunRoot "commands.log") -Value "[$ts] $Message"
}

function Invoke-Capture {
  param(
    [string]$Name,
    [string]$Command,
    [string]$OutFile
  )
  Write-Step "RUN $Name"
  $outPath = Join-Path $RunRoot $OutFile
  $errPath = "$outPath.stderr.txt"
  $p = Start-Process -FilePath "powershell" -ArgumentList @("-NoProfile","-ExecutionPolicy","Bypass","-Command",$Command) -Wait -PassThru -NoNewWindow -RedirectStandardOutput $outPath -RedirectStandardError $errPath
  Write-Step "EXIT $Name :: $($p.ExitCode) -> $OutFile"
  return $p.ExitCode
}

function Get-RelativePathSafe {
  param([string]$FullName)
  $full = [System.IO.Path]::GetFullPath($FullName)
  $root = [System.IO.Path]::GetFullPath($RepoRoot)
  if ($full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    $rel = $full.Substring($root.Length).TrimStart('\')
    return ".\" + $rel
  }
  return $FullName
}

function Test-IsGeneratedOrEvidencePath {
  param([string]$RelativePath)
  return $RelativePath -match '^(?:\.\\)?(?:\.git|node_modules|\.next|dist|build|coverage|\.tamagui|graphify-out|tools\\registry\\runs|tools\\analysis)(?:\\|$)'
}

function Test-IsUiKitPath {
  param([string]$RelativePath)
  return $RelativePath -match '^(?:\.\\)?ui-kit(?:\\|$)'
}

Write-Step "START $SessionId"
Write-Step "Checking canonical paths"

Invoke-Capture -Name "git branch" -Command "Set-Location -LiteralPath '$RepoRoot'; git branch --show-current" -OutFile "git-branch.txt" | Out-Null
Invoke-Capture -Name "git status" -Command "Set-Location -LiteralPath '$RepoRoot'; git --no-pager status --short" -OutFile "git-status.txt" | Out-Null
Invoke-Capture -Name "git diff check" -Command "Set-Location -LiteralPath '$RepoRoot'; git --no-pager diff --check" -OutFile "git-diff-check.txt" | Out-Null
Invoke-Capture -Name "pnpm version" -Command "Set-Location -LiteralPath '$RepoRoot'; pnpm --version" -OutFile "pnpm-version.txt" | Out-Null

try {
  Invoke-Capture -Name "vscode extensions" -Command "code --list-extensions" -OutFile "vscode-extensions.txt" | Out-Null
} catch {
  Set-Content -LiteralPath (Join-Path $RunRoot "vscode-extensions.txt") -Value "VS Code extension inventory unavailable: $($_.Exception.Message)" -Encoding UTF8
}

$PathCandidates = @(
  ".\ui-kit",
  ".\graphify-out",
  ".\.tamagui",
  ".\tools\guards",
  ".\tools\registry\runs",
  ".\dsh",
  ".\wlt",
  ".\control-panel",
  ".\app-client\runtime",
  ".\app-partner\runtime",
  ".\app-captain\runtime",
  ".\app-field\runtime",
  ".\webapp\runtime",
  ".\website\runtime",
  ".\auth.openapi.yaml",
  ".\master.openapi.yaml"
)

$PathExistence = foreach ($path in $PathCandidates) {
  [pscustomobject]@{
    path = $path
    exists = Test-Path -LiteralPath $path
  }
}
$PathExistence | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "path-existence.json") -Encoding UTF8

$RootPackagePath = Join-Path $RepoRoot "package.json"
$DesignTools = @(
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

$Inventory = @()
if (Test-Path -LiteralPath $RootPackagePath) {
  $pkg = Get-Content -LiteralPath $RootPackagePath -Raw | ConvertFrom-Json
  foreach ($tool in $DesignTools) {
    $found = $false
    $version = $null
    $section = $null
    foreach ($sec in @("dependencies", "devDependencies", "optionalDependencies", "peerDependencies")) {
      if ($pkg.PSObject.Properties.Name -contains $sec) {
        $deps = $pkg.$sec
        if ($deps.PSObject.Properties.Name -contains $tool) {
          $found = $true
          $version = $deps.$tool
          $section = $sec
        }
      }
    }
    $Inventory += [pscustomobject]@{
      tool = $tool
      installed = $found
      version = $version
      section = $section
    }
  }
}
$Inventory | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "design-tool-inventory-root-package.json") -Encoding UTF8

$ScanRoots = @(
  ".\dsh",
  ".\wlt",
  ".\app-client\runtime",
  ".\app-partner\runtime",
  ".\app-captain\runtime",
  ".\app-field\runtime",
  ".\control-panel",
  ".\webapp\runtime",
  ".\website\runtime",
  ".\ui-kit"
) | Select-Object -Unique | Where-Object { Test-Path -LiteralPath $_ }

Write-Step "Scanning code roots safely for generated-output runtime references"

$Files = New-Object System.Collections.Generic.List[object]
foreach ($root in $ScanRoots) {
  Write-Step "SCAN root: $root"
  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.scss,*.module.css -ErrorAction SilentlyContinue |
    ForEach-Object {
      $rel = Get-RelativePathSafe -FullName $_.FullName
      if (-not (Test-IsGeneratedOrEvidencePath -RelativePath $rel)) {
        $Files.Add($_)
      }
    }
}

$ScannedFiles = $Files | Sort-Object FullName -Unique
$RuntimeGeneratedRefs = New-Object System.Collections.Generic.List[object]
$DirectTamaguiOutsideUiKit = New-Object System.Collections.Generic.List[object]
$RawHexOutsideUiKit = New-Object System.Collections.Generic.List[object]

foreach ($file in $ScannedFiles) {
  $rel = Get-RelativePathSafe -FullName $file.FullName
  $isUiKit = Test-IsUiKitPath -RelativePath $rel
  $lines = Get-Content -LiteralPath $file.FullName -ErrorAction SilentlyContinue
  if ($null -eq $lines) { continue }

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = [string]$lines[$i]
    $lineNo = $i + 1

    if ($line -match '(graphify-out|\.tamagui|tools[/\\]registry[/\\]runs|tools[/\\]analysis)' -and $line -match '(import|from|require|href|src|url\()') {
      $RuntimeGeneratedRefs.Add([pscustomobject]@{
        rule = "RUNTIME_GENERATED_OR_EVIDENCE_REFERENCE"
        file = $rel
        line = $lineNo
        match = $line.Trim()
      })
    }

    if (($line -match "from\s+['""]tamagui['""]|from\s+['""]@tamagui/|import\s+.*\s+from\s+['""]@tamagui/|import\s+.*\s+from\s+['""]tamagui['""]") -and -not $isUiKit) {
      $DirectTamaguiOutsideUiKit.Add([pscustomobject]@{
        rule = "DIRECT_TAMAGUI_OUTSIDE_UI_KIT"
        file = $rel
        line = $lineNo
        match = $line.Trim()
      })
    }

    if (($line -match '#[0-9A-Fa-f]{3,8}\b') -and -not $isUiKit) {
      $RawHexOutsideUiKit.Add([pscustomobject]@{
        rule = "RAW_HEX_OUTSIDE_UI_KIT_REVIEW"
        file = $rel
        line = $lineNo
        match = $line.Trim()
      })
    }
  }
}

$RuntimeGeneratedRefs |
  Sort-Object file,line,match -Unique |
  ConvertTo-Json -Depth 10 |
  Set-Content -LiteralPath (Join-Path $RunRoot "runtime-generated-reference-review.json") -Encoding UTF8

$DirectTamaguiOutsideUiKit |
  Sort-Object file,line,match -Unique |
  ConvertTo-Json -Depth 10 |
  Set-Content -LiteralPath (Join-Path $RunRoot "direct-tamagui-outside-ui-kit.json") -Encoding UTF8

$RawHexOutsideUiKit |
  Sort-Object file,line,match -Unique |
  ConvertTo-Json -Depth 10 |
  Set-Content -LiteralPath (Join-Path $RunRoot "raw-hex-outside-ui-kit-review.json") -Encoding UTF8

$SafeScanSummary = [pscustomobject]@{
  scanned_roots = @($ScanRoots)
  scanned_file_count = @($ScannedFiles).Count
  runtime_generated_import_count = @($RuntimeGeneratedRefs | Sort-Object file,line,match -Unique).Count
  direct_tamagui_outside_ui_kit_count = @($DirectTamaguiOutsideUiKit | Sort-Object file,line,match -Unique).Count
  raw_hex_outside_ui_kit_count = @($RawHexOutsideUiKit | Sort-Object file,line,match -Unique).Count
}
$SafeScanSummary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "safe-scan-summary.json") -Encoding UTF8

$Warnings = New-Object System.Collections.Generic.List[string]
if ($SafeScanSummary.runtime_generated_import_count -gt 0) {
  $Warnings.Add("Found runtime references to generated/evidence roots. Review runtime-generated-reference-review.json")
}
if ($SafeScanSummary.direct_tamagui_outside_ui_kit_count -gt 0) {
  $Warnings.Add("Found direct Tamagui imports outside ui-kit. Review direct-tamagui-outside-ui-kit.json")
}
if ($SafeScanSummary.raw_hex_outside_ui_kit_count -gt 0) {
  $Warnings.Add("Found raw hex colors outside ui-kit. Review raw-hex-outside-ui-kit-review.json")
}

$Status = if ($Warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

$Evidence = [pscustomobject]@{
  status = $Status
  session_id = $SessionId
  repo = $RepoRoot
  evidence_root = $RunRoot
  handoff_zip = Join-Path $RunRoot "_HANDOFF.zip"
  warnings = @($Warnings)
  errors = @()
  scanned_roots = @($ScanRoots)
  scanned_file_count = $SafeScanSummary.scanned_file_count
  raw_hex_outside_ui_kit_count = $SafeScanSummary.raw_hex_outside_ui_kit_count
  direct_tamagui_outside_ui_kit_count = $SafeScanSummary.direct_tamagui_outside_ui_kit_count
  runtime_generated_import_count = $SafeScanSummary.runtime_generated_import_count
}
$Evidence | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

$Findings = @"
# DESIGN_GUARD_READINESS_FAST_V2_FINDINGS

status: $Status
session_id: $SessionId
scanned_file_count: $($SafeScanSummary.scanned_file_count)
runtime_generated_import_count: $($SafeScanSummary.runtime_generated_import_count)
direct_tamagui_outside_ui_kit_count: $($SafeScanSummary.direct_tamagui_outside_ui_kit_count)
raw_hex_outside_ui_kit_count: $($SafeScanSummary.raw_hex_outside_ui_kit_count)

## Interpretation

- Tamagui imports inside .\ui-kit are allowed and are not counted.
- Raw hex inside .\ui-kit is allowed as token/foundation authority and is not counted.
- graphify-out, .tamagui, tools\analysis, and tools\registry\runs must remain generated/evidence roots, not runtime dependencies.
- This script is read-only except evidence output under tools\registry\runs.
"@
Set-Content -LiteralPath (Join-Path $RunRoot "DESIGN_GUARD_READINESS_FAST_V2_FINDINGS.md") -Value $Findings -Encoding UTF8

$Summary = @"
# DESIGN_GUARD_READINESS_FAST_V2

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

## Safety

This script is read-only except writing evidence under tools\registry\runs. It does not modify runtime code and does not install packages.
"@
Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.md") -Value $Summary -Encoding UTF8

$ZipPath = Join-Path $RunRoot "_HANDOFF.zip"
if (Test-Path -LiteralPath $ZipPath) {
  Remove-Item -LiteralPath $ZipPath -Force
}
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Step "DONE"
Write-Host "status: $Status"
Write-Host "evidence_root: $RunRoot"
Write-Host "handoff_zip: $ZipPath"
