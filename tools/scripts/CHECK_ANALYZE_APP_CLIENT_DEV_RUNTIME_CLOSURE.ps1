Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"

$IssueCode = "CHECK_ANALYZE_APP_CLIENT_DEV_RUNTIME_CLOSURE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = "C:\bthwani-suite"
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$PackageName = "com.bthwani.client.dev"
$AppDir = Join-Path $RepoRoot "apps\mobile\app-client"
$Port = 8081

function To-SafeText($Value) {
  if ($null -eq $Value) { return "" }
  return ($Value | Out-String).Trim()
}

function Invoke-CmdText {
  param(
    [string]$File,
    [string[]]$Args
  )

  try {
    $Output = & $File @Args 2>&1 | Out-String
    return [pscustomobject]@{
      ok = $true
      text = $Output.Trim()
    }
  } catch {
    return [pscustomobject]@{
      ok = $false
      text = $_.Exception.Message
    }
  }
}

$Findings = [ordered]@{}

$Findings.repo_root_exists = Test-Path -LiteralPath $RepoRoot
$Findings.app_dir_exists = Test-Path -LiteralPath $AppDir

$Adb = Get-Command adb -ErrorAction SilentlyContinue
$Pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
$Node = Get-Command node -ErrorAction SilentlyContinue

$Findings.tools = [pscustomobject]@{
  adb = if ($Adb) { $Adb.Source } else { $null }
  pnpm = if ($Pnpm) { $Pnpm.Source } else { $null }
  node = if ($Node) { $Node.Source } else { $null }
}

$AdbDevicesRaw = if ($Adb) { To-SafeText (& adb devices 2>&1) } else { "adb not found" }

$Devices = @()
if ($Adb) {
  $Devices = (& adb devices 2>$null) |
    Select-Object -Skip 1 |
    Where-Object { $_ -match "\S+\s+device$" } |
    ForEach-Object { ($_ -split "\s+")[0] }
}

$OfflineDevices = @()
if ($Adb) {
  $OfflineDevices = (& adb devices 2>$null) |
    Select-Object -Skip 1 |
    Where-Object { $_ -match "\S+\s+(offline|unauthorized)$" } |
    ForEach-Object { $_.Trim() }
}

$DeviceChecks = @()

foreach ($Device in $Devices) {
  $PackageList = To-SafeText (& adb -s $Device shell pm list packages $PackageName 2>&1)
  $Installed = $PackageList -match [regex]::Escape($PackageName)

  $VersionInfo = ""
  if ($Installed) {
    $VersionInfo = To-SafeText (& adb -s $Device shell dumpsys package $PackageName 2>&1 | Select-String -Pattern "versionName|versionCode|firstInstallTime|lastUpdateTime" -Context 0,0)
  }

  $ReverseList = To-SafeText (& adb -s $Device reverse --list 2>&1)

  $Foreground = To-SafeText (& adb -s $Device shell dumpsys window 2>&1 | Select-String -Pattern "mCurrentFocus|mFocusedApp" | Select-Object -First 5)

  $DeviceChecks += [pscustomobject]@{
    device = $Device
    package = $PackageName
    installed = $Installed
    package_raw = $PackageList
    version_info = $VersionInfo
    adb_reverse = $ReverseList
    foreground = $Foreground
  }
}

$PortConns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess

$PortOwners = @()
foreach ($Conn in $PortConns) {
  if ($Conn.OwningProcess -ne 0) {
    $Proc = Get-CimInstance Win32_Process -Filter "ProcessId=$($Conn.OwningProcess)" -ErrorAction SilentlyContinue
    if ($Proc) {
      $PortOwners += [pscustomobject]@{
        port = $Port
        pid = $Proc.ProcessId
        name = $Proc.Name
        commandLine = $Proc.CommandLine
      }
    }
  }
}

$MetroStatusUrl = "http://127.0.0.1:$Port/status"
$MetroStatus = $null
try {
  $StatusResponse = Invoke-WebRequest -Uri $MetroStatusUrl -UseBasicParsing -TimeoutSec 10
  $MetroStatus = [pscustomobject]@{
    ok = $true
    statusCode = [int]$StatusResponse.StatusCode
    body = $StatusResponse.Content
  }
} catch {
  $MetroStatus = [pscustomobject]@{
    ok = $false
    error = $_.Exception.Message
    response = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
  }
}

$BundleUrl = "http://127.0.0.1:$Port/apps/mobile/app-client/index.bundle?platform=android&dev=true&minify=false"
$BundleProbe = $null
try {
  $BundleResponse = Invoke-WebRequest -Uri $BundleUrl -UseBasicParsing -TimeoutSec 30
  $Content = [string]$BundleResponse.Content
  $BundleProbe = [pscustomobject]@{
    ok = $true
    statusCode = [int]$BundleResponse.StatusCode
    contentType = $BundleResponse.Headers["Content-Type"]
    contentLength = $Content.Length
    first1200 = $Content.Substring(0, [Math]::Min(1200, $Content.Length))
  }
} catch {
  $ErrorBody = ""
  try {
    if ($_.Exception.Response) {
      $Stream = $_.Exception.Response.GetResponseStream()
      if ($Stream) {
        $Reader = New-Object System.IO.StreamReader($Stream)
        $ErrorBody = $Reader.ReadToEnd()
      }
    }
  } catch {
    $ErrorBody = ""
  }

  $ParsedMessage = ""
  try {
    if ($ErrorBody) {
      $Json = $ErrorBody | ConvertFrom-Json
      if ($Json.message) { $ParsedMessage = [string]$Json.message }
      elseif ($Json.errors -and $Json.errors.Count -gt 0) { $ParsedMessage = [string]$Json.errors[0].message }
    }
  } catch {
    $ParsedMessage = ""
  }

  $BundleProbe = [pscustomobject]@{
    ok = $false
    statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    error = $_.Exception.Message
    parsedMessage = $ParsedMessage
    bodyFirst3000 = if ($ErrorBody) { $ErrorBody.Substring(0, [Math]::Min(3000, $ErrorBody.Length)) } else { "" }
  }
}

$ExpoProcesses = Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -match "expo" -or
    $_.CommandLine -match "metro" -or
    $_.CommandLine -match "apps/mobile/app-client"
  } |
  Select-Object ProcessId, Name, CommandLine

$InstalledDevices = @($DeviceChecks | Where-Object { $_.installed })
$MetroOwner = @($PortOwners | Where-Object { $_.commandLine -match "expo" -and $_.commandLine -match "start" })

$RiskFlags = @()

if (-not $Findings.repo_root_exists) { $RiskFlags += "REPO_ROOT_MISSING" }
if (-not $Findings.app_dir_exists) { $RiskFlags += "APP_CLIENT_DIR_MISSING" }
if (-not $Adb) { $RiskFlags += "ADB_NOT_FOUND" }
if (-not $Pnpm) { $RiskFlags += "PNPM_NOT_FOUND" }
if (-not $Node) { $RiskFlags += "NODE_NOT_FOUND" }
if ($OfflineDevices.Count -gt 0) { $RiskFlags += "ADB_HAS_OFFLINE_OR_UNAUTHORIZED_DEVICE" }
if ($Devices.Count -eq 0) { $RiskFlags += "NO_ONLINE_ANDROID_DEVICE" }
if ($Devices.Count -gt 1) { $RiskFlags += "MULTIPLE_ANDROID_DEVICES_CONNECTED_REQUIRE_EXPLICIT_TARGET" }
if ($InstalledDevices.Count -eq 0) { $RiskFlags += "DEV_BUILD_NOT_INSTALLED_ON_ANY_ONLINE_DEVICE" }
if ($InstalledDevices.Count -gt 0 -and $InstalledDevices.Count -lt $Devices.Count) { $RiskFlags += "DEV_BUILD_INSTALLED_ON_SOME_DEVICES_ONLY" }
if ($MetroOwner.Count -eq 0) { $RiskFlags += "METRO_NOT_PROVEN_ON_PORT_8081" }
if (-not $MetroStatus.ok) { $RiskFlags += "METRO_STATUS_ENDPOINT_FAILED" }
if (-not $BundleProbe.ok) { $RiskFlags += "METRO_BUNDLE_ENDPOINT_FAILED" }

$FinalResult =
  if ($RiskFlags -contains "REPO_ROOT_MISSING") { "FAIL_REPO_ROOT_MISSING" }
  elseif ($RiskFlags -contains "APP_CLIENT_DIR_MISSING") { "FAIL_APP_CLIENT_DIR_MISSING" }
  elseif ($RiskFlags -contains "ADB_NOT_FOUND") { "FAIL_ADB_NOT_FOUND" }
  elseif ($RiskFlags -contains "NO_ONLINE_ANDROID_DEVICE") { "FAIL_NO_ONLINE_ANDROID_DEVICE" }
  elseif ($RiskFlags -contains "DEV_BUILD_NOT_INSTALLED_ON_ANY_ONLINE_DEVICE") { "FAIL_DEV_BUILD_NOT_INSTALLED" }
  elseif ($RiskFlags -contains "METRO_NOT_PROVEN_ON_PORT_8081") { "FAIL_METRO_NOT_RUNNING_ON_8081" }
  elseif ($RiskFlags -contains "METRO_BUNDLE_ENDPOINT_FAILED") { "FAIL_METRO_BUNDLE_500_OR_UNAVAILABLE" }
  elseif ($RiskFlags -contains "MULTIPLE_ANDROID_DEVICES_CONNECTED_REQUIRE_EXPLICIT_TARGET") { "WARN_MULTIPLE_DEVICES_BUT_CHAIN_WORKS_REQUIRE_EXPLICIT_TARGET" }
  else { "PASS_APP_CLIENT_DEV_RUNTIME_CHAIN_READY" }

$RecommendedTarget =
  if ($InstalledDevices.Count -eq 1) { $InstalledDevices[0].device }
  elseif ($InstalledDevices.Count -gt 1) { "MULTIPLE_INSTALLED_TARGETS_EXPLICIT_SELECTION_REQUIRED" }
  else { "NO_VALID_TARGET_WITH_DEV_BUILD" }

$Evidence = [pscustomobject]@{
  issue = $IssueCode
  session_id = $SessionId
  result = $FinalResult
  risk_flags = $RiskFlags
  recommended_target = $RecommendedTarget
  repo_root = $RepoRoot
  app_dir = $AppDir
  package = $PackageName
  port = $Port
  tools = $Findings.tools
  adb_devices_raw = $AdbDevicesRaw
  online_devices = $Devices
  offline_or_unauthorized_devices = $OfflineDevices
  device_checks = $DeviceChecks
  port_connections = $PortConns
  port_owners = $PortOwners
  metro_status_url = $MetroStatusUrl
  metro_status = $MetroStatus
  bundle_url = $BundleUrl
  bundle_probe = $BundleProbe
  expo_related_processes = $ExpoProcesses
}

$EvidencePath = Join-Path $RunRoot "evidence.json"
$SummaryPath = Join-Path $RunRoot "summary.txt"

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

$DecisionText = switch ($FinalResult) {
  "FAIL_DEV_BUILD_NOT_INSTALLED" {
    "Install the app-client development build for package $PackageName on the intended device before opening Expo. Do not press 'a' until package presence is proven."
  }
  "FAIL_METRO_NOT_RUNNING_ON_8081" {
    "Start Metro from apps/mobile/app-client on port 8081, then re-run this gate. Do not open the app before Metro ownership is proven."
  }
  "FAIL_METRO_BUNDLE_500_OR_UNAVAILABLE" {
    "Metro is running, but bundle generation is failing. This is now a code/config/Metro error, not a device-install error. Read BUNDLE_ERROR_MESSAGE and BUNDLE_ERROR_BODY below."
  }
  "WARN_MULTIPLE_DEVICES_BUT_CHAIN_WORKS_REQUIRE_EXPLICIT_TARGET" {
    "The chain works, but multiple Android devices are connected. Use an explicit target before launching to prevent recurrence."
  }
  "PASS_APP_CLIENT_DEV_RUNTIME_CHAIN_READY" {
    "The device/build/Metro/bundle chain is ready. It is safe to launch the app."
  }
  default {
    "Fix the first FAIL shown in RISK_FLAGS, then re-run this gate."
  }
}

@"
$IssueCode
SESSION_ID        : $SessionId
RESULT            : $FinalResult
RUN_ROOT          : $RunRoot
PACKAGE           : $PackageName
PORT              : $Port
RECOMMENDED_TARGET: $RecommendedTarget

RISK_FLAGS:
$($RiskFlags -join "`n")

TOOLS:
ADB : $($Findings.tools.adb)
PNPM: $($Findings.tools.pnpm)
NODE: $($Findings.tools.node)

ADB_DEVICES:
$AdbDevicesRaw

DEVICE_PACKAGE_CHECK:
$($DeviceChecks | Format-Table -Wrap -AutoSize device,installed,package,version_info | Out-String)

PORT_8081_OWNER:
$($PortOwners | Format-Table -Wrap -AutoSize port,pid,name,commandLine | Out-String)

METRO_STATUS:
OK    : $($MetroStatus.ok)
STATUS: $($MetroStatus.statusCode)
BODY  : $($MetroStatus.body)
ERROR : $($MetroStatus.error)

BUNDLE_PROBE:
OK             : $($BundleProbe.ok)
STATUS         : $($BundleProbe.statusCode)
ERROR          : $($BundleProbe.error)
BUNDLE_MESSAGE : $($BundleProbe.parsedMessage)
URL            : $BundleUrl

BUNDLE_ERROR_BODY_FIRST_3000:
$($BundleProbe.bodyFirst3000)

EXPO_RELATED_PROCESSES:
$($ExpoProcesses | Format-Table -Wrap -AutoSize ProcessId,Name,CommandLine | Out-String)

FINAL_DECISION:
$DecisionText

CANONICAL_NEXT_COMMAND_EXAMPLES:
- To target emulator only in current PowerShell session:
  `$env:ANDROID_SERIAL="$RecommendedTarget"

- To start Metro:
  pnpm --dir apps/mobile/app-client exec expo start --dev-client --port 8081 --clear

- If multiple devices are connected, do not launch without explicit target.
"@ | Tee-Object -FilePath $SummaryPath
