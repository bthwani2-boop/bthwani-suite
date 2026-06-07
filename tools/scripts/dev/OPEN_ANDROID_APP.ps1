param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("client", "partner", "captain", "field")]
  [string]$Target,

  [switch]$ClearMetroOnce
)

Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$Root = "C:\bthwani-suite"

function Write-RunLog {
  param([string]$Message)
  Write-Host "[$(Get-Date -Format s)] $Message"
}

function Import-RootEnv {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Missing required local env file: $Path"
  }

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

# 1. Load root environment configuration
$EnvFile = Join-Path $Root ".env.local"
Import-RootEnv -Path $EnvFile

$DshBaseUrl = Get-LocalEnv "DSH_API_BASE_URL" "http://localhost:8080"
$env:EXPO_PUBLIC_DSH_API_BASE_URL = $DshBaseUrl

# 2. Setup ADB wifi connection
$adbRuntimeSerial = Setup-AdbConnection

# Define ports based on target
$targetPort = switch ($Target) {
  "client"  { 8081 }
  "partner" { 8082 }
  "captain" { 8083 }
  "field"   { 8084 }
}

# Reverse port for this target specifically to be certain
Write-RunLog "Applying ADB reverse tunnel for port $targetPort..."
& adb -s $adbRuntimeSerial reverse tcp:$targetPort tcp:$targetPort | Out-Null
& adb -s $adbRuntimeSerial reverse tcp:8080 tcp:8080 | Out-Null # Also reverse DSH API port for the app

# Clear metro cache if requested
$clearArg = ""
if ($ClearMetroOnce) {
  $clearArg = " --clear"
  $metroCache = Join-Path $env:TEMP "metro-cache"
  Write-RunLog "Cleaning Metro cache: $metroCache"
  if (Test-Path -LiteralPath $metroCache) {
    Remove-Item -LiteralPath $metroCache -Recurse -Force -ErrorAction SilentlyContinue
  }
}

# 3. Start Expo Android App in current shell
Write-RunLog "Starting Expo app $Target on port $targetPort..."
$targetDir = "app-$Target/runtime"

$CommandArgs = @(
  "--dir", $targetDir,
  "exec", "expo", "start",
  "--dev-client",
  "--host", "localhost",
  "--port", $targetPort.ToString(),
  "--android"
)
if ($clearArg) {
  $CommandArgs += "--clear"
}

pnpm @CommandArgs
