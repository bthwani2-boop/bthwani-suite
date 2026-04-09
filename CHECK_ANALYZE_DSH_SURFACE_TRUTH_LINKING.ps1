Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"

$RepoRoot  = "C:\Users\b\Documents\GitHub\bthwani-suite"
$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal"
$Service   = "dsh"
$SessionId = (Get-Date -Format "yyyyMMdd-HHmmss")

$RunRoot   = Join-Path $RepoRoot ("kdt\volatile\registry\runs\" + $SessionId + "\dsh-surface-truth-linking")
$DocsRoot  = Join-Path $RepoRoot ("docs\services\" + $Service)
$ScriptOut = Join-Path $RepoRoot ("tools\scripts\CHECK_ANALYZE_DSH_SURFACE_TRUTH_LINKING.ps1")

New-Item -ItemType Directory -Force -Path $RunRoot  | Out-Null
New-Item -ItemType Directory -Force -Path $DocsRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $ScriptOut) | Out-Null

$inner = @'
Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"

$RepoRoot  = "C:\Users\b\Documents\GitHub\bthwani-suite"
$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal"
$Service   = "dsh"
$SessionId = (Get-Date -Format "yyyyMMdd-HHmmss")

$RunRoot   = Join-Path $RepoRoot ("kdt\volatile\registry\runs\" + $SessionId + "\dsh-surface-truth-linking")
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
  $n = ($Name ?? '').ToLowerInvariant()
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
  if     ($p -match '/app-client/'    -or $p -match '/client/')        { return 'app-client' }
  elseif ($p -match '/app-partner/'   -or $p -match '/partner/')       { return 'app-partner' }
  elseif ($p -match '/app-captain/'   -or $p -match '/captain/')       { return 'app-captain' }
  elseif ($p -match '/app-field/'     -or $p -match '/field/')         { return 'app-field' }
  elseif ($p -match '/control-panel/' -or $p -match '/mcpw/')          { return 'control-panel' }
  elseif ($p -match '/webapp/')                                         { return 'webapp' }
  elseif ($p -match '/website/')                                        { return 'website' }
  else                                                                  { return 'unknown' }
}

function Guess-OperationNames {
  param([string]$Text,[string]$Path)

  $bag = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

  $patterns = @(
    '\bdsh_[a-z0-9_]+\b',
    '/dsh/[a-z0-9/_-]+',
    'operation[s]?[/"''` ]+([a-z0-9_]+)',
    'op(?:eration)?[A-Z_: -]+(dsh_[a-z0-9_]+)'
  )

  foreach ($pattern in $patterns) {
    foreach ($m in [regex]::Matches($Text,$pattern,[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
      $v = $m.Value
      if ($m.Groups.Count -gt 1 -and $m.Groups[1].Success) { $v = $m.Groups[1].Value }
      if ($v -match '^/dsh/') {
        $v = $v.Trim('/').Replace('/','_')
      }
      $v = $v.ToLowerInvariant()
      if ($v -match '^dsh_[a-z0-9_]+$') { [void]$bag.Add($v) }
    }
  }

  $fileBase = [System.IO.Path]::GetFileNameWithoutExtension($Path).ToLowerInvariant()
  if ($fileBase -match '^dsh_[a-z0-9_]+$') { [void]$bag.Add($fileBase) }

  return @($bag | Sort-Object)
}

function Guess-ScreenName {
  param([string]$Path,[string]$Text)

  $base = [System.IO.Path]::GetFileNameWithoutExtension($Path)

  if ($base -match 'screen$') { return $base }
  if ($base -match 'sheet$')  { return $base }
  if ($base -match 'modal$')  { return $base }

  $matches = [regex]::Matches($Text,'\b([A-Z][A-Za-z0-9]+(?:Screen|Sheet|Modal|Route|Page))\b')
  if ($matches.Count -gt 0) { return $matches[0].Groups[1].Value }

  return $base
}

function Classify-UiNodeType {
  param([string]$Path,[string]$Text)

  $base = [System.IO.Path]::GetFileNameWithoutExtension($Path).ToLowerInvariant()
  if ($base -match 'screen$' -or $Text -match '\bScreen\b') { return 'screen' }
  if ($base -match 'sheet$'  -or $Text -match '\bSheet\b')  { return 'sheet' }
  if ($base -match 'modal$'  -or $Text -match '\bModal\b')  { return 'modal' }
  if ($base -match 'page$')                                { return 'page' }
  if ($base -match 'route$')                               { return 'route' }
  return 'component'
}

function Get-Decision {
  param(
    [string]$UiNodeType,
    [int]$OperationCount,
    [bool]$HasUiKitRef,
    [bool]$HasLegacyPreview,
    [string]$Path
  )

  $p = $Path.Replace('\','/').ToLowerInvariant()

  if ($HasLegacyPreview -or $p -match '/preview-routes?\.' -or $p -match '/entry/' ) {
    return 'DELETE_LEGACY_PREVIEW'
  }

  if ($UiNodeType -eq 'component' -and $OperationCount -eq 0) {
    return 'REFERENCE_ONLY'
  }

  if (($UiNodeType -eq 'sheet' -or $UiNodeType -eq 'modal') -and $OperationCount -gt 0) {
    return 'CONVERT_TO_COMPANION_NODE'
  }

  if (($UiNodeType -eq 'screen' -or $UiNodeType -eq 'page' -or $UiNodeType -eq 'route') -and $OperationCount -gt 0 -and $HasUiKitRef) {
    return 'KEEP_REBUILD_CLEAN'
  }

  if (($UiNodeType -eq 'screen' -or $UiNodeType -eq 'page' -or $UiNodeType -eq 'route') -and $OperationCount -gt 0 -and -not $HasUiKitRef) {
    return 'MODIFY_MAJOR_UIKIT_ADOPTION'
  }

  if ($OperationCount -gt 0) {
    return 'MODIFY_MAJOR'
  }

  return 'REFERENCE_ONLY'
}

$surfacesRoot = Join-Path $DonorRoot "packages\surfaces\src\dsh"
$opsMatrixCsv = Join-Path $RepoRoot "docs\services\dsh\01_OPERATION_TRUTH_MATRIX.csv"

if (-not (Test-Path $surfacesRoot)) {
  Write-Host "[FAIL] surfaces root missing: $surfacesRoot"
  exit 1
}

$knownOps = @()
if (Test-Path $opsMatrixCsv) {
  try {
    $knownOps = @(Import-Csv -LiteralPath $opsMatrixCsv | ForEach-Object { $_.Operation } | Where-Object { $_ } | Sort-Object -Unique)
  } catch {
    $knownOps = @()
  }
}

$files = Get-ChildItem -LiteralPath $surfacesRoot -Recurse -File | Where-Object {
  $_.Extension -in @('.ts','.tsx','.js','.jsx','.json','.md','.yaml','.yml','.csv')
}

$screenRows = New-Object 'System.Collections.Generic.List[object]'
$opRows     = New-Object 'System.Collections.Generic.List[object]'
$coverage   = @{}

foreach ($file in $files) {
  $text = Get-SafeContent -Path $file.FullName
  if ([string]::IsNullOrWhiteSpace($text)) { continue }

  $surface     = Guess-SurfaceFromPath -Path $file.FullName
  $screenName  = Guess-ScreenName -Path $file.FullName -Text $text
  $uiNodeType  = Classify-UiNodeType -Path $file.FullName -Text $text
  $opsFound    = @(Guess-OperationNames -Text $text -Path $file.FullName)
  $hasUiKitRef = ($text -match '@bthwani/ui-kit')
  $hasPreview  = ($file.Name -match 'preview-route' -or $file.FullName -replace '\\','/' -match '/preview-routes?\.')
  $decision    = Get-Decision -UiNodeType $uiNodeType -OperationCount $opsFound.Count -HasUiKitRef:$hasUiKitRef -HasLegacyPreview:$hasPreview -Path $file.FullName

  if ($opsFound.Count -eq 0 -and $uiNodeType -in @('screen','page','route')) {
    $decision = 'REVIEW_ORPHAN_SCREEN'
  }

  $screenRows.Add([pscustomobject]@{
    Surface         = $surface
    ScreenName      = $screenName
    UiNodeType      = $uiNodeType
    RelativePath    = Get-Rel -Base $DonorRoot -Path $file.FullName
    FileName        = $file.Name
    Extension       = $file.Extension
    OperationCount  = $opsFound.Count
    Operations      = ($opsFound -join '; ')
    HasUiKitRef     = $hasUiKitRef
    HasLegacyPreview= $hasPreview
    Decision        = $decision
  }) | Out-Null

  foreach ($op in $opsFound) {
    if (-not $coverage.ContainsKey($op)) { $coverage[$op] = New-Object 'System.Collections.Generic.HashSet[string]' }
    [void]$coverage[$op].Add($surface)

    $opRows.Add([pscustomobject]@{
      Operation    = $op
      Surface      = $surface
      ScreenName   = $screenName
      UiNodeType   = $uiNodeType
      RelativePath = Get-Rel -Base $DonorRoot -Path $file.FullName
      Decision     = $decision
    }) | Out-Null
  }
}

$screenCsv   = Join-Path $DocsRoot "02_SCREEN_INVENTORY.csv"
$linkCsv     = Join-Path $DocsRoot "03_OPERATION_SCREEN_MATRIX.csv"
$decisionCsv = Join-Path $DocsRoot "04_SCREEN_DECISIONS.csv"
$missingCsv  = Join-Path $DocsRoot "05_MISSING_OR_ORPHAN_OPERATIONS.csv"
$summaryTxt  = Join-Path $RunRoot  "summary.txt"
$evidenceJs  = Join-Path $RunRoot  "evidence.json"

$screenRows | Sort-Object Surface, ScreenName, RelativePath | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $screenCsv
$opRows     | Sort-Object Operation, Surface, ScreenName    | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $linkCsv
$screenRows | Select-Object Surface,ScreenName,UiNodeType,RelativePath,OperationCount,Operations,HasUiKitRef,HasLegacyPreview,Decision |
  Sort-Object Decision, Surface, ScreenName | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $decisionCsv

$missing = New-Object 'System.Collections.Generic.List[object]'
foreach ($op in $knownOps) {
  if (-not $coverage.ContainsKey($op)) {
    $missing.Add([pscustomobject]@{
      Operation   = $op
      Classification = 'ADD_NEW_MISSING'
      Reason      = 'Operation exists in operation truth matrix but no linked donor surface screen was found'
      SurfacesFound = ''
    }) | Out-Null
  } else {
    $surfaces = @($coverage[$op] | Sort-Object)
    $missing.Add([pscustomobject]@{
      Operation   = $op
      Classification = 'LINKED'
      Reason      = 'Linked to donor surface nodes'
      SurfacesFound = ($surfaces -join '; ')
    }) | Out-Null
  }
}

$orphanScreens = @($screenRows | Where-Object { $_.Decision -eq 'REVIEW_ORPHAN_SCREEN' })
foreach ($row in $orphanScreens) {
  $missing.Add([pscustomobject]@{
    Operation      = ''
    Classification = 'REVIEW_ORPHAN_SCREEN'
    Reason         = "Surface node has no detected operation: $($row.ScreenName)"
    SurfacesFound  = $row.Surface
  }) | Out-Null
}

$missing | Sort-Object Classification, Operation, SurfacesFound | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $missingCsv

$decisionCounts = $screenRows | Group-Object Decision | Sort-Object Name
$surfaceCounts  = $screenRows | Group-Object Surface  | Sort-Object Name
$nodeTypeCounts = $screenRows | Group-Object UiNodeType | Sort-Object Name
$missingOps     = @($missing | Where-Object { $_.Classification -eq 'ADD_NEW_MISSING' })
$linkedOps      = @($missing | Where-Object { $_.Classification -eq 'LINKED' })
$orphanCount    = $orphanScreens.Count

$lines = New-Object 'System.Collections.Generic.List[string]'
$lines.Add("DSH SURFACE TRUTH LINKING") | Out-Null
$lines.Add("SESSION_ID: $SessionId") | Out-Null
$lines.Add("TOTAL_SURFACE_FILES_ANALYZED: $($screenRows.Count)") | Out-Null
$lines.Add("TOTAL_OPERATION_LINKS: $($opRows.Count)") | Out-Null
$lines.Add("KNOWN_OPERATIONS_FROM_TRUTH_MATRIX: $($knownOps.Count)") | Out-Null
$lines.Add("LINKED_OPERATIONS: $($linkedOps.Count)") | Out-Null
$lines.Add("MISSING_OPERATIONS: $($missingOps.Count)") | Out-Null
$lines.Add("ORPHAN_SCREENS: $orphanCount") | Out-Null
$lines.Add("") | Out-Null
$lines.Add("DECISIONS") | Out-Null
foreach ($g in $decisionCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("BY_SURFACE") | Out-Null
foreach ($g in $surfaceCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }
$lines.Add("") | Out-Null
$lines.Add("BY_UI_NODE_TYPE") | Out-Null
foreach ($g in $nodeTypeCounts) { $lines.Add("$($g.Name): $($g.Count)") | Out-Null }

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $summaryTxt -Encoding UTF8

[pscustomobject]@{
  session_id                  = $SessionId
  service                     = $Service
  total_surface_files         = $screenRows.Count
  total_operation_links       = $opRows.Count
  known_operations_from_truth = $knownOps.Count
  linked_operations           = $linkedOps.Count
  missing_operations          = $missingOps.Count
  orphan_screens              = $orphanCount
  decision_counts             = @($decisionCounts | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  by_surface                  = @($surfaceCounts  | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  by_ui_node_type             = @($nodeTypeCounts | ForEach-Object { [pscustomobject]@{ name = $_.Name; count = $_.Count } })
  outputs = [pscustomobject]@{
    screen_inventory_csv        = $screenCsv
    operation_screen_matrix_csv = $linkCsv
    screen_decisions_csv        = $decisionCsv
    missing_or_orphan_csv       = $missingCsv
    summary_txt                 = $summaryTxt
  }
} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $evidenceJs -Encoding UTF8

Write-Host ""
Write-Host "=== DSH SURFACE TRUTH LINKING ==="
Write-Host "SESSION_ID          : $SessionId"
Write-Host "SURFACE FILES       : $($screenRows.Count)"
Write-Host "OPERATION LINKS     : $($opRows.Count)"
Write-Host "KNOWN OPS           : $($knownOps.Count)"
Write-Host "LINKED OPS          : $($linkedOps.Count)"
Write-Host "MISSING OPS         : $($missingOps.Count)"
Write-Host "ORPHAN SCREENS      : $orphanCount"

Write-Host ""
Write-Host "=== Decisions ==="
$decisionCounts | ForEach-Object { Write-Host ("{0,-30} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== By Surface ==="
$surfaceCounts | ForEach-Object { Write-Host ("{0,-18} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "=== By UI Node Type ==="
$nodeTypeCounts | ForEach-Object { Write-Host ("{0,-18} {1,6}" -f $_.Name, $_.Count) }

Write-Host ""
Write-Host "Outputs:"
Write-Host " - $screenCsv"
Write-Host " - $linkCsv"
Write-Host " - $decisionCsv"
Write-Host " - $missingCsv"
Write-Host " - $summaryTxt"
Write-Host " - $evidenceJs"
Write-Host ""
Write-Host "[PASS] Surface truth linking completed."
'@

Set-Content -LiteralPath $ScriptOut -Value $inner -Encoding UTF8

pwsh -ExecutionPolicy Bypass -File $ScriptOut
