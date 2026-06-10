Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$CandidateScripts = @(
  ".\tools\design-guard-bootstrap\BTHWANI_DESIGN_GUARD_READINESS_FAST_V4.ps1",
  ".\tools\design-guard-execution-v4\00_DESIGN_GUARD_READINESS_V4.ps1",
  ".\tools\guards\design\00_DESIGN_GUARD_READINESS_V4.ps1"
)

foreach ($script in $CandidateScripts) {
  if (Test-Path -LiteralPath $script) {
    powershell -NoProfile -ExecutionPolicy Bypass -File $script
    exit $LASTEXITCODE
  }
}

throw "No Design Guard readiness V4 script found."
