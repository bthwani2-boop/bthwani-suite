<#
BTHWANI_DEEP_DIAGNOSE_REALTEST.ps1
Read-only deep diagnostic for bthwani-suite realtest branch.
Scope: app-client, app-partner, app-captain, app-field, control-panel, DSH/WLT/Auth linkage, Provider Center readiness.
Creates evidence under tools/registry/runs; does not modify source code except evidence files.
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [string]$Branch = "realtest",
  [bool]$RunTypeScript = $true,
  [bool]$RunBuild = $true,
  [bool]$RunExpoConfig = $true,
  [bool]$RunGoTests = $true,
  [bool]$RunDocker = $true,
  [bool]$RunGuards = $true,
  [bool]$RunStatic = $true,
  [switch]$ExitNonZero,
  [switch]$OpenReport
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function New-SafeName([string]$Text) {
  return (($Text -replace '[^a-zA-Z0-9._-]+','_').Trim('_'))
}

function Write-Utf8File([string]$Path, [string]$Content) {
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function Read-TextOrEmpty([string]$Path) {
  if (Test-Path -LiteralPath $Path) { return [System.IO.File]::ReadAllText($Path) }
  return ""
}

function Add-Finding {
  param(
    [string]$Area,
    [string]$Check,
    [ValidateSet('PASS','WARN','FAIL','BLOCKED','INFO','SKIP')][string]$Status,
    [ValidateSet('LOW','MEDIUM','HIGH','CRITICAL')][string]$Severity = 'MEDIUM',
    [string]$Message,
    [string]$Evidence = '',
    [string]$Recommendation = ''
  )
  $script:Findings.Add([pscustomobject]@{
    area = $Area
    check = $Check
    status = $Status
    severity = $Severity
    message = $Message
    evidence = $Evidence
    recommendation = $Recommendation
  }) | Out-Null
  $mark = if ($Status -eq 'PASS') {'[PASS]'} elseif ($Status -eq 'FAIL') {'[FAIL]'} elseif ($Status -eq 'BLOCKED') {'[BLOCKED]'} elseif ($Status -eq 'WARN') {'[WARN]'} else {"[$Status]"}
  Write-Host "$mark $Area :: $Check - $Message"
}

function Invoke-LoggedCommand {
  param(
    [string]$Name,
    [string]$Command,
    [string]$WorkDir = $script:RepoRootResolved,
    [ValidateSet('LOW','MEDIUM','HIGH','CRITICAL')][string]$SeverityOnFail = 'HIGH',
    [bool]$Required = $true
  )
  $safe = New-SafeName $Name
  $log = Join-Path $script:LogsDir "$safe.log"
  $cmdFile = Join-Path $script:LogsDir "$safe.command.txt"
  Write-Utf8File $cmdFile $Command
  Push-Location -LiteralPath $WorkDir
  try {
    Write-Host "`n>>> $Name"
    Write-Host "    $Command"
    $output = & pwsh -NoProfile -ExecutionPolicy Bypass -Command $Command 2>&1
    $exit = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }
    $text = ($output | ForEach-Object { $_.ToString() }) -join [Environment]::NewLine
    Write-Utf8File $log $text
    if ($exit -eq 0) {
      Add-Finding -Area 'COMMAND' -Check $Name -Status 'PASS' -Severity 'LOW' -Message 'Command completed successfully.' -Evidence $log
    } else {
      $status = if ($Required) { 'FAIL' } else { 'WARN' }
      Add-Finding -Area 'COMMAND' -Check $Name -Status $status -Severity $SeverityOnFail -Message "Command failed with exit code $exit." -Evidence $log -Recommendation 'Open the log file and fix the first real error before continuing.'
    }
    return [pscustomobject]@{ name=$Name; exitCode=$exit; log=$log; command=$Command }
  } catch {
    $msg = $_.Exception.Message
    Write-Utf8File $log $msg
    $status = if ($Required) { 'FAIL' } else { 'WARN' }
    Add-Finding -Area 'COMMAND' -Check $Name -Status $status -Severity $SeverityOnFail -Message "Command threw exception: $msg" -Evidence $log
    return [pscustomobject]@{ name=$Name; exitCode=999; log=$log; command=$Command }
  } finally {
    Pop-Location
  }
}

if (-not (Test-Path -LiteralPath $RepoRoot)) {
  throw "RepoRoot not found: $RepoRoot"
}
$script:RepoRootResolved = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location -LiteralPath $script:RepoRootResolved

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$script:RunDir = Join-Path $script:RepoRootResolved "tools\registry\runs\${timestamp}_deep_diagnose_${Branch}"
$script:LogsDir = Join-Path $script:RunDir 'logs'
New-Item -ItemType Directory -Force -Path $script:LogsDir | Out-Null
$transcriptPath = Join-Path $script:RunDir 'transcript.txt'
Start-Transcript -Path $transcriptPath -Force | Out-Null

$script:Findings = New-Object System.Collections.Generic.List[object]
$script:Commands = New-Object System.Collections.Generic.List[object]

try {
  Add-Finding -Area 'META' -Check 'scope' -Status 'INFO' -Severity 'LOW' -Message 'Deep diagnostic started for four mobile apps and control-panel.' -Evidence $script:RunDir

  # Toolchain
  foreach ($tool in @('git','node','pnpm','go','docker')) {
    $cmd = Get-Command $tool -ErrorAction SilentlyContinue
    if ($cmd) { Add-Finding -Area 'TOOLCHAIN' -Check $tool -Status 'PASS' -Severity 'LOW' -Message "Found: $($cmd.Source)" }
    else { Add-Finding -Area 'TOOLCHAIN' -Check $tool -Status 'FAIL' -Severity 'HIGH' -Message "$tool was not found in PATH." -Recommendation "Install or add $tool to PATH before running deep gates." }
  }

  # Git branch and freshness
  $script:Commands.Add((Invoke-LoggedCommand -Name 'git-status-porcelain' -Command 'git status --porcelain=v1')) | Out-Null
  $inside = (& git rev-parse --is-inside-work-tree 2>$null).Trim()
  if ($inside -eq 'true') { Add-Finding -Area 'GIT' -Check 'inside-work-tree' -Status 'PASS' -Severity 'LOW' -Message 'Current path is inside Git work tree.' }
  else { Add-Finding -Area 'GIT' -Check 'inside-work-tree' -Status 'FAIL' -Severity 'CRITICAL' -Message 'Current path is not inside a Git work tree.' }

  $script:Commands.Add((Invoke-LoggedCommand -Name "git-fetch-origin-$Branch" -Command "git fetch origin $Branch --prune" -SeverityOnFail 'HIGH')) | Out-Null
  $currentBranch = (& git branch --show-current).Trim()
  if ($currentBranch -eq $Branch) { Add-Finding -Area 'GIT' -Check 'current-branch' -Status 'PASS' -Severity 'LOW' -Message "Current branch is $Branch." }
  else { Add-Finding -Area 'GIT' -Check 'current-branch' -Status 'FAIL' -Severity 'CRITICAL' -Message "Current branch is '$currentBranch', expected '$Branch'." -Recommendation "Run: git switch $Branch" }

  $head = (& git rev-parse HEAD).Trim()
  $originHead = (& git rev-parse "origin/$Branch" 2>$null).Trim()
  if ($head -eq $originHead) { Add-Finding -Area 'GIT' -Check 'head-equals-origin' -Status 'PASS' -Severity 'LOW' -Message "HEAD matches origin/$Branch ($head)." }
  else { Add-Finding -Area 'GIT' -Check 'head-equals-origin' -Status 'FAIL' -Severity 'CRITICAL' -Message "HEAD ($head) differs from origin/$Branch ($originHead)." -Recommendation "Commit/push or reset intentionally before readiness diagnosis." }

  $dirty = (& git status --porcelain=v1) -join [Environment]::NewLine
  if ([string]::IsNullOrWhiteSpace($dirty)) { Add-Finding -Area 'GIT' -Check 'working-tree-clean' -Status 'PASS' -Severity 'LOW' -Message 'Working tree is clean.' }
  else { Add-Finding -Area 'GIT' -Check 'working-tree-clean' -Status 'WARN' -Severity 'HIGH' -Message 'Working tree has local changes; GitHub state and local diagnosis may differ.' -Evidence $dirty }

  $script:Commands.Add((Invoke-LoggedCommand -Name 'git-diff-check' -Command 'git diff --check' -SeverityOnFail 'HIGH')) | Out-Null
  $script:Commands.Add((Invoke-LoggedCommand -Name 'git-diff-name-status-main-realtest' -Command 'git diff --name-status origin/main...origin/realtest' -SeverityOnFail 'LOW' -Required:$false)) | Out-Null

  # Workspace and root scripts
  $workspace = Join-Path $script:RepoRootResolved 'pnpm-workspace.yaml'
  if (Test-Path $workspace) { Add-Finding -Area 'WORKSPACE' -Check 'pnpm-workspace' -Status 'PASS' -Severity 'LOW' -Message 'pnpm-workspace.yaml exists.' -Evidence $workspace }
  else { Add-Finding -Area 'WORKSPACE' -Check 'pnpm-workspace' -Status 'FAIL' -Severity 'CRITICAL' -Message 'pnpm-workspace.yaml missing.' }

  $rootPkgPath = Join-Path $script:RepoRootResolved 'package.json'
  $rootPkg = $null
  if (Test-Path $rootPkgPath) {
    $rootPkg = Get-Content -LiteralPath $rootPkgPath -Raw | ConvertFrom-Json
    Add-Finding -Area 'WORKSPACE' -Check 'root-package-json' -Status 'PASS' -Severity 'LOW' -Message 'Root package.json exists.'
    foreach ($scriptName in @('build:surfaces','serve:surfaces','guard:no-broken-imports','guard:platform-vars','guard:service-runtime:dsh')) {
      if ($rootPkg.scripts.PSObject.Properties.Name -contains $scriptName) { Add-Finding -Area 'WORKSPACE' -Check "root-script-$scriptName" -Status 'PASS' -Severity 'LOW' -Message "Script exists: $scriptName" }
      else { Add-Finding -Area 'WORKSPACE' -Check "root-script-$scriptName" -Status 'WARN' -Severity 'MEDIUM' -Message "Script missing: $scriptName" }
    }
  } else {
    Add-Finding -Area 'WORKSPACE' -Check 'root-package-json' -Status 'FAIL' -Severity 'CRITICAL' -Message 'Root package.json missing.'
  }

  $surfaces = @(
    @{ name='app-client'; path='app-client/runtime'; kind='mobile'; requiredScripts=@('dev','config','android') },
    @{ name='app-partner'; path='app-partner/runtime'; kind='mobile'; requiredScripts=@('dev','config','android') },
    @{ name='app-captain'; path='app-captain/runtime'; kind='mobile'; requiredScripts=@('dev','config','android') },
    @{ name='app-field'; path='app-field/runtime'; kind='mobile'; requiredScripts=@('dev','config','android') },
    @{ name='control-panel'; path='control-panel/runtime'; kind='web'; requiredScripts=@('dev','build','start') }
  )

  foreach ($surface in $surfaces) {
    $pkgPath = Join-Path $script:RepoRootResolved (Join-Path $surface.path 'package.json')
    if (-not (Test-Path -LiteralPath $pkgPath)) {
      Add-Finding -Area 'SURFACE' -Check "$($surface.name)-package" -Status 'FAIL' -Severity 'CRITICAL' -Message "Missing package.json for $($surface.name)." -Evidence $pkgPath
      continue
    }
    $pkg = Get-Content -LiteralPath $pkgPath -Raw | ConvertFrom-Json
    Add-Finding -Area 'SURFACE' -Check "$($surface.name)-package" -Status 'PASS' -Severity 'LOW' -Message "package.json exists for $($surface.name)." -Evidence $pkgPath
    foreach ($s in $surface.requiredScripts) {
      if ($pkg.scripts.PSObject.Properties.Name -contains $s) { Add-Finding -Area 'SURFACE' -Check "$($surface.name)-script-$s" -Status 'PASS' -Severity 'LOW' -Message "Script exists: $s" }
      else { Add-Finding -Area 'SURFACE' -Check "$($surface.name)-script-$s" -Status 'FAIL' -Severity 'HIGH' -Message "Required script missing: $s" }
    }
    if ($pkg.PSObject.Properties.Name -contains '$schema') {
      $schemaValue = $pkg.'$schema'
      $schemaPath = Join-Path (Split-Path -Parent $pkgPath) $schemaValue
      if (Test-Path -LiteralPath $schemaPath) { Add-Finding -Area 'SURFACE' -Check "$($surface.name)-schema-path" -Status 'PASS' -Severity 'LOW' -Message "Schema path resolves: $schemaValue" }
      else { Add-Finding -Area 'SURFACE' -Check "$($surface.name)-schema-path" -Status 'FAIL' -Severity 'MEDIUM' -Message "Schema path does not resolve: $schemaValue" -Evidence $schemaPath -Recommendation 'Fix $schema relative path before relying on package validation.' }
    }
    if ($surface.name -eq 'app-field' -and (($pkg.scripts.dev | Out-String) -match '__BTHWANI_PLACEHOLDER__')) {
      Add-Finding -Area 'SURFACE' -Check 'app-field-placeholder-token' -Status 'WARN' -Severity 'MEDIUM' -Message 'app-field dev script contains TOKEN placeholder.' -Recommendation 'Remove placeholder env unless a real runtime contract requires it.'
    }
  }

  # tsconfig quality
  $rootTsconfig = Join-Path $script:RepoRootResolved 'tsconfig.json'
  if (Test-Path $rootTsconfig) {
    $ts = Get-Content -LiteralPath $rootTsconfig -Raw | ConvertFrom-Json
    $refsCount = if ($ts.PSObject.Properties.Name -contains 'references' -and $ts.references) { @($ts.references).Count } else { 0 }
    $includeCount = if ($ts.PSObject.Properties.Name -contains 'include' -and $ts.include) { @($ts.include).Count } else { 0 }
    $filesCount = if ($ts.PSObject.Properties.Name -contains 'files' -and $ts.files) { @($ts.files).Count } else { 0 }
    if (($refsCount + $includeCount + $filesCount) -eq 0) {
      Add-Finding -Area 'TYPESCRIPT' -Check 'root-tsconfig-coverage' -Status 'FAIL' -Severity 'HIGH' -Message 'Root tsconfig has empty files/include/references; root tsc cannot prove workspace correctness.' -Evidence $rootTsconfig -Recommendation 'Use per-project tsconfig checks or add project references.'
    } else {
      Add-Finding -Area 'TYPESCRIPT' -Check 'root-tsconfig-coverage' -Status 'PASS' -Severity 'LOW' -Message 'Root tsconfig has coverage entries.'
    }
  }

  $tscOutputs = Get-ChildItem -LiteralPath $script:RepoRootResolved -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^tsc_output.*\.txt$' -and $_.FullName -notmatch '\\node_modules\\' }
  if ($tscOutputs.Count -gt 0) {
    Add-Finding -Area 'TYPESCRIPT' -Check 'tracked-tsc-output-files' -Status 'FAIL' -Severity 'HIGH' -Message "Found $($tscOutputs.Count) tsc_output*.txt artifacts in repo." -Evidence (($tscOutputs | Select-Object -ExpandProperty FullName) -join [Environment]::NewLine) -Recommendation 'Remove stale compiler output files from Git or replace with current evidence under tools/registry/runs.'
  } else {
    Add-Finding -Area 'TYPESCRIPT' -Check 'tracked-tsc-output-files' -Status 'PASS' -Severity 'LOW' -Message 'No tsc_output*.txt files found.'
  }

  if ($RunTypeScript) {
    $tsconfigs = Get-ChildItem -LiteralPath $script:RepoRootResolved -Recurse -File -Filter 'tsconfig.json' -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -notmatch '\\(node_modules|\.next|android|ios|dist|build|coverage|test-results)\\' }
    foreach ($cfg in $tsconfigs) {
      if ($cfg.FullName -eq $rootTsconfig) { continue }
      $rel = Resolve-Path -LiteralPath $cfg.FullName -Relative
      $script:Commands.Add((Invoke-LoggedCommand -Name "tsc-$rel" -Command "pnpm exec tsc -p `"$rel`" --noEmit --pretty false" -SeverityOnFail 'HIGH')) | Out-Null
    }
  } else { Add-Finding -Area 'TYPESCRIPT' -Check 'tsc-execution' -Status 'SKIP' -Severity 'MEDIUM' -Message 'RunTypeScript=false.' }

  if ($RunExpoConfig) {
    foreach ($surface in $surfaces | Where-Object { $_.kind -eq 'mobile' }) {
      $script:Commands.Add((Invoke-LoggedCommand -Name "expo-config-$($surface.name)" -Command "pnpm --dir $($surface.path) exec expo config --json" -SeverityOnFail 'HIGH')) | Out-Null
    }
  } else { Add-Finding -Area 'MOBILE' -Check 'expo-config' -Status 'SKIP' -Severity 'MEDIUM' -Message 'RunExpoConfig=false.' }

  if ($RunBuild) {
    $script:Commands.Add((Invoke-LoggedCommand -Name 'control-panel-build' -Command 'pnpm --dir control-panel/runtime build' -SeverityOnFail 'CRITICAL')) | Out-Null
  } else { Add-Finding -Area 'BUILD' -Check 'control-panel-build' -Status 'SKIP' -Severity 'HIGH' -Message 'RunBuild=false.' }

  if ($RunGoTests) {
    foreach ($svc in @('dsh/backend','wlt/backend','auth/backend')) {
      $svcPath = Join-Path $script:RepoRootResolved $svc
      if (Test-Path -LiteralPath $svcPath) {
        $script:Commands.Add((Invoke-LoggedCommand -Name "go-test-$svc" -Command 'go test ./...' -WorkDir $svcPath -SeverityOnFail 'CRITICAL')) | Out-Null
      } else {
        Add-Finding -Area 'GO' -Check "go-test-$svc" -Status 'SKIP' -Severity 'MEDIUM' -Message "Service path not found: $svc"
      }
    }
  }

  if ($RunDocker) {
    $composeFiles = Get-ChildItem -LiteralPath $script:RepoRootResolved -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -match '^docker-compose.*\.ya?ml$' -and $_.FullName -notmatch '\\node_modules\\' }
    foreach ($cf in $composeFiles) {
      $rel = Resolve-Path -LiteralPath $cf.FullName -Relative
      $script:Commands.Add((Invoke-LoggedCommand -Name "docker-compose-config-$rel" -Command "docker compose -f `"$rel`" config" -SeverityOnFail 'HIGH')) | Out-Null
    }
  }

  if ($RunGuards -and $rootPkg) {
    $guardScripts = @(
      'guard:no-broken-imports',
      'guard:platform-vars',
      'guard:surface-lightweight-bindings',
      'guard:service-runtime:dsh',
      'guard:service-postgres-runtime',
      'guard:service-go-runtime',
      'guard:binding-proof',
      'guard:control-panel-sections'
    )
    foreach ($g in $guardScripts) {
      if ($rootPkg.scripts.PSObject.Properties.Name -contains $g) {
        $script:Commands.Add((Invoke-LoggedCommand -Name "pnpm-run-$g" -Command "pnpm run $g" -SeverityOnFail 'HIGH')) | Out-Null
      } else {
        Add-Finding -Area 'GUARDS' -Check $g -Status 'WARN' -Severity 'MEDIUM' -Message "Guard script not present in package.json."
      }
    }
    $guardRuntime = Join-Path $script:RepoRootResolved 'tools/guards/guard-service-runtime.mjs'
    if (Test-Path $guardRuntime) {
      $script:Commands.Add((Invoke-LoggedCommand -Name 'guard-service-runtime-wlt' -Command 'node tools/guards/guard-service-runtime.mjs --service wlt' -SeverityOnFail 'HIGH')) | Out-Null
    }
  }

  if ($RunStatic) {
    # Checkout -> order contract
    $ordersApi = Join-Path $script:RepoRootResolved 'dsh/frontend/shared/orders/orders.api.ts'
    $orderDomain = Join-Path $script:RepoRootResolved 'dsh/domain/order.go'
    $orderHandler = Join-Path $script:RepoRootResolved 'dsh/backend/internal/http/orders_handler.go'
    $checkoutVm = Join-Path $script:RepoRootResolved 'dsh/frontend/shared/checkout/checkout.view-model.ts'
    $ordersApiText = Read-TextOrEmpty $ordersApi
    $domainText = Read-TextOrEmpty $orderDomain
    $handlerText = Read-TextOrEmpty $orderHandler
    $checkoutText = Read-TextOrEmpty $checkoutVm
    $backendRequiresIntent = ($domainText -match 'CheckoutIntentID\s+string\s+`json:"checkout_intent_id"' -or $handlerText -match 'checkout_intent_id is required')
    $frontendTypeHasIntent = ($ordersApiText -match 'checkout_intent_id')
    $frontendSendsIntent = ($checkoutText -match 'checkout_intent_id\s*:\s*intentId')
    if ($backendRequiresIntent -and -not $frontendTypeHasIntent) {
      Add-Finding -Area 'CONTRACT' -Check 'checkout-order-create-contract' -Status 'FAIL' -Severity 'CRITICAL' -Message 'Backend requires checkout_intent_id but DshCreateOrderRequest type does not expose it.' -Evidence "$ordersApi`n$orderDomain`n$orderHandler" -Recommendation 'Add checkout_intent_id to DshCreateOrderRequest and rerun TypeScript/build.'
    } elseif ($backendRequiresIntent -and -not $frontendSendsIntent) {
      Add-Finding -Area 'CONTRACT' -Check 'checkout-order-create-payload' -Status 'FAIL' -Severity 'CRITICAL' -Message 'Backend requires checkout_intent_id but checkout createOrder payload was not proven to send it.' -Evidence $checkoutVm
    } else {
      Add-Finding -Area 'CONTRACT' -Check 'checkout-order-create-contract' -Status 'PASS' -Severity 'LOW' -Message 'checkout_intent_id contract appears aligned between frontend payload and backend requirement.'
    }

    # WLT env alias
    $wltClient = Join-Path $script:RepoRootResolved 'wlt/frontend/dsh/contracts/wlt-dsh-client.ts'
    $wltText = Read-TextOrEmpty $wltClient
    $infraEnv = Join-Path $script:RepoRootResolved 'infra/local/env/.env.local.example'
    $controlEnv = Join-Path $script:RepoRootResolved 'control-panel/runtime/.env.example'
    $envText = (Read-TextOrEmpty $infraEnv) + "`n" + (Read-TextOrEmpty $controlEnv)
    $envUsesWltApiBase = $envText -match 'NEXT_PUBLIC_WLT_API_BASE_URL|EXPO_PUBLIC_WLT_API_BASE_URL'
    $clientReadsAlias = $wltText -match 'NEXT_PUBLIC_WLT_API_BASE_URL|EXPO_PUBLIC_WLT_API_BASE_URL'
    if ($envUsesWltApiBase -and -not $clientReadsAlias) {
      Add-Finding -Area 'ENV' -Check 'wlt-public-base-url-alias' -Status 'FAIL' -Severity 'HIGH' -Message 'Env examples use NEXT_PUBLIC_WLT_API_BASE_URL but WLT client does not read that alias.' -Evidence "$wltClient`n$infraEnv`n$controlEnv" -Recommendation 'Add WLT_DSH aliases to env examples or update client to read existing alias safely.'
    } else {
      Add-Finding -Area 'ENV' -Check 'wlt-public-base-url-alias' -Status 'PASS' -Severity 'LOW' -Message 'WLT public base URL naming appears aligned or alias supported.'
    }

    # Auth env
    $allTs = Get-ChildItem -LiteralPath $script:RepoRootResolved -Recurse -File -Include *.ts,*.tsx,*.js,*.mjs -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -notmatch '\\(node_modules|\.next|dist|build|coverage)\\' }
    $authApiEnvUsages = Select-String -Path ($allTs.FullName) -Pattern 'AUTH_API_BASE_URL' -SimpleMatch -ErrorAction SilentlyContinue
    $authBaseUsages = Select-String -Path ($allTs.FullName) -Pattern 'AUTH_BASE_URL' -SimpleMatch -ErrorAction SilentlyContinue
    if ($authApiEnvUsages.Count -gt 0 -and $authBaseUsages.Count -gt 0) {
      Add-Finding -Area 'ENV' -Check 'auth-env-alias-mixed' -Status 'WARN' -Severity 'MEDIUM' -Message 'Both AUTH_API_BASE_URL and AUTH_BASE_URL patterns appear in source; verify aliases intentionally.' -Evidence (($authApiEnvUsages | Select-Object -First 20 | Out-String))
    } elseif ($authBaseUsages.Count -gt 0) {
      Add-Finding -Area 'ENV' -Check 'auth-env-alias' -Status 'PASS' -Severity 'LOW' -Message 'AUTH_BASE_URL pattern found in source.'
    } else {
      Add-Finding -Area 'ENV' -Check 'auth-env-alias' -Status 'WARN' -Severity 'HIGH' -Message 'No AUTH_BASE_URL usage found in source scan.'
    }

    # Provider Center runtime binding
    $providerWorkspace = Join-Path $script:RepoRootResolved 'dsh/frontend/control-panel/platform/Providers/DshPlatformProvidersWorkspace.tsx'
    $providerText = Read-TextOrEmpty $providerWorkspace
    $hasPreviewProviders = $providerText -match 'PREVIEW_PROVIDER_RECORDS|ProviderPreviewActionId|preview|محاكاة'
    $backendProviderRoutes = Select-String -Path ($allTs.FullName + (Get-ChildItem -LiteralPath $script:RepoRootResolved -Recurse -File -Include *.go -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\(node_modules|vendor)\\' }).FullName) -Pattern '/platform/providers' -SimpleMatch -ErrorAction SilentlyContinue
    if ($hasPreviewProviders -and ($backendProviderRoutes.Count -eq 0)) {
      Add-Finding -Area 'PROVIDER_CENTER' -Check 'runtime-provider-binding' -Status 'FAIL' -Severity 'CRITICAL' -Message 'Provider Center is preview/local-state and no backend /platform/providers routes were found.' -Evidence $providerWorkspace -Recommendation 'Implement Provider Registry/API/Adapters/Simulator before realistic provider testing.'
    } elseif ($backendProviderRoutes.Count -gt 0) {
      Add-Finding -Area 'PROVIDER_CENTER' -Check 'runtime-provider-binding' -Status 'PASS' -Severity 'LOW' -Message 'Backend provider routes found.' -Evidence (($backendProviderRoutes | Select-Object -First 20 | Out-String))
    } else {
      Add-Finding -Area 'PROVIDER_CENTER' -Check 'runtime-provider-binding' -Status 'WARN' -Severity 'HIGH' -Message 'Provider Center backend binding not proven.'
    }

    $requiredCaps = @('SMS_PROVIDER','MAPS_PROVIDER','PAYMENT_PROVIDER','PUSH_PROVIDER','EMAIL_PROVIDER','STORAGE_PROVIDER','SEARCH_PROVIDER','FRAUD_PROVIDER')
    $sourceTextSample = ($allTs | ForEach-Object { Read-TextOrEmpty $_.FullName }) -join "`n"
    foreach ($cap in $requiredCaps) {
      if ($sourceTextSample -match [regex]::Escape($cap)) { Add-Finding -Area 'PROVIDER_CENTER' -Check "capability-$cap" -Status 'PASS' -Severity 'LOW' -Message "$cap found in source." }
      else { Add-Finding -Area 'PROVIDER_CENTER' -Check "capability-$cap" -Status 'FAIL' -Severity 'HIGH' -Message "$cap not found in source." -Recommendation 'Add provider capability enum and UI/backend support.' }
    }

    # Public secret exposure check
    $publicSecretHits = Select-String -Path ($allTs.FullName) -Pattern 'NEXT_PUBLIC_.*(SECRET|TOKEN|KEY)|EXPO_PUBLIC_.*(SECRET|TOKEN|KEY)' -ErrorAction SilentlyContinue
    if ($publicSecretHits.Count -gt 0) {
      Add-Finding -Area 'SECURITY' -Check 'public-secret-env-patterns' -Status 'FAIL' -Severity 'CRITICAL' -Message 'Public env secret/key/token patterns found.' -Evidence (($publicSecretHits | Select-Object -First 50 | Out-String)) -Recommendation 'Move secrets server-side and expose only secret_ref/masked values.'
    } else {
      Add-Finding -Area 'SECURITY' -Check 'public-secret-env-patterns' -Status 'PASS' -Severity 'LOW' -Message 'No public SECRET/TOKEN/KEY patterns found in TS/JS scan.'
    }

    # CI trigger coverage for realtest
    $workflowFiles = Get-ChildItem -LiteralPath (Join-Path $script:RepoRootResolved '.github/workflows') -File -Include *.yml,*.yaml -ErrorAction SilentlyContinue
    $realtestInWorkflow = $false
    foreach ($wf in $workflowFiles) { if ((Read-TextOrEmpty $wf.FullName) -match [regex]::Escape($Branch)) { $realtestInWorkflow = $true } }
    if ($realtestInWorkflow) { Add-Finding -Area 'CI' -Check 'realtest-trigger' -Status 'PASS' -Severity 'LOW' -Message 'At least one workflow mentions realtest.' }
    else { Add-Finding -Area 'CI' -Check 'realtest-trigger' -Status 'WARN' -Severity 'HIGH' -Message 'No workflow appears to trigger explicitly on realtest.' -Recommendation 'Open PR from realtest or add branch trigger before claiming CI proof.' }
  }

  # Write machine-readable results
  $failCount = @($script:Findings | Where-Object { $_.status -in @('FAIL','BLOCKED') }).Count
  $warnCount = @($script:Findings | Where-Object { $_.status -eq 'WARN' }).Count
  $passCount = @($script:Findings | Where-Object { $_.status -eq 'PASS' }).Count
  $decision = if ($failCount -gt 0) { 'FIX_REQUIRED' } elseif ($warnCount -gt 0) { 'CONDITIONAL_WARNINGS' } else { 'DIAGNOSTIC_PASS' }
  $readiness = if ($failCount -gt 0) { 'BLOCKED' } elseif ($warnCount -gt 0) { 'NOT_PROVEN' } else { 'READY_FOR_CONTROLLED_REALISTIC_E2E' }
  $summary = [pscustomobject]@{
    repoRoot = $script:RepoRootResolved
    branch = $Branch
    head = $head
    originHead = $originHead
    runDir = $script:RunDir
    decision = $decision
    readiness = $readiness
    counts = [pscustomobject]@{ pass=$passCount; warn=$warnCount; failOrBlocked=$failCount; total=$script:Findings.Count }
    generatedAt = (Get-Date).ToString('o')
    findings = $script:Findings
    commands = $script:Commands
  }
  $jsonPath = Join-Path $script:RunDir 'diagnostic-results.json'
  $summary | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $jsonPath -Encoding UTF8

  $md = New-Object System.Text.StringBuilder
  [void]$md.AppendLine("# BTHWANI Deep Diagnosis — $Branch")
  [void]$md.AppendLine("")
  [void]$md.AppendLine("- Decision: **$decision**")
  [void]$md.AppendLine("- Readiness: **$readiness**")
  [void]$md.AppendLine("- PASS: $passCount")
  [void]$md.AppendLine("- WARN: $warnCount")
  [void]$md.AppendLine("- FAIL/BLOCKED: $failCount")
  [void]$md.AppendLine("- Evidence: $($script:RunDir)")
  [void]$md.AppendLine("")
  [void]$md.AppendLine("## Blocking findings")
  foreach ($f in $script:Findings | Where-Object { $_.status -in @('FAIL','BLOCKED') }) {
    [void]$md.AppendLine("- **[$($f.severity)] $($f.area) / $($f.check):** $($f.message)")
    if ($f.recommendation) { [void]$md.AppendLine("  - Fix: $($f.recommendation)") }
    if ($f.evidence) { [void]$md.AppendLine("  - Evidence: $($f.evidence)") }
  }
  [void]$md.AppendLine("")
  [void]$md.AppendLine("## Warnings")
  foreach ($f in $script:Findings | Where-Object { $_.status -eq 'WARN' }) {
    [void]$md.AppendLine("- **[$($f.severity)] $($f.area) / $($f.check):** $($f.message)")
  }
  $mdPath = Join-Path $script:RunDir 'diagnostic-summary.md'
  Write-Utf8File $mdPath $md.ToString()

  $execInputPath = Join-Path $script:RunDir 'execution-input.json'
  ($script:Findings | Where-Object { $_.status -in @('FAIL','BLOCKED','WARN') } | ConvertTo-Json -Depth 8) | Set-Content -LiteralPath $execInputPath -Encoding UTF8

  Write-Host "`n=== FINAL DIAGNOSTIC DECISION ==="
  Write-Host "Decision : $decision"
  Write-Host "Readiness: $readiness"
  Write-Host "Evidence : $script:RunDir"
  Write-Host "JSON     : $jsonPath"
  Write-Host "Summary  : $mdPath"

  if ($OpenReport) { Invoke-Item $mdPath }
  if ($ExitNonZero -and $failCount -gt 0) { exit 2 }
  exit 0
}
finally {
  Stop-Transcript | Out-Null
}
