param(
  [ValidateSet("dsh", "wlt", "all", "none")]
  [string]$Stack = "",

  [ValidateSet("none", "mongo", "redis", "all")]
  [string]$Addons = "",

  [switch]$ClearMetroOnce,
  [switch]$NoKillPorts,
  [switch]$WithScrcpy,
  [switch]$NoScrcpy
)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$SessionId = "LOCAL_LIVE_TEST-" + (Get-Date -Format "yyyyMMdd-HHmmss")
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

function Assert-LocalPath {
  param([string]$RelativePath, [string]$Label)
  $path = Join-Path $Root $RelativePath
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing required path for ${Label}: $path" }
  return $path
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
    # Open as a new tab in the active Windows Terminal window
    Start-Process $wtPath -ArgumentList "-w 0 new-tab -d `"$safeDir`" --title `"$safeTitle`" powershell.exe -NoExit -ExecutionPolicy Bypass -EncodedCommand $encoded"
  } else {
    # Fallback to separate legacy powershell console window
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
    "dsh"  { $targets += "dsh-postgres"; $expected += "bthwani-dsh-postgres-local" }
    "wlt"  { $targets += "wlt-postgres"; $expected += "bthwani-wlt-postgres-local" }
    "all"  { $targets += "dsh-postgres", "wlt-postgres"; $expected += "bthwani-dsh-postgres-local", "bthwani-wlt-postgres-local" }
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
  docker volume ls | Out-File -Encoding utf8 (Join-Path $RunRoot "docker-volumes.txt")

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

function Invoke-AdbSetup {
  param([int]$DshPort, [int]$AppClientPort, [int]$AppPartnerPort, [int]$AppCaptainPort, [int]$AppFieldPort, [int]$ControlPanelPort)

  $adbMode = (Get-LocalEnv "ADB_MODE" "usb").ToLowerInvariant()
  $usbSerial = Get-LocalEnv "ADB_SERIAL" ""
  $wifiPort = Get-LocalEnv "ADB_WIFI_PORT" "5555"

  if (-not (Get-Command adb -ErrorAction SilentlyContinue)) { throw "adb not found in PATH." }

  $runtimeSerial = $usbSerial
  Write-RunLog "ADB mode: $adbMode"

  if ($adbMode -eq "wifi") {
    if ([string]::IsNullOrWhiteSpace($usbSerial)) { throw "ADB_MODE=wifi requires ADB_SERIAL." }

    Invoke-LoggedCommand "adb-wifi-connect.log" {
      adb -s $usbSerial devices
      $a4 = & adb -s $usbSerial shell "ip -4 addr show wlan0 2>/dev/null || true" 2>$null
      $ip = ([regex]::Match(($a4 | Out-String), "inet\s+(\d{1,3}(?:\.\d{1,3}){3})\/")).Groups[1].Value
      if (-not $ip) { throw "No IPv4 on wlan0." }

      adb -s $usbSerial tcpip $wifiPort
      Start-Sleep -Milliseconds 900
      $wifiSerial = "$ip`:$wifiPort"
      adb connect $wifiSerial
      Start-Sleep -Milliseconds 500

      $dev = (adb devices) -join "`n"
      if ($dev -notmatch [regex]::Escape($wifiSerial)) { throw "Wi-Fi endpoint not listed: $wifiSerial" }

      $script:AdbRuntimeSerial = $wifiSerial
      Write-Host "ADB Wi-Fi connected: $wifiSerial"
    }

    $runtimeSerial = $script:AdbRuntimeSerial
  } elseif ($adbMode -eq "usb") {
    Invoke-LoggedCommand "adb-usb-check.log" { adb devices }
  } else {
    throw "Unsupported ADB_MODE: $adbMode. Use usb or wifi."
  }

  Invoke-LoggedCommand "adb-reverse.log" {
    if ([string]::IsNullOrWhiteSpace($runtimeSerial)) {
      adb reverse tcp:$DshPort tcp:$DshPort
      adb reverse tcp:$AppClientPort tcp:$AppClientPort
      adb reverse tcp:$AppPartnerPort tcp:$AppPartnerPort
      adb reverse tcp:$AppCaptainPort tcp:$AppCaptainPort
      adb reverse tcp:$AppFieldPort tcp:$AppFieldPort
      adb reverse tcp:$ControlPanelPort tcp:$ControlPanelPort
      adb reverse --list
    } else {
      adb -s $runtimeSerial reverse tcp:$DshPort tcp:$DshPort
      adb -s $runtimeSerial reverse tcp:$AppClientPort tcp:$AppClientPort
      adb -s $runtimeSerial reverse tcp:$AppPartnerPort tcp:$AppPartnerPort
      adb -s $runtimeSerial reverse tcp:$AppCaptainPort tcp:$AppCaptainPort
      adb -s $runtimeSerial reverse tcp:$AppFieldPort tcp:$AppFieldPort
      adb -s $runtimeSerial reverse tcp:$ControlPanelPort tcp:$ControlPanelPort
      adb -s $runtimeSerial reverse --list
    }
  }

  return $runtimeSerial
}

function Start-ScrcpyIfEnabled {
  param([string]$RuntimeSerial)

  $scrcpyEnabledFromEnv = (Get-LocalEnv "SCRCPY_ENABLED" "0") -eq "1"
  $useScrcpy = ($WithScrcpy -or $scrcpyEnabledFromEnv) -and (-not $NoScrcpy)
  if (-not $useScrcpy) { Write-RunLog "Scrcpy skipped."; return }

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

# Load env
$EnvFile = Join-Path $Root ".env.local"
Import-RootEnv -Path $EnvFile

if ([string]::IsNullOrWhiteSpace($Stack)) { $Stack = Get-LocalEnv "BTHWANI_STACK" "all" }
if ([string]::IsNullOrWhiteSpace($Addons)) { $Addons = Get-LocalEnv "BTHWANI_ADDONS" "none" }

$DshPort = [int](Get-LocalEnv "DSH_API_PORT" "8080")
$DshBaseUrl = Get-LocalEnv "DSH_API_BASE_URL" "http://localhost:8080"
$DatabaseUrl = Get-LocalEnv "DATABASE_URL" "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"

$AppClientPort = [int](Get-LocalEnv "APP_CLIENT_PORT" "8081")
$AppPartnerPort = [int](Get-LocalEnv "APP_PARTNER_PORT" "8082")
$AppCaptainPort = [int](Get-LocalEnv "APP_CAPTAIN_PORT" "8083")
$AppFieldPort = [int](Get-LocalEnv "APP_FIELD_PORT" "8084")
$ControlPanelPort = [int](Get-LocalEnv "CONTROL_PANEL_PORT" "3000")
$ExpoHost = Get-LocalEnv "EXPO_HOST" "localhost"
$ExpoClear = (Get-LocalEnv "EXPO_CLEAR" "0") -eq "1"

Assert-LocalPath "docker-compose.local.yml" "root compose" | Out-Null
Assert-LocalPath "dsh\backend" "DSH backend" | Out-Null
Assert-LocalPath "app-client\runtime" "app-client runtime" | Out-Null
Assert-LocalPath "app-partner\runtime" "app-partner runtime" | Out-Null
Assert-LocalPath "app-captain\runtime" "app-captain runtime" | Out-Null
Assert-LocalPath "app-field\runtime" "app-field runtime" | Out-Null
Assert-LocalPath "control-panel\runtime" "control-panel runtime" | Out-Null

Write-RunLog "Session started: $SessionId"
Write-RunLog "Evidence root: $RunRoot"
Write-RunLog "Stack=$Stack Addons=$Addons"

git --no-pager status --short | Out-File -Encoding utf8 (Join-Path $RunRoot "git-status-before.txt")
git --no-pager diff --check 2>&1 | Out-File -Encoding utf8 (Join-Path $RunRoot "git-diff-check-before.txt")

$devPorts = @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $ControlPanelPort)
Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in $devPorts } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess |
  Out-File -Encoding utf8 (Join-Path $RunRoot "ports-before.txt")

if (-not $NoKillPorts) {
  Stop-PortOwner -Port $DshPort -Label "DSH Go API"
  Stop-PortOwner -Port $AppClientPort -Label "app-client Expo"
  Stop-PortOwner -Port $AppPartnerPort -Label "app-partner Expo"
  Stop-PortOwner -Port $AppCaptainPort -Label "app-captain Expo"
  Stop-PortOwner -Port $AppFieldPort -Label "app-field Expo"
  Stop-PortOwner -Port $ControlPanelPort -Label "control-panel Next"
}

Invoke-DockerComposeUp -StackMode $Stack -AddonsMode $Addons | Out-Null

$goLog = SafeLogPath "go-api.log"
Start-LiveWindow "BThwani DSH Go API :$DshPort" (Join-Path $Root "dsh\backend") @"
`$env:PORT = '$DshPort'
`$env:DATABASE_URL = '$DatabaseUrl'
go run ./cmd/dsh-api 2>&1 | Tee-Object -FilePath '$goLog' -Append
"@
Wait-TcpPort -Port $DshPort -Label "DSH Go API" -TimeoutSeconds 120

Invoke-LoggedCommand "api-smoke-stores.log" { Invoke-WebRequest "http://127.0.0.1:$DshPort/stores" -UseBasicParsing }

$AdbRuntimeSerial = Invoke-AdbSetup -DshPort $DshPort -AppClientPort $AppClientPort -AppPartnerPort $AppPartnerPort -AppCaptainPort $AppCaptainPort -AppFieldPort $AppFieldPort -ControlPanelPort $ControlPanelPort
Start-ScrcpyIfEnabled -RuntimeSerial $AdbRuntimeSerial

if ($ClearMetroOnce) {
  $metroCache = Join-Path $env:TEMP "metro-cache"
  Write-RunLog "ClearMetroOnce enabled. Cleaning Metro cache: $metroCache"
  if (Test-Path -LiteralPath $metroCache) { Remove-Item -LiteralPath $metroCache -Recurse -Force -ErrorAction SilentlyContinue }
}

$clearArg = ""
if ($ExpoClear -or $ClearMetroOnce) { $clearArg = " --clear" }

$appClientLog = SafeLogPath "app-client.log"
$appPartnerLog = SafeLogPath "app-partner.log"
$appCaptainLog = SafeLogPath "app-captain.log"
$appFieldLog = SafeLogPath "app-field.log"
$controlPanelLog = SafeLogPath "control-panel.log"

Start-LiveWindow "BThwani app-client :$AppClientPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-client/runtime exec expo start --dev-client --host $ExpoHost --port $AppClientPort$clearArg 2>&1 | Tee-Object -FilePath '$appClientLog' -Append
"@
Wait-TcpPort -Port $AppClientPort -Label "app-client Metro" -TimeoutSeconds 180

Start-LiveWindow "BThwani app-partner :$AppPartnerPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-partner/runtime exec expo start --dev-client --host $ExpoHost --port $AppPartnerPort$clearArg 2>&1 | Tee-Object -FilePath '$appPartnerLog' -Append
"@
Wait-TcpPort -Port $AppPartnerPort -Label "app-partner Metro" -TimeoutSeconds 180

Start-LiveWindow "BThwani app-captain :$AppCaptainPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-captain/runtime exec expo start --dev-client --host $ExpoHost --port $AppCaptainPort$clearArg 2>&1 | Tee-Object -FilePath '$appCaptainLog' -Append
"@
Wait-TcpPort -Port $AppCaptainPort -Label "app-captain Metro" -TimeoutSeconds 180

Start-LiveWindow "BThwani app-field :$AppFieldPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-field/runtime exec expo start --dev-client --host $ExpoHost --port $AppFieldPort$clearArg 2>&1 | Tee-Object -FilePath '$appFieldLog' -Append
"@
Wait-TcpPort -Port $AppFieldPort -Label "app-field Metro" -TimeoutSeconds 180

Start-LiveWindow "BThwani control-panel :$ControlPanelPort" $Root @"
`$env:NEXT_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir control-panel/runtime dev 2>&1 | Tee-Object -FilePath '$controlPanelLog' -Append
"@
Wait-TcpPort -Port $ControlPanelPort -Label "control-panel Next" -TimeoutSeconds 180

$SummaryText = @"
status: STARTED
session_id: $SessionId
repo: $Root
evidence_root: $RunRoot
handoff_zip: $RunRoot\$SessionId.zip
stack_mode: $Stack
addons_mode: $Addons
adb_runtime_serial: $AdbRuntimeSerial
expo_host: $ExpoHost
excluded_services:
- webapp
- website
next_manual_steps:
1. Open Scrcpy.
2. Open control-panel on http://localhost:$ControlPanelPort
3. Create one real order from app-client.
4. Record orderId.
5. Verify the same order in app-partner/app-captain/app-field/control-panel.
6. Capture screenshots and logs.
7. Do not claim PASS without evidence.
"@
$SummaryText | Out-File -Encoding utf8 (Join-Path $RunRoot "SUMMARY.md")

$ZipPath = Join-Path $RunRoot "$SessionId.zip"
$zipItems = Get-ChildItem -LiteralPath $RunRoot -File | Where-Object { $_.Name -ne "$SessionId.zip" } | Select-Object -ExpandProperty FullName
if ($zipItems) { Compress-Archive -Path $zipItems -DestinationPath $ZipPath -Force }

Write-Host ""
Write-Host "LOCAL LIVE TEST STARTED"
Write-Host "Session: $SessionId"
Write-Host "Evidence: $RunRoot"
Write-Host "ZIP: $ZipPath"
Write-Host "ADB Runtime Serial: $AdbRuntimeSerial"
Write-Host ""
Write-Host "ابدأ الآن تجربة طلب حقيقي واحد من app-client وتتبع نفس orderId في بقية الأسطح."
