Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "GUARD_BTHWANI_PROTECTED_TOKENS"
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

function Get-ProjectFilesFast {
  param(
    [string[]]$Roots,
    [string[]]$Extensions
  )

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
Write-Evidence "ISSUE=Guard protected bthwani-family tokens"
Write-Evidence "MODE=GUARD"
Write-Evidence "RULE=Do not delete or alter bth inside bthwani, BThwani, BTHWANI, @bthwani/*, bthwani-suite, com.bthwani, bthwaniDirectionBootstrap, package names, repo names, app schemes, bundle IDs, brand identity, or public contracts."

Add-Section "01 - Source inventory"

$Files = Get-ProjectFilesFast `
  -Roots @("apps", "packages", "governance", ".github") `
  -Extensions @(".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".mdc", ".yaml", ".yml", ".css", ".scss", ".ps1")

Write-Evidence "SCAN_FILE_COUNT=$($Files.Count)"

Add-Section "02 - Protected allowed tokens"

$ProtectedPattern = "@bthwani/|bthwani-suite|bthwani-|BThwani|BTHWANI|com\.bthwani|\bbthwaniDirectionBootstrap\b|__BTHWANI_[A-Z0-9_]+__"
$ProtectedHits = $Files | Select-String -Pattern $ProtectedPattern -ErrorAction SilentlyContinue

foreach ($Hit in $ProtectedHits) {
  $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
  Write-Evidence ("PROTECTED_ALLOWED::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())
}

Write-Evidence "PROTECTED_ALLOWED_HIT_COUNT=$($ProtectedHits.Count)"

Add-Section "03 - Damaged protected token scan"

$DamagedPattern = "@wani/|\bwani-suite\b|\bBwani\b|\bBTHANI\b|\bcom\.wani\b|\bbthDirectionBootstrap\b|\bwaniDirectionBootstrap\b"
$DamagedHits = $Files | Select-String -Pattern $DamagedPattern -ErrorAction SilentlyContinue

foreach ($Hit in $DamagedHits) {
  $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
  Write-Evidence ("DAMAGED_PROTECTED_TOKEN::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())
}

Write-Evidence "DAMAGED_PROTECTED_TOKEN_COUNT=$($DamagedHits.Count)"

Add-Section "04 - Known forbidden temporary aliases"

$ForbiddenTemporaryPattern = "\bBthTamaguiView\b|\bBthTamaguiText\b|\bBthTamaguiScrollView\b|\bPrimitiveTamaguiView\b|\bPrimitiveTamaguiText\b|\bPrimitiveTamaguiScrollView\b"
$ForbiddenHits = $Files | Select-String -Pattern $ForbiddenTemporaryPattern -ErrorAction SilentlyContinue

foreach ($Hit in $ForbiddenHits) {
  $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
  Write-Evidence ("FORBIDDEN_TEMP_ALIAS::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())
}

Write-Evidence "FORBIDDEN_TEMP_ALIAS_COUNT=$($ForbiddenHits.Count)"

Add-Section "05 - Final status"

if ($DamagedHits.Count -gt 0) {
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=Protected bthwani-family token appears damaged."
  throw "Protected bthwani-family token appears damaged."
}

if ($ForbiddenHits.Count -gt 0) {
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=Known forbidden temporary Tamagui naming aliases still exist."
  throw "Known forbidden temporary Tamagui naming aliases still exist."
}

Write-Evidence "FINAL_STATUS=PASS"
Write-Evidence "DECISION=Protected bthwani-family tokens are preserved. No known temporary Tamagui naming aliases remain."
Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "PASS. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"