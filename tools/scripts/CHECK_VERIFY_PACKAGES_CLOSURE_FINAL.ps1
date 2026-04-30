Set-Location -LiteralPath "C:\bthwani-suite"

param(
  [string]$RepoRoot = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_VERIFY_PACKAGES_CLOSURE_FINAL"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot   = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Write-Utf8([string]$Path,[string]$Content) {
  $dir = Split-Path -Parent $Path
  if ($dir) { Ensure-Dir $dir }
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

function Invoke-CommandCapture {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][string]$Exe,
    [Parameter(Mandatory=$true)][string[]]$Args,
    [Parameter(Mandatory=$true)][string]$RunRoot,
    [switch]$RgNoMatchIsPass
  )

  $logPath = Join-Path $RunRoot ($Name + ".log")
  $output = & $Exe @Args 2>&1 | Out-String
  $exitCode = $LASTEXITCODE
  if ($null -eq $exitCode) { $exitCode = 0 }

  $passed = $false
  if ($RgNoMatchIsPass) {
    if ($exitCode -eq 1) { $passed = $true }
    elseif ($exitCode -eq 0) { $passed = $false }
    else { $passed = $false }
  } else {
    $passed = ($exitCode -eq 0)
  }

  Write-Utf8 $logPath $output

  [pscustomobject]@{
    name     = $Name
    exitCode = $exitCode
    passed   = $passed
    log      = $logPath
  }
}

Ensure-Dir $RunRoot

$Checks = New-Object 'System.Collections.Generic.List[object]'

$checkSpecs = @(
  @{ name = "typecheck-ui-kit";      exe = "pnpm"; args = @("--filter","@bthwani/ui-kit","exec","tsc","--noEmit") },
  @{ name = "typecheck-surfaces";    exe = "pnpm"; args = @("--filter","@bthwani/surfaces","exec","tsc","--noEmit") },
  @{ name = "typecheck-app-shells";  exe = "pnpm"; args = @("--filter","@bthwani/app-shells","exec","tsc","--noEmit") },
  @{ name = "typecheck-app-client";  exe = "pnpm"; args = @("--filter","app-client","exec","tsc","--noEmit") },
  @{ name = "typecheck-app-partner"; exe = "pnpm"; args = @("--filter","app-partner","exec","tsc","--noEmit") },
  @{ name = "typecheck-app-field";   exe = "pnpm"; args = @("--filter","app-field","exec","tsc","--noEmit") },
  @{ name = "typecheck-app-captain"; exe = "pnpm"; args = @("--filter","app-captain","exec","tsc","--noEmit") },
  @{ name = "lint-scrollview-specific"; exe = "pnpm"; args = @("exec","rg","^\s*import\s+\{\s*spacing,\s*type\s*SpacingToken\s*\}\s*from\s*'\.\./\.\./foundation/tokens';","packages/ui-kit/src/primitives/BthMobileScrollView.tsx","-n"); rg = $true },
  @{ name = "lint-dshhome-bad-language-alias"; exe = "pnpm"; args = @("exec","rg","resolvedLanguage\s*\?\?\s*languageCode|language:\s*currentLanguage|languageCode\s*\?\?\s*resolvedLanguage|resolvedLanguage\s*\?\?\s*currentLanguage","packages/surfaces/src/service-owned/dsh/app-client/families/home/screens/DshHomeGetScreen.tsx","-n"); rg = $true }
)

foreach ($spec in $checkSpecs) {
  $r = Invoke-CommandCapture -Name $spec.name -Exe $spec.exe -Args $spec.args -RunRoot $RunRoot -RgNoMatchIsPass:([bool]$spec.rg)
  $Checks.Add($r) | Out-Null
}

$result = "PASS"
foreach ($c in $Checks) {
  if (-not $c.passed) { $result = "FAIL"; break }
}

$summary = New-Object System.Collections.Generic.List[string]
$summary.Add("CHECK_VERIFY_PACKAGES_CLOSURE_FINAL") | Out-Null
$summary.Add("SESSION_ID: $SessionId") | Out-Null
$summary.Add("RESULT    : $result") | Out-Null
$summary.Add("REPO_ROOT : $RepoRoot") | Out-Null
$summary.Add("RUN_ROOT  : $RunRoot") | Out-Null
$summary.Add("") | Out-Null
$summary.Add("CHECKS") | Out-Null
foreach ($c in $Checks) {
  $summary.Add(("- {0} = {1} (exit={2})" -f $c.name, ($(if($c.passed){"PASS"}else{"FAIL"})), $c.exitCode)) | Out-Null
}

Write-Utf8 (Join-Path $RunRoot "summary.txt") (($summary -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Utf8 (Join-Path $RunRoot "evidence.json") (([pscustomobject]@{
  sessionId = $SessionId
  issueCode = $IssueCode
  result = $result
  repoRoot = $RepoRoot
  runRoot = $RunRoot
  checks = $Checks
} | ConvertTo-Json -Depth 20) + "`r`n")

Write-Host ""
Write-Host "CHECK_VERIFY_PACKAGES_CLOSURE_FINAL"
Write-Host "SESSION_ID: $SessionId"
Write-Host "RESULT    : $result"
Write-Host "REPO_ROOT : $RepoRoot"
Write-Host "RUN_ROOT  : $RunRoot"
Write-Host ""
Write-Host "CHECKS"
foreach ($c in $Checks) {
  Write-Host ("- {0} = {1} (exit={2})" -f $c.name, ($(if($c.passed){"PASS"}else{"FAIL"})), $c.exitCode)
}

Read-Host "Review complete. Press Enter to close"
