Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$IssueCode = "DESIGN_GUARD_VERIFY_AFTER_APPLY"
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

try {
  $checks.Add((Invoke-Capture -Name "git branch" -Command "git branch --show-current" -OutFile "git-branch.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git status" -Command "git --no-pager status --short" -OutFile "git-status.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff stat" -Command "git --no-pager diff --stat" -OutFile "git-diff-stat.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff name status" -Command "git --no-pager diff --name-status" -OutFile "git-diff-name-status.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check" -Command "git --no-pager diff --check" -OutFile "git-diff-check.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why react-scanner" -Command "pnpm why react-scanner" -OutFile "pnpm-why-react-scanner.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why ast-grep" -Command "pnpm why @ast-grep/cli" -OutFile "pnpm-why-ast-grep-cli.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why knip" -Command "pnpm why knip" -OutFile "pnpm-why-knip.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why dependency-cruiser" -Command "pnpm why dependency-cruiser" -OutFile "pnpm-why-dependency-cruiser.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why stylelint" -Command "pnpm why stylelint" -OutFile "pnpm-why-stylelint.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why style-dictionary" -Command "pnpm why style-dictionary" -OutFile "pnpm-why-style-dictionary.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "pnpm why playwright" -Command "pnpm why @playwright/test" -OutFile "pnpm-why-playwright-test.txt" -SoftFail))

  if (Test-Path -LiteralPath ".\tools\guards\design\run-design-guard.ps1") {
    $checks.Add((Invoke-Capture -Name "run design guard" -Command "powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\guards\design\run-design-guard.ps1" -OutFile "nested-run-design-guard.txt" -SoftFail))
  } else {
    $warnings.Add("tools\guards\design\run-design-guard.ps1 is missing. Scaffold may not have been applied.")
  }

  $checks.Add((Invoke-Capture -Name "tsc no emit" -Command "pnpm -w exec tsc --noEmit" -OutFile "typescript-noemit.txt" -SoftFail))

  $status = if ($errors.Count -gt 0) { "FAIL" } elseif ($warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

  @"
# DESIGN_GUARD_VERIFY_AFTER_APPLY

status: $status
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $HandoffZip

## Decision note
This verifies installation/scaffold and runs the guard. It does not mean UI is visually accepted without screenshot/visual evidence.
"@ | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

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
