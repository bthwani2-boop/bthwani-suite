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

    if ($line -eq "" -or $line.StartsWith("#") -or $line -notmatch "=") {
      continue
    }

    $parts = $line -split "=", 2
    $name = $parts[0].Trim()
    $value = $parts[1].Trim()

    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    if ($name -ne "") {
      [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

function Get-LocalEnv {
  param(
    [string]$Name,
    [string]$Default
  )

  $value = [System.Environment]::GetEnvironmentVariable($Name, "Process")

  if ([string]::IsNullOrWhiteSpace($value)) {
    return $Default
  }

  return $value
}

function Assert-LocalPath {
  param(
    [string]$RelativePath,
    [string]$Label
  )

  $path = Join-Path $Root $RelativePath

  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required path for ${Label}: $path"
  }

  return $path
}

function Stop-PortOwner {
  param(
    [int]$Port,
    [string]$Label
  )

  $logFile = Join-Path $Logs "port-kill-$Port.log"

  "Checking port $Port for $Label" |
    Tee-Object -FilePath $logFile -Append | Out-Host

  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

  if (-not $connections) {
    "PASS: Port $Port is free for $Label" |
      Tee-Object -FilePath $logFile -Append | Out-Host
    return
  }

  $pids = $connections |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -and $_ -ne $PID }

  foreach ($processId in $pids) {
    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue

    if (-not $proc) {
      "WARN: PID $processId not found anymore for port $Port." |
        Tee-Object -FilePath $logFile -Append | Out-Host
      continue
    }

    "KILL: Port $Port / $Label is used by PID=$processId Name=$($proc.ProcessName)" |
      Tee-Object -FilePath $logFile -Append | Out-Host

    Stop-Process -Id $processId -Force -ErrorAction Stop
    Start-Sleep -Milliseconds 800
  }

  $stillUsed = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

  if ($stillUsed) {
    "FAIL: Port $Port is still in use after kill attempt." |
      Tee-Object -FilePath $logFile -Append | Out-Host
    throw "Port $Port is still in use for $Label."
  }

  "PASS: Port $Port is now free for $Label" |
    Tee-Object -FilePath $logFile -Append | Out-Host
}

function SafeLogPath {
  param([string]$Name)
  return (Join-Path $Logs $Name).Replace("'", "''")
}

function Start-LiveWindow {
  param(
    [string]$Title,
    [string]$WorkingDir,
    [string]$Command
  )

  $safeTitle = $Title.Replace("'", "''")
  $safeDir = $WorkingDir.Replace("'", "''")

  $runner = @"
`$ErrorActionPreference = 'Stop'
`$Host.UI.RawUI.WindowTitle = '$safeTitle'
Set-Location -LiteralPath '$safeDir'
$Command
"@

  $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($runner))

  Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-EncodedCommand", $encoded
  )
}

function Invoke-LoggedCommand {
  param(
    [string]$LogName,
    [scriptblock]$CommandBlock
  )

  $logPath = Join-Path $Logs $LogName

  try {
    & $CommandBlock 2>&1 |
      Tee-Object -FilePath $logPath -Append |
      Out-Host
  } catch {
    "ERROR: $($_.Exception.Message)" |
      Tee-Object -FilePath $logPath -Append |
      Out-Host
    throw
  }
}

function Get-AdbTargetArg {
  param([string]$Serial)

  if ([string]::IsNullOrWhiteSpace($Serial)) {
    return ""
  }

  return "-s $Serial"
}

function Invoke-AdbSetup {
  param(
    [int]$DshPort,
    [int]$AppClientPort,
    [int]$AppPartnerPort,
    [int]$AppCaptainPort,
    [int]$AppFieldPort,
    [int]$ControlPanelPort
  )

  $adbMode = (Get-LocalEnv "ADB_MODE" "usb").ToLowerInvariant()
  $usbSerial = Get-LocalEnv "ADB_SERIAL" ""
  $wifiPort = Get-LocalEnv "ADB_WIFI_PORT" "5555"

  if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
    throw "adb not found in PATH."
  }

  $runtimeSerial = $usbSerial

  Write-RunLog "ADB mode: $adbMode"

  if ($adbMode -eq "wifi") {
    if ([string]::IsNullOrWhiteSpace($usbSerial)) {
      throw "ADB_MODE=wifi requires ADB_SERIAL in .env.local for the first USB handoff."
    }

    Invoke-LoggedCommand "adb-wifi-connect.log" {
      Write-Host "Checking USB device: $usbSerial"
      adb -s $usbSerial devices

      $a4 = & adb -s $usbSerial shell "ip -4 addr show wlan0 2>/dev/null || true" 2>$null
      $ip = ([regex]::Match(($a4 | Out-String), "inet\s+(\d{1,3}(?:\.\d{1,3}){3})\/")).Groups[1].Value

      if (-not $ip) {
        throw "No IPv4 on wlan0. تأكد أن الهاتف متصل بالواي فاي وأن USB debugging يعمل."
      }

      Write-Host "Phone Wi-Fi IP: $ip"
      Write-Host "Switching ADB to TCP port $wifiPort..."
      adb -s $usbSerial tcpip $wifiPort

      Start-Sleep -Milliseconds 900

      $wifiSerial = "$ip`:$wifiPort"
      Write-Host "Connecting to $wifiSerial..."
      adb connect $wifiSerial

      Start-Sleep -Milliseconds 500

      $dev = (adb devices) -join "`n"
      if ($dev -notmatch [regex]::Escape($wifiSerial)) {
        throw "Wi-Fi endpoint not listed in adb devices: $wifiSerial"
      }

      $script:AdbRuntimeSerial = $wifiSerial
      Write-Host "ADB Wi-Fi connected: $wifiSerial"
    }

    $runtimeSerial = $script:AdbRuntimeSerial
  } elseif ($adbMode -eq "usb") {
    Invoke-LoggedCommand "adb-usb-check.log" {
      adb devices
    }
  } else {
    throw "Unsupported ADB_MODE: $adbMode. Use usb or wifi."
  }

  if ([string]::IsNullOrWhiteSpace($runtimeSerial)) {
    $runtimeSerial = $usbSerial
  }

  $targetArg = Get-AdbTargetArg -Serial $runtimeSerial

  Invoke-LoggedCommand "adb-reverse.log" {
    Write-Host "Applying ADB reverse for serial: $runtimeSerial"

    if ([string]::IsNullOrWhiteSpace($targetArg)) {
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

function Wait-TcpPort {
  param(
    [int]$Port,
    [string]$Label,
    [int]$TimeoutSeconds = 90
  )

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

function Start-ScrcpyIfEnabled {
  param([string]$RuntimeSerial)

  $scrcpyEnabledFromEnv = (Get-LocalEnv "SCRCPY_ENABLED" "0") -eq "1"
  $withScrcpy = ($args -contains "-WithScrcpy") -or $scrcpyEnabledFromEnv
  $noScrcpy = $args -contains "-NoScrcpy"

  if ($noScrcpy -or -not $withScrcpy) {
    Write-RunLog "Scrcpy skipped."
    return
  }

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
    Start-LiveWindow "BThwani Scrcpy Device Mirror" $Root @"
& '$scrcpyPath' --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize 2>&1 | Tee-Object -FilePath '$scrcpyLog' -Append
"@
  } else {
    Start-LiveWindow "BThwani Scrcpy Device Mirror" $Root @"
& '$scrcpyPath' -s '$RuntimeSerial' --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize 2>&1 | Tee-Object -FilePath '$scrcpyLog' -Append
"@
  }
}

$EnvFile = Join-Path $Root ".env.local"
Import-RootEnv -Path $EnvFile

$DshPort = [int](Get-LocalEnv "DSH_API_PORT" "8080")
$DshBaseUrl = Get-LocalEnv "DSH_API_BASE_URL" "http://localhost:8080"
$DatabaseUrl = Get-LocalEnv "DATABASE_URL" "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"

$AppClientPort = [int](Get-LocalEnv "APP_CLIENT_PORT" "8081")
$AppPartnerPort = [int](Get-LocalEnv "APP_PARTNER_PORT" "8082")
$AppCaptainPort = [int](Get-LocalEnv "APP_CAPTAIN_PORT" "8083")
$AppFieldPort = [int](Get-LocalEnv "APP_FIELD_PORT" "8084")
$ControlPanelPort = [int](Get-LocalEnv "CONTROL_PANEL_PORT" "3000")

$AuthPort = [int](Get-LocalEnv "AUTH_API_PORT" "8085")
$WltPort = [int](Get-LocalEnv "WLT_API_PORT" "8090")
$WltDatabaseUrl = Get-LocalEnv "WLT_DATABASE_URL" "postgres://wlt_local:wlt_local_password@localhost:55433/wlt_local?sslmode=disable"

$MongoEnabledFromEnv = (Get-LocalEnv "MONGO_ENABLED" "0") -eq "1"
$WithMongo = ($args -contains "-WithMongo") -or $MongoEnabledFromEnv
$NoKillPorts = $args -contains "-NoKillPorts"
$ClearMetroOnce = $args -contains "-ClearMetroOnce"

$DshBackend = Assert-LocalPath "dsh\backend" "DSH backend"
$AppClientRuntime = Assert-LocalPath "app-client\runtime" "app-client runtime"
$AppPartnerRuntime = Assert-LocalPath "app-partner\runtime" "app-partner runtime"
$AppCaptainRuntime = Assert-LocalPath "app-captain\runtime" "app-captain runtime"
$AppFieldRuntime = Assert-LocalPath "app-field\runtime" "app-field runtime"
$ControlPanelRuntime = Assert-LocalPath "control-panel\runtime" "control-panel runtime"

Write-RunLog "Session started: $SessionId"
Write-RunLog "Evidence root: $RunRoot"

git --no-pager status --short | Out-File -Encoding utf8 (Join-Path $RunRoot "git-status-before.txt")
git --no-pager diff --check 2>&1 | Out-File -Encoding utf8 (Join-Path $RunRoot "git-diff-check-before.txt")

Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object {
    $_.LocalPort -in @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $ControlPanelPort, $AuthPort, $WltPort)
  } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess |
  Out-File -Encoding utf8 (Join-Path $RunRoot "ports-before.txt")

if (-not $NoKillPorts) {
  Stop-PortOwner -Port $DshPort -Label "DSH Go API"
  Stop-PortOwner -Port $AppClientPort -Label "app-client Expo"
  Stop-PortOwner -Port $AppPartnerPort -Label "app-partner Expo"
  Stop-PortOwner -Port $AppCaptainPort -Label "app-captain Expo"
  Stop-PortOwner -Port $AppFieldPort -Label "app-field Expo"
  Stop-PortOwner -Port $ControlPanelPort -Label "control-panel Next"
  Stop-PortOwner -Port $AuthPort -Label "Auth Go API"
  Stop-PortOwner -Port $WltPort -Label "WLT Go API"
} else {
  Write-RunLog "NoKillPorts enabled. Skipping port killing."
}

Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object {
    $_.LocalPort -in @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $ControlPanelPort, $AuthPort, $WltPort)
  } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess |
  Out-File -Encoding utf8 (Join-Path $RunRoot "ports-after-kill.txt")

@"
SESSION_ID=$SessionId
DSH_API_PORT=$DshPort
DSH_API_BASE_URL=$DshBaseUrl
APP_CLIENT_PORT=$AppClientPort
APP_PARTNER_PORT=$AppPartnerPort
APP_CAPTAIN_PORT=$AppCaptainPort
APP_FIELD_PORT=$AppFieldPort
CONTROL_PANEL_PORT=$ControlPanelPort
AUTH_API_PORT=$AuthPort
WLT_API_PORT=$WltPort
WITH_MONGO=$WithMongo
NO_KILL_PORTS=$NoKillPorts
NO_CLEAR=$NoClear
ADB_MODE=$(Get-LocalEnv "ADB_MODE" "usb")
SCRCPY_ENABLED=$(Get-LocalEnv "SCRCPY_ENABLED" "0")
"@ | Out-File -Encoding utf8 (Join-Path $RunRoot "effective-runtime-config.txt")

$dockerLog = SafeLogPath "docker-postgres.log"
$dockerPsLog = SafeLogPath "docker-postgres-ps.log"

Start-LiveWindow "BThwani Docker / Postgres" $Root @"
docker compose -f .\docker-compose.local.yml up -d 2>&1 | Tee-Object -FilePath '$dockerLog' -Append
docker compose -f .\docker-compose.local.yml ps 2>&1 | Tee-Object -FilePath '$dockerPsLog' -Append
"@

Start-Sleep -Seconds 4

if ($WithMongo) {
  $mongoContainer = Get-LocalEnv "MONGO_CONTAINER_NAME" "bthwani-mongo-local"
  $mongoPort = [int](Get-LocalEnv "MONGO_PORT" "27017")
  $mongoUser = Get-LocalEnv "MONGO_ROOT_USERNAME" "bthwani_local"
  $mongoPassword = Get-LocalEnv "MONGO_ROOT_PASSWORD" "bthwani_mongo_local_password"
  $mongoLog = SafeLogPath "mongo.log"

  Start-LiveWindow "BThwani MongoDB optional" $Root @"
`$existing = docker ps -a --filter "name=$mongoContainer" --format "{{.Names}}" | Select-Object -First 1
if (`$existing -eq "$mongoContainer") {
  docker start "$mongoContainer" 2>&1 | Tee-Object -FilePath '$mongoLog' -Append
} else {
  docker volume create bthwani-mongo-data 2>&1 | Tee-Object -FilePath '$mongoLog' -Append
  docker run -d --name "$mongoContainer" -p ${mongoPort}:27017 -e MONGO_INITDB_ROOT_USERNAME="$mongoUser" -e MONGO_INITDB_ROOT_PASSWORD="$mongoPassword" -v bthwani-mongo-data:/data/db mongo:7 2>&1 | Tee-Object -FilePath '$mongoLog' -Append
}
docker ps --filter "name=$mongoContainer" 2>&1 | Tee-Object -FilePath '$mongoLog' -Append
"@
}

$authLog = SafeLogPath "auth-service.log"
Start-LiveWindow "BThwani Auth Go API :$AuthPort" $DshBackend @"
`$env:AUTH_PORT = '$AuthPort'
`$env:DATABASE_URL = '$DatabaseUrl'
go run ./cmd/auth-service 2>&1 | Tee-Object -FilePath '$authLog' -Append
"@

Start-Sleep -Seconds 3

$goWltLog = SafeLogPath "wlt-api.log"
Start-LiveWindow "BThwani WLT Go API :$WltPort" "$Root\wlt\backend" @"
`$env:PORT = '$WltPort'
`$env:DATABASE_URL = '$WltDatabaseUrl'
`$env:WLT_AUTH_MODE = 'production'
`$env:WLT_AUTH_SERVICE_URL = 'http://localhost:$AuthPort'
`$env:WLT_CALLBACK_SECRET = 'dev-secret'
`$env:WLT_DSH_BASE_URL = '$DshBaseUrl'
go run ./cmd/wlt-api 2>&1 | Tee-Object -FilePath '$goWltLog' -Append
"@

Start-Sleep -Seconds 3

$goLog = SafeLogPath "go-api.log"
Start-LiveWindow "BThwani DSH Go API :$DshPort" $DshBackend @"
`$env:PORT = '$DshPort'
`$env:DATABASE_URL = '$DatabaseUrl'
`$env:DSH_AUTH_MODE = 'production'
`$env:DSH_AUTH_SERVICE_URL = 'http://localhost:$AuthPort'
go run ./cmd/dsh-api 2>&1 | Tee-Object -FilePath '$goLog' -Append
"@

Start-Sleep -Seconds 6

$AdbRuntimeSerial = Invoke-AdbSetup `
  -DshPort $DshPort `
  -AppClientPort $AppClientPort `
  -AppPartnerPort $AppPartnerPort `
  -AppCaptainPort $AppCaptainPort `
  -AppFieldPort $AppFieldPort `
  -ControlPanelPort $ControlPanelPort

Start-ScrcpyIfEnabled -RuntimeSerial $AdbRuntimeSerial

if ($ClearMetroOnce) {
  $metroCache = Join-Path $env:TEMP "metro-cache"
  Write-RunLog "ClearMetroOnce enabled. Cleaning Metro cache: $metroCache"

  if (Test-Path -LiteralPath $metroCache) {
    Remove-Item -LiteralPath $metroCache -Recurse -Force -ErrorAction SilentlyContinue
    Write-RunLog "Metro cache removed."
  } else {
    Write-RunLog "Metro cache not found — nothing to clean."
  }
}

$appClientLog = SafeLogPath "app-client.log"
$appPartnerLog = SafeLogPath "app-partner.log"
$appCaptainLog = SafeLogPath "app-captain.log"
$appFieldLog = SafeLogPath "app-field.log"
$controlPanelLog = SafeLogPath "control-panel.log"

Start-LiveWindow "BThwani app-client :$AppClientPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
`$env:EXPO_PUBLIC_WLT_DSH_API_BASE_URL = 'http://localhost:$WltPort'
pnpm --dir app-client/runtime exec expo start --dev-client --host localhost --port $AppClientPort 2>&1 | Tee-Object -FilePath '$appClientLog' -Append
"@

Wait-TcpPort -Port $AppClientPort -Label "app-client Metro"

Start-LiveWindow "BThwani app-partner :$AppPartnerPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
`$env:EXPO_PUBLIC_WLT_DSH_API_BASE_URL = 'http://localhost:$WltPort'
pnpm --dir app-partner/runtime exec expo start --dev-client --host localhost --port $AppPartnerPort 2>&1 | Tee-Object -FilePath '$appPartnerLog' -Append
"@

Wait-TcpPort -Port $AppPartnerPort -Label "app-partner Metro"

Start-LiveWindow "BThwani app-captain :$AppCaptainPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
`$env:EXPO_PUBLIC_WLT_DSH_API_BASE_URL = 'http://localhost:$WltPort'
pnpm --dir app-captain/runtime exec expo start --dev-client --host localhost --port $AppCaptainPort 2>&1 | Tee-Object -FilePath '$appCaptainLog' -Append
"@

Wait-TcpPort -Port $AppCaptainPort -Label "app-captain Metro"

Start-LiveWindow "BThwani app-field :$AppFieldPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
`$env:EXPO_PUBLIC_WLT_DSH_API_BASE_URL = 'http://localhost:$WltPort'
pnpm --dir app-field/runtime exec expo start --dev-client --host localhost --port $AppFieldPort 2>&1 | Tee-Object -FilePath '$appFieldLog' -Append
"@

Wait-TcpPort -Port $AppFieldPort -Label "app-field Metro"

Start-LiveWindow "BThwani control-panel :$ControlPanelPort" $Root @"
`$env:NEXT_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
`$env:NEXT_PUBLIC_WLT_DSH_API_BASE_URL = 'http://localhost:$WltPort'
pnpm --dir control-panel/runtime dev 2>&1 | Tee-Object -FilePath '$controlPanelLog' -Append
"@

@"
status: STARTED
session_id: $SessionId
repo: $Root
evidence_root: $RunRoot
handoff_zip: $RunRoot\$SessionId.zip

started_services:
- Docker / Postgres
- Auth Go API
- WLT Go API
- DSH Go API
- ADB setup + reverse
- Scrcpy if enabled
- app-client
- app-partner
- app-captain
- app-field
- control-panel

excluded_services:
- webapp
- website

optional_services:
- MongoDB: $WithMongo

adb_runtime_serial:
- $AdbRuntimeSerial

next_manual_steps:
1. افتح الهاتف عبر Scrcpy.
2. افتح control-panel على http://localhost:$ControlPanelPort
3. نفذ طلبًا حقيقيًا من app-client.
4. سجّل orderId.
5. تحقق من ظهوره في app-partner/app-captain/app-field/control-panel.
6. خذ screenshots.
7. لا تعتبر التجربة PASS بدون evidence/logs/screenshots.
"@ | Out-File -Encoding utf8 (Join-Path $RunRoot "SUMMARY.md")

$ZipPath = Join-Path $RunRoot "$SessionId.zip"
$zipItems = Get-ChildItem -LiteralPath $RunRoot -File |
  Where-Object { $_.Name -ne "$SessionId.zip" } |
  Select-Object -ExpandProperty FullName

if ($zipItems) {
  Compress-Archive -Path $zipItems -DestinationPath $ZipPath -Force
}

Write-Host ""
Write-Host "LOCAL LIVE TEST STARTED"
Write-Host "Session: $SessionId"
Write-Host "Evidence: $RunRoot"
Write-Host "ZIP: $ZipPath"
Write-Host "ADB Runtime Serial: $AdbRuntimeSerial"
Write-Host ""
Write-Host "ابدأ الآن تجربة طلب حقيقي واحد من app-client وتتبع نفس orderId في بقية الأسطح."
