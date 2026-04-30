Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"

$IssueCode = "CHECK_VERIFY_CONTROL_PANEL_NEXT_BUILD_AFTER_PATH_SEAL"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = "C:\bthwani-suite"
$AppRoot = Join-Path $RepoRoot "apps\web\control-panel"
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "summary.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$LogPath = Join-Path $RunRoot "next-build.log"

$RiskFlags = New-Object System.Collections.Generic.List[string]
$Actions = New-Object System.Collections.Generic.List[object]

function Add-Action {
  param([string]$Code, [string]$Message)
  $Actions.Add([pscustomobject]@{
    code = $Code
    message = $Message
  }) | Out-Null
}

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  $RiskFlags.Add("PNPM_NOT_FOUND") | Out-Null
}

if (-not (Test-Path -LiteralPath $AppRoot)) {
  $RiskFlags.Add("CONTROL_PANEL_APP_ROOT_MISSING") | Out-Null
}

$PackageJsonPath = Join-Path $AppRoot "package.json"
if (-not (Test-Path -LiteralPath $PackageJsonPath)) {
  $RiskFlags.Add("CONTROL_PANEL_PACKAGE_JSON_MISSING") | Out-Null
}

$CommandUsed = ""
$ExitCode = $null

if ($RiskFlags.Count -eq 0) {
  try {
    $Pkg = Get-Content -LiteralPath $PackageJsonPath -Raw | ConvertFrom-Json
    $HasBuildScript = $false

    if (($Pkg.PSObject.Properties.Name -contains "scripts") -and
        ($Pkg.scripts.PSObject.Properties.Name -contains "build")) {
      $HasBuildScript = $true
    }

    if ($HasBuildScript) {
      $CommandUsed = "pnpm --dir apps/web/control-panel run build"
      Add-Action "RUN_CONTROL_PANEL_BUILD_SCRIPT" $CommandUsed
      & pnpm --dir "apps/web/control-panel" run build *> $LogPath
      $ExitCode = $LASTEXITCODE
    } else {
      $CommandUsed = "pnpm --dir apps/web/control-panel exec next build"
      Add-Action "RUN_CONTROL_PANEL_NEXT_BUILD_DIRECT" $CommandUsed
      & pnpm --dir "apps/web/control-panel" exec next build *> $LogPath
      $ExitCode = $LASTEXITCODE
    }

    if ($ExitCode -ne 0) {
      $RiskFlags.Add("CONTROL_PANEL_NEXT_BUILD_FAILED") | Out-Null
    }
  } catch {
    $RiskFlags.Add("CONTROL_PANEL_NEXT_BUILD_EXCEPTION:$($_.Exception.Message)") | Out-Null
  }
}

$LogTail = ""
if (Test-Path -LiteralPath $LogPath) {
  $LogTail = (Get-Content -LiteralPath $LogPath -Tail 160 -ErrorAction SilentlyContinue) -join [Environment]::NewLine
}

$NextDir = Join-Path $AppRoot ".next"
$NextExistsAfter = Test-Path -LiteralPath $NextDir

$UniqueRiskFlags = @($RiskFlags | Where-Object { $_ } | Sort-Object -Unique)

$Result = if ($UniqueRiskFlags.Count -eq 0) {
  "PASS_CONTROL_PANEL_NEXT_BUILD_AFTER_PATH_SEAL"
} else {
  "FAIL_CONTROL_PANEL_NEXT_BUILD_AFTER_PATH_SEAL"
}

$Evidence = [pscustomobject]@{
  issue = $IssueCode
  session_id = $SessionId
  result = $Result
  risk_flags = $UniqueRiskFlags
  command_used = $CommandUsed
  exit_code = $ExitCode
  app_root = $AppRoot
  next_exists_after = $NextExistsAfter
  log_path = $LogPath
  actions = $Actions
}

$Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

$SummaryLines = @()
$SummaryLines += $IssueCode
$SummaryLines += "SESSION_ID : $SessionId"
$SummaryLines += "RESULT     : $Result"
$SummaryLines += "RUN_ROOT   : $RunRoot"
$SummaryLines += ""
$SummaryLines += "COMMAND_USED:"
$SummaryLines += $CommandUsed
$SummaryLines += ""
$SummaryLines += "EXIT_CODE:"
$SummaryLines += "$ExitCode"
$SummaryLines += ""
$SummaryLines += "RISK_FLAGS:"
$SummaryLines += ($UniqueRiskFlags -join "`n")
$SummaryLines += ""
$SummaryLines += "VERIFY:"
$SummaryLines += "next_exists_after : $NextExistsAfter"
$SummaryLines += ""
$SummaryLines += "LOG_TAIL:"
$SummaryLines += $LogTail
$SummaryLines += ""
$SummaryLines += "FINAL_DECISION:"
if ($Result -eq "PASS_CONTROL_PANEL_NEXT_BUILD_AFTER_PATH_SEAL") {
  $SummaryLines += "PASS: control-panel Next build passed after path boundary seal."
} else {
  $SummaryLines += "FAIL: control-panel Next build failed. Fix the build errors listed in LOG_TAIL before Metro gates."
}
$SummaryLines += ""
$SummaryLines += "EVIDENCE:"
$SummaryLines += "summary.txt   : $SummaryPath"
$SummaryLines += "evidence.json : $EvidencePath"
$SummaryLines += "next-build.log: $LogPath"

$SummaryText = $SummaryLines -join [Environment]::NewLine
$SummaryText | Tee-Object -FilePath $SummaryPath
