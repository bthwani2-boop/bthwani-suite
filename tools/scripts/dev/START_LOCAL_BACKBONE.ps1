param(
  [ValidateSet("dsh", "wlt", "all", "none")]
  [string]$Stack = "all",

  [ValidateSet("none", "mongo", "redis", "all")]
  [string]$Addons = "none",

  [switch]$RunDshApi = $true,

  [switch]$RunWltApi,

  [switch]$NoControlPanel,

  [switch]$NoScrcpy
)

Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$Root = "C:\bthwani-suite"
$SessionId = "LOCAL_BACKBONE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path $Root "tools\registry\runs\$SessionId"
$Logs = Join-Path $RunRoot "logs"
New-Item -ItemType Directory -Force -Path $RunRoot, $Logs | Out-Null

function Write-RunLog {
  param([string]$Message)
  $line = "[$(Get-Date -Format s)] $Message"
  $line | Tee-Object -FilePath (Join-Path $RunRoot "command-log.txt") -Append | Out-Host
}

function Import-RootEnv {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Missing required local env file: $Path"
  }

  Write-RunLog "Loading local env file: $Path"

  foreach ($raw in Get-Content -LiteralPath $Path) {
    $line = $raw.Trim()
    if ($line -eq "" -or $line.StartsWith("#") -or $line -notmatch "=") { continue }

    $parts = $line -split "=", 2
    $name = $parts[0].Trim()
    $value = $parts[1].Trim()

    if ((($value.StartsWith('"')) -and ($value.EndsWith('"'))) -or (($value.StartsWith("'")) -and ($value.EndsWith("'")))) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    if ($name -ne "") {
      [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

function Get-LocalEnv {
  param([string]$Name, [string]$Default)
  $value = [System.Environment]::GetEnvironmentVariable($Name, "Process")
  if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
  return $value
}

function SafeLogPath {
  param([string]$Name)
  return (Join-Path $Logs $Name).Replace("'", "''")
}

function Start-LiveWindow {
  param([string]$Title, [string]$WorkingDir, [string]$Command)

  $safeTitle = $Title.Replace("'", "''")
  $safeDir = $WorkingDir.Replace("'", "''")

  $runner = @"
chcp 65001 > `$null
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
`$OutputEncoding = [System.Text.UTF8Encoding]::new()
`$ErrorActionPreference = 'Continue'
`$PSNativeCommandUseErrorActionPreference = `$false
`$Host.UI.RawUI.WindowTitle = '$safeTitle'
Set-Location -LiteralPath '$safeDir'
$Command
"@

  $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($runner))

  $wtPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps\wt.exe"
  if (Test-Path -LiteralPath $wtPath) {
    Start-Process $wtPath -ArgumentList "-w 0 new-tab -d `"$safeDir`" --title `"$safeTitle`" powershell.exe -NoExit -ExecutionPolicy Bypass -EncodedCommand $encoded"
  } else {
    Start-Process powershell.exe -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encoded)
  }
}

function Invoke-LoggedCommand {
  param([string]$LogName, [scriptblock]$CommandBlock)
  $logPath = Join-Path $Logs $LogName
  try {
    $oldEAP = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $CommandBlock 2>&1 | Tee-Object -FilePath $logPath -Append | Out-Host
    $ErrorActionPreference = $oldEAP
    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
      throw "Command exited with code $LASTEXITCODE"
    }
  } catch {
    "ERROR: $($_.Exception.Message)" | Tee-Object -FilePath $logPath -Append | Out-Host
    throw
  }
}

function Stop-PortOwner {
  param([int]$Port, [string]$Label)

  $logFile = Join-Path $Logs "port-kill-$Port.log"
  "Checking port $Port for $Label" | Tee-Object -FilePath $logFile -Append | Out-Host

  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $connections) {
    "PASS: Port $Port is free for $Label" | Tee-Object -FilePath $logFile -Append | Out-Host
    return
  }

  $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -and $_ -ne $PID }

  foreach ($processId in $pids) {
    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if (-not $proc) { continue }

    "KILL: Port $Port / $Label is used by PID=$processId Name=$($proc.ProcessName)" |
      Tee-Object -FilePath $logFile -Append | Out-Host

    Stop-Process -Id $processId -Force -ErrorAction Stop
    Start-Sleep -Milliseconds 800
  }

  $stillUsed = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($stillUsed) { throw "Port $Port is still in use for $Label." }

  "PASS: Port $Port is now free for $Label" | Tee-Object -FilePath $logFile -Append | Out-Host
}

function Wait-TcpPort {
  param([int]$Port, [string]$Label, [int]$TimeoutSeconds = 120)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  Write-RunLog "Waiting for $Label on port $Port..."

  while ((Get-Date) -lt $deadline) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
      Write-RunLog "READY: $Label is listening on port $Port"
      return
    }
    Start-Sleep -Seconds 2
  }

  throw "Timeout waiting for $Label on port $Port"
}

function Build-ComposePlan {
  param([string]$StackMode, [string]$AddonsMode)

  $profiles = @()
  $targets = @()
  $expected = @()

  switch ($StackMode) {
    "dsh"  { $targets += "dsh-postgres", "auth-service"; $expected += "bthwani-dsh-postgres-local", "bthwani-auth-service-local" }
    "wlt"  { $targets += "wlt-postgres"; $expected += "bthwani-wlt-postgres-local" }
    "all"  { $targets += "dsh-postgres", "auth-service", "wlt-postgres"; $expected += "bthwani-dsh-postgres-local", "bthwani-auth-service-local", "bthwani-wlt-postgres-local" }
    "none" { }
    default { throw "Unsupported Stack mode: $StackMode" }
  }

  switch ($AddonsMode) {
    "none"  { }
    "mongo" { $profiles += "mongo"; $targets += "mongo"; $expected += "bthwani-mongo-local" }
    "redis" { $profiles += "redis"; $targets += "redis"; $expected += "bthwani-redis-local" }
    "all"   { $profiles += "mongo", "redis"; $targets += "mongo", "redis"; $expected += "bthwani-mongo-local", "bthwani-redis-local" }
    default  { throw "Unsupported Addons mode: $AddonsMode" }
  }

  return [pscustomobject]@{
    Profiles = $profiles
    Targets = $targets
    Expected = $expected
  }
}

function Invoke-DockerComposeUp {
  param([string]$StackMode, [string]$AddonsMode)

  $plan = Build-ComposePlan -StackMode $StackMode -AddonsMode $AddonsMode

  if ($plan.Targets.Count -eq 0) {
    Write-RunLog "Docker compose skipped: Stack=$StackMode Addons=$AddonsMode"
    return $plan
  }

  $profileArgs = @()
  foreach ($profile in $plan.Profiles) {
    $profileArgs += @("--profile", $profile)
  }

  $baseArgs = @("compose", "--env-file", ".\.env.local", "-f", ".\docker-compose.local.yml") + $profileArgs
  $upArgs = $baseArgs + @("up", "-d") + $plan.Targets
  $psArgs = $baseArgs + @("ps")

  Invoke-LoggedCommand "docker-compose-up.log" { docker @upArgs }
  Invoke-LoggedCommand "docker-compose-ps.log" { docker @psArgs }

  docker @psArgs | Out-File -Encoding utf8 (Join-Path $RunRoot "docker-compose-ps.txt")

  @"
stack_mode=$StackMode
addons_mode=$AddonsMode
compose_entrypoint=C:\bthwani-suite\docker-compose.local.yml
compose_profiles=$($plan.Profiles -join ',')
compose_targets=$($plan.Targets -join ',')
expected_containers=$($plan.Expected -join ',')
"@ | Out-File -Encoding utf8 (Join-Path $RunRoot "docker-plan.txt")

  return $plan
}

function Setup-AdbConnection {
  $ErrorActionPreference = "Continue"
  $adbWifiHost = Get-LocalEnv "ADB_WIFI_HOST" ""
  $usbSerial = Get-LocalEnv "ADB_SERIAL" ""
  $wifiPort = Get-LocalEnv "ADB_WIFI_PORT" "5555"

  if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
    Write-Error "adb command is not available in PATH"
    exit 1
  }

  $runtimeSerial = ""
  if ($adbWifiHost) {
    Write-RunLog "ADB_WIFI_HOST is set to: $adbWifiHost. Connecting directly..."
    $connectOut = & adb connect $adbWifiHost 2>&1 | Out-String
    Write-RunLog $connectOut
    Start-Sleep -Milliseconds 500

    $devs = & adb devices 2>&1 | Out-String
    if ($devs -match [regex]::Escape($adbWifiHost)) {
      $runtimeSerial = $adbWifiHost
      Write-RunLog "Successfully connected to ADB_WIFI_HOST: $runtimeSerial"
    } else {
      Write-Error "BLOCKED: Failed to connect to ADB_WIFI_HOST: $adbWifiHost"
      exit 1
    }
  } else {
    if ([string]::IsNullOrWhiteSpace($usbSerial)) {
      Write-Error "BLOCKED: ADB_WIFI_HOST is empty and no ADB_SERIAL is provided in env."
      exit 1
    }

    Write-RunLog "ADB_WIFI_HOST not set. Using ADB_SERIAL: $usbSerial to connect via Wi-Fi."

    $devs = & adb devices 2>&1 | Out-String
    if ($devs -notmatch [regex]::Escape($usbSerial)) {
      Write-Error "BLOCKED: Device $usbSerial is not listed in adb devices."
      exit 1
    }

    $a4 = & adb -s $usbSerial shell "ip -4 addr show wlan0 2>/dev/null || true" 2>$null
    $ip = ([regex]::Match(($a4 | Out-String), "inet\s+(\d{1,3}(?:\.\d{1,3}){3})\/")).Groups[1].Value
    if (-not $ip) {
      Write-Error "BLOCKED: Could not extract IPv4 address from wlan0 on device $usbSerial."
      exit 1
    }

    Write-RunLog "Found device IP: $ip. Restarting adb tcpip on port $wifiPort..."
    $tcpipOut = & adb -s $usbSerial tcpip $wifiPort 2>&1 | Out-String
    Write-RunLog $tcpipOut
    Start-Sleep -Seconds 1

    $wifiSerial = "$ip`:$wifiPort"
    Write-RunLog "Connecting to $wifiSerial..."
    $connectOut = & adb connect $wifiSerial 2>&1 | Out-String
    Write-RunLog $connectOut
    Start-Sleep -Milliseconds 500

    $devs = & adb devices 2>&1 | Out-String
    if ($devs -match [regex]::Escape($wifiSerial)) {
      $runtimeSerial = $wifiSerial
      Write-RunLog "Successfully connected to ADB serial over Wi-Fi: $runtimeSerial"
    } else {
      Write-Error "BLOCKED: Failed to connect to $wifiSerial."
      exit 1
    }
  }

  return $runtimeSerial
}

function Run-AdbReverse {
  param([string]$RuntimeSerial, [int]$DshPort, [int]$AppClientPort, [int]$AppPartnerPort, [int]$AppCaptainPort, [int]$AppFieldPort, [int]$ControlPanelPort)
  $ErrorActionPreference = "Continue"

  if (-not $RuntimeSerial) {
    Write-RunLog "No active ADB serial, skipping ADB reverse."
    return
  }

  Write-RunLog "Applying ADB reverse tunnels on $RuntimeSerial..."
  $ports = @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $ControlPanelPort)
  foreach ($p in $ports) {
    & adb -s $RuntimeSerial reverse tcp:$p tcp:$p | Out-Null
  }

  $reverseList = & adb -s $RuntimeSerial reverse --list 2>&1 | Out-String
  Write-RunLog "Active reverse tunnels:`n$reverseList"
}

function Start-ScrcpyIfEnabled {
  param([string]$RuntimeSerial)

  if ($NoScrcpy) { Write-RunLog "Scrcpy skipped by NoScrcpy flag."; return }

  $scrcpyEnabledFromEnv = (Get-LocalEnv "SCRCPY_ENABLED" "0") -eq "1"
  if (-not $scrcpyEnabledFromEnv) { Write-RunLog "Scrcpy disabled by environment."; return }

  $scrcpyPath = Get-LocalEnv "SCRCPY_PATH" "scrcpy"
  $bitRate = Get-LocalEnv "SCRCPY_BIT_RATE" "8M"
  $maxFps = Get-LocalEnv "SCRCPY_MAX_FPS" "30"
  $maxSize = Get-LocalEnv "SCRCPY_MAX_SIZE" "1280"
  $scrcpyLog = SafeLogPath "scrcpy.log"

  if ($scrcpyPath -ne "scrcpy" -and -not (Test-Path -LiteralPath $scrcpyPath)) {
    Write-RunLog "WARN: scrcpy.exe not found: $scrcpyPath"
    return
  }

  if ([string]::IsNullOrWhiteSpace($RuntimeSerial)) {
    Start-LiveWindow "BThwani Scrcpy Device Mirror" $Root "& '$scrcpyPath' --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize 2>&1 | Tee-Object -FilePath '$scrcpyLog' -Append"
  } else {
    Start-LiveWindow "BThwani Scrcpy Device Mirror" $Root "& '$scrcpyPath' -s '$RuntimeSerial' --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize 2>&1 | Tee-Object -FilePath '$scrcpyLog' -Append"
  }
}

# 1. Load root environment configuration
$EnvFile = Join-Path $Root ".env.local"
Import-RootEnv -Path $EnvFile

# Get Ports and database URLs
$DshPort = [int](Get-LocalEnv "DSH_API_PORT" "8080")
$WltPort = [int](Get-LocalEnv "WLT_API_PORT" "8085")
$AppClientPort = [int](Get-LocalEnv "APP_CLIENT_PORT" "8081")
$AppPartnerPort = [int](Get-LocalEnv "APP_PARTNER_PORT" "8082")
$AppCaptainPort = [int](Get-LocalEnv "APP_CAPTAIN_PORT" "8083")
$AppFieldPort = [int](Get-LocalEnv "APP_FIELD_PORT" "8084")
$ControlPanelPort = [int](Get-LocalEnv "CONTROL_PANEL_PORT" "3000")

$DshBaseUrl = Get-LocalEnv "DSH_API_BASE_URL" "http://localhost:8080"
$DatabaseUrl = Get-LocalEnv "DATABASE_URL" "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"
$WltPostgresPort = Get-LocalEnv "WLT_POSTGRES_PORT" "55433"
$WltDatabaseUrl = Get-LocalEnv "WLT_DATABASE_URL" "postgres://wlt_local:wlt_local_password@localhost:$WltPostgresPort/wlt_local?sslmode=disable"
$AuthUrl = "http://localhost:8092"

Write-RunLog "Session started: $SessionId"
Write-RunLog "Evidence root: $RunRoot"
Write-RunLog "Stack=$Stack Addons=$Addons"

# Git check before run
git --no-pager status --short | Out-File -Encoding utf8 (Join-Path $RunRoot "git-status-before.txt")
git --no-pager diff --check 2>&1 | Out-File -Encoding utf8 (Join-Path $RunRoot "git-diff-check-before.txt")

# Ports monitoring before run
$devPorts = @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $WltPort, $ControlPanelPort)
$portsBefore = Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in $devPorts } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess

$portsBefore | Out-File -Encoding utf8 (Join-Path $RunRoot "ports-before.txt")

# 2. Kill only the dev/runtime ports
Stop-PortOwner -Port $DshPort -Label "DSH Go API"
Stop-PortOwner -Port $WltPort -Label "WLT Go API"
Stop-PortOwner -Port $AppClientPort -Label "app-client Expo"
Stop-PortOwner -Port $AppPartnerPort -Label "app-partner Expo"
Stop-PortOwner -Port $AppCaptainPort -Label "app-captain Expo"
Stop-PortOwner -Port $AppFieldPort -Label "app-field Expo"
Stop-PortOwner -Port $ControlPanelPort -Label "control-panel Next"

# 3. Boot Docker Compose
$plan = Invoke-DockerComposeUp -StackMode $Stack -AddonsMode $Addons

# 4. Start DSH Go API from Root using go -C
if ($RunDshApi) {
  $goLog = SafeLogPath "go-api.log"
  Start-LiveWindow "BThwani DSH Go API :$DshPort" $Root @"
`$env:PORT = '$DshPort'
`$env:DATABASE_URL = '$DatabaseUrl'
`$env:DSH_AUTH_SERVICE_URL = '$AuthUrl'
go -C .\dsh\backend run .\cmd\dsh-api 2>&1 | Tee-Object -FilePath '$goLog' -Append
"@
  Wait-TcpPort -Port $DshPort -Label "DSH Go API" -TimeoutSeconds 120
  Invoke-LoggedCommand "api-smoke-stores.log" { Invoke-WebRequest "http://127.0.0.1:$DshPort/stores" -UseBasicParsing }
}

# 5. Start WLT Go API from Root using go -C (if exists and enabled)
$wltApiExists = Test-Path -LiteralPath "wlt\backend\cmd\wlt-api\main.go"
$shouldRunWlt = $false
if ($PSBoundParameters.ContainsKey('RunWltApi')) {
  $shouldRunWlt = [bool]$RunWltApi
} else {
  $shouldRunWlt = $wltApiExists
}

$wltStatus = "NOT_STARTED"
if ($shouldRunWlt) {
  if ($wltApiExists) {
    $wltLog = SafeLogPath "wlt-api.log"
    Start-LiveWindow "BThwani WLT Go API :$WltPort" $Root @"
`$env:PORT = '$WltPort'
`$env:DATABASE_URL = '$WltDatabaseUrl'
`$env:WLT_AUTH_SERVICE_URL = '$AuthUrl'
go -C .\wlt\backend run .\cmd\wlt-api 2>&1 | Tee-Object -FilePath '$wltLog' -Append
"@
    Wait-TcpPort -Port $WltPort -Label "WLT Go API" -TimeoutSeconds 120
    $wltStatus = "RUNNING"
  } else {
    Write-RunLog "WLT Go API requested but not available."
    $wltStatus = "NOT_AVAILABLE_IN_REMOTE_BRANCH"
  }
} else {
  $wltStatus = "SKIPPED"
}

# 6. Start Control Panel Next.js (unless -NoControlPanel is specified)
$controlPanelStatus = "NOT_STARTED"
if (-not $NoControlPanel) {
  $controlPanelLog = SafeLogPath "control-panel.log"
  Start-LiveWindow "BThwani control-panel :$ControlPanelPort" $Root @"
`$env:NEXT_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir control-panel/runtime dev 2>&1 | Tee-Object -FilePath '$controlPanelLog' -Append
"@
  Wait-TcpPort -Port $ControlPanelPort -Label "control-panel Next" -TimeoutSeconds 180
  $controlPanelStatus = "RUNNING"
} else {
  $controlPanelStatus = "SKIPPED"
}

# 7. Setup ADB and reverse tunnels
$adbRuntimeSerial = Setup-AdbConnection
Run-AdbReverse -RuntimeSerial $adbRuntimeSerial -DshPort $DshPort -AppClientPort $AppClientPort -AppPartnerPort $AppPartnerPort -AppCaptainPort $AppCaptainPort -AppFieldPort $AppFieldPort -ControlPanelPort $ControlPanelPort

# 8. Start Scrcpy if enabled
Start-ScrcpyIfEnabled -RuntimeSerial $adbRuntimeSerial

# Collect ports after
$portsAfter = Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in $devPorts } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess
$portsAfter | Out-File -Encoding utf8 (Join-Path $RunRoot "ports-after.txt")

# Determine status
$dshApiStatus = "NOT_STARTED"
if ($RunDshApi) {
  $conn = Get-NetTCPConnection -LocalPort $DshPort -State Listen -ErrorAction SilentlyContinue
  $dshApiStatus = if ($conn) { "RUNNING" } else { "FAILED_TO_START" }
} else {
  $dshApiStatus = "SKIPPED"
}

if ($shouldRunWlt -and $wltApiExists) {
  $conn = Get-NetTCPConnection -LocalPort $WltPort -State Listen -ErrorAction SilentlyContinue
  $wltStatus = if ($conn) { "RUNNING" } else { "FAILED_TO_START" }
}

if (-not $NoControlPanel) {
  $conn = Get-NetTCPConnection -LocalPort $ControlPanelPort -State Listen -ErrorAction SilentlyContinue
  $controlPanelStatus = if ($conn) { "RUNNING" } else { "FAILED_TO_START" }
}

$dockerPsOutput = & docker compose --env-file .\.env.local -f .\docker-compose.local.yml ps 2>&1 | Out-String
$adbReverseList = if ($adbRuntimeSerial) { & adb -s $adbRuntimeSerial reverse --list 2>&1 | Out-String } else { "" }

# Write SUMMARY.md evidence
$SummaryText = @"
# Local Backbone Evidence Summary

- stack_mode: $Stack
- addons_mode: $Addons
- compose_targets: $($plan.Targets -join ', ')
- dsh_api_status: $dshApiStatus
- wlt_api_status: $wltStatus
- control_panel_status: $controlPanelStatus
- adb_runtime_serial: $adbRuntimeSerial

## Docker Status
```
$dockerPsOutput
```

## ADB Reverse List
```
$adbReverseList
```

## Ports Configuration
- Ports Before:
$($portsBefore | Out-String)

- Ports After:
$($portsAfter | Out-String)
"@

$SummaryText | Out-File -Encoding utf8 (Join-Path $RunRoot "SUMMARY.md")

Write-Host ""
Write-Host "LOCAL BACKBONE ORCHESTRATION COMPLETED"
Write-Host "Session: $SessionId"
Write-Host "Evidence: $RunRoot"
Write-Host "ADB Runtime Serial: $adbRuntimeSerial"
Write-Host ""
