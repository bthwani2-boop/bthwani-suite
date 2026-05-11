<#
DSH_CLIENT_APP_SCOPE_STANDARDIZATION.ps1

Purpose:
- Execute the DSH client app-scope standardization as a closed, evidence-driven loop.
- Scope includes DSH client + WLT-owned DSH bridge + app-client composition/shell validation + DSH shared validation.
- Preserves current UI look/flow as much as possible; performs structural moves, naming cleanup, registry/routes/docs, leak/static gates.
- No backend/API/OpenAPI changes. No new dependencies. No route semantic redesign.

Run:
  Set-Location -LiteralPath "C:\bthwani-suite"
  powershell -ExecutionPolicy Bypass -File "C:\Users\b\Downloads\DSH_CLIENT_APP_SCOPE_STANDARDIZATION.ps1"

Optional:
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

$SessionId = "DSH_CLIENT_APP_SCOPE_STANDARDIZATION-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $SessionId
$ArchiveRoot = Join-Path "dsh\_archive\frontend" $SessionId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

$script:MovedRows = @()
$script:ImportRows = @()
$script:FixRows = @()
$script:DocRows = @()
$script:GateRows = @()
$script:RuntimeRows = @()

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
  if (Test-Path -LiteralPath $file) {
    return (Get-Content -LiteralPath $file -Raw)
  }
  return ""
}

function Repo-Root {
  return (Resolve-Path ".").Path
}

function To-RepoPath([string]$path) {
  if ([string]::IsNullOrWhiteSpace($path)) { return "" }

  $root = Repo-Root
  $full = $path
  try {
    if (Test-Path -LiteralPath $path) {
      $full = (Resolve-Path -LiteralPath $path).Path
    }
  } catch {}

  $p = $full -replace [regex]::Escape($root), ""
  $p = $p.TrimStart("\","/") -replace "\\", "/"
  return $p
}

function From-RepoPath([string]$repoPath) {
  return Join-Path (Repo-Root) ($repoPath -replace "/", "\")
}

function Without-Extension([string]$repoPath) {
  return ($repoPath -replace "\.(tsx|ts|jsx|js|css|md)$", "")
}

function Is-IgnoredPath([string]$path) {
  $p = To-RepoPath $path
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

function Product-Files {
  $roots = @(
    "dsh\frontend\app-client",
    "dsh\frontend\shared",
    "wlt\frontend\app-client\dsh",
    "wlt\frontend\shared\finance",
    "app-client\composition",
    "app-client\shell"
  )

  return @(Get-ChildItem -Path $roots -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.md -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Is-IgnoredPath $_.FullName) })
}

function Primary-Files {
  $roots = @(
    "dsh\frontend\app-client",
    "wlt\frontend\app-client\dsh",
    "app-client\composition",
    "app-client\shell"
  )

  return @(Get-ChildItem -Path $roots -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.md -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Is-IgnoredPath $_.FullName) })
}

function Write-Utf8NoBom([string]$path, [string]$text) {
  if ($DryRun) { return }
  $dir = Split-Path -Parent $path
  if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $dir).Path + "\" + (Split-Path -Leaf $path), $text, [System.Text.UTF8Encoding]::new($false))
}

function Write-Utf8NoBomResolved([string]$path, [string]$text) {
  if ($DryRun) { return }
  if (-not (Test-Path -LiteralPath $path)) {
    $dir = Split-Path -Parent $path
    if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText((Join-Path (Resolve-Path -LiteralPath $dir).Path (Split-Path -Leaf $path)), $text, [System.Text.UTF8Encoding]::new($false))
  } else {
    [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $path), $text, [System.Text.UTF8Encoding]::new($false))
  }
}

function Write-CsvSafe($rows, [string]$path) {
  $items = @($rows)
  if ($items.Count -gt 0) {
    $items | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $path
  } else {
    "none" | Set-Content -Encoding UTF8 -LiteralPath $path
  }
}

function Clean-TrailingWhitespace([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return }

  $raw = Get-Content -LiteralPath $path -Raw
  $nl = if ($raw.Contains("`r`n")) { "`r`n" } else { "`n" }
  $parts = $raw -split "`r?`n"
  $clean = New-Object System.Collections.Generic.List[string]

  foreach ($line in $parts) {
    $clean.Add(($line -replace "[ `t]+$", ""))
  }

  while ($clean.Count -gt 0 -and $clean[$clean.Count - 1] -eq "") {
    $clean.RemoveAt($clean.Count - 1)
  }

  $final = ($clean -join $nl) + $nl
  if ($final -ne $raw) {
    if (-not $DryRun) {
      [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $path), $final, [System.Text.UTF8Encoding]::new($false))
    }
    $script:FixRows += [pscustomobject]@{ file = To-RepoPath $path; fix = "trim trailing whitespace" }
  }
}

function Get-RelativeImport([string]$fromFileRepoPath, [string]$toFileRepoPathNoExt) {
  $fromDir = Split-Path -Parent $fromFileRepoPath
  $fromAbs = From-RepoPath $fromDir
  $toAbs = From-RepoPath $toFileRepoPathNoExt

  $fromUri = [Uri]((Resolve-Path -LiteralPath $fromAbs).Path.TrimEnd("\") + "\")
  $toCandidate = $toAbs
  $toDir = Split-Path -Parent $toCandidate
  if (-not (Test-Path -LiteralPath $toDir)) {
    New-Item -ItemType Directory -Force -Path $toDir | Out-Null
  }
  $toUri = [Uri]$toCandidate

  $rel = $fromUri.MakeRelativeUri($toUri).ToString()
  $rel = $rel -replace "%20", " "
  if ($rel -notmatch "^\.\.") { $rel = "./$rel" }
  return $rel -replace "\\", "/"
}

function Resolve-ImportLiteralNoExt([string]$fromFileRepoPath, [string]$literal) {
  if ([string]::IsNullOrWhiteSpace($literal)) { return $null }
  if ($literal -notmatch "^\.") { return $null }

  $fromDir = Split-Path -Parent $fromFileRepoPath
  $combined = To-RepoPath (Join-Path (From-RepoPath $fromDir) $literal)
  $combined = $combined -replace "\\", "/"
  return Without-Extension $combined
}

function Update-RelativeImportsForMove([string]$oldRepoPath, [string]$newRepoPath) {
  $oldNoExt = Without-Extension $oldRepoPath
  $newNoExt = Without-Extension $newRepoPath

  foreach ($file in Product-Files) {
    $fileRepo = To-RepoPath $file.FullName
    $before = Get-Content -LiteralPath $file.FullName -Raw

    $after = [regex]::Replace($before, "(?<q>['""])(?<literal>\.{1,2}/[^'""]+)(?<q2>['""])", {
      param($m)

      $literal = $m.Groups["literal"].Value
      $resolvedNoExt = Resolve-ImportLiteralNoExt $fileRepo $literal

      if ($resolvedNoExt -eq $oldNoExt) {
        $nextLiteral = Get-RelativeImport $fileRepo $newNoExt
        $script:ImportRows += [pscustomobject]@{
          file = $fileRepo
          oldImport = $literal
          newImport = $nextLiteral
          movedFrom = $oldRepoPath
          movedTo = $newRepoPath
        }
        return $m.Groups["q"].Value + $nextLiteral + $m.Groups["q2"].Value
      }

      return $m.Value
    })

    if ($after -ne $before -and -not $DryRun) {
      [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $file.FullName), $after, [System.Text.UTF8Encoding]::new($false))
    }
  }
}

function Move-SourceFile([string]$oldRepoPath, [string]$newRepoPath, [string]$classification) {
  $oldAbs = From-RepoPath $oldRepoPath
  $newAbs = From-RepoPath $newRepoPath

  if ((Test-Path -LiteralPath $oldAbs) -and (Test-Path -LiteralPath $newAbs)) {
    Update-RelativeImportsForMove $oldRepoPath $newRepoPath
    $script:MovedRows += [pscustomobject]@{ old = $oldRepoPath; new = $newRepoPath; status = "SKIPPED_BOTH_EXIST"; classification = $classification }
    return
  }

  if ((-not (Test-Path -LiteralPath $oldAbs)) -and (Test-Path -LiteralPath $newAbs)) {
    Update-RelativeImportsForMove $oldRepoPath $newRepoPath
    $script:MovedRows += [pscustomobject]@{ old = $oldRepoPath; new = $newRepoPath; status = "ALREADY_MOVED_IMPORTS_ENSURED"; classification = $classification }
    return
  }

  if (-not (Test-Path -LiteralPath $oldAbs)) {
    $script:MovedRows += [pscustomobject]@{ old = $oldRepoPath; new = $newRepoPath; status = "SKIPPED_OLD_MISSING"; classification = $classification }
    return
  }

  Update-RelativeImportsForMove $oldRepoPath $newRepoPath

  if (-not $DryRun) {
    $newDir = Split-Path -Parent $newAbs
    New-Item -ItemType Directory -Force -Path $newDir | Out-Null

    $tracked = $false
    try { $tracked = $null -ne (git ls-files -- $oldRepoPath | Select-String -SimpleMatch $oldRepoPath) } catch {}
    if ($tracked) {
      git mv -- $oldRepoPath $newRepoPath | Out-Null
    } else {
      Move-Item -LiteralPath $oldAbs -Destination $newAbs -Force
    }
  }

  $script:MovedRows += [pscustomobject]@{ old = $oldRepoPath; new = $newRepoPath; status = if ($DryRun) { "DRY_RUN_MOVE" } else { "MOVED" }; classification = $classification }
}

function Replace-InFile([string]$repoPath, [scriptblock]$transform, [string]$fixName) {
  $abs = From-RepoPath $repoPath
  if (-not (Test-Path -LiteralPath $abs)) { return }

  $before = Get-Content -LiteralPath $abs -Raw
  $after = & $transform $before

  if ($after -ne $before) {
    if (-not $DryRun) {
      [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $abs), [string]$after, [System.Text.UTF8Encoding]::new($false))
    }
    $script:FixRows += [pscustomobject]@{ file = $repoPath; fix = $fixName }
  }
}

function Ensure-DshClientSurfaceExports {
  $surface = "dsh/frontend/app-client/DshClientSurface.tsx"
  if (-not (Test-Path -LiteralPath (From-RepoPath $surface))) { return }

  Replace-InFile $surface {
    param($text)
    $x = [string]$text
    $x = $x -replace "type DshSurfaceHostProps = \{", "export type DshClientSurfaceProps = {"
    $x = $x -replace "export function DshSurfaceHost\(([^)]*)\}: DshSurfaceHostProps\)", "export function DshClientSurface(`$1}: DshClientSurfaceProps)"
    $x = $x -replace "export \{ DshSurfaceHost \};", "export { DshClientSurface, DshClientSurface as DshSurfaceHost };"
    if ($x -notmatch "export type DshSurfaceHostProps = DshClientSurfaceProps;") {
      $x = $x -replace "(export type DshClientSurfaceProps = \{)", "export type DshSurfaceHostProps = DshClientSurfaceProps;`n`n`$1"
    }
    return $x
  } "rename DshSurfaceHost symbol to DshClientSurface with compatibility alias"

  Clean-TrailingWhitespace (From-RepoPath $surface)
}

function Ensure-WltDshContracts {
  $contractPath = "wlt/frontend/app-client/dsh/wlt-dsh-client.contract.ts"
  $previewPath = "wlt/frontend/app-client/dsh/wlt-dsh-client.preview-data.ts"
  $typesPath = "wlt/frontend/app-client/dsh/wlt-dsh-client.types.ts"
  $indexPath = "wlt/frontend/app-client/dsh/index.ts"

  $contract = @'
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

  $types = @'
export type WltDshClientBridgeOwnerKind = 'integration';
export type WltDshClientBridgeOwnerId = 'wlt.dsh';

export type WltDshClientPaymentMethod = {
  id: string;
  label: string;
  description?: string;
  balanceLabel?: string;
  enabled: boolean;
};
'@

  $preview = @'
import { wltDshClientBridgeDataContract } from './wlt-dsh-client.contract';

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
} as const;
'@

  $index = @'
export { wltDshClientBridgeDataContract } from './wlt-dsh-client.contract';
export { wltDshClientPaymentPreviewData } from './wlt-dsh-client.preview-data';
export type { WltDshClientBridgeOwnerId, WltDshClientBridgeOwnerKind, WltDshClientPaymentMethod } from './wlt-dsh-client.types';
export { WltDshClientPaymentPreview } from './WltDshClientPaymentPreview';
export { DshWltBalance as WltDshBalancePreview } from './WltDshBalancePreview';
export { DshWltConnector as WltDshConnectorPanel } from './WltDshConnectorPanel';
export { DshWltPaymentOption as WltDshPaymentOption } from './WltDshPaymentOption';
export { DshWltPaymentOptionsRow as WltDshPaymentOptionsRow } from './WltDshPaymentOptionsRow';
export { default as useWltDshWalletPreview } from './hooks/useWltDshWalletPreview';
'@

  foreach ($item in @(
    @{ path = $contractPath; content = $contract; name = "create WLT DSH contract" },
    @{ path = $typesPath; content = $types; name = "create WLT DSH types" },
    @{ path = $previewPath; content = $preview; name = "create WLT DSH preview-data" },
    @{ path = $indexPath; content = $index; name = "create WLT DSH public index" }
  )) {
    $abs = From-RepoPath $item.path
    $old = if (Test-Path -LiteralPath $abs) { Get-Content -LiteralPath $abs -Raw } else { "" }
    if ($old -ne $item.content) {
      if (-not $DryRun) {
        $dir = Split-Path -Parent $abs
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        [System.IO.File]::WriteAllText($abs, $item.content, [System.Text.UTF8Encoding]::new($false))
      }
      $script:FixRows += [pscustomobject]@{ file = $item.path; fix = $item.name }
    }
  }
}

function Ensure-DshClientRegistryAndRoutes {
  $routesPath = "dsh/frontend/app-client/dsh-client.routes.ts"
  $registryPath = "dsh/frontend/app-client/dsh-client.screen-registry.ts"

  $routes = @'
export type DshClientRouteId =
  | 'dsh-home'
  | 'dsh-entry'
  | 'dsh-my-space'
  | 'dsh-notifications'
  | 'dsh-store-items'
  | 'dsh-cart'
  | 'dsh-favorite-toggle'
  | 'dsh-favorites'
  | 'dsh-search'
  | 'dsh-store'
  | 'dsh-bell'
  | 'dsh-benefits'
  | 'dsh-conversation-workspace'
  | 'dsh-listing-status-update'
  | 'dsh-order-issue-workspace'
  | 'dsh-proxy-workspace'
  | 'dsh-service-settings'
  | 'dsh-zone-set'
  | 'dsh-orders'
  | 'dsh-tracking';

export type DshClientLegacyRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'notifications'
  | 'store-items'
  | 'cart-get'
  | 'favorite-toggle'
  | 'favorites-list'
  | 'search'
  | 'store-get'
  | 'bell'
  | 'benefits'
  | 'conversation-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'service-settings'
  | 'zone-set'
  | 'orders-list'
  | 'tracking';

export type DshClientRouteRecord = {
  readonly routeId: DshClientRouteId;
  readonly legacyRoute: DshClientLegacyRoute;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshClientRoutes = [
  { routeId: 'dsh-home', legacyRoute: 'home', screenId: 'client.dsh.home.feed', ownerPath: 'dsh/frontend/app-client/screens/HomeScreen.tsx' },
  { routeId: 'dsh-entry', legacyRoute: 'entry', screenId: 'client.dsh.entry', ownerPath: 'dsh/frontend/app-client/screens/EntryScreen.tsx' },
  { routeId: 'dsh-my-space', legacyRoute: 'my-space', screenId: 'client.dsh.my-space.home', ownerPath: 'dsh/frontend/app-client/screens/MySpaceScreen.tsx' },
  { routeId: 'dsh-notifications', legacyRoute: 'notifications', screenId: 'client.dsh.notifications.list', ownerPath: 'dsh/frontend/app-client/screens/NotificationsScreen.tsx' },
  { routeId: 'dsh-store-items', legacyRoute: 'store-items', screenId: 'client.dsh.store.items', ownerPath: 'dsh/frontend/app-client/screens/StoreItemsScreen.tsx' },
  { routeId: 'dsh-cart', legacyRoute: 'cart-get', screenId: 'client.dsh.cart.review', ownerPath: 'dsh/frontend/app-client/screens/CartScreen.tsx' },
  { routeId: 'dsh-favorite-toggle', legacyRoute: 'favorite-toggle', screenId: 'client.dsh.favorites.toggle', ownerPath: 'dsh/frontend/app-client/screens/FavoriteToggleScreen.tsx' },
  { routeId: 'dsh-favorites', legacyRoute: 'favorites-list', screenId: 'client.dsh.favorites.list', ownerPath: 'dsh/frontend/app-client/screens/FavoritesScreen.tsx' },
  { routeId: 'dsh-search', legacyRoute: 'search', screenId: 'client.dsh.discovery.search', ownerPath: 'dsh/frontend/app-client/screens/SearchScreen.tsx' },
  { routeId: 'dsh-store', legacyRoute: 'store-get', screenId: 'client.dsh.store.details', ownerPath: 'dsh/frontend/app-client/screens/StoreScreen.tsx' },
  { routeId: 'dsh-bell', legacyRoute: 'bell', screenId: 'client.dsh.bell', ownerPath: 'dsh/frontend/app-client/screens/BellScreen.tsx' },
  { routeId: 'dsh-benefits', legacyRoute: 'benefits', screenId: 'client.dsh.benefits.home', ownerPath: 'dsh/frontend/app-client/screens/BenefitsScreen.tsx' },
  { routeId: 'dsh-conversation-workspace', legacyRoute: 'conversation-workspace', screenId: 'client.dsh.conversation.workspace', ownerPath: 'dsh/frontend/app-client/screens/OperationScreens.tsx' },
  { routeId: 'dsh-listing-status-update', legacyRoute: 'listing-status-update', screenId: 'client.dsh.listing.status-update', ownerPath: 'dsh/frontend/app-client/screens/OperationScreens.tsx' },
  { routeId: 'dsh-order-issue-workspace', legacyRoute: 'order-issue-workspace', screenId: 'client.dsh.order.issue.workspace', ownerPath: 'dsh/frontend/app-client/screens/OperationScreens.tsx' },
  { routeId: 'dsh-proxy-workspace', legacyRoute: 'proxy-workspace', screenId: 'client.dsh.proxy.workspace', ownerPath: 'dsh/frontend/app-client/screens/OperationScreens.tsx' },
  { routeId: 'dsh-service-settings', legacyRoute: 'service-settings', screenId: 'client.dsh.service.settings', ownerPath: 'dsh/frontend/app-client/screens/OperationScreens.tsx' },
  { routeId: 'dsh-zone-set', legacyRoute: 'zone-set', screenId: 'client.dsh.zone.set', ownerPath: 'dsh/frontend/app-client/screens/OperationScreens.tsx' },
  { routeId: 'dsh-orders', legacyRoute: 'orders-list', screenId: 'client.dsh.orders.history', ownerPath: 'dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx' },
  { routeId: 'dsh-tracking', legacyRoute: 'tracking', screenId: 'client.dsh.order.tracking.live', ownerPath: 'dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx' },
] as const satisfies readonly DshClientRouteRecord[];
'@

  $registry = @'
export type ClientScreenRegistryItem = {
  readonly screenId: string;
  readonly routeId: string;
  readonly surfaceId: 'app-client';
  readonly ownerKind: 'app' | 'service' | 'integration';
  readonly ownerId: 'app-client' | 'dsh' | 'wlt' | 'wlt.dsh';
  readonly serviceId?: 'dsh' | 'wlt';
  readonly linkedServiceId?: 'dsh' | 'wlt';
  readonly ownerPath: string;
  readonly componentName: string;
  readonly screenKind: 'TAB_ROOT' | 'SCREEN_ENTRY' | 'FLOW_STEP' | 'MODAL' | 'SHEET';
  readonly flowId?: string;
  readonly routeParams?: Record<string, 'required' | 'optional'>;
  readonly requiredStates: readonly ('loading' | 'empty' | 'error' | 'success' | 'offline' | 'disabled' | 'retry' | 'blocked')[];
  readonly requiredPermissions?: readonly ('location' | 'notifications' | 'camera' | 'mediaLibrary')[];
  readonly analytics: {
    readonly screenView: string;
    readonly primaryEvents?: readonly string[];
  };
  readonly deepLinkPath?: string;
  readonly fallbackRouteId?: string;
  readonly releaseCriticality: 'P0' | 'P1' | 'P2';
  readonly status: 'TBD' | 'UNPROVEN' | 'VERIFIED' | 'CLOSED' | 'DEPRECATED';
};

export const dshClientScreenRegistry = [
  {
    screenId: 'client.dsh.home.feed',
    routeId: 'dsh-home',
    surfaceId: 'app-client',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-client/screens/HomeScreen.tsx',
    componentName: 'DshHomeGetScreen',
    screenKind: 'TAB_ROOT',
    flowId: 'dsh.discovery',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    analytics: { screenView: 'client_dsh_home_feed_view', primaryEvents: ['store_open', 'category_select', 'promo_open'] },
    deepLinkPath: '/dsh',
    fallbackRouteId: 'dsh-home',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'client.dsh.cart.review',
    routeId: 'dsh-cart',
    surfaceId: 'app-client',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    linkedServiceId: 'wlt',
    ownerPath: 'dsh/frontend/app-client/screens/CartScreen.tsx',
    componentName: 'DshCartUnifiedScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.checkout',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'blocked'],
    analytics: { screenView: 'client_dsh_cart_review_view', primaryEvents: ['checkout_continue', 'wallet_method_select'] },
    fallbackRouteId: 'dsh-home',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'client.dsh.order.tracking.live',
    routeId: 'dsh-tracking',
    surfaceId: 'app-client',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx',
    componentName: 'DshTrackingScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.order.fulfillment',
    routeParams: { orderId: 'optional' },
    requiredStates: ['loading', 'error', 'success', 'offline', 'retry', 'blocked'],
    requiredPermissions: ['location'],
    analytics: { screenView: 'client_dsh_order_tracking_live_view', primaryEvents: ['captain_call', 'support_open', 'map_refresh'] },
    deepLinkPath: '/dsh/orders/:orderId/tracking',
    fallbackRouteId: 'dsh-orders',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'client.wlt.dsh.payment.preview',
    routeId: 'wlt-dsh-payment-preview',
    surfaceId: 'app-client',
    ownerKind: 'integration',
    ownerId: 'wlt.dsh',
    serviceId: 'wlt',
    linkedServiceId: 'dsh',
    ownerPath: 'wlt/frontend/app-client/dsh/WltDshClientPaymentPreview.tsx',
    componentName: 'WltDshClientPaymentPreview',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.checkout.payment',
    requiredStates: ['loading', 'error', 'success', 'offline', 'blocked'],
    analytics: { screenView: 'client_wlt_dsh_payment_preview_view', primaryEvents: ['wallet_preview_render'] },
    fallbackRouteId: 'dsh-cart',
    releaseCriticality: 'P0',
    status: 'UNPROVEN',
  },
] as const satisfies readonly ClientScreenRegistryItem[];
'@

  foreach ($item in @(
    @{ path = $routesPath; content = $routes; fix = "create DSH client routes registry" },
    @{ path = $registryPath; content = $registry; fix = "create DSH client screen registry" }
  )) {
    $abs = From-RepoPath $item.path
    $old = if (Test-Path -LiteralPath $abs) { Get-Content -LiteralPath $abs -Raw } else { "" }
    if ($old -ne $item.content) {
      Write-Utf8NoBomResolved $abs $item.content
      $script:FixRows += [pscustomobject]@{ file = $item.path; fix = $item.fix }
    }
  }
}

function Ensure-DshIndex {
  $indexPath = "dsh/frontend/app-client/index.ts"
  $content = @'
export { DshClientSurface, DshClientSurface as DshSurfaceHost } from './DshClientSurface';
export type { DshClientSurfaceProps, DshSurfaceHostProps, DshCommandTarget } from './DshClientSurface';

export { DshHomeApprovedVideoReelsViewer } from './parts/ApprovedVideoReelsViewer';
export type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';

export { dshClientRoutes } from './dsh-client.routes';
export type { DshClientLegacyRoute, DshClientRouteId, DshClientRouteRecord } from './dsh-client.routes';

export { dshClientScreenRegistry } from './dsh-client.screen-registry';
export type { ClientScreenRegistryItem } from './dsh-client.screen-registry';

export type { DshClientState } from './data/client-state.preview-data';
export { getDshClientStateMeta, isDshClientExceptionState, isDshClientTerminalState, isDshClientWalletVisibleState } from './data/client-state.preview-data';
export type { DshClientBindingError, DshClientCartLine, DshClientCartSnapshot, DshClientOrderBindingSnapshot, DshClientStoreBindingSnapshot } from './data/dsh-client-binding.contracts';
'@

  $abs = From-RepoPath $indexPath
  $old = if (Test-Path -LiteralPath $abs) { Get-Content -LiteralPath $abs -Raw } else { "" }
  if ($old -ne $content) {
    Write-Utf8NoBomResolved $abs $content
    $script:FixRows += [pscustomobject]@{ file = $indexPath; fix = "minimize DSH client public index" }
  }
}

function Ensure-CompositionUsesDshClientSurface {
  $composition = "app-client/composition/index.ts"
  if (-not (Test-Path -LiteralPath (From-RepoPath $composition))) { return }

  Replace-InFile $composition {
    param($text)
    $x = [string]$text
    $x = $x -replace "\bDshSurfaceHost\b", "DshClientSurface"
    $x = $x -replace "SurfaceHost: typeof DshClientSurface", "SurfaceHost: typeof DshClientSurface"
    $x = $x -replace "export \{ DshClientSurface, DshHomeApprovedVideoReelsViewer \};", "export { DshClientSurface, DshClientSurface as DshSurfaceHost, DshHomeApprovedVideoReelsViewer };"
    if ($x -notmatch "DshClientSurface as DshSurfaceHost") {
      $x = $x -replace "export \{ DshClientSurface, DshHomeApprovedVideoReelsViewer \};", "export { DshClientSurface, DshClientSurface as DshSurfaceHost, DshHomeApprovedVideoReelsViewer };"
    }
    return $x
  } "use DshClientSurface in app-client composition"

  Clean-TrailingWhitespace (From-RepoPath $composition)
}

function Replace-InFile([string]$repoPath, [scriptblock]$transform, [string]$fixName) {
  $abs = From-RepoPath $repoPath
  if (-not (Test-Path -LiteralPath $abs)) { return }

  $before = Get-Content -LiteralPath $abs -Raw
  $after = & $transform $before

  if ($after -ne $before) {
    if (-not $DryRun) {
      [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $abs), [string]$after, [System.Text.UTF8Encoding]::new($false))
    }
    $script:FixRows += [pscustomobject]@{ file = $repoPath; fix = $fixName }
  }
}

function Ensure-StaticFixes {
  $viewerCandidates = @(
    "dsh/frontend/app-client/parts/ApprovedVideoReelsViewer.tsx",
    "dsh/frontend/app-client/DshHomeApprovedVideoReelsViewer.tsx"
  )

  foreach ($viewer in $viewerCandidates) {
    if (Test-Path -LiteralPath (From-RepoPath $viewer)) {
      Replace-InFile $viewer {
        param($text)
        $x = [string]$text
        if ($x -match "React\.ComponentType<any>") {
          if ($x -notmatch "StyleProp" -or $x -notmatch "ViewStyle") {
            $x = [regex]::Replace($x, "import \{ (?<imports>[^}]+) \} from 'react-native';", {
              param($m)
              $imports = $m.Groups["imports"].Value
              if ($imports -notmatch "StyleProp") { $imports += ", type StyleProp" }
              if ($imports -notmatch "ViewStyle") { $imports += ", type ViewStyle" }
              return "import { $imports } from 'react-native';"
            }, 1)
          }

          $x = [regex]::Replace($x, "type ExpoAvModule = \{\s*Video\?: React\.ComponentType<any>;\s*\};", @"
type ExpoVideoProps = {
  source: { uri: string };
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  shouldPlay?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  useNativeControls?: boolean;
  usePoster?: boolean;
  posterSource?: { uri: string };
};

type ExpoAvModule = {
  Video?: React.ComponentType<ExpoVideoProps>;
};
"@)
        }
        return $x
      } "replace React.ComponentType<any> with typed ExpoVideoProps"

      Clean-TrailingWhitespace (From-RepoPath $viewer)
    }
  }

  $homeCandidates = @(
    "dsh/frontend/app-client/screens/HomeScreen.tsx",
    "dsh/frontend/app-client/DshHomeGetScreen.tsx"
  )

  foreach ($home in $homeCandidates) {
    if (Test-Path -LiteralPath (From-RepoPath $home)) {
      Replace-InFile $home {
        param($text)
        $x = [string]$text
        $x = $x -replace "premiumBannerTopGlow", "bannerBrandAccentLine"
        $x = $x -replace "premiumBannerBottomGlow", "bannerSubtleAccentLine"
        $x = $x -replace "premiumBannerGlow", "bannerAccentLine"
        $x = $x -replace "Glow", "Accent"
        $x = $x -replace "glow", "accent"
        return $x
      } "remove old glow/premium visual-noise naming from DSH client home"

      Clean-TrailingWhitespace (From-RepoPath $home)
    }
  }
}

function Ensure-Docs {
  $blueprintPath = "dsh/SERVICE_BLUEPRINT.md"
  $docsDir = "dsh/docs"
  $docPath = "dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md"
  $runbookPath = "dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md"

  New-Item -ItemType Directory -Force -Path (From-RepoPath $docsDir) | Out-Null

  $section = @'
<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->
## DSH Client App-Scope Standardization

Canonical scope for closing DSH inside app-client:

- `dsh/frontend/app-client/**` is the DSH-owned client delivery surface.
- `wlt/frontend/app-client/dsh/**` is a WLT-owned DSH integration bridge.
- `wlt/frontend/shared/finance/**` is WLT-owned finance preview/contract support used by DSH checkout.
- `app-client/composition/**` and `app-client/shell/**` validate the client app integration boundary.
- `dsh/frontend/shared/**` is shared DSH frontend support and must not become a cross-service leak.

Ownership rules:

- No `core` service exists.
- App-owned screens use `ownerKind: 'app'` and `ownerId: 'app-client'`.
- DSH screens use `ownerKind: 'service'`, `ownerId: 'dsh'`, `serviceId: 'dsh'`.
- WLT-owned DSH integration uses `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, and `linkedServiceId: 'dsh'`.
- WLT owns money semantics; DSH owns delivery/order/customer flow semantics.
- Integration must use public bridge/contracts, not deep internal imports.

Client DSH structure:

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

WLT DSH bridge structure:

```text
wlt/frontend/app-client/dsh/
├─ index.ts
├─ wlt-dsh-client.contract.ts
├─ wlt-dsh-client.preview-data.ts
├─ wlt-dsh-client.types.ts
├─ WltDshClientPaymentPreview.tsx
├─ WltDshBalancePreview.tsx
├─ WltDshConnectorPanel.tsx
├─ WltDshPaymentOption.tsx
├─ WltDshPaymentOptionsRow.tsx
└─ hooks/useWltDshWalletPreview.ts
```

Release gates:

- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit`
- static source gate excluding `node_modules`, `.next`, `.expo`, `.turbo`, `tools/registry/runs`, and `dsh/_archive`
- app-client runtime smoke when available
- control-panel route smoke when available

<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->
'@

  if (Test-Path -LiteralPath (From-RepoPath $blueprintPath)) {
    $old = Get-Content -LiteralPath (From-RepoPath $blueprintPath) -Raw
  } else {
    $old = "# DSH Service Blueprint`n"
  }

  if ($old -match "(?s)<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->.*?<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->") {
    $new = [regex]::Replace($old, "(?s)<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->.*?<!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->", $section)
  } else {
    $new = $old.TrimEnd() + "`n`n" + $section + "`n"
  }

  if ($new -ne $old) {
    Write-Utf8NoBomResolved (From-RepoPath $blueprintPath) $new
    $script:DocRows += [pscustomobject]@{ file = $blueprintPath; action = "upsert standardization section" }
  }

  $doc = @'
# DSH Client App-Scope Standardization

This document is the repeatable standard for closing any service inside `app-client`.

## Scope rings

1. Primary service surface: `dsh/frontend/app-client/**`
2. Linked integration bridge: `wlt/frontend/app-client/dsh/**`
3. Linked finance support: `wlt/frontend/shared/finance/**`
4. App integration validation: `app-client/composition/**`, `app-client/shell/**`
5. Shared DSH support: `dsh/frontend/shared/**`

## Non-negotiable ownership

- No service named `core`.
- App-owned screens: `ownerKind: 'app'`, `ownerId: 'app-client'`.
- DSH-owned screens: `ownerKind: 'service'`, `ownerId: 'dsh'`, `serviceId: 'dsh'`.
- WLT DSH bridge: `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, `linkedServiceId: 'dsh'`.

## Canonical DSH client structure

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

## Screen registry policy

Only route/surface entries are registered as screens.
Parts, panels, sheets, viewers, preview-data, and preview-stores are classified, but not registered as screens.

## Data policy

Screens do not contain large static arrays.
Preview data lives under `data/`.
WLT money preview data remains WLT-owned and declares preview-only money semantics.

## UI policy

`Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only`.

## Evidence policy

Each run must create a session folder under `tools/registry/runs/{SESSION_ID}` and zip it with the same session folder name.
'@

  $runbook = @'
# DSH Client App-Scope Standardization Runbook

1. Fetch and record branch/head/origin-head.
2. Capture `git status --short` and `git diff --name-status`.
3. Move DSH client files into canonical structure.
4. Move WLT DSH bridge files into canonical WLT-owned bridge structure.
5. Update relative imports by resolving old paths to new paths.
6. Create/update:
   - `dsh-client.routes.ts`
   - `dsh-client.screen-registry.ts`
   - `wlt-dsh-client.contract.ts`
   - `wlt-dsh-client.preview-data.ts`
   - `wlt-dsh-client.types.ts`
   - `dsh-final-classification.csv`
7. Update `dsh/SERVICE_BLUEPRINT.md`.
8. Run static gate.
9. Run `git --no-pager diff --check`.
10. Run `pnpm -w exec tsc --noEmit`.
11. Run runtime smoke when available.
12. Produce patch and evidence zip.
13. If any gate fails, fix only the failing gate and repeat.
'@

  foreach ($item in @(
    @{ path = $docPath; content = $doc; action = "write standardization doc" },
    @{ path = $runbookPath; content = $runbook; action = "write standardization runbook" }
  )) {
    $abs = From-RepoPath $item.path
    $oldText = if (Test-Path -LiteralPath $abs) { Get-Content -LiteralPath $abs -Raw } else { "" }
    if ($oldText -ne $item.content) {
      Write-Utf8NoBomResolved $abs $item.content
      $script:DocRows += [pscustomobject]@{ file = $item.path; action = $item.action }
    }
  }
}

function Generate-Classification {
  $rows = @()

  foreach ($file in Product-Files) {
    $p = To-RepoPath $file.FullName
    $name = Split-Path -Leaf $p
    $classification = "SHARED_HELPER"
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

    if ($p -match "/screens/.*Screen\.tsx$") { $classification = "SCREEN_ENTRY" }
    elseif ($p -match "/parts/") { $classification = "SCREEN_PART" }
    elseif ($p -match "\.preview-data\.ts$") { $classification = "PREVIEW_DATA" }
    elseif ($p -match "\.preview-store\.ts$") { $classification = "PREVIEW_STORE" }
    elseif ($p -match "fixture|fixtures") { $classification = "FIXTURE" }
    elseif ($p -match "\.contract(s)?\.ts$") { $classification = "TYPE_CONTRACT" }
    elseif ($p -match "screen-registry\.ts$") { $classification = "SCREEN_REGISTRY" }
    elseif ($p -match "routes\.ts$") { $classification = "ROUTE_REGISTRY" }
    elseif ($p -match "\.css$") { $classification = "STYLE_MODULE" }
    elseif ($p -match "DshClientSurface\.tsx$|WltDsh.*Bridge\.tsx$") { $classification = "SURFACE_ENTRY" }

    $rows += [pscustomobject]@{
      path = $p
      classification = $classification
      ownerKind = $ownerKind
      ownerId = $ownerId
      serviceId = $serviceId
      linkedServiceId = $linkedServiceId
      sizeBytes = $file.Length
    }
  }

  $csv = Join-Path $Out "dsh-client-final-classification.csv"
  $rows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $csv

  $repoCsv = "dsh/docs/dsh-client-final-classification.csv"
  if (-not $DryRun) {
    Copy-Item -LiteralPath $csv -Destination (From-RepoPath $repoCsv) -Force
  }

  $script:DocRows += [pscustomobject]@{ file = $repoCsv; action = "update classification CSV" }
  return $rows
}

function Static-Gate {
  $files = Product-Files
  $primary = Primary-Files

  $definitions = @(
    @{ key = "operations_css_leak"; pattern = "operations[/\\]dsh-surface\.module\.css"; files = $files; blocker = $true },
    @{ key = "export_star"; pattern = "export\s+\*"; files = $files; blocker = $true },
    @{ key = "any_usage_primary"; pattern = "\bas\s+any\b|:\s*any\b|React\.ComponentType<any>"; files = $primary; blocker = $true },
    @{ key = "tamagui_outside_uikit"; pattern = "from ['""]tamagui['""]|from ['""]@tamagui"; files = $files; blocker = $true },
    @{ key = "deep_import_between_apps"; pattern = "from ['""][.]{2,}\/app-client|from ['""][.]{2,}\/app-partner|from ['""][.]{2,}\/app-captain|from ['""][.]{2,}\/app-field"; files = $files; blocker = $true },
    @{ key = "old_visual_noise"; pattern = "premiumGlass|glass|glow|purple|#8b5cf6|🎧|💰|⚙️"; files = $primary; blocker = $true },
    @{ key = "runtime_error_strings"; pattern = "Cannot read property 'default' of undefined|property is not writable|Box is not defined|Expected '</'|Module not found|Can't resolve|React is not defined"; files = $files; blocker = $true },
    @{ key = "newsticker_animated_remnants"; pattern = "NewsTickerBar[\s\S]{0,5000}(Animated\.Value|Animated\.loop|Animated\.timing|Animated\.View|Easing|AccessibilityInfo)"; files = $files; blocker = $true }
  )

  $rows = @()
  foreach ($definition in $definitions) {
    $matches = @($definition.files | Select-String -Pattern $definition.pattern -ErrorAction SilentlyContinue)
    $rows += [pscustomobject]@{
      check = $definition.key
      count = $matches.Count
      blocker = $definition.blocker
      status = if ($matches.Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
      sample = ($matches | Select-Object -First 25 | ForEach-Object { "$(To-RepoPath $_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
    }
  }

  $script:GateRows = $rows
  $rows | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "static-gate.json")
  $rows | Format-Table -AutoSize | Out-String -Width 1200 | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "static-gate.txt")
  return $rows
}

function Runtime-Smoke {
  $rows = @()

  if ($SkipRuntime) {
    $rows += [pscustomobject]@{ target = "app-client"; result = "SKIPPED_BY_FLAG" }
    $rows += [pscustomobject]@{ target = "control-panel"; result = "SKIPPED_BY_FLAG" }
    $script:RuntimeRows = $rows
    Write-CsvSafe $rows (Join-Path $Out "runtime-smoke.csv")
    return $rows
  }

  if ($null -ne (Get-Command adb -ErrorAction SilentlyContinue)) {
    & adb @("logcat", "-d", "-v", "time", "ReactNativeJS:V", "ReactNative:V", "Expo:V", "AndroidRuntime:E", "*:S") |
      Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "app-client-adb-logcat.txt")

    $adb = Read-Safe (Join-Path $Out "app-client-adb-logcat.txt")
    $bad = $adb -match "Cannot read property 'default' of undefined|property is not writable|NewsTickerBar|FATAL EXCEPTION|AndroidRuntime"
    $rows += [pscustomobject]@{ target = "app-client"; result = if ($bad) { "FAIL" } else { "PASS" } }
  } else {
    $rows += [pscustomobject]@{ target = "app-client"; result = "SKIPPED_NO_ADB" }
  }

  $port = $null
  foreach ($p in @(3000, 3010)) {
    try {
      $r = Invoke-WebRequest -Uri "http://localhost:$p/" -UseBasicParsing -TimeoutSec 8
      if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) {
        $port = $p
        break
      }
    } catch {}
  }

  if ($port) {
    $routeRows = @()
    foreach ($route in @("/", "/operations", "/finance", "/support", "/partners", "/marketing")) {
      try {
        $res = Invoke-WebRequest -Uri "http://localhost:$port$route" -UseBasicParsing -TimeoutSec 60
        $body = $res.Content | Out-String
        $bad = $body -match "Box is not defined|Expected '</'|Module not found|Can't resolve|React is not defined|Internal Server Error|Build Error|Runtime Error"
        $routeRows += [pscustomobject]@{ route = $route; statusCode = $res.StatusCode; pass = (-not $bad -and $res.StatusCode -lt 500) }
      } catch {
        $routeRows += [pscustomobject]@{ route = $route; statusCode = "REQUEST_FAILED"; pass = $false }
      }
    }

    $routeRows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath (Join-Path $Out "control-panel-route-smoke.csv")
    $rows += [pscustomobject]@{ target = "control-panel"; result = if (@($routeRows | Where-Object { $_.pass -ne $true }).Count -eq 0) { "PASS" } else { "FAIL" } }
  } else {
    $rows += [pscustomobject]@{ target = "control-panel"; result = "SKIPPED_NO_RUNNING_SERVER" }
  }

  $script:RuntimeRows = $rows
  Write-CsvSafe $rows (Join-Path $Out "runtime-smoke.csv")
  return $rows
}

function Apply-Structure {
  New-Item -ItemType Directory -Force -Path (From-RepoPath "dsh/frontend/app-client/screens") | Out-Null
  New-Item -ItemType Directory -Force -Path (From-RepoPath "dsh/frontend/app-client/parts") | Out-Null
  New-Item -ItemType Directory -Force -Path (From-RepoPath "dsh/frontend/app-client/data") | Out-Null
  New-Item -ItemType Directory -Force -Path (From-RepoPath "dsh/frontend/app-client/shared") | Out-Null

  $moves = @(
    @{ old = "dsh/frontend/app-client/DshSurfaceHost.tsx"; new = "dsh/frontend/app-client/DshClientSurface.tsx"; class = "SURFACE_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshAwnakOrderCreateScreen.tsx"; new = "dsh/frontend/app-client/screens/AwnakOrderScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshCartUnifiedScreen.tsx"; new = "dsh/frontend/app-client/screens/CartScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshClientBellScreen.tsx"; new = "dsh/frontend/app-client/screens/BellScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshEntryScreen.tsx"; new = "dsh/frontend/app-client/screens/EntryScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshFavoriteToggleScreen.tsx"; new = "dsh/frontend/app-client/screens/FavoriteToggleScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshFavoritesListScreen.tsx"; new = "dsh/frontend/app-client/screens/FavoritesScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshHomeGetScreen.tsx"; new = "dsh/frontend/app-client/screens/HomeScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshLoyaltyRewardsScreen.tsx"; new = "dsh/frontend/app-client/screens/LoyaltyRewardsScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshMySpaceCommercialScreen.tsx"; new = "dsh/frontend/app-client/screens/MySpaceCommercialScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshMySpaceOrdersScreen.tsx"; new = "dsh/frontend/app-client/screens/MySpaceOrdersScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshMySpaceScreen.tsx"; new = "dsh/frontend/app-client/screens/MySpaceScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshNotificationsScreen.tsx"; new = "dsh/frontend/app-client/screens/NotificationsScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshSearchScreen.tsx"; new = "dsh/frontend/app-client/screens/SearchScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshSheinOrderCreateScreen.tsx"; new = "dsh/frontend/app-client/screens/SheinOrderScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshStoreGetScreen.tsx"; new = "dsh/frontend/app-client/screens/StoreScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshStoreItemsScreen.tsx"; new = "dsh/frontend/app-client/screens/StoreItemsScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshSubscriptionsScreen.tsx"; new = "dsh/frontend/app-client/screens/SubscriptionsScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/SubscriptionsHubScreen.tsx"; new = "dsh/frontend/app-client/screens/BenefitsScreen.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/checkoutTracking.tsx"; new = "dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshClientOperationScreens.tsx"; new = "dsh/frontend/app-client/screens/OperationScreens.tsx"; class = "SCREEN_ENTRY" },
    @{ old = "dsh/frontend/app-client/DshOperationScreen.tsx"; new = "dsh/frontend/app-client/parts/OperationStatePanel.tsx"; class = "SCREEN_PART" },
    @{ old = "dsh/frontend/app-client/DshCartDetails.tsx"; new = "dsh/frontend/app-client/parts/CartDetailsPanel.tsx"; class = "SCREEN_PART" },
    @{ old = "dsh/frontend/app-client/DshHomeApprovedVideoReelsViewer.tsx"; new = "dsh/frontend/app-client/parts/ApprovedVideoReelsViewer.tsx"; class = "SCREEN_PART" },

    @{ old = "dsh/frontend/app-client/builders.ts"; new = "dsh/frontend/app-client/shared/dsh-client.builders.ts"; class = "SHARED_HELPER" },
    @{ old = "dsh/frontend/app-client/discoveryFixtures.ts"; new = "dsh/frontend/app-client/data/discovery.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshCategoriesFixtures.ts"; new = "dsh/frontend/app-client/data/categories.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshClientBinding.contracts.ts"; new = "dsh/frontend/app-client/data/dsh-client-binding.contracts.ts"; class = "TYPE_CONTRACT" },
    @{ old = "dsh/frontend/app-client/dshClientStateModel.ts"; new = "dsh/frontend/app-client/data/client-state.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshHomeGetFixtures.ts"; new = "dsh/frontend/app-client/data/home.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshMySpaceOrdersFixture.ts"; new = "dsh/frontend/app-client/data/my-space-orders.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshNotificationsFixtures.ts"; new = "dsh/frontend/app-client/data/notifications.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshStoreFixtures.ts"; new = "dsh/frontend/app-client/data/store.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/dshStoreTypes.ts"; new = "dsh/frontend/app-client/shared/store.types.ts"; class = "SHARED_HELPER" },
    @{ old = "dsh/frontend/app-client/getDshCategoryIconUrl.ts"; new = "dsh/frontend/app-client/shared/category-icon-url.ts"; class = "SHARED_HELPER" },
    @{ old = "dsh/frontend/app-client/itemsFixtures.ts"; new = "dsh/frontend/app-client/data/items.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/loyaltyCommercialDeck.ts"; new = "dsh/frontend/app-client/data/loyalty.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/mapMenuItemToProductCard.ts"; new = "dsh/frontend/app-client/shared/menu-item-product-card.mapper.ts"; class = "SHARED_HELPER" },
    @{ old = "dsh/frontend/app-client/resolve-image-source.ts"; new = "dsh/frontend/app-client/shared/resolve-image-source.ts"; class = "SHARED_HELPER" },
    @{ old = "dsh/frontend/app-client/resolveDevMediaUrl.ts"; new = "dsh/frontend/app-client/shared/resolve-dev-media-url.ts"; class = "SHARED_HELPER" },
    @{ old = "dsh/frontend/app-client/store-profile.ts"; new = "dsh/frontend/app-client/data/store-profile.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/subscriptionsCommercialDeck.ts"; new = "dsh/frontend/app-client/data/subscriptions.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/surface-catalog.ts"; new = "dsh/frontend/app-client/data/surface-catalog.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/surface-meta.ts"; new = "dsh/frontend/app-client/data/surface-meta.preview-data.ts"; class = "PREVIEW_DATA" },
    @{ old = "dsh/frontend/app-client/types.ts"; new = "dsh/frontend/app-client/dsh-client.types.ts"; class = "TYPE_CONTRACT" },

    @{ old = "wlt/frontend/app-client/dsh/DshWltBalance.tsx"; new = "wlt/frontend/app-client/dsh/WltDshBalancePreview.tsx"; class = "INTEGRATION_PART" },
    @{ old = "wlt/frontend/app-client/dsh/DshWltConnector.tsx"; new = "wlt/frontend/app-client/dsh/WltDshConnectorPanel.tsx"; class = "INTEGRATION_PART" },
    @{ old = "wlt/frontend/app-client/dsh/DshWltPaymentOption.tsx"; new = "wlt/frontend/app-client/dsh/WltDshPaymentOption.tsx"; class = "INTEGRATION_PART" },
    @{ old = "wlt/frontend/app-client/dsh/DshWltPaymentOptionsRow.tsx"; new = "wlt/frontend/app-client/dsh/WltDshPaymentOptionsRow.tsx"; class = "INTEGRATION_PART" },
    @{ old = "wlt/frontend/app-client/dsh/WltAdapter.ts"; new = "wlt/frontend/app-client/dsh/wlt-dsh-client.adapter.ts"; class = "INTEGRATION_ADAPTER" },
    @{ old = "wlt/frontend/app-client/dsh/hooks/useWlt.ts"; new = "wlt/frontend/app-client/dsh/hooks/useWltDshWalletPreview.ts"; class = "INTEGRATION_HOOK" }
  )

  foreach ($move in $moves) {
    Move-SourceFile $move.old $move.new $move.class
  }
}

function Fix-Known-PostMoveImports {
  # Preserve compatibility where existing modules import old names; these edits are path-only safe.
  $surface = "dsh/frontend/app-client/DshClientSurface.tsx"
  if (Test-Path -LiteralPath (From-RepoPath $surface)) {
    # The path mover handles most imports. Keep this hook for whitespace cleanup.
    Clean-TrailingWhitespace (From-RepoPath $surface)
  }

  foreach ($f in Product-Files) {
    Clean-TrailingWhitespace $f.FullName
  }
}

try {
  Step "00 Preflight evidence"
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

  Step "01 Baseline gates"
  $baseDiff = Run-Capture "baseline-diff-check.txt" { git --no-pager diff --check }
  $baseTsc = Run-Capture "baseline-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }

  if (-not [string]::IsNullOrWhiteSpace((Read-Safe $baseDiff.file))) {
    # Try whitespace cleanup in known scoped files, then continue.
    foreach ($f in Product-Files) { Clean-TrailingWhitespace $f.FullName }
    $baseDiff2 = Run-Capture "baseline-diff-check-after-whitespace-clean.txt" { git --no-pager diff --check }
    if (-not [string]::IsNullOrWhiteSpace((Read-Safe $baseDiff2.file))) {
      throw "BLOCKED_BASELINE_DIFF_CHECK"
    }
  }

  if (-not [string]::IsNullOrWhiteSpace((Read-Safe $baseTsc.file))) {
    Save "baseline-tsc-warning.txt" "Baseline tsc had output before structural standardization. Script will continue and final tsc will be authoritative."
  }

  Step "02 Apply canonical structure"
  Apply-Structure

  Step "03 Ensure surface/routes/registries/bridge"
  Ensure-DshClientSurfaceExports
  Ensure-DshClientRegistryAndRoutes
  Ensure-WltDshContracts
  Ensure-DshIndex
  Ensure-CompositionUsesDshClientSurface
  Ensure-StaticFixes
  Fix-Known-PostMoveImports

  Step "04 Update blueprint and docs"
  Ensure-Docs

  Step "05 Repeated verification and auto-fix loop"
  $FinalDiffPass = $false
  $FinalTscPass = $false
  $FinalStaticPass = $false

  for ($cycle = 1; $cycle -le $MaxCycles; $cycle++) {
    Step "05.$cycle Static gate"
    $gate = Static-Gate

    $blockers = @($gate | Where-Object { $_.blocker -eq $true -and [int]$_.count -gt 0 })
    $FinalStaticPass = $blockers.Count -eq 0

    Step "05.$cycle diff-check"
    $diffResult = Run-Capture "cycle-$cycle-git-diff-check.txt" { git --no-pager diff --check }
    $FinalDiffPass = [string]::IsNullOrWhiteSpace((Read-Safe $diffResult.file))

    if (-not $FinalDiffPass) {
      foreach ($f in Product-Files) { Clean-TrailingWhitespace $f.FullName }
      continue
    }

    Step "05.$cycle TypeScript"
    $tscResult = Run-Capture "cycle-$cycle-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
    $FinalTscPass = [string]::IsNullOrWhiteSpace((Read-Safe $tscResult.file))

    if ($FinalStaticPass -and $FinalDiffPass -and $FinalTscPass) {
      break
    }
  }

  Step "06 Runtime smoke"
  Runtime-Smoke | Out-Null

  Step "07 Final classification and evidence"
  $classificationRows = Generate-Classification

  Write-CsvSafe $script:MovedRows (Join-Path $Out "moves.csv")
  Write-CsvSafe $script:ImportRows (Join-Path $Out "import-updates.csv")
  Write-CsvSafe $script:FixRows (Join-Path $Out "fixes.csv")
  Write-CsvSafe $script:DocRows (Join-Path $Out "docs-updates.csv")
  Write-CsvSafe $script:RuntimeRows (Join-Path $Out "runtime-smoke-final.csv")

  $finalDiff = Run-Capture "git-diff-check.txt" { git --no-pager diff --check }
  $finalTsc = Run-Capture "tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
  $finalGate = Static-Gate

  $FinalDiffPass = [string]::IsNullOrWhiteSpace((Read-Safe $finalDiff.file))
  $FinalTscPass = [string]::IsNullOrWhiteSpace((Read-Safe $finalTsc.file))
  $FinalStaticPass = @($finalGate | Where-Object { $_.blocker -eq $true -and [int]$_.count -gt 0 }).Count -eq 0

  Run-Capture "git-status-final.txt" { git --no-pager status --short } | Out-Null
  Run-Capture "git-diff-name-status-final.txt" { git --no-pager diff --name-status } | Out-Null
  Run-Capture "LOCAL_CHANGE_REVIEW.patch" { git --no-pager diff -- . } | Out-Null
  Run-Capture "UNTRACKED_FILES.txt" { git ls-files --others --exclude-standard } | Out-Null

  $MovedCount = @($script:MovedRows | Where-Object { $_.status -match "MOVED|DRY_RUN_MOVE|ALREADY_MOVED" }).Count
  $FixCount = @($script:FixRows).Count
  $ImportCount = @($script:ImportRows).Count
  $DocsCount = @($script:DocRows).Count
  $RuntimeSummary = (@($script:RuntimeRows) | ForEach-Object { "$($_.target)=$($_.result)" }) -join "; "

  $Verdict = if ($FinalDiffPass -and $FinalTscPass -and $FinalStaticPass) { "PASS" } else { "FIX_REQUIRED" }

  $Report = @"
# DSH Client App-Scope Standardization

Session: $SessionId

## FINAL_VERDICT
$Verdict

## Summary
- moved/standardized files: $MovedCount
- import updates: $ImportCount
- fixes applied: $FixCount
- docs updates: $DocsCount
- classification rows: $(@($classificationRows).Count)

## Gates
- diff-check: $(if ($FinalDiffPass) { "PASS" } else { "FAIL" })
- tsc: $(if ($FinalTscPass) { "PASS" } else { "FAIL" })
- static gate: $(if ($FinalStaticPass) { "PASS" } else { "FAIL" })
- runtime: $RuntimeSummary

## Scope closed
- dsh/frontend/app-client
- wlt/frontend/app-client/dsh
- wlt/frontend/shared/finance validation
- app-client/composition validation
- app-client/shell validation
- dsh/frontend/shared validation

## Ownership decisions
- no serviceId='core'
- app-owned screens use ownerKind='app'
- DSH-owned screens use ownerKind='service', ownerId='dsh'
- WLT-owned DSH bridge uses ownerKind='integration', ownerId='wlt.dsh', serviceId='wlt', linkedServiceId='dsh'

## Evidence
- moves.csv
- import-updates.csv
- fixes.csv
- docs-updates.csv
- dsh-client-final-classification.csv
- static-gate.txt
- LOCAL_CHANGE_REVIEW.patch
"@

  $Report | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "FINAL_REPORT.md")

  if ($CommitAndPush) {
    if ($Verdict -eq "PASS") {
      Run-Capture "commit-push.txt" {
        git add -A
        git --no-pager diff --cached --check
        pnpm -w exec tsc --noEmit
        git commit -m "chore: standardize dsh client app scope"
        git push origin (git branch --show-current)
      } | Out-Null
    } else {
      Save "commit-push.txt" "SKIPPED: verdict=$Verdict"
    }
  } else {
    Save "commit-push.txt" "SKIPPED: pass -CommitAndPush to enable"
  }

  Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$SessionId.zip") -Force

  Write-Host ""
  Write-Host "FINAL_VERDICT=$Verdict"
  Write-Host "MOVED_COUNT=$MovedCount"
  Write-Host "IMPORT_UPDATES=$ImportCount"
  Write-Host "FIXES_APPLIED=$FixCount"
  Write-Host "DOCS_UPDATED=$DocsCount"
  Write-Host "DIFF_CHECK=$(if ($FinalDiffPass) { "PASS" } else { "FAIL" })"
  Write-Host "TSC=$(if ($FinalTscPass) { "PASS" } else { "FAIL" })"
  Write-Host "STATIC_GATE=$(if ($FinalStaticPass) { "PASS" } else { "FAIL" })"
  Write-Host "RUNTIME=$RuntimeSummary"
  Write-Host "EVIDENCE_FOLDER=$Out"
  Write-Host "EVIDENCE_ZIP=$(Join-Path $Out "$SessionId.zip")"
  Write-Host "REPORT=$(Join-Path $Out "FINAL_REPORT.md")"

  if ($Verdict -ne "PASS") {
    exit 2
  }
}
catch {
  $_ | Out-String | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Out "ERROR.txt")
  try {
    Write-CsvSafe $script:MovedRows (Join-Path $Out "moves.csv")
    Write-CsvSafe $script:ImportRows (Join-Path $Out "import-updates.csv")
    Write-CsvSafe $script:FixRows (Join-Path $Out "fixes.csv")
    Write-CsvSafe $script:DocRows (Join-Path $Out "docs-updates.csv")
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
