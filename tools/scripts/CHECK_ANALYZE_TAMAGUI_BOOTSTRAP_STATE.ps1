Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_TAMAGUI_BOOTSTRAP_STATE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "summary.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$MergedPath = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"

$Findings = New-Object System.Collections.Generic.List[object]
$ConsoleLines = New-Object System.Collections.Generic.List[string]

function Add-Finding {
  param(
    [Parameter(Mandatory = $true)][string]$Severity,
    [Parameter(Mandatory = $true)][string]$Area,
    [Parameter(Mandatory = $true)][string]$Message,
    [object]$Data = $null
  )

  $script:Findings.Add([pscustomobject]@{
    severity = $Severity
    area     = $Area
    message  = $Message
    data     = $Data
  }) | Out-Null
}

function Add-Console {
  param([string]$Line)
  $script:ConsoleLines.Add($Line) | Out-Null
}

function Get-CmdVersion {
  param([string]$CommandName)

  $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
  if (-not $cmd) { return $null }

  try {
    return (& $CommandName --version 2>$null | Out-String).Trim()
  } catch {
    try {
      return (& $CommandName -v 2>$null | Out-String).Trim()
    } catch {
      return "present-but-version-unavailable"
    }
  }
}

function Read-JsonFile {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) { return $null }

  try {
    return (Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json)
  } catch {
    Add-Finding -Severity "FAIL" -Area "json" -Message "تعذر قراءة JSON: $Path" -Data $_.Exception.Message
    return $null
  }
}

function Find-Dep {
  param(
    [object]$Pkg,
    [string]$Name
  )

  if (-not $Pkg) { return $null }

  foreach ($bucket in @("dependencies","devDependencies","peerDependencies","optionalDependencies")) {
    $bag = $Pkg.$bucket
    if ($null -ne $bag) {
      $prop = $bag.PSObject.Properties[$Name]
      if ($null -ne $prop) {
        return [string]$prop.Value
      }
    }
  }

  return $null
}

function Test-Contains {
  param(
    [string]$Text,
    [string]$Pattern
  )

  if ([string]::IsNullOrWhiteSpace($Text)) { return $false }
  return ($Text -match $Pattern)
}

$RootPackagePath = Join-Path $RepoRoot "package.json"
$ProvidersPath = Join-Path $RepoRoot "packages\ui-kit\src\providers.tsx"
$GitIgnorePath = Join-Path $RepoRoot ".gitignore"
$TamaguiConfigPath = Join-Path $RepoRoot "tamagui.config.ts"
$TamaguiBuildPath = Join-Path $RepoRoot "tamagui.build.ts"
$GeneratedCssPath = Join-Path $RepoRoot "tamagui.generated.css"
$BootstrapScriptPath = Join-Path $RepoRoot "tools\scripts\APPLY_VERIFY_TAMAGUI_BASELINE_BOOTSTRAP.ps1"
$RunsRoot = Join-Path $RepoRoot "tools\registry\runs"

if (-not (Test-Path -LiteralPath $RootPackagePath)) {
  Add-Finding -Severity "BLOCKED" -Area "workspace" -Message "package.json غير موجود في الجذر."
}
if (-not (Test-Path -LiteralPath $ProvidersPath)) {
  Add-Finding -Severity "BLOCKED" -Area "ui-kit" -Message "packages/ui-kit/src/providers.tsx غير موجود."
}

if (($Findings | Where-Object { $_.severity -eq "BLOCKED" }).Count -gt 0) {
  $Evidence = [ordered]@{
    issueCode = $IssueCode
    sessionId = $SessionId
    repoRoot  = $RepoRoot
    timestamp = (Get-Date).ToString("o")
    bootstrapStatus = "UNKNOWN"
    gateStatus = "BLOCKED"
    progressDirection = "Backward"
    findings = $Findings
  }

  ($Evidence | ConvertTo-Json -Depth 50) | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
  (($Evidence | ConvertTo-Json -Depth 50)) | Set-Content -LiteralPath $MergedPath -Encoding UTF8

  Write-Host "BLOCKED: ملفات أساسية مفقودة." -ForegroundColor Red
  Read-Host "انتهى الفحص. اضغط Enter للعودة"
  return
}

$NodeVersion = Get-CmdVersion "node"
$PnpmVersion = Get-CmdVersion "pnpm"
$GitVersion  = Get-CmdVersion "git"

$RootPkg = Read-JsonFile -Path $RootPackagePath
$ProvidersText = if (Test-Path -LiteralPath $ProvidersPath) { Get-Content -LiteralPath $ProvidersPath -Raw -Encoding UTF8 } else { "" }
$GitIgnoreText = if (Test-Path -LiteralPath $GitIgnorePath) { Get-Content -LiteralPath $GitIgnorePath -Raw -Encoding UTF8 } else { "" }

$InstalledTamagui = Find-Dep -Pkg $RootPkg -Name "tamagui"
$InstalledConfig  = Find-Dep -Pkg $RootPkg -Name "@tamagui/config"
$InstalledCli     = Find-Dep -Pkg $RootPkg -Name "@tamagui/cli"

$HasTamaguiConfigFile = Test-Path -LiteralPath $TamaguiConfigPath
$HasTamaguiBuildFile = Test-Path -LiteralPath $TamaguiBuildPath
$HasGeneratedCss = Test-Path -LiteralPath $GeneratedCssPath

$ProvidersHasTamaguiImport = Test-Contains -Text $ProvidersText -Pattern "from\s+['""]tamagui['""]"
$ProvidersHasTamaguiProvider = Test-Contains -Text $ProvidersText -Pattern "TamaguiProvider"
$ProvidersHasTamaguiConfig = Test-Contains -Text $ProvidersText -Pattern "tamaguiConfig"

$GitIgnoreHasTamaguiDir = Test-Contains -Text $GitIgnoreText -Pattern "(?m)^\.tamagui/$"
$GitIgnoreHasGeneratedCss = Test-Contains -Text $GitIgnoreText -Pattern "(?m)^tamagui\.generated\.css$"

$BootstrapScriptExists = Test-Path -LiteralPath $BootstrapScriptPath
$BootstrapScriptParseOk = $null
$BootstrapScriptParseErrors = @()

if ($BootstrapScriptExists) {
  $null = $null
  $tokens = $null
  $errors = $null
  [System.Management.Automation.Language.Parser]::ParseFile($BootstrapScriptPath, [ref]$tokens, [ref]$errors) | Out-Null
  $BootstrapScriptParseOk = ($errors.Count -eq 0)
  if (-not $BootstrapScriptParseOk) {
    $BootstrapScriptParseErrors = $errors | ForEach-Object {
      [pscustomobject]@{
        message = $_.Message
        line    = $_.Extent.StartLineNumber
        column  = $_.Extent.StartColumnNumber
      }
    }
  }
}

$BootstrapRuns = @()
if (Test-Path -LiteralPath $RunsRoot) {
  $BootstrapRuns =
    Get-ChildItem -LiteralPath $RunsRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "APPLY_VERIFY_TAMAGUI_BASELINE_BOOTSTRAP-*" } |
    Sort-Object Name -Descending
}

$LatestBootstrapRun = $BootstrapRuns | Select-Object -First 1
$LatestBootstrapRunInfo = $null

if ($null -ne $LatestBootstrapRun) {
  $LatestBootstrapRunInfo = [pscustomobject]@{
    runRoot = $LatestBootstrapRun.FullName
    summaryExists = Test-Path -LiteralPath (Join-Path $LatestBootstrapRun.FullName "summary.txt")
    evidenceExists = Test-Path -LiteralPath (Join-Path $LatestBootstrapRun.FullName "evidence.json")
    actionsExists = Test-Path -LiteralPath (Join-Path $LatestBootstrapRun.FullName "actions.json")
    mergedExists = Test-Path -LiteralPath (Join-Path $LatestBootstrapRun.FullName "MERGED_EVIDENCE_SINGLE_FILE.txt")
  }
}

$TamaguiCliOutput = $null
$TamaguiCliExitCode = $null

if ($PnpmVersion) {
  try {
    $TamaguiCliOutput = (& pnpm exec tamagui --version 2>&1 | Out-String).Trim()
    $TamaguiCliExitCode = $LASTEXITCODE
  } catch {
    $TamaguiCliOutput = $_.Exception.Message
    $TamaguiCliExitCode = 999
  }
}

$Markers = [ordered]@{
  dep_tamagui = [bool]$InstalledTamagui
  dep_config = [bool]$InstalledConfig
  dep_cli = [bool]$InstalledCli
  file_tamagui_config = $HasTamaguiConfigFile
  file_tamagui_build = $HasTamaguiBuildFile
  file_generated_css = $HasGeneratedCss
  providers_import = $ProvidersHasTamaguiImport
  providers_provider = $ProvidersHasTamaguiProvider
  providers_config_ref = $ProvidersHasTamaguiConfig
  gitignore_tamagui_dir = $GitIgnoreHasTamaguiDir
  gitignore_generated_css = $GitIgnoreHasGeneratedCss
  bootstrap_script_exists = $BootstrapScriptExists
  bootstrap_script_parse_ok = [bool]$BootstrapScriptParseOk
  bootstrap_run_evidence = [bool]($LatestBootstrapRunInfo -and $LatestBootstrapRunInfo.mergedExists)
  tamagui_cli_callable = [bool]($TamaguiCliExitCode -eq 0)
}

$TrueCount = ($Markers.GetEnumerator() | Where-Object { $_.Value -eq $true }).Count
$CoreApplied =
  $Markers.dep_tamagui -and
  $Markers.dep_config -and
  $Markers.dep_cli -and
  $Markers.file_tamagui_config -and
  $Markers.file_tamagui_build -and
  $Markers.providers_import -and
  $Markers.providers_provider -and
  $Markers.providers_config_ref -and
  $Markers.gitignore_tamagui_dir -and
  $Markers.gitignore_generated_css

$NothingApplied =
  (-not $Markers.dep_tamagui) -and
  (-not $Markers.dep_config) -and
  (-not $Markers.dep_cli) -and
  (-not $Markers.file_tamagui_config) -and
  (-not $Markers.file_tamagui_build) -and
  (-not $Markers.file_generated_css) -and
  (-not $Markers.providers_import) -and
  (-not $Markers.providers_provider) -and
  (-not $Markers.providers_config_ref) -and
  (-not $Markers.gitignore_tamagui_dir) -and
  (-not $Markers.gitignore_generated_css)

$BootstrapStatus =
if ($CoreApplied -and ($Markers.file_generated_css -or $Markers.bootstrap_run_evidence -or $Markers.tamagui_cli_callable)) {
  "APPLIED"
} elseif ($NothingApplied) {
  "NOT_APPLIED"
} else {
  "PARTIAL"
}

if ($BootstrapStatus -eq "PARTIAL") {
  Add-Finding -Severity "FAIL" -Area "bootstrap-state" -Message "هناك آثار Bootstrap جزئية أو غير مكتملة." -Data $Markers
}

if ($BootstrapScriptExists -and (-not $BootstrapScriptParseOk)) {
  Add-Finding -Severity "FAIL" -Area "bootstrap-script" -Message "ملف APPLY_VERIFY_TAMAGUI_BASELINE_BOOTSTRAP.ps1 غير صالح نحويًا." -Data $BootstrapScriptParseErrors
}

if ($LatestBootstrapRunInfo -and (-not $LatestBootstrapRunInfo.mergedExists)) {
  Add-Finding -Severity "WARN" -Area "bootstrap-run" -Message "يوجد Run Folder لـ bootstrap لكن ملف الأدلة المدمج غير موجود." -Data $LatestBootstrapRunInfo
}

$BlockedCount = ($Findings | Where-Object { $_.severity -eq "BLOCKED" }).Count
$FailCount    = ($Findings | Where-Object { $_.severity -eq "FAIL" }).Count
$WarnCount    = ($Findings | Where-Object { $_.severity -eq "WARN" }).Count

$GateStatus =
if ($BlockedCount -gt 0) {
  "BLOCKED"
} elseif ($FailCount -gt 0) {
  "FAIL"
} else {
  "PASS"
}

$ProgressDirection =
if ($GateStatus -eq "PASS") {
  "Forward"
} elseif ($GateStatus -eq "FAIL") {
  "Neutral"
} else {
  "Backward"
}

Add-Console "=== CHECK_ANALYZE_TAMAGUI_BOOTSTRAP_STATE ==="
Add-Console "RepoRoot : $RepoRoot"
Add-Console "Session  : $SessionId"
Add-Console "RunRoot  : $RunRoot"
Add-Console ""
Add-Console "Toolchain"
Add-Console ("  node : {0}" -f $(if ($NodeVersion) { $NodeVersion } else { "missing" }))
Add-Console ("  pnpm : {0}" -f $(if ($PnpmVersion) { $PnpmVersion } else { "missing" }))
Add-Console ("  git  : {0}" -f $(if ($GitVersion)  { $GitVersion  } else { "missing" }))
Add-Console ""
Add-Console "Bootstrap State"
Add-Console ("  status                  : {0}" -f $BootstrapStatus)
Add-Console ("  true_markers_count      : {0}" -f $TrueCount)
Add-Console ("  tamagui                 : {0}" -f $(if ($InstalledTamagui) { $InstalledTamagui } else { "missing" }))
Add-Console ("  @tamagui/config         : {0}" -f $(if ($InstalledConfig) { $InstalledConfig } else { "missing" }))
Add-Console ("  @tamagui/cli            : {0}" -f $(if ($InstalledCli) { $InstalledCli } else { "missing" }))
Add-Console ("  tamagui.config.ts       : {0}" -f $HasTamaguiConfigFile)
Add-Console ("  tamagui.build.ts        : {0}" -f $HasTamaguiBuildFile)
Add-Console ("  tamagui.generated.css   : {0}" -f $HasGeneratedCss)
Add-Console ("  providers import        : {0}" -f $ProvidersHasTamaguiImport)
Add-Console ("  providers provider      : {0}" -f $ProvidersHasTamaguiProvider)
Add-Console ("  providers config ref    : {0}" -f $ProvidersHasTamaguiConfig)
Add-Console ("  .gitignore .tamagui/    : {0}" -f $GitIgnoreHasTamaguiDir)
Add-Console ("  .gitignore css line     : {0}" -f $GitIgnoreHasGeneratedCss)
Add-Console ""
Add-Console "Bootstrap Script"
Add-Console ("  exists                  : {0}" -f $BootstrapScriptExists)
Add-Console ("  parse ok                : {0}" -f $BootstrapScriptParseOk)
if ($BootstrapScriptParseErrors.Count -gt 0) {
  foreach ($err in $BootstrapScriptParseErrors) {
    Add-Console ("  parse error             : line={0}, col={1}, msg={2}" -f $err.line, $err.column, $err.message)
  }
}
Add-Console ""
Add-Console "Bootstrap Run Evidence"
if ($LatestBootstrapRunInfo) {
  Add-Console ("  latest run root         : {0}" -f $LatestBootstrapRunInfo.runRoot)
  Add-Console ("  summary exists          : {0}" -f $LatestBootstrapRunInfo.summaryExists)
  Add-Console ("  evidence exists         : {0}" -f $LatestBootstrapRunInfo.evidenceExists)
  Add-Console ("  actions exists          : {0}" -f $LatestBootstrapRunInfo.actionsExists)
  Add-Console ("  merged exists           : {0}" -f $LatestBootstrapRunInfo.mergedExists)
} else {
  Add-Console "  latest run root         : missing"
}
Add-Console ""
Add-Console "CLI Check"
Add-Console ("  exit code               : {0}" -f $TamaguiCliExitCode)
Add-Console ("  output                  : {0}" -f $TamaguiCliOutput)
Add-Console ""
Add-Console "FINAL"
Add-Console ("  GateStatus        : {0}" -f $GateStatus)
Add-Console ("  ProgressDirection : {0}" -f $ProgressDirection)
Add-Console ("  BLOCKED={0} | FAIL={1} | WARN={2}" -f $BlockedCount, $FailCount, $WarnCount)
Add-Console ("  SummaryPath       : {0}" -f $SummaryPath)
Add-Console ("  EvidencePath      : {0}" -f $EvidencePath)
Add-Console ("  MergedEvidence    : {0}" -f $MergedPath)

$Evidence = [ordered]@{
  issueCode = $IssueCode
  sessionId = $SessionId
  repoRoot  = $RepoRoot
  timestamp = (Get-Date).ToString("o")
  bootstrapStatus = $BootstrapStatus
  gateStatus = $GateStatus
  progressDirection = $ProgressDirection
  toolchain = [ordered]@{
    node = $NodeVersion
    pnpm = $PnpmVersion
    git  = $GitVersion
  }
  installed = [ordered]@{
    tamagui = $InstalledTamagui
    tamaguiConfig = $InstalledConfig
    tamaguiCli = $InstalledCli
  }
  files = [ordered]@{
    tamaguiConfigExists = $HasTamaguiConfigFile
    tamaguiBuildExists = $HasTamaguiBuildFile
    generatedCssExists = $HasGeneratedCss
    providersPath = $ProvidersPath
    gitIgnorePath = $GitIgnorePath
    bootstrapScriptPath = $BootstrapScriptPath
  }
  providers = [ordered]@{
    import = $ProvidersHasTamaguiImport
    provider = $ProvidersHasTamaguiProvider
    configRef = $ProvidersHasTamaguiConfig
  }
  gitIgnore = [ordered]@{
    tamaguiDir = $GitIgnoreHasTamaguiDir
    generatedCss = $GitIgnoreHasGeneratedCss
  }
  bootstrapScript = [ordered]@{
    exists = $BootstrapScriptExists
    parseOk = $BootstrapScriptParseOk
    parseErrors = $BootstrapScriptParseErrors
  }
  latestBootstrapRun = $LatestBootstrapRunInfo
  tamaguiCli = [ordered]@{
    exitCode = $TamaguiCliExitCode
    output = $TamaguiCliOutput
  }
  markers = $Markers
  findings = $Findings
}

$SummaryText = @"
=== $IssueCode ===
RepoRoot: $RepoRoot
Session : $SessionId
Time    : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
BootstrapStatus: $BootstrapStatus
Gate    : $GateStatus
Progress: $ProgressDirection

Counts:
  BLOCKED = $BlockedCount
  FAIL    = $FailCount
  WARN    = $WarnCount

Terminal Summary:
$($ConsoleLines -join [Environment]::NewLine)
"@

$MergedText = @"
===== SUMMARY =====
$SummaryText

===== EVIDENCE.JSON =====
$($Evidence | ConvertTo-Json -Depth 100)
"@

$SummaryText | Set-Content -LiteralPath $SummaryPath -Encoding UTF8
($Evidence | ConvertTo-Json -Depth 100) | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
$MergedText | Set-Content -LiteralPath $MergedPath -Encoding UTF8

Write-Host ""
Write-Host "=== CHECK_ANALYZE_TAMAGUI_BOOTSTRAP_STATE ===" -ForegroundColor Cyan
foreach ($line in $ConsoleLines) {
  if ($line -match "status\s+: APPLIED") {
    Write-Host $line -ForegroundColor Green
  } elseif ($line -match "status\s+: PARTIAL") {
    Write-Host $line -ForegroundColor Yellow
  } elseif ($line -match "status\s+: NOT_APPLIED") {
    Write-Host $line -ForegroundColor Cyan
  } elseif ($line -match "GateStatus\s*: PASS") {
    Write-Host $line -ForegroundColor Green
  } elseif ($line -match "GateStatus\s*: FAIL") {
    Write-Host $line -ForegroundColor Yellow
  } elseif ($line -match "GateStatus\s*: BLOCKED") {
    Write-Host $line -ForegroundColor Red
  } elseif ($line -match "BLOCKED=\d+\s+\|\s+FAIL=\d+\s+\|\s+WARN=\d+") {
    if ($GateStatus -eq "PASS") {
      Write-Host $line -ForegroundColor Green
    } elseif ($GateStatus -eq "FAIL") {
      Write-Host $line -ForegroundColor Yellow
    } else {
      Write-Host $line -ForegroundColor Red
    }
  } else {
    Write-Host $line
  }
}

Write-Host ""
Write-Host "تم إنشاء ملف الأدلة المدمج:" -ForegroundColor Cyan
Write-Host $MergedPath -ForegroundColor White
Write-Host ""
Read-Host "انتهى الفحص. اضغط Enter للعودة"
