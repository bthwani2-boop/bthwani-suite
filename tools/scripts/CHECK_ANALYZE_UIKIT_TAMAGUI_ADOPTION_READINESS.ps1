Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_UIKIT_TAMAGUI_ADOPTION_READINESS"
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

function Get-ProjectSourceFilesFast {
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
Write-Evidence "ISSUE=Analyze UI Kit Tamagui adoption readiness"
Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"
Write-Evidence "RULE=Tamagui is internal engine only. Apps/surfaces must consume @bthwani/ui-kit."

Add-Section "01 - Git baseline"

git --no-pager status --short --untracked-files=all 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

git --no-pager log -1 --oneline 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "02 - Tamagui package ownership"

$UiKitPackage = "packages\ui-kit\package.json"

if (Test-Path -LiteralPath $UiKitPackage) {
  Select-String -Path $UiKitPackage -Pattern '"tamagui"|"@tamagui/config"|"react-native"|"react"' -ErrorAction SilentlyContinue |
    ForEach-Object { Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
} else {
  Write-Evidence "UIKIT_PACKAGE_JSON_MISSING=True"
}

Add-Section "03 - Persistent guard verification"

$GuardPath = "tools\guards\GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1"
Write-Evidence "GUARD_PATH=$GuardPath"
Write-Evidence "GUARD_EXISTS=$(Test-Path -LiteralPath $GuardPath)"

if (Test-Path -LiteralPath $GuardPath) {
  powershell -ExecutionPolicy Bypass -File (Join-Path (Get-Location).Path $GuardPath) 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host
  $GuardExit = $LASTEXITCODE
  Write-Evidence "GUARD_EXIT_CODE=$GuardExit"
} else {
  Write-Evidence "GUARD_EXIT_CODE=NOT_RUN_MISSING_GUARD"
}

Add-Section "04 - UI Kit source inventory"

$UiKitFiles = Get-ProjectSourceFilesFast -Roots @("packages\ui-kit\src") -Extensions @(".ts", ".tsx", ".js", ".jsx")
Write-Evidence "UIKIT_SOURCE_FILE_COUNT=$($UiKitFiles.Count)"

foreach ($File in ($UiKitFiles | Sort-Object FullName)) {
  $Relative = $File.FullName.Replace((Get-Location).Path + "\", "")
  Write-Evidence "UIKIT_FILE=$Relative"
}

Add-Section "05 - Current Tamagui usage inside UI Kit"

$TamaguiPattern = "from 'tamagui'|from `"tamagui`"|from '@tamagui/|from `"@tamagui/|createTamagui|TamaguiProvider|tamaguiConfig"

$TamaguiHits = $UiKitFiles | Select-String -Pattern $TamaguiPattern -ErrorAction SilentlyContinue

$TamaguiHits | ForEach-Object {
  $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
  Write-Evidence ("TAMAGUI_HIT::{0}:{1}: {2}" -f $Relative, $_.LineNumber, $_.Line.Trim())
}

Write-Evidence "UIKIT_TAMAGUI_HIT_COUNT=$($TamaguiHits.Count)"

Add-Section "06 - Styling and drift indicators inside UI Kit"

$DriftPattern = "StyleSheet\.create|style=\{\{|className=|from 'react-native'|from `"react-native`"|SafeAreaView|any\b|export \*"

$DriftHits = $UiKitFiles | Select-String -Pattern $DriftPattern -ErrorAction SilentlyContinue

$InlineStyleCount = 0
$StyleSheetCount = 0
$ReactNativeImportCount = 0
$AnyCount = 0
$ExportStarCount = 0
$SafeAreaCount = 0

$DriftHits | ForEach-Object {
  $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
  $Line = $_.Line.Trim()

  if ($Line -match "style=\{\{") { $InlineStyleCount += 1 }
  if ($Line -match "StyleSheet\.create") { $StyleSheetCount += 1 }
  if ($Line -match "from ['""]react-native['""]") { $ReactNativeImportCount += 1 }
  if ($Line -match "\bany\b") { $AnyCount += 1 }
  if ($Line -match "export \*") { $ExportStarCount += 1 }
  if ($Line -match "SafeAreaView") { $SafeAreaCount += 1 }

  Write-Evidence ("DRIFT_HIT::{0}:{1}: {2}" -f $Relative, $_.LineNumber, $Line)
}

Write-Evidence ""
Write-Evidence "INLINE_STYLE_COUNT=$InlineStyleCount"
Write-Evidence "STYLESHEET_COUNT=$StyleSheetCount"
Write-Evidence "REACT_NATIVE_IMPORT_COUNT=$ReactNativeImportCount"
Write-Evidence "ANY_COUNT=$AnyCount"
Write-Evidence "EXPORT_STAR_COUNT=$ExportStarCount"
Write-Evidence "SAFE_AREA_VIEW_COUNT=$SafeAreaCount"

Add-Section "07 - Candidate files for safe Tamagui adoption"

$CandidateNames = @(
  "packages\ui-kit\src\primitives.tsx",
  "packages\ui-kit\src\components\button.tsx",
  "packages\ui-kit\src\components\card.tsx",
  "packages\ui-kit\src\components\field.tsx",
  "packages\ui-kit\src\components\state.tsx",
  "packages\ui-kit\src\components\overlay.tsx",
  "packages\ui-kit\src\components\header.tsx",
  "packages\ui-kit\src\mobile\root.tsx"
)

foreach ($Candidate in $CandidateNames) {
  $Exists = Test-Path -LiteralPath $Candidate
  Write-Evidence ""
  Write-Evidence "CANDIDATE=$Candidate"
  Write-Evidence "EXISTS=$Exists"

  if ($Exists) {
    $Raw = Get-Content -LiteralPath $Candidate -Raw
    $HasTamagui = $Raw -match "from ['""]tamagui['""]|from ['""]@tamagui/"
    $HasReactNative = $Raw -match "from ['""]react-native['""]"
    $HasSafeArea = $Raw -match "SafeAreaView"
    $HasNativeSensitive = $Raw -match "SafeAreaView|StatusBar|Platform|Dimensions|Keyboard|Linking|BackHandler"
    $HasInlineStyle = $Raw -match "style=\{\{"
    $HasStyleSheet = $Raw -match "StyleSheet\.create"

    Write-Evidence "HAS_TAMAGUI=$HasTamagui"
    Write-Evidence "HAS_REACT_NATIVE_IMPORT=$HasReactNative"
    Write-Evidence "HAS_SAFE_AREA=$HasSafeArea"
    Write-Evidence "HAS_NATIVE_SENSITIVE_USAGE=$HasNativeSensitive"
    Write-Evidence "HAS_INLINE_STYLE=$HasInlineStyle"
    Write-Evidence "HAS_STYLESHEET=$HasStyleSheet"

    if ($HasSafeArea) {
      Write-Evidence "CLASSIFICATION=DEFER_NATIVE_DEPENDENCY_RISK"
    } elseif ($HasNativeSensitive) {
      Write-Evidence "CLASSIFICATION=REVIEW_NATIVE_SENSITIVE_FIRST"
    } elseif ($HasTamagui) {
      Write-Evidence "CLASSIFICATION=ALREADY_TAMAGUI_BACKED_OR_PARTIAL"
    } else {
      Write-Evidence "CLASSIFICATION=JS_ONLY_TAMAGUI_CONVERSION_CANDIDATE"
    }
  }
}

Add-Section "08 - Cross-repo direct Tamagui import scan"

$AllSourceFiles = Get-ProjectSourceFilesFast -Roots @("apps", "packages") -Extensions @(".ts", ".tsx", ".js", ".jsx")
$DirectPattern = "from 'tamagui'|from `"tamagui`"|from '@tamagui/|from `"@tamagui/"
$DirectHits = $AllSourceFiles | Select-String -Pattern $DirectPattern -ErrorAction SilentlyContinue

$OutsideHits = @()

$DirectHits | ForEach-Object {
  $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
  $Scope = if ($Relative -like "packages\ui-kit\*") { "ALLOWED_UIKIT" } else { "BLOCKED_OUTSIDE_UIKIT" }
  Write-Evidence ("{0}::{1}:{2}: {3}" -f $Scope, $Relative, $_.LineNumber, $_.Line.Trim())

  if ($Relative -notlike "packages\ui-kit\*") {
    $OutsideHits += $_
  }
}

Write-Evidence "DIRECT_TAMAGUI_IMPORT_COUNT=$($DirectHits.Count)"
Write-Evidence "OUTSIDE_UIKIT_DIRECT_TAMAGUI_IMPORT_COUNT=$($OutsideHits.Count)"

Add-Section "09 - TypeScript verification"

pnpm -w exec tsc --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$RootTscExit = $LASTEXITCODE
Write-Evidence "ROOT_TSC_EXIT_CODE=$RootTscExit"

pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$UiKitTscExit = $LASTEXITCODE
Write-Evidence "UIKIT_TSC_EXIT_CODE=$UiKitTscExit"

Add-Section "10 - Final decision"

if ($OutsideHits.Count -gt 0) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=Direct Tamagui imports exist outside packages/ui-kit."
} elseif ($RootTscExit -ne 0 -or $UiKitTscExit -ne 0) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=TypeScript baseline failed."
} else {
  Write-Evidence "FINAL_STATUS=PASS_ACTIONABLE"
  Write-Evidence "DECISION=Proceed with Tamagui adoption planning inside ui-kit only. No EAS rebuild is required for JS-only ui-kit internal component conversion."
  Write-Evidence "NEXT_RECOMMENDED_CHECK=Review candidate classifications above, then choose one JS-only ui-kit file for APPLY_VERIFY conversion."
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
