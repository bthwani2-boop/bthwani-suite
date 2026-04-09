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
  $m = [regex]::Matches($Text, '@bthwani/ui-kit')
  if ($m.Count -eq 0) { return "" }
  $brace = [regex]::Match($Text, 'import\s*{([^}]*)}\s*from\s*["''']@bthwani/ui-kit["''']', 'Singleline')
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
