Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_SAFE_AREA_VIEW_DEPRECATION"
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

function Test-JsonPackageDependency {
  param(
    [string]$PackageJsonPath,
    [string]$DependencyName
  )

  if (-not (Test-Path -LiteralPath $PackageJsonPath)) {
    return "PACKAGE_JSON_MISSING"
  }

  try {
    $Json = Get-Content -LiteralPath $PackageJsonPath -Raw | ConvertFrom-Json -Depth 100
    foreach ($Group in @("dependencies", "devDependencies", "peerDependencies", "optionalDependencies")) {
      if ($Json.$Group) {
        foreach ($Prop in $Json.$Group.PSObject.Properties) {
          if ($Prop.Name -eq $DependencyName) {
            return "$Group=$($Prop.Value)"
          }
        }
      }
    }
    return "NOT_DECLARED"
  } catch {
    return "INVALID_JSON"
  }
}

Write-Evidence "SESSION_ID=$SessionId"
Write-Evidence "RUN_ROOT=$RunRoot"
Write-Evidence "ISSUE=Diagnose SafeAreaView deprecation warning"
Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"
Write-Evidence "GOAL=Determine exact SafeAreaView source usages and whether remediation is JS-only or requires native rebuild."

Add-Section "01 - Repository baseline"

Write-Evidence "PWD=$((Get-Location).Path)"

Write-Evidence "--- git branch ---"
git --no-pager branch --show-current 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Write-Evidence "--- git status --short --untracked-files=all ---"
git --no-pager status --short --untracked-files=all 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "02 - Expo / React Native package baseline"

$PackageJsonPaths = @(
  "package.json",
  "apps\mobile\app-client\package.json",
  "apps\mobile\app-partner\package.json",
  "apps\mobile\app-captain\package.json",
  "apps\mobile\app-field\package.json",
  "packages\ui-kit\package.json"
)

foreach ($Path in $PackageJsonPaths) {
  Write-Evidence ""
  Write-Evidence "PACKAGE_JSON=$Path"
  if (Test-Path -LiteralPath $Path) {
    Select-String -Path $Path -Pattern '"expo"|"react-native"|"react-native-safe-area-context"|"@react-native' -ErrorAction SilentlyContinue |
      ForEach-Object {
        Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
      }

    $SafeAreaDep = Test-JsonPackageDependency -PackageJsonPath $Path -DependencyName "react-native-safe-area-context"
    $ReactNativeDep = Test-JsonPackageDependency -PackageJsonPath $Path -DependencyName "react-native"
    $ExpoDep = Test-JsonPackageDependency -PackageJsonPath $Path -DependencyName "expo"

    Write-Evidence "DECLARED_react-native-safe-area-context=$SafeAreaDep"
    Write-Evidence "DECLARED_react-native=$ReactNativeDep"
    Write-Evidence "DECLARED_expo=$ExpoDep"
  } else {
    Write-Evidence "MISSING=true"
  }
}

Add-Section "03 - Lockfile evidence for react-native-safe-area-context"

$LockPath = "pnpm-lock.yaml"
if (Test-Path -LiteralPath $LockPath) {
  Write-Evidence "LOCKFILE_EXISTS=True"
  Select-String -Path $LockPath -Pattern "react-native-safe-area-context" -Context 2,3 -ErrorAction SilentlyContinue |
    ForEach-Object {
      Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
      if ($_.Context.PreContext) {
        $_.Context.PreContext | ForEach-Object { Write-Evidence ("  PRE: {0}" -f $_) }
      }
      if ($_.Context.PostContext) {
        $_.Context.PostContext | ForEach-Object { Write-Evidence ("  POST: {0}" -f $_) }
      }
    }

  $LockHasSafeArea = (Select-String -Path $LockPath -Pattern "react-native-safe-area-context" -Quiet -ErrorAction SilentlyContinue)
  Write-Evidence "LOCK_HAS_REACT_NATIVE_SAFE_AREA_CONTEXT=$LockHasSafeArea"
} else {
  Write-Evidence "LOCKFILE_EXISTS=False"
  Write-Evidence "LOCK_HAS_REACT_NATIVE_SAFE_AREA_CONTEXT=False"
}

Add-Section "04 - pnpm dependency graph evidence"

Write-Evidence "--- pnpm -w why react-native-safe-area-context ---"
pnpm -w why react-native-safe-area-context 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$PnpmWhyExit = $LASTEXITCODE
Write-Evidence "PNPM_WHY_SAFE_AREA_EXIT_CODE=$PnpmWhyExit"

Add-Section "05 - Fast SafeAreaView source scan"

$Files = Get-ProjectSourceFilesFast -Roots @("apps", "packages") -Extensions @(".ts", ".tsx", ".js", ".jsx")
Write-Evidence "SOURCE_FILE_COUNT=$($Files.Count)"

$SafeAreaHits = $Files | Select-String -Pattern "\bSafeAreaView\b|react-native-safe-area-context|from 'react-native'|from `"react-native`"" -ErrorAction SilentlyContinue

$SafeAreaHitCount = 0
$ReactNativeSafeAreaImportCount = 0
$SafeAreaContextImportCount = 0
$SafeAreaViewUsageCount = 0
$FilesWithSafeArea = New-Object System.Collections.Generic.HashSet[string]

foreach ($Hit in $SafeAreaHits) {
  $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
  $Line = $Hit.Line.Trim()

  if ($Line -match "\bSafeAreaView\b|react-native-safe-area-context") {
    $SafeAreaHitCount += 1
    [void]$FilesWithSafeArea.Add($Relative)
    Write-Evidence ("HIT::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Line)
  }

  if ($Line -match "import\s+\{[^}]*\bSafeAreaView\b[^}]*\}\s+from\s+['""]react-native['""]") {
    $ReactNativeSafeAreaImportCount += 1
  }

  if ($Line -match "from\s+['""]react-native-safe-area-context['""]") {
    $SafeAreaContextImportCount += 1
  }

  if ($Line -match "<SafeAreaView\b|\bSafeAreaView\b") {
    $SafeAreaViewUsageCount += 1
  }
}

Write-Evidence ""
Write-Evidence "SAFE_AREA_RELATED_HIT_COUNT=$SafeAreaHitCount"
Write-Evidence "FILES_WITH_SAFE_AREA_COUNT=$($FilesWithSafeArea.Count)"
Write-Evidence "REACT_NATIVE_SAFE_AREA_IMPORT_COUNT=$ReactNativeSafeAreaImportCount"
Write-Evidence "SAFE_AREA_CONTEXT_IMPORT_COUNT=$SafeAreaContextImportCount"
Write-Evidence "SAFE_AREA_VIEW_USAGE_COUNT=$SafeAreaViewUsageCount"

Add-Section "06 - Candidate files requiring remediation"

foreach ($File in ($FilesWithSafeArea | Sort-Object)) {
  Write-Evidence "CANDIDATE_FILE=$File"

  $FullPath = Join-Path (Get-Location).Path $File
  if (Test-Path -LiteralPath $FullPath) {
    $Lines = Get-Content -LiteralPath $FullPath
    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $Line = $Lines[$i]
      if ($Line -match "\bSafeAreaView\b|react-native-safe-area-context") {
        $Start = [Math]::Max(0, $i - 3)
        $End = [Math]::Min($Lines.Count - 1, $i + 3)
        Write-Evidence "--- CONTEXT $File line $($i + 1) ---"
        for ($j = $Start; $j -le $End; $j++) {
          $Marker = if ($j -eq $i) { ">>" } else { "  " }
          Write-Evidence ("{0} {1,5}: {2}" -f $Marker, ($j + 1), $Lines[$j])
        }
      }
    }
  }
}

Add-Section "07 - Package availability and EAS rebuild decision"

$RootSafeAreaDeclared = Test-JsonPackageDependency -PackageJsonPath "package.json" -DependencyName "react-native-safe-area-context"
$UiKitSafeAreaDeclared = Test-JsonPackageDependency -PackageJsonPath "packages\ui-kit\package.json" -DependencyName "react-native-safe-area-context"
$LockHasSafeAreaFinal = $false

if (Test-Path -LiteralPath $LockPath) {
  $LockHasSafeAreaFinal = (Select-String -Path $LockPath -Pattern "react-native-safe-area-context" -Quiet -ErrorAction SilentlyContinue)
}

$PackageInstalledInNodeModules = Test-Path -LiteralPath "node_modules\react-native-safe-area-context"
$PackageInstalledInPnpmStore = $false
if (Test-Path -LiteralPath "node_modules\.pnpm") {
  $PackageInstalledInPnpmStore = [bool](Get-ChildItem -LiteralPath "node_modules\.pnpm" -Directory -Filter "react-native-safe-area-context*" -ErrorAction SilentlyContinue | Select-Object -First 1)
}

Write-Evidence "ROOT_DECLARED_SAFE_AREA=$RootSafeAreaDeclared"
Write-Evidence "UIKIT_DECLARED_SAFE_AREA=$UiKitSafeAreaDeclared"
Write-Evidence "LOCK_HAS_SAFE_AREA=$LockHasSafeAreaFinal"
Write-Evidence "NODE_MODULES_HAS_SAFE_AREA=$PackageInstalledInNodeModules"
Write-Evidence "PNPM_STORE_HAS_SAFE_AREA=$PackageInstalledInPnpmStore"

$SafeAreaPackageAvailable = (
  ($RootSafeAreaDeclared -ne "NOT_DECLARED" -and $RootSafeAreaDeclared -ne "PACKAGE_JSON_MISSING" -and $RootSafeAreaDeclared -ne "INVALID_JSON") -or
  ($UiKitSafeAreaDeclared -ne "NOT_DECLARED" -and $UiKitSafeAreaDeclared -ne "PACKAGE_JSON_MISSING" -and $UiKitSafeAreaDeclared -ne "INVALID_JSON") -or
  $LockHasSafeAreaFinal -or
  $PackageInstalledInNodeModules -or
  $PackageInstalledInPnpmStore
)

$NeedsCodeChange = $ReactNativeSafeAreaImportCount -gt 0
$NeedsDependencyChange = -not $SafeAreaPackageAvailable

Write-Evidence "SAFE_AREA_PACKAGE_AVAILABLE=$SafeAreaPackageAvailable"
Write-Evidence "NEEDS_CODE_CHANGE=$NeedsCodeChange"
Write-Evidence "NEEDS_DEPENDENCY_CHANGE=$NeedsDependencyChange"

if ($NeedsDependencyChange) {
  Write-Evidence "EAS_REBUILD_DECISION=LIKELY_REQUIRED_IF_WE_ADD_REACT_NATIVE_SAFE_AREA_CONTEXT"
  Write-Evidence "EAS_REBUILD_REASON=react-native-safe-area-context is not proven available in current native build/dependency graph."
} elseif ($NeedsCodeChange) {
  Write-Evidence "EAS_REBUILD_DECISION=LIKELY_NOT_REQUIRED_JS_ONLY_IMPORT_SWAP"
  Write-Evidence "EAS_REBUILD_REASON=react-native-safe-area-context appears available; expected remediation is import swap/code-level only."
} else {
  Write-Evidence "EAS_REBUILD_DECISION=NOT_REQUIRED_FOR_SAFE_AREA_VIEW"
  Write-Evidence "EAS_REBUILD_REASON=No proven react-native SafeAreaView import requiring remediation."
}

Add-Section "08 - TypeScript baseline"

pnpm -w exec tsc --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$RootTscExit = $LASTEXITCODE
Write-Evidence "ROOT_TSC_EXIT_CODE=$RootTscExit"

pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$UiKitTscExit = $LASTEXITCODE
Write-Evidence "UIKIT_TSC_EXIT_CODE=$UiKitTscExit"

Add-Section "09 - Final status"

if ($ReactNativeSafeAreaImportCount -gt 0) {
  Write-Evidence "FINAL_STATUS=ACTIONABLE"
  Write-Evidence "ROOT_CAUSE=Deprecated SafeAreaView import from react-native exists."
  Write-Evidence "NEXT_ALLOWED_STEP=Prepare one APPLY_VERIFY script to replace only proven react-native SafeAreaView imports with react-native-safe-area-context imports."
} elseif ($SafeAreaViewUsageCount -gt 0 -and $SafeAreaContextImportCount -gt 0) {
  Write-Evidence "FINAL_STATUS=PASS_ALREADY_USING_SAFE_AREA_CONTEXT"
  Write-Evidence "DECISION=SafeAreaView usages appear to come from react-native-safe-area-context, not react-native."
} else {
  Write-Evidence "FINAL_STATUS=NO_DIRECT_SAFE_AREA_VIEW_SOURCE_FOUND"
  Write-Evidence "DECISION=Metro warning may originate from dependency code or generated/native surface, not direct app/package source."
}

Write-Evidence "SUMMARY_REACT_NATIVE_SAFE_AREA_IMPORT_COUNT=$ReactNativeSafeAreaImportCount"
Write-Evidence "SUMMARY_SAFE_AREA_CONTEXT_IMPORT_COUNT=$SafeAreaContextImportCount"
Write-Evidence "SUMMARY_SAFE_AREA_VIEW_USAGE_COUNT=$SafeAreaViewUsageCount"
Write-Evidence "SUMMARY_ROOT_TSC_EXIT_CODE=$RootTscExit"
Write-Evidence "SUMMARY_UIKIT_TSC_EXIT_CODE=$UiKitTscExit"

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
