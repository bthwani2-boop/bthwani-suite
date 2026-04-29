Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_TAMAGUI_IMPORT_BOUNDARY_FAST"
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
Write-Evidence "ISSUE=Fast Tamagui direct import boundary check"
Write-Evidence "RULE=Only packages/ui-kit may import from tamagui directly. app-client TamaguiProofOfLife is temporary diagnostic proof only."
Write-Evidence "EXCLUDED_DIRS=$($ExcludedDirNames -join ',')"

Add-Section "01 - Fast source inventory"

$Files = Get-ProjectSourceFilesFast -Roots @("apps", "packages") -Extensions @(".ts", ".tsx", ".js", ".jsx")

Write-Evidence "SOURCE_FILE_COUNT=$($Files.Count)"
Write-Evidence "Scan completed without entering excluded heavy directories."

Add-Section "02 - Direct Tamagui imports"

$Pattern = "from 'tamagui'|from `"tamagui`"|from '@tamagui/|from `"@tamagui/"

$Hits = $Files | Select-String -Pattern $Pattern -ErrorAction SilentlyContinue

$Hits | ForEach-Object {
  $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
  $Scope = if ($Relative -like "packages\ui-kit\*") { "ALLOWED_UIKIT" } else { "OUTSIDE_UIKIT" }
  Write-Evidence ("{0}::{1}:{2}: {3}" -f $Scope, $Relative, $_.LineNumber, $_.Line.Trim())
}

$OutsideHits = $Hits | Where-Object {
  $_.Path.Replace((Get-Location).Path + "\", "") -notlike "packages\ui-kit\*"
}

Add-Section "03 - Current app-client Tamagui proof status"

if (Test-Path -LiteralPath "apps\mobile\app-client\App.tsx") {
  Select-String -Path "apps\mobile\app-client\App.tsx" -Pattern "TamaguiProofOfLife|@bthwani/ui-kit|MobileRoot" |
    ForEach-Object {
      Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
    }
}

Add-Section "04 - Final status"

Write-Evidence "DIRECT_TAMAGUI_IMPORT_COUNT=$($Hits.Count)"
Write-Evidence "OUTSIDE_UIKIT_DIRECT_TAMAGUI_IMPORT_COUNT=$($OutsideHits.Count)"

if ($OutsideHits.Count -eq 0) {
  Write-Evidence "FINAL_STATUS=PASS"
  Write-Evidence "DECISION=Tamagui direct imports are contained inside packages/ui-kit."
} else {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=Direct Tamagui imports exist outside packages/ui-kit."
  Write-Evidence "DECISION=Keep only temporary diagnostic proof until runtime verification closes, then remove/dev-gate it."
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
