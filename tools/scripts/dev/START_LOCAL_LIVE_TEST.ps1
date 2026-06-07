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
    [int]$ControlPanelPort,
    [int]$WebappPort,
    [int]$WebsitePort
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
    & adb @adbArgs reverse tcp:$WebappPort tcp:$WebappPort
    & adb @adbArgs reverse tcp:$WebsitePort tcp:$WebsitePort
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
$script:AdbRuntimeSerial = ""
Import-RootEnv -Path $EnvFile

$DshPort = [int](Get-LocalEnv "DSH_API_PORT" "8080")
$DshBaseUrl = Get-LocalEnv "DSH_API_BASE_URL" "http://localhost:8080"
$DatabaseUrl = Get-LocalEnv "DATABASE_URL" "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"

$AppClientPort = [int](Get-LocalEnv "APP_CLIENT_PORT" "8081")
$AppPartnerPort = [int](Get-LocalEnv "APP_PARTNER_PORT" "8082")
$AppCaptainPort = [int](Get-LocalEnv "APP_CAPTAIN_PORT" "8083")
$AppFieldPort = [int](Get-LocalEnv "APP_FIELD_PORT" "8084")
$ControlPanelPort = [int](Get-LocalEnv "CONTROL_PANEL_PORT" "3000")
$WebappPort = [int](Get-LocalEnv "WEBAPP_PORT" "3001")
$WebsitePort = [int](Get-LocalEnv "WEBSITE_PORT" "3002")

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
$WebappRuntime = Assert-LocalPath "webapp\runtime" "webapp runtime"
$WebsiteRuntime = Assert-LocalPath "website\runtime" "website runtime"

$RootCompose = Assert-LocalPath "docker-compose.local.yml" "root local compose"
$ComposeSelection = Resolve-ComposeSelection -Stack $Stack -Addons $Addons

Write-RunLog "Session started: $SessionId"
Write-RunLog "Evidence root: $RunRoot"
Write-RunLog "Stack: $Stack"
Write-RunLog "Addons: $Addons"

$forbiddenAutoKillPorts = @(55432, 55433, 27017, 6379)
$devKillPorts = @($DshPort, $AppClientPort, $AppPartnerPort, $AppCaptainPort, $AppFieldPort, $ControlPanelPort, $WebappPort, $WebsitePort)

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
  Stop-PortOwner -Port $WebappPort -Label "webapp Next"
  Stop-PortOwner -Port $WebsitePort -Label "website Next"
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
$AdbRuntimeSerial = Invoke-AdbSetup -DshPort $DshPort -AppClientPort $AppClientPort -AppPartnerPort $AppPartnerPort -AppCaptainPort $AppCaptainPort -AppFieldPort $AppFieldPort -ControlPanelPort $ControlPanelPort -WebappPort $WebappPort -WebsitePort $WebsitePort
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

$webappLog = SafeLogPath "webapp.log"
Start-LiveWindow "BThwani webapp :$WebappPort" $Root @"
`$env:NEXT_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir webapp/runtime dev --port $WebappPort 2>&1 | Tee-Object -FilePath '$webappLog' -Append
"@

$websiteLog = SafeLogPath "website.log"
Start-LiveWindow "BThwani website :$WebsitePort" $Root @"
`$env:NEXT_PUBLIC_DSH_API_BASE_URL = '$DshBaseUrl'
pnpm --dir website/runtime dev --port $WebsitePort 2>&1 | Tee-Object -FilePath '$websiteLog' -Append
"@

$SummaryText = @"
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
Write-Host "Stack: $Stack"
Write-Host "Addons: $Addons"
Write-Host ""
Write-Host "ابدأ الآن تجربة طلب حقيقي واحد من app-client وتتبع نفس orderId في بقية الأسطح."
