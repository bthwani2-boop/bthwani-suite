Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath "C:\bthwani-suite"

$SessionId = "DSH_E2E_FORENSIC_{0}" -f (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Write-Section([string]$Title) {
  "`n## $Title`n" | Tee-Object -FilePath (Join-Path $RunRoot "SUMMARY.md") -Append | Out-Null
}
function Save-Command([string]$Name, [scriptblock]$Command) {
  $Out = Join-Path $RunRoot $Name
  try {
    & $Command *>&1 | Tee-Object -FilePath $Out | Out-Null
  } catch {
    $_ | Out-File -FilePath $Out -Encoding UTF8
    throw
  }
}

"# DSH End-to-End Forensic Scan`n`nSession: $SessionId`nDate: $(Get-Date -Format o)`nScope: READ-ONLY scan + evidence. No implementation writes except this evidence folder.`n" | Out-File -FilePath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8

Save-Command "00-git-status.txt" { git status --short --branch }
Save-Command "01-git-branch.txt" { git branch --show-current }
Save-Command "02-git-head.txt" { git rev-parse HEAD }
Save-Command "03-dsh-file-tree.txt" { Get-ChildItem -LiteralPath dsh -Recurse -File | Sort-Object FullName | ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\', '') } }
Save-Command "04-dsh-file-counts.txt" {
  $files = Get-ChildItem -LiteralPath dsh -Recurse -File
  "total=$($files.Count)"
  "frontend=$((Get-ChildItem -LiteralPath dsh\frontend -Recurse -File -ErrorAction SilentlyContinue).Count)"
  "docs=$((Get-ChildItem -LiteralPath dsh\docs -Recurse -File -ErrorAction SilentlyContinue).Count)"
  $files | Group-Object Extension | Sort-Object Count -Descending | Format-Table Count,Name -AutoSize
}
Save-Command "05-dsh-large-files.txt" {
  Get-ChildItem -LiteralPath dsh\frontend -Recurse -Include *.ts,*.tsx -File | ForEach-Object {
    [PSCustomObject]@{ Lines = (Get-Content -LiteralPath $_.FullName -ErrorAction SilentlyContinue | Measure-Object -Line).Lines; Path = $_.FullName.Replace((Get-Location).Path + '\', '') }
  } | Sort-Object Lines -Descending | Select-Object -First 80 | Format-Table -AutoSize
}
Save-Command "06-dsh-gap-matrix-summary.txt" {
  $csvs = @(
    "dsh\docs\closure\DSH_MISSING_LOGIC_AND_UI_GAPS.csv",
    "dsh\docs\closure\DSH_CONTRACT_GAP_MAP.csv",
    "dsh\docs\closure\DSH_ROUTE_STATE_CTA_MATRIX.csv",
    "dsh\docs\closure\DSH_SCREEN_INVENTORY.csv",
    "dsh\docs\closure\DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX.csv",
    "dsh\docs\closure\DSH_SKELETON_WIRING_MATRIX.csv",
    "dsh\docs\closure\DSH_CONTROL_PANEL_SECTION_MAP.csv"
  )
  foreach ($csv in $csvs) {
    if (Test-Path -LiteralPath $csv) {
      "`n### $csv"
      $rows = Import-Csv -LiteralPath $csv
      "rows=$($rows.Count)"
      foreach ($field in @('status','priority','surface','gap_type','blocked_by','wiring_status','owner_service','finance_owner')) {
        if ($rows.Count -gt 0 -and ($rows[0].PSObject.Properties.Name -contains $field)) {
          "-- $field"
          $rows | Group-Object $field | Sort-Object Count -Descending | Select-Object Count,Name | Format-Table -AutoSize
        }
      }
    }
  }
}
Save-Command "07-dsh-risk-patterns.txt" {
  "TODO/FIXME/HACK/XXX:"; Select-String -Path dsh\frontend\**\*.ts,dsh\frontend\**\*.tsx -Pattern 'TODO|FIXME|HACK|XXX' -CaseSensitive:$false -ErrorAction SilentlyContinue
  "`nHardcoded hex values:"; Select-String -Path dsh\frontend\**\*.ts,dsh\frontend\**\*.tsx -Pattern '#[0-9A-Fa-f]{3,8}' -ErrorAction SilentlyContinue
  "`nconsole.*:"; Select-String -Path dsh\frontend\**\*.ts,dsh\frontend\**\*.tsx -Pattern 'console\.' -ErrorAction SilentlyContinue
  "`nany/ts-ignore:"; Select-String -Path dsh\frontend\**\*.ts,dsh\frontend\**\*.tsx -Pattern '@ts-ignore|@ts-expect-error|\bany\b' -ErrorAction SilentlyContinue
  "`nDirect Tamagui imports outside ui-kit:"; Select-String -Path dsh\frontend\**\*.ts,dsh\frontend\**\*.tsx -Pattern 'from [''"]tamagui[''"]|from [''"]@tamagui' -ErrorAction SilentlyContinue
  "`nDirect react-native imports in DSH frontend:"; Select-String -Path dsh\frontend\**\*.ts,dsh\frontend\**\*.tsx -Pattern 'from [''"]react-native[''"]' -ErrorAction SilentlyContinue
}
Save-Command "08-dsh-service-blueprint.txt" { Get-Content -LiteralPath dsh\SERVICE_BLUEPRINT.md }
Save-Command "09-dsh-final-blockers.txt" { Get-Content -LiteralPath dsh\docs\closure\DSH_FINAL_REMAINING_BLOCKERS.md }
Save-Command "10-dsh-visual-review-status.txt" { if (Test-Path dsh\docs\DSH_VISUAL_REVIEW) { Get-ChildItem dsh\docs\DSH_VISUAL_REVIEW -File | Sort-Object Name | ForEach-Object { "--- $($_.Name)"; Get-Content -LiteralPath $_.FullName -ErrorAction SilentlyContinue | Select-Object -First 120 } } }

Save-Command "11-guard-service-blueprint.txt" { pnpm run guard:service-blueprint }
Save-Command "12-guard-design-token-drift.txt" { pnpm run guard:protected-tokens }
Save-Command "13-guard-ui-boundary.txt" { pnpm run guard:tamagui-import-boundary }
Save-Command "14-guard-i18n-direction.txt" { pnpm run guard:i18n-direction:mobile-control-panel }
Save-Command "15-secret-scan.txt" { pnpm run guard:secret-scan }
Save-Command "16-typecheck.txt" { pnpm -w exec tsc --noEmit }
Save-Command "17-diff-check.txt" { git diff --check }

$Evidence = [ordered]@{
  sessionId = $SessionId
  scope = "DSH forensic scan only"
  runRoot = $RunRoot
  createdAt = (Get-Date -Format o)
  decision = "NEEDS_REVIEW"
  note = "No CLOSED/PASS claim. Use this evidence before implementation."
}
$Evidence | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

Compress-Archive -LiteralPath $RunRoot -DestinationPath (Join-Path $RunRoot ("$SessionId.zip")) -Force
Write-Host "DONE: $RunRoot"
Write-Host "ZIP: $(Join-Path $RunRoot ("$SessionId.zip"))"
