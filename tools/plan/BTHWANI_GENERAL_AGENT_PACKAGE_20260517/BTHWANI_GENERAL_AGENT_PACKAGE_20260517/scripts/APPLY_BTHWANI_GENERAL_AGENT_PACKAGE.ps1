param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [switch]$Apply,
  [switch]$AllowDifferentBranch,
  [string]$ExpectedBranch = "ghb/0147-20260517-000916-dsh-administration-and-platform"
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

function Backup-IfExists {
  param([string]$RepoRoot, [string]$BackupRoot, [string]$Rel)
  $Source = Join-Path $RepoRoot $Rel
  if (Test-Path -LiteralPath $Source) {
    $Dest = Join-Path $BackupRoot $Rel
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Dest) | Out-Null
    if ((Get-Item -LiteralPath $Source).PSIsContainer) {
      Copy-Item -LiteralPath $Source -Destination $Dest -Recurse -Force
    } else {
      Copy-Item -LiteralPath $Source -Destination $Dest -Force
    }
  }
}

$PackageRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PayloadRoot = Join-Path $PackageRoot "payload"
$Ctx = New-RunContext -RepoRoot $RepoRoot -Prefix "BTHWANI_GENERAL_AGENT_PACKAGE-APPLY"
Write-Log $Ctx "PACKAGE_ROOT: $PackageRoot"
Write-Log $Ctx "PAYLOAD_ROOT: $PayloadRoot"
Write-Log $Ctx "APPLY: $Apply"
Save-BaselineGitEvidence $Ctx

$Branch = (git branch --show-current).Trim()
if (($Branch -ne $ExpectedBranch) -and (-not $AllowDifferentBranch)) {
  throw "Unexpected branch '$Branch'. Expected '$ExpectedBranch'. Pass -AllowDifferentBranch only if reviewed."
}

$BackupRoot = Join-Path $Ctx.EvidenceRoot "backup"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$Targets = @(
  ".agents",
  "governance\agents",
  "tools\guards\guard-bthwani-agent-package.mjs",
  "AGENTS.md"
)
Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "intended-targets.txt") -Value ($Targets -join [Environment]::NewLine) -Encoding UTF8

Backup-IfExists $RepoRoot $BackupRoot ".agents"
Backup-IfExists $RepoRoot $BackupRoot "governance\agents"
Backup-IfExists $RepoRoot $BackupRoot "tools\guards\guard-bthwani-agent-package.mjs"
Backup-IfExists $RepoRoot $BackupRoot "AGENTS.md"

if (-not $Apply) {
  Write-Log $Ctx "DRY_RUN_ONLY: no files changed"
  Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "dry-run.txt") -Value "No files changed. Re-run with -Apply to apply payload." -Encoding UTF8
  $Zip = Complete-EvidenceZip $Ctx
  Write-Host "DRY_RUN_EVIDENCE_ZIP: $Zip"
  exit 0
}

# Copy payload directories and files.
Copy-Item -LiteralPath (Join-Path $PayloadRoot ".agents") -Destination $RepoRoot -Recurse -Force
Copy-Item -LiteralPath (Join-Path $PayloadRoot "governance") -Destination $RepoRoot -Recurse -Force
New-Item -ItemType Directory -Force -Path (Join-Path $RepoRoot "tools\guards") | Out-Null
Copy-Item -LiteralPath (Join-Path $PayloadRoot "tools\guards\guard-bthwani-agent-package.mjs") -Destination (Join-Path $RepoRoot "tools\guards\guard-bthwani-agent-package.mjs") -Force

# Update AGENTS.md contract block only.
$AgentsPath = Join-Path $RepoRoot "AGENTS.md"
$Block = Get-Content -LiteralPath (Join-Path $PayloadRoot "AGENTS.BTHWANI_CURRENT_AGENT_CONTRACT.md") -Raw
if (Test-Path -LiteralPath $AgentsPath) {
  $Existing = Get-Content -LiteralPath $AgentsPath -Raw
  $Pattern = "(?s)<!-- BTHWANI_CURRENT_AGENT_CONTRACT_START -->.*?<!-- BTHWANI_CURRENT_AGENT_CONTRACT_END -->"
  if ($Existing -match $Pattern) {
    $Updated = [regex]::Replace($Existing, $Pattern, $Block.Trim())
  } else {
    $Updated = $Existing.TrimEnd() + [Environment]::NewLine + [Environment]::NewLine + $Block.Trim() + [Environment]::NewLine
  }
  Set-Content -LiteralPath $AgentsPath -Value $Updated -Encoding UTF8
} else {
  Set-Content -LiteralPath $AgentsPath -Value $Block -Encoding UTF8
}

Save-BaselineGitEvidence $Ctx
Invoke-Capture $Ctx "node tools/guards/guard-bthwani-agent-package.mjs" (Join-Path $Ctx.EvidenceRoot "guard-bthwani-agent-package.txt") { node tools/guards/guard-bthwani-agent-package.mjs } | Out-Null

$PatchPath = Join-Path $RepoRoot "LOCAL_CHANGE_REVIEW.patch"
git --no-pager diff --binary > $PatchPath
Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "LOCAL_CHANGE_REVIEW_PATH.txt") -Value $PatchPath -Encoding UTF8

$Summary = @"
# BThwani General Agent Package APPLY

session_id: $($Ctx.SessionId)
repo_root: $RepoRoot
package_root: $PackageRoot
mode: APPLY
backup_root: $BackupRoot
patch_path: $PatchPath

Expected next:
1. Run VERIFY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1
2. Upload LOCAL_CHANGE_REVIEW.patch and evidence zip for review.
"@
Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "SUMMARY.md") -Value $Summary -Encoding UTF8
$Zip = Complete-EvidenceZip $Ctx
Write-Host "APPLY_EVIDENCE_ZIP: $Zip"
