Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Target = "client"
$Fresh = $true
$ClearMetroOnce = $false
$NoScrcpy = $false

for ($i = 0; $i -lt $args.Count; $i++) {
  switch ($args[$i]) {
    "-Target" {
      if ($i + 1 -lt $args.Count) {
        $Target = $args[$i + 1].ToLowerInvariant()
        $i++
      }
    }
    "-KeepRunning" { $Fresh = $false }
    "-Fresh" { $Fresh = $true }
    "-ClearMetroOnce" { $ClearMetroOnce = $true }
    "-NoScrcpy" { $NoScrcpy = $true }
  }
}

$SessionId = "BROWSE_MODE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path $Root "tools\registry\runs\$SessionId"
$Logs = Join-Path $RunRoot "logs"
New-Item -ItemType Directory -Force -Path $RunRoot, $Logs | Out-Null

function Log($m) {
  $line = "[$(Get-Date -Format s)] $m"
  $line | Tee-Object -FilePath (Join-Path $RunRoot "browse-command-log.txt") -Append | Out-Host
}

function Load-Env {
  $envFile = Join-Path $Root ".env.local"
  if (-not (Test-Path -LiteralPath $envFile)) {
    Log "WARN: .env.local not found. Defaults will be used."
    return
  }

  Get-Content -LiteralPath $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#") -or $line -notmatch "=") { return }

    $parts = $line -split "=", 2
    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"').Trim("'")

    if ($name) {
      [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

function EnvOr($name, $default) {
  $v = [Environment]::GetEnvironmentVariable($name, "Process")
  if ([string]::IsNullOrWhiteSpace($v)) { return $default }
  return $v
}

function Stop-PortOwner {
  param([int]$Port, [string]$Label)

  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $connections) {
    Log "PORT FREE: $Label $Port"
    return
  }

  $pids = $connections |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -and $_ -ne $PID }

  foreach ($processId in $pids) {
    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($proc) {
      Log "KILL PORT: $Label $Port PID=$processId NAME=$($proc.ProcessName)"
      Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
  }

  Start-Sleep -Seconds 1
}

function Wait-Port {
  param([int]$Port, [string]$Label, [int]$TimeoutSeconds = 120)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  Log "WAIT: $Label on port $Port"

  while ((Get-Date) -lt $deadline) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
      Log "READY: $Label on port $Port"
      return
    }
    Start-Sleep -Seconds 2
  }

  throw "Timeout waiting for $Label on port $Port"
}

function Start-Window {
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

  Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-EncodedCommand", $encoded
  )
}

function Setup-Adb {
  if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
    throw "adb not found in PATH"
  }

  $adbMode = (EnvOr "ADB_MODE" "wifi").ToLowerInvariant()
  $usbSerial = EnvOr "ADB_SERIAL" ""
  $wifiPort = EnvOr "ADB_WIFI_PORT" "5555"

  Log "ADB_MODE=$adbMode"

  if ($adbMode -eq "wifi") {
    if ([string]::IsNullOrWhiteSpace($usbSerial)) {
      throw "ADB_MODE=wifi requires ADB_SERIAL in .env.local"
    }

    adb -s $usbSerial devices | Tee-Object -FilePath (Join-Path $Logs "adb-devices-usb.txt") -Append | Out-Host

    $a4 = & adb -s $usbSerial shell "ip -4 addr show wlan0 2>/dev/null || true" 2>$null
    $ip = ([regex]::Match(($a4 | Out-String), "inet\s+(\d{1,3}(?:\.\d{1,3}){3})\/")).Groups[1].Value

    if (-not $ip) {
      throw "No IPv4 on wlan0. تأكد أن الهاتف متصل بالواي فاي."
    }

    $wifiSerial = "$ip`:$wifiPort"
    Log "ADB WIFI IP=$wifiSerial"

    adb -s $usbSerial tcpip $wifiPort | Tee-Object -FilePath (Join-Path $Logs "adb-wifi.txt") -Append | Out-Host
    Start-Sleep -Milliseconds 900
    adb connect $wifiSerial | Tee-Object -FilePath (Join-Path $Logs "adb-wifi.txt") -Append | Out-Host
    Start-Sleep -Milliseconds 600

    $devices = (adb devices) -join "`n"
    if ($devices -notmatch [regex]::Escape($wifiSerial)) {
      throw "Wi-Fi ADB endpoint not listed: $wifiSerial"
    }

    return $wifiSerial
  }

  adb devices | Tee-Object -FilePath (Join-Path $Logs "adb-devices-usb.txt") -Append | Out-Host

  if (-not [string]::IsNullOrWhiteSpace($usbSerial)) {
    return $usbSerial
  }

  return ""
}

function Reverse-Ports {
  param([string]$Serial, [int[]]$Ports)

  foreach ($p in $Ports) {
    if ([string]::IsNullOrWhiteSpace($Serial)) {
      adb reverse tcp:$p tcp:$p | Out-Host
    } else {
      adb -s $Serial reverse tcp:$p tcp:$p | Out-Host
    }
  }

  if ([string]::IsNullOrWhiteSpace($Serial)) {
    adb reverse --list | Tee-Object -FilePath (Join-Path $Logs "adb-reverse.txt") -Append | Out-Host
  } else {
    adb -s $Serial reverse --list | Tee-Object -FilePath (Join-Path $Logs "adb-reverse.txt") -Append | Out-Host
  }
}

function Start-Scrcpy {
  param([string]$Serial)

  if ($NoScrcpy) {
    Log "Scrcpy skipped by -NoScrcpy"
    return
  }

  $enabled = (EnvOr "SCRCPY_ENABLED" "1") -eq "1"
  if (-not $enabled) {
    Log "Scrcpy disabled by SCRCPY_ENABLED=0"
    return
  }

  $scrcpy = EnvOr "SCRCPY_PATH" "C:\Android\scrcpy\scrcpy-win64-v2.4\scrcpy.exe"
  if (-not (Test-Path -LiteralPath $scrcpy)) {
    Log "WARN: scrcpy not found: $scrcpy"
    return
  }

  $bitRate = EnvOr "SCRCPY_BIT_RATE" "8M"
  $maxFps = EnvOr "SCRCPY_MAX_FPS" "30"
  $maxSize = EnvOr "SCRCPY_MAX_SIZE" "1280"

  if ([string]::IsNullOrWhiteSpace($Serial)) {
    Start-Window "BThwani Scrcpy" $Root @"
& '$scrcpy' --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize
"@
  } else {
    Start-Window "BThwani Scrcpy" $Root @"
& '$scrcpy' -s '$Serial' --video-bit-rate $bitRate --max-fps $maxFps --max-size $maxSize
"@
  }
}

Load-Env

$DshPort = [int](EnvOr "DSH_API_PORT" "8080")
$ControlPanelPort = [int](EnvOr "CONTROL_PANEL_PORT" "3000")
$ExpoHost = EnvOr "EXPO_HOST" "localhost"

$apps = @(
  @{ Key = "client";  Name = "app-client";  Runtime = "app-client/runtime";  Port = [int](EnvOr "APP_CLIENT_PORT" "8081") },
  @{ Key = "partner"; Name = "app-partner"; Runtime = "app-partner/runtime"; Port = [int](EnvOr "APP_PARTNER_PORT" "8082") },
  @{ Key = "captain"; Name = "app-captain"; Runtime = "app-captain/runtime"; Port = [int](EnvOr "APP_CAPTAIN_PORT" "8083") },
  @{ Key = "field";   Name = "app-field";   Runtime = "app-field/runtime";   Port = [int](EnvOr "APP_FIELD_PORT" "8084") }
)

if ($Target -eq "all") {
  $selected = $apps
} else {
  $selected = @($apps | Where-Object { $_.Key -eq $Target })
}

if (-not $selected -or $selected.Count -eq 0) {
  throw "Unknown -Target '$Target'. Use: client, partner, captain, field, all"
}

if ($ClearMetroOnce) {
  $metroCache = Join-Path $env:TEMP "metro-cache"
  Log "ClearMetroOnce: $metroCache"
  if (Test-Path -LiteralPath $metroCache) {
    Remove-Item -LiteralPath $metroCache -Recurse -Force -ErrorAction SilentlyContinue
  }
}

$adbSerial = Setup-Adb

$reversePorts = @($DshPort, $ControlPanelPort)
foreach ($a in $selected) { $reversePorts += [int]$a.Port }
Reverse-Ports -Serial $adbSerial -Ports ($reversePorts | Select-Object -Unique)

Start-Scrcpy -Serial $adbSerial

foreach ($app in $selected) {
  $runtimePath = Join-Path $Root $app.Runtime
  if (-not (Test-Path -LiteralPath $runtimePath)) {
    throw "Missing runtime path: $runtimePath"
  }

  if ($Fresh) {
    Stop-PortOwner -Port ([int]$app.Port) -Label $app.Name
  }

  $logPath = Join-Path $Logs "$($app.Name)-expo-open.log"
  $name = $app.Name
  $port = [int]$app.Port
  $runtime = $app.Runtime

  Log "START + OPEN ANDROID: $name port=$port host=$ExpoHost"

  Start-Window "BThwani OPEN $name :$port" $Root @"
`$env:EXPO_PUBLIC_DSH_API_BASE_URL = 'http://localhost:$DshPort'
pnpm --dir $runtime exec expo start --dev-client --host $ExpoHost --port $port --android 2>&1 | Tee-Object -FilePath '$logPath' -Append
"@

  Wait-Port -Port $port -Label "$name Metro" -TimeoutSeconds 120

  Log "WAITING 12s for Android dev client launch: $name"
  Start-Sleep -Seconds 12
}

@"
status: STARTED_FOR_BROWSING
session_id: $SessionId
target: $Target
repo: $Root
adb_runtime_serial: $adbSerial
expo_host: $ExpoHost
selected_apps:
$($selected | ForEach-Object { "- $($_.Name): $($_.Port)" } | Out-String)

notes:
- This script is for opening/browsing only.
- It starts Metro with --android to launch the installed Expo Dev Client.
- If the phone app still does not open, the likely cause is missing/outdated dev client build for that app.
"@ | Out-File -Encoding utf8 (Join-Path $RunRoot "SUMMARY.md")

Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath (Join-Path $RunRoot "$SessionId.zip") -Force

Write-Host ""
Write-Host "BROWSE MODE STARTED"
Write-Host "Target: $Target"
Write-Host "Evidence: $RunRoot"
Write-Host ""
Write-Host "إذا بقيت الشاشة في Metro فقط، افتح نافذة التطبيق وشاهد هل ظهرت رسالة dev client missing أو package not installed."
