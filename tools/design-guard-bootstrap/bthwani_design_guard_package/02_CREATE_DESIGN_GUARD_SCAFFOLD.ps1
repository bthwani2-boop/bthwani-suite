Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$Apply = $args -contains "-Apply"
$IssueCode = "DESIGN_GUARD_SCAFFOLD"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$HandoffZip = Join-Path $RunRoot "_HANDOFF.zip"
$DesignGuardDir = Join-Path (Get-Location) "tools\guards\design"
$AstGrepRulesDir = Join-Path $DesignGuardDir "ast-grep-rules"

function Write-LogLine {
  param([string]$Message)
  Add-Content -LiteralPath $CommandLog -Value "[$((Get-Date).ToString('s'))] $Message" -Encoding UTF8
}

function Invoke-Capture {
  param(
    [string]$Name,
    [string]$Command,
    [string]$OutFile,
    [switch]$SoftFail
  )
  Write-LogLine "RUN $Name :: $Command"
  $outPath = Join-Path $RunRoot $OutFile
  try {
    cmd.exe /d /c $Command > $outPath 2>&1
    $exitCode = $LASTEXITCODE
  } catch {
    $exitCode = 999
    $_ | Out-String | Set-Content -LiteralPath $outPath -Encoding UTF8
  }
  Write-LogLine "EXIT $Name :: $exitCode -> $OutFile"
  if (($exitCode -ne 0) -and (-not $SoftFail)) {
    throw "Command failed: $Name ($exitCode). See $outPath"
  }
  return [pscustomobject]@{ name=$Name; command=$Command; exit_code=$exitCode; output_file=$OutFile }
}

function Write-TargetFile {
  param(
    [string]$RelativePath,
    [string]$Content
  )
  $target = Join-Path (Get-Location) $RelativePath
  $preview = Join-Path $RunRoot (($RelativePath -replace "[\\/:*?`"<>|]", "_") + ".preview.txt")
  $Content | Set-Content -LiteralPath $preview -Encoding UTF8
  if ($Apply) {
    $parent = Split-Path -Parent $target
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    $Content | Set-Content -LiteralPath $target -Encoding UTF8
    Write-LogLine "WRITE $RelativePath"
  } else {
    Write-LogLine "DRYRUN PREVIEW $RelativePath -> $preview"
  }
  return [pscustomobject]@{ path=$RelativePath; preview=$preview; applied=$Apply }
}

$checks = New-Object System.Collections.Generic.List[object]
$written = New-Object System.Collections.Generic.List[object]
$warnings = New-Object System.Collections.Generic.List[string]
$errors = New-Object System.Collections.Generic.List[string]

try {
  if (!(Test-Path -LiteralPath ".git")) { throw "Not a git repository root: C:\bthwani-suite" }
  if (!(Test-Path -LiteralPath ".\package.json")) { throw "Missing package.json at repo root." }

  $checks.Add((Invoke-Capture -Name "git status before" -Command "git --no-pager status --short" -OutFile "git-status-before.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check before" -Command "git --no-pager diff --check" -OutFile "git-diff-check-before.txt" -SoftFail))

$readme = @'
# BTHWANI_DESIGN_GRAPH_GUARD

This folder contains safe design-analysis guards.

Rules:
- Generated outputs are evidence/cache only.
- Runtime code must not import from `graphify-out`, `.tamagui`, `tools/analysis`, or `tools/registry/runs`.
- Source of truth for UI/design remains `@bthwani/ui-kit`.
- Findings must be classified before deletion, promotion, or merge.

Run:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\design\run-design-guard.ps1"
```
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\README.md" -Content $readme))

$reactScannerConfig = @'
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const evidenceRoot = process.env.BTHWANI_DESIGN_GUARD_EVIDENCE_ROOT || path.join(repoRoot, "tools", "analysis", "design");

module.exports = {
  rootDir: repoRoot,
  crawlFrom: repoRoot,
  includeSubComponents: true,
  importedFrom: /^@bthwani\/ui-kit(\/.*)?$/,
  globs: [
    "apps/**/*.{js,jsx,ts,tsx}",
    "control-panel/**/*.{js,jsx,ts,tsx}",
    "dsh/**/*.{js,jsx,ts,tsx}",
    "ui-kit/**/*.{js,jsx,ts,tsx}",
    "dsh/**/*.{js,jsx,ts,tsx}",
    "wlt/**/*.{js,jsx,ts,tsx}"
  ],
  exclude: [
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".tamagui",
    "graphify-out",
    "tools/registry/runs"
  ],
  processors: [
    ["count-components", { outputTo: path.join(evidenceRoot, "react-scanner-ui-kit-count-components.json") }],
    ["count-components-and-props", { outputTo: path.join(evidenceRoot, "react-scanner-ui-kit-count-components-and-props.json") }],
    ["raw-report", { outputTo: path.join(evidenceRoot, "react-scanner-ui-kit-raw-report.json") }]
  ]
};
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\react-scanner.ui-kit.config.cjs" -Content $reactScannerConfig))

$depcruiseConfig = @'
module.exports = {
  forbidden: [
    {
      name: "no-runtime-imports-from-generated-design-outputs",
      severity: "error",
      from: { path: "^(apps|control-panel|dsh|dsh|wlt|ui-kit)" },
      to: { path: "(graphify-out|\\.tamagui|tools/analysis|tools/registry/runs)" }
    },
    {
      name: "no-app-or-surface-direct-tamagui",
      severity: "error",
      from: { path: "^(apps|control-panel|dsh|dsh|wlt)" },
      to: { path: "^(tamagui|@tamagui/)" }
    },
    {
      name: "no-deep-ui-kit-imports",
      severity: "error",
      from: { path: "^(apps|control-panel|dsh|dsh|wlt)" },
      to: { path: "^@bthwani/ui-kit/(src|components|web|mobile|foundation|primitives)" }
    }
  ],
  options: {
    doNotFollow: { path: "node_modules|\\.next|dist|build|coverage|graphify-out|\\.tamagui|tools/registry/runs" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"]
    },
    reporterOptions: {
      dot: { collapsePattern: "node_modules/[^/]+" }
    }
  }
};
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\dependency-cruiser.design.cjs" -Content $depcruiseConfig))

$stylelintConfig = @'
module.exports = {
  extends: [],
  rules: {
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
    "no-duplicate-selectors": true,
    "selector-max-id": 0
  },
  ignoreFiles: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.tamagui/**",
    "**/graphify-out/**",
    "**/tools/registry/runs/**"
  ]
};
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\stylelint.design.cjs" -Content $stylelintConfig))

$knipConfig = @'
import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.tamagui/**",
    "**/graphify-out/**",
    "**/tools/registry/runs/**"
  ]
};

export default config;
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\knip.design.config.ts" -Content $knipConfig))

$astRule1 = @'
id: no-direct-tamagui-import
language: TypeScript
message: "Do not import Tamagui directly outside @bthwani/ui-kit. Route through @bthwani/ui-kit public exports."
severity: error
rule:
  any:
    - pattern: import $$$ from 'tamagui'
    - pattern: import { $$$ } from 'tamagui'
    - pattern: import $$$ from "tamagui"
    - pattern: import { $$$ } from "tamagui"
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\ast-grep-rules\no-direct-tamagui-import.yml" -Content $astRule1))

$astRule2 = @'
id: no-deep-ui-kit-import
language: TypeScript
message: "Do not deep-import @bthwani/ui-kit internals. Use public exports only."
severity: error
rule:
  any:
    - pattern: import $$$ from '@bthwani/ui-kit/src'
    - pattern: import $$$ from '@bthwani/ui-kit/components'
    - pattern: import $$$ from '@bthwani/ui-kit/web'
    - pattern: import $$$ from '@bthwani/ui-kit/mobile'
    - pattern: import $$$ from "@bthwani/ui-kit/src"
    - pattern: import $$$ from "@bthwani/ui-kit/components"
    - pattern: import $$$ from "@bthwani/ui-kit/web"
    - pattern: import $$$ from "@bthwani/ui-kit/mobile"
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\ast-grep-rules\no-deep-ui-kit-import.yml" -Content $astRule2))

$astRule3 = @'
id: no-inline-style-object-review
language: TSX
message: "Inline style object found. Classify whether this should be a ui-kit variant or tokenized prop."
severity: warning
rule:
  pattern: style={{ $$$ }}
'@
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\ast-grep-rules\inline-style-object-review.yml" -Content $astRule3))

$runner = Get-Content -LiteralPath (Join-Path $PSScriptRoot "run-design-guard.ps1") -Raw
  $written.Add((Write-TargetFile -RelativePath "tools\guards\design\run-design-guard.ps1" -Content $runner))

  $checks.Add((Invoke-Capture -Name "git status after" -Command "git --no-pager status --short" -OutFile "git-status-after.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff stat after" -Command "git --no-pager diff --stat" -OutFile "git-diff-stat-after.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff name status after" -Command "git --no-pager diff --name-status" -OutFile "git-diff-name-status-after.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check after" -Command "git --no-pager diff --check" -OutFile "git-diff-check-after.txt" -SoftFail))

  if (-not $Apply) { $warnings.Add("DryRun only. Files were written as previews in evidence root. Re-run with -Apply to create scaffold files.") }

  $status = if ($errors.Count -gt 0) { "FAIL" } elseif ($warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

  @"
# DESIGN_GUARD_SCAFFOLD

status: $status
mode: $(if ($Apply) { "APPLY" } else { "DRYRUN" })
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $HandoffZip

## Files planned/applied
$($written | ForEach-Object { "- $($_.path) applied=$($_.applied)" } | Out-String)

## Safety model
Scaffold creates guard/config files only. It does not modify runtime code. Outputs remain evidence/cache and must not be imported by runtime code.
"@ | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

  [pscustomobject]@{
    status=$status
    mode=if ($Apply) { "APPLY" } else { "DRYRUN" }
    session_id=$SessionId
    repo="C:\bthwani-suite"
    evidence_root=$RunRoot
    handoff_zip=$HandoffZip
    files=$written
    checks=$checks
    warnings=$warnings
    errors=$errors
  } | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force
  Write-Host "status: $status"
  Write-Host "mode: $(if ($Apply) { 'APPLY' } else { 'DRYRUN' })"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
} catch {
  $errors.Add($_.Exception.Message)
  "FAIL`n$($_.Exception.Message)" | Set-Content -LiteralPath (Join-Path $RunRoot "status.txt") -Encoding UTF8
  [pscustomobject]@{ status="FAIL"; mode=if ($Apply) { "APPLY" } else { "DRYRUN" }; session_id=$SessionId; errors=$errors; evidence_root=$RunRoot } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force
  Write-Host "status: FAIL"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
  throw
}
