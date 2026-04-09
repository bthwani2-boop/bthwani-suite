Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"

$RepoRoot  = "C:\Users\b\Documents\GitHub\bthwani-suite"
$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal"
$Service   = "dsh"
$SessionId = (Get-Date -Format "yyyyMMdd-HHmmss")

$RunRoot   = Join-Path $RepoRoot ("kdt\volatile\registry\runs\" + $SessionId + "\dsh-rebuild-ready-surface-normalization")
$DocsRoot  = Join-Path $RepoRoot ("docs\services\" + $Service)

New-Item -ItemType Directory -Force -Path $RunRoot  | Out-Null
New-Item -ItemType Directory -Force -Path $DocsRoot | Out-Null

function Normalize-SurfaceName {
  param([string]$Name)
  $n = ("" + $Name).ToLowerInvariant().Trim()
  switch -Regex ($n) {
    '^(app-user|user|client|app-client)$'       { return 'app-client' }
    '^(app-partner|partner|merchant)$'          { return 'app-partner' }
    '^(app-captain|captain|driver)$'            { return 'app-captain' }
    '^(app-field|field|agent)$'                 { return 'app-field' }
    '^(mcpw|control-panel|controlpanel|admin|ops)$' { return 'control-panel' }
    '^(webapp)$'                                { return 'webapp' }
    '^(website|web)$'                           { return 'website' }
    default                                     { return 'unknown' }
  }
}

function Infer-SurfaceFromPath {
  param([string]$Path)
  $p = ("" + $Path).Replace('\','/').ToLowerInvariant()
  if     ($p -match '/app-client/'    -or $p -match '/client/'    -or $p -match '/consumer/' -or $p -match '/customer/') { return 'app-client' }
  elseif ($p -match '/app-partner/'   -or $p -match '/partner/'   -or $p -match '/merchant/' -or $p -match '/store/')    { return 'app-partner' }
  elseif ($p -match '/app-captain/'   -or $p -match '/captain/'   -or $p -match '/driver/')                               { return 'app-captain' }
  elseif ($p -match '/app-field/'     -or $p -match '/field/'     -or $p -match '/agent/')                                { return 'app-field' }
  elseif ($p -match '/control-panel/' -or $p -match '/mcpw/'      -or $p -match '/admin/' -or $p -match '/ops/')         { return 'control-panel' }
  elseif ($p -match '/webapp/')                                                                                              { return 'webapp' }
  elseif ($p -match '/website/')                                                                                             { return 'website' }
  else                                                                                                                       { return 'unknown' }
}

function Infer-SurfaceFromOperation {
  param([string]$Operation)
  $op = ("" + $Operation).ToLowerInvariant()

  if ($op -match '^dsh_captain_' -or $op -match 'captain' -or $op -match 'delivery_(attempt|position|eta|track|reassign)') {
    return 'app-captain'
  }
  if ($op -match '^dsh_field_' -or $op -match 'field_' -or $op -match 'geo_pin' -or $op -match 'activation_request') {
    return 'app-field'
  }
  if ($op -match '^dsh_partner_' -or $op -match 'partner' -or $op -match 'merchant' -or $op -match 'catalog_' -or $op -match 'store_' -or $op -match 'inventory') {
    return 'app-partner'
  }
  if ($op -match 'admin' -or $op -match 'ops' -or $op -match 'support' -or $op -match 'approval' -or $op -match 'review' -or $op -match 'report') {
    return 'control-panel'
  }
  if (
    $op -match 'cart_' -or
    $op -match 'checkout' -or
    $op -match 'estimate' -or
    $op -match 'external_order_create' -or
    $op -match 'entitlements_get' -or
    $op -match 'chat_' -or
    $op -match 'address' -or
    $op -match 'payment' -or
    $op -match 'order_' -or
    $op -match 'track_' -or
    $op -match 'delivery_track_get'
  ) {
    return 'app-client'
  }

  return 'unknown'
}

function Merge-Evidence {
  param([string[]]$Parts)
  return (($Parts | Where-Object { $_ -and $_.Trim() -ne "" } | Select-Object -Unique) -join '; ')
}

$screenInventoryCsv = Join-Path $DocsRoot "02_SCREEN_INVENTORY.csv"
$opScreenCsv        = Join-Path $DocsRoot "03_OPERATION_SCREEN_MATRIX.csv"
$repairCsv          = Join-Path $DocsRoot "06_SURFACE_COVERAGE_REPAIR.csv"
$readyCsv           = Join-Path $DocsRoot "08_REBUILD_READY_CANDIDATES.csv"

foreach ($required in @($screenInventoryCsv,$opScreenCsv,$repairCsv,$readyCsv)) {
  if (-not (Test-Path $required)) {
    Write-Host "[FAIL] Missing prerequisite file: $required"
    exit 1
  }
}

$screenInventory = @(Import-Csv -LiteralPath $screenInventoryCsv)
$opScreen        = @(Import-Csv -LiteralPath $opScreenCsv)
$repairRows      = @(Import-Csv -LiteralPath $repairCsv)
$readyRows       = @(Import-Csv -LiteralPath $readyCsv)

$screenByName = @{}
foreach ($row in $screenInventory) {
  $k = ("" + $row.ScreenName).Trim()
  if (-not $screenByName.ContainsKey($k)) { $screenByName[$k] = @() }
  $screenByName[$k] += $row
}

$repairByScreen = @{}
foreach ($row in $repairRows) {
  $k = ("" + $row.ScreenName).Trim()
  if (-not [string]::IsNullOrWhiteSpace($k)) {
    if (-not $repairByScreen.ContainsKey($k)) { $repairByScreen[$k] = @() }
    $repairByScreen[$k] += $row
  }
}

$linksByScreen = @{}
foreach ($row in $opScreen) {
  $k = ("" + $row.ScreenName).Trim()
  if (-not [string]::IsNullOrWhiteSpace($k)) {
    if (-not $linksByScreen.ContainsKey($k)) { $linksByScreen[$k] = @() }
    $linksByScreen[$k] += $row
  }
}

$normalized = New-Object 'System.Collections.Generic.List[object]'
$wave1      = New-Object 'System.Collections.Generic.List[object]'

foreach ($row in $readyRows) {
  $candidateName = ("" + $row.CandidateName).Trim()
  $queueType     = ("" + $row.QueueType).Trim()
  $surfaceRaw    = Normalize-SurfaceName -Name $row.Surface
  $operation     = ("" + $row.Operation).Trim()

  $evidence = New-Object 'System.Collections.Generic.List[string]'
  $normalizedSurface = $surfaceRaw

  $relatedScreens = @()
  if ($screenByName.ContainsKey($candidateName)) { $relatedScreens = @($screenByName[$candidateName]) }

  $relatedLinks = @()
  if ($linksByScreen.ContainsKey($candidateName)) { $relatedLinks = @($linksByScreen[$candidateName]) }

  $relatedRepairs = @()
  if ($repairByScreen.ContainsKey($candidateName)) { $relatedRepairs = @($repairByScreen[$candidateName]) }

  if ($normalizedSurface -ne 'unknown') {
    $evidence.Add("ready-surface:$normalizedSurface") | Out-Null
  }

  if ($normalizedSurface -eq 'unknown' -and $relatedRepairs.Count -gt 0) {
    $proposed = @($relatedRepairs | ForEach-Object { Normalize-SurfaceName -Name $_.ProposedSurface } | Where-Object { $_ -ne 'unknown' } | Select-Object -Unique)
    if ($proposed.Count -eq 1) {
      $normalizedSurface = $proposed[0]
      $evidence.Add("repair-proposed-surface:$normalizedSurface") | Out-Null
    }
  }

  if ($normalizedSurface -eq 'unknown' -and $relatedScreens.Count -gt 0) {
    $screenSurfaces = @($relatedScreens | ForEach-Object { Normalize-SurfaceName -Name $_.Surface } | Where-Object { $_ -ne 'unknown' } | Select-Object -Unique)
    if ($screenSurfaces.Count -eq 1) {
      $normalizedSurface = $screenSurfaces[0]
      $evidence.Add("screen-inventory-surface:$normalizedSurface") | Out-Null
    }
  }

  if ($normalizedSurface -eq 'unknown' -and $relatedLinks.Count -gt 0) {
    $linkSurfaces = @($relatedLinks | ForEach-Object { Normalize-SurfaceName -Name $_.Surface } | Where-Object { $_ -ne 'unknown' } | Select-Object -Unique)
    if ($linkSurfaces.Count -eq 1) {
      $normalizedSurface = $linkSurfaces[0]
      $evidence.Add("operation-link-surface:$normalizedSurface") | Out-Null
    }
  }

  if ($normalizedSurface -eq 'unknown' -and $relatedScreens.Count -gt 0) {
    $paths = @($relatedScreens | ForEach-Object { $_.RelativePath } | Where-Object { $_ })
    $pathSurfaces = @($paths | ForEach-Object { Infer-SurfaceFromPath -Path $_ } | Where-Object { $_ -ne 'unknown' } | Select-Object -Unique)
    if ($pathSurfaces.Count -eq 1) {
      $normalizedSurface = $pathSurfaces[0]
      $evidence.Add("path-surface:$normalizedSurface") | Out-Null
    }
  }

  if ($normalizedSurface -eq 'unknown' -and -not [string]::IsNullOrWhiteSpace($operation)) {
    $opSurface = Infer-SurfaceFromOperation -Operation $operation
    if ($opSurface -ne 'unknown') {
      $normalizedSurface = $opSurface
      $evidence.Add("operation-surface:$normalizedSurface") | Out-Null
    }
  }

  $normalizationStatus = 'NORMALIZED'
  if ($normalizedSurface -eq 'unknown') {
    $normalizationStatus = 'NEEDS_MANUAL_DECISION'
    $evidence.Add('manual-decision-required') | Out-Null
  }

  $primaryPath = ''
  if ($relatedScreens.Count -gt 0) {
    $primaryPath = ("" + $relatedScreens[0].RelativePath).Trim()
  }

  $normalized.Add([pscustomobject]@{
    QueueType            = $queueType
    CandidateName        = $candidateName
    Operation            = $operation
    OriginalSurface      = $surfaceRaw
    NormalizedSurface    = $normalizedSurface
    NormalizationStatus  = $normalizationStatus
    RecommendedAction    = $row.RecommendedAction
    Readiness            = $row.Readiness
    WhyReady             = $row.WhyReady
    PrimaryRelativePath  = $primaryPath
    Evidence             = (Merge-Evidence -Parts $evidence.ToArray())
  }) | Out-Null

  if ($normalizationStatus -eq 'NORMALIZED' -and $normalizedSurface -ne 'unknown') {
    $wave = 3
    if ($normalizedSurface -eq 'app-client')  { $wave = 1 }
    if ($normalizedSurface -eq 'app-partner') { $wave = 2 }
    if ($normalizedSurface -eq 'app-captain') { $wave = 3 }
    if ($normalizedSurface -eq 'app-field')   { $wave = 4 }
    if ($normalizedSurface -eq 'control-panel') { $wave = 5 }
    if ($normalizedSurface -eq 'webapp')        { $wave = 6 }
    if ($normalizedSurface -eq 'website')       { $wave = 7 }

    $priority = 50
    if ($queueType -eq 'keep-rebuild-clean') { $priority = 10 }
    if ($row.RecommendedAction -eq 'CREATE_NEW_CANONICAL_SCREEN') { $priority = 30 }

    $wave1.Add([pscustomobject]@{
      Wave               = $wave
      Priority           = $priority
      Surface            = $normalizedSurface
      CandidateName      = $candidateName
      Operation          = $operation
      QueueType          = $queueType
      RecommendedAction  = $row.RecommendedAction
      Readiness          = $row.Readiness
      PrimaryRelativePath= $primaryPath
      Evidence           = (Merge-Evidence -Parts $evidence.ToArray())
    }) | Out-Null
  }
}

$normalizedCsv = Join-Path $DocsRoot "09_REBUILD_READY_SURFACE_NORMALIZED.csv"
$wave1Csv      = Join-Path $DocsRoot "10_REBUILD_WAVE_1_QUEUE.csv"
$summaryTxt    = Join-Path $RunRoot "summary.txt"
$evidenceJs    = Join-Path $RunRoot "evidence.json"

$normalized | Sort-Object NormalizationStatus, NormalizedSurface, CandidateName | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $normalizedCsv
$wave1 | Sort-Object Wave, Priority, Surface, CandidateName | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $wave1Csv

$normCounts   = $normalized | Group-Object NormalizationStatus | Sort-Object Name
$surfaceCounts= $normalized | Group-Object NormalizedSurface   | Sort-Object Name
$waveCounts   = $wave1      | Group-Object Wave                | Sort-Object Name
$queueCounts  = $wave1      | Group-Object QueueType           | Sort-Object Name

$lines = New-Object 'System.Collections.Generic.List[string]'
$lines.Add("DSH REBUILD READY SURFACE NORMALIZATION") | Out-Null
$lines.Add("SESSION_ID: $SessionId") | Out-Null
$lines.Add("TOTAL_READY_ROWS: $($normalized.Count)") | Out-Null
$lines.Add("NORMALIZED_ROWS: $(($normalized | Where-Object { $_.NormalizationStatus -eq 'NORMALIZED' }).Count)") | Out-Null
$lines.Add("MANUAL_DECISION_ROWS: $(($normalized | Where-Object { $_.NormalizationStatus -eq 'NEEDS_MANUAL_DECISION' }).Count)") | Out-Null
$lines.Add("WAVE_QUEUE_ROWS: $($wave1.Count)") | Out-Null
$lines.Add("") | Out-Null
$lines.Add("NORMALIZATION_STATUS") | Out-Null
foreach ($g in $normCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("NORMALIZED_BY_SURFACE") | Out-Null
foreach ($g in $surfaceCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("WAVE_COUNTS") | Out-Null
foreach ($g in $waveCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("QUEUE_TYPES") | Out-Null
foreach ($g in $queueCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $summaryTxt -Encoding UTF8

[pscustomobject]@{
  session_id              = $SessionId
  service                 = $Service
  total_ready_rows        = $normalized.Count
  normalized_rows         = ($normalized | Where-Object { $_.NormalizationStatus -eq 'NORMALIZED' }).Count
  manual_decision_rows    = ($normalized | Where-Object { $_.NormalizationStatus -eq 'NEEDS_MANUAL_DECISION' }).Count
  wave_queue_rows         = $wave1.Count
  normalization_status    = @($normCounts    | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  normalized_by_surface   = @($surfaceCounts | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  wave_counts             = @($waveCounts    | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  queue_types             = @($queueCounts   | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  outputs = [pscustomobject]@{
    rebuild_ready_surface_normalized_csv = $normalizedCsv
    rebuild_wave_1_queue_csv             = $wave1Csv
    summary_txt                          = $summaryTxt
  }
} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $evidenceJs -Encoding UTF8

Write-Host ""
Write-Host "=== DSH REBUILD READY SURFACE NORMALIZATION ==="
Write-Host "SESSION_ID           : $SessionId"
Write-Host "TOTAL READY ROWS     : $($normalized.Count)"
Write-Host "NORMALIZED ROWS      : $(($normalized | Where-Object { $_.NormalizationStatus -eq 'NORMALIZED' }).Count)"
Write-Host "MANUAL DECISION ROWS : $(($normalized | Where-Object { $_.NormalizationStatus -eq 'NEEDS_MANUAL_DECISION' }).Count)"
Write-Host "WAVE QUEUE ROWS      : $($wave1.Count)"

Write-Host ""
Write-Host "=== Normalization Status ==="
$normCounts | ForEach-Object { Write-Host ("{0,-24} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== Normalized By Surface ==="
$surfaceCounts | ForEach-Object { Write-Host ("{0,-24} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== Wave Counts ==="
$waveCounts | ForEach-Object { Write-Host ("Wave {0,-19} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== Queue Types ==="
$queueCounts | ForEach-Object { Write-Host ("{0,-24} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "Outputs:"
Write-Host " - $normalizedCsv"
Write-Host " - $wave1Csv"
Write-Host " - $summaryTxt"
Write-Host " - $evidenceJs"
Write-Host ""
Write-Host "[PASS] Rebuild-ready surface normalization completed."
