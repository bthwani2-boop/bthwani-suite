Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"

$IssueCode = "CHECK_ANALYZE_APP_CLIENT_METRO_BUNDLE_500_FORENSICS"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = "C:\bthwani-suite"
$AppDir = Join-Path $RepoRoot "app-client\runtime"
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
$PackageName = "com.bthwani.client.dev"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$EvidencePath = Join-Path $RunRoot "evidence.json"
$SummaryPath = Join-Path $RunRoot "summary.txt"
$MetroOutPath = Join-Path $RunRoot "metro.stdout.log"
$MetroErrPath = Join-Path $RunRoot "metro.stderr.log"
$ResolveScriptPath = Join-Path $RunRoot "resolve-core-modules.cjs"
$MetroStarterPath = Join-Path $RunRoot "START_TEMP_METRO.ps1"

function Convert-WebContentToText {
  param($Content)

  if ($null -eq $Content) { return "" }

  try {
    if ($Content -is [byte[]]) {
      return [System.Text.Encoding]::UTF8.GetString($Content)
    }

    return [string]$Content
  } catch {
    return ""
  }
}

function Read-TailText {
  param(
    [string]$Path,
    [int]$Tail = 500
  )

  if (-not (Test-Path -LiteralPath $Path)) { return "" }

  try {
    return ((Get-Content -LiteralPath $Path -Tail $Tail -ErrorAction SilentlyContinue) -join "`n")
  } catch {
    return ""
  }
}

function Get-ErrorBodyText {
  param($ErrorRecord)

  $Body = ""

  try {
    $Response = $ErrorRecord.Exception.Response

    if ($Response -and $Response.Content) {
      $Body = $Response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
      return $Body
    }

    if ($Response) {
      $Stream = $Response.GetResponseStream()
      if ($Stream) {
        $Reader = New-Object System.IO.StreamReader($Stream)
        $Body = $Reader.ReadToEnd()
      }
    }
  } catch {
    $Body = ""
  }

  return $Body
}

function Get-FreePort {
  param([int[]]$Candidates)

  foreach ($Port in $Candidates) {
    $Used = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if (-not $Used) {
      return $Port
    }
  }

  return $null
}

function Stop-OnlyTempMetro {
  param(
    [int]$Port,
    [int]$ParentPid
  )

  $Stopped = @()

  if ($ParentPid) {
    try {
      $Parent = Get-Process -Id $ParentPid -ErrorAction SilentlyContinue
      if ($Parent) {
        Stop-Process -Id $ParentPid -Force -ErrorAction SilentlyContinue
        $Stopped += [pscustomobject]@{
          pid = $ParentPid
          name = $Parent.ProcessName
          reason = "STARTED_BY_THIS_SCRIPT_PARENT"
        }
      }
    } catch {}
  }

  Start-Sleep -Seconds 1

  $PortOwners = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
    Where-Object { $_.OwningProcess -ne 0 } |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($Pid in $PortOwners) {
    try {
      $Proc = Get-CimInstance Win32_Process -Filter "ProcessId=$Pid" -ErrorAction SilentlyContinue
      if ($Proc -and $Proc.CommandLine -match "expo" -and $Proc.CommandLine -match "start" -and $Proc.CommandLine -match [string]$Port) {
        Stop-Process -Id $Pid -Force -ErrorAction SilentlyContinue
        $Stopped += [pscustomobject]@{
          pid = $Pid
          name = $Proc.Name
          reason = "TEMP_PORT_OWNER"
        }
      }
    } catch {}
  }

  return $Stopped
}

$RiskFlags = @()
$Tools = [ordered]@{}
$Tools.adb = (Get-Command adb -ErrorAction SilentlyContinue).Source
$Tools.pnpm = (Get-Command pnpm -ErrorAction SilentlyContinue).Source
$Tools.node = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not (Test-Path -LiteralPath $RepoRoot)) { $RiskFlags += "REPO_ROOT_MISSING" }
if (-not (Test-Path -LiteralPath $AppDir)) { $RiskFlags += "APP_CLIENT_DIR_MISSING" }
if (-not $Tools.adb) { $RiskFlags += "ADB_NOT_FOUND" }
if (-not $Tools.pnpm) { $RiskFlags += "PNPM_NOT_FOUND" }
if (-not $Tools.node) { $RiskFlags += "NODE_NOT_FOUND" }

$TempPort = Get-FreePort -Candidates @(8099,8100,8101,8102,8103)
if (-not $TempPort) {
  $RiskFlags += "NO_FREE_TEMP_METRO_PORT"
  $TempPort = 8099
}

$AdbDevicesRaw = if ($Tools.adb) { (& adb devices 2>&1 | Out-String).Trim() } else { "adb not found" }

$DeviceChecks = @()
if ($Tools.adb) {
  $Devices = (& adb devices 2>$null) |
    Select-Object -Skip 1 |
    Where-Object { $_ -match "\S+\s+device$" } |
    ForEach-Object { ($_ -split "\s+")[0] }

  foreach ($Device in $Devices) {
    $Pkg = (& adb -s $Device shell pm list packages $PackageName 2>&1 | Out-String).Trim()
    $Foreground = (& adb -s $Device shell dumpsys window 2>&1 |
      Select-String -Pattern "mCurrentFocus|mFocusedApp" |
      Select-Object -First 5 |
      Out-String).Trim()

    $DeviceChecks += [pscustomobject]@{
      device = $Device
      has_dev_build = ($Pkg -match [regex]::Escape($PackageName))
      package_raw = $Pkg
      reverse = (& adb -s $Device reverse --list 2>&1 | Out-String).Trim()
      foreground = $Foreground
    }
  }
}

$ImportantFiles = @(
  "package.json",
  "app.json",
  "app.config.js",
  "app.config.ts",
  "metro.config.js",
  "babel.config.js",
  "tsconfig.json",
  "index.js",
  "index.ts",
  "index.tsx",
  "App.tsx",
  "src\App.tsx"
)

$FileInventory = @()
foreach ($Rel in $ImportantFiles) {
  $Full = Join-Path $AppDir $Rel
  $FileInventory += [pscustomobject]@{
    relative = $Rel
    exists = Test-Path -LiteralPath $Full
    path = $Full
  }
}

$PackageInfo = $null
$PackageJsonPath = Join-Path $AppDir "package.json"
if (Test-Path -LiteralPath $PackageJsonPath) {
  try {
    $PackageInfo = Get-Content -LiteralPath $PackageJsonPath -Raw | ConvertFrom-Json
  } catch {
    $RiskFlags += "APP_CLIENT_PACKAGE_JSON_PARSE_FAILED"
  }
} else {
  $RiskFlags += "APP_CLIENT_PACKAGE_JSON_MISSING"
}

$ResolveCodeLines = @(
  'const modules = ["expo","react","react-native","expo-dev-client","@expo/metro-config"];',
  'for (const m of modules) {',
  '  try {',
  '    console.log(`${m} => ${require.resolve(m)}`);',
  '  } catch (e) {',
  '    console.log(`${m} => MISSING :: ${e.message}`);',
  '    process.exitCode = 1;',
  '  }',
  '}'
)

[System.IO.File]::WriteAllText($ResolveScriptPath, ($ResolveCodeLines -join [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))

$ResolveOutput = ""
$ResolveExitCode = $null
try {
  $ResolveOutput = (& node $ResolveScriptPath 2>&1 | Out-String).Trim()
  $ResolveExitCode = $LASTEXITCODE
} catch {
  $ResolveOutput = $_.Exception.Message
}

$ExpoConfigOutput = ""
$ExpoConfigExitCode = $null
try {
  $env:CI = "1"
  $ExpoConfigOutput = (& pnpm --dir app-client/runtime exec expo config --type public 2>&1 | Out-String).Trim()
  $ExpoConfigExitCode = $LASTEXITCODE
} catch {
  $ExpoConfigOutput = $_.Exception.Message
}

$MetroStarted = $false
$MetroProcessId = $null
$MetroStatus = $null
$BundleProbe = $null
$StoppedTempProcesses = @()

try {
  if (
    $RiskFlags -notcontains "APP_CLIENT_DIR_MISSING" -and
    $RiskFlags -notcontains "PNPM_NOT_FOUND" -and
    $RiskFlags -notcontains "NO_FREE_TEMP_METRO_PORT"
  ) {
    $MetroStarterLines = @(
      'Set-Location -LiteralPath "C:\bthwani-suite"',
      '$env:CI="1"',
      '$env:EXPO_NO_INTERACTIVE="1"',
      '$env:NO_COLOR="1"',
      ('pnpm --dir app-client/runtime exec expo start --dev-client --port {0} --clear' -f $TempPort)
    )

    [System.IO.File]::WriteAllText($MetroStarterPath, ($MetroStarterLines -join [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))

    $MetroProc = Start-Process `
      -FilePath "powershell.exe" `
      -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $MetroStarterPath) `
      -WorkingDirectory $RepoRoot `
      -RedirectStandardOutput $MetroOutPath `
      -RedirectStandardError $MetroErrPath `
      -PassThru

    $MetroStarted = $true
    $MetroProcessId = $MetroProc.Id

    $StatusUrl = "http://127.0.0.1:$TempPort/status"

    for ($i = 1; $i -le 90; $i++) {
      Start-Sleep -Seconds 1

      try {
        $StatusResponse = Invoke-WebRequest -Uri $StatusUrl -UseBasicParsing -TimeoutSec 3
        $MetroStatus = [pscustomobject]@{
          ok = $true
          statusCode = [int]$StatusResponse.StatusCode
          body = Convert-WebContentToText $StatusResponse.Content
          waitedSeconds = $i
        }
        break
      } catch {
        $MetroStatus = [pscustomobject]@{
          ok = $false
          error = $_.Exception.Message
          waitedSeconds = $i
        }
      }

      try {
        $CheckProc = Get-Process -Id $MetroProcessId -ErrorAction SilentlyContinue
        if (-not $CheckProc) {
          $RiskFlags += "TEMP_METRO_PARENT_PROCESS_EXITED_BEFORE_READY"
          break
        }
      } catch {}
    }

    if ($MetroStatus -and $MetroStatus.ok) {
      $BundleUrl = "http://127.0.0.1:$TempPort/app-client/runtime/index.bundle?platform=android&dev=true&minify=false"

      try {
        $BundleResponse = Invoke-WebRequest -Uri $BundleUrl -UseBasicParsing -TimeoutSec 60
        $BundleText = Convert-WebContentToText $BundleResponse.Content

        $BundleProbe = [pscustomobject]@{
          ok = $true
          statusCode = [int]$BundleResponse.StatusCode
          contentType = $BundleResponse.Headers["Content-Type"]
          contentLength = $BundleText.Length
          first1200 = $BundleText.Substring(0, [Math]::Min(1200, $BundleText.Length))
          url = $BundleUrl
        }
      } catch {
        $Body = Get-ErrorBodyText $_

        $BundleProbe = [pscustomobject]@{
          ok = $false
          statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
          error = $_.Exception.Message
          bodyFirst5000 = if ($Body) { $Body.Substring(0, [Math]::Min(5000, $Body.Length)) } else { "" }
          url = $BundleUrl
        }

        $RiskFlags += "TEMP_METRO_BUNDLE_FAILED"
      }
    } else {
      $RiskFlags += "TEMP_METRO_STATUS_NOT_READY"
    }
  }
} finally {
  Start-Sleep -Seconds 2
  $StoppedTempProcesses = Stop-OnlyTempMetro -Port $TempPort -ParentPid $MetroProcessId
}

$MetroStdoutTail = Read-TailText -Path $MetroOutPath -Tail 700
$MetroStderrTail = Read-TailText -Path $MetroErrPath -Tail 700

$CombinedFailureText = @(
  $BundleProbe.error
  $BundleProbe.bodyFirst5000
  $MetroStdoutTail
  $MetroStderrTail
  $ExpoConfigOutput
  $ResolveOutput
) -join "`n"

$FailureLines = $CombinedFailureText -split "`r?`n" |
  Where-Object {
    $_ -match "error|Error|ERROR|Unable to resolve|Cannot find module|Module not found|SyntaxError|TransformError|BABEL|Babel|Unexpected token|Duplicate module|Invariant Violation|ENOENT|EACCES|Package subpath|exports|tsconfig|alias|Cannot read|undefined|not recognized"
  } |
  Select-Object -First 60

$FailureCategory = "UNKNOWN"

if ($CombinedFailureText -match "Unable to resolve module|Cannot find module|Module not found") {
  $FailureCategory = "MODULE_RESOLUTION_OR_IMPORT_FAILURE"
} elseif ($CombinedFailureText -match "SyntaxError|Unexpected token|TransformError|Babel|BABEL") {
  $FailureCategory = "SYNTAX_OR_BABEL_TRANSFORM_FAILURE"
} elseif ($CombinedFailureText -match "Package subpath|exports") {
  $FailureCategory = "PACKAGE_EXPORTS_FAILURE"
} elseif ($CombinedFailureText -match "Duplicate module|haste") {
  $FailureCategory = "METRO_HASTE_OR_DUPLICATE_MODULE_FAILURE"
} elseif ($CombinedFailureText -match "ENOENT|no such file") {
  $FailureCategory = "MISSING_FILE_OR_BAD_PATH_FAILURE"
} elseif ($BundleProbe -and $BundleProbe.ok) {
  $FailureCategory = "TEMP_BUNDLE_OK_CURRENT_8081_OR_DEVICE_STATE_SPECIFIC"
}

if ($RiskFlags -contains "REPO_ROOT_MISSING") {
  $FinalResult = "FAIL_REPO_ROOT_MISSING"
} elseif ($RiskFlags -contains "APP_CLIENT_DIR_MISSING") {
  $FinalResult = "FAIL_APP_CLIENT_DIR_MISSING"
} elseif ($RiskFlags -contains "NO_FREE_TEMP_METRO_PORT") {
  $FinalResult = "FAIL_NO_FREE_TEMP_METRO_PORT"
} elseif ($RiskFlags -contains "TEMP_METRO_STATUS_NOT_READY") {
  $FinalResult = "FAIL_TEMP_METRO_DID_NOT_BECOME_READY"
} elseif ($RiskFlags -contains "TEMP_METRO_BUNDLE_FAILED") {
  $FinalResult = "FAIL_METRO_BUNDLE_500_REPRODUCED_WITH_LOGS"
} elseif ($BundleProbe -and $BundleProbe.ok) {
  $FinalResult = "PASS_TEMP_METRO_BUNDLE_OK"
} else {
  $FinalResult = "FAIL_UNKNOWN_FORENSIC_STATE"
}

$Decision = switch ($FailureCategory) {
  "MODULE_RESOLUTION_OR_IMPORT_FAILURE" {
    "Root cause class: import/module/alias resolution failure. Fix the exact missing path/module shown in FAILURE_SIGNATURE_LINES."
  }
  "SYNTAX_OR_BABEL_TRANSFORM_FAILURE" {
    "Root cause class: syntax/Babel/Metro transform failure. Fix the exact file/token shown in FAILURE_SIGNATURE_LINES."
  }
  "PACKAGE_EXPORTS_FAILURE" {
    "Root cause class: package exports/subpath failure. Fix canonical package entrypoints/imports."
  }
  "METRO_HASTE_OR_DUPLICATE_MODULE_FAILURE" {
    "Root cause class: Metro duplicate/haste failure. Verify duplicates before cache cleanup."
  }
  "MISSING_FILE_OR_BAD_PATH_FAILURE" {
    "Root cause class: missing file/bad path. Restore or correct the referenced canonical path."
  }
  "TEMP_BUNDLE_OK_CURRENT_8081_OR_DEVICE_STATE_SPECIFIC" {
    "Clean Metro on temp port bundles correctly. Current 8081 state is stale or target-specific. Restart only the 8081 Expo process after preserving evidence."
  }
  default {
    "Failure category is unknown from captured text. Use metro.stdout.log and metro.stderr.log in RUN_ROOT as source of truth."
  }
}

$Evidence = [pscustomobject]@{
  issue = $IssueCode
  session_id = $SessionId
  result = $FinalResult
  failure_category = $FailureCategory
  risk_flags = $RiskFlags
  repo_root = $RepoRoot
  app_dir = $AppDir
  package = $PackageName
  temp_port = $TempPort
  tools = $Tools
  adb_devices_raw = $AdbDevicesRaw
  device_checks = $DeviceChecks
  file_inventory = $FileInventory
  package_main = if ($PackageInfo) { $PackageInfo.main } else { $null }
  package_scripts = if ($PackageInfo) { $PackageInfo.scripts } else { $null }
  expo_config_exit_code = $ExpoConfigExitCode
  expo_config_output = $ExpoConfigOutput
  resolve_exit_code = $ResolveExitCode
  resolve_output = $ResolveOutput
  metro_started = $MetroStarted
  metro_process_id = $MetroProcessId
  metro_status = $MetroStatus
  bundle_probe = $BundleProbe
  failure_signature_lines = $FailureLines
  metro_stdout_tail = $MetroStdoutTail
  metro_stderr_tail = $MetroStderrTail
  stopped_temp_processes = $StoppedTempProcesses
}

$Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

$SummaryLines = New-Object System.Collections.Generic.List[string]

[void]$SummaryLines.Add($IssueCode)
[void]$SummaryLines.Add("SESSION_ID      : $SessionId")
[void]$SummaryLines.Add("RESULT          : $FinalResult")
[void]$SummaryLines.Add("FAILURE_CATEGORY: $FailureCategory")
[void]$SummaryLines.Add("RUN_ROOT        : $RunRoot")
[void]$SummaryLines.Add("TEMP_PORT       : $TempPort")
[void]$SummaryLines.Add("PACKAGE         : $PackageName")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("RISK_FLAGS:")
[void]$SummaryLines.Add(($RiskFlags -join "`n"))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("ADB_DEVICES:")
[void]$SummaryLines.Add($AdbDevicesRaw)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("DEVICE_CHECKS:")
[void]$SummaryLines.Add(($DeviceChecks | Format-Table -Wrap -AutoSize device,has_dev_build,foreground | Out-String))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("FILE_INVENTORY:")
[void]$SummaryLines.Add(($FileInventory | Format-Table -AutoSize relative,exists | Out-String))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("NODE_RESOLVE_CORE_MODULES:")
[void]$SummaryLines.Add("EXIT: $ResolveExitCode")
[void]$SummaryLines.Add($ResolveOutput)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("EXPO_CONFIG:")
[void]$SummaryLines.Add("EXIT: $ExpoConfigExitCode")
[void]$SummaryLines.Add(($ExpoConfigOutput -split "`r?`n" | Select-Object -First 80) -join "`n")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("TEMP_METRO_STATUS:")
[void]$SummaryLines.Add("OK     : $($MetroStatus.ok)")
[void]$SummaryLines.Add("STATUS : $($MetroStatus.statusCode)")
[void]$SummaryLines.Add("WAITED : $($MetroStatus.waitedSeconds)")
[void]$SummaryLines.Add("ERROR  : $($MetroStatus.error)")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("TEMP_BUNDLE_PROBE:")
[void]$SummaryLines.Add("OK     : $($BundleProbe.ok)")
[void]$SummaryLines.Add("STATUS : $($BundleProbe.statusCode)")
[void]$SummaryLines.Add("ERROR  : $($BundleProbe.error)")
[void]$SummaryLines.Add("URL    : $($BundleProbe.url)")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("FAILURE_SIGNATURE_LINES:")
[void]$SummaryLines.Add(($FailureLines -join "`n"))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("METRO_STDOUT_TAIL:")
[void]$SummaryLines.Add($MetroStdoutTail)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("METRO_STDERR_TAIL:")
[void]$SummaryLines.Add($MetroStderrTail)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("STOPPED_TEMP_PROCESSES:")
[void]$SummaryLines.Add(($StoppedTempProcesses | Format-Table -Wrap -AutoSize pid,name,reason | Out-String))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("FINAL_DECISION:")
[void]$SummaryLines.Add($Decision)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("EVIDENCE:")
[void]$SummaryLines.Add("summary.txt  : $SummaryPath")
[void]$SummaryLines.Add("evidence.json: $EvidencePath")
[void]$SummaryLines.Add("metro stdout : $MetroOutPath")
[void]$SummaryLines.Add("metro stderr : $MetroErrPath")

$SummaryText = $SummaryLines -join [Environment]::NewLine
$SummaryText | Tee-Object -FilePath $SummaryPath
