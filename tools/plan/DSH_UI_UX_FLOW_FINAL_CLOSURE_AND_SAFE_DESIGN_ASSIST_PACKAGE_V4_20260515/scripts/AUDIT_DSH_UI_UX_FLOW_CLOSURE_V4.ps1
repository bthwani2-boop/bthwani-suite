
param(
  [string]$RepoRoot = "C:\bthwani-suite"
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $RepoRoot

$IssueCode = "AUDIT_DSH_UI_UX_FLOW_CLOSURE_V4"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Closure = Join-Path (Get-Location).Path "dsh\docs\closure"
$Findings = New-Object System.Collections.Generic.List[object]

function Add-Finding {
  param([string]$Severity,[string]$Code,[string]$Path,[int]$Line,[string]$Message)
  $Findings.Add([pscustomobject]@{severity=$Severity;code=$Code;path=$Path;line=$Line;message=$Message}) | Out-Null
}
function Rel([string]$P){ return $P.Replace((Get-Location).Path + "\", "") }

# Required files
$Required = @(
 "dsh\docs\closure\DSH_MISSING_LOGIC_AND_UI_GAPS.csv",
 "dsh\docs\closure\DSH_SCREEN_INVENTORY.csv",
 "dsh\docs\closure\DSH_ROUTE_STATE_CTA_MATRIX.csv",
 "dsh\docs\closure\DSH_SCREEN_API_MATRIX.csv",
 "dsh\docs\closure\DSH_CONTRACT_GAP_MAP.csv",
 "dsh\docs\closure\DSH_UI_REVIEW_QUEUE.md"
)
foreach($r in $Required){ if(-not(Test-Path -LiteralPath $r)){ Add-Finding "BLOCKER" "REQUIRED_FILE_MISSING" $r 0 "Required closure file missing." } }

# Gap CSV validation
$GapPath = "dsh\docs\closure\DSH_MISSING_LOGIC_AND_UI_GAPS.csv"
$ValidPriority = @("P0","P1","P2")
$ValidStatus = @("WIRED_IN_FLOW_NEEDS_VISUAL_REVIEW","SKELETON_ADDED_NEEDS_VISUAL_REVIEW","NEEDS_SKELETON","NEEDS_DESIGN","UNWIRED_SKELETON_BLOCKED","BLOCKED_BY_WLT","BLOCKED_BY_CONTRACT","EXPLICITLY_DEFERRED_WITH_REASON","OWNER_DECISION_REQUIRED","READY_FOR_VISUAL_BASELINE")
$GapRows = @()
if(Test-Path -LiteralPath $GapPath){
  try { $GapRows = Import-Csv -LiteralPath $GapPath }
  catch { Add-Finding "BLOCKER" "GAP_CSV_PARSE_FAIL" $GapPath 0 $_.Exception.Message }
  $i=1
  foreach($row in $GapRows){
    $i++
    if($ValidPriority -notcontains $row.priority){ Add-Finding "BLOCKER" "INVALID_GAP_PRIORITY" $GapPath $i ("Invalid priority: " + $row.priority + " gap=" + $row.gap_id) }
    if($ValidStatus -notcontains $row.status){ Add-Finding "BLOCKER" "INVALID_GAP_STATUS" $GapPath $i ("Invalid status: " + $row.status + " gap=" + $row.gap_id) }
  }
}

# TODO/FIXME/XXX in dsh/frontend
$DshFrontend = "dsh\frontend"
if(Test-Path -LiteralPath $DshFrontend){
  Get-ChildItem -LiteralPath $DshFrontend -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx | ForEach-Object {
    $Lines = Get-Content -LiteralPath $_.FullName
    for($i=0;$i -lt $Lines.Count;$i++){
      if($Lines[$i] -match "\bTODO\b|\bFIXME\b|\bXXX\b"){
        Add-Finding "WARN" "SOURCE_TODO_MARKER" (Rel $_.FullName) ($i+1) $Lines[$i].Trim()
      }
    }
  }
}

# Direct Tamagui outside ui-kit
Get-ChildItem -LiteralPath "dsh\frontend" -Recurse -File -Include *.ts,*.tsx -ErrorAction SilentlyContinue | ForEach-Object {
  $Text = Get-Content -Raw -LiteralPath $_.FullName
  if($Text -match "from\s+['\"]tamagui['\"]"){
    Add-Finding "BLOCKER" "TAMAGUI_DIRECT_IMPORT" (Rel $_.FullName) 0 "Direct Tamagui import outside ui-kit."
  }
}

# ui-kit diff
$UiKitDiff = git --no-pager diff --name-only -- ui-kit packages/ui-kit 2>$null
if($UiKitDiff){
  foreach($f in $UiKitDiff){ Add-Finding "BLOCKER" "UIKIT_DIFF_PRESENT" $f 0 "ui-kit change present; owner decision required." }
}

# Git checks
$Status = git --no-pager status --short
$DiffCheck = git --no-pager diff --check 2>&1
$Tsc = pnpm -w exec tsc --noEmit 2>&1
$TscExit = $LASTEXITCODE
$Untracked = git ls-files --others --exclude-standard

$FindingsPath = Join-Path $RunRoot "findings.csv"
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Summary = [pscustomobject]@{
  issue_code=$IssueCode
  session_id=$SessionId
  blockers=($Findings | Where-Object {$_.severity -eq 'BLOCKER'}).Count
  warnings=($Findings | Where-Object {$_.severity -eq 'WARN'}).Count
  gap_rows=$GapRows.Count
  tsc_exit=$TscExit
  result= if((($Findings | Where-Object {$_.severity -eq 'BLOCKER'}).Count -eq 0) -and ($TscExit -eq 0)) {"READY_FOR_NEXT_REVIEW"} else {"FIX_REQUIRED"}
}
$Summary | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "evidence.json")
$Status | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-status.txt")
$DiffCheck | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-check.txt")
$Tsc | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "tsc.txt")
$Untracked | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "untracked.txt")

@(
"$IssueCode",
"SESSION_ID : $SessionId",
"BLOCKERS   : $($Summary.blockers)",
"WARNINGS   : $($Summary.warnings)",
"GAP_ROWS   : $($Summary.gap_rows)",
"TSC_EXIT   : $TscExit",
"RESULT     : $($Summary.result)",
"RUN_ROOT   : $RunRoot"
) | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "SUMMARY.txt")

Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath (Join-Path $RunRoot ($SessionId + ".zip")) -Force

Write-Host "DSH V4 AUDIT" -ForegroundColor Cyan
Write-Host "SESSION_ID : $SessionId"
Write-Host "BLOCKERS   : $($Summary.blockers)"
Write-Host "WARNINGS   : $($Summary.warnings)"
Write-Host "RESULT     : $($Summary.result)"
Write-Host "RUN_ROOT   : $RunRoot"
