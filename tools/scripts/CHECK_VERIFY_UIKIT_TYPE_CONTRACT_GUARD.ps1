Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_VERIFY_UIKIT_TYPE_CONTRACT_GUARD"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitDir = Join-Path $RepoRoot "packages\ui-kit"
$UiKitSrc = Join-Path $UiKitDir "src"
$PackageJson = Join-Path $UiKitDir "package.json"
$TsConfig = Join-Path $UiKitDir "tsconfig.json"

$Findings = New-Object System.Collections.Generic.List[object]
$Checks = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$ChecksPath = Join-Path $RunRoot "CHECKS.csv"
$StdoutPath = Join-Path $RunRoot "tsc.stdout.txt"
$StderrPath = Join-Path $RunRoot "tsc.stderr.txt"
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

try {
  Write-Host ""
  Write-Host "CHECK UIKIT TYPE CONTRACT GUARD" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  if (-not (Test-Path -LiteralPath $UiKitDir)) {
    throw "Missing ui-kit package directory: $UiKitDir"
  }

  if (-not (Test-Path -LiteralPath $UiKitSrc)) {
    throw "Missing ui-kit src directory: $UiKitSrc"
  }

  if (-not (Test-Path -LiteralPath $PackageJson)) {
    throw "Missing ui-kit package.json: $PackageJson"
  }

  if (-not (Test-Path -LiteralPath $TsConfig)) {
    throw "Missing ui-kit tsconfig.json: $TsConfig"
  }

  Add-Finding `
    -Code "UIKIT_TYPE_INPUTS_FOUND" `
    -Severity "PASS" `
    -Path "packages/ui-kit" `
    -Evidence "package.json, tsconfig.json, and src directory exist." `
    -Action "Run package TypeScript contract check."

  $Cmd = "pnpm --dir packages/ui-kit exec tsc --noEmit -p tsconfig.json"
  $Checks.Add([pscustomobject]@{
    check="typescript_contract_command"
    command=$Cmd
  }) | Out-Null

  Write-Host "Running: $Cmd" -ForegroundColor Cyan

  $Process = Start-Process `
    -FilePath "pnpm" `
    -ArgumentList @("--dir","packages/ui-kit","exec","tsc","--noEmit","-p","tsconfig.json") `
    -WorkingDirectory $RepoRoot `
    -NoNewWindow `
    -Wait `
    -PassThru `
    -RedirectStandardOutput $StdoutPath `
    -RedirectStandardError $StderrPath

  $ExitCode = $Process.ExitCode

  $Stdout = if (Test-Path -LiteralPath $StdoutPath) { Get-Content -LiteralPath $StdoutPath -Raw -Encoding UTF8 } else { "" }
  $Stderr = if (Test-Path -LiteralPath $StderrPath) { Get-Content -LiteralPath $StderrPath -Raw -Encoding UTF8 } else { "" }

  $ErrorLines = @()
  if (-not [string]::IsNullOrWhiteSpace($Stdout)) {
    $ErrorLines += @($Stdout -split "`r?`n" | Where-Object { $_ -match "error TS\d+|Cannot find module|has no exported member|Module .* has no exported member" })
  }
  if (-not [string]::IsNullOrWhiteSpace($Stderr)) {
    $ErrorLines += @($Stderr -split "`r?`n" | Where-Object { $_ -match "error TS\d+|Cannot find module|has no exported member|Module .* has no exported member" })
  }

  $Checks.Add([pscustomobject]@{
    check="typescript_contract_exit_code"
    exit_code=$ExitCode
    error_lines=$ErrorLines.Count
  }) | Out-Null

  if ($ExitCode -ne 0) {
    Add-Finding `
      -Code "UIKIT_TYPE_CONTRACT_FAILED" `
      -Severity "FAIL" `
      -Path "packages/ui-kit" `
      -Evidence "tsc exit code=$ExitCode; error lines=$($ErrorLines.Count)" `
      -Action "Patch exact TypeScript/export errors before runtime validation."
  } else {
    Add-Finding `
      -Code "UIKIT_TYPE_CONTRACT_PASSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit" `
      -Evidence "tsc --noEmit passed for ui-kit." `
      -Action "Proceed to consumer/runtime guard."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_VERIFY_UIKIT_TYPE_CONTRACT_GUARD" `
    -Evidence $_.Exception.Message `
    -Action "Fix this bounded check before continuing."
}

$Checks | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ChecksPath
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
    checks=$Checks.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK VERIFY — UIKIT Type Contract Guard

Session: $SessionId
Status: $Status

## Scope

Only packages/ui-kit TypeScript contract.

## Evidence

- Findings: $FindingsPath
- Checks: $ChecksPath
- stdout: $StdoutPath
- stderr: $StderrPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Checks: $($Checks.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK-24 UIKIT TYPE CONTRACT STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Findings: $FindingsPath" -ForegroundColor Cyan
Write-Host "stdout: $StdoutPath" -ForegroundColor Cyan
Write-Host "stderr: $StderrPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open." -ForegroundColor Green
