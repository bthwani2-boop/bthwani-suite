param(
  [ValidateSet('Local', 'CI')]
  [string]$Mode = 'Local',

  [switch]$FailOnWarning
)

$Runner = Join-Path $PSScriptRoot 'RUN_GOVERNANCE_GUARDS.ps1'
& $Runner -Mode $Mode -Profile Agent -FailOnWarning:$FailOnWarning
exit $LASTEXITCODE
