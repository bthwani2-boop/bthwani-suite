<#
BTHWANI_DEEP_EXECUTE_FROM_DIAG.ps1
Consumes diagnostic-results.json from BTHWANI_DEEP_DIAGNOSE_REALTEST.ps1.
Applies only deterministic safe fixes by default. Large architecture work such as Provider Center is reported as BLOCKED_FOR_MANUAL_IMPLEMENTATION unless -ScaffoldProviderCenter is used.
#>
[CmdletBinding(SupportsShouldProcess=$true)]
param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [string]$Branch = "realtest",
  [Parameter(Mandatory=$true)][string]$DiagnosticJson,
  [switch]$ApplySafeFixes,
  [switch]$ScaffoldProviderCenter,
  [switch]$RunPostChecks,
  [switch]$Commit
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Utf8File([string]$Path, [string]$Content) {
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}
function Read-TextOrEmpty([string]$Path) { if (Test-Path -LiteralPath $Path) { return [System.IO.File]::ReadAllText($Path) }; return "" }
function Add-Step([string]$Name,[string]$Status,[string]$Message,[string]$Evidence='') {
  $script:Steps.Add([pscustomobject]@{ name=$Name; status=$Status; message=$Message; evidence=$Evidence }) | Out-Null
  Write-Host "[$Status] $Name - $Message"
}
function Replace-TextSafe([string]$Path,[string]$Old,[string]$New,[string]$StepName) {
  $text = Read-TextOrEmpty $Path
  if (-not $text) { Add-Step $StepName 'SKIP' "File not found or empty: $Path"; return $false }
  if ($text.Contains($New)) { Add-Step $StepName 'PASS' "Already applied: $Path"; return $false }
  if (-not $text.Contains($Old)) { Add-Step $StepName 'BLOCKED' "Expected exact pattern not found: $Path"; return $false }
  if ($ApplySafeFixes) {
    Write-Utf8File $Path ($text.Replace($Old,$New))
    Add-Step $StepName 'APPLIED' "Updated: $Path" $Path
    return $true
  } else {
    Add-Step $StepName 'DRY_RUN' "Would update: $Path" $Path
    return $false
  }
}

if (-not (Test-Path -LiteralPath $RepoRoot)) { throw "RepoRoot not found: $RepoRoot" }
$script:RepoRootResolved = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location -LiteralPath $script:RepoRootResolved

if (-not (Test-Path -LiteralPath $DiagnosticJson)) { throw "DiagnosticJson not found: $DiagnosticJson" }
$diag = Get-Content -LiteralPath $DiagnosticJson -Raw | ConvertFrom-Json

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$script:RunDir = Join-Path $script:RepoRootResolved "tools\registry\runs\${timestamp}_deep_execute_${Branch}"
New-Item -ItemType Directory -Force -Path $script:RunDir | Out-Null
$script:Steps = New-Object System.Collections.Generic.List[object]
Start-Transcript -Path (Join-Path $script:RunDir 'transcript.txt') -Force | Out-Null

try {
  $currentBranch = (& git branch --show-current).Trim()
  if ($currentBranch -ne $Branch) { Add-Step 'branch-check' 'BLOCKED' "Current branch is '$currentBranch', expected '$Branch'. Stop execution."; throw "Wrong branch" }
  Add-Step 'branch-check' 'PASS' "Current branch is $Branch."

  $dirtyBefore = (& git status --porcelain=v1) -join [Environment]::NewLine
  if ($dirtyBefore) { Add-Step 'dirty-before' 'WARN' 'Working tree has changes before execution. Review carefully.' $dirtyBefore }
  else { Add-Step 'dirty-before' 'PASS' 'Working tree clean before execution.' }

  # 1) Safe fix: frontend order contract type must include checkout_intent_id.
  $ordersApi = Join-Path $script:RepoRootResolved 'dsh/frontend/shared/orders/orders.api.ts'
  $oldOrderType = @"
export type DshCreateOrderRequest = {
  readonly store_id: string;
  readonly client_id?: string;
  readonly total_price: number;
  readonly wlt_payment_ref_id?: string;
  readonly items: readonly DshOrderItemInput[];
};
"@
  $newOrderType = @"
export type DshCreateOrderRequest = {
  readonly store_id: string;
  readonly client_id?: string;
  readonly total_price: number;
  readonly wlt_payment_ref_id?: string;
  readonly checkout_intent_id: string;
  readonly items: readonly DshOrderItemInput[];
};
"@
  [void](Replace-TextSafe -Path $ordersApi -Old $oldOrderType -New $newOrderType -StepName 'fix-checkout-intent-type')

  # 2) Safe fix: WLT client must support both canonical and existing env aliases.
  $wltClient = Join-Path $script:RepoRootResolved 'wlt/frontend/dsh/contracts/wlt-dsh-client.ts'
  $oldWltRaw = @"
		const raw =
			env?.NEXT_PUBLIC_WLT_DSH_API_BASE_URL ??
			env?.EXPO_PUBLIC_WLT_DSH_API_BASE_URL;
"@
  $newWltRaw = @"
		const raw =
			env?.NEXT_PUBLIC_WLT_DSH_API_BASE_URL ??
			env?.NEXT_PUBLIC_WLT_API_BASE_URL ??
			env?.EXPO_PUBLIC_WLT_DSH_API_BASE_URL ??
			env?.EXPO_PUBLIC_WLT_API_BASE_URL;
"@
  [void](Replace-TextSafe -Path $wltClient -Old $oldWltRaw -New $newWltRaw -StepName 'fix-wlt-env-aliases')

  # 3) Safe fix: env examples include canonical WLT_DSH public variables and Auth public variables.
  $infraEnv = Join-Path $script:RepoRootResolved 'infra/local/env/.env.local.example'
  $infraText = Read-TextOrEmpty $infraEnv
  if ($infraText) {
    $changed = $false
    if ($infraText -notmatch 'NEXT_PUBLIC_WLT_DSH_API_BASE_URL') {
      $infraText = $infraText -replace 'NEXT_PUBLIC_WLT_API_BASE_URL=http://localhost:18083', "NEXT_PUBLIC_WLT_API_BASE_URL=http://localhost:18083`nNEXT_PUBLIC_WLT_DSH_API_BASE_URL=http://localhost:18083"
      $changed = $true
    }
    if ($infraText -notmatch 'EXPO_PUBLIC_WLT_DSH_API_BASE_URL') {
      $infraText = $infraText -replace 'EXPO_PUBLIC_DSH_API_BASE_URL=http://localhost:8080', "EXPO_PUBLIC_DSH_API_BASE_URL=http://localhost:8080`nEXPO_PUBLIC_WLT_DSH_API_BASE_URL=http://localhost:18083"
      $changed = $true
    }
    if ($infraText -notmatch 'NEXT_PUBLIC_AUTH_BASE_URL') {
      $infraText = $infraText -replace 'NEXT_PUBLIC_DSH_API_BASE_URL=http://localhost:8080', "NEXT_PUBLIC_DSH_API_BASE_URL=http://localhost:8080`nNEXT_PUBLIC_AUTH_BASE_URL=http://localhost:18082"
      $changed = $true
    }
    if ($infraText -notmatch 'EXPO_PUBLIC_AUTH_BASE_URL') {
      $infraText = $infraText -replace 'EXPO_PUBLIC_DSH_API_BASE_URL=http://localhost:8080', "EXPO_PUBLIC_DSH_API_BASE_URL=http://localhost:8080`nEXPO_PUBLIC_AUTH_BASE_URL=http://localhost:18082"
      $changed = $true
    }
    if ($changed -and $ApplySafeFixes) { Write-Utf8File $infraEnv $infraText; Add-Step 'fix-infra-env-example' 'APPLIED' 'Updated infra local env example.' $infraEnv }
    elseif ($changed) { Add-Step 'fix-infra-env-example' 'DRY_RUN' 'Would update infra local env example.' $infraEnv }
    else { Add-Step 'fix-infra-env-example' 'PASS' 'Env example already contains expected aliases.' $infraEnv }
  }

  $controlEnv = Join-Path $script:RepoRootResolved 'control-panel/runtime/.env.example'
  $controlText = Read-TextOrEmpty $controlEnv
  if ($controlText) {
    $changed = $false
    if ($controlText -notmatch 'NEXT_PUBLIC_AUTH_BASE_URL') { $controlText += "`nNEXT_PUBLIC_AUTH_BASE_URL=http://localhost:18082`n"; $changed = $true }
    if ($controlText -notmatch 'NEXT_PUBLIC_WLT_DSH_API_BASE_URL') { $controlText += "NEXT_PUBLIC_WLT_DSH_API_BASE_URL=http://localhost:18083`n"; $changed = $true }
    if ($changed -and $ApplySafeFixes) { Write-Utf8File $controlEnv $controlText; Add-Step 'fix-control-panel-env-example' 'APPLIED' 'Updated control-panel env example.' $controlEnv }
    elseif ($changed) { Add-Step 'fix-control-panel-env-example' 'DRY_RUN' 'Would update control-panel env example.' $controlEnv }
    else { Add-Step 'fix-control-panel-env-example' 'PASS' 'Control-panel env example already contains expected aliases.' $controlEnv }
  }

  # 4) Safe fix: package schema relative paths for sibling mobile runtimes.
  foreach ($pkgRel in @('app-partner/runtime/package.json','app-captain/runtime/package.json','app-field/runtime/package.json')) {
    $pkgPath = Join-Path $script:RepoRootResolved $pkgRel
    [void](Replace-TextSafe -Path $pkgPath -Old '"$schema": "../../../tools/schemas/package.schema.json"' -New '"$schema": "../../tools/schemas/package.schema.json"' -StepName "fix-schema-$pkgRel")
  }

  # 5) Safe fix: app-field placeholder dev env.
  $fieldPkg = Join-Path $script:RepoRootResolved 'app-field/runtime/package.json'
  [void](Replace-TextSafe -Path $fieldPkg -Old '"dev": "TOKEN=__BTHWANI_PLACEHOLDER__ expo start --dev-client --clear"' -New '"dev": "expo start --dev-client --clear"' -StepName 'fix-app-field-dev-placeholder')

  # 6) Provider Center: not safe to silently implement full architecture. Generate exact implementation handoff.
  $providerHandoff = @"
# Provider Center Deep Execution Handoff

This is intentionally not auto-applied by the safe execution script because it requires backend models, migrations, route ownership, adapters, UI binding, audit, tests, and evidence.

Required implementation scope:
- Capability enum: SMS_PROVIDER, MAPS_PROVIDER, PAYMENT_PROVIDER, PUSH_PROVIDER, EMAIL_PROVIDER, STORAGE_PROVIDER, SEARCH_PROVIDER, FRAUD_PROVIDER.
- Provider registry model/storage: provider_id, capability, display_name, adapter_type, environment, status, priority, fallback_provider_id, secret_ref, config_json, health_status, last_health_check_at, last_error_code, last_error_message, audit fields.
- Backend APIs:
  GET    /platform/providers
  POST   /platform/providers
  PATCH  /platform/providers/{id}
  POST   /platform/providers/{id}/test-connection
  POST   /platform/providers/{id}/activate
  POST   /platform/providers/{id}/deactivate
  POST   /platform/providers/{id}/set-primary
  POST   /platform/providers/{id}/set-fallback
  POST   /platform/providers/{id}/rollback
  GET    /platform/providers/{id}/audit
  POST   /platform/providers/sandbox/scenario
- Runtime adapters/simulators: mock-sms, mock-maps, mock-payment, mock-push, mock-email, mock-storage, mock-search, mock-fraud.
- Supported scenarios: success, timeout, invalid_api_key, rate_limit, provider_down, partial_failure, duplicate_request, callback_failed, signature_invalid.
- Replace PREVIEW_PROVIDER_RECORDS/useState-only behavior in DshPlatformProvidersWorkspace.tsx with typed backend client state.
- No real API keys in DB or public env; use secret_ref and masked display only.
- Evidence: TypeScript, Go tests, Docker compose, provider simulator scenarios, control-panel screenshots, tools/registry/runs.
"@
  $providerHandoffPath = Join-Path $script:RunDir 'PROVIDER_CENTER_DEEP_EXECUTION_HANDOFF.md'
  Write-Utf8File $providerHandoffPath $providerHandoff
  Add-Step 'provider-center-handoff' 'CREATED' 'Generated deep Provider Center implementation handoff.' $providerHandoffPath

  if ($ScaffoldProviderCenter) {
    $capFile = Join-Path $script:RepoRootResolved 'dsh/frontend/control-panel/platform/Providers/provider-capabilities.ts'
    $capContent = @"
export const BTHWANI_PROVIDER_CAPABILITIES = [
  'SMS_PROVIDER',
  'MAPS_PROVIDER',
  'PAYMENT_PROVIDER',
  'PUSH_PROVIDER',
  'EMAIL_PROVIDER',
  'STORAGE_PROVIDER',
  'SEARCH_PROVIDER',
  'FRAUD_PROVIDER',
] as const;

export type BthwaniProviderCapability = typeof BTHWANI_PROVIDER_CAPABILITIES[number];

export type BthwaniProviderEnvironment = 'local' | 'sandbox' | 'staging' | 'production';
export type BthwaniProviderStatus = 'active' | 'inactive' | 'degraded' | 'failed' | 'pending_approval';
export type BthwaniProviderHealthStatus = 'not_run' | 'pass' | 'fail' | 'timeout' | 'rate_limited';
"@
    if ($ApplySafeFixes) { Write-Utf8File $capFile $capContent; Add-Step 'scaffold-provider-capabilities' 'APPLIED' 'Provider capability type scaffold created.' $capFile }
    else { Add-Step 'scaffold-provider-capabilities' 'DRY_RUN' 'Would create provider capability type scaffold.' $capFile }
  }

  if ($RunPostChecks) {
    $checks = @(
      @{ name='git-diff-check'; cmd='git diff --check' },
      @{ name='tsc-orders-api'; cmd='pnpm exec tsc -p dsh/frontend/tsconfig.json --noEmit --pretty false' },
      @{ name='control-panel-build'; cmd='pnpm --dir control-panel/runtime build' }
    )
    foreach ($c in $checks) {
      $log = Join-Path $script:RunDir ("postcheck_" + ($c.name -replace '[^a-zA-Z0-9._-]+','_') + ".log")
      $out = & pwsh -NoProfile -ExecutionPolicy Bypass -Command $c.cmd 2>&1
      $exit = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }
      Write-Utf8File $log (($out | ForEach-Object { $_.ToString() }) -join [Environment]::NewLine)
      if ($exit -eq 0) { Add-Step $c.name 'PASS' 'Post-check passed.' $log }
      else { Add-Step $c.name 'FAIL' "Post-check failed with exit code $exit." $log }
    }
  }

  $diffLog = Join-Path $script:RunDir 'git-diff.patch'
  $diff = (& git diff -- .) -join [Environment]::NewLine
  Write-Utf8File $diffLog $diff

  if ($Commit) {
    if (-not $ApplySafeFixes) { Add-Step 'commit' 'SKIP' 'Commit skipped because ApplySafeFixes was not set.' }
    else {
      & git add dsh/frontend/shared/orders/orders.api.ts wlt/frontend/dsh/contracts/wlt-dsh-client.ts infra/local/env/.env.local.example control-panel/runtime/.env.example app-partner/runtime/package.json app-captain/runtime/package.json app-field/runtime/package.json dsh/frontend/control-panel/platform/Providers/provider-capabilities.ts 2>$null
      & git commit -m 'fix: align runtime readiness contracts for deep test gates'
      if ($LASTEXITCODE -eq 0) { Add-Step 'commit' 'PASS' 'Committed safe fixes.' }
      else { Add-Step 'commit' 'WARN' 'git commit did not create a commit. Review output.' }
    }
  }

  $summary = [pscustomobject]@{
    repoRoot = $script:RepoRootResolved
    branch = $Branch
    diagnosticJson = $DiagnosticJson
    applySafeFixes = [bool]$ApplySafeFixes
    scaffoldProviderCenter = [bool]$ScaffoldProviderCenter
    runDir = $script:RunDir
    steps = $script:Steps
    generatedAt = (Get-Date).ToString('o')
  }
  $jsonOut = Join-Path $script:RunDir 'execution-results.json'
  $summary | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $jsonOut -Encoding UTF8

  $md = "# BTHWANI Deep Execution Results`n`nEvidence: `$script:RunDir``n`n"
  foreach ($s in $script:Steps) { $md += "- **[$($s.status)] $($s.name):** $($s.message) $($s.evidence)`n" }
  Write-Utf8File (Join-Path $script:RunDir 'execution-summary.md') $md

  Write-Host "`nExecution evidence: $script:RunDir"
  Write-Host "Patch diff: $diffLog"
}
finally {
  Stop-Transcript | Out-Null
}
