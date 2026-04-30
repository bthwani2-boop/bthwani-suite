Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "GUARD_TAMAGUI_IMPORT_BOUNDARY"
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

$ExcludedDirNames = @(
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".expo",
  ".turbo",
  ".nx",
  ".git",
  ".gradle",
  ".idea",
  ".vscode",
  "android",
  "ios"
)

function Get-ProjectSourceFilesFast {
  param(
    [string[]]$Roots,
    [string[]]$Extensions
  )

  $Result = New-Object System.Collections.Generic.List[System.IO.FileInfo]
  $Stack = New-Object System.Collections.Generic.Stack[string]

  foreach ($Root in $Roots) {
    $FullRoot = Join-Path (Get-Location).Path $Root
    if (Test-Path -LiteralPath $FullRoot) {
      $Stack.Push($FullRoot)
    }
  }

  while ($Stack.Count -gt 0) {
    $Current = $Stack.Pop()
    $DirName = Split-Path -Leaf $Current

    if ($ExcludedDirNames -contains $DirName) {
      continue
    }

    foreach ($File in Get-ChildItem -LiteralPath $Current -File -ErrorAction SilentlyContinue) {
      if ($Extensions -contains $File.Extension.ToLowerInvariant()) {
        $Result.Add($File)
      }
    }

    foreach ($Dir in Get-ChildItem -LiteralPath $Current -Directory -ErrorAction SilentlyContinue) {
      if ($ExcludedDirNames -notcontains $Dir.Name) {
        $Stack.Push($Dir.FullName)
      }
    }
  }

  return $Result
}

Write-Evidence "SESSION_ID=$SessionId"
Write-Evidence "RUN_ROOT=$RunRoot"
Write-Evidence "ISSUE=Guard Tamagui direct imports outside packages/ui-kit"
Write-Evidence "RULE=Direct imports from tamagui or @tamagui/* are allowed only inside packages/ui-kit."
Write-Evidence "EXCLUDED_DIRS=$($ExcludedDirNames -join ',')"

Add-Section "01 - Source inventory"
$Files = Get-ProjectSourceFilesFast -Roots @("apps", "packages") -Extensions @(".ts", ".tsx", ".js", ".jsx")
Write-Evidence "SOURCE_FILE_COUNT=$($Files.Count)"

Add-Section "02 - Direct Tamagui import scan"
$DirectPattern = "from 'tamagui'|from `"tamagui`"|from '@tamagui/|from `"@tamagui/"
$DirectHits = $Files | Select-String -Pattern $DirectPattern -ErrorAction SilentlyContinue

$DirectHits | ForEach-Object {
  $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
  $Scope = if ($Relative -like "packages\ui-kit\*") { "ALLOWED_UIKIT" } else { "BLOCKED_OUTSIDE_UIKIT" }
  Write-Evidence ("{0}::{1}:{2}: {3}" -f $Scope, $Relative, $_.LineNumber, $_.Line.Trim())
}

$OutsideHits = $DirectHits | Where-Object {
  $_.Path.Replace((Get-Location).Path + "\", "") -notlike "packages\ui-kit\*"
}

Add-Section "03 - Final status"
Write-Evidence "DIRECT_TAMAGUI_IMPORT_COUNT=$($DirectHits.Count)"
Write-Evidence "OUTSIDE_UIKIT_DIRECT_TAMAGUI_IMPORT_COUNT=$($OutsideHits.Count)"

if ($OutsideHits.Count -eq 0) {
  Write-Evidence "FINAL_STATUS=PASS"
  Write-Evidence "DECISION=Tamagui import boundary is clean. Direct Tamagui imports are contained inside packages/ui-kit."
} else {
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=Direct Tamagui imports exist outside packages/ui-kit."
  $OutsideHits | ForEach-Object {
    $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
    Write-Evidence ("VIOLATION={0}:{1}: {2}" -f $Relative, $_.LineNumber, $_.Line.Trim())
  }
  throw "Tamagui import boundary guard failed."
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
