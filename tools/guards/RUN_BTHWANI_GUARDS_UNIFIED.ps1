param(
  [ValidateSet('fast','prepush','governance','architecture','ui','dsh','finance','agent','release')]
  [string]$Profile = 'governance',

  [ValidateSet('GOVERNANCE','ARCHITECTURE','UI_UX_FLOW','API_BINDING','RUNTIME','PRODUCTION','PR_MERGE')]
  [string]$Phase = 'UI_UX_FLOW',

  [ValidateSet('Audit','Ratchet','Release')]
  [string]$Mode = 'Audit',

  [switch]$Strict,
  [switch]$SkipExisting,
  [switch]$SkipV3,
  [switch]$CreateZip)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = 'Stop'
$RepoRoot = (Get-Location).Path
$SessionId = "UNIFIED_GUARDS-$Profile-$Phase-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Path $EvidenceRoot -Force | Out-Null
$CommandLog = Join-Path $EvidenceRoot 'commands.log'
function Log-Line([string]$Message) { $line = "$(Get-Date -Format o) $Message"; $line | Tee-Object -FilePath $CommandLog -Append | Out-Host }
Log-Line "Unified SessionId=$SessionId"
Log-Line "Profile=$Profile Phase=$Phase Mode=$Mode Strict=$Strict SkipExisting=$SkipExisting SkipV3=$SkipV3"

$Failures = 0
$Warnings = 0
$ExistingRunner = Join-Path $RepoRoot 'tools\guards\RUN_GOVERNANCE_GUARDS.ps1'
$V3Runner = Join-Path $RepoRoot 'tools\guards\RUN_BTHWANI_GUARDS_V3.ps1'

function Get-RunnerStatus([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    return $null
  }
  $text = Get-Content -LiteralPath $Path -Raw
  $match = [regex]::Match($text, '(?im)^\s*status:\s*(PASS|WARN|FAIL)\s*$')
  if ($match.Success) {
    return $match.Groups[1].Value.ToUpperInvariant()
  }
  return $null
}

if (-not $SkipExisting) {
  if (Test-Path -LiteralPath $ExistingRunner) {
    $ExistingProfile = if ($Profile -eq 'agent') { 'Agent' } else { 'Governance' }
    Log-Line "RUN existing guards: $ExistingRunner -Mode Local -Profile $ExistingProfile"
    $ExistingOutput = Join-Path $EvidenceRoot 'existing-guards.output.txt'
    & pwsh -NoProfile -ExecutionPolicy Bypass -File $ExistingRunner -Mode Local -Profile $ExistingProfile *> $ExistingOutput
    $ExistingExit = $LASTEXITCODE
    Log-Line "EXIT existing guards code=$ExistingExit"
    $ExistingStatus = Get-RunnerStatus $ExistingOutput
    if ($ExistingExit -ne 0 -or $ExistingStatus -eq 'FAIL') {
      $Failures++
    } elseif ($ExistingStatus -eq 'WARN') {
      $Warnings++
    }
  } else {
    Log-Line "Existing runner missing; this is a warning because V3 is additive."
    "Existing runner missing: $ExistingRunner" | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'existing-guards.missing.txt') -Encoding UTF8
    $Warnings++
  }
}

if (-not $SkipV3) {
  if (Test-Path -LiteralPath $V3Runner) {
    Log-Line "RUN V3 guards: $V3Runner -Profile $Profile -Phase $Phase -Mode $Mode"
    $V3Args = @('-NoProfile','-ExecutionPolicy','Bypass','-File',$V3Runner,'-Profile',$Profile,'-Phase',$Phase,'-Mode',$Mode)
    if ($Strict) { $V3Args += '-Strict' }
    $V3Output = Join-Path $EvidenceRoot 'v3-guards.output.txt'
    & pwsh @V3Args *> $V3Output
    $V3Exit = $LASTEXITCODE
    Log-Line "EXIT V3 guards code=$V3Exit"
    $V3Status = Get-RunnerStatus $V3Output
    if ($V3Exit -ne 0 -or $V3Status -eq 'FAIL') {
      $Failures++
    } elseif ($V3Status -eq 'WARN') {
      $Warnings++
    }
  } else {
    Log-Line "V3 runner missing."
    "V3 runner missing: $V3Runner" | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'v3-guards.missing.txt') -Encoding UTF8
    $Failures++
  }
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
  "This runner is additive: it preserves the existing tools/guards/RUN_GOVERNANCE_GUARDS.ps1 path and then runs the root-level V3 complementary guards."
) | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'SUMMARY.md') -Encoding UTF8
[ordered]@{ status=$FinalStatus; session_id=$SessionId; profile=$Profile; phase=$Phase; mode=$Mode; evidence_root=$EvidenceRoot; zip=$(if ($CreateZip) { $ZipPath } else { $null }); failures=$Failures; warnings=$Warnings; blocking=$Blocking; additive=$true } | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'evidence.json') -Encoding UTF8
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
