param(
  [ValidateSet('fast','prepush','governance','architecture','ui','dsh','finance','agent','release')]
  [string]$Profile = 'governance',

  [ValidateSet('GOVERNANCE','ARCHITECTURE','UI_UX_FLOW','API_BINDING','RUNTIME','PRODUCTION','PR_MERGE')]
  [string]$Phase = 'UI_UX_FLOW',

  [ValidateSet('Audit','Release')]
  [string]$Mode = 'Audit',

  [switch]$Strict,
  [switch]$CreateZip
)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = 'Stop'

$RepoRoot = (Get-Location).Path
$SessionId = "UNIFIED_GUARDS-$Profile-$Phase-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Path $EvidenceRoot -Force | Out-Null

$CommandLog = Join-Path $EvidenceRoot 'commands.log'
function Log-Line([string]$Message) {
  $line = "$(Get-Date -Format o) $Message"
  $line | Tee-Object -FilePath $CommandLog -Append | Out-Host
}

Log-Line "Unified SessionId=$SessionId"
Log-Line "Profile=$Profile Phase=$Phase Mode=$Mode Strict=$Strict"
Log-Line "V3/Ratchet retired from unified runner. Full PR checks must call explicit current guards or package scripts."

$Failures = 0
$Warnings = 0

git --no-pager status --short *> (Join-Path $EvidenceRoot 'git-status.txt')
git --no-pager diff --check *> (Join-Path $EvidenceRoot 'git-diff-check.txt')
git --no-pager diff --cached --check *> (Join-Path $EvidenceRoot 'git-diff-cached-check.txt')

$GovernanceRunner = Join-Path $RepoRoot 'tools\guards\RUN_GOVERNANCE_GUARDS.ps1'
if (Test-Path -LiteralPath $GovernanceRunner) {
  $GovernanceProfile = if ($Profile -eq 'agent') { 'Agent' } else { 'Governance' }
  $GovernanceOutput = Join-Path $EvidenceRoot 'governance-guards.output.txt'
  Log-Line "RUN governance guards: $GovernanceRunner -Mode Local -Profile $GovernanceProfile"
  & pwsh -NoProfile -ExecutionPolicy Bypass -File $GovernanceRunner -Mode Local -Profile $GovernanceProfile *> $GovernanceOutput
  $GovernanceExit = $LASTEXITCODE
  Log-Line "EXIT governance guards code=$GovernanceExit"

  $OutputText = Get-Content -LiteralPath $GovernanceOutput -Raw -ErrorAction SilentlyContinue
  if ($GovernanceExit -ne 0 -or $OutputText -match '(?im)^status:\s*FAIL\s*$') {
    $Failures++
  } elseif ($OutputText -match '(?im)^status:\s*WARN\s*$') {
    $Warnings++
  }
} else {
  "Missing governance runner: $GovernanceRunner" | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'governance-runner-missing.txt') -Encoding UTF8
  $Failures++
}

$FinalStatus = if ($Failures -gt 0) { 'FAIL' } elseif ($Warnings -gt 0) { 'WARN' } else { 'PASS' }
$Blocking = ($Failures -gt 0) -or ($Strict -and $Warnings -gt 0)
$ZipPath = Join-Path $EvidenceRoot "$SessionId.zip"

@(
  "# BThwani Unified Guards Run",
  "",
  "- status: $FinalStatus",
  "- session_id: $SessionId",
  "- profile: $Profile",
  "- phase: $Phase",
  "- mode: $Mode",
  "- evidence_root: $EvidenceRoot",
  "- zip: $(if ($CreateZip) { $ZipPath } else { 'not-created-by-default' })",
  "- failures: $Failures",
  "- warnings: $Warnings",
  "- blocking: $Blocking",
  "",
  "Unified runner policy: no V3/ratchet. Commit/push hooks remain fast; PR checks are explicit and manual."
) | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'SUMMARY.md') -Encoding UTF8

[ordered]@{
  status=$FinalStatus
  session_id=$SessionId
  profile=$Profile
  phase=$Phase
  mode=$Mode
  evidence_root=$EvidenceRoot
  zip=$(if ($CreateZip) { $ZipPath } else { $null })
  failures=$Failures
  warnings=$Warnings
  blocking=$Blocking
  v3_retired=$true
} | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'evidence.json') -Encoding UTF8

if ($CreateZip) {
  Compress-Archive -Path (Join-Path $EvidenceRoot '*') -DestinationPath $ZipPath -Force
}

Write-Host ""
Write-Host "status: $FinalStatus"
Write-Host "evidence_root: $EvidenceRoot"
Write-Host "zip: $(if ($CreateZip) { $ZipPath } else { 'not-created-by-default' })"
Write-Host "guards_fail: $Failures"
Write-Host "guards_warn: $Warnings"

if ($Blocking) { exit 1 }
exit 0