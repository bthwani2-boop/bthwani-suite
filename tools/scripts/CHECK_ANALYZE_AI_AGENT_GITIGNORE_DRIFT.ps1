Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_AI_AGENT_GITIGNORE_DRIFT"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "summary.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"

$GitStatus = git status --short
$GitignoreDiff = git diff -- .gitignore
$AgentStatus = git status --short -- AGENTS.md CLAUDE.md GEMINI.md .codex .claude .gemini .mcp.json mcp.json .gitignore
$TrackedCodex = git ls-files .codex
$UntrackedAgentCandidates = git ls-files --others --exclude-standard | Where-Object {
  $_ -match '(^|/)(AGENTS\.md|CLAUDE\.md|GEMINI\.md|\.claude|\.gemini|\.mcp\.json|mcp\.json)'
}

$Finding = if ([string]::IsNullOrWhiteSpace($GitignoreDiff)) {
  "PASS: .gitignore has no diff."
} else {
  "WARN: .gitignore has diff and must be reviewed before restore/keep decision."
}

$Summary = @"
ISSUE: $IssueCode
SESSION: $SessionId
RESULT: $Finding

CURRENT GIT STATUS:
$($GitStatus -join "`n")

AGENT-RELATED STATUS:
$($AgentStatus -join "`n")

TRACKED .codex FILES:
$($TrackedCodex -join "`n")

UNTRACKED AGENT CANDIDATES:
$($UntrackedAgentCandidates -join "`n")

.gitignore DIFF:
$GitignoreDiff
"@

$Evidence = [ordered]@{
  issue = $IssueCode
  sessionId = $SessionId
  result = $Finding
  gitStatus = @($GitStatus)
  agentStatus = @($AgentStatus)
  trackedCodex = @($TrackedCodex)
  untrackedAgentCandidates = @($UntrackedAgentCandidates)
  gitignoreDiff = $GitignoreDiff
  evidenceRoot = $RunRoot
}

$Summary | Set-Content -LiteralPath $SummaryPath -Encoding UTF8
$Evidence | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== $IssueCode ===" -ForegroundColor Cyan
Write-Host "SESSION: $SessionId"
Write-Host "RESULT: $Finding" -ForegroundColor Yellow
Write-Host ""
Write-Host "AGENT-RELATED STATUS:" -ForegroundColor Cyan
if ($AgentStatus) { $AgentStatus | ForEach-Object { Write-Host $_ } } else { Write-Host "NONE" }
Write-Host ""
Write-Host ".gitignore DIFF:" -ForegroundColor Cyan
if ($GitignoreDiff) { Write-Host $GitignoreDiff } else { Write-Host "NO DIFF" }
Write-Host ""
Write-Host "EVIDENCE: $RunRoot"
