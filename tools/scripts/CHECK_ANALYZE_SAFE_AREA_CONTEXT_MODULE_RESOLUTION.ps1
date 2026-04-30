Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_SAFE_AREA_CONTEXT_MODULE_RESOLUTION"
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

function Invoke-ResolveCheck {
  param(
    [string]$Label,
    [string]$BasePath
  )

  Add-Section "Resolve check - $Label"

  $FullBase = Join-Path (Get-Location).Path $BasePath
  Write-Evidence "LABEL=$Label"
  Write-Evidence "BASE_PATH=$BasePath"
  Write-Evidence "FULL_BASE=$FullBase"
  Write-Evidence "BASE_EXISTS=$(Test-Path -LiteralPath $FullBase)"

  $NodeScript = @"
const path = require('path');
const base = path.resolve(process.cwd(), '$($BasePath.Replace('\','/'))');
const target = 'react-native-safe-area-context/package.json';

try {
  const resolved = require.resolve(target, { paths: [base] });
  const pkg = require(resolved);
  console.log('RESOLVE_STATUS=PASS');
  console.log('RESOLVED_PATH=' + resolved);
  console.log('PACKAGE_VERSION=' + (pkg.version || 'UNKNOWN'));
} catch (error) {
  console.log('RESOLVE_STATUS=FAIL');
  console.log('ERROR_NAME=' + error.name);
  console.log('ERROR_MESSAGE=' + error.message);
  process.exitCode = 1;
}
"@

  $TempNodeFile = Join-Path $RunRoot ("resolve_" + ($Label -replace '[^a-zA-Z0-9_-]', '_') + ".cjs")
  Set-Content -LiteralPath $TempNodeFile -Value $NodeScript -Encoding UTF8

  node $TempNodeFile 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
  $Exit = $LASTEXITCODE
  Write-Evidence "NODE_RESOLVE_EXIT_CODE=$Exit"

  return $Exit
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
Write-Evidence "ISSUE=Verify react-native-safe-area-context module resolution before SafeAreaView remediation"
Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"
Write-Evidence "RULE=Do not import react-native-safe-area-context from ui-kit until module resolution and dependency ownership are proven."

Add-Section "01 - Git baseline"

git --no-pager status --short --untracked-files=all 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "02 - Manifest declarations"

$ManifestPaths = @(
  "package.json",
  "apps\mobile\app-client\package.json",
  "packages\ui-kit\package.json"
)

foreach ($Manifest in $ManifestPaths) {
  Write-Evidence ""
  Write-Evidence "PACKAGE_JSON=$Manifest"
  Write-Evidence "DECLARED_SAFE_AREA=$(Test-JsonPackageDependency -PackageJsonPath $Manifest -DependencyName "react-native-safe-area-context")"
  if (Test-Path -LiteralPath $Manifest) {
    Select-String -Path $Manifest -Pattern '"react-native-safe-area-context"|"react-native"|"expo"' -ErrorAction SilentlyContinue |
      ForEach-Object { Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
  }
}

Add-Section "03 - pnpm list / why"

Write-Evidence "--- pnpm -w list react-native-safe-area-context --depth 10 ---"
pnpm -w list react-native-safe-area-context --depth 10 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$PnpmListExit = $LASTEXITCODE
Write-Evidence "PNPM_LIST_EXIT_CODE=$PnpmListExit"

Write-Evidence "--- pnpm -w why react-native-safe-area-context ---"
pnpm -w why react-native-safe-area-context 2>&1 |
  Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$PnpmWhyExit = $LASTEXITCODE
Write-Evidence "PNPM_WHY_EXIT_CODE=$PnpmWhyExit"

Add-Section "04 - Node resolution from required scopes"

$RootResolveExit = Invoke-ResolveCheck -Label "repo-root" -BasePath "."
$UiKitResolveExit = Invoke-ResolveCheck -Label "packages-ui-kit" -BasePath "packages\ui-kit"
$AppClientResolveExit = Invoke-ResolveCheck -Label "apps-mobile-app-client" -BasePath "apps\mobile\app-client"

Add-Section "05 - Direct source evidence"

$Target = "packages\ui-kit\src\mobile\root.tsx"

if (Test-Path -LiteralPath $Target) {
  Select-String -Path $Target -Pattern "SafeAreaView|StatusBar|react-native-safe-area-context|from 'react-native'|from `"react-native`"" |
    ForEach-Object { Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
} else {
  Write-Evidence "TARGET_EXISTS=False"
}

Add-Section "06 - TypeScript baseline"

pnpm -w exec tsc --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$RootTscExit = $LASTEXITCODE
Write-Evidence "ROOT_TSC_EXIT_CODE=$RootTscExit"

pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
$UiKitTscExit = $LASTEXITCODE
Write-Evidence "UIKIT_TSC_EXIT_CODE=$UiKitTscExit"

Add-Section "07 - Final decision"

$RootDeclared = Test-JsonPackageDependency -PackageJsonPath "package.json" -DependencyName "react-native-safe-area-context"
$UiKitDeclared = Test-JsonPackageDependency -PackageJsonPath "packages\ui-kit\package.json" -DependencyName "react-native-safe-area-context"
$AppClientDeclared = Test-JsonPackageDependency -PackageJsonPath "apps\mobile\app-client\package.json" -DependencyName "react-native-safe-area-context"

$AnyDeclared = (
  $RootDeclared -notin @("NOT_DECLARED", "PACKAGE_JSON_MISSING", "INVALID_JSON") -or
  $UiKitDeclared -notin @("NOT_DECLARED", "PACKAGE_JSON_MISSING", "INVALID_JSON") -or
  $AppClientDeclared -notin @("NOT_DECLARED", "PACKAGE_JSON_MISSING", "INVALID_JSON")
)

$AllResolve = ($RootResolveExit -eq 0 -and $UiKitResolveExit -eq 0 -and $AppClientResolveExit -eq 0)

Write-Evidence "ANY_MANIFEST_DECLARES_SAFE_AREA=$AnyDeclared"
Write-Evidence "ALL_REQUIRED_SCOPES_RESOLVE_SAFE_AREA=$AllResolve"
Write-Evidence "ROOT_RESOLVE_EXIT=$RootResolveExit"
Write-Evidence "UIKIT_RESOLVE_EXIT=$UiKitResolveExit"
Write-Evidence "APP_CLIENT_RESOLVE_EXIT=$AppClientResolveExit"

if ($AllResolve -and $AnyDeclared) {
  Write-Evidence "FINAL_STATUS=PASS_JS_ONLY_READY"
  Write-Evidence "DECISION=SafeAreaView remediation can proceed as JS-only import swap. EAS rebuild is not expected for this specific change."
} elseif ($AllResolve -and -not $AnyDeclared) {
  Write-Evidence "FINAL_STATUS=BLOCKED_OWNERSHIP_NOT_DECLARED"
  Write-Evidence "ROOT_CAUSE=Module resolves, but no manifest declares ownership. Add canonical dependency ownership before import swap."
  Write-Evidence "EAS_REBUILD_DECISION=POSSIBLE_AFTER_DEPENDENCY_OWNERSHIP_CHANGE"
} else {
  Write-Evidence "FINAL_STATUS=BLOCKED_MODULE_NOT_RESOLVABLE"
  Write-Evidence "ROOT_CAUSE=react-native-safe-area-context is not resolvable from all required scopes."
  Write-Evidence "EAS_REBUILD_DECISION=LIKELY_REQUIRED_IF_WE_ADD_THIS_NATIVE_DEPENDENCY"
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
