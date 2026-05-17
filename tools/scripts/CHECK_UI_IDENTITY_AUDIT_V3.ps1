[CmdletBinding()]
param(
  [switch]$CreateZip
)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$session = "UI_IDENTITY_AUDIT_V3-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$root = Join-Path "tools\registry\runs" $session
New-Item -ItemType Directory -Force -Path $root | Out-Null

function Write-Text($name, $content) {
  $content | Out-File -Encoding UTF8 -FilePath (Join-Path $root $name)
}

function Run-Cmd($name, $cmd) {
  $outFile = Join-Path $root $name
  & powershell -NoProfile -ExecutionPolicy Bypass -Command $cmd > $outFile 2>&1
  $code = $LASTEXITCODE
  [pscustomobject]@{ name = $name; exitCode = $code }
}

$scope = @(
  "ui-kit/src",
  "dsh/frontend/app-client",
  "dsh/frontend/app-partner",
  "dsh/frontend/app-captain",
  "dsh/frontend/app-field",
  "dsh/frontend/control-panel",
  "app-client",
  "app-partner",
  "app-captain",
  "app-field",
  "control-panel"
)

$patterns = @(
  "from '@tamagui",
  'from "tamagui',
  "#0A2F5C",
  "#FF500D",
  "#FFFFFF",
  "backgroundColor",
  "borderRadius",
  "padding",
  "margin",
  "textAlign",
  "direction",
  "rtl",
  "ltr",
  "ScreenHeader",
  "TopBar",
  "Card",
  "Button",
  "Badge",
  "Chip",
  "EmptyState",
  "LoadingState",
  "ErrorState",
  "StateView",
  "ScreenWrapper"
)

$files = foreach ($s in $scope) {
  if (Test-Path -LiteralPath $s) {
    Get-ChildItem -LiteralPath $s -Recurse -File |
      Where-Object {
        $_.Extension -in @(".ts", ".tsx") -and
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.FullName -notmatch "\\build\\" -and
        $_.FullName -notmatch "\\.next\\" -and
        $_.FullName -notmatch "\\tools\\registry\\runs\\"
      }
  }
}

$files |
  Select-Object FullName, Length, LastWriteTime |
  Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $root "scanned-files.csv")

$matches = foreach ($file in $files) {
  Select-String -LiteralPath $file.FullName -Pattern $patterns -SimpleMatch | ForEach-Object {
    $relative = Resolve-Path -LiteralPath $_.Path -Relative

    $area = if ($relative -like ".\ui-kit\src*") { "ui-kit" }
      elseif ($relative -like ".\dsh\frontend\app-client*") { "app-client" }
      elseif ($relative -like ".\dsh\frontend\app-partner*") { "app-partner" }
      elseif ($relative -like ".\dsh\frontend\app-captain*") { "app-captain" }
      elseif ($relative -like ".\dsh\frontend\app-field*") { "app-field" }
      elseif ($relative -like ".\dsh\frontend\control-panel*") { "control-panel" }
      else { "app-shell" }

    $kind = if ($_.Line -match "from ['""]@tamagui|from ['""]tamagui") { "DIRECT_TAMAGUI_IMPORT" }
      elseif ($_.Line -match "#[0-9A-Fa-f]{6}|backgroundColor") { "COLOR_OR_STYLE" }
      elseif ($_.Line -match "textAlign|direction|rtl|ltr") { "RTL_DIRECTION" }
      elseif ($_.Line -match "ScreenHeader|TopBar") { "HEADER_TOPBAR" }
      elseif ($_.Line -match "Card|Button|Badge|Chip|StateView|ScreenWrapper|EmptyState|LoadingState|ErrorState") { "UIKIT_ADOPTION" }
      else { "OTHER" }

    [pscustomobject]@{
      Area = $area
      Kind = $kind
      Path = $relative
      LineNumber = $_.LineNumber
      Line = $_.Line.Trim()
    }
  }
}

$matches | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $root "ui-identity-matches.csv")
$matches | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 (Join-Path $root "ui-identity-matches.json")

$matches |
  Group-Object Area, Kind |
  Sort-Object Count -Descending |
  Select-Object Count, Name |
  Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $root "ui-identity-summary.csv")

$directTamaguiOutsideUiKit = $matches |
  Where-Object { $_.Kind -eq "DIRECT_TAMAGUI_IMPORT" -and $_.Area -ne "ui-kit" }

$topFiles = $matches |
  Group-Object Path |
  Sort-Object Count -Descending |
  Select-Object -First 40 Count, Name

$topFiles | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $root "top-matched-files.csv")

$checks = @()
$checks += Run-Cmd "git-status.txt" "git --no-pager status --short"
$checks += Run-Cmd "diff-check.txt" "git --no-pager diff --check"
Write-Text "typecheck-not-run-reason.txt" "NOT_RUN_REASON: UI identity audit V3 is read-only and does not run workspace tsc by default. Use a targeted project typecheck only when a later APPLY batch changes code."
$checks += [pscustomobject]@{ name = "typecheck-not-run-reason.txt"; exitCode = 0 }

$evidence = [pscustomobject]@{
  decision = "NEEDS_REVIEW"
  sessionId = $session
  evidenceRoot = $root
  scannedFileCount = @($files).Count
  matchCount = @($matches).Count
  directTamaguiOutsideUiKitCount = @($directTamaguiOutsideUiKit).Count
  checks = $checks
  next = "Review ui-identity-summary.csv, top-matched-files.csv, and direct Tamagui imports before any APPLY batch."
}

$evidence | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 (Join-Path $root "evidence.json")

@"
Decision: NEEDS_REVIEW
Purpose: UI identity audit V3 only. No source files modified.
Scanned files: $(@($files).Count)
Matches: $(@($matches).Count)
Direct Tamagui imports outside ui-kit: $(@($directTamaguiOutsideUiKit).Count)
Next: upload this ZIP for review before APPLY.
Next: review the evidence folder; create a ZIP only when explicitly requested.
"@ | Out-File -Encoding UTF8 (Join-Path $root "SUMMARY.md")

$zip = Join-Path (Resolve-Path -LiteralPath $root).Path "$session.zip"
if ($CreateZip) {
  Get-ChildItem -LiteralPath $root -File |
    Where-Object { $_.Name -ne "$session.zip" } |
    Compress-Archive -DestinationPath $zip -Force
} else {
  Write-Host "EVIDENCE_ZIP=not-created-by-default"
}

Write-Host "SESSION_ID=$session"
Write-Host "EVIDENCE_ROOT=$root"
Write-Host "EVIDENCE_ZIP=$(if ($CreateZip) { $zip } else { 'not-created-by-default' })"
Write-Host "SCANNED_FILES=$(@($files).Count)"
Write-Host "MATCHES=$(@($matches).Count)"
Write-Host "DIRECT_TAMAGUI_OUTSIDE_UIKIT=$(@($directTamaguiOutsideUiKit).Count)"
