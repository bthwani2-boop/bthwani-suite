# BThwani Local Live Testing — Final Execution Guide

**Version:** 2026-06-07.1
**Target repo:** `C:\bthwani-suite`
**Primary script:** `C:\bthwani-suite\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1`
**Primary env file:** `C:\bthwani-suite\.env.local`
**Docker entrypoint:** `C:\bthwani-suite\docker-compose.local.yml`

---

## 0) Final decision

Use **one Docker entrypoint** for humans and scripts:

```text
C:\bthwani-suite\docker-compose.local.yml
```

Keep service-owned compose files in their service folders:

```text
C:\bthwani-suite\dsh\backend\docker-compose.local.yml
C:\bthwani-suite\wlt\backend\docker-compose.local.yml
```

Create shared optional local addons now:

```text
C:\bthwani-suite\infra\local\mongo\docker-compose.local.yml
C:\bthwani-suite\infra\local\redis\docker-compose.local.yml
C:\bthwani-suite\infra\local\README.md
```

The startup script must use **only the root compose entrypoint** and select what runs through:

```text
-Stack dsh|wlt|all|none
-Addons none|mongo|redis|all
```

Default:

```text
-Stack all -Addons none
```

Do not run `webapp` or `website` in this live-test script.

---

## 1) Local env decision

Keep the actual local env file here:

```text
C:\bthwani-suite\.env.local
```

Do **not** move the actual `.env.local` to `infra/local` because:

1. It is the root runtime entrypoint for Docker Compose and the PowerShell orchestrator.
2. The startup script and root compose can consistently use `--env-file .\.env.local`.
3. Putting the active env under `infra/local` makes frontend/runtime env discovery less obvious.
4. `infra/local` should own shared optional addon definitions, not become the active secrets location.

Allowed inside `infra/local`:

```text
README.md
*.example
non-secret templates
addon-specific config/init/seed later if needed
```

Forbidden inside Git-tracked files:

```text
production secrets
real provider tokens
real payment keys
private API keys
JWT secrets
admin tokens
```

---

## 2) Update `C:\bthwani-suite\.env.local`

Create or update the file locally only:

```env
# BThwani local live testing only
BTHWANI_ENV=local
BTHWANI_LOCAL_LIVE_TEST=1

# DSH Go API
DSH_API_PORT=8080
DSH_API_BASE_URL=http://localhost:8080
DATABASE_URL=postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable

# Docker / DSH Postgres
POSTGRES_DB=dsh_local
POSTGRES_USER=dsh_local
POSTGRES_PASSWORD=dsh_local_password
POSTGRES_PORT=55432

# Docker / WLT Postgres
WLT_POSTGRES_DB=wlt_local
WLT_POSTGRES_USER=wlt_local
WLT_POSTGRES_PASSWORD=wlt_local_password
WLT_POSTGRES_PORT=55433

# Optional Mongo local addon
MONGO_PORT=27017
MONGO_ROOT_USERNAME=bthwani_local
MONGO_ROOT_PASSWORD=bthwani_mongo_local_password
MONGO_URL=mongodb://bthwani_local:bthwani_mongo_local_password@localhost:27017/?authSource=admin

# Optional Redis local addon
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# Mobile apps / Expo
EXPO_PUBLIC_DSH_API_BASE_URL=http://localhost:8080
EXPO_HOST=lan
EXPO_CLEAR=0

# Control Panel
NEXT_PUBLIC_DSH_API_BASE_URL=http://localhost:8080

# Ports
APP_CLIENT_PORT=8081
APP_PARTNER_PORT=8082
APP_CAPTAIN_PORT=8083
APP_FIELD_PORT=8084
CONTROL_PANEL_PORT=3000

# ADB mode: usb or wifi
ADB_MODE=wifi
ADB_SERIAL=R58NC2AFCVF
ADB_WIFI_PORT=5555

# Optional Scrcpy
SCRCPY_ENABLED=1
SCRCPY_PATH=C:\Android\scrcpy\scrcpy-win64-v2.4\scrcpy.exe
SCRCPY_BIT_RATE=8M
SCRCPY_MAX_FPS=30
SCRCPY_MAX_SIZE=1280
```

---

## 3) Update `C:\bthwani-suite\docker-compose.local.yml`

Replace/update the root compose as follows:

```yaml
# BTHWANI_MANAGED_LOCAL_COMPOSE: ROOT_ORCHESTRATOR
# Purpose: the only local Docker entrypoint for scripts and humans.
# Scope: include service-owned local dependency stacks and shared optional local addons.
# Boundaries:
# - DSH-owned dependencies remain in dsh/backend/docker-compose.local.yml.
# - WLT-owned dependencies remain in wlt/backend/docker-compose.local.yml.
# - Shared optional addons live under infra/local and are activated through profiles.
# - Do not move service-owned migrations/seeds/business DB ownership into this root file.

name: bthwani-suite-local

include:
  - ./dsh/backend/docker-compose.local.yml
  - ./wlt/backend/docker-compose.local.yml
  - ./infra/local/mongo/docker-compose.local.yml
  - ./infra/local/redis/docker-compose.local.yml
```

---

## 4) Create `C:\bthwani-suite\infra\local\README.md`

```md
# BThwani Local Infra Addons

This folder owns shared optional local-only infrastructure addons.

## Ownership rules

- DSH service-owned dependencies remain under `dsh/backend`.
- WLT service-owned dependencies remain under `wlt/backend`.
- Root `docker-compose.local.yml` is the only Docker entrypoint for scripts and humans.
- This folder is only for shared optional addons such as MongoDB, Redis/Valkey, Mailpit, MinIO, or local observability.
- Do not move DSH/WLT Postgres, migrations, or seeds here.
- Do not store production secrets here.

## Current addons

```text
mongo
redis
```

## Activation

Addons are activated only through Docker Compose profiles from the root compose entrypoint.

Examples:

```powershell
docker compose --env-file .\.env.local -f .\docker-compose.local.yml --profile mongo up -d mongo
docker compose --env-file .\.env.local -f .\docker-compose.local.yml --profile redis up -d redis
```
```

---

## 5) Create `C:\bthwani-suite\infra\local\mongo\docker-compose.local.yml`

```yaml
# BTHWANI_MANAGED_LOCAL_COMPOSE: MONGO_SHARED_LOCAL_ADDON
# Purpose: optional local MongoDB addon.
# Boundary: not owned by DSH or WLT unless a future slice assigns ownership with evidence.
# Activation: root compose with profile `mongo` only.

services:
  mongo:
    profiles: ["mongo"]
    image: mongo:7
    container_name: bthwani-mongo-local
    ports:
      - "${MONGO_PORT:-27017}:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME:-bthwani_local}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-bthwani_mongo_local_password}
    volumes:
      - bthwani-mongo-data:/data/db
    healthcheck:
      test: ["CMD-SHELL", "mongosh --quiet --eval \"db.adminCommand('ping').ok\" || exit 1"]
      interval: 5s
      timeout: 5s
      retries: 20

volumes:
  bthwani-mongo-data:
```

---

## 6) Create `C:\bthwani-suite\infra\local\redis\docker-compose.local.yml`

```yaml
# BTHWANI_MANAGED_LOCAL_COMPOSE: REDIS_SHARED_LOCAL_ADDON
# Purpose: optional local Redis addon.
# Boundary: not owned by DSH or WLT unless a future slice assigns ownership with evidence.
# Activation: root compose with profile `redis` only.

services:
  redis:
    profiles: ["redis"]
    image: redis:7-alpine
    container_name: bthwani-redis-local
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - bthwani-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 20

volumes:
  bthwani-redis-data:
```

---

## 7) Replace `C:\bthwani-suite\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1`

```powershell
param(
  [ValidateSet("dsh", "wlt", "all", "none")]
  [string]$Stack = "all",

  [ValidateSet("none", "mongo", "redis", "all")]
  [string]$Addons = "none",

  [switch]$ClearMetroOnce,
  [switch]$NoKillPorts,
  [switch]$WithScrcpy,
  [switch]$NoScrcpy
)

Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

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

    if ((($value.StartsWith('"') -and $value.EndsWith('"'))) -or (($value.StartsWith("'") -and $value.EndsWith("'")))) {
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
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required path for ${Label}: $path"
  }
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
  Start-Process powershell.exe -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encoded)
}

function Invoke-LoggedCommand {
  param([string]$LogName, [scriptblock]$CommandBlock)
  $logPath = Join-Path $Logs $LogName
  try {
    & $CommandBlock 2>&1 | Tee-Object -FilePath $logPath -Append | Out-Host
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
    "KILL: Port $Port / $Label is used by PID=$processId Name=$($proc.ProcessName)" | Tee-Object -FilePath $logFile -Append | Out-Host
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

  if (-not (Get-Command adb -ErrorAction SilentlyContinue)) { throw "adb not found in PATH." }

  $runtimeSerial = $usbSerial
  Write-RunLog "ADB mode: $adbMode"

  if ($adbMode -eq "wifi") {
    if ([string]::IsNullOrWhiteSpace($usbSerial)) { throw "ADB_MODE=wifi requires ADB_SERIAL in .env.local." }

    Invoke-LoggedCommand "adb-wifi-connect.log" {
      Write-Host "Checking USB device: $usbSerial"
      adb -s $usbSerial devices

      $a4 = & adb -s $usbSerial shell "ip -4 addr show wlan0 2>/dev/null || true" 2>$null
      $ip = ([regex]::Match(($a4 | Out-String), "inet\s+(\d{1,3}(?:\.\d{1,3}){3})\/")).Groups[1].Value
      if (-not $ip) { throw "No IPv4 on wlan0. تأكد أن الهاتف متصل بالواي فاي وأن USB debugging يعمل." }

      Write-Host "Phone Wi-Fi IP: $ip"
      Write-Host "Switching ADB to TCP port $wifiPort..."
      adb -s $usbSerial tcpip $wifiPort
      Start-Sleep -Milliseconds 900

      $wifiSerial = "$ip`:$wifiPort"
      Write-Host "Connecting to $wifiSerial..."
      adb connect $wifiSerial
      Start-Sleep -Milliseconds 500

      $dev = (adb devices) -join "`n"
      if ($dev -notmatch [regex]::Escape($wifiSerial)) { throw "Wi-Fi endpoint not listed in adb devices: $wifiSerial" }

      $script:AdbRuntimeSerial = $wifiSerial
      Write-Host "ADB Wi-Fi connected: $wifiSerial"
    }

    $runtimeSerial = $script:AdbRuntimeSerial
  } elseif ($adbMode -eq "usb") {
    Invoke-LoggedCommand "adb-usb-check.log" { adb devices }
  } else {
    throw "Unsupported ADB_MODE: $adbMode. Use usb or wifi."
  }

  if ([string]::IsNullOrWhiteSpace($runtimeSerial)) { $runtimeSerial = $usbSerial }

  Invoke-LoggedCommand "adb-reverse.log" {
    Write-Host "Applying ADB reverse for serial: $runtimeSerial"
    $adbArgs = @()
    if (-not [string]::IsNullOrWhiteSpace($runtimeSerial)) { $adbArgs = @("-s", $runtimeSerial) }

    & adb @adbArgs reverse tcp:$DshPort tcp:$DshPort
    & adb @adbArgs reverse tcp:$AppClientPort tcp:$AppClientPort
    & adb @adbArgs reverse tcp:$AppPartnerPort tcp:$AppPartnerPort
    & adb @adbArgs reverse tcp:$AppCaptainPort tcp:$AppCaptainPort
    & adb @adbArgs reverse tcp:$AppFieldPort tcp:$AppFieldPort
    & adb @adbArgs reverse tcp:$ControlPanelPort tcp:$ControlPanelPort
    & adb @adbArgs reverse --list
  }

  return $runtimeSerial
}

function Start-ScrcpyIfEnabled {
  param([string]$RuntimeSerial)

  $scrcpyEnabledFromEnv = (Get-LocalEnv "SCRCPY_ENABLED" "0") -eq "1"
  $useScrcpy = $WithScrcpy -or $scrcpyEnabledFromEnv
  if ($NoScrcpy -or -not $useScrcpy) {
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

  $serialPart = ""
  if (-not [string]::IsNullOrWhiteSpace($RuntimeSerial)) { $serialPart = "-s '$RuntimeSerial'" }

  Start-LiveWindow "BThwani Scrcpy Device Mirror" $Root @"
& '$scrcpyPath' $serialPart --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize 2>&1 | Tee-Object -FilePath '$scrcpyLog' -Append
"@
}

function Resolve-ComposeSelection {
  param([string]$Stack, [string]$Addons)

  $profiles = @()
  $targets = @()
  $expected = @()

  switch ($Stack) {
    "dsh"  { $targets += "dsh-postgres"; $expected += "bthwani-dsh-postgres-local" }
    "wlt"  { $targets += "wlt-postgres"; $expected += "bthwani-wlt-postgres-local" }
    "all"  { $targets += "dsh-postgres"; $targets += "wlt-postgres"; $expected += "bthwani-dsh-postgres-local"; $expected += "bthwani-wlt-postgres-local" }
    "none" { }
    default { throw "Unsupported Stack: $Stack" }
  }

  switch ($Addons) {
    "none"  { }
    "mongo" { $profiles += "mongo"; $targets += "mongo"; $expected += "bthwani-mongo-local" }
    "redis" { $profiles += "redis"; $targets += "redis"; $expected += "bthwani-redis-local" }
    "all"   { $profiles += "mongo"; $profiles += "redis"; $targets += "mongo"; $targets += "redis"; $expected += "bthwani-mongo-local"; $expected += "bthwani-redis-local" }
    default { throw "Unsupported Addons: $Addons" }
  }

  return [pscustomobject]@{
    Profiles = $profiles
    Targets = $targets
    ExpectedContainers = $expected
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

$ExpoHost = Get-LocalEnv "EXPO_HOST" "lan"
$ExpoClear = (Get-LocalEnv "EXPO_CLEAR" "0") -eq "1"
$clearArg = ""
if ($ExpoClear) { $clearArg = " --clear" }

$DshBackend = Assert-LocalPath "dsh\backend" "DSH backend"
$AppClientRuntime = Assert-LocalPath "app-client\runtime" "app-client runtime"
$AppPartnerRuntime = Assert-LocalPath "app-partner\runtime" "app-partner runtime"
$AppCaptainRuntime = Assert-LocalPath "app-captain\runtime" "app-captain runtime"
$AppFieldRuntime = Assert-LocalPath "app-field\runtime" "app-field runtime"
$ControlPanelRuntime = Assert-LocalPath "control-panel\runtime" "control-panel runtime"

$RootCompose = Assert-LocalPath "docker-compose.local.yml" "root local compose"
$ComposeSelection = Resolve-ComposeSelection -Stack $Stack -Addons $Addons

Write-RunLog "Session started: $SessionId"
Write-RunLog "Evidence root: $RunRoot"
Write-RunLog "Stack: $Stack"
Write-RunLog "Addons: $Addons"

$forbiddenAutoKillPorts = @(55432, 55433, 27017, 6379)
$devKillPorts = @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $ControlPanelPort)

if ($devKillPorts | Where-Object { $forbiddenAutoKillPorts -contains $_ }) {
  throw "Dev kill ports overlap with protected Docker ports. Review .env.local."
}

git --no-pager status --short | Out-File -Encoding utf8 (Join-Path $RunRoot "git-status-before.txt")
git --no-pager diff --check 2>&1 | Out-File -Encoding utf8 (Join-Path $RunRoot "git-diff-check-before.txt")

Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in $devKillPorts } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess |
  Out-File -Encoding utf8 (Join-Path $RunRoot "ports-before.txt")

if (-not $NoKillPorts) {
  Stop-PortOwner -Port $DshPort -Label "DSH Go API"
  Stop-PortOwner -Port $AppClientPort -Label "app-client Expo"
  Stop-PortOwner -Port $AppPartnerPort -Label "app-partner Expo"
  Stop-PortOwner -Port $AppCaptainPort -Label "app-captain Expo"
  Stop-PortOwner -Port $AppFieldPort -Label "app-field Expo"
  Stop-PortOwner -Port $ControlPanelPort -Label "control-panel Next"
} else {
  Write-RunLog "NoKillPorts enabled. Skipping port killing."
}

Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in $devKillPorts } |
  Select-Object LocalAddress, LocalPort, State, OwningProcess |
  Out-File -Encoding utf8 (Join-Path $RunRoot "ports-after-kill.txt")

@"
SESSION_ID=$SessionId
STACK_MODE=$Stack
ADDONS_MODE=$Addons
COMPOSE_ENTRYPOINT=$RootCompose
COMPOSE_PROFILES=$($ComposeSelection.Profiles -join ',')
COMPOSE_TARGETS=$($ComposeSelection.Targets -join ',')
EXPECTED_CONTAINERS=$($ComposeSelection.ExpectedContainers -join ',')
DSH_API_PORT=$DshPort
DSH_API_BASE_URL=$DshBaseUrl
APP_CLIENT_PORT=$AppClientPort
APP_PARTNER_PORT=$AppPartnerPort
APP_CAPTAIN_PORT=$AppCaptainPort
APP_FIELD_PORT=$AppFieldPort
CONTROL_PANEL_PORT=$ControlPanelPort
EXPO_HOST=$ExpoHost
EXPO_CLEAR=$ExpoClear
NO_KILL_PORTS=$NoKillPorts
ADB_MODE=$(Get-LocalEnv "ADB_MODE" "usb")
SCRCPY_ENABLED=$(Get-LocalEnv "SCRCPY_ENABLED" "0")
"@ | Out-File -Encoding utf8 (Join-Path $RunRoot "effective-runtime-config.txt")

$dockerLog = SafeLogPath "docker-compose.log"
$dockerPsLog = SafeLogPath "docker-compose-ps.log"

if ($ComposeSelection.Targets.Count -gt 0) {
  $profileArgsText = ""
  foreach ($profile in $ComposeSelection.Profiles) { $profileArgsText += " --profile $profile" }
  $targetText = ($ComposeSelection.Targets -join " ")

  Start-LiveWindow "BThwani Docker / Local Stack" $Root @"
docker compose --env-file .\.env.local -f .\docker-compose.local.yml$profileArgsText up -d $targetText 2>&1 | Tee-Object -FilePath '$dockerLog' -Append
docker compose --env-file .\.env.local -f .\docker-compose.local.yml$profileArgsText ps 2>&1 | Tee-Object -FilePath '$dockerPsLog' -Append
"@

  Start-Sleep -Seconds 5
} else {
  Write-RunLog "Stack/Addons selected no Docker targets. Skipping docker compose."
}

$goLog = SafeLogPath "go-api.log"
Start-LiveWindow "BThwani DSH Go API :$DshPort" $DshBackend @"
`$env:PORT = '$DshPort'
`$env:DATABASE_URL = '$DatabaseUrl'
go run ./cmd/dsh-api 2>&1 | Tee-Object -FilePath '$goLog' -Append
"@

Start-Sleep -Seconds 4
$AdbRuntimeSerial = Invoke-AdbSetup -DshPort $DshPort -AppClientPort $AppClientPort -AppPartnerPort $AppPartnerPort -AppCaptainPort $AppCaptainPort -AppFieldPort $AppFieldPort -ControlPanelPort $ControlPanelPort
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
pnpm --dir app-client/runtime exec expo start --dev-client --host $ExpoHost --port $AppClientPort$clearArg 2>&1 | Tee-Object -FilePath '$appClientLog' -Append
"@
Wait-TcpPort -Port $AppClientPort -Label "app-client Metro"

Start-LiveWindow "BThwani app-partner :$AppPartnerPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-partner/runtime exec expo start --dev-client --host $ExpoHost --port $AppPartnerPort$clearArg 2>&1 | Tee-Object -FilePath '$appPartnerLog' -Append
"@
Wait-TcpPort -Port $AppPartnerPort -Label "app-partner Metro"

Start-LiveWindow "BThwani app-captain :$AppCaptainPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-captain/runtime exec expo start --dev-client --host $ExpoHost --port $AppCaptainPort$clearArg 2>&1 | Tee-Object -FilePath '$appCaptainLog' -Append
"@
Wait-TcpPort -Port $AppCaptainPort -Label "app-captain Metro"

Start-LiveWindow "BThwani app-field :$AppFieldPort" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir app-field/runtime exec expo start --dev-client --host $ExpoHost --port $AppFieldPort$clearArg 2>&1 | Tee-Object -FilePath '$appFieldLog' -Append
"@
Wait-TcpPort -Port $AppFieldPort -Label "app-field Metro"

Start-LiveWindow "BThwani control-panel :$ControlPanelPort" $Root @"
`$env:NEXT_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir control-panel/runtime dev 2>&1 | Tee-Object -FilePath '$controlPanelLog' -Append
"@

@"
status: STARTED
session_id: $SessionId
repo: $Root
evidence_root: $RunRoot
handoff_zip: $RunRoot\$SessionId.zip
stack_mode: $Stack
addons_mode: $Addons
compose_entrypoint: $RootCompose
compose_profiles: $($ComposeSelection.Profiles -join ',')
compose_targets: $($ComposeSelection.Targets -join ',')
expected_containers: $($ComposeSelection.ExpectedContainers -join ',')
adb_runtime_serial: $AdbRuntimeSerial

started_runtime:
- Docker via root compose according to Stack/Addons selection
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
$zipItems = Get-ChildItem -LiteralPath $RunRoot -File | Where-Object { $_.Name -ne "$SessionId.zip" } | Select-Object -ExpandProperty FullName
if ($zipItems) { Compress-Archive -Path $zipItems -DestinationPath $ZipPath -Force }

Write-Host ""
Write-Host "LOCAL LIVE TEST STARTED"
Write-Host "Session: $SessionId"
Write-Host "Evidence: $RunRoot"
Write-Host "ZIP: $ZipPath"
Write-Host "ADB Runtime Serial: $AdbRuntimeSerial"
Write-Host "Stack: $Stack"
Write-Host "Addons: $Addons"
Write-Host ""
Write-Host "ابدأ الآن تجربة طلب حقيقي واحد من app-client وتتبع نفس orderId في بقية الأسطح."
```

---

## 8) Run commands

Default full local live test without Mongo/Redis:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -ExecutionPolicy Bypass -File ".\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1"
```

DSH only:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -ExecutionPolicy Bypass -File ".\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1" -Stack dsh
```

Full with Mongo:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -ExecutionPolicy Bypass -File ".\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1" -Stack all -Addons mongo
```

Full with Redis:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -ExecutionPolicy Bypass -File ".\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1" -Stack all -Addons redis
```

Full with Mongo + Redis:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -ExecutionPolicy Bypass -File ".\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1" -Stack all -Addons all
```

Clean Metro cache once, then start without per-app `--clear` unless `EXPO_CLEAR=1`:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -ExecutionPolicy Bypass -File ".\tools\scripts\dev\START_LOCAL_LIVE_TEST.ps1" -ClearMetroOnce
```

---

## 9) Verification after editing

Run:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
git --no-pager status --short
```

Then run the live test and verify:

```text
1) Docker window uses root compose only.
2) Stack/Addons are shown in the main console and SUMMARY.md.
3) DSH/WLT/Mongo/Redis containers match selected Stack/Addons.
4) ADB reverse includes 8080, 8081, 8082, 8083, 8084, 3000.
5) Expo apps start sequentially: app-client → app-partner → app-captain → app-field.
6) Control Panel starts after the four Metro ports are ready.
7) webapp and website are not started.
8) Evidence ZIP is created under tools\registry\runs\{SESSION_ID}\{SESSION_ID}.zip.
```

---

## 10) Final operating rule

```text
Use root compose only as Docker entrypoint.
Keep service ownership in DSH/WLT compose files.
Create infra/local for shared optional addons now.
Keep active .env.local at repo root.
Run mobile apps sequentially.
Do not use per-app --clear daily.
Do not run webapp/website in this live test script.
Do not claim 100% closure without runtime evidence, logs, screenshots, orderId trace, and Git evidence.
```
