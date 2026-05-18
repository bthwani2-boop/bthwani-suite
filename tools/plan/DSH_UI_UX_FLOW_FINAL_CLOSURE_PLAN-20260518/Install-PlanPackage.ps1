param(
  [string]$RepoRoot = "C:\bthwani-suite"
)
$ErrorActionPreference = "Stop"
$PlanName = "DSH_UI_UX_FLOW_FINAL_CLOSURE_PLAN-20260518"
$SourceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetRoot = Join-Path $RepoRoot "tools\plan"
$TargetDir = Join-Path $TargetRoot $PlanName
New-Item -ItemType Directory -Force -Path $TargetRoot | Out-Null
if (Test-Path -LiteralPath $TargetDir) {
  $Backup = $TargetDir + ".bak-" + (Get-Date -Format "yyyyMMdd-HHmmss")
  Rename-Item -LiteralPath $TargetDir -NewName (Split-Path -Leaf $Backup)
}
Copy-Item -Recurse -Force -LiteralPath $SourceDir -Destination $TargetDir
Write-Host "Installed plan package to: $TargetDir"
Write-Host "Next command:"
Write-Host ".\tools\plan\$PlanName\scripts\Invoke-DshPlanPreflight.ps1"
