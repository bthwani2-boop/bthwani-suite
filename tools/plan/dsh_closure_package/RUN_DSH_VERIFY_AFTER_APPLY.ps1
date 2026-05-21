Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath "C:\bthwani-suite"

$SessionId = "DSH_E2E_VERIFY_{0}" -f (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Save-Command([string]$Name, [scriptblock]$Command) {
  $Out = Join-Path $RunRoot $Name
  try { & $Command *>&1 | Tee-Object -FilePath $Out | Out-Null }
  catch { $_ | Out-File -FilePath $Out -Encoding UTF8; throw }
}

"# DSH Verify After Apply`n`nSession: $SessionId`nDate: $(Get-Date -Format o)`n" | Out-File -FilePath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8
Save-Command "00-git-status.txt" { git status --short --branch }
Save-Command "01-git-diff-stat.txt" { git --no-pager diff --stat }
Save-Command "02-git-diff-name-status.txt" { git --no-pager diff --name-status }
Save-Command "03-untracked.txt" { git ls-files --others --exclude-standard }
Save-Command "04-diff-check.txt" { git diff --check }
Save-Command "05-service-blueprint-guard.txt" { pnpm run guard:service-blueprint }
Save-Command "06-design-token-guard.txt" { pnpm run guard:protected-tokens }
Save-Command "07-ui-boundary-guard.txt" { pnpm run guard:tamagui-import-boundary }
Save-Command "08-i18n-direction-guard.txt" { pnpm run guard:i18n-direction:mobile-control-panel }
Save-Command "09-secret-scan.txt" { pnpm run guard:secret-scan }
Save-Command "10-typecheck.txt" { pnpm -w exec tsc --noEmit }
Save-Command "11-build-mobile-control-panel.txt" { pnpm run build:mobile-control-panel }

@"
# Required manual visual evidence after this script

Attach screenshots for all changed DSH surfaces and states:
- app-client: discovery/store/cart/checkout/order-created/tracking/support/rating/cancel/refund visibility.
- app-partner: onboarding/store visibility/catalog/barcode/order intake/accept/reject/prepare/ready/handoff/support.
- app-captain: availability/offers/accept/decline/map/pickup/dropoff/PoD/support.
- app-field: store list/onboarding/doc verification/visit evidence/readiness escalation/success exit.
- control-panel: operations/dispatch/exceptions/support/finance WLT views/partners/catalog/vars/admin/audit/command center.

No PASS/CLOSED/100% claim before screenshots are reviewed.
"@ | Out-File -FilePath (Join-Path $RunRoot "VISUAL_EVIDENCE_REQUIRED.md") -Encoding UTF8

$Evidence = [ordered]@{
  sessionId = $SessionId
  scope = "DSH verification after apply"
  runRoot = $RunRoot
  createdAt = (Get-Date -Format o)
  decision = "NEEDS_VISUAL_EVIDENCE_UNTIL_SCREENSHOTS_ATTACHED"
}
$Evidence | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $RunRoot "evidence.json") -Encoding UTF8
Compress-Archive -LiteralPath $RunRoot -DestinationPath (Join-Path $RunRoot ("$SessionId.zip")) -Force
Write-Host "DONE: $RunRoot"
Write-Host "ZIP: $(Join-Path $RunRoot ("$SessionId.zip"))"
