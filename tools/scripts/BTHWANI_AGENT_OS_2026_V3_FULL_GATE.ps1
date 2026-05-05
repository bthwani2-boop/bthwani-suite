$ErrorActionPreference = "Stop"

$RepoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Get-Location).Path
}
Set-Location -LiteralPath $RepoRoot

$Target = Join-Path $RepoRoot "tools/scripts/CHECK_AGENT_GOVERNANCE_KIT_INTAKE.ps1"
if (-not (Test-Path -LiteralPath $Target)) {
  throw "Missing target script: $Target"
}

& pwsh -NoProfile -ExecutionPolicy Bypass -File $Target
exit $LASTEXITCODE