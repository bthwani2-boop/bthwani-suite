Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_TAMAGUI_GUARD_GIT_VISIBILITY"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
$EvidenceFile = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Write-Evidence {
  param([string]$Text)
  $Text | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
}

function Add-Section {
  param([string]$Title)
  Write-Evidence ""
  Write-Evidence "============================================================"
  Write-Evidence "## $Title"
  Write-Evidence "============================================================"
}

$GuardPath = "tools\scripts\GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1"

Write-Evidence "SESSION_ID=$SessionId"
Write-Evidence "RUN_ROOT=$RunRoot"
Write-Evidence "ISSUE=Check whether Tamagui guard is visible/tracked by Git"
Write-Evidence "GUARD_PATH=$GuardPath"
Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"

Add-Section "01 - File existence"

$Exists = Test-Path -LiteralPath $GuardPath
Write-Evidence "GUARD_EXISTS=$Exists"

if ($Exists) {
  $Item = Get-Item -LiteralPath $GuardPath
  Write-Evidence "GUARD_FULL_PATH=$($Item.FullName)"
  Write-Evidence "GUARD_LENGTH=$($Item.Length)"
  Write-Evidence "GUARD_LAST_WRITE=$($Item.LastWriteTime)"
} else {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=Guard file does not exist at expected path."
  throw "Guard file missing"
}

Add-Section "02 - Git visibility"

Write-Evidence "--- git status --short --untracked-files=all -- tools/scripts ---"
git --no-pager status --short --untracked-files=all -- tools/scripts 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Write-Evidence "--- git ls-files -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1 ---"
git ls-files -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Write-Evidence "--- git check-ignore -v -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1 ---"
git check-ignore -v -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$CheckIgnoreExit = $LASTEXITCODE
Write-Evidence "CHECK_IGNORE_EXIT_CODE=$CheckIgnoreExit"

Write-Evidence "--- git status --ignored --short -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1 ---"
git --no-pager status --ignored --short -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "03 - Current repo diff"

git --no-pager status --short --untracked-files=all 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

git --no-pager diff --stat 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "04 - Final status"

$Tracked = (git ls-files -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1) -ne $null -and ((git ls-files -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1).Trim().Length -gt 0)

$StatusOutput = git --no-pager status --short --untracked-files=all -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1
$VisibleAsUntracked = $StatusOutput -match "^\?\?"

$IgnoredOutput = git --no-pager status --ignored --short -- tools/scripts/GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1
$VisibleAsIgnored = $IgnoredOutput -match "^!!"

Write-Evidence "GUARD_TRACKED=$Tracked"
Write-Evidence "GUARD_VISIBLE_AS_UNTRACKED=$VisibleAsUntracked"
Write-Evidence "GUARD_VISIBLE_AS_IGNORED=$VisibleAsIgnored"

if ($Tracked) {
  Write-Evidence "FINAL_STATUS=PASS"
  Write-Evidence "DECISION=Guard is already tracked by Git."
} elseif ($VisibleAsUntracked) {
  Write-Evidence "FINAL_STATUS=PASS_UNTRACKED"
  Write-Evidence "DECISION=Guard is visible to Git as untracked and can be staged."
} elseif ($VisibleAsIgnored) {
  Write-Evidence "FINAL_STATUS=BLOCKED_IGNORED"
  Write-Evidence "ROOT_CAUSE=Guard file is ignored by Git; it must be moved to a tracked governance path or force-added only if policy allows."
} else {
  Write-Evidence "FINAL_STATUS=BLOCKED_NOT_VISIBLE"
  Write-Evidence "ROOT_CAUSE=Guard file exists but is not visible in normal Git status. Need inspect ignore rules/path policy."
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
