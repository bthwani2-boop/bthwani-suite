<#
DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2_GUARD.ps1

Role:
- Guard/support script for DSH client app-scope final standardization.
- It does NOT replace the coding agent for complex file moves/merges.
- It creates the authoritative docs/blueprint standard, scaffolds missing safe contracts, adds DSH Preferences screen if missing,
  inventories every scoped file, runs gates repeatedly, and produces an evidence ZIP.
- Use it before and after the Copilot execution prompt.

Scopes:
- dsh/frontend/app-client/**
- wlt/frontend/app-client/dsh/**
- wlt/frontend/shared/finance/**
- app-client/composition/**
- app-client/shell/**
- dsh/frontend/shared/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**

Run:
  Set-Location -LiteralPath "C:\bthwani-suite"
  powershell -ExecutionPolicy Bypass -File "C:\Users\b\Downloads\DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2_GUARD.ps1"

Options:
  -DryRun
  -SkipRuntime
  -CommitAndPush
#>

param(
  [switch]$DryRun,
  [switch]$SkipRuntime,
  [switch]$CommitAndPush,
  [int]$MaxCycles = 3
)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$SessionId = "DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2_GUARD-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

$script:Actions = @()
$script:GateRows = @()

function Step([string]$m) {
  Write-Host ""
  Write-Host "==== $m ===="
}

function Save([string]$name, [string]$value) {
  $value | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out $name)
}

function Run-Capture([string]$name, [scriptblock]$block) {
  $file = Join-Path $Out $name
  "" | Set-Content -Encoding UTF8 -LiteralPath $file
  try {
    & $block *> $file
    $code = $LASTEXITCODE
    if ($null -eq $code) { $code = 0 }
    return [pscustomobject]@{ file = $file; exitCode = $code }
  } catch {
    $_ | Out-String | Add-Content -Encoding UTF8 -LiteralPath $file
    return [pscustomobject]@{ file = $file; exitCode = 1 }
  }
}

function Read-Safe([string]$file) {
  if (Test-Path -LiteralPath $file) { return (Get-Content -LiteralPath $file -Raw) }
  return ""
}

function RepoRoot {
  return (Resolve-Path ".").Path
}

function ToRepoPath([string]$path) {
  if ([string]::IsNullOrWhiteSpace($path)) { return "" }
  $root = RepoRoot
  $full = $path
  try {
    if (Test-Path -LiteralPath $path) { $full = (Resolve-Path -LiteralPath $path).Path }
  } catch {}
  return (($full -replace [regex]::Escape($root), "").TrimStart("\","/") -replace "\\","/")
}

function FromRepoPath([string]$repoPath) {
  return Join-Path (RepoRoot) ($repoPath -replace "/", "\")
}

function IsIgnored([string]$path) {
  $p = ToRepoPath $path
  return (
    $p -match "(^|/)node_modules(/|$)" -or
    $p -match "(^|/)\.next(/|$)" -or
    $p -match "(^|/)\.expo(/|$)" -or
    $p -match "(^|/)\.turbo(/|$)" -or
    $p -match "(^|/)dist(/|$)" -or
    $p -match "(^|/)build(/|$)" -or
    $p -match "(^|/)coverage(/|$)" -or
    $p -match "(^|/)tools/registry/runs(/|$)" -or
    $p -match "(^|/)dsh/_archive(/|$)"
  )
}

function ProductFiles {
  $roots = @(
    "dsh\frontend\app-client",
    "wlt\frontend\app-client\dsh",
    "wlt\frontend\shared\finance",
    "app-client\composition",
    "app-client\shell",
    "dsh\frontend\shared"
  )
  return @(Get-ChildItem -Path $roots -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.md -File -ErrorAction SilentlyContinue |
    Where-Object { -not (IsIgnored $_.FullName) })
}

function WriteUtf8([string]$repoPath, [string]$content, [string]$action) {
  $abs = FromRepoPath $repoPath
  $old = if (Test-Path -LiteralPath $abs) { Get-Content -LiteralPath $abs -Raw } else { "" }
  if ($old -ne $content) {
    if (-not $DryRun) {
      $dir = Split-Path -Parent $abs
      New-Item -ItemType Directory -Force -Path $dir | Out-Null
      [System.IO.File]::WriteAllText($abs, $content, [System.Text.UTF8Encoding]::new($false))
    }
    $script:Actions += [pscustomobject]@{ file = $repoPath; action = $action }
  }
}

function TrimWhitespace([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return }
  $raw = Get-Content -LiteralPath $path -Raw
  $nl = if ($raw.Contains("`r`n")) { "`r`n" } else { "`n" }
  $lines = $raw -split "`r?`n"
  $clean = @($lines | ForEach-Object { $_ -replace "[ `t]+$", "" })
  while ($clean.Count -gt 0 -and $clean[$clean.Count - 1] -eq "") {
    $clean = $clean[0..($clean.Count - 2)]
  }
  $final = ($clean -join $nl) + $nl
  if ($final -ne $raw) {
    if (-not $DryRun) {
      [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $path), $final, [System.Text.UTF8Encoding]::new($false))
    }
    $script:Actions += [pscustomobject]@{ file = ToRepoPath $path; action = "trim trailing whitespace" }
  }
}

function EnsureDocsAndBlueprint {
  $section = @'
<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->
## DSH Client App-Scope Standardization

This standard closes DSH inside app-client as an integrated platform scope, not as an isolated app.

### Canonical ownership

- There is no service named `core`.
- App-owned screens use `ownerKind: 'app'` and `ownerId: 'app-client'`.
- DSH-owned screens use `ownerKind: 'service'`, `ownerId: 'dsh'`, `serviceId: 'dsh'`.
- WLT-owned DSH integration uses `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, `linkedServiceId: 'dsh'`.

### Scope rings

1. `dsh/frontend/app-client/**`
2. `wlt/frontend/app-client/dsh/**`
3. `wlt/frontend/shared/finance/**`
4. `app-client/composition/**`
5. `app-client/shell/**`
6. `dsh/frontend/shared/**`

### DSH client structure

```text
dsh/frontend/app-client/
├─ index.ts
├─ DshClientSurface.tsx
├─ dsh-client.routes.ts
├─ dsh-client.screen-registry.ts
├─ dsh-client.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/
```

### DSH preferences

DSH-specific customer delivery preferences belong to DSH client, not global account/profile:

```text
dsh/frontend/app-client/screens/PreferencesScreen.tsx
```

It covers delivery instructions, substitution preferences, address handoff behavior, notification preference within DSH, and captain contact preference. It must not contain account identity/security/wallet ownership.

### WLT-owned DSH bridge

The WLT DSH bridge is in scope because DSH checkout/payment depends on it, but it stays WLT-owned and intentionally small:

```text
wlt/frontend/app-client/dsh/
├─ index.ts
├─ WltDshClientBridge.tsx
├─ wlt-dsh-client.parts.tsx
├─ wlt-dsh-client.adapter.ts
├─ wlt-dsh-client.contract.ts
├─ wlt-dsh-client.preview-data.ts
├─ wlt-dsh-client.types.ts
└─ useWltDshWalletPreview.ts
```

If old component files still exist temporarily, they must be classified as `INTEGRATION_PART_PENDING_MERGE` and either merged into `wlt-dsh-client.parts.tsx` or retained only if TypeScript/runtime evidence proves they are required.

### Gates

- no `serviceId: 'core'`
- no Tamagui outside `ui-kit`
- no `export *`
- no `any/as any` in primary DSH client/WLT bridge/app-client shell/composition
- no deep imports between app-client/app-partner/app-captain/app-field
- no generated/cache/vendor false positives
- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit`
- runtime smoke when available

<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->
'@

  $blueprint = "dsh/SERVICE_BLUEPRINT.md"
  $old = if (Test-Path -LiteralPath (FromRepoPath $blueprint)) { Get-Content -LiteralPath (FromRepoPath $blueprint) -Raw } else { "# DSH Service Blueprint`n" }
  $new = if ($old -match "(?s)<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->.*?<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->") {
    [regex]::Replace($old, "(?s)<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->.*?<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->", $section)
  } else {
    $old.TrimEnd() + "`n`n" + $section + "`n"
  }
  WriteUtf8 $blueprint $new "upsert DSH standardization section"

  $doc = @'
# DSH Client App-Scope Standardization

## Decision

Close all DSH-related client-app scope through these rings:

1. DSH client surface: `dsh/frontend/app-client/**`
2. WLT-owned DSH bridge: `wlt/frontend/app-client/dsh/**`
3. WLT finance support used by DSH checkout: `wlt/frontend/shared/finance/**`
4. Client app composition/shell integration: `app-client/composition/**`, `app-client/shell/**`
5. DSH shared support: `dsh/frontend/shared/**`

## No `core`

Do not use `serviceId: 'core'`. General app-owned screens use:

```ts
ownerKind: 'app';
ownerId: 'app-client';
surfaceId: 'app-client';
```

## Preferences screen

DSH-specific preferences are allowed and belong here:

```text
dsh/frontend/app-client/screens/PreferencesScreen.tsx
```

They cover only DSH delivery preferences. Account, identity, security, wallet, and global notifications remain outside DSH.

## WLT bridge simplification

The WLT bridge is required because DSH checkout depends on wallet/payment presentation. It must be small and WLT-owned:

```text
wlt/frontend/app-client/dsh/
├─ index.ts
├─ WltDshClientBridge.tsx
├─ wlt-dsh-client.parts.tsx
├─ wlt-dsh-client.adapter.ts
├─ wlt-dsh-client.contract.ts
├─ wlt-dsh-client.preview-data.ts
├─ wlt-dsh-client.types.ts
└─ useWltDshWalletPreview.ts
```

## Repeatable method for other services

Use the same pattern:
- primary service app-client surface
- linked integration bridges
- app shell/composition validation
- shared support validation
- registry/routes/classification
- docs/blueprint update
- evidence ZIP
'@

  $runbook = @'
# DSH Client App-Scope Standardization Runbook

1. Record branch/head/origin-head/status.
2. Fix whitespace-only diff-check failures inside scope.
3. Inventory every scoped source file.
4. Create/update DSH routes and screen registry.
5. Create DSH Preferences screen if missing.
6. Normalize DSH client into:
   - surface
   - screens
   - parts
   - data
   - shared
7. Normalize WLT DSH bridge into:
   - bridge
   - parts
   - adapter
   - contract
   - preview-data
   - types
   - hook
8. Update imports through resolved paths, not blind replacements.
9. Update `dsh/SERVICE_BLUEPRINT.md`.
10. Update `dsh/docs`.
11. Run static gate.
12. Run diff-check and TypeScript.
13. Run runtime smoke when available.
14. Produce evidence ZIP.
15. If any gate fails, fix only that gate and repeat.
'@

  WriteUtf8 "dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md" $doc "write DSH standardization doc"
  WriteUtf8 "dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md" $runbook "write DSH standardization runbook"
}

function EnsurePreferencesScreen {
  $path = "dsh/frontend/app-client/screens/PreferencesScreen.tsx"
  $content = @'
import { Box, Text } from '@bthwani/ui-kit';

export function PreferencesScreen() {
  return (
    <Box padding={4} gap={3}>
      <Text variant="title">تفضيلات التوصيل</Text>
      <Text variant="body">
        تفضيلات خاصة بخدمة التوصيل فقط: تعليمات التسليم، تفضيلات الاستبدال، تنبيهات الطلب، وطريقة التواصل مع الكابتن.
      </Text>
    </Box>
  );
}
'@
  if (-not (Test-Path -LiteralPath (FromRepoPath $path))) {
    WriteUtf8 $path $content "create DSH PreferencesScreen"
  }
}

function EnsureWltBridgeScaffold {
  $files = @{
    "wlt/frontend/app-client/dsh/wlt-dsh-client.contract.ts" = @'
export const wltDshClientBridgeDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'preview-only display values / not accounting source',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-client',
} as const;
'@
    "wlt/frontend/app-client/dsh/wlt-dsh-client.types.ts" = @'
export type WltDshClientPaymentMethod = {
  id: string;
  label: string;
  description?: string;
  balanceLabel?: string;
  enabled: boolean;
};

export type WltDshClientBridgeState = {
  methods: readonly WltDshClientPaymentMethod[];
};
'@
    "wlt/frontend/app-client/dsh/wlt-dsh-client.preview-data.ts" = @'
import { wltDshClientBridgeDataContract } from './wlt-dsh-client.contract';
import type { WltDshClientBridgeState } from './wlt-dsh-client.types';

export const wltDshClientPaymentPreviewData = {
  contract: wltDshClientBridgeDataContract,
  methods: [
    {
      id: 'wallet',
      label: 'محفظة بثواني',
      description: 'قيمة عرض تجريبية فقط وليست مصدرًا محاسبيًا.',
      balanceLabel: 'رصيد تجريبي',
      enabled: true,
    },
  ],
} as const satisfies WltDshClientBridgeState & {
  contract: typeof wltDshClientBridgeDataContract;
};
'@
    "wlt/frontend/app-client/dsh/index.ts" = @'
export { wltDshClientBridgeDataContract } from './wlt-dsh-client.contract';
export { wltDshClientPaymentPreviewData } from './wlt-dsh-client.preview-data';
export type { WltDshClientBridgeState, WltDshClientPaymentMethod } from './wlt-dsh-client.types';
'@
  }

  foreach ($key in $files.Keys) {
    if (-not (Test-Path -LiteralPath (FromRepoPath $key))) {
      WriteUtf8 $key $files[$key] "create WLT DSH bridge scaffold"
    }
  }
}

function GenerateInventoryAndClassification {
  $rows = @()
  foreach ($f in ProductFiles) {
    $p = ToRepoPath $f.FullName
    $kind = "SHARED_HELPER"
    $ownerKind = "service"
    $ownerId = "dsh"
    $serviceId = "dsh"
    $linkedServiceId = ""

    if ($p -match "^wlt/frontend/app-client/dsh/") {
      $ownerKind = "integration"
      $ownerId = "wlt.dsh"
      $serviceId = "wlt"
      $linkedServiceId = "dsh"
    } elseif ($p -match "^app-client/") {
      $ownerKind = "app"
      $ownerId = "app-client"
      $serviceId = ""
    }

    if ($p -match "/screens/.*Screen\.tsx$") { $kind = "SCREEN_ENTRY" }
    elseif ($p -match "/parts/|\.parts\.tsx$") { $kind = "SCREEN_PART" }
    elseif ($p -match "\.preview-data\.ts$") { $kind = "PREVIEW_DATA" }
    elseif ($p -match "\.preview-store\.ts$") { $kind = "PREVIEW_STORE" }
    elseif ($p -match "\.contract(s)?\.ts$") { $kind = "TYPE_CONTRACT" }
    elseif ($p -match "screen-registry\.ts$") { $kind = "SCREEN_REGISTRY" }
    elseif ($p -match "routes\.ts$") { $kind = "ROUTE_REGISTRY" }
    elseif ($p -match "\.css$") { $kind = "STYLE_MODULE" }
    elseif ($p -match "fixture|fixtures") { $kind = "FIXTURE" }
    elseif ($p -match "^wlt/frontend/app-client/dsh/" -and $p -match "DshWlt|WltDsh") { $kind = "INTEGRATION_PART_PENDING_REVIEW" }

    $rows += [pscustomobject]@{
      path = $p
      classification = $kind
      ownerKind = $ownerKind
      ownerId = $ownerId
      serviceId = $serviceId
      linkedServiceId = $linkedServiceId
      sizeBytes = $f.Length
    }
  }

  $rows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "dsh-client-final-classification.csv")
  if (-not $DryRun) {
    Copy-Item -LiteralPath (Join-Path $Out "dsh-client-final-classification.csv") -Destination (FromRepoPath "dsh/docs/dsh-client-final-classification.csv") -Force
  }
  return $rows
}

function StaticGate {
  $files = ProductFiles
  $primary = @($files | Where-Object {
    $p = ToRepoPath $_.FullName
    $p -match "^dsh/frontend/app-client/" -or $p -match "^wlt/frontend/app-client/dsh/" -or $p -match "^app-client/(composition|shell)/"
  })

  $checks = @(
    @{ key="forbidden_core_service"; pattern="serviceId\s*:\s*['""]core['""]|ownerId\s*:\s*['""]core['""]"; files=$files },
    @{ key="export_star"; pattern="export\s+\*"; files=$files },
    @{ key="any_usage_primary"; pattern="\bas\s+any\b|:\s*any\b|React\.ComponentType<any>"; files=$primary },
    @{ key="tamagui_outside_uikit"; pattern="from ['""]tamagui['""]|from ['""]@tamagui"; files=$files },
    @{ key="deep_import_between_apps"; pattern="from ['""][.]{2,}\/app-client|from ['""][.]{2,}\/app-partner|from ['""][.]{2,}\/app-captain|from ['""][.]{2,}\/app-field"; files=$files },
    @{ key="old_visual_noise_primary"; pattern="premiumGlass|glass|glow|purple|#8b5cf6|🎧|💰|⚙️"; files=$primary },
    @{ key="runtime_error_strings"; pattern="Cannot read property 'default' of undefined|property is not writable|Box is not defined|Expected '</'|Module not found|Can't resolve|React is not defined"; files=$files }
  )

  $rows = @()
  foreach ($c in $checks) {
    $matches = @($c.files | Select-String -Pattern $c.pattern -ErrorAction SilentlyContinue)
    $rows += [pscustomobject]@{
      check = $c.key
      count = $matches.Count
      status = if ($matches.Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
      sample = ($matches | Select-Object -First 25 | ForEach-Object { "$(ToRepoPath $_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
    }
  }

  $script:GateRows = $rows
  $rows | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "static-gate.json")
  $rows | Format-Table -AutoSize | Out-String -Width 1200 | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "static-gate.txt")
  return $rows
}

function RuntimeSmoke {
  $rows = @()
  if ($SkipRuntime) {
    $rows += [pscustomobject]@{ target="app-client"; result="SKIPPED_BY_FLAG" }
    $rows += [pscustomobject]@{ target="control-panel"; result="SKIPPED_BY_FLAG" }
  } else {
    if ($null -ne (Get-Command adb -ErrorAction SilentlyContinue)) {
      & adb @("logcat", "-d", "-v", "time", "ReactNativeJS:V", "ReactNative:V", "Expo:V", "AndroidRuntime:E", "*:S") |
        Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "app-client-adb-logcat.txt")
      $adb = Read-Safe (Join-Path $Out "app-client-adb-logcat.txt")
      $bad = $adb -match "Cannot read property 'default' of undefined|property is not writable|NewsTickerBar|FATAL EXCEPTION|AndroidRuntime"
      $rows += [pscustomobject]@{ target="app-client"; result=if($bad){"FAIL"}else{"PASS"} }
    } else {
      $rows += [pscustomobject]@{ target="app-client"; result="SKIPPED_NO_ADB" }
    }

    $port = $null
    foreach ($p in @(3000,3010)) {
      try {
        $r = Invoke-WebRequest -Uri "http://localhost:$p/" -UseBasicParsing -TimeoutSec 8
        if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { $port = $p; break }
      } catch {}
    }

    if ($port) {
      $routeRows = @()
      foreach ($route in @("/", "/operations", "/finance", "/support", "/partners", "/marketing")) {
        try {
          $res = Invoke-WebRequest -Uri "http://localhost:$port$route" -UseBasicParsing -TimeoutSec 60
          $body = $res.Content | Out-String
          $bad = $body -match "Box is not defined|Expected '</'|Module not found|Can't resolve|React is not defined|Internal Server Error|Build Error|Runtime Error"
          $routeRows += [pscustomobject]@{ route=$route; statusCode=$res.StatusCode; pass=(-not $bad -and $res.StatusCode -lt 500) }
        } catch {
          $routeRows += [pscustomobject]@{ route=$route; statusCode="REQUEST_FAILED"; pass=$false }
        }
      }
      $routeRows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "control-panel-route-smoke.csv")
      $rows += [pscustomobject]@{ target="control-panel"; result=if(@($routeRows | Where-Object { $_.pass -ne $true }).Count -eq 0){"PASS"}else{"FAIL"} }
    } else {
      $rows += [pscustomobject]@{ target="control-panel"; result="SKIPPED_NO_RUNNING_SERVER" }
    }
  }

  $rows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "runtime-smoke.csv")
  return $rows
}

try {
  Step "00 Preflight"
  Run-Capture "git-fetch.txt" { git fetch origin } | Out-Null
  $Branch = (git branch --show-current).Trim()
  $Head = (git rev-parse HEAD).Trim()
  $OriginHead = (git rev-parse "origin/$Branch").Trim()
  Save "branch.txt" $Branch
  Save "head.txt" $Head
  Save "origin-head.txt" $OriginHead
  Save "head-sync.txt" "HEAD_SYNC=$($Head -eq $OriginHead)"
  Run-Capture "git-status-before.txt" { git --no-pager status --short } | Out-Null
  Run-Capture "git-diff-name-status-before.txt" { git --no-pager diff --name-status } | Out-Null
  Run-Capture "untracked-before.txt" { git ls-files --others --exclude-standard } | Out-Null

  Step "01 Safe scaffolds"
  EnsureDocsAndBlueprint
  EnsurePreferencesScreen
  EnsureWltBridgeScaffold

  Step "02 Whitespace cleanup in scoped files"
  foreach ($f in ProductFiles) { TrimWhitespace $f.FullName }

  Step "03 Classification"
  $classification = GenerateInventoryAndClassification

  Step "04 Repeated gates"
  $diffPass = $false
  $tscPass = $false
  $staticPass = $false

  for ($i = 1; $i -le $MaxCycles; $i++) {
    $gate = StaticGate
    $staticPass = @($gate | Where-Object { [int]$_.count -gt 0 }).Count -eq 0

    $diff = Run-Capture "cycle-$i-git-diff-check.txt" { git --no-pager diff --check }
    $diffPass = [string]::IsNullOrWhiteSpace((Read-Safe $diff.file))
    if (-not $diffPass) {
      foreach ($f in ProductFiles) { TrimWhitespace $f.FullName }
      continue
    }

    $tsc = Run-Capture "cycle-$i-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
    $tscPass = [string]::IsNullOrWhiteSpace((Read-Safe $tsc.file))

    if ($diffPass -and $tscPass -and $staticPass) { break }
  }

  Step "05 Runtime smoke"
  $runtime = RuntimeSmoke

  Step "06 Final evidence"
  $finalDiff = Run-Capture "git-diff-check.txt" { git --no-pager diff --check }
  $finalTsc = Run-Capture "tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
  $finalGate = StaticGate
  $finalDiffPass = [string]::IsNullOrWhiteSpace((Read-Safe $finalDiff.file))
  $finalTscPass = [string]::IsNullOrWhiteSpace((Read-Safe $finalTsc.file))
  $finalStaticPass = @($finalGate | Where-Object { [int]$_.count -gt 0 }).Count -eq 0

  $script:Actions | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "actions.csv")
  Run-Capture "git-status-final.txt" { git --no-pager status --short } | Out-Null
  Run-Capture "git-diff-name-status-final.txt" { git --no-pager diff --name-status } | Out-Null
  Run-Capture "LOCAL_CHANGE_REVIEW.patch" { git --no-pager diff -- . } | Out-Null
  Run-Capture "UNTRACKED_FILES.txt" { git ls-files --others --exclude-standard } | Out-Null

  $runtimeText = (@($runtime) | ForEach-Object { "$($_.target)=$($_.result)" }) -join "; "
  $verdict = if ($finalDiffPass -and $finalTscPass -and $finalStaticPass) { "PASS" } else { "FIX_REQUIRED" }

  $report = @"
# DSH Client App-Scope Standardization R2 Guard

## FINAL_VERDICT
$verdict

## Summary
- actions: $(@($script:Actions).Count)
- classification rows: $(@($classification).Count)

## Gates
- diff-check: $(if($finalDiffPass){"PASS"}else{"FAIL"})
- tsc: $(if($finalTscPass){"PASS"}else{"FAIL"})
- static gate: $(if($finalStaticPass){"PASS"}else{"FAIL"})
- runtime: $runtimeText

## Important
This guard script scaffolds safe missing pieces and validates the closure.
Complex file moves/merges must be completed by the paired Copilot prompt, then this guard must be re-run until PASS.
"@
  $report | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "FINAL_REPORT.md")

  if ($CommitAndPush) {
    if ($verdict -eq "PASS") {
      Run-Capture "commit-push.txt" {
        git add -A
        git --no-pager diff --cached --check
        pnpm -w exec tsc --noEmit
        git commit -m "chore: standardize dsh client app scope"
        git push origin (git branch --show-current)
      } | Out-Null
    } else {
      Save "commit-push.txt" "SKIPPED: verdict=$verdict"
    }
  } else {
    Save "commit-push.txt" "SKIPPED: pass -CommitAndPush to enable"
  }

  Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$SessionId.zip") -Force

  Write-Host ""
  Write-Host "FINAL_VERDICT=$verdict"
  Write-Host "ACTIONS=$(@($script:Actions).Count)"
  Write-Host "CLASSIFICATION_ROWS=$(@($classification).Count)"
  Write-Host "DIFF_CHECK=$(if($finalDiffPass){"PASS"}else{"FAIL"})"
  Write-Host "TSC=$(if($finalTscPass){"PASS"}else{"FAIL"})"
  Write-Host "STATIC_GATE=$(if($finalStaticPass){"PASS"}else{"FAIL"})"
  Write-Host "RUNTIME=$runtimeText"
  Write-Host "EVIDENCE_FOLDER=$Out"
  Write-Host "EVIDENCE_ZIP=$(Join-Path $Out "$SessionId.zip")"
  Write-Host "REPORT=$(Join-Path $Out "FINAL_REPORT.md")"

  if ($verdict -ne "PASS") { exit 2 }
}
catch {
  $_ | Out-String | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "ERROR.txt")
  try {
    $script:Actions | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "actions.csv")
    Run-Capture "git-status-final.txt" { git --no-pager status --short } | Out-Null
    Run-Capture "git-diff-name-status-final.txt" { git --no-pager diff --name-status } | Out-Null
    Run-Capture "LOCAL_CHANGE_REVIEW.patch" { git --no-pager diff -- . } | Out-Null
    Run-Capture "UNTRACKED_FILES.txt" { git ls-files --others --exclude-standard } | Out-Null
    Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$SessionId.zip") -Force
  } catch {}

  Write-Host ""
  Write-Host "FINAL_VERDICT=SCRIPT_ERROR"
  Write-Host "EVIDENCE_FOLDER=$Out"
  Write-Host "EVIDENCE_ZIP=$(Join-Path $Out "$SessionId.zip")"
  Write-Host "ERROR=$(Join-Path $Out "ERROR.txt")"
  exit 1
}
