Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "GUARD_TAMAGUI_GOVERNANCE_LAW"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
$EvidenceFile = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"
$LawPath = "governance\TAMAGUI_INTEGRATION_LAW.md"

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

function Get-RootCodeFiles {
  $Root = Get-Location
  Get-ChildItem -LiteralPath $Root.Path -File -ErrorAction SilentlyContinue |
    Where-Object { @('.ts', '.tsx', '.js', '.jsx') -contains $_.Extension.ToLowerInvariant() }
}

Write-Evidence "SESSION_ID=$SessionId"
Write-Evidence "RUN_ROOT=$RunRoot"
Write-Evidence "ISSUE=Guard Tamagui governance law"
Write-Evidence "RULE=Tamagui must remain internal to @bthwani/ui-kit, except for the documented exact-path build-time exception in tamagui.build.ts."

Add-Section "01 - Governance law existence"

if (-not (Test-Path -LiteralPath $LawPath)) {
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=Missing governance/TAMAGUI_INTEGRATION_LAW.md"
  throw "Missing governance/TAMAGUI_INTEGRATION_LAW.md"
}

$Law = Get-Content -LiteralPath $LawPath -Raw
$RequiredLawTerms = @(
  "Tamagui is approved only as a private implementation engine",
  "packages/ui-kit/**",
  "tamagui.build.ts",
  "exact-path build-time exception",
  "TamaguiProvider must be owned by UI Kit only",
  "foundation.ts is the design-token source of truth",
  "tamagui-config.ts is an adapter only",
  "Any violation is a governance blocker"
)

$MissingTerms = @()
$LawNormalized = $Law.ToLowerInvariant()

foreach ($Term in $RequiredLawTerms) {
  $Exists = $LawNormalized.Contains($Term.ToLowerInvariant())
  Write-Evidence "LAW_TERM_EXISTS::$Term=$Exists"

  if (-not $Exists) {
    $MissingTerms += $Term
  }
}

Write-Evidence "MISSING_LAW_TERM_COUNT=$($MissingTerms.Count)"

Add-Section "02 - Exact-path build-time exception scan"

$RootCodeFiles = Get-RootCodeFiles
Write-Evidence "ROOT_CODE_FILE_COUNT=$($RootCodeFiles.Count)"

$DirectPattern = @(
  "from 'tamagui'",
  "from `"tamagui`"",
  "from '@tamagui/",
  "from `"@tamagui/"
)
$RootDirectHits = $RootCodeFiles | Select-String -Pattern $DirectPattern -ErrorAction SilentlyContinue

$AllowedBuildFileName = "tamagui.build.ts"

$OutsideAllowedHits = @()

foreach ($Hit in $RootDirectHits) {
  $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
  $IsAllowed = $Relative -eq $AllowedBuildFileName

  if ($IsAllowed) {
    Write-Evidence ("ALLOWED_BUILD_EXCEPTION::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())
  } else {
    Write-Evidence ("UNEXPECTED_ROOT_TAMAGUI_IMPORT::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())
    $OutsideAllowedHits += $Hit
  }
}

Write-Evidence "ROOT_DIRECT_TAMAGUI_IMPORT_COUNT=$($RootDirectHits.Count)"
Write-Evidence "ROOT_DIRECT_TAMAGUI_IMPORT_OUTSIDE_ALLOWED_COUNT=$($OutsideAllowedHits.Count)"

Add-Section "03 - Final status"

if ($MissingTerms.Count -gt 0) {
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=Tamagui governance law is missing required terms."
  throw "Tamagui governance law is missing required terms."
}

if ($OutsideAllowedHits.Count -gt 0) {
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=Unexpected root-level Tamagui import found outside the exact-path build-time exception."
  throw "Unexpected root-level Tamagui import found outside the exact-path build-time exception."
}

Write-Evidence "FINAL_STATUS=PASS"
Write-Evidence "DECISION=Tamagui governance law is present. The exact-path build-time exception is documented and no other root-level direct Tamagui import exists."
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "PASS. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"