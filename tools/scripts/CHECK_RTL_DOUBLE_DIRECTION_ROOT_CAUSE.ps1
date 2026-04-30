Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_RTL_DOUBLE_DIRECTION_ROOT_CAUSE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Roots = @(
  "apps\mobile\app-client",
  "packages\ui-kit",
  "packages\surfaces",
  "packages\app-shells"
)

$Patterns = @(
  "I18nManager",
  "forceRTL",
  "allowRTL",
  "swapLeftAndRightInRTL",
  "isRTL",
  "row-reverse",
  "flexDirection",
  "textAlign",
  "writingDirection",
  "direction:"
)

$Hits = @()

foreach ($Root in $Roots) {
  $FullRoot = Join-Path (Get-Location).Path $Root
  if (-not (Test-Path -LiteralPath $FullRoot)) { continue }

  $Files = Get-ChildItem -LiteralPath $FullRoot -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\" -and
      $_.FullName -notmatch "\\dist\\" -and
      $_.FullName -notmatch "\\build\\" -and
      $_.FullName -notmatch "\\coverage\\"
    }

  foreach ($File in $Files) {
    foreach ($Pattern in $Patterns) {
      $Matches = Select-String -LiteralPath $File.FullName -Pattern $Pattern -SimpleMatch -ErrorAction SilentlyContinue
      foreach ($M in $Matches) {
        $Hits += [pscustomobject]@{
          path = $File.FullName.Replace((Get-Location).Path + "\", "")
          line = $M.LineNumber
          pattern = $Pattern
          text = $M.Line.Trim()
          owner = if ($File.FullName -like "*\packages\ui-kit\*") { "ui-kit" } else { "non-ui-kit" }
        }
      }
    }
  }
}

$NonUiKit = @($Hits | Where-Object { $_.owner -ne "ui-kit" })
$UiKit = @($Hits | Where-Object { $_.owner -eq "ui-kit" })

$Evidence = [ordered]@{
  issue = $IssueCode
  session_id = $SessionId
  total_direction_refs = @($Hits).Count
  ui_kit_refs = @($UiKit).Count
  non_ui_kit_refs = @($NonUiKit).Count
  top_non_ui_kit_refs = @($NonUiKit | Select-Object -First 100)
  result = "PASS"
  verdict = ""
}

if (@($NonUiKit).Count -gt 0) {
  $Evidence.verdict = "Direction/RTL logic exists outside ui-kit. This confirms risk of double-direction or local direction drift."
} else {
  $Evidence.verdict = "No obvious direction refs outside ui-kit in scanned roots. Next check should inspect bootstrap/provider runtime behavior."
}

$Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

@"
RESULT: PASS
TOTAL_DIRECTION_REFS: $(@($Hits).Count)
UI_KIT_REFS: $(@($UiKit).Count)
NON_UI_KIT_REFS: $(@($NonUiKit).Count)
VERDICT: $($Evidence.verdict)
RUN_ROOT: $RunRoot
"@ | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

Write-Host ""
Write-Host "RESULT: PASS" -ForegroundColor Green
Write-Host "TOTAL_DIRECTION_REFS: $(@($Hits).Count)" -ForegroundColor Cyan
Write-Host "UI_KIT_REFS: $(@($UiKit).Count)" -ForegroundColor Cyan
Write-Host "NON_UI_KIT_REFS: $(@($NonUiKit).Count)" -ForegroundColor Yellow
Write-Host "VERDICT: $($Evidence.verdict)" -ForegroundColor Green
Write-Host "RUN_ROOT: $RunRoot" -ForegroundColor DarkGray
Write-Host ""

Write-Host "TOP NON-UI-KIT DIRECTION REFERENCES:" -ForegroundColor Yellow
$NonUiKit | Select-Object -First 40 | ForEach-Object {
  Write-Host "$($_.path):$($_.line) [$($_.pattern)] $($_.text)"
}

Read-Host "اضغط Enter للإغلاق"
