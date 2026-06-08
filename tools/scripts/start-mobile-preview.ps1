param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('app-client', 'app-partner', 'app-captain', 'app-field')]
    [string]$App,

    [ValidateSet('lan', 'tunnel', 'localhost')]
    [string]$Mode = 'lan',

    [switch]$Clear
)

$portMap = @{
    'app-client' = 8081
    'app-partner' = 8082
    'app-captain' = 8083
    'app-field' = 8084
}

$packageMap = @{
    'app-client' = '@bthwani/app-client'
    'app-partner' = '@bthwani/app-partner'
    'app-captain' = '@bthwani/app-captain'
    'app-field' = '@bthwani/app-field'
}

$workspaceRoot = Split-Path -Path $PSScriptRoot -Parent | Split-Path -Parent
$appRoot = Join-Path $workspaceRoot (Join-Path $App 'runtime')
$targetPort = $portMap[$App]
$expectedPackage = $packageMap[$App]
$requestedModeFlag = "--$Mode"

if (-not (Test-Path $appRoot)) {
    throw "App root not found: $appRoot"
}

function Get-PortListenerInfo {
    param(
        [int]$Port
    )

    $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1

    if (-not $listener) {
        return $null
    }

    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)"

    return [pscustomobject]@{
        Port = $Port
        ProcessId = $listener.OwningProcess
        Name = $process.Name
        CommandLine = $process.CommandLine
    }
}

function Get-ExpoPageTitle {
    param(
        [int]$Port
    )

    try {
        $response = Invoke-WebRequest -Uri ("http://localhost:{0}" -f $Port) -UseBasicParsing -TimeoutSec 3

        if ($response.Content -match '<title>(.*?)</title>') {
            return $matches[1]
        }
    }
    catch {
        return $null
    }

    return $null
}

$listenerInfo = Get-PortListenerInfo -Port $targetPort

if ($listenerInfo) {
    $currentTitle = Get-ExpoPageTitle -Port $targetPort
    $isExpoProcess = $listenerInfo.Name -eq 'node.exe' -and $listenerInfo.CommandLine -match 'expo\\bin\\cli'
    $isExpectedApp = $listenerInfo.CommandLine -like "*$appRoot*"
    $isExpectedTitle = $currentTitle -eq $expectedPackage
    $isExpectedMode = $listenerInfo.CommandLine -match [regex]::Escape($requestedModeFlag)

    if ($isExpoProcess -and ($isExpectedApp -or $isExpectedTitle) -and $isExpectedMode) {
        Write-Host "Expo preview for $App is already running on port $targetPort in $Mode mode."
        exit 0
    }

    if ($isExpoProcess) {
        if ($isExpectedApp -or $isExpectedTitle) {
            Write-Host "Restarting Expo preview for $App on port $targetPort to switch to $Mode mode."
        }
        else {
            Write-Host "Stopping conflicting Expo process on port $targetPort (PID $($listenerInfo.ProcessId))."
        }

        Stop-Process -Id $listenerInfo.ProcessId -Force
        Wait-Process -Id $listenerInfo.ProcessId -Timeout 10 -ErrorAction SilentlyContinue
    }
    else {
        throw "Port $targetPort is occupied by $($listenerInfo.Name) (PID $($listenerInfo.ProcessId)) and is not an Expo process."
    }
}

$arguments = @('exec', 'expo', 'start', '--go', "--$Mode", '--port', [string]$targetPort)

if ($Clear) {
    $arguments += '--clear'
}

Push-Location $appRoot

try {
    & pnpm @arguments

    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}