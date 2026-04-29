Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"

$IssueCode = "CHECK_VERIFY_TYPESCRIPT_AFTER_PATH_SEAL"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = "C:\bthwani-suite"
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "summary.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$LogPath = Join-Path $RunRoot "typescript.log"

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

$PackageJsonPath = Join-Path $RepoRoot "package.json"
if (-not (Test-Path -LiteralPath $PackageJsonPath)) {
  $RiskFlags.Add("ROOT_PACKAGE_JSON_MISSING") | Out-Null
}

$CommandUsed = ""
$ExitCode = $null

if ($RiskFlags.Count -eq 0) {
  $Pkg = Get-Content -LiteralPath $PackageJsonPath -Raw | ConvertFrom-Json
  $Scripts = @()
  if ($Pkg.PSObject.Properties.Name -contains "scripts") {
    $Scripts = @($Pkg.scripts.PSObject.Properties.Name)
  }

  if ($Scripts -contains "typecheck") {
    $CommandUsed = "pnpm -w run typecheck"
    Add-Action "RUN_TYPECHECK_SCRIPT" $CommandUsed
    & pnpm -w run typecheck *> $LogPath
    $ExitCode = $LASTEXITCODE
  } elseif ($Scripts -contains "check-types") {
    $CommandUsed = "pnpm -w run check-types"
    Add-Action "RUN_CHECK_TYPES_SCRIPT" $CommandUsed
    & pnpm -w run check-types *> $LogPath
    $ExitCode = $LASTEXITCODE
  } elseif ($Scripts -contains "tsc") {
    $CommandUsed = "pnpm -w run tsc"
    Add-Action "RUN_TSC_SCRIPT" $CommandUsed
    & pnpm -w run tsc *> $LogPath
    $ExitCode = $LASTEXITCODE
  } else {
    $CommandUsed = "pnpm -w exec tsc --noEmit"
    Add-Action "RUN_WORKSPACE_TSC_NOEMIT" $CommandUsed
    & pnpm -w exec tsc --noEmit *> $LogPath
    $ExitCode = $LASTEXITCODE
  }

  if ($ExitCode -ne 0) {
    $RiskFlags.Add("TYPESCRIPT_GATE_FAILED") | Out-Null
  }
}

$LogTail = ""
if (Test-Path -LiteralPath $LogPath) {
  $LogTail = (Get-Content -LiteralPath $LogPath -Tail 120 -ErrorAction SilentlyContinue) -join [Environment]::NewLine
}

$UniqueRiskFlags = @($RiskFlags | Where-Object { $_ } | Sort-Object -Unique)

$Result = if ($UniqueRiskFlags.Count -eq 0) {
  "PASS_TYPESCRIPT_AFTER_PATH_SEAL"
} else {
  "FAIL_TYPESCRIPT_AFTER_PATH_SEAL"
}

$Evidence = [pscustomobject]@{
  issue = $IssueCode
  session_id = $SessionId
  result = $Result
  risk_flags = $UniqueRiskFlags
  command_used = $CommandUsed
  exit_code = $ExitCode
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
$SummaryLines += "LOG_TAIL:"
$SummaryLines += $LogTail
$SummaryLines += ""
$SummaryLines += "FINAL_DECISION:"
if ($Result -eq "PASS_TYPESCRIPT_AFTER_PATH_SEAL") {
  $SummaryLines += "PASS: TypeScript gate passed after path boundary seal."
} else {
  $SummaryLines += "FAIL: TypeScript gate failed. Fix listed compiler errors before Next/Metro gates."
}
$SummaryLines += ""
$SummaryLines += "EVIDENCE:"
$SummaryLines += "summary.txt   : $SummaryPath"
$SummaryLines += "evidence.json : $EvidencePath"
$SummaryLines += "typescript.log: $LogPath"

$SummaryText = $SummaryLines -join [Environment]::NewLine
$SummaryText | Tee-Object -FilePath $SummaryPath
