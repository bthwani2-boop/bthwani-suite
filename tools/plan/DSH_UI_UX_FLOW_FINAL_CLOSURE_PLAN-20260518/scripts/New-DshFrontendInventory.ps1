param(
  [string]$RepoRoot = "C:\bthwani-suite"
)
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $RepoRoot
$SessionId = "DSH_FORENSIC_INVENTORY-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunDir = Join-Path ".\tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $RunDir | Out-Null
$csv = Join-Path $RunDir "dsh-frontend-file-inventory.csv"
"path,kind,area,has_imports,has_exports,lines" | Out-File -Encoding utf8 $csv
Get-ChildItem -Recurse -File dsh\frontend | Where-Object { $_.Extension -in ".ts", ".tsx" } | ForEach-Object {
  $p = $_.FullName.Substring((Get-Location).Path.Length + 1).Replace("\", "/")
  $content = Get-Content -LiteralPath $_.FullName -Raw
  $kind = if ($p -match "/screens/") { "SCREEN_OR_COMPOSITE" } elseif ($p -match "/sections/") { "SECTION" } elseif ($p -match "/sheets/") { "SHEET" } elseif ($p -match "/parts/") { "PART" } elseif ($p -match "screen-registry") { "REGISTRY" } elseif ($p -match "routes") { "ROUTES" } else { "OTHER" }
  $area = if ($p -match "app-client") { "app-client" } elseif ($p -match "app-partner") { "app-partner" } elseif ($p -match "app-captain") { "app-captain" } elseif ($p -match "app-field") { "app-field" } elseif ($p -match "control-panel") { "control-panel" } else { "unknown" }
  $hasImports = ($content -match "import ")
  $hasExports = ($content -match "export ")
  $lines = ($content -split "`n").Count
  "`"$p`",$kind,$area,$hasImports,$hasExports,$lines" | Out-File -Encoding utf8 -Append $csv
}
"Inventory: $csv"
