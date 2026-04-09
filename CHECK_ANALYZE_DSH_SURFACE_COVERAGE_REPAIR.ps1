Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"

$RepoRoot  = "C:\Users\b\Documents\GitHub\bthwani-suite"
$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal"
$Service   = "dsh"
$SessionId = (Get-Date -Format "yyyyMMdd-HHmmss")

$RunRoot   = Join-Path $RepoRoot ("kdt\volatile\registry\runs\" + $SessionId + "\dsh-surface-coverage-repair")
$DocsRoot  = Join-Path $RepoRoot ("docs\services\" + $Service)

New-Item -ItemType Directory -Force -Path $RunRoot  | Out-Null
New-Item -ItemType Directory -Force -Path $DocsRoot | Out-Null

function Get-SafeContent {
  param([string]$Path)
  try { return [System.IO.File]::ReadAllText($Path) } catch { return "" }
}

function Get-Rel {
  param([string]$Base,[string]$Path)
  try {
    return [System.IO.Path]::GetRelativePath($Base,$Path)
  } catch {
    return $Path.Replace($Base,'').TrimStart('\')
  }
}

function Normalize-SurfaceName {
  param([string]$Name)
  $n = ('' + $Name).ToLowerInvariant()
  switch -Regex ($n) {
    '^(app-user|user|client|app-client)$'       { return 'app-client' }
    '^(app-partner|partner)$'                   { return 'app-partner' }
    '^(app-captain|captain)$'                   { return 'app-captain' }
    '^(app-field|field)$'                       { return 'app-field' }
    '^(mcpw|control-panel|controlpanel)$'       { return 'control-panel' }
    '^(webapp)$'                                { return 'webapp' }
    '^(website|web)$'                           { return 'website' }
    default                                     { return 'unknown' }
  }
}

function Guess-SurfaceFromPath {
  param([string]$Path)
  $p = $Path.Replace('\','/').ToLowerInvariant()
  if     ($p -match '/app-client/'    -or $p -match '/client/' -or $p -match '/consumer/')          { return 'app-client' }
  elseif ($p -match '/app-partner/'   -or $p -match '/partner/' -or $p -match '/merchant/')         { return 'app-partner' }
  elseif ($p -match '/app-captain/'   -or $p -match '/captain/' -or $p -match '/driver/')           { return 'app-captain' }
  elseif ($p -match '/app-field/'     -or $p -match '/field/'   -or $p -match '/agent/')            { return 'app-field' }
  elseif ($p -match '/control-panel/' -or $p -match '/mcpw/'    -or $p -match '/ops/' -or $p -match '/admin/') { return 'control-panel' }
  elseif ($p -match '/webapp/')                                                                        { return 'webapp' }
  elseif ($p -match '/website/')                                                                       { return 'website' }
  else                                                                                                 { return 'unknown' }
}

function Infer-SurfaceFromOperation {
  param([string]$Operation)
  $op = ('' + $Operation).ToLowerInvariant()
  if ($op -match '^dsh_captain_' -or $op -match 'captain' -or $op -match 'delivery_(attempt|position|eta|track|reassign)') {
    return 'app-captain'
  }
  if ($op -match '^dsh_field_' -or $op -match 'field_' -or $op -match 'geo_pin' -or $op -match 'activation_request') {
    return 'app-field'
  }
  if ($op -match '^dsh_partner_' -or $op -match 'partner' -or $op -match 'store_' -or $op -match 'catalog_' -or $op -match 'merchant') {
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

function Infer-NodeTypeFromPath {
  param([string]$Path)
  $base = [System.IO.Path]::GetFileNameWithoutExtension($Path).ToLowerInvariant()
  if ($base -match 'screen$') { return 'screen' }
  if ($base -match 'sheet$')  { return 'sheet' }
  if ($base -match 'modal$')  { return 'modal' }
  if ($base -match 'page$')   { return 'page' }
  if ($base -match 'route$')  { return 'route' }
  return 'component'
}

$screenInventoryCsv = Join-Path $DocsRoot "02_SCREEN_INVENTORY.csv"
$opMatrixCsv        = Join-Path $DocsRoot "03_OPERATION_SCREEN_MATRIX.csv"
$missingCsv         = Join-Path $DocsRoot "05_MISSING_OR_ORPHAN_OPERATIONS.csv"
$truthMatrixCsv     = Join-Path $DocsRoot "01_OPERATION_TRUTH_MATRIX.csv"
$surfacesRoot       = Join-Path $DonorRoot "packages\surfaces\src\dsh"

if (-not (Test-Path $screenInventoryCsv)) {
  Write-Host "[FAIL] Missing prerequisite file: $screenInventoryCsv"
  exit 1
}
if (-not (Test-Path $opMatrixCsv)) {
  Write-Host "[FAIL] Missing prerequisite file: $opMatrixCsv"
  exit 1
}
if (-not (Test-Path $missingCsv)) {
  Write-Host "[FAIL] Missing prerequisite file: $missingCsv"
  exit 1
}

$screenInventory = @(Import-Csv -LiteralPath $screenInventoryCsv)
$opMatrix        = @(Import-Csv -LiteralPath $opMatrixCsv)
$missingRows     = @(Import-Csv -LiteralPath $missingCsv)
$truthMatrix     = @()
if (Test-Path $truthMatrixCsv) {
  $truthMatrix = @(Import-Csv -LiteralPath $truthMatrixCsv)
}

$repairRows      = New-Object 'System.Collections.Generic.List[object]'
$opClassRows     = New-Object 'System.Collections.Generic.List[object]'
$readyRows       = New-Object 'System.Collections.Generic.List[object]'

$orphanScreens = @($screenInventory | Where-Object { $_.Decision -eq 'REVIEW_ORPHAN_SCREEN' })
foreach ($row in $orphanScreens) {
  $path = Join-Path $DonorRoot $row.RelativePath
  $text = Get-SafeContent -Path $path
  $surfaceGuess = Normalize-SurfaceName -Name $row.Surface
  if ($surfaceGuess -eq 'unknown') { $surfaceGuess = Guess-SurfaceFromPath -Path $path }

  $evidence = New-Object System.Collections.Generic.List[string]
  if ($row.RelativePath -match 'app-user|client|consumer')     { $surfaceGuess = 'app-client';    $evidence.Add('path-alias-client')    | Out-Null }
  if ($row.RelativePath -match 'partner|merchant')             { $surfaceGuess = 'app-partner';   $evidence.Add('path-alias-partner')   | Out-Null }
  if ($row.RelativePath -match 'captain|driver')               { $surfaceGuess = 'app-captain';   $evidence.Add('path-alias-captain')   | Out-Null }
  if ($row.RelativePath -match 'field|agent')                  { $surfaceGuess = 'app-field';     $evidence.Add('path-alias-field')     | Out-Null }
  if ($row.RelativePath -match 'mcpw|control-panel|admin|ops') { $surfaceGuess = 'control-panel'; $evidence.Add('path-alias-control')   | Out-Null }

  if ($text -match '@bthwani/ui-kit') { $evidence.Add('uikit-ref') | Out-Null }
  if ($text -match 'preview-routes?' -or $row.RelativePath -match 'preview-routes?') { $evidence.Add('legacy-preview') | Out-Null }

  $nodeType = $row.UiNodeType
  if ([string]::IsNullOrWhiteSpace($nodeType)) { $nodeType = Infer-NodeTypeFromPath -Path $path }

  $proposedAction = 'REVIEW_ORPHAN_SCREEN'
  if ($surfaceGuess -ne 'unknown' -and $nodeType -in @('screen','page','route')) {
    $proposedAction = 'RECLASSIFY_SURFACE_AND_REVIEW'
  } elseif ($nodeType -in @('sheet','modal')) {
    $proposedAction = 'CONVERT_TO_COMPANION_NODE'
  } elseif ($row.RelativePath -match 'preview-routes?' -or $row.RelativePath -match '/entry/') {
    $proposedAction = 'DELETE_LEGACY_PREVIEW'
  }

  $repairRows.Add([pscustomobject]@{
    ItemType        = 'orphan-screen'
    ScreenName      = $row.ScreenName
    Operation       = ''
    CurrentSurface  = $row.Surface
    ProposedSurface = $surfaceGuess
    CurrentDecision = $row.Decision
    ProposedAction  = $proposedAction
    RelativePath    = $row.RelativePath
    Evidence        = ($evidence -join '; ')
  }) | Out-Null
}

$missingOps = @($missingRows | Where-Object { $_.Classification -eq 'ADD_NEW_MISSING' })
$truthLookup = @{}
foreach ($row in $truthMatrix) {
  $op = '' + $row.Operation
  if (-not [string]::IsNullOrWhiteSpace($op) -and -not $truthLookup.ContainsKey($op)) {
    $truthLookup[$op] = @()
  }
  if (-not [string]::IsNullOrWhiteSpace($op)) {
    $truthLookup[$op] += $row
  }
}

foreach ($row in $missingOps) {
  $op = '' + $row.Operation
  $expectedSurface = Infer-SurfaceFromOperation -Operation $op
  $sourceRows = @()
  if ($truthLookup.ContainsKey($op)) { $sourceRows = @($truthLookup[$op]) }

  $sourceNames = @($sourceRows | ForEach-Object { $_.Source } | Where-Object { $_ } | Sort-Object -Unique)
  $hasSurfaceTruth = ($sourceNames -contains 'surfaces')
  $hasServiceTruth = ($sourceNames -contains 'services')
  $hasContractTruth = ($sourceNames -contains 'master' -or $sourceNames -contains 'api-types' -or $sourceNames -contains 'api-clients')

  $classification = 'BACKLOG_REVIEW'
  if ($expectedSurface -ne 'unknown' -and $hasServiceTruth -and $hasContractTruth -and -not $hasSurfaceTruth) {
    $classification = 'ADD_NEW_MISSING'
  } elseif ($expectedSurface -ne 'unknown' -and $hasServiceTruth -and $hasSurfaceTruth) {
    $classification = 'RELINK_EXISTING_SURFACE'
  } elseif ($expectedSurface -eq 'unknown' -and $hasServiceTruth) {
    $classification = 'BACKEND_OR_STAFF_REVIEW'
  }

  $reasonParts = New-Object System.Collections.Generic.List[string]
  if ($hasServiceTruth)  { $reasonParts.Add('service-truth-present')  | Out-Null }
  if ($hasContractTruth) { $reasonParts.Add('contract-truth-present') | Out-Null }
  if ($hasSurfaceTruth)  { $reasonParts.Add('surface-truth-present')  | Out-Null }
  if ($expectedSurface -ne 'unknown') { $reasonParts.Add("expected-surface:$expectedSurface") | Out-Null }

  $opClassRows.Add([pscustomobject]@{
    Operation        = $op
    ExpectedSurface  = $expectedSurface
    Classification   = $classification
    Sources          = ($sourceNames -join '; ')
    Reason           = ($reasonParts -join '; ')
  }) | Out-Null

  if ($classification -eq 'ADD_NEW_MISSING') {
    $readyRows.Add([pscustomobject]@{
      QueueType        = 'add-new-missing'
      Surface          = $expectedSurface
      Operation        = $op
      CandidateName    = ($op + '_screen')
      Readiness        = 'READY_FOR_REBUILD'
      WhyReady         = 'Operation proven in service+contract truth but no donor surface screen linked'
      RecommendedAction= 'CREATE_NEW_CANONICAL_SCREEN'
    }) | Out-Null
  }
}

$keeps = @($screenInventory | Where-Object { $_.Decision -eq 'KEEP_REBUILD_CLEAN' })
foreach ($row in $keeps) {
  $surface = Normalize-SurfaceName -Name $row.Surface
  if ($surface -eq 'unknown') {
    $surface = Guess-SurfaceFromPath -Path (Join-Path $DonorRoot $row.RelativePath)
  }

  $readyRows.Add([pscustomobject]@{
    QueueType         = 'keep-rebuild-clean'
    Surface           = $surface
    Operation         = ($row.Operations -split '; ' | Select-Object -First 1)
    CandidateName     = $row.ScreenName
    Readiness         = 'READY_FOR_REBUILD'
    WhyReady          = 'Donor surface node already classified as KEEP_REBUILD_CLEAN'
    RecommendedAction = 'REBUILD_CLEAN_ON_UIKIT'
  }) | Out-Null
}

$repairCsv   = Join-Path $DocsRoot "06_SURFACE_COVERAGE_REPAIR.csv"
$opClassCsv  = Join-Path $DocsRoot "07_OPERATION_CLASSIFICATION.csv"
$readyCsv    = Join-Path $DocsRoot "08_REBUILD_READY_CANDIDATES.csv"
$summaryTxt  = Join-Path $RunRoot  "summary.txt"
$evidenceJs  = Join-Path $RunRoot  "evidence.json"

$repairRows | Sort-Object ProposedAction, ProposedSurface, ScreenName | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $repairCsv
$opClassRows | Sort-Object Classification, ExpectedSurface, Operation | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $opClassCsv
$readyRows | Sort-Object QueueType, Surface, CandidateName | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $readyCsv

$repairCounts = $repairRows | Group-Object ProposedAction | Sort-Object Name
$classCounts  = $opClassRows | Group-Object Classification | Sort-Object Name
$readyCounts  = $readyRows | Group-Object QueueType | Sort-Object Name
$surfaceReady = $readyRows | Group-Object Surface | Sort-Object Name

$lines = New-Object 'System.Collections.Generic.List[string]'
$lines.Add("DSH SURFACE COVERAGE REPAIR") | Out-Null
$lines.Add("SESSION_ID: $SessionId") | Out-Null
$lines.Add("ORPHAN_SCREEN_REPAIRS: $($repairRows.Count)") | Out-Null
$lines.Add("MISSING_OPERATION_CLASSIFICATIONS: $($opClassRows.Count)") | Out-Null
$lines.Add("REBUILD_READY_CANDIDATES: $($readyRows.Count)") | Out-Null
$lines.Add("") | Out-Null
$lines.Add("REPAIR_ACTIONS") | Out-Null
foreach ($g in $repairCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("OPERATION_CLASSIFICATIONS") | Out-Null
foreach ($g in $classCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("REBUILD_READY_BY_QUEUE") | Out-Null
foreach ($g in $readyCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("REBUILD_READY_BY_SURFACE") | Out-Null
foreach ($g in $surfaceReady) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $summaryTxt -Encoding UTF8

[pscustomobject]@{
  session_id                        = $SessionId
  service                           = $Service
  orphan_screen_repairs             = $repairRows.Count
  missing_operation_classifications = $opClassRows.Count
  rebuild_ready_candidates          = $readyRows.Count
  repair_actions                    = @($repairCounts | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  operation_classifications         = @($classCounts  | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  rebuild_ready_by_queue            = @($readyCounts  | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  rebuild_ready_by_surface          = @($surfaceReady | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  outputs = [pscustomobject]@{
    surface_coverage_repair_csv    = $repairCsv
    operation_classification_csv   = $opClassCsv
    rebuild_ready_candidates_csv   = $readyCsv
    summary_txt                    = $summaryTxt
  }
} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $evidenceJs -Encoding UTF8

Write-Host ""
Write-Host "=== DSH SURFACE COVERAGE REPAIR ==="
Write-Host "SESSION_ID                : $SessionId"
Write-Host "ORPHAN SCREEN REPAIRS     : $($repairRows.Count)"
Write-Host "MISSING OP CLASSIFICATIONS: $($opClassRows.Count)"
Write-Host "REBUILD READY CANDIDATES  : $($readyRows.Count)"

Write-Host ""
Write-Host "=== Repair Actions ==="
$repairCounts | ForEach-Object { Write-Host ("{0,-28} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== Operation Classifications ==="
$classCounts | ForEach-Object { Write-Host ("{0,-28} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== Rebuild Ready By Queue ==="
$readyCounts | ForEach-Object { Write-Host ("{0,-28} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== Rebuild Ready By Surface ==="
$surfaceReady | ForEach-Object { Write-Host ("{0,-28} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "Outputs:"
Write-Host " - $repairCsv"
Write-Host " - $opClassCsv"
Write-Host " - $readyCsv"
Write-Host " - $summaryTxt"
Write-Host " - $evidenceJs"
Write-Host ""
Write-Host "[PASS] Surface coverage repair completed."
