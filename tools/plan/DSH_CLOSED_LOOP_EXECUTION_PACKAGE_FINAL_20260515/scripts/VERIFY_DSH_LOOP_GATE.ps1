Set-Location -LiteralPath "C:\bthwani-suite"

param(
  [Parameter(Mandatory=$false)]
  [string]$Loop = "UNKNOWN"
)

$ErrorActionPreference = "Continue"

$IssueCode = "VERIFY_DSH_LOOP_GATE"
$SessionId = "{0}-{1}-{2:yyyyMMdd-HHmmss}" -f $IssueCode, $Loop, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

git --no-pager status --short | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-status.txt")
git --no-pager diff --stat | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-stat.txt")
git --no-pager diff --name-status | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-name-status.txt")
git --no-pager diff --check 2>&1 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-check.txt")
git ls-files --others --exclude-standard | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-untracked.txt")
git --no-pager diff -- . | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "LOCAL_CHANGE_REVIEW.patch")

$tscPath = Join-Path $RunRoot "tsc-noemit.txt"
pnpm -w exec tsc --noEmit *> $tscPath
$tscExit = $LASTEXITCODE

$diffCheckText = Get-Content -Raw -LiteralPath (Join-Path $RunRoot "git-diff-check.txt")
$untrackedText = Get-Content -Raw -LiteralPath (Join-Path $RunRoot "git-untracked.txt")

$status =
  if ($tscExit -ne 0) { "BLOCKED_TSC_FAIL" }
  elseif ($diffCheckText.Trim().Length -gt 0) { "BLOCKED_DIFF_CHECK" }
  elseif ($untrackedText.Trim().Length -gt 0) { "NEEDS_UNTRACKED_ACCOUNTING" }
  else { "EVIDENCE_READY_FOR_REVIEW" }

$Evidence = [pscustomobject]@{
  session_id = $SessionId
  loop = $Loop
  status = $status
  tsc_exit_code = $tscExit
  evidence_root = $RunRoot
  patch = "LOCAL_CHANGE_REVIEW.patch"
}

$Evidence | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "evidence.json")
$Evidence | Format-List | Out-String | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "SUMMARY.md")

$ZipPath = Join-Path $RunRoot ($SessionId + ".zip")
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "=== DSH LOOP GATE VERIFY ===" -ForegroundColor Cyan
Write-Host "LOOP      : $Loop"
Write-Host "STATUS    : $status"
Write-Host "RUN_ROOT  : $RunRoot"
Write-Host "ZIP       : $ZipPath"
