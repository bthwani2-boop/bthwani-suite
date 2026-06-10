Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$IssueCode = "DESIGN_GUARD_READINESS"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$FindingsPath = Join-Path $RunRoot "DESIGN_GUARD_READINESS_FINDINGS.md"
$HandoffZip = Join-Path $RunRoot "_HANDOFF.zip"

function Write-LogLine {
  param([string]$Message)
  $line = "[$((Get-Date).ToString('s'))] $Message"
  Add-Content -LiteralPath $CommandLog -Value $line -Encoding UTF8
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

$checks = New-Object System.Collections.Generic.List[object]
$warnings = New-Object System.Collections.Generic.List[string]
$errors = New-Object System.Collections.Generic.List[string]

try {
  if (!(Test-Path -LiteralPath ".git")) { throw "Not a git repository root: C:\bthwani-suite" }
  if (!(Test-Path -LiteralPath ".\package.json")) { throw "Missing package.json at repo root." }

  $paths = @(
    ".\ui-kit",
    ".\graphify-out",
    ".\.tamagui",
    ".\tools\guards",
    ".\tools\registry\runs",
    ".\dsh",
    ".\wlt",
    ".\control-panel",
    ".\app-client\runtime",
    ".\dsh"
  )

  $pathReport = foreach ($p in $paths) {
    [pscustomobject]@{ path=$p; exists=(Test-Path -LiteralPath $p) }
  }
  $pathReport | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "path-existence.json") -Encoding UTF8

  $checks.Add((Invoke-Capture -Name "git branch" -Command "git branch --show-current" -OutFile "git-branch.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git status" -Command "git --no-pager status --short" -OutFile "git-status.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check" -Command "git --no-pager diff --check" -OutFile "git-diff-check.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm version" -Command "pnpm --version" -OutFile "pnpm-version.txt" -SoftFail))

  $tools = @(
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
  foreach ($tool in $tools) {
    $safe = ($tool -replace "[^a-zA-Z0-9_-]", "_")
    $checks.Add((Invoke-Capture -Name "pnpm why $tool" -Command "pnpm why $tool" -OutFile "pnpm-why-$safe.txt" -SoftFail))
  }

  if (Get-Command code -ErrorAction SilentlyContinue) {
    $checks.Add((Invoke-Capture -Name "vscode extensions" -Command "code --list-extensions" -OutFile "vscode-extensions.txt" -SoftFail))
  } else {
    $warnings.Add("VS Code CLI 'code' was not available in PATH; extension inventory skipped.")
  }

  $targetFiles = Get-ChildItem -LiteralPath . -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.scss -ErrorAction SilentlyContinue |
    Where-Object {
      $full = $_.FullName
      $full -notmatch "\\node_modules\\" -and
      $full -notmatch "\\.git\\" -and
      $full -notmatch "\\.next\\" -and
      $full -notmatch "\\dist\\" -and
      $full -notmatch "\\build\\" -and
      $full -notmatch "\\coverage\\" -and
      $full -notmatch "\\tools\\registry\\runs\\"
    }

  $runtimeImportFindings = New-Object System.Collections.Generic.List[object]
  foreach ($f in $targetFiles) {
    $rel = Resolve-Path -LiteralPath $f.FullName -Relative
    $i = 0
    foreach ($line in [System.IO.File]::ReadLines($f.FullName)) {
      $i++
      if ($line -match "from\s+['\""].*(graphify-out|\.tamagui|tools/analysis|tools/registry/runs).*[`'\"" ]" -or $line -match "import\(.+(graphify-out|\.tamagui|tools/analysis|tools/registry/runs).+\)") {
        $runtimeImportFindings.Add([pscustomobject]@{ rule="NO_RUNTIME_IMPORT_FROM_GENERATED_OUTPUTS"; file=$rel; line=$i; match=$line.Trim() })
      }
    }
  }
  $runtimeImportFindings | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "runtime-imports-from-generated-outputs.json") -Encoding UTF8
  if ($runtimeImportFindings.Count -gt 0) {
    $warnings.Add("Found runtime imports/references to generated/evidence outputs. Review runtime-imports-from-generated-outputs.json")
  }

  $status = if ($errors.Count -gt 0) { "FAIL" } elseif ($warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

  $summary = @"
# DESIGN_GUARD_READINESS

status: $status
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $HandoffZip

## What this checked
- Root repo state.
- Existing design-related tool dependencies.
- VS Code extension inventory when available.
- Presence of ui-kit, graphify-out, .tamagui, DSH/WLT/control-panel/apps/surfaces paths.
- Runtime imports from generated/cache/evidence folders.

## Decision
This script does not modify live code. Use it before installing/scaffolding BTHWANI_DESIGN_GRAPH_GUARD.
"@
  $summary | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

  $findings = @"
# Readiness Findings

## Warnings
$($warnings | ForEach-Object { "- $_" } | Out-String)

## Errors
$($errors | ForEach-Object { "- $_" } | Out-String)

## Next Action
If acceptable, run `01_INSTALL_DESIGN_GUARD_TOOLS.ps1 -Apply`, then `02_CREATE_DESIGN_GUARD_SCAFFOLD.ps1 -Apply`.
"@
  $findings | Set-Content -LiteralPath $FindingsPath -Encoding UTF8

  [pscustomobject]@{
    status=$status
    session_id=$SessionId
    repo="C:\bthwani-suite"
    evidence_root=$RunRoot
    handoff_zip=$HandoffZip
    checks=$checks
    warnings=$warnings
    errors=$errors
  } | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force

  Write-Host "status: $status"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
} catch {
  $errors.Add($_.Exception.Message)
  "FAIL`n$($_.Exception.Message)" | Set-Content -LiteralPath (Join-Path $RunRoot "status.txt") -Encoding UTF8
  [pscustomobject]@{ status="FAIL"; session_id=$SessionId; errors=$errors; evidence_root=$RunRoot } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force
  Write-Host "status: FAIL"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
  throw
}
