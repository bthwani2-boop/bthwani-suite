Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_UIKIT_PRIMITIVES_TAMAGUI_SCOPE"
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

function Add-ExportName {
  param(
    [System.Collections.Generic.HashSet[string]]$Set,
    [string]$Name
  )

  $Clean = $Name.Trim()
  $Clean = $Clean -replace '^\s*type\s+', ''
  $Clean = $Clean -replace '\s+as\s+.*$', ''
  $Clean = $Clean.Trim()

  if ($Clean -match '^[A-Za-z_$][A-Za-z0-9_$]*$') {
    [void]$Set.Add($Clean)
  }
}

$TargetPath = "packages\ui-kit\src\primitives.tsx"
$TargetFullPath = Join-Path (Get-Location).Path $TargetPath

Write-Evidence "SESSION_ID=$SessionId"
Write-Evidence "RUN_ROOT=$RunRoot"
Write-Evidence "ISSUE=Analyze exact Tamagui adoption scope for ui-kit primitives"
Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"
Write-Evidence "TARGET=$TargetPath"
Write-Evidence "RULE=Do not modify primitives until public exports, consumers, native sensitivity, and TypeScript baseline are proven."

Add-Section "01 - Git baseline"

git --no-pager status --short --untracked-files=all 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

git --no-pager log -1 --oneline 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "02 - Target existence and fingerprint"

if (-not (Test-Path -LiteralPath $TargetPath)) {
  Write-Evidence "TARGET_EXISTS=False"
  Write-Evidence "FINAL_STATUS=FAIL"
  Write-Evidence "ROOT_CAUSE=packages/ui-kit/src/primitives.tsx does not exist."
  throw "Missing $TargetPath"
}

$Item = Get-Item -LiteralPath $TargetPath
$Hash = Get-FileHash -LiteralPath $TargetPath -Algorithm SHA256

Write-Evidence "TARGET_EXISTS=True"
Write-Evidence "TARGET_FULL_PATH=$($Item.FullName)"
Write-Evidence "TARGET_LENGTH=$($Item.Length)"
Write-Evidence "TARGET_LAST_WRITE=$($Item.LastWriteTime)"
Write-Evidence "TARGET_SHA256=$($Hash.Hash)"

Add-Section "03 - Current primitives source evidence"

Select-String -Path $TargetPath -Pattern "import |export |from 'react-native'|from `"react-native`"|from 'tamagui'|from `"tamagui`"|from '@tamagui/|from `"@tamagui/|StyleSheet|SafeAreaView|Animated|Platform|Dimensions|Keyboard|Linking|BackHandler|style=\{\{" -ErrorAction SilentlyContinue |
  ForEach-Object {
    Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
  }

Add-Section "04 - Import classification"

$Raw = Get-Content -LiteralPath $TargetPath -Raw

$HasReactNativeImport = $Raw -match "from ['""]react-native['""]"
$HasTamaguiImport = $Raw -match "from ['""]tamagui['""]|from ['""]@tamagui/"
$HasStyleSheet = $Raw -match "StyleSheet\.create"
$HasInlineStyle = $Raw -match "style=\{\{"
$HasSafeArea = $Raw -match "\bSafeAreaView\b"
$HasAnimated = $Raw -match "\bAnimated\b"
$HasNativeSensitive = $Raw -match "\bSafeAreaView\b|\bStatusBar\b|\bPlatform\b|\bDimensions\b|\bKeyboard\b|\bLinking\b|\bBackHandler\b|\bAnimated\b"
$HasAny = $Raw -match "\bany\b"
$HasExportStar = $Raw -match "export\s+\*"

Write-Evidence "HAS_REACT_NATIVE_IMPORT=$HasReactNativeImport"
Write-Evidence "HAS_TAMAGUI_IMPORT=$HasTamaguiImport"
Write-Evidence "HAS_STYLESHEET=$HasStyleSheet"
Write-Evidence "HAS_INLINE_STYLE=$HasInlineStyle"
Write-Evidence "HAS_SAFE_AREA=$HasSafeArea"
Write-Evidence "HAS_ANIMATED=$HasAnimated"
Write-Evidence "HAS_NATIVE_SENSITIVE=$HasNativeSensitive"
Write-Evidence "HAS_ANY=$HasAny"
Write-Evidence "HAS_EXPORT_STAR=$HasExportStar"

Add-Section "05 - Public export extraction"

$ExportNameSet = New-Object 'System.Collections.Generic.HashSet[string]'

$NamedExportMatches = [regex]::Matches($Raw, '(?m)^\s*export\s+(?:declare\s+)?(?:type\s+)?(?:interface|type|function|const|let|var|class|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)')
foreach ($Match in $NamedExportMatches) {
  Add-ExportName -Set $ExportNameSet -Name $Match.Groups[1].Value
}

$BraceExportMatches = [regex]::Matches($Raw, '(?m)^\s*export\s+(?:type\s+)?\{([^}]+)\}')
foreach ($Match in $BraceExportMatches) {
  $Parts = $Match.Groups[1].Value.Split(",")
  foreach ($Part in $Parts) {
    Add-ExportName -Set $ExportNameSet -Name $Part
  }
}

$ExportNames = @($ExportNameSet | Sort-Object)
Write-Evidence "EXPORT_NAME_COUNT=$($ExportNames.Count)"

foreach ($Name in $ExportNames) {
  Write-Evidence "EXPORT_NAME=$Name"
}

if ($ExportNames.Count -eq 0) {
  Write-Evidence "EXPORT_EXTRACTION_WARNING=No public export names were extracted. Conversion must not proceed until parser is improved or file reviewed manually."
}

Add-Section "06 - Entry point exposure"

$EntryPointFiles = @(
  "packages\ui-kit\src\index.ts",
  "packages\ui-kit\src\components\index.ts",
  "packages\ui-kit\src\mobile.ts",
  "packages\ui-kit\src\web.ts",
  "packages\ui-kit\src\next.ts",
  "packages\ui-kit\src\primitives.tsx"
)

foreach ($Entry in $EntryPointFiles) {
  Write-Evidence ""
  Write-Evidence "ENTRY_FILE=$Entry"
  Write-Evidence "ENTRY_EXISTS=$(Test-Path -LiteralPath $Entry)"

  if (Test-Path -LiteralPath $Entry) {
    Select-String -Path $Entry -Pattern "primitives|Box|Surface|Text|Scroll|Stack|Row|Column" -ErrorAction SilentlyContinue |
      ForEach-Object {
        Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
      }
  }
}

Add-Section "07 - Consumer impact scan"

$AllSourceFiles = Get-ProjectSourceFilesFast -Roots @("apps", "packages") -Extensions @(".ts", ".tsx", ".js", ".jsx")
$ConsumerFiles = $AllSourceFiles | Where-Object { $_.FullName -ne $TargetFullPath }

Write-Evidence "SOURCE_FILE_COUNT=$($AllSourceFiles.Count)"
Write-Evidence "CONSUMER_FILE_COUNT=$($ConsumerFiles.Count)"

$TotalConsumerHits = 0
$PublicApiConsumerHits = New-Object System.Collections.Generic.List[string]

foreach ($Name in $ExportNames) {
  $Pattern = "\b$([regex]::Escape($Name))\b"
  $Hits = $ConsumerFiles | Select-String -Pattern $Pattern -ErrorAction SilentlyContinue
  $HitCount = if ($Hits) { $Hits.Count } else { 0 }

  Write-Evidence ""
  Write-Evidence "EXPORT_USAGE_NAME=$Name"
  Write-Evidence "EXPORT_USAGE_HIT_COUNT=$HitCount"

  if ($HitCount -gt 0) {
    $TotalConsumerHits += $HitCount

    $FilesForName = $Hits | ForEach-Object { $_.Path.Replace((Get-Location).Path + "\", "") } | Sort-Object -Unique
    foreach ($File in $FilesForName) {
      Write-Evidence "EXPORT_USAGE_FILE=$Name :: $File"
    }

    $Hits | Select-Object -First 20 | ForEach-Object {
      $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
      Write-Evidence ("EXPORT_USAGE_SAMPLE::{0}:{1}: {2}" -f $Relative, $_.LineNumber, $_.Line.Trim())
    }

    if ($HitCount -gt 20) {
      Write-Evidence "EXPORT_USAGE_SAMPLE_TRUNCATED=True"
    }

    [void]$PublicApiConsumerHits.Add($Name)
  }
}

Write-Evidence ""
Write-Evidence "TOTAL_EXPORT_CONSUMER_HIT_COUNT=$TotalConsumerHits"
Write-Evidence "EXPORTS_WITH_CONSUMERS_COUNT=$($PublicApiConsumerHits.Count)"

Add-Section "08 - Direct import boundary scan"

$DirectPattern = "from 'tamagui'|from `"tamagui`"|from '@tamagui/|from `"@tamagui/"
$DirectHits = $AllSourceFiles | Select-String -Pattern $DirectPattern -ErrorAction SilentlyContinue

$OutsideDirectHits = @()

$DirectHits | ForEach-Object {
  $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
  $Scope = if ($Relative -like "packages\ui-kit\*") { "ALLOWED_UIKIT" } else { "BLOCKED_OUTSIDE_UIKIT" }
  Write-Evidence ("{0}::{1}:{2}: {3}" -f $Scope, $Relative, $_.LineNumber, $_.Line.Trim())

  if ($Relative -notlike "packages\ui-kit\*") {
    $OutsideDirectHits += $_
  }
}

Write-Evidence "DIRECT_TAMAGUI_IMPORT_COUNT=$($DirectHits.Count)"
Write-Evidence "OUTSIDE_UIKIT_DIRECT_TAMAGUI_IMPORT_COUNT=$($OutsideDirectHits.Count)"

Add-Section "09 - Tamagui module resolution from ui-kit"

$NodeScript = @"
const path = require('path');
const base = path.resolve(process.cwd(), 'packages/ui-kit');

for (const target of ['tamagui/package.json', '@tamagui/config/package.json']) {
  try {
    const resolved = require.resolve(target, { paths: [base] });
    const pkg = require(resolved);
    console.log('RESOLVE_STATUS=PASS target=' + target);
    console.log('RESOLVED_PATH=' + resolved);
    console.log('PACKAGE_VERSION=' + (pkg.version || 'UNKNOWN'));
  } catch (error) {
    console.log('RESOLVE_STATUS=FAIL target=' + target);
    console.log('ERROR_MESSAGE=' + error.message);
    process.exitCode = 1;
  }
}
"@

$ResolveFile = Join-Path $RunRoot "resolve_tamagui_from_ui_kit.cjs"
Set-Content -LiteralPath $ResolveFile -Value $NodeScript -Encoding UTF8

node $ResolveFile 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$ResolveExit = $LASTEXITCODE
Write-Evidence "TAMAGUI_RESOLVE_EXIT_CODE=$ResolveExit"

Add-Section "10 - TypeScript verification"

pnpm -w exec tsc --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$RootTscExit = $LASTEXITCODE
Write-Evidence "ROOT_TSC_EXIT_CODE=$RootTscExit"

pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$UiKitTscExit = $LASTEXITCODE
Write-Evidence "UIKIT_TSC_EXIT_CODE=$UiKitTscExit"

Add-Section "11 - Conversion decision"

$ApiMustRemainCompatible = $ExportNames.Count -gt 0
$HasProvenConsumers = $PublicApiConsumerHits.Count -gt 0
$NoNativeRisk = -not $HasSafeArea -and -not $HasNativeSensitive
$BoundaryClean = $OutsideDirectHits.Count -eq 0
$TypeScriptClean = $RootTscExit -eq 0 -and $UiKitTscExit -eq 0
$TamaguiResolvable = $ResolveExit -eq 0

Write-Evidence "API_MUST_REMAIN_COMPATIBLE=$ApiMustRemainCompatible"
Write-Evidence "HAS_PROVEN_CONSUMERS=$HasProvenConsumers"
Write-Evidence "NO_NATIVE_RISK=$NoNativeRisk"
Write-Evidence "BOUNDARY_CLEAN=$BoundaryClean"
Write-Evidence "TYPESCRIPT_CLEAN=$TypeScriptClean"
Write-Evidence "TAMAGUI_RESOLVABLE_FROM_UIKIT=$TamaguiResolvable"

if (-not $BoundaryClean) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=Direct Tamagui imports exist outside packages/ui-kit."
} elseif (-not $TypeScriptClean) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=TypeScript baseline failed."
} elseif (-not $TamaguiResolvable) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=Tamagui is not resolvable from packages/ui-kit."
} elseif (-not $NoNativeRisk) {
  Write-Evidence "FINAL_STATUS=DEFER"
  Write-Evidence "ROOT_CAUSE=primitives.tsx has native-sensitive usage; conversion should be deferred."
} elseif (-not $ApiMustRemainCompatible) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=No exported API extracted; cannot prove compatibility-safe conversion."
} else {
  Write-Evidence "FINAL_STATUS=PASS_ACTIONABLE"
  Write-Evidence "DECISION=primitives.tsx is eligible for an API-preserving Tamagui-backed conversion."
  Write-Evidence "NEXT_ALLOWED_APPLY=APPLY_VERIFY_UIKIT_PRIMITIVES_TAMAGUI_API_PRESERVING_CONVERSION"
  Write-Evidence "CONVERSION_CONSTRAINTS=Preserve all export names, props, import paths, and app/surface consumers. Do not add native dependencies. Do not modify mobile/root.tsx. Do not allow Tamagui imports outside ui-kit."
  Write-Evidence "EAS_REBUILD_DECISION=NOT_REQUIRED_FOR_THIS_JS_ONLY_PRIMITIVES_CONVERSION"
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
