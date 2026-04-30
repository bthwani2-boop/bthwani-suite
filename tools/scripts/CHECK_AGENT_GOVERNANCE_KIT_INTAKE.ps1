Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_AGENT_GOVERNANCE_KIT_INTAKE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Report = [ordered]@{
  sessionId = $SessionId
  repoRoot  = $RepoRoot
  checks    = [ordered]@{}
}

$PathsToCheck = @(
  ".github\agents",
  ".github\skills",
  ".github\prompts",
  ".cursor\rules",
  ".agents\skills",
  ".opencode\skills",
  ".codex",
  ".specify",
  "tools\scripts",
  "packages\ui-kit",
  "packages\surfaces",
  "governance",
  "governance\legacy-extracted"
)

foreach ($RelativePath in $PathsToCheck) {
  $FullPath = Join-Path $RepoRoot $RelativePath
  $Exists = Test-Path -LiteralPath $FullPath

  $FileCount = 0
  if ($Exists) {
    $FileCount = @(Get-ChildItem -LiteralPath $FullPath -Recurse -File -ErrorAction SilentlyContinue).Count
  }

  $Report.checks[$RelativePath] = [ordered]@{
    exists    = $Exists
    fileCount = $FileCount
  }
}

$PrdPatterns = @(
  "*PRD*",
  "*PRODUCT_REQUIREMENTS*",
  "*BRD*",
  "*SRS*",
  "*requirements*",
  "*spec.md"
)

$PrdHits = @()

foreach ($Pattern in $PrdPatterns) {
  $Hits = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File -Filter $Pattern -ErrorAction SilentlyContinue |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\" -and
      $_.FullName -notmatch "\\.git\\" -and
      $_.FullName -notmatch "\\kdt\\volatile\\"
    } |
    Select-Object -ExpandProperty FullName

  $PrdHits += $Hits
}

$PrdHits = @($PrdHits | Sort-Object -Unique)

$Report.checks["prdCandidates"] = @(
  $PrdHits | ForEach-Object { $_.Replace($RepoRoot + "\", "") }
)

$ExpectedScripts = @(
  "tools\scripts\BTHWANI_AGENT_OS_2026_V3_FULL_GATE.ps1",
  "tools\scripts\BTHWANI_AGENT_OS_2026_V3_EVOLUTION_FULL_GATE.ps1",
  "tools\scripts\validate-agent-governance.mjs",
  "tools\scripts\guard-central-i18n-direction.mjs",
  "tools\scripts\ghb.ps1"
)

$ExpectedScriptResults = @()

foreach ($ScriptRelativePath in $ExpectedScripts) {
  $ExpectedScriptResults += [ordered]@{
    path   = $ScriptRelativePath
    exists = Test-Path -LiteralPath (Join-Path $RepoRoot $ScriptRelativePath)
  }
}

$Report.checks["expectedScripts"] = $ExpectedScriptResults

$AgentRoot = Join-Path $RepoRoot ".github\agents"
$AgentFiles = @()

if (Test-Path -LiteralPath $AgentRoot) {
  $AgentFiles = Get-ChildItem -LiteralPath $AgentRoot -Recurse -File -Filter "*.agent.md" -ErrorAction SilentlyContinue
}

$BadAgentFrontmatter = @()

foreach ($AgentFile in $AgentFiles) {
  $FirstLine = Get-Content -LiteralPath $AgentFile.FullName -TotalCount 1 -ErrorAction SilentlyContinue

  if ($FirstLine -ne "---") {
    $BadAgentFrontmatter += $AgentFile.FullName.Replace($RepoRoot + "\", "")
  }
}

$Report.checks["badAgentFrontmatter"] = @($BadAgentFrontmatter)

$ServiceCatalogPath = Join-Path $RepoRoot "governance\SERVICE_CATALOG.md"
$AgentPolicyPath = Join-Path $RepoRoot ".github\agents\platform-agent-os-2026-v3-additive\Policies\agent.policy.json"

$Report.checks["serviceCatalogExists"] = Test-Path -LiteralPath $ServiceCatalogPath
$Report.checks["agentPolicyExists"] = Test-Path -LiteralPath $AgentPolicyPath

$SpecKitSignals = @(
  ".specify",
  ".github\prompts\specify.prompt.md",
  ".github\prompts\plan.prompt.md",
  ".github\prompts\tasks.prompt.md",
  ".github\prompts\implement.prompt.md"
)

$SpecKitResults = @()

foreach ($Signal in $SpecKitSignals) {
  $SpecKitResults += [ordered]@{
    path   = $Signal
    exists = Test-Path -LiteralPath (Join-Path $RepoRoot $Signal)
  }
}

$Report.checks["specKitSignals"] = $SpecKitResults

$OutJson = Join-Path $RunRoot "agent-governance-kit-intake.json"
$OutTxt  = Join-Path $RunRoot "SUMMARY.txt"

$Failures = @()
$Warnings = @()

foreach ($RequiredPath in @(".github\agents", ".github\skills", "packages\surfaces")) {
  if (-not $Report.checks[$RequiredPath].exists) {
    $Failures += "MISSING_REQUIRED_PATH: $RequiredPath"
  }
}

foreach ($ImportantPath in @("tools\scripts", "packages\ui-kit", ".cursor\rules")) {
  if (-not $Report.checks[$ImportantPath].exists) {
    $Warnings += "MISSING_IMPORTANT_PATH: $ImportantPath"
  }
}

foreach ($ScriptResult in $ExpectedScriptResults) {
  if (-not $ScriptResult.exists) {
    $Warnings += "MISSING_EXPECTED_SCRIPT: $($ScriptResult.path)"
  }
}

foreach ($BadFile in $BadAgentFrontmatter) {
  $Failures += "BAD_AGENT_FRONTMATTER: $BadFile"
}

$SpecKitExists = @($SpecKitResults | Where-Object { $_.exists }).Count -gt 0
if (-not $SpecKitExists) {
  $Warnings += "SPEC_KIT_NOT_FOUND"
}

$PrdCount = @($Report.checks["prdCandidates"]).Count
if ($PrdCount -eq 0) {
  $Warnings += "PRD_NOT_FOUND"
}

$Result = if ($Failures.Count -eq 0) { "PASS_WITH_WARNINGS" } else { "FAIL" }

$Report.checks["result"] = $Result
$Report.checks["failures"] = @($Failures)
$Report.checks["warnings"] = @($Warnings)

$Report | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $OutJson -Encoding UTF8

$SummaryLines = @(
  "SESSION_ID: $SessionId"
  "RUN_ROOT  : $RunRoot"
  "RESULT    : $Result"
  ""
  "KEY_COUNTS:"
  "- .github/agents fileCount : $($Report.checks[".github\agents"].fileCount)"
  "- .github/skills fileCount : $($Report.checks[".github\skills"].fileCount)"
  "- .cursor/rules fileCount  : $($Report.checks[".cursor\rules"].fileCount)"
  "- tools/scripts fileCount  : $($Report.checks["tools\scripts"].fileCount)"
  "- packages/ui-kit exists   : $($Report.checks["packages\ui-kit"].exists)"
  "- packages/surfaces exists : $($Report.checks["packages\surfaces"].exists)"
  "- PRD candidates           : $PrdCount"
  "- Bad agent frontmatter    : $(@($BadAgentFrontmatter).Count)"
  "- Spec Kit signals found   : $(@($SpecKitResults | Where-Object { $_.exists }).Count)"
  ""
  "FAILURES:"
)

if ($Failures.Count -eq 0) {
  $SummaryLines += "- none"
} else {
  $SummaryLines += ($Failures | ForEach-Object { "- $_" })
}

$SummaryLines += ""
$SummaryLines += "WARNINGS:"

if ($Warnings.Count -eq 0) {
  $SummaryLines += "- none"
} else {
  $SummaryLines += ($Warnings | ForEach-Object { "- $_" })
}

$SummaryLines += @(
  ""
  "PRD_CANDIDATES:"
)

if ($PrdCount -eq 0) {
  $SummaryLines += "- none"
} else {
  $SummaryLines += ($Report.checks["prdCandidates"] | ForEach-Object { "- $_" })
}

$SummaryLines += @(
  ""
  "EVIDENCE:"
  "- $OutJson"
  "- $OutTxt"
)

$SummaryLines | Set-Content -LiteralPath $OutTxt -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CHECK_AGENT_GOVERNANCE_KIT_INTAKE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SESSION_ID: $SessionId"
Write-Host "RUN_ROOT  : $RunRoot"

if ($Result -eq "FAIL") {
  Write-Host "RESULT    : FAIL" -ForegroundColor Red
} else {
  Write-Host "RESULT    : PASS_WITH_WARNINGS" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Cyan
Get-Content -LiteralPath $OutTxt

Write-Host ""
Write-Host "DONE. Evidence Pack created successfully." -ForegroundColor Green
Write-Host "JSON: $OutJson" -ForegroundColor Cyan
Write-Host "TXT : $OutTxt" -ForegroundColor Cyan
