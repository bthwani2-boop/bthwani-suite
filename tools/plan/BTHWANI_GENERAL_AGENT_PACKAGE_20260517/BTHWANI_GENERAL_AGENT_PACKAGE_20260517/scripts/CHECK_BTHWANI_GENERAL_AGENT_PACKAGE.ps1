param(
  [string]$RepoRoot = "C:\bthwani-suite"
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
$ManifestPath = Join-Path $PackageRoot "manifest.json"
$Ctx = New-RunContext -RepoRoot $RepoRoot -Prefix "BTHWANI_GENERAL_AGENT_PACKAGE-CHECK"
Write-Log $Ctx "PACKAGE_ROOT: $PackageRoot"
Write-Log $Ctx "REPO_ROOT: $RepoRoot"
Save-BaselineGitEvidence $Ctx

$Manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
$InventoryPath = Join-Path $Ctx.EvidenceRoot "agents-inventory.txt"
git ls-files ".agents/**" | Sort-Object | Set-Content -LiteralPath $InventoryPath -Encoding UTF8

$RiskPattern = "npm install|npx |pnpm add|git push|git commit|force push|rm -rf|_HANDOFF\.zip|\.github/skills|\.github/agents|\.opencode/skills|MCP|hooks"
$RiskOut = Join-Path $Ctx.EvidenceRoot "agents-risk-terms.txt"
if (Test-Path -LiteralPath (Join-Path $RepoRoot ".agents")) {
  Get-ChildItem -LiteralPath (Join-Path $RepoRoot ".agents") -Recurse -File -Force |
    Select-String -Pattern $RiskPattern -ErrorAction SilentlyContinue |
    ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() } |
    Set-Content -LiteralPath $RiskOut -Encoding UTF8
} else {
  Set-Content -LiteralPath $RiskOut -Value "MISSING:.agents" -Encoding UTF8
}

$Rows = @()
foreach ($Skill in $Manifest.required_general_skills) {
  $Rel = ".agents/skills/$Skill/SKILL.md"
  $Full = Join-Path $RepoRoot $Rel
  $Rows += [pscustomobject]@{
    Skill = $Skill
    Path = $Rel
    Exists = (Test-Path -LiteralPath $Full)
  }
}
$Rows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Ctx.EvidenceRoot "required-skills-status.csv")

$Summary = @"
# BThwani General Agent Package CHECK

session_id: $($Ctx.SessionId)
repo_root: $RepoRoot
package_root: $PackageRoot
mode: READ_ONLY_CHECK

outputs:
- git-branch.txt
- git-head.txt
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- git-untracked.txt
- agents-inventory.txt
- agents-risk-terms.txt
- required-skills-status.csv
"@
Set-Content -LiteralPath (Join-Path $Ctx.EvidenceRoot "SUMMARY.md") -Value $Summary -Encoding UTF8
$Zip = Complete-EvidenceZip $Ctx
Write-Host "CHECK_EVIDENCE_ZIP: $Zip"
