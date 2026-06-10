Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$Apply = $args -contains "-Apply"
$IssueCode = "DESIGN_GUARD_INSTALL_TOOLS"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$HandoffZip = Join-Path $RunRoot "_HANDOFF.zip"

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

$checks = New-Object System.Collections.Generic.List[object]
$warnings = New-Object System.Collections.Generic.List[string]
$errors = New-Object System.Collections.Generic.List[string]

$ToolPackages = @(
  "react-scanner",
  "@ast-grep/cli",
  "knip",
  "dependency-cruiser",
  "stylelint",
  "style-dictionary",
  "@playwright/test"
)
$InstallCommand = "pnpm add -D $($ToolPackages -join ' ')"

try {
  if (!(Test-Path -LiteralPath ".git")) { throw "Not a git repository root: C:\bthwani-suite" }
  if (!(Test-Path -LiteralPath ".\package.json")) { throw "Missing package.json at repo root." }

  $checks.Add((Invoke-Capture -Name "git branch before" -Command "git branch --show-current" -OutFile "git-branch-before.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git status before" -Command "git --no-pager status --short" -OutFile "git-status-before.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check before" -Command "git --no-pager diff --check" -OutFile "git-diff-check-before.txt" -SoftFail))

  if (-not $Apply) {
    $warnings.Add("DryRun only. No dependencies were installed. Re-run with -Apply to execute: $InstallCommand")
    $InstallCommand | Set-Content -LiteralPath (Join-Path $RunRoot "planned-install-command.txt") -Encoding UTF8
  } else {
    $checks.Add((Invoke-Capture -Name "pnpm install design guard tools" -Command $InstallCommand -OutFile "pnpm-add-design-guard-tools.txt"))
  }

  foreach ($tool in $ToolPackages) {
    $safe = ($tool -replace "[^a-zA-Z0-9_-]", "_")
    $checks.Add((Invoke-Capture -Name "pnpm why $tool" -Command "pnpm why $tool" -OutFile "pnpm-why-$safe.txt" -SoftFail))
  }

  $checks.Add((Invoke-Capture -Name "git status after" -Command "git --no-pager status --short" -OutFile "git-status-after.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff stat after" -Command "git --no-pager diff --stat" -OutFile "git-diff-stat-after.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff name status after" -Command "git --no-pager diff --name-status" -OutFile "git-diff-name-status-after.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check after" -Command "git --no-pager diff --check" -OutFile "git-diff-check-after.txt" -SoftFail))

  $status = if ($errors.Count -gt 0) { "FAIL" } elseif ($warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

  @"
# DESIGN_GUARD_INSTALL_TOOLS

status: $status
mode: $(if ($Apply) { "APPLY" } else { "DRYRUN" })
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $HandoffZip

## Tool packages
$($ToolPackages | ForEach-Object { "- $_" } | Out-String)

## Safety note
This script only installs devDependencies when `-Apply` is provided. It does not modify runtime code, does not import tool outputs, and does not create generated runtime dependencies.
"@ | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

  [pscustomobject]@{
    status=$status
    mode=if ($Apply) { "APPLY" } else { "DRYRUN" }
    session_id=$SessionId
    repo="C:\bthwani-suite"
    evidence_root=$RunRoot
    handoff_zip=$HandoffZip
    install_command=$InstallCommand
    tool_packages=$ToolPackages
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
