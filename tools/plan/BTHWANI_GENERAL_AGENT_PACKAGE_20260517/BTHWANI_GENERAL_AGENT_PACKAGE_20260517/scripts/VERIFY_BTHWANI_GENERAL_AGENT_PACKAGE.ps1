param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [switch]$RunTypecheck
)

$ErrorActionPreference = "Stop"

function New-RunContext {
  param([string]$RepoRoot, [string]$Prefix)
  Set-Location -LiteralPath $RepoRoot
  $Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $SessionId = "$Prefix-$Stamp"
  $EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
  New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null
  return [pscustomobject]@{
    SessionId = $SessionId
    EvidenceRoot = $EvidenceRoot
    CommandLog = (Join-Path $EvidenceRoot "commands.log")
  }
}

function Write-Log {
  param([object]$Ctx, [string]$Message)
  $Line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $Ctx.CommandLog -Value $Line -Encoding UTF8
  Write-Host $Message
}

function Invoke-Capture {
  param([object]$Ctx, [string]$Name, [string]$OutFile, [scriptblock]$Command)
  Write-Log $Ctx "RUN: $Name"
  try {
    $Output = & $Command 2>&1 | Out-String
    Set-Content -LiteralPath $OutFile -Value $Output -Encoding UTF8
    Write-Log $Ctx "OK: $Name"
    return $true
  } catch {
    $Output = $_ | Out-String
    Set-Content -LiteralPath $OutFile -Value $Output -Encoding UTF8
    Write-Log $Ctx "FAIL: $Name"
    return $false
  }
}

function Complete-EvidenceZip {
  param([object]$Ctx)
  $ZipPath = Join-Path $Ctx.EvidenceRoot ($Ctx.SessionId + ".zip")
  if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
  Get-ChildItem -LiteralPath $Ctx.EvidenceRoot | Compress-Archive -DestinationPath $ZipPath -Force
  return $ZipPath
}

function Save-BaselineGitEvidence {
  param([object]$Ctx)
  Invoke-Capture $Ctx "git branch --show-current" (Join-Path $Ctx.EvidenceRoot "git-branch.txt") { git branch --show-current } | Out-Null
  Invoke-Capture $Ctx "git rev-parse HEAD" (Join-Path $Ctx.EvidenceRoot "git-head.txt") { git rev-parse HEAD } | Out-Null
  Invoke-Capture $Ctx "git --no-pager status --short" (Join-Path $Ctx.EvidenceRoot "git-status.txt") { git --no-pager status --short } | Out-Null
  Invoke-Capture $Ctx "git --no-pager diff --stat" (Join-Path $Ctx.EvidenceRoot "git-diff-stat.txt") { git --no-pager diff --stat } | Out-Null
  Invoke-Capture $Ctx "git --no-pager diff --name-status" (Join-Path $Ctx.EvidenceRoot "git-diff-name-status.txt") { git --no-pager diff --name-status } | Out-Null
  Invoke-Capture $Ctx "git --no-pager diff --check" (Join-Path $Ctx.EvidenceRoot "git-diff-check.txt") { git --no-pager diff --check } | Out-Null
  Invoke-Capture $Ctx "git ls-files --others --exclude-standard" (Join-Path $Ctx.EvidenceRoot "git-untracked.txt") { git ls-files --others --exclude-standard } | Out-Null
}

$PackageRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Manifest = Get-Content -LiteralPath (Join-Path $PackageRoot "manifest.json") -Raw | ConvertFrom-Json
$Ctx = New-RunContext -RepoRoot $RepoRoot -Prefix "BTHWANI_GENERAL_AGENT_PACKAGE-VERIFY"
Write-Log $Ctx "PACKAGE_ROOT: $PackageRoot"
Write-Log $Ctx "RUN_TYPECHECK: $RunTypecheck"
Save-BaselineGitEvidence $Ctx

$Errors = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]

foreach ($Skill in $Manifest.required_general_skills) {
  $Rel = ".agents/skills/$Skill/SKILL.md"
  $Full = Join-Path $RepoRoot $Rel
  if (-not (Test-Path -LiteralPath $Full)) {
    $Errors.Add("MISSING_SKILL:$Rel")
    continue
  }
  $Text = Get-Content -LiteralPath $Full -Raw
  if ($Text -notmatch "(?s)^---.*?name:\s*$Skill") { $Errors.Add("BAD_OR_MISSING_NAME:$Rel") }
  if ($Text -notmatch "(?s)^---.*?description:") { $Errors.Add("MISSING_DESCRIPTION:$Rel") }
  if ($Text -notmatch "governance/") { $Warnings.Add("NO_GOVERNANCE_POINTER:$Rel") }
}

foreach ($Rel in @(
  ".agents/README.md",
  ".agents/INDEX.md",
  ".agents/SKILL_CATALOG.md",
  ".agents/AUTHORITY_BOUNDARY.md",
  ".agents/UPDATE_POLICY.md",
  "governance/agents/GENERAL_AGENT_CAPABILITY_MAP.md",
  "governance/agents/SKILL_TO_GOVERNANCE_ROUTING.md",
  "governance/agents/DONOR_EXTRACTION_DECISION_MATRIX.md",
  "tools/guards/guard-bthwani-agent-package.mjs"
)) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $Rel))) {
    $Errors.Add("MISSING_REQUIRED_FILE:$Rel")
  }
}

Invoke-Capture $Ctx "node tools/guards/guard-bthwani-agent-package.mjs" (Join-Path $Ctx.EvidenceRoot "guard-bthwani-agent-package.txt") { node tools/guards/guard-bthwani-agent-package.mjs } | Out-Null
Invoke-Capture $Ctx "git --no-pager diff --check" (Join-Path $Ctx.EvidenceRoot "verify-diff-check.txt") { git --no-pager diff --check } | Out-Null

if ($RunTypecheck) {
  Invoke-Capture $Ctx "pnpm -w exec tsc --noEmit" (Join-Path $Ctx.EvidenceRoot "tsc-noemit.txt") { pnpm -w exec tsc --noEmit } | Out-Null
} else {
  Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "tsc-noemit.txt") -Value "SKIPPED: rerun with -RunTypecheck for full verification." -Encoding UTF8
  $Warnings.Add("TYPECHECK_SKIPPED")
}

$Result = [pscustomobject]@{
  status = if ($Errors.Count -gt 0) { "FAIL" } elseif ($Warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }
  errors = $Errors
  warnings = $Warnings
  session_id = $Ctx.SessionId
}
$Result | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "verification-result.json") -Encoding UTF8

$Summary = @"
# BThwani General Agent Package VERIFY

session_id: $($Ctx.SessionId)
status: $($Result.status)
errors_count: $($Errors.Count)
warnings_count: $($Warnings.Count)
run_typecheck: $RunTypecheck

Upload this evidence zip and LOCAL_CHANGE_REVIEW.patch for ChatGPT review before any commit.
"@
Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "SUMMARY.md") -Value $Summary -Encoding UTF8
$Zip = Complete-EvidenceZip $Ctx
Write-Host "VERIFY_EVIDENCE_ZIP: $Zip"
if ($Errors.Count -gt 0) { exit 1 }
