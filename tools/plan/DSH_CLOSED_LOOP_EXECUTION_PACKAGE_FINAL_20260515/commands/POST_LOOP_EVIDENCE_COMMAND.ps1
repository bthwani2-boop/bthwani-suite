Set-Location -LiteralPath "C:\bthwani-suite"

$Loop = Read-Host "Enter loop id, e.g. LOOP_0, LOOP_1, LOOP_2"
$IssueCode = "DSH_POST_LOOP_EVIDENCE"
$SessionId = "{0}-{1}-{2:yyyyMMdd-HHmmss}" -f $IssueCode, $Loop, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

git branch --show-current | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-branch.txt")
git rev-parse HEAD | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-head.txt")
git --no-pager status --short | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-status.txt")
git --no-pager diff --stat | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-stat.txt")
git --no-pager diff --name-status | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-name-status.txt")
git --no-pager diff --check 2>&1 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-check.txt")
git ls-files --others --exclude-standard | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-untracked.txt")
git --no-pager diff -- . | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "LOCAL_CHANGE_REVIEW.patch")

pnpm -w exec tsc --noEmit *> (Join-Path $RunRoot "tsc-noemit.txt")
$TscExit = $LASTEXITCODE

$StatusText = Get-Content -Raw -LiteralPath (Join-Path $RunRoot "git-status.txt")
$DiffCheckText = Get-Content -Raw -LiteralPath (Join-Path $RunRoot "git-diff-check.txt")
$UntrackedText = Get-Content -Raw -LiteralPath (Join-Path $RunRoot "git-untracked.txt")

$Decision =
  if ($TscExit -ne 0) BLOCKED_TSC_FAIL
  elseif ($DiffCheckText.Trim().Length -gt 0) BLOCKED_DIFF_CHECK
  elseif ($UntrackedText.Trim().Length -gt 0) NEEDS_UNTRACKED_ACCOUNTING
  else EVIDENCE_READY_FOR_CHATGPT_REVIEW

@"
# DSH Post Loop Evidence

loop: $Loop
session_id: $SessionId
decision: $Decision
tsc_exit_code: $TscExit
evidence_root: $RunRoot

Upload this ZIP to ChatGPT for review before proceeding.
"@ | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "SUMMARY.md")

@{
  loop = $Loop
  session_id = $SessionId
  decision = $Decision
  tsc_exit_code = $TscExit
  evidence_root = $RunRoot
} | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "evidence.json")

$ZipPath = Join-Path $RunRoot ($SessionId + ".zip")
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "DSH POST LOOP EVIDENCE" -ForegroundColor Cyan
Write-Host "DECISION : $Decision"
Write-Host "ZIP      : $ZipPath"
