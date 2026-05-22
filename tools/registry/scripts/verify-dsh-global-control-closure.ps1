param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [string]$OutputRoot = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
if (-not (Test-Path -LiteralPath $OutputRoot)) {
  New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}
$OutputRoot = (Resolve-Path -LiteralPath $OutputRoot).Path

Set-Location -LiteralPath $RepoRoot

$JsonPath = Join-Path $OutputRoot 'DSH_GLOBAL_CONTROL_GUARD_RESULT.json'
$ReportPath = Join-Path $OutputRoot 'DSH_GLOBAL_CONTROL_GUARD_REPORT.md'

$passes = [System.Collections.Generic.List[object]]::new()
$warnings = [System.Collections.Generic.List[object]]::new()
$failures = [System.Collections.Generic.List[object]]::new()

function Add-Item {
  param(
    [ValidateSet('PASS', 'WARN', 'FAIL')]
    [string]$Level,
    [string]$Check,
    [string]$Message,
    [string]$File = ''
  )

  $entry = [ordered]@{
    level = $Level
    check = $Check
    message = $Message
    file = $File
  }

  switch ($Level) {
    'PASS' { $passes.Add($entry) | Out-Null }
    'WARN' { $warnings.Add($entry) | Out-Null }
    'FAIL' { $failures.Add($entry) | Out-Null }
  }
}

function Get-FileText {
  param([string]$RelativePath)
  return Get-Content -LiteralPath (Join-Path $RepoRoot $RelativePath) -Raw
}

function Test-RequiredPattern {
  param(
    [string]$RelativePath,
    [string]$Pattern,
    [string]$Check,
    [string]$PassMessage,
    [string]$FailMessage
  )

  $text = Get-FileText $RelativePath
  if ($text -match $Pattern) {
    Add-Item -Level 'PASS' -Check $Check -Message $PassMessage -File $RelativePath
  } else {
    Add-Item -Level 'FAIL' -Check $Check -Message $FailMessage -File $RelativePath
  }
}

function Get-MatchesFromFiles {
  param(
    [string]$RootPath,
    [string]$Pattern,
    [string[]]$Extensions
  )

  $hits = [System.Collections.Generic.List[object]]::new()
  $regex = [regex]::new($Pattern)
  $files = Get-ChildItem -LiteralPath $RootPath -Recurse -File | Where-Object { $Extensions -contains $_.Extension }
  foreach ($file in $files) {
    $lines = Get-Content -LiteralPath $file.FullName
    for ($i = 0; $i -lt $lines.Count; $i++) {
      if ($regex.IsMatch($lines[$i])) {
        $hits.Add([ordered]@{
          file = $file.FullName.Substring($RepoRoot.Length + 1)
          line = $i + 1
          text = $lines[$i].Trim()
        }) | Out-Null
      }
    }
  }
  return $hits
}

function Add-HitSummary {
  param(
    [System.Collections.Generic.List[object]]$Hits,
    [string]$Check,
    [string]$EmptyPassMessage,
    [string]$FailurePrefix
  )

  if ($Hits.Count -eq 0) {
    Add-Item -Level 'PASS' -Check $Check -Message $EmptyPassMessage
    return
  }

  $preview = ($Hits | Select-Object -First 5 | ForEach-Object { "$($_.file):$($_.line) :: $($_.text)" }) -join '; '
  Add-Item -Level 'FAIL' -Check $Check -Message "$FailurePrefix $preview"
}

$requiredFiles = @(
  'dsh/frontend/shared/dsh-assisted-order.preview.ts',
  'dsh/frontend/shared/dsh-customer-360.preview.ts',
  'dsh/frontend/shared/dsh-call-intake.preview.ts',
  'dsh/frontend/shared/dsh-order-rescue.preview.ts',
  'dsh/frontend/shared/dsh-ops-intervention-playbook.preview.ts',
  'dsh/frontend/control-panel/operations/AssistedOrderDeskScreen.tsx',
  'dsh/frontend/control-panel/operations/OrderRescueScreen.tsx',
  'dsh/frontend/control-panel/support/Customer360Workspace.tsx',
  'dsh/frontend/control-panel/support/ManualCallIntakeWorkspace.tsx'
)

$missingFiles = @($requiredFiles | Where-Object { -not (Test-Path -LiteralPath (Join-Path $RepoRoot $_)) })
if ($missingFiles.Count -eq 0) {
  Add-Item -Level 'PASS' -Check 'required-files' -Message 'All required closure files exist in dsh/frontend.'
} else {
  Add-Item -Level 'FAIL' -Check 'required-files' -Message ("Missing required files: " + ($missingFiles -join ', '))
}

$flowRegistryPath = 'dsh/frontend/shared/dsh-flow-registry.ts'
$flowRegistryText = Get-FileText $flowRegistryPath

$requiredFlows = @(
  @{ Id = 'customer-360'; ScreenHint = 'support/Customer360Workspace' },
  @{ Id = 'manual-call-intake'; ScreenHint = 'support/ManualCallIntakeWorkspace' },
  @{ Id = 'assisted-order-desk'; ScreenHint = 'operations/AssistedOrderDeskScreen' },
  @{ Id = 'order-rescue'; ScreenHint = 'operations/OrderRescueScreen' },
  @{ Id = 'ops-intervention-playbook'; ScreenHint = 'operations/CommandCenter + ExceptionsEscalations' }
)

foreach ($flow in $requiredFlows) {
  if ($flowRegistryText -match "id:\s*'$([regex]::Escape($flow.Id))'(?s:.*?)screenHint:\s*'$([regex]::Escape($flow.ScreenHint))'") {
    Add-Item -Level 'PASS' -Check 'flow-registry' -Message "Registry entry is present for $($flow.Id)." -File $flowRegistryPath
  } else {
    Add-Item -Level 'FAIL' -Check 'flow-registry' -Message "Missing or incomplete registry entry for $($flow.Id)." -File $flowRegistryPath
  }
}

if ($flowRegistryText -match "(?s)id:\s*'order-rescue'.*?financialImpact:\s*true") {
  Add-Item -Level 'FAIL' -Check 'order-rescue-finance-boundary' -Message 'order-rescue still declares financialImpact=true. It must stay WLT-aware without becoming a finance-preview flow.' -File $flowRegistryPath
} else {
  Add-Item -Level 'PASS' -Check 'order-rescue-finance-boundary' -Message 'order-rescue no longer impersonates a finance-preview flow.' -File $flowRegistryPath
}

$signalPath = 'dsh/frontend/shared/dsh-signal-layer.model.ts'
$signalText = Get-FileText $signalPath
$requiredSignals = @(
  @{ Kind = 'manual_call_intake_requested'; Route = 'cp/support/call-intake'; Audit = 'true' },
  @{ Kind = 'customer_360_followup'; Route = 'cp/support/customer-360'; Audit = 'false' },
  @{ Kind = 'assisted_order_requested'; Route = 'cp/operations/assisted-order-desk'; Audit = 'true' },
  @{ Kind = 'order_rescue_requested'; Route = 'cp/operations/order-rescue'; Audit = 'true' },
  @{ Kind = 'partner_capacity_degraded'; Route = 'cp/partners/control'; Audit = 'true' },
  @{ Kind = 'catalog_conflict_detected'; Route = 'cp/catalogs/governance'; Audit = 'true' }
)

foreach ($signal in $requiredSignals) {
  $pattern = "kind:\s*'$([regex]::Escape($signal.Kind))'.*surfaces:\s*\[[^\]]+\].*routeId:\s*'$([regex]::Escape($signal.Route))'.*auditRequired:\s*$($signal.Audit)"
  if ($signalText -match $pattern) {
    Add-Item -Level 'PASS' -Check 'signals' -Message "Signal $($signal.Kind) has surfaces, route, and audit contract." -File $signalPath
  } else {
    Add-Item -Level 'FAIL' -Check 'signals' -Message "Signal contract is incomplete for $($signal.Kind)." -File $signalPath
  }
}

$operationsRegistryPath = 'dsh/frontend/control-panel/operations/operations.registry.ts'
$operationsHubPath = 'dsh/frontend/control-panel/operations/OperationsHubScreen.tsx'
$supportHubPath = 'dsh/frontend/control-panel/support/SupportHubScreens.tsx'
$financeHubPath = 'dsh/frontend/control-panel/finance/FinanceHubScreen.tsx'
$ticketPreviewPath = 'dsh/frontend/shared/operations-support.preview.ts'

Test-RequiredPattern -RelativePath $operationsRegistryPath -Pattern "assisted-order-desk" -Check 'operations-registry' -PassMessage 'operations registry contains assisted-order-desk.' -FailMessage 'operations registry is missing assisted-order-desk.'
Test-RequiredPattern -RelativePath $operationsRegistryPath -Pattern "order-rescue" -Check 'operations-registry' -PassMessage 'operations registry contains order-rescue.' -FailMessage 'operations registry is missing order-rescue.'
Test-RequiredPattern -RelativePath $operationsHubPath -Pattern "AssistedOrderDeskScreen" -Check 'operations-hub' -PassMessage 'Operations hub renders AssistedOrderDeskScreen.' -FailMessage 'Operations hub does not wire AssistedOrderDeskScreen.'
Test-RequiredPattern -RelativePath $operationsHubPath -Pattern "OrderRescueScreen" -Check 'operations-hub' -PassMessage 'Operations hub renders OrderRescueScreen.' -FailMessage 'Operations hub does not wire OrderRescueScreen.'
Test-RequiredPattern -RelativePath $supportHubPath -Pattern "customer-360" -Check 'support-hub' -PassMessage 'Support hub includes customer-360 tab wiring.' -FailMessage 'Support hub is missing customer-360 wiring.'
Test-RequiredPattern -RelativePath $supportHubPath -Pattern "call-intake" -Check 'support-hub' -PassMessage 'Support hub includes call-intake tab wiring.' -FailMessage 'Support hub is missing call-intake wiring.'
Test-RequiredPattern -RelativePath $financeHubPath -Pattern "WLT visibility consumers" -Check 'finance-boundary' -PassMessage 'Finance hub exposes WLT visibility consumers as read-only references.' -FailMessage 'Finance hub is missing the WLT visibility consumer panel.'

$workspaceBindings = @(
  @{ File = 'dsh/frontend/control-panel/operations/AssistedOrderDeskScreen.tsx'; Name = 'AssistedOrderDeskScreen' },
  @{ File = 'dsh/frontend/control-panel/operations/OrderRescueScreen.tsx'; Name = 'OrderRescueScreen' },
  @{ File = 'dsh/frontend/control-panel/support/Customer360Workspace.tsx'; Name = 'Customer360Workspace' },
  @{ File = 'dsh/frontend/control-panel/support/ManualCallIntakeWorkspace.tsx'; Name = 'ManualCallIntakeWorkspace' }
)

foreach ($binding in $workspaceBindings) {
  $text = Get-FileText $binding.File
  if ($text -match "WebControlPanelDecisionRow" -and $text -match "primaryAction" -and $text -match "onAction:") {
    Add-Item -Level 'PASS' -Check 'workspace-cta-binding' -Message "$($binding.Name) exposes actionable decision rows." -File $binding.File
  } else {
    Add-Item -Level 'FAIL' -Check 'workspace-cta-binding' -Message "$($binding.Name) is missing a wired CTA or action handler." -File $binding.File
  }
}

$callIntakeText = Get-FileText 'dsh/frontend/shared/dsh-call-intake.preview.ts'
$callIntakeSources = [regex]::Matches($callIntakeText, "source:\s*'([^']+)'") | ForEach-Object { $_.Groups[1].Value }
if ($callIntakeSources.Count -gt 0 -and (@($callIntakeSources | Select-Object -Unique) -join ',') -eq 'external_phone_manual') {
  Add-Item -Level 'PASS' -Check 'call-intake-source' -Message 'Manual Call Intake preview locks source=external_phone_manual.' -File 'dsh/frontend/shared/dsh-call-intake.preview.ts'
} else {
  Add-Item -Level 'FAIL' -Check 'call-intake-source' -Message 'Manual Call Intake preview contains a missing or non-manual source.' -File 'dsh/frontend/shared/dsh-call-intake.preview.ts'
}

$assistedOrderText = Get-FileText 'dsh/frontend/shared/dsh-assisted-order.preview.ts'
if ($assistedOrderText -match "auditFlags:\s*\[\s*\]" ) {
  Add-Item -Level 'FAIL' -Check 'assisted-order-audit' -Message 'Assisted Order preview contains an empty auditFlags array.' -File 'dsh/frontend/shared/dsh-assisted-order.preview.ts'
} elseif ($assistedOrderText -match "auditFlags:\s*\[") {
  Add-Item -Level 'PASS' -Check 'assisted-order-audit' -Message 'Assisted Order preview carries explicit audit flags.' -File 'dsh/frontend/shared/dsh-assisted-order.preview.ts'
} else {
  Add-Item -Level 'FAIL' -Check 'assisted-order-audit' -Message 'Assisted Order preview is missing auditFlags.' -File 'dsh/frontend/shared/dsh-assisted-order.preview.ts'
}

$orderRescueText = Get-FileText 'dsh/frontend/shared/dsh-order-rescue.preview.ts'
if ($orderRescueText -match "blocker:\s*''") {
  Add-Item -Level 'FAIL' -Check 'order-rescue-blocker' -Message 'Order Rescue contains an empty blocker.' -File 'dsh/frontend/shared/dsh-order-rescue.preview.ts'
} elseif ($orderRescueText -match "blocker:\s*'") {
  Add-Item -Level 'PASS' -Check 'order-rescue-blocker' -Message 'Order Rescue preview keeps a blocker for each rescue case.' -File 'dsh/frontend/shared/dsh-order-rescue.preview.ts'
} else {
  Add-Item -Level 'FAIL' -Check 'order-rescue-blocker' -Message 'Order Rescue preview is missing blocker text.' -File 'dsh/frontend/shared/dsh-order-rescue.preview.ts'
}

$ticketText = Get-FileText $ticketPreviewPath
$ticketCount = [regex]::Matches($ticketText, "ticketId:\s*'").Count
$categoryCount = [regex]::Matches($ticketText, "categoryLabel:\s*'").Count
$outcomeCount = [regex]::Matches($ticketText, "outcomeLabel:\s*'").Count
if ($ticketCount -gt 0 -and $categoryCount -ge $ticketCount -and $outcomeCount -ge $ticketCount) {
  Add-Item -Level 'PASS' -Check 'support-taxonomy' -Message 'Support tickets expose categoryLabel and outcomeLabel for each preview ticket.' -File $ticketPreviewPath
} else {
  Add-Item -Level 'FAIL' -Check 'support-taxonomy' -Message "Support ticket taxonomy is incomplete. ticketCount=$ticketCount categoryCount=$categoryCount outcomeCount=$outcomeCount." -File $ticketPreviewPath
}

$closureFiles = @(
  'dsh/frontend/shared/dshCrossSurfaceClosureMap.ts',
  'dsh/frontend/shared/dsh-flow-registry.ts'
)
$allowedClosureStatuses = @('needs-visual-evidence', 'blocked-by-wlt', 'blocked-by-contract')
$invalidStatuses = [System.Collections.Generic.List[string]]::new()
foreach ($file in $closureFiles) {
  $text = Get-FileText $file
  $matches = [regex]::Matches($text, "(?:status|evidenceStatus):\s*'([^']+)'")
  foreach ($match in $matches) {
    $value = $match.Groups[1].Value
    if ($allowedClosureStatuses -notcontains $value) {
      $invalidStatuses.Add("$file::$value") | Out-Null
    }
  }
}
if ($invalidStatuses.Count -eq 0) {
  Add-Item -Level 'PASS' -Check 'closure-statuses' -Message 'Closure maps only use allowed final statuses.'
} else {
  Add-Item -Level 'FAIL' -Check 'closure-statuses' -Message ('Invalid closure statuses detected: ' + ($invalidStatuses -join ', '))
}

$rawColorHits = Get-MatchesFromFiles -RootPath (Join-Path $RepoRoot 'dsh/frontend') -Extensions @('.ts', '.tsx') -Pattern "(?i)\b(?:color|background|backgroundColor|borderColor|fill|stroke)\s*(?:=|:)\s*['""][#][0-9a-f]{3,8}['""]"
Add-HitSummary -Hits $rawColorHits -Check 'raw-colors' -EmptyPassMessage 'No actual raw CSS hex color assignments were found in dsh/frontend.' -FailurePrefix 'Raw CSS hex color assignments detected:'

$tamaguiHits = Get-MatchesFromFiles -RootPath (Join-Path $RepoRoot 'dsh/frontend') -Extensions @('.ts', '.tsx') -Pattern "(?i)(from ['""]tamagui['""]|from ['""]@tamagui/)"
Add-HitSummary -Hits $tamaguiHits -Check 'direct-tamagui' -EmptyPassMessage 'No direct Tamagui imports were found under dsh/frontend.' -FailurePrefix 'Direct Tamagui imports detected:'

$consoleHits = Get-MatchesFromFiles -RootPath (Join-Path $RepoRoot 'dsh/frontend') -Extensions @('.ts', '.tsx') -Pattern "console\.log\("
Add-HitSummary -Hits $consoleHits -Check 'console-log' -EmptyPassMessage 'No console.log statements were found under dsh/frontend.' -FailurePrefix 'console.log statements detected:'

$pendingGapHits = Get-MatchesFromFiles -RootPath (Join-Path $RepoRoot 'dsh/frontend') -Extensions @('.ts', '.tsx', '.md') -Pattern "pending-ui-gap"
Add-HitSummary -Hits $pendingGapHits -Check 'pending-ui-gap' -EmptyPassMessage 'No pending-ui-gap markers were found in dsh/frontend.' -FailurePrefix 'pending-ui-gap markers detected:'

$closedStatusHits = Get-MatchesFromFiles -RootPath (Join-Path $RepoRoot 'dsh/frontend') -Extensions @('.ts', '.tsx', '.md') -Pattern "status:\s*'closed'"
Add-HitSummary -Hits $closedStatusHits -Check 'closed-status' -EmptyPassMessage "No status: 'closed' markers were found in dsh/frontend." -FailurePrefix "status: 'closed' markers detected:"

$financeWordingHits = Get-MatchesFromFiles -RootPath (Join-Path $RepoRoot 'dsh/frontend') -Extensions @('.ts', '.tsx') -Pattern "(?i)(?:بدء|تنفيذ|إطلاق|تعديل|create|start|execute|trigger|change)\s+(?:refund|settlement|payout|ledger|wallet|استرداد|تسوية|محفظة)"
$financeMutationViolations = [System.Collections.Generic.List[object]]::new()
foreach ($hit in $financeWordingHits) {
  $fullPath = Join-Path $RepoRoot $hit.file
  $contextLines = Get-Content -LiteralPath $fullPath
  $startIndex = [Math]::Max(0, $hit.line - 6)
  $endIndex = [Math]::Min($contextLines.Count - 1, $hit.line)
  $contextWindow = ($contextLines[$startIndex..$endIndex] -join ' ')
  if ($contextWindow -notmatch '(?i)(forbiddenActions|WLT|wlt|read-only|visibility|blocked-by-wlt|wltBoundary|forbidden)') {
    $financeMutationViolations.Add($hit) | Out-Null
  }
}
Add-HitSummary -Hits $financeMutationViolations -Check 'finance-mutation-wording' -EmptyPassMessage 'No direct DSH finance-mutation wording was found outside WLT/forbidden contexts.' -FailurePrefix 'Potential finance-mutation wording detected outside safe contexts:'

$resultStatus = if ($failures.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }

$result = [ordered]@{
  status = $resultStatus
  repo_root = $RepoRoot
  output_root = $OutputRoot
  generated_at = (Get-Date).ToString('o')
  summary = [ordered]@{
    pass = $passes.Count
    warn = $warnings.Count
    fail = $failures.Count
  }
  passes = @($passes)
  warnings = @($warnings)
  failures = @($failures)
}

$result | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $JsonPath -Encoding UTF8

$reportLines = [System.Collections.Generic.List[string]]::new()
$reportLines.Add('# DSH Global Control Guard Report') | Out-Null
$reportLines.Add('') | Out-Null
$reportLines.Add("- status: $resultStatus") | Out-Null
$reportLines.Add("- repo_root: $RepoRoot") | Out-Null
$reportLines.Add("- output_root: $OutputRoot") | Out-Null
$reportLines.Add("- generated_at: $($result.generated_at)") | Out-Null
$reportLines.Add("- pass: $($passes.Count)") | Out-Null
$reportLines.Add("- warn: $($warnings.Count)") | Out-Null
$reportLines.Add("- fail: $($failures.Count)") | Out-Null

foreach ($group in @(
  @{ Name = 'Failures'; Items = @($failures) },
  @{ Name = 'Warnings'; Items = @($warnings) },
  @{ Name = 'Passes'; Items = @($passes) }
)) {
  $reportLines.Add('') | Out-Null
  $reportLines.Add("## $($group.Name)") | Out-Null
  if ($group.Items.Count -eq 0) {
    $reportLines.Add('- none') | Out-Null
    continue
  }

  foreach ($item in $group.Items) {
    $fileSuffix = if ([string]::IsNullOrWhiteSpace($item.file)) { '' } else { " [$($item.file)]" }
    $reportLines.Add("- $($item.check)$fileSuffix :: $($item.message)") | Out-Null
  }
}

$reportLines | Set-Content -LiteralPath $ReportPath -Encoding UTF8

Write-Host "status: $resultStatus"
Write-Host "json: $JsonPath"
Write-Host "report: $ReportPath"
Write-Host "pass: $($passes.Count)"
Write-Host "warn: $($warnings.Count)"
Write-Host "fail: $($failures.Count)"

if ($resultStatus -eq 'FAIL') {
  exit 1
}

exit 0
