<#
DSH_PARTNER_APP_SCOPE_STANDARDIZATION_EXEC.ps1

Guard/execution script for DSH Partner app-scope closure.
It creates canonical scaffolds, WLT-owned finance bridge contracts, docs, classification, static gates, tsc/diff evidence, and ZIP.
Use with the paired phased Copilot prompt for deep file moves and placeholder consolidation. Re-run after each phase until PASS.

Run:
  Set-Location -LiteralPath "C:\bthwani-suite"
  powershell -ExecutionPolicy Bypass -File "C:\Users\b\Downloads\DSH_PARTNER_APP_SCOPE_STANDARDIZATION_EXEC.ps1"

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

$SessionId = "DSH_PARTNER_APP_SCOPE_STANDARDIZATION-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

$script:Actions = @()

function Step([string]$m) { Write-Host ""; Write-Host "==== $m ====" }
function Save([string]$n,[string]$v){ $v | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out $n) }
function RunCap([string]$n,[scriptblock]$b){
  $f=Join-Path $Out $n; ""|Set-Content -Encoding UTF8 -LiteralPath $f
  try{ & $b *> $f; $c=$LASTEXITCODE; if($null-eq$c){$c=0}; return [pscustomobject]@{file=$f;exitCode=$c} }
  catch{ $_|Out-String|Add-Content -Encoding UTF8 -LiteralPath $f; return [pscustomobject]@{file=$f;exitCode=1} }
}
function ReadSafe([string]$f){ if(Test-Path -LiteralPath $f){ return (Get-Content -LiteralPath $f -Raw) }; return "" }
function Root { return (Resolve-Path ".").Path }
function ToRepo([string]$p){
  if([string]::IsNullOrWhiteSpace($p)){return ""}
  $r=Root; $full=$p
  try{ if(Test-Path -LiteralPath $p){ $full=(Resolve-Path -LiteralPath $p).Path } }catch{}
  return (($full -replace [regex]::Escape($r),"").TrimStart("\","/") -replace "\\","/")
}
function FromRepo([string]$p){ return Join-Path (Root) ($p -replace "/","\") }
function Ignored([string]$p){
  $x=ToRepo $p
  return ($x -match "(^|/)node_modules(/|$)|(^|/)\.next(/|$)|(^|/)\.expo(/|$)|(^|/)\.turbo(/|$)|(^|/)dist(/|$)|(^|/)build(/|$)|(^|/)coverage(/|$)|(^|/)tools/registry/runs(/|$)|(^|/)dsh/_archive(/|$)")
}
function ScopeRoots { @("dsh\frontend\app-partner","wlt\frontend\app-partner\dsh","wlt\frontend\shared\finance","app-partner\composition","app-partner\shell","dsh\frontend\shared") }
function Files { @(Get-ChildItem -Path (ScopeRoots) -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.md -File -ErrorAction SilentlyContinue | ?{ -not (Ignored $_.FullName) }) }
function PrimaryFiles { @(Files | ?{ (ToRepo $_.FullName) -match "^dsh/frontend/app-partner/|^wlt/frontend/app-partner/dsh/|^app-partner/(composition|shell)/" }) }
function WriteFile([string]$repo,[string]$content,[string]$action){
  $abs=FromRepo $repo
  $old=if(Test-Path -LiteralPath $abs){Get-Content -LiteralPath $abs -Raw}else{""}
  if($old -ne $content){
    if(-not $DryRun){ $dir=Split-Path -Parent $abs; if($dir){New-Item -ItemType Directory -Force -Path $dir|Out-Null}; [IO.File]::WriteAllText($abs,$content,[Text.UTF8Encoding]::new($false)) }
    $script:Actions += [pscustomobject]@{file=$repo;action=$action}
  }
}
function TrimWs([string]$p){
  if(-not(Test-Path -LiteralPath $p)){return}
  $raw=Get-Content -LiteralPath $p -Raw; $nl=if($raw.Contains("`r`n")){"`r`n"}else{"`n"}
  $lines=@($raw -split "`r?`n"|%{$_ -replace "[ `t]+$",""})
  while($lines.Count -gt 0 -and $lines[$lines.Count-1] -eq ""){ if($lines.Count-eq1){$lines=@();break}; $lines=$lines[0..($lines.Count-2)]}
  $final=($lines -join $nl)+$nl
  if($final -ne $raw){ if(-not $DryRun){[IO.File]::WriteAllText((Resolve-Path -LiteralPath $p),$final,[Text.UTF8Encoding]::new($false))}; $script:Actions += [pscustomobject]@{file=ToRepo $p;action="trim trailing whitespace"} }
}

function EnsureDirs {
  foreach($d in @("dsh/frontend/app-partner/screens","dsh/frontend/app-partner/parts","dsh/frontend/app-partner/data","dsh/frontend/app-partner/shared","wlt/frontend/app-partner/dsh","dsh/docs")){
    if(-not $DryRun){New-Item -ItemType Directory -Force -Path (FromRepo $d)|Out-Null}
    $script:Actions += [pscustomobject]@{file=$d;action="ensure directory"}
  }
}

function EnsureRoutesRegistry {
$routes=@'
export type DshPartnerRouteId =
  | 'dsh-partner-home'
  | 'dsh-partner-entry'
  | 'dsh-partner-store-profile'
  | 'dsh-partner-operations'
  | 'dsh-partner-orders'
  | 'dsh-partner-order-detail'
  | 'dsh-partner-order-issue'
  | 'dsh-partner-inventory'
  | 'dsh-partner-promotions'
  | 'dsh-partner-notifications'
  | 'dsh-partner-settings'
  | 'dsh-partner-support';

export type DshPartnerRouteRecord = {
  readonly routeId: DshPartnerRouteId;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshPartnerRoutes = [
  { routeId: 'dsh-partner-home', screenId: 'partner.dsh.home.dashboard', ownerPath: 'dsh/frontend/app-partner/screens/PartnerHomeScreen.tsx' },
  { routeId: 'dsh-partner-entry', screenId: 'partner.dsh.entry.status', ownerPath: 'dsh/frontend/app-partner/screens/PartnerEntryScreen.tsx' },
  { routeId: 'dsh-partner-store-profile', screenId: 'partner.dsh.store.profile', ownerPath: 'dsh/frontend/app-partner/screens/StoreProfileScreen.tsx' },
  { routeId: 'dsh-partner-operations', screenId: 'partner.dsh.operations.control', ownerPath: 'dsh/frontend/app-partner/screens/OperationsScreen.tsx' },
  { routeId: 'dsh-partner-orders', screenId: 'partner.dsh.orders.inbox', ownerPath: 'dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx' },
  { routeId: 'dsh-partner-order-detail', screenId: 'partner.dsh.order.detail', ownerPath: 'dsh/frontend/app-partner/screens/OrderDetailScreen.tsx' },
  { routeId: 'dsh-partner-order-issue', screenId: 'partner.dsh.order.issue', ownerPath: 'dsh/frontend/app-partner/screens/OrderIssueScreen.tsx' },
  { routeId: 'dsh-partner-inventory', screenId: 'partner.dsh.inventory.catalog', ownerPath: 'dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx' },
  { routeId: 'dsh-partner-promotions', screenId: 'partner.dsh.promotions.intent', ownerPath: 'dsh/frontend/app-partner/screens/PromotionsScreen.tsx' },
  { routeId: 'dsh-partner-notifications', screenId: 'partner.dsh.notifications.list', ownerPath: 'dsh/frontend/app-partner/screens/NotificationsScreen.tsx' },
  { routeId: 'dsh-partner-settings', screenId: 'partner.dsh.settings.preferences', ownerPath: 'dsh/frontend/app-partner/screens/PartnerSettingsScreen.tsx' },
  { routeId: 'dsh-partner-support', screenId: 'partner.dsh.support.center', ownerPath: 'dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx' },
] as const satisfies readonly DshPartnerRouteRecord[];
'@
$registry=@'
export type PartnerScreenRegistryItem = {
  readonly screenId: string;
  readonly routeId: string;
  readonly surfaceId: 'app-partner';
  readonly ownerKind: 'service' | 'integration';
  readonly ownerId: 'dsh' | 'wlt.dsh';
  readonly serviceId: 'dsh' | 'wlt';
  readonly linkedServiceId?: 'dsh' | 'wlt';
  readonly ownerPath: string;
  readonly componentName: string;
  readonly screenKind: 'TAB_ROOT' | 'SCREEN_ENTRY' | 'FLOW_STEP' | 'MODAL' | 'SHEET';
  readonly flowId?: string;
  readonly requiredStates: readonly ('loading' | 'empty' | 'error' | 'success' | 'offline' | 'disabled' | 'retry' | 'blocked')[];
  readonly analytics: { readonly screenView: string; readonly primaryEvents?: readonly string[] };
  readonly fallbackRouteId?: string;
  readonly releaseCriticality: 'P0' | 'P1' | 'P2';
  readonly status: 'TBD' | 'UNPROVEN' | 'VERIFIED' | 'CLOSED' | 'DEPRECATED';
};

export const dshPartnerScreenRegistry = [
  {
    screenId: 'partner.dsh.home.dashboard',
    routeId: 'dsh-partner-home',
    surfaceId: 'app-partner',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-partner/screens/PartnerHomeScreen.tsx',
    componentName: 'PartnerHomeScreen',
    screenKind: 'TAB_ROOT',
    flowId: 'dsh.partner.dashboard',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    analytics: { screenView: 'partner_dsh_home_dashboard_view' },
    fallbackRouteId: 'dsh-partner-home',
    releaseCriticality: 'P0',
    status: 'UNPROVEN',
  },
  {
    screenId: 'partner.dsh.operations.control',
    routeId: 'dsh-partner-operations',
    surfaceId: 'app-partner',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-partner/screens/OperationsScreen.tsx',
    componentName: 'OperationsScreen',
    screenKind: 'SCREEN_ENTRY',
    flowId: 'dsh.partner.operations',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'blocked'],
    analytics: { screenView: 'partner_dsh_operations_control_view' },
    fallbackRouteId: 'dsh-partner-home',
    releaseCriticality: 'P0',
    status: 'UNPROVEN',
  },
  {
    screenId: 'partner.dsh.orders.inbox',
    routeId: 'dsh-partner-orders',
    surfaceId: 'app-partner',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx',
    componentName: 'OrdersInboxScreen',
    screenKind: 'SCREEN_ENTRY',
    flowId: 'dsh.partner.orders',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'retry'],
    analytics: { screenView: 'partner_dsh_orders_inbox_view' },
    fallbackRouteId: 'dsh-partner-home',
    releaseCriticality: 'P0',
    status: 'UNPROVEN',
  },
  {
    screenId: 'partner.wlt.dsh.wallet.bridge',
    routeId: 'wlt-dsh-partner-wallet-bridge',
    surfaceId: 'app-partner',
    ownerKind: 'integration',
    ownerId: 'wlt.dsh',
    serviceId: 'wlt',
    linkedServiceId: 'dsh',
    ownerPath: 'wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx',
    componentName: 'WltDshPartnerBridge',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.partner.finance',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'blocked'],
    analytics: { screenView: 'partner_wlt_dsh_wallet_bridge_view' },
    fallbackRouteId: 'dsh-partner-home',
    releaseCriticality: 'P0',
    status: 'UNPROVEN',
  },
] as const satisfies readonly PartnerScreenRegistryItem[];
'@
  WriteFile "dsh/frontend/app-partner/dsh-partner.routes.ts" $routes "create/update DSH partner route registry"
  WriteFile "dsh/frontend/app-partner/dsh-partner.screen-registry.ts" $registry "create/update DSH partner screen registry"
}

function EnsureWltBridge {
$contract=@'
export const wltDshPartnerBridgeDataContract = {
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
  surfaceId: 'app-partner',
} as const;
'@
$types=@'
export type WltDshPartnerWalletPreview = {
  balanceLabel: string;
  pendingPayoutsLabel: string;
  lastSettlementLabel: string;
};

export type WltDshPartnerBridgeState = {
  wallet: WltDshPartnerWalletPreview;
};
'@
$preview=@'
import { wltDshPartnerBridgeDataContract } from './wlt-dsh-partner.contract';
import type { WltDshPartnerBridgeState } from './wlt-dsh-partner.types';

export const wltDshPartnerPreviewData = {
  contract: wltDshPartnerBridgeDataContract,
  wallet: {
    balanceLabel: 'رصيد تجريبي',
    pendingPayoutsLabel: 'قيد التسوية',
    lastSettlementLabel: 'آخر تسوية تجريبية',
  },
} as const satisfies WltDshPartnerBridgeState & {
  contract: typeof wltDshPartnerBridgeDataContract;
};
'@
$bridge=@'
import React from 'react';
import { Box, KeyValueList, Surface, Text } from '@bthwani/ui-kit';
import { wltDshPartnerPreviewData } from './wlt-dsh-partner.preview-data';

export function WltDshPartnerBridge() {
  const wallet = wltDshPartnerPreviewData.wallet;

  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Box gap={1}>
        <Text role="label">جسر محفظة الشريك</Text>
        <Text role="bodySm" tone="muted">عرض تجريبي مملوك لخدمة WLT ومرتبط بسياق DSH.</Text>
      </Box>
      <KeyValueList
        items={[
          { label: 'الرصيد', value: wallet.balanceLabel },
          { label: 'قيد التسوية', value: wallet.pendingPayoutsLabel },
          { label: 'آخر تسوية', value: wallet.lastSettlementLabel },
        ]}
      />
    </Surface>
  );
}
'@
$index=@'
export { WltDshPartnerBridge } from './WltDshPartnerBridge';
export { wltDshPartnerBridgeDataContract } from './wlt-dsh-partner.contract';
export { wltDshPartnerPreviewData } from './wlt-dsh-partner.preview-data';
export type { WltDshPartnerBridgeState, WltDshPartnerWalletPreview } from './wlt-dsh-partner.types';
'@
  WriteFile "wlt/frontend/app-partner/dsh/wlt-dsh-partner.contract.ts" $contract "create/update WLT DSH partner contract"
  WriteFile "wlt/frontend/app-partner/dsh/wlt-dsh-partner.types.ts" $types "create/update WLT DSH partner types"
  WriteFile "wlt/frontend/app-partner/dsh/wlt-dsh-partner.preview-data.ts" $preview "create/update WLT DSH partner preview data"
  if(-not(Test-Path -LiteralPath (FromRepo "wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx"))){ WriteFile "wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx" $bridge "create WLT DSH partner bridge" }
  WriteFile "wlt/frontend/app-partner/dsh/index.ts" $index "create explicit WLT DSH partner public index"
}

function EnsureDocs {
$section=@'
<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:start -->
## DSH Partner App-Scope Standardization

Scope: DSH partner only.

Ownership:
- DSH owns partner delivery operations: store profile, operations, orders, order issues, inventory, promotions, notifications, settings, and support.
- WLT owns wallet, balance, settlements, payouts, commission, and money semantics.
- ARB is not part of `dsh/frontend/app-partner`.
- No service named `core`.

Canonical structure:

```text
dsh/frontend/app-partner/
├─ index.ts
├─ DshPartnerSurface.tsx
├─ dsh-partner.routes.ts
├─ dsh-partner.screen-registry.ts
├─ dsh-partner.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/
```

Canonical DSH partner screens:
`PartnerHomeScreen`, `PartnerEntryScreen`, `StoreProfileScreen`, `OperationsScreen`, `OrdersInboxScreen`, `OrderDetailScreen`, `OrderIssueScreen`, `InventoryCatalogScreen`, `PromotionsScreen`, `NotificationsScreen`, `PartnerSettingsScreen`, `PartnerSupportScreen`.

WLT-owned DSH partner bridge:
`wlt/frontend/app-partner/dsh/**`.

Gates:
- no `export *`
- no `serviceId: 'core'`
- no Tamagui outside `ui-kit`
- no DSH-owned wallet/finance screen
- no ARB route in DSH partner surface
- all scoped files classified once
- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit`

<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:end -->
'@
  $bp="dsh/SERVICE_BLUEPRINT.md"
  $old=if(Test-Path -LiteralPath (FromRepo $bp)){Get-Content -LiteralPath (FromRepo $bp) -Raw}else{"# DSH Service Blueprint`n"}
  $new=if($old -match "(?s)<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:start -->.*?<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:end -->"){[regex]::Replace($old,"(?s)<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:start -->.*?<!-- DSH_PARTNER_APP_SCOPE_STANDARDIZATION:end -->",$section)}else{$old.TrimEnd()+"`n`n"+$section+"`n"}
  WriteFile $bp $new "upsert DSH partner blueprint section"

$doc=@'
# DSH Partner App-Scope Standardization

Goal: close DSH partner only. No ARB. No DSH-owned wallet/finance.

Canonical screens:
- PartnerHomeScreen
- PartnerEntryScreen
- StoreProfileScreen
- OperationsScreen
- OrdersInboxScreen
- OrderDetailScreen
- OrderIssueScreen
- InventoryCatalogScreen
- PromotionsScreen
- NotificationsScreen
- PartnerSettingsScreen
- PartnerSupportScreen

Repeatable closure:
1. Inventory every scoped file.
2. Move route entries to `screens/`.
3. Move non-route UI to `parts/`.
4. Move preview/static data to `data/`.
5. Move helpers/mappers/constants to `shared/`.
6. Build routes and screen registry.
7. Simplify WLT-owned DSH bridge.
8. Remove export-star and placeholder compatibility noise.
9. Regenerate classification.
10. Run static, diff, typecheck, runtime gates.
'@
$runbook=@'
# DSH Partner App-Scope Standardization Runbook

1. Preflight.
2. Inventory.
3. Data contracts and finance ownership.
4. Routes and screen registry.
5. Public API and placeholder cleanup.
6. WLT partner bridge simplification.
7. Classification and docs consistency.
8. Final closure gate.
'@
  WriteFile "dsh/docs/DSH_PARTNER_APP_SCOPE_STANDARDIZATION.md" $doc "write partner standardization doc"
  WriteFile "dsh/docs/DSH_PARTNER_APP_SCOPE_STANDARDIZATION_RUNBOOK.md" $runbook "write partner standardization runbook"
}

function AddContract([string]$repo,[string]$name,[string]$money){
  $abs=FromRepo $repo
  if(-not(Test-Path -LiteralPath $abs)){return}
  $txt=Get-Content -LiteralPath $abs -Raw
  if($txt -match [regex]::Escape($name)){return}
  $contract="// UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.`nexport const $name = {`n  dataKind: 'UI_PREVIEW_ONLY',`n  runtimeTruth: false,`n  backendSource: false,`n  bindingSource: false,`n  timezoneSemantics: 'not_applicable',`n  moneySemantics: '$money',`n} as const;`n`n"
  if(-not $DryRun){[IO.File]::WriteAllText((Resolve-Path -LiteralPath $abs),$contract+$txt,[Text.UTF8Encoding]::new($false))}
  $script:Actions += [pscustomobject]@{file=$repo;action="add preview data contract"}
}

function FixExportStarLowRisk {
  $wlt="wlt/frontend/app-partner/dsh/index.ts"
  if(Test-Path -LiteralPath (FromRepo $wlt)){
    $txt=Get-Content -LiteralPath (FromRepo $wlt) -Raw
    if($txt -match "export\s+\*"){ EnsureWltBridge }
  }
  $comp="app-partner/composition/index.ts"
  if(Test-Path -LiteralPath (FromRepo $comp)){
    $txt=Get-Content -LiteralPath (FromRepo $comp) -Raw
    if($txt -match "export\s+\*"){
      $script:Actions += [pscustomobject]@{file=$comp;action="export-star detected; requires Copilot explicit export phase"}
    }
  }
}

function GenerateClassification {
  $rows=@()
  foreach($f in Files){
    $p=ToRepo $f.FullName; $layer="unknown"; $ownerKind="service"; $ownerId="dsh"; $serviceId="dsh"; $linked=""; $cls="SHARED_HELPER"; $status="ACTIVE"
    if($p -match "^dsh/frontend/app-partner/"){$layer="dsh-partner"}
    elseif($p -match "^wlt/frontend/app-partner/dsh/"){$layer="wlt-dsh-partner-bridge";$ownerKind="integration";$ownerId="wlt.dsh";$serviceId="wlt";$linked="dsh"}
    elseif($p -match "^wlt/frontend/shared/finance/"){$layer="wlt-shared-finance";$ownerKind="integration";$ownerId="wlt.dsh";$serviceId="wlt";$linked="dsh"}
    elseif($p -match "^app-partner/"){$layer="app-partner-integration";$ownerKind="app";$ownerId="app-partner";$serviceId=""}
    elseif($p -match "^dsh/frontend/shared/"){$layer="dsh-shared"}
    if($p -match "/screens/.*Screen\.tsx$"){$cls="SCREEN_ENTRY"}
    elseif($p -match "/parts/|\.parts\.tsx$"){$cls="SCREEN_PART"}
    elseif($p -match "\.preview-data\.ts$"){$cls="PREVIEW_DATA"}
    elseif($p -match "\.preview-store\.ts$"){$cls="PREVIEW_STORE"}
    elseif($p -match "\.contract(s)?\.ts$"){$cls="TYPE_CONTRACT"}
    elseif($p -match "screen-registry\.ts$"){$cls="SCREEN_REGISTRY"}
    elseif($p -match "routes\.ts$"){$cls="ROUTE_REGISTRY"}
    elseif($p -match "\.css$"){$cls="STYLE_MODULE"}
    elseif($p -match "fixture|fixtures"){$cls="FIXTURE"}
    elseif($p -match "^wlt/frontend/app-partner/dsh/"){$cls="INTEGRATION_BRIDGE_PART"}
    elseif($p -match "DshPartnerConsoleScreen\.tsx"){$cls="SURFACE_ENTRY_PENDING_STANDARDIZATION";$status="FIX_REQUIRED"}
    elseif($p -match "^dsh/frontend/app-partner/.*(Wallet|Finance|Settlement|Commission)"){$cls="WLT_OWNERSHIP_LEAK_REVIEW";$status="FIX_REQUIRED"}
    $rows += [pscustomobject]@{path=$p;layer=$layer;ownerKind=$ownerKind;ownerId=$ownerId;serviceId=$serviceId;linkedServiceId=$linked;classification=$cls;status=$status}
  }
  $csv=Join-Path $Out "dsh-partner-final-classification.csv"
  $rows|Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $csv
  if(-not $DryRun){Copy-Item -LiteralPath $csv -Destination (FromRepo "dsh/docs/dsh-partner-final-classification.csv") -Force}
  return $rows
}

function StaticGate {
  $files=Files; $primary=PrimaryFiles
  $defs=@(
    @{k="forbidden_core_service";p="serviceId\s*:\s*['""]core['""]|ownerId\s*:\s*['""]core['""]";f=$files},
    @{k="export_star";p="export\s+\*";f=$files},
    @{k="any_usage_primary";p="\bas\s+any\b|:\s*any\b|React\.ComponentType<any>";f=$primary},
    @{k="tamagui_outside_uikit";p="from ['""]tamagui['""]|from ['""]@tamagui";f=$files},
    @{k="deep_import_between_apps";p="from ['""][.]{2,}\/app-client|from ['""][.]{2,}\/app-partner|from ['""][.]{2,}\/app-captain|from ['""][.]{2,}\/app-field";f=$files},
    @{k="runtime_error_strings";p="Cannot read property 'default' of undefined|property is not writable|Box is not defined|Expected '</'|Module not found|Can't resolve|React is not defined";f=$files},
    @{k="dsh_owned_finance_wallet";p="DshPartnerWalletPreview|partnerBalanceLabel|pendingPayoutsLabel|lastSettlementLabel|commission|settlement|wallet";f=@($files|?{(ToRepo $_.FullName)-match "^dsh/frontend/app-partner/"})},
    @{k="arb_inside_dsh_partner";p="activeServiceType|arb|type-switch|ARB";f=@($files|?{(ToRepo $_.FullName)-match "^dsh/frontend/app-partner/|^app-partner/(composition|shell)/"})}
  )
  $rows=@()
  foreach($d in $defs){
    $m=@($d.f|Select-String -Pattern $d.p -ErrorAction SilentlyContinue)
    $rows += [pscustomobject]@{check=$d.k;count=$m.Count;status=if($m.Count-eq0){"PASS"}else{"FIX_REQUIRED"};sample=($m|select -First 25|%{"$(ToRepo $_.Path):$($_.LineNumber): $($_.Line.Trim())"}) -join "`n"}
  }
  $rows|ConvertTo-Json -Depth 8|Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "static-gate.json")
  $rows|Format-Table -AutoSize|Out-String -Width 1200|Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "static-gate.txt")
  return $rows
}

function RuntimeSmoke {
  $rows=@()
  if($SkipRuntime){$rows += [pscustomobject]@{target="app-partner";result="SKIPPED_BY_FLAG"}}
  elseif($null -ne (Get-Command adb -ErrorAction SilentlyContinue)){
    & adb @("logcat","-d","-v","time","ReactNativeJS:V","ReactNative:V","Expo:V","AndroidRuntime:E","*:S") | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "app-partner-adb-logcat.txt")
    $adb=ReadSafe (Join-Path $Out "app-partner-adb-logcat.txt")
    $bad=$adb -match "Cannot read property 'default' of undefined|property is not writable|FATAL EXCEPTION|AndroidRuntime"
    $rows += [pscustomobject]@{target="app-partner";result=if($bad){"FAIL"}else{"PASS"}}
  } else {$rows += [pscustomobject]@{target="app-partner";result="SKIPPED_NO_ADB"}}
  $rows|Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "runtime-smoke.csv")
  return $rows
}

try {
  Step "00 Preflight"
  RunCap "git-fetch.txt" { git fetch origin }|Out-Null
  $Branch=(git branch --show-current).Trim(); $Head=(git rev-parse HEAD).Trim(); $OriginHead=(git rev-parse "origin/$Branch").Trim()
  Save "branch.txt" $Branch; Save "head.txt" $Head; Save "origin-head.txt" $OriginHead; Save "head-sync.txt" "HEAD_SYNC=$($Head -eq $OriginHead)"
  RunCap "git-status-before.txt" { git --no-pager status --short }|Out-Null
  RunCap "git-diff-name-status-before.txt" { git --no-pager diff --name-status }|Out-Null
  RunCap "untracked-before.txt" { git ls-files --others --exclude-standard }|Out-Null
  RunCap "baseline-diff-check.txt" { git --no-pager diff --check }|Out-Null
  RunCap "baseline-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }|Out-Null

  Step "01 Scaffolding"
  EnsureDirs; EnsureRoutesRegistry; EnsureWltBridge; EnsureDocs

  Step "02 Data contracts"
  AddContract "dsh/frontend/app-partner/partner-finance.preview-data.ts" "dshPartnerFinancePreviewDataContract" "preview-only display values / not accounting source"
  AddContract "dsh/frontend/app-partner/partner-order-alert.preview-data.ts" "dshPartnerOrderAlertPreviewDataContract" "not_applicable"
  AddContract "dsh/frontend/app-partner/partner-order-conversation.preview-data.ts" "dshPartnerOrderConversationPreviewDataContract" "not_applicable"

  Step "03 Low-risk export-star and whitespace"
  FixExportStarLowRisk
  foreach($f in Files){TrimWs $f.FullName}

  Step "04 Classification"
  $classification=GenerateClassification

  Step "05 Gates"
  $diffPass=$false; $tscPass=$false; $staticPass=$false
  for($i=1;$i -le $MaxCycles;$i++){
    $gate=StaticGate
    $staticPass=@($gate|?{[int]$_.count -gt 0}).Count -eq 0
    $diff=RunCap "cycle-$i-git-diff-check.txt" { git --no-pager diff --check }
    $diffPass=[string]::IsNullOrWhiteSpace((ReadSafe $diff.file))
    if(-not $diffPass){foreach($f in Files){TrimWs $f.FullName}; continue}
    $tsc=RunCap "cycle-$i-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
    $tscPass=[string]::IsNullOrWhiteSpace((ReadSafe $tsc.file))
    if($diffPass -and $tscPass -and $staticPass){break}
  }

  Step "06 Runtime smoke"
  $runtime=RuntimeSmoke

  Step "07 Final evidence"
  $finalDiff=RunCap "git-diff-check.txt" { git --no-pager diff --check }
  $finalTsc=RunCap "tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
  $finalGate=StaticGate
  $finalDiffPass=[string]::IsNullOrWhiteSpace((ReadSafe $finalDiff.file))
  $finalTscPass=[string]::IsNullOrWhiteSpace((ReadSafe $finalTsc.file))
  $finalStaticPass=@($finalGate|?{[int]$_.count -gt 0}).Count -eq 0
  $script:Actions|Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "actions.csv")
  RunCap "git-status-final.txt" { git --no-pager status --short }|Out-Null
  RunCap "git-diff-name-status-final.txt" { git --no-pager diff --name-status }|Out-Null
  RunCap "LOCAL_CHANGE_REVIEW.patch" { git --no-pager diff -- . }|Out-Null
  RunCap "UNTRACKED_FILES.txt" { git ls-files --others --exclude-standard }|Out-Null
  $runtimeText=(@($runtime)|%{"$($_.target)=$($_.result)"}) -join "; "
  $verdict=if($finalDiffPass -and $finalTscPass -and $finalStaticPass){"PASS"}else{"FIX_REQUIRED"}
  @"
# DSH Partner App-Scope Standardization

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

## Note
This script performs safe scaffolding and closure gates. Use the paired phased Copilot prompt for deep screen moves, placeholder cleanup, and WLT bridge consolidation. Re-run this script until PASS.
"@ | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "FINAL_REPORT.md")

  if($CommitAndPush){
    if($verdict -eq "PASS"){
      RunCap "commit-push.txt" { git add -A; git --no-pager diff --cached --check; pnpm -w exec tsc --noEmit; git commit -m "chore: standardize dsh partner app scope"; git push origin (git branch --show-current) }|Out-Null
    } else { Save "commit-push.txt" "SKIPPED: verdict=$verdict" }
  } else { Save "commit-push.txt" "SKIPPED: pass -CommitAndPush to enable" }

  Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$SessionId.zip") -Force
  Write-Host ""; Write-Host "FINAL_VERDICT=$verdict"; Write-Host "ACTIONS=$(@($script:Actions).Count)"; Write-Host "CLASSIFICATION_ROWS=$(@($classification).Count)"; Write-Host "DIFF_CHECK=$(if($finalDiffPass){"PASS"}else{"FAIL"})"; Write-Host "TSC=$(if($finalTscPass){"PASS"}else{"FAIL"})"; Write-Host "STATIC_GATE=$(if($finalStaticPass){"PASS"}else{"FAIL"})"; Write-Host "RUNTIME=$runtimeText"; Write-Host "EVIDENCE_FOLDER=$Out"; Write-Host "EVIDENCE_ZIP=$(Join-Path $Out "$SessionId.zip")"
  if($verdict -ne "PASS"){exit 2}
}
catch {
  $_|Out-String|Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "ERROR.txt")
  try{
    $script:Actions|Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "actions.csv")
    RunCap "git-status-final.txt" { git --no-pager status --short }|Out-Null
    RunCap "git-diff-name-status-final.txt" { git --no-pager diff --name-status }|Out-Null
    RunCap "LOCAL_CHANGE_REVIEW.patch" { git --no-pager diff -- . }|Out-Null
    RunCap "UNTRACKED_FILES.txt" { git ls-files --others --exclude-standard }|Out-Null
    Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$SessionId.zip") -Force
  }catch{}
  Write-Host ""; Write-Host "FINAL_VERDICT=SCRIPT_ERROR"; Write-Host "EVIDENCE_FOLDER=$Out"; Write-Host "EVIDENCE_ZIP=$(Join-Path $Out "$SessionId.zip")"; Write-Host "ERROR=$(Join-Path $Out "ERROR.txt")"
  exit 1
}
