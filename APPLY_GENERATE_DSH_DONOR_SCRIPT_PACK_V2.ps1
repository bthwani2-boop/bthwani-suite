[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal",
  [string]$ScriptsRoot = "C:\Users\b\Documents\GitHub\bthwani-suite\tools\scripts",
  [switch]$RunFirst
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

function Write-Section([string]$Text) { Write-Host ""; Write-Host "=== $Text ===" -ForegroundColor Cyan }
function Write-Ok([string]$Text) { Write-Host "[PASS] $Text" -ForegroundColor Green }
function Write-WarnMsg([string]$Text) { Write-Host "[WARN] $Text" -ForegroundColor Yellow }
function Write-Fail([string]$Text) { Write-Host "[FAIL] $Text" -ForegroundColor Red }

if (-not (Test-Path -LiteralPath $RepoRoot)) { throw "RepoRoot not found: $RepoRoot" }
if (-not (Test-Path -LiteralPath $DonorRoot)) { throw "DonorRoot not found: $DonorRoot" }

New-Item -ItemType Directory -Force -Path $ScriptsRoot | Out-Null

$files = @{}

$files["CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1"] = @'
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal",
  [string]$SessionId = "",
  [string]$Service = "dsh"
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

function New-SessionId {
  return (Get-Date -Format "yyyyMMdd-HHmmss") + "-DSH-DONOR-INTAKE"
}
function Ensure-Dir([string]$PathValue) {
  New-Item -ItemType Directory -Force -Path $PathValue | Out-Null
}
function Safe-Rel([string]$Base, [string]$Full) {
  try {
    return [System.IO.Path]::GetRelativePath($Base, $Full)
  } catch {
    return $Full
  }
}
function Source-Type([string]$RelativePath) {
  $p = $RelativePath.Replace('\','/')
  if ($p -match "^services/$Service/") { return "service" }
  if ($p -match "^contracts/master/") { return "contract" }
  if ($p -match "^packages/api-types/") { return "api-types" }
  if ($p -match "^packages/api-clients/") { return "api-clients" }
  if ($p -match "^packages/surfaces/src/$Service/") { return "surfaces" }
  return "other"
}
function Surface-Guess([string]$RelativePath) {
  $p = $RelativePath.Replace('\','/')
  foreach ($s in @('app-client','app-partner','app-captain','app-field','control-panel','webapp','website','app-user','app-partner','app-captain','app-field','mcpw')) {
    if ($p -match "/$([regex]::Escape($s))/") { return $s }
  }
  return ""
}
function UiKit-Symbols([string]$Text) {
  $symbols = @()
  $m = [regex]::Matches($Text, "@bthwani/ui-kit['""]\s*;|from\s+['""]@bthwani/ui-kit['""]")
  if ($m.Count -eq 0) { return "" }
  $brace = [regex]::Match($Text, "import\s*{([^}]*)}\s*from\s*['""]@bthwani/ui-kit['""]", 'Singleline')
  if ($brace.Success) {
    $symbols = $brace.Groups[1].Value.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
  } else {
    $symbols = @("namespace-or-default-import")
  }
  return ($symbols -join ';')
}

if ([string]::IsNullOrWhiteSpace($SessionId)) { $SessionId = New-SessionId() }

$registryRoot = Join-Path $RepoRoot "kdt\volatile\registry\runs\$SessionId"
Ensure-Dir $registryRoot

$summaryPath = Join-Path $registryRoot "summary.txt"
$evidencePath = Join-Path $registryRoot "evidence.json"
$csvPath = Join-Path $registryRoot "dsh_donor_source_index.csv"

$patterns = @(
  "services\$Service",
  "contracts\master",
  "packages\api-types",
  "packages\api-clients",
  "packages\surfaces\src\$Service"
)

$all = New-Object System.Collections.Generic.List[object]
foreach ($pattern in $patterns) {
  $abs = Join-Path $DonorRoot $pattern
  if (Test-Path -LiteralPath $abs) {
    Get-ChildItem -LiteralPath $abs -Recurse -File | ForEach-Object {
      $rel = Safe-Rel $DonorRoot $_.FullName
      if ($rel.Replace('\','/') -match "/$Service(/|$)" -or $rel.Replace('\','/') -match "^contracts/master/" -or $rel.Replace('\','/') -match "^packages/api-(types|clients)/") {
        $type = Source-Type $rel
        $op = ""
        if ($rel.Replace('\','/') -match "^services/$Service/governance/operations/([^/]+)/") { $op = $Matches[1] }
        $surface = Surface-Guess $rel
        $uiKit = ""
        if ($_.Extension -in @('.ts','.tsx','.js','.jsx','.md','.yaml','.yml','.csv','.json')) {
          try {
            $text = Get-Content -LiteralPath $_.FullName -Raw -ErrorAction Stop
            if ($type -eq 'surfaces') { $uiKit = UiKit-Symbols $text }
          } catch {}
        }
        $all.Add([pscustomobject]@{
          source_type = $type
          relative_path = $rel.Replace('\','/')
          extension = $_.Extension
          size_bytes = $_.Length
          operation = $op
          surface = $surface
          ui_kit_symbols = $uiKit
        })
      }
    }
  }
}

$all | Sort-Object source_type, relative_path | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $csvPath

$countsBySource = $all | Group-Object source_type | Sort-Object Name | ForEach-Object {
  [pscustomobject]@{ source_type = $_.Name; count = $_.Count }
}
$countsBySurface = $all | Where-Object surface | Group-Object surface | Sort-Object Name | ForEach-Object {
  [pscustomobject]@{ surface = $_.Name; count = $_.Count }
}
$countsByOperation = $all | Where-Object operation | Group-Object operation | Sort-Object Name | ForEach-Object {
  [pscustomobject]@{ operation = $_.Name; count = $_.Count }
}

$rawFetchCount = 0
$autoCount = 0
$surfaceFiles = $all | Where-Object { $_.source_type -eq 'surfaces' }
foreach ($f in $surfaceFiles) {
  $full = Join-Path $DonorRoot $f.relative_path
  try {
    $text = Get-Content -LiteralPath $full -Raw -ErrorAction Stop
    if ($text -match '\brawFetch\b') { $rawFetchCount++ }
    if ($f.relative_path -match '/auto_') { $autoCount++ }
  } catch {}
}

$summary = @()
$summary += "SESSION_ID=$SessionId"
$summary += "SERVICE=$Service"
$summary += "TOTAL_FILES=$($all.Count)"
$summary += "SURFACE_FILES=$($surfaceFiles.Count)"
$summary += "RAWFETCH_REFERENCES=$rawFetchCount"
$summary += "AUTO_FILES=$autoCount"
$summary += "COUNTS_BY_SOURCE:"
$summary += ($countsBySource | ForEach-Object { "  $($_.source_type)=$($_.count)" })
$summary += "COUNTS_BY_SURFACE:"
$summary += ($countsBySurface | ForEach-Object { "  $($_.surface)=$($_.count)" })
$summary += "COUNTS_BY_OPERATION:"
$summary += ($countsByOperation | Select-Object -First 40 | ForEach-Object { "  $($_.operation)=$($_.count)" })

$summary -join [Environment]::NewLine | Set-Content -LiteralPath $summaryPath -Encoding UTF8

$evidence = [pscustomobject]@{
  session_id = $SessionId
  service = $Service
  totals = [pscustomobject]@{
    files = $all.Count
    surface_files = $surfaceFiles.Count
    rawfetch_references = $rawFetchCount
    auto_files = $autoCount
  }
  counts_by_source = $countsBySource
  counts_by_surface = $countsBySurface
  counts_by_operation = $countsByOperation
  outputs = [pscustomobject]@{
    source_index_csv = $csvPath
    summary_txt = $summaryPath
  }
}
$evidence | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $evidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== DSH DONOR SERVICE INTELLIGENCE ===" -ForegroundColor Cyan
Write-Host "SESSION_ID: $SessionId"
Write-Host "SERVICE:    $Service"
Write-Host "FILES:      $($all.Count)"
Write-Host "SURFACES:   $($surfaceFiles.Count)"
Write-Host "RAWFETCH:   $rawFetchCount"
Write-Host "AUTO_*:     $autoCount"
Write-Host ""
Write-Host "By Source:" -ForegroundColor Cyan
$countsBySource | ForEach-Object { Write-Host (" - {0}: {1}" -f $_.source_type, $_.count) }
Write-Host ""
Write-Host "By Surface:" -ForegroundColor Cyan
$countsBySurface | ForEach-Object { Write-Host (" - {0}: {1}" -f $_.surface, $_.count) }
Write-Host ""
Write-Host "Top Operations:" -ForegroundColor Cyan
$countsByOperation | Select-Object -First 15 | ForEach-Object { Write-Host (" - {0}: {1}" -f $_.operation, $_.count) }
Write-Host ""
Write-Host "[PASS] Intelligence intake completed." -ForegroundColor Green
Write-Host "summary:  $summaryPath"
Write-Host "evidence: $evidencePath"
Write-Host "index:    $csvPath"
'@

$files["APPLY_FREEZE_DSH_DONOR_INTELLIGENCE_MIRROR.ps1"] = @'
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal",
  [string]$MirrorRoot = "C:\Users\b\Documents\GitHub\bthwani-suite\docs\_donor\bthfinal",
  [string]$Service = "dsh",
  [string]$SessionId = ""
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'
function New-SessionId { return (Get-Date -Format "yyyyMMdd-HHmmss") + "-DSH-DONOR-MIRROR" }
function Ensure-Dir([string]$PathValue) { New-Item -ItemType Directory -Force -Path $PathValue | Out-Null }
if ([string]::IsNullOrWhiteSpace($SessionId)) { $SessionId = New-SessionId() }

$registryRoot = Join-Path $RepoRoot "kdt\volatile\registry\runs\$SessionId"
Ensure-Dir $registryRoot
Ensure-Dir $MirrorRoot

$targets = @(
  "services\$Service",
  "contracts\master",
  "packages\api-types",
  "packages\api-clients",
  "packages\surfaces\src\$Service"
)

$copied = 0
foreach ($target in $targets) {
  $src = Join-Path $DonorRoot $target
  if (Test-Path -LiteralPath $src) {
    $dst = Join-Path $MirrorRoot $target
    Ensure-Dir (Split-Path -Parent $dst)
    Copy-Item -LiteralPath $src -Destination $dst -Recurse -Force
    $copied += (Get-ChildItem -LiteralPath $dst -Recurse -File | Measure-Object).Count
  }
}

Get-ChildItem -LiteralPath $MirrorRoot -Recurse -File | ForEach-Object {
  try { $_.IsReadOnly = $true } catch {}
}

$summaryPath = Join-Path $registryRoot "summary.txt"
$evidencePath = Join-Path $registryRoot "evidence.json"
$summary = @(
  "SESSION_ID=$SessionId",
  "SERVICE=$Service",
  "MIRROR_ROOT=$MirrorRoot",
  "COPIED_FILES=$copied"
)
$summary -join [Environment]::NewLine | Set-Content -LiteralPath $summaryPath -Encoding UTF8
([pscustomobject]@{
  session_id = $SessionId
  service = $Service
  mirror_root = $MirrorRoot
  copied_files = $copied
}) | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $evidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== DSH DONOR MIRROR ===" -ForegroundColor Cyan
Write-Host "SESSION_ID:   $SessionId"
Write-Host "SERVICE:      $Service"
Write-Host "MIRROR_ROOT:  $MirrorRoot"
Write-Host "COPIED_FILES: $copied"
Write-Host ""
Write-Host "[PASS] Frozen donor mirror created and marked read-only where possible." -ForegroundColor Green
Write-Host "summary:  $summaryPath"
Write-Host "evidence: $evidencePath"
'@

$files["APPLY_BUILD_DSH_SERVICE_INTELLIGENCE_PACK.ps1"] = @'
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$DonorRoot = "C:\Users\b\Documents\GitHub\bthfinal",
  [string]$Service = "dsh",
  [string]$SessionId = ""
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'
function New-SessionId { return (Get-Date -Format "yyyyMMdd-HHmmss") + "-DSH-INTEL-PACK" }
function Ensure-Dir([string]$PathValue) { New-Item -ItemType Directory -Force -Path $PathValue | Out-Null }
function Safe-Rel([string]$Base, [string]$Full) {
  try { return [System.IO.Path]::GetRelativePath($Base, $Full) } catch { return $Full }
}
function Read-TextOrEmpty([string]$PathValue) {
  try { return Get-Content -LiteralPath $PathValue -Raw -ErrorAction Stop } catch { return "" }
}
function Normalize-Surface([string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return "" }
  switch ($Value.ToLowerInvariant()) {
    'app-user' { 'app-client' ; break }
    'mcpw' { 'control-panel' ; break }
    default { $Value }
  }
}

if ([string]::IsNullOrWhiteSpace($SessionId)) { $SessionId = New-SessionId() }

$registryRoot = Join-Path $RepoRoot "kdt\volatile\registry\runs\$SessionId"
$packRoot = Join-Path $RepoRoot "docs\services\$Service"
Ensure-Dir $registryRoot
Ensure-Dir $packRoot

$sourceIndexPath = Join-Path $packRoot "00_DONOR_SOURCE_INDEX.csv"
$operationTruthPath = Join-Path $packRoot "01_OPERATION_TRUTH_MATRIX.csv"
$opEndpointPath = Join-Path $packRoot "02_OPERATION_ENDPOINT_MATRIX.csv"
$opScreenPath = Join-Path $packRoot "03_OPERATION_SCREEN_MATRIX.csv"
$rbacRuntimePath = Join-Path $packRoot "04_RBAC_RUNTIME_RULES.csv"
$uiKitDemandPath = Join-Path $packRoot "07_UI_KIT_DEMAND.csv"
$summaryPackPath = Join-Path $packRoot "PACK_SUMMARY.md"

$targets = @(
  "services\$Service",
  "contracts\master",
  "packages\api-types",
  "packages\api-clients",
  "packages\surfaces\src\$Service"
)

$sourceIndex = New-Object System.Collections.Generic.List[object]
foreach ($target in $targets) {
  $abs = Join-Path $DonorRoot $target
  if (Test-Path -LiteralPath $abs) {
    Get-ChildItem -LiteralPath $abs -Recurse -File | ForEach-Object {
      $rel = Safe-Rel $DonorRoot $_.FullName
      $type = if ($rel -like "services\$Service\*") { "service" } elseif ($rel -like "contracts\master\*") { "contract" } elseif ($rel -like "packages\api-types\*") { "api-types" } elseif ($rel -like "packages\api-clients\*") { "api-clients" } elseif ($rel -like "packages\surfaces\src\$Service\*") { "surfaces" } else { "other" }
      if ($type -ne "other") {
        $sourceIndex.Add([pscustomobject]@{
          source_type = $type
          relative_path = $rel.Replace('\','/')
          extension = $_.Extension
          size_bytes = $_.Length
        })
      }
    }
  }
}
$sourceIndex | Sort-Object source_type, relative_path | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $sourceIndexPath

$opsRoot = Join-Path $DonorRoot "services\$Service\governance\operations"
$ops = @(if (Test-Path -LiteralPath $opsRoot) { Get-ChildItem -LiteralPath $opsRoot -Directory | Sort-Object Name } else { @() })

$opTruth = New-Object System.Collections.Generic.List[object]
$opEndpoints = New-Object System.Collections.Generic.List[object]
$opScreens = New-Object System.Collections.Generic.List[object]
$rbacRuntime = New-Object System.Collections.Generic.List[object]

foreach ($op in $ops) {
  $opName = $op.Name
  $specPath = Join-Path $op.FullName "OP_SPEC.yaml"
  $gapsPath = Join-Path $op.FullName "OP_GAPS.md"
  $apiMapPath = Join-Path $op.FullName "OP_API_MAP.csv"
  $screenMapPath = Join-Path $op.FullName "OP_SCREENS_MAP.csv"
  $rbacPath = Join-Path $op.FullName "OP_RBAC_ABAC.csv"
  $runtimeVarsPath = Join-Path $op.FullName "OP_RUNTIME_VARS.csv"

  $specText = Read-TextOrEmpty $specPath
  $specActor = ""
  $specPurpose = ""
  if ($specText -match "(?im)^\s*primary_actor\s*:\s*(.+)$") { $specActor = $Matches[1].Trim() }
  if ($specText -match "(?im)^\s*purpose\s*:\s*(.+)$") { $specPurpose = $Matches[1].Trim() }

  $opTruth.Add([pscustomobject]@{
    operation = $opName
    spec_exists = [bool](Test-Path -LiteralPath $specPath)
    api_map_exists = [bool](Test-Path -LiteralPath $apiMapPath)
    screens_map_exists = [bool](Test-Path -LiteralPath $screenMapPath)
    rbac_exists = [bool](Test-Path -LiteralPath $rbacPath)
    runtime_vars_exists = [bool](Test-Path -LiteralPath $runtimeVarsPath)
    gaps_exists = [bool](Test-Path -LiteralPath $gapsPath)
    primary_actor = $specActor
    purpose = $specPurpose
  })

  if (Test-Path -LiteralPath $apiMapPath) {
    try {
      Import-Csv -LiteralPath $apiMapPath | ForEach-Object {
        $rowJson = ($_ | ConvertTo-Json -Compress -Depth 6)
        $rowText = [string]$rowJson
        $method = ""
        $endpoint = ""
        foreach ($prop in $_.PSObject.Properties) {
          if (-not $method -and $prop.Value -match 'GET|POST|PATCH|PUT|DELETE') { $method = [string]$prop.Value }
          if (-not $endpoint -and $prop.Value -match '^\/') { $endpoint = [string]$prop.Value }
        }
        $opEndpoints.Add([pscustomobject]@{
          operation = $opName
          method = $method
          endpoint = $endpoint
          source_file = (Safe-Rel $DonorRoot $apiMapPath).Replace('\','/')
          raw_row = $rowText
        })
      }
    } catch {}
  }

  if (Test-Path -LiteralPath $screenMapPath) {
    try {
      Import-Csv -LiteralPath $screenMapPath | ForEach-Object {
        $screen = ""
        $surface = ""
        foreach ($prop in $_.PSObject.Properties) {
          if (-not $screen -and $prop.Value -match '[A-Za-z]') { $screen = [string]$prop.Value }
          if (-not $surface -and $prop.Value -match 'app-|mcpw|control-panel|webapp|website') { $surface = Normalize-Surface ([string]$prop.Value) }
        }
        $opScreens.Add([pscustomobject]@{
          operation = $opName
          surface = $surface
          screen = $screen
          source_file = (Safe-Rel $DonorRoot $screenMapPath).Replace('\','/')
          raw_row = ($_ | ConvertTo-Json -Compress -Depth 6)
        })
      }
    } catch {}
  }

  if (Test-Path -LiteralPath $rbacPath) {
    try {
      Import-Csv -LiteralPath $rbacPath | ForEach-Object {
        $role = ""
        foreach ($prop in $_.PSObject.Properties) {
          if (-not $role -and $prop.Value -match '[A-Za-z]') { $role = [string]$prop.Value }
        }
        $rbacRuntime.Add([pscustomobject]@{
          operation = $opName
          rule_type = "rbac"
          rule_value = $role
          source_file = (Safe-Rel $DonorRoot $rbacPath).Replace('\','/')
          raw_row = ($_ | ConvertTo-Json -Compress -Depth 6)
        })
      }
    } catch {}
  }

  if (Test-Path -LiteralPath $runtimeVarsPath) {
    try {
      Import-Csv -LiteralPath $runtimeVarsPath | ForEach-Object {
        $name = ""
        foreach ($prop in $_.PSObject.Properties) {
          if (-not $name -and $prop.Value -match '^[A-Z0-9_]+$') { $name = [string]$prop.Value }
        }
        $rbacRuntime.Add([pscustomobject]@{
          operation = $opName
          rule_type = "runtime_var"
          rule_value = $name
          source_file = (Safe-Rel $DonorRoot $runtimeVarsPath).Replace('\','/')
          raw_row = ($_ | ConvertTo-Json -Compress -Depth 6)
        })
      }
    } catch {}
  }
}

$surfaceRoot = Join-Path $DonorRoot "packages\surfaces\src\$Service"
$uiKitDemand = New-Object System.Collections.Generic.List[object]
if (Test-Path -LiteralPath $surfaceRoot) {
  Get-ChildItem -LiteralPath $surfaceRoot -Recurse -File -Include *.ts,*.tsx | ForEach-Object {
    $txt = Read-TextOrEmpty $_.FullName
    if ($txt -match "@bthwani/ui-kit") {
      $match = [regex]::Match($txt, "import\s*{([^}]*)}\s*from\s*['""]@bthwani/ui-kit['""]", 'Singleline')
      $symbols = @()
      if ($match.Success) {
        $symbols = $match.Groups[1].Value.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
      } else {
        $symbols = @("namespace-or-default-import")
      }
      foreach ($symbol in $symbols) {
        $uiKitDemand.Add([pscustomobject]@{
          source_file = (Safe-Rel $DonorRoot $_.FullName).Replace('\','/')
          ui_kit_symbol = $symbol
        })
      }
    }
  }
}

$opTruth | Sort-Object operation | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $operationTruthPath
$opEndpoints | Sort-Object operation, endpoint | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $opEndpointPath
$opScreens | Sort-Object operation, surface, screen | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $opScreenPath
$rbacRuntime | Sort-Object operation, rule_type, rule_value | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $rbacRuntimePath
$uiKitDemand | Group-Object ui_kit_symbol | Sort-Object Count -Descending | ForEach-Object {
  [pscustomobject]@{ ui_kit_symbol = $_.Name; count = $_.Count }
} | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $uiKitDemandPath

$packSummary = @"
# DSH Service Intelligence Pack

- Source index: `00_DONOR_SOURCE_INDEX.csv`
- Operation truth: `01_OPERATION_TRUTH_MATRIX.csv`
- Operation ↔ endpoint: `02_OPERATION_ENDPOINT_MATRIX.csv`
- Operation ↔ screen: `03_OPERATION_SCREEN_MATRIX.csv`
- RBAC/runtime rules: `04_RBAC_RUNTIME_RULES.csv`
- UI Kit demand: `07_UI_KIT_DEMAND.csv`

## Counts
- Operations: $($opTruth.Count)
- Endpoint rows: $($opEndpoints.Count)
- Screen rows: $($opScreens.Count)
- RBAC/runtime rows: $($rbacRuntime.Count)
- UI Kit symbols: $((Import-Csv -LiteralPath $uiKitDemandPath | Measure-Object).Count)
"@
$packSummary | Set-Content -LiteralPath $summaryPackPath -Encoding UTF8

$summaryPath = Join-Path $registryRoot "summary.txt"
$evidencePath = Join-Path $registryRoot "evidence.json"
$summary = @(
  "SESSION_ID=$SessionId",
  "SERVICE=$Service",
  "PACK_ROOT=$packRoot",
  "OPERATIONS=$($opTruth.Count)",
  "ENDPOINT_ROWS=$($opEndpoints.Count)",
  "SCREEN_ROWS=$($opScreens.Count)",
  "RBAC_RUNTIME_ROWS=$($rbacRuntime.Count)"
)
$summary -join [Environment]::NewLine | Set-Content -LiteralPath $summaryPath -Encoding UTF8
([pscustomobject]@{
  session_id = $SessionId
  service = $Service
  pack_root = $packRoot
  operations = $opTruth.Count
  endpoint_rows = $opEndpoints.Count
  screen_rows = $opScreens.Count
  rbac_runtime_rows = $rbacRuntime.Count
}) | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $evidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== BUILD DSH SERVICE INTELLIGENCE PACK ===" -ForegroundColor Cyan
Write-Host "PACK_ROOT:          $packRoot"
Write-Host "OPERATIONS:         $($opTruth.Count)"
Write-Host "ENDPOINT_ROWS:      $($opEndpoints.Count)"
Write-Host "SCREEN_ROWS:        $($opScreens.Count)"
Write-Host "RBAC_RUNTIME_ROWS:  $($rbacRuntime.Count)"
Write-Host ""
Write-Host "[PASS] Intelligence pack generated." -ForegroundColor Green
Write-Host "summary:  $summaryPath"
Write-Host "evidence: $evidencePath"
'@

$files["CHECK_ANALYZE_DSH_SERVICE_DRIFT.ps1"] = @'
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$Service = "dsh",
  [string]$SessionId = ""
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'
function New-SessionId { return (Get-Date -Format "yyyyMMdd-HHmmss") + "-DSH-DRIFT" }
function Ensure-Dir([string]$PathValue) { New-Item -ItemType Directory -Force -Path $PathValue | Out-Null }

if ([string]::IsNullOrWhiteSpace($SessionId)) { $SessionId = New-SessionId() }

$registryRoot = Join-Path $RepoRoot "kdt\volatile\registry\runs\$SessionId"
Ensure-Dir $registryRoot

$packRoot = Join-Path $RepoRoot "docs\services\$Service"
$operationTruthPath = Join-Path $packRoot "01_OPERATION_TRUTH_MATRIX.csv"
$opEndpointPath = Join-Path $packRoot "02_OPERATION_ENDPOINT_MATRIX.csv"
$opScreenPath = Join-Path $packRoot "03_OPERATION_SCREEN_MATRIX.csv"

if (-not (Test-Path -LiteralPath $operationTruthPath)) { throw "Missing intelligence pack file: $operationTruthPath" }
if (-not (Test-Path -LiteralPath $opEndpointPath)) { throw "Missing intelligence pack file: $opEndpointPath" }
if (-not (Test-Path -LiteralPath $opScreenPath)) { throw "Missing intelligence pack file: $opScreenPath" }

$ops = Import-Csv -LiteralPath $operationTruthPath
$endpointRows = Import-Csv -LiteralPath $opEndpointPath
$screenRows = Import-Csv -LiteralPath $opScreenPath

$currentSurfaceRoot = Join-Path $RepoRoot "packages\surfaces\src\$Service"
$currentScreens = @()
if (Test-Path -LiteralPath $currentSurfaceRoot) {
  $currentScreens = Get-ChildItem -LiteralPath $currentSurfaceRoot -Recurse -File -Include *.tsx |
    ForEach-Object {
      [pscustomobject]@{
        file = $_.FullName
        name = $_.BaseName
      }
    }
}

$drift = New-Object System.Collections.Generic.List[object]
foreach ($op in $ops) {
  $opName = $op.operation
  $hasEndpoint = [bool]($endpointRows | Where-Object { $_.operation -eq $opName } | Select-Object -First 1)
  $hasScreenMap = [bool]($screenRows | Where-Object { $_.operation -eq $opName } | Select-Object -First 1)
  $screenNames = @($screenRows | Where-Object { $_.operation -eq $opName -and $_.screen } | Select-Object -ExpandProperty screen -Unique)
  $matchedCurrent = @()
  foreach ($sn in $screenNames) {
    $matchedCurrent += $currentScreens | Where-Object { $_.name -like "*$sn*" -or $_.file -like "*$sn*" }
  }
  $status = if (-not $hasEndpoint -and -not $hasScreenMap) { "orphan-operation" }
            elseif ($hasEndpoint -and -not $hasScreenMap) { "missing-screen-map" }
            elseif ($hasScreenMap -and $matchedCurrent.Count -eq 0) { "not-implemented-in-new-repo" }
            else { "mapped-or-implemented" }

  $drift.Add([pscustomobject]@{
    operation = $opName
    has_endpoint = $hasEndpoint
    has_screen_map = $hasScreenMap
    mapped_screen_count = $screenNames.Count
    current_match_count = @($matchedCurrent).Count
    status = $status
  })
}

$driftCsv = Join-Path $registryRoot "dsh_service_drift.csv"
$driftMd = Join-Path $registryRoot "dsh_service_drift.md"
$summaryPath = Join-Path $registryRoot "summary.txt"
$evidencePath = Join-Path $registryRoot "evidence.json"

$drift | Sort-Object status, operation | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $driftCsv

$counts = $drift | Group-Object status | Sort-Object Name
$md = @("# DSH Service Drift", "", "## Status counts")
$md += ($counts | ForEach-Object { "- **$($_.Name)**: $($_.Count)" })
$md += ""
$md += "## Operations"
$md += ($drift | Sort-Object status, operation | ForEach-Object { "- $($_.operation): $($_.status) (endpoint=$($_.has_endpoint), screen_map=$($_.has_screen_map), current=$($_.current_match_count))" })
$md | Set-Content -LiteralPath $driftMd -Encoding UTF8

$summary = @(
  "SESSION_ID=$SessionId",
  "SERVICE=$Service",
  "OPERATIONS=$($drift.Count)",
  "STATUS_COUNTS:"
)
$summary += ($counts | ForEach-Object { "  $($_.Name)=$($_.Count)" })
$summary -join [Environment]::NewLine | Set-Content -LiteralPath $summaryPath -Encoding UTF8
([pscustomobject]@{
  session_id = $SessionId
  service = $Service
  operation_count = $drift.Count
  status_counts = $counts
  outputs = [pscustomobject]@{
    drift_csv = $driftCsv
    drift_md = $driftMd
  }
}) | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $evidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== DSH SERVICE DRIFT ===" -ForegroundColor Cyan
Write-Host "OPERATIONS: $($drift.Count)"
$counts | ForEach-Object { Write-Host (" - {0}: {1}" -f $_.Name, $_.Count) }
Write-Host ""
Write-Host "[PASS] Drift analysis completed." -ForegroundColor Green
Write-Host "summary:  $summaryPath"
Write-Host "evidence: $evidencePath"
Write-Host "drift:    $driftCsv"
'@

$files["APPLY_BUILD_DSH_REBUILD_QUEUE.ps1"] = @'
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$Service = "dsh",
  [string]$SessionId = ""
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'
function New-SessionId { return (Get-Date -Format "yyyyMMdd-HHmmss") + "-DSH-REBUILD-QUEUE" }
function Ensure-Dir([string]$PathValue) { New-Item -ItemType Directory -Force -Path $PathValue | Out-Null }

if ([string]::IsNullOrWhiteSpace($SessionId)) { $SessionId = New-SessionId() }

$registryRoot = Join-Path $RepoRoot "kdt\volatile\registry\runs\$SessionId"
Ensure-Dir $registryRoot

$packRoot = Join-Path $RepoRoot "docs\services\$Service"
$opScreenPath = Join-Path $packRoot "03_OPERATION_SCREEN_MATRIX.csv"
$uiKitDemandPath = Join-Path $packRoot "07_UI_KIT_DEMAND.csv"

if (-not (Test-Path -LiteralPath $opScreenPath)) { throw "Missing intelligence pack file: $opScreenPath" }

$screenRows = Import-Csv -LiteralPath $opScreenPath
$uiKitDemand = @()
if (Test-Path -LiteralPath $uiKitDemandPath) { $uiKitDemand = Import-Csv -LiteralPath $uiKitDemandPath }

$queuePath = Join-Path $packRoot "08_REBUILD_QUEUE.md"
$summaryPath = Join-Path $registryRoot "summary.txt"
$evidencePath = Join-Path $registryRoot "evidence.json"

$items = New-Object System.Collections.Generic.List[object]
foreach ($row in $screenRows) {
  $screen = [string]$row.screen
  $surface = [string]$row.surface
  $operation = [string]$row.operation
  if ([string]::IsNullOrWhiteSpace($screen)) { continue }

  $decision = if ($screen -match 'Confirm|Review|Status|Filter|Picker') { 'CONVERT_OR_MERGE_REVIEW' } else { 'KEEP_REBUILD_CLEAN' }
  $target = if ($surface -eq 'app-user') { 'app-client' } elseif ($surface -eq 'mcpw') { 'control-panel' } else { $surface }
  if ([string]::IsNullOrWhiteSpace($target)) { $target = 'TBD' }

  $items.Add([pscustomobject]@{
    priority = 2
    surface = $target
    operation = $operation
    screen = $screen
    decision = $decision
    target_path = "packages/surfaces/src/dsh/$target/<flow>/screens/$screen.tsx"
  })
}

$deduped = $items | Sort-Object surface, operation, screen -Unique
$phase1 = $deduped | Where-Object { $_.surface -in @('app-client','app-partner','app-captain','control-panel') }
$phase2 = $deduped | Where-Object { $_.surface -in @('app-field','webapp','website','TBD') }

$md = @(
  "# DSH Rebuild Queue",
  "",
  "## Decision law",
  "- `KEEP_REBUILD_CLEAN`: preserve purpose, rebuild on canonical ui-kit",
  "- `CONVERT_OR_MERGE_REVIEW`: candidate for merge/sheet/inline review state",
  "",
  "## Phase 1",
  ""
)
$md += ($phase1 | ForEach-Object { "- [$($_.surface)] $($_.operation) -> $($_.screen) => $($_.decision) -> `$($_.target_path)`" })
$md += ""
$md += "## Phase 2"
$md += ""
$md += ($phase2 | ForEach-Object { "- [$($_.surface)] $($_.operation) -> $($_.screen) => $($_.decision) -> `$($_.target_path)`" })
$md += ""
$md += "## UI Kit demand signals"
$md += ($uiKitDemand | Select-Object -First 20 | ForEach-Object { "- $($_.ui_kit_symbol): $($_.count)" })

$md | Set-Content -LiteralPath $queuePath -Encoding UTF8

$summary = @(
  "SESSION_ID=$SessionId",
  "SERVICE=$Service",
  "QUEUE_ITEMS=$($deduped.Count)",
  "PHASE1=$(@($phase1).Count)",
  "PHASE2=$(@($phase2).Count)"
)
$summary -join [Environment]::NewLine | Set-Content -LiteralPath $summaryPath -Encoding UTF8
([pscustomobject]@{
  session_id = $SessionId
  service = $Service
  queue_items = $deduped.Count
  phase1 = @($phase1).Count
  phase2 = @($phase2).Count
  queue_path = $queuePath
}) | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $evidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== DSH REBUILD QUEUE ===" -ForegroundColor Cyan
Write-Host "QUEUE_ITEMS: $($deduped.Count)"
Write-Host "PHASE1:      $(@($phase1).Count)"
Write-Host "PHASE2:      $(@($phase2).Count)"
Write-Host ""
Write-Host "[PASS] Rebuild queue generated." -ForegroundColor Green
Write-Host "summary:  $summaryPath"
Write-Host "evidence: $evidencePath"
Write-Host "queue:    $queuePath"
'@

$files["CHECK_VERIFY_DSH_LEGACY_LEAK_GUARD.ps1"] = @'
[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\b\Documents\GitHub\bthwani-suite",
  [string]$Service = "dsh",
  [string]$SessionId = ""
)

Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'
function New-SessionId { return (Get-Date -Format "yyyyMMdd-HHmmss") + "-DSH-LEAK-GUARD" }
function Ensure-Dir([string]$PathValue) { New-Item -ItemType Directory -Force -Path $PathValue | Out-Null }

if ([string]::IsNullOrWhiteSpace($SessionId)) { $SessionId = New-SessionId() }

$registryRoot = Join-Path $RepoRoot "kdt\volatile\registry\runs\$SessionId"
Ensure-Dir $registryRoot

$scanRoots = @(
  Join-Path $RepoRoot "packages\surfaces\src\$Service",
  Join-Path $RepoRoot "apps",
  Join-Path $RepoRoot "docs\services\$Service"
) | Where-Object { Test-Path -LiteralPath $_ }

$leaks = New-Object System.Collections.Generic.List[object]
foreach ($root in $scanRoots) {
  Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.md | ForEach-Object {
    $text = ""
    try { $text = Get-Content -LiteralPath $_.FullName -Raw -ErrorAction Stop } catch {}
    $rules = @(
      @{ label = 'legacy-bthfinal-path'; pattern = 'bthfinal' },
      @{ label = 'legacy-app-user'; pattern = '\bapp-user\b' },
      @{ label = 'legacy-mcpw'; pattern = '\bmcpw\b' },
      @{ label = 'rawfetch'; pattern = '\brawFetch\b' },
      @{ label = 'auto-file-reference'; pattern = 'auto_[A-Za-z0-9_]+' }
    )
    foreach ($rule in $rules) {
      if ($text -match $rule.pattern) {
        $leaks.Add([pscustomobject]@{
          file = $_.FullName
          issue = $rule.label
        })
      }
    }
  }
}

$leakCsv = Join-Path $registryRoot "dsh_legacy_leaks.csv"
$summaryPath = Join-Path $registryRoot "summary.txt"
$evidencePath = Join-Path $registryRoot "evidence.json"

$leaks | Sort-Object issue, file -Unique | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $leakCsv

$status = if (@($leaks).Count -eq 0) { "PASS" } else { "FAIL" }
$summary = @(
  "SESSION_ID=$SessionId",
  "SERVICE=$Service",
  "STATUS=$status",
  "LEAK_COUNT=$(@($leaks | Sort-Object issue, file -Unique).Count)"
)
$summary -join [Environment]::NewLine | Set-Content -LiteralPath $summaryPath -Encoding UTF8
([pscustomobject]@{
  session_id = $SessionId
  service = $Service
  status = $status
  leak_count = @($leaks | Sort-Object issue, file -Unique).Count
  output = $leakCsv
}) | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $evidencePath -Encoding UTF8

Write-Host ""
Write-Host "=== DSH LEGACY LEAK GUARD ===" -ForegroundColor Cyan
Write-Host "STATUS:     $status"
Write-Host "LEAK_COUNT: $(@($leaks | Sort-Object issue, file -Unique).Count)"
if ($status -eq 'FAIL') {
  ($leaks | Sort-Object issue, file -Unique | Select-Object -First 20) | ForEach-Object {
    Write-Host (" - {0} :: {1}" -f $_.issue, $_.file)
  }
  Write-Host "[FAIL] Legacy leak guard found violations." -ForegroundColor Red
} else {
  Write-Host "[PASS] No legacy leak violations found." -ForegroundColor Green
}
Write-Host "summary:  $summaryPath"
Write-Host "evidence: $evidencePath"
Write-Host "leaks:    $leakCsv"
'@

$files["README.md"] = @'
# DSH donor intake script pack

## Purpose
This pack creates DSH-specific donor-intake scripts under:
`C:\Users\b\Documents\GitHub\bthwani-suite\tools\scripts`

## Generated scripts
- CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1
- APPLY_FREEZE_DSH_DONOR_INTELLIGENCE_MIRROR.ps1
- APPLY_BUILD_DSH_SERVICE_INTELLIGENCE_PACK.ps1
- CHECK_ANALYZE_DSH_SERVICE_DRIFT.ps1
- APPLY_BUILD_DSH_REBUILD_QUEUE.ps1
- CHECK_VERIFY_DSH_LEGACY_LEAK_GUARD.ps1

## Run order
1. CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1
2. APPLY_FREEZE_DSH_DONOR_INTELLIGENCE_MIRROR.ps1
3. APPLY_BUILD_DSH_SERVICE_INTELLIGENCE_PACK.ps1
4. CHECK_ANALYZE_DSH_SERVICE_DRIFT.ps1
5. APPLY_BUILD_DSH_REBUILD_QUEUE.ps1
6. CHECK_VERIFY_DSH_LEGACY_LEAK_GUARD.ps1

## Notes
- Every script is PowerShell-only and self-contained.
- Evidence is written under:
  `C:\Users\b\Documents\GitHub\bthwani-suite\kdt\volatile\registry\runs\{SESSION_ID}\`
- Scripts do not auto-close the terminal.
'@

foreach ($name in $files.Keys) {
  $target = Join-Path $ScriptsRoot $name
  $content = $files[$name].TrimStart("`r","`n")
  Set-Content -LiteralPath $target -Value $content -Encoding UTF8
}

Write-Section "Created files"
Get-ChildItem -LiteralPath $ScriptsRoot -Filter "*DSH*" | Sort-Object Name | ForEach-Object {
  Write-Host $_.FullName
}

Write-Ok "DSH donor script pack written to $ScriptsRoot"

if ($RunFirst) {
  $first = Join-Path $ScriptsRoot "CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1"
  Write-Section "Running first script"
  & $first -RepoRoot $RepoRoot -DonorRoot $DonorRoot -Service "dsh"
}
else {
  Write-WarnMsg "RunFirst was not supplied. The pack was generated only."
}

Write-Host ""
Write-Host "Suggested next command:" -ForegroundColor Cyan
Write-Host "& `"$ScriptsRoot\CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1`""
