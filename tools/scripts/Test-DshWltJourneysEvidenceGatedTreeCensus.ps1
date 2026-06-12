#Requires -Version 7
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath "C:\bthwani-suite"
$RepoRoot = "C:\bthwani-suite"

$InventoryPath = Join-Path $RepoRoot "dsh/docs/JOURNIES/JOURNIES_ZERO_GAP_LIVE_PROJECT_INVENTORY.md"
$DecisionPath = Join-Path $RepoRoot "dsh/docs/JOURNIES/JOURNIES_ZERO_GAP_FINAL_AUDIT_DECISION.md"

if (-not (Test-Path $InventoryPath)) {
  throw "Missing inventory file: $InventoryPath"
}
if (-not (Test-Path $DecisionPath)) {
  throw "Missing decision file: $DecisionPath"
}

$InventoryText = Get-Content $InventoryPath -Raw
$DecisionText = Get-Content $DecisionPath -Raw

if ($InventoryText -notmatch 'FOUNDATION_CENSUS_PASSED') {
  throw "Inventory status is not FOUNDATION_CENSUS_PASSED"
}
if ($DecisionText -notmatch 'PASS') {
  throw "Final audit decision is not PASS"
}

Write-Host "CENSUS_TEST: PASS"
exit 0
