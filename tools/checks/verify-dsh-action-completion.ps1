param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [switch]$PlaceholderOnly
)

$ErrorActionPreference = 'Stop'

$AllowedStatuses = @(
  'ACCEPTED_PREVIEW_LABEL',
  'BLOCKED_BY_CONTRACT',
  'BLOCKED_BY_WLT',
  'MUST_REPLACE_WITH_PREVIEW_UI',
  'DEAD_PLACEHOLDER_REMOVE'
)

$ScreenFiles = @(
  'dsh/frontend/control-panel/operations/AssistedOrderDeskScreen.tsx',
  'dsh/frontend/control-panel/operations/OperationsHubScreen.tsx',
  'dsh/frontend/control-panel/operations/OrderRescueScreen.tsx',
  'dsh/frontend/control-panel/support/ManualCallIntakeWorkspace.tsx',
  'dsh/frontend/control-panel/support/Customer360Workspace.tsx',
  'dsh/frontend/control-panel/support/SupportHubScreens.tsx'
)

$MetadataFiles = @(
  'dsh/frontend/control-panel/operations/operations.registry.ts',
  'dsh/frontend/control-panel/operations/operations.types.ts',
  'dsh/frontend/shared/dsh-assisted-order.preview.ts',
  'dsh/frontend/shared/dsh-call-intake.preview.ts',
  'dsh/frontend/shared/dsh-customer-360.preview.ts',
  'dsh/frontend/shared/dsh-flow-registry.ts',
  'dsh/frontend/shared/dsh-order-rescue.preview.ts',
  'dsh/frontend/shared/dshCrossSurfaceClosureMap.ts',
  'dsh/frontend/shared/index.ts'
)

$TargetFiles = @($ScreenFiles + $MetadataFiles)

$Findings = New-Object System.Collections.Generic.List[object]
$PlaceholderRows = New-Object System.Collections.Generic.List[object]

function Add-Finding {
  param(
    [string]$Severity,
    [string]$Code,
    [string]$Path,
    [string]$Message
  )

  $Findings.Add([pscustomobject]@{
      severity = $Severity
      code = $Code
      path = $Path
      message = $Message
    }) | Out-Null
}

function Get-AbsolutePath {
  param([string]$RelativePath)
  return Join-Path $RepoRoot $RelativePath
}

function Get-FileText {
  param([string]$RelativePath)
  $AbsolutePath = Get-AbsolutePath $RelativePath
  if (-not (Test-Path -LiteralPath $AbsolutePath)) {
    Add-Finding 'FAIL' 'MISSING_FILE' $RelativePath 'Required file is missing.'
    return ''
  }

  return Get-Content -LiteralPath $AbsolutePath -Raw
}

function Get-FileLines {
  param([string]$RelativePath)
  $AbsolutePath = Get-AbsolutePath $RelativePath
  if (-not (Test-Path -LiteralPath $AbsolutePath)) {
    Add-Finding 'FAIL' 'MISSING_FILE' $RelativePath 'Required file is missing.'
    return @()
  }

  return Get-Content -LiteralPath $AbsolutePath
}

function Test-ScreenActionBlocks {
  foreach ($RelativePath in $ScreenFiles) {
    $Text = Get-FileText $RelativePath
    if ([string]::IsNullOrWhiteSpace($Text)) {
      continue
    }

    $Matches = [regex]::Matches($Text, '(?s)(primaryAction|secondaryAction|primary|secondary)\s*=\s*\{\{.*?\}\}')
    foreach ($Match in $Matches) {
      if ($Match.Value -notmatch 'onAction\s*:' -and $Match.Value -notmatch 'routeHint\s*:') {
        Add-Finding 'FAIL' 'CTA_MISSING_ONACTION_OR_ROUTE' $RelativePath "Action block '$($Match.Groups[1].Value)' is missing onAction/routeHint."
      }
    }
  }
}

function Test-ActionRouteHints {
  foreach ($RelativePath in $MetadataFiles) {
    $Lines = Get-FileLines $RelativePath
    for ($Index = 0; $Index -lt $Lines.Count; $Index++) {
      if ($Lines[$Index] -match 'actionId\s*:') {
        $WindowEnd = [Math]::Min($Index + 12, $Lines.Count - 1)
        $Window = ($Lines[$Index..$WindowEnd] -join "`n")
        if ($Window -notmatch 'routeHint\s*:' -and $Window -notmatch '\brouteHint\b') {
          Add-Finding 'FAIL' 'ACTION_MISSING_ROUTE_HINT' $RelativePath "actionId block near line $($Index + 1) is missing routeHint."
        }
      }
    }
  }
}

function Test-SignalRoutes {
  $SignalBuilderPath = 'dsh/frontend/shared/dsh-assisted-order.preview.ts'
  $SignalBuilderText = Get-FileText $SignalBuilderPath
  if ($SignalBuilderText -notmatch 'routeId\s*:' -or $SignalBuilderText -notmatch 'function buildDshSignalRoutePreview') {
    Add-Finding 'FAIL' 'SIGNAL_ROUTE_BUILDER_INCOMPLETE' $SignalBuilderPath 'Signal builder must expose routeId.'
  }

  foreach ($RelativePath in @(
      'dsh/frontend/shared/dsh-assisted-order.preview.ts',
      'dsh/frontend/shared/dsh-call-intake.preview.ts',
      'dsh/frontend/shared/dsh-customer-360.preview.ts',
      'dsh/frontend/shared/dsh-order-rescue.preview.ts'
    )) {
    $Text = Get-FileText $RelativePath
    if ($Text -match 'signal\s*:' -and $Text -notmatch 'buildDshSignalRoutePreview\(') {
      Add-Finding 'FAIL' 'SIGNAL_MISSING_ROUTE_ID' $RelativePath 'Signals must be created through buildDshSignalRoutePreview().'
    }
  }
}

function Test-RouteIds {
  $AllowedRoutePattern = 'routeId\s*:\s*''(cp\/(operations|support|finance|partners)\/[a-zA-Z0-9\-_]+|client\/orders\/tracking)'''
  foreach ($RelativePath in @(
      'dsh/frontend/shared/dsh-assisted-order.preview.ts',
      'dsh/frontend/shared/dsh-call-intake.preview.ts',
      'dsh/frontend/shared/dsh-customer-360.preview.ts',
      'dsh/frontend/shared/dsh-order-rescue.preview.ts'
    )) {
    $Lines = Get-FileLines $RelativePath
    for ($Index = 0; $Index -lt $Lines.Count; $Index++) {
      if ($Lines[$Index] -match "routeId\s*:\s*'") {
        if ($Lines[$Index] -notmatch $AllowedRoutePattern) {
          Add-Finding 'FAIL' 'UNSUPPORTED_ROUTE_ID' $RelativePath "Unsupported routeId near line $($Index + 1): $($Lines[$Index].Trim())"
        }
      }
    }
  }
}

function Test-WltReadOnly {
  foreach ($RelativePath in @(
      'dsh/frontend/shared/dsh-assisted-order.preview.ts',
      'dsh/frontend/shared/dsh-call-intake.preview.ts',
      'dsh/frontend/shared/dsh-customer-360.preview.ts',
      'dsh/frontend/shared/dsh-order-rescue.preview.ts'
    )) {
    $Lines = Get-FileLines $RelativePath
    for ($Index = 0; $Index -lt $Lines.Count; $Index++) {
      if ($Lines[$Index] -match "surfaceId\s*:\s*'wlt-finance'") {
        $WindowEnd = [Math]::Min($Index + 12, $Lines.Count - 1)
        $Window = ($Lines[$Index..$WindowEnd] -join "`n")
        if ($Window -notmatch 'readOnly\s*:\s*true') {
          Add-Finding 'FAIL' 'WLT_ACTION_NOT_READ_ONLY' $RelativePath "WLT action near line $($Index + 1) is missing readOnly: true."
        }
      }
    }

    $Text = Get-FileText $RelativePath
    if ($Text -match 'calculationTruthOwner' -and $Text -notmatch "calculationTruthOwner\s*:\s*'WLT'") {
      Add-Finding 'FAIL' 'WLT_OWNER_MISSING' $RelativePath 'WLT visibility objects must declare calculationTruthOwner: WLT.'
    }

    if ($Text -match 'mutationForbidden' -and $Text -notmatch 'mutationForbidden\s*:\s*true') {
      Add-Finding 'FAIL' 'WLT_MUTATION_FLAG_MISSING' $RelativePath 'WLT visibility objects must declare mutationForbidden: true.'
    }
  }
}

function Test-SensitiveActionAudit {
  $SensitiveRouteIds = @(
    'cp/operations/assisted-order-desk',
    'cp/operations/order-rescue',
    'cp/support/ticket',
    'cp/support/escalation'
  )

  foreach ($RelativePath in @(
      'dsh/frontend/shared/dsh-assisted-order.preview.ts',
      'dsh/frontend/shared/dsh-call-intake.preview.ts',
      'dsh/frontend/shared/dsh-customer-360.preview.ts',
      'dsh/frontend/shared/dsh-order-rescue.preview.ts'
    )) {
    $Lines = Get-FileLines $RelativePath
    for ($Index = 0; $Index -lt $Lines.Count; $Index++) {
      foreach ($RouteId in $SensitiveRouteIds) {
        if ($Lines[$Index] -match [regex]::Escape("routeId: '$RouteId'")) {
          $WindowEnd = [Math]::Min($Index + 12, $Lines.Count - 1)
          $Window = ($Lines[$Index..$WindowEnd] -join "`n")
          if ($Window -notmatch 'auditRequired\s*:\s*true' -and $Window -notmatch 'reasonRequired\s*:\s*true') {
            Add-Finding 'FAIL' 'SENSITIVE_ACTION_MISSING_AUDIT' $RelativePath "Sensitive route '$RouteId' near line $($Index + 1) is missing auditRequired/reasonRequired."
          }
        }
      }
    }
  }
}

function Test-ForbiddenNoise {
  $DshRoot = Join-Path $RepoRoot 'dsh/frontend'
  $AllDshFiles = Get-ChildItem -Path $DshRoot -Recurse -File -Include *.ts,*.tsx

  foreach ($File in $AllDshFiles) {
    $RelativePath = $File.FullName.Substring($RepoRoot.Length + 1).Replace('\', '/')
    $Text = Get-Content -LiteralPath $File.FullName -Raw

    if ($RelativePath -ne 'dsh/frontend/shared/dshCrossSurfaceClosureMap.ts' -and $Text -match 'console\.log') {
      Add-Finding 'FAIL' 'CONSOLE_LOG_FOUND' $RelativePath 'console.log is not allowed inside dsh/frontend.'
    }

    if ($Text -match "from 'tamagui'" -or $Text -match 'from "tamagui"') {
      Add-Finding 'FAIL' 'DIRECT_TAMAGUI_IMPORT' $RelativePath 'Direct Tamagui imports are not allowed inside dsh/frontend.'
    }
  }

  foreach ($RelativePath in $TargetFiles) {
    $Text = Get-FileText $RelativePath
    if ([string]::IsNullOrWhiteSpace($Text)) {
      continue
    }

    if ($RelativePath -ne 'dsh/frontend/shared/dshCrossSurfaceClosureMap.ts' -and $Text -match "status\s*:\s*'closed'|status\s*:\s*""closed""") {
      Add-Finding 'FAIL' 'CLOSED_STATUS_FOUND' $RelativePath 'status: closed is not allowed.'
    }

    if ($RelativePath -ne 'dsh/frontend/shared/dshCrossSurfaceClosureMap.ts' -and $Text -match 'pending-ui-gap') {
      Add-Finding 'FAIL' 'PENDING_UI_GAP_FOUND' $RelativePath 'pending-ui-gap is not allowed.'
    }

    if ($Text -match '#[0-9A-Fa-f]{3,8}') {
      Add-Finding 'FAIL' 'RAW_COLOR_FOUND' $RelativePath 'Raw hardcoded colors are not allowed.'
    }
  }
}

function Collect-PlaceholderRows {
  foreach ($RelativePath in $TargetFiles) {
    $Lines = Get-FileLines $RelativePath
    for ($Index = 0; $Index -lt $Lines.Count; $Index++) {
      if ($Lines[$Index] -match "(previewClassification|placeholderClassification)\s*:\s*'([A-Z_]+)'") {
        $Status = $Matches[2]
        $PlaceholderRows.Add([pscustomobject]@{
            file = $RelativePath
            line = $Index + 1
            status = $Status
          }) | Out-Null

        if ($AllowedStatuses -notcontains $Status) {
          Add-Finding 'FAIL' 'UNKNOWN_PLACEHOLDER_STATUS' $RelativePath "Unknown placeholder status '$Status' near line $($Index + 1)."
        }
      }
    }
  }

  foreach ($RelativePath in @(
      'dsh/frontend/control-panel/operations/OrderRescueScreen.tsx',
      'dsh/frontend/control-panel/operations/AssistedOrderDeskScreen.tsx',
      'dsh/frontend/control-panel/support/Customer360Workspace.tsx',
      'dsh/frontend/control-panel/support/ManualCallIntakeWorkspace.tsx'
    )) {
    $Text = Get-FileText $RelativePath
    if ($Text -match 'placeholder' -or $Text -match 'skeleton') {
      if ($Text -notmatch 'previewClassification' -and $Text -notmatch 'placeholderClassification' -and $Text -notmatch 'BLOCKED_BY_CONTRACT') {
        Add-Finding 'FAIL' 'UNCLASSIFIED_PLACEHOLDER' $RelativePath 'Placeholder/skeleton reference is not classified.'
      }
    }
  }
}

Collect-PlaceholderRows

if ($PlaceholderOnly) {
  Write-Host '# Placeholder Classification'
  if ($PlaceholderRows.Count -eq 0) {
    Write-Host 'NO_PLACEHOLDER_CLASSIFICATIONS_FOUND'
    exit 1
  }

  $Grouped = $PlaceholderRows | Group-Object status | Sort-Object Name
  foreach ($Group in $Grouped) {
    Write-Host ("STATUS {0}: {1}" -f $Group.Name, $Group.Count)
  }

  foreach ($Row in $PlaceholderRows) {
    Write-Host ("{0}:{1} -> {2}" -f $Row.file, $Row.line, $Row.status)
  }

  exit 0
}

Test-ScreenActionBlocks
Test-ActionRouteHints
Test-SignalRoutes
Test-RouteIds
Test-WltReadOnly
Test-SensitiveActionAudit
Test-ForbiddenNoise

$FailCount = @($Findings | Where-Object { $_.severity -eq 'FAIL' }).Count
$WarnCount = @($Findings | Where-Object { $_.severity -eq 'WARN' }).Count
$InfoCount = @($Findings | Where-Object { $_.severity -eq 'INFO' }).Count

Write-Host '# DSH Action Completion Guard'
Write-Host ("repo_root: {0}" -f $RepoRoot)
Write-Host ("target_files: {0}" -f $TargetFiles.Count)
Write-Host ("placeholder_rows: {0}" -f $PlaceholderRows.Count)
Write-Host ("failures: {0}" -f $FailCount)
Write-Host ("warnings: {0}" -f $WarnCount)
Write-Host ("infos: {0}" -f $InfoCount)

if ($Findings.Count -eq 0) {
  Write-Host 'GUARD_RESULT: OK'
} else {
  Write-Host 'GUARD_RESULT: FAIL'
  foreach ($Finding in $Findings) {
    Write-Host ("[{0}] {1} :: {2} :: {3}" -f $Finding.severity, $Finding.code, $Finding.path, $Finding.message)
  }
}

if ($FailCount -gt 0) {
  exit 1
}

exit 0
