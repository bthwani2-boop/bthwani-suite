Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$sessionId = 'APPLY-START-EXPO-GO-TUNNEL-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
$runRoot = Join-Path $repoRoot ("kdt\volatile\registry\runs\{0}" -f $sessionId)
New-Item -ItemType Directory -Force -Path $runRoot | Out-Null

$findings = New-Object System.Collections.Generic.List[object]
$critical = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]
$infos = New-Object System.Collections.Generic.List[string]

function Add-Finding {
    param(
        [string]$Id,
        [ValidateSet('PASS','FAIL','WARN','INFO')]
        [string]$Status,
        [string]$Category,
        [string]$Message,
        [string]$Path = '',
        $Details = $null
    )
    $obj = [pscustomobject]@{
        id       = $Id
        status   = $Status
        category = $Category
        message  = $Message
        path     = $Path
        details  = $Details
    }
    $findings.Add($obj) | Out-Null

    switch ($Status) {
        'FAIL' { $critical.Add("[$Id] $Message") | Out-Null; Write-Host "[FAIL] $Message" -ForegroundColor Red }
        'WARN' { $warnings.Add("[$Id] $Message") | Out-Null; Write-Host "[WARN] $Message" -ForegroundColor Yellow }
        'INFO' { $infos.Add("[$Id] $Message") | Out-Null; Write-Host "[INFO] $Message" -ForegroundColor Cyan }
        'PASS' { Write-Host "[PASS] $Message" -ForegroundColor Green }
    }
}

function Read-Json {
    param([string]$Path)
    if (!(Test-Path $Path)) { return $null }
    try { return (Get-Content -Raw -Path $Path | ConvertFrom-Json -Depth 100) } catch { return $null }
}

Write-Host ''
Write-Host '================ START EXPO GO TUNNEL (APP-CLIENT) ================' -ForegroundColor Cyan
Write-Host ("Repo: {0}" -f $repoRoot)
Write-Host ("Session: {0}" -f $sessionId)
Write-Host ("Evidence: {0}" -f $runRoot)
Write-Host '------------------------------------------------------------------' -ForegroundColor Cyan

$appRoot = Join-Path $repoRoot 'apps\mobile\app-client'
$projectJsonPath = Join-Path $appRoot 'project.json'
$appJsonPath = Join-Path $appRoot 'app.json'
$appTsxPath = Join-Path $appRoot 'App.tsx'
$packageJsonPath = Join-Path $appRoot 'package.json'

foreach ($p in @($appRoot,$projectJsonPath,$appJsonPath,$appTsxPath,$packageJsonPath)) {
    if (Test-Path $p) {
        Add-Finding -Id ("PATH-" + ((Split-Path $p -Leaf) -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'precheck' -Message ("Required path exists: {0}" -f $p) -Path $p
    } else {
        Add-Finding -Id ("PATH-" + ((Split-Path $p -Leaf) -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'precheck' -Message ("Required path missing: {0}" -f $p) -Path $p
    }
}

$project = Read-Json -Path $projectJsonPath
if ($project -and $project.targets) {
    if ($project.targets.'expo-tunnel') {
        Add-Finding -Id 'TARGET-EXPO-TUNNEL' -Status 'PASS' -Category 'precheck' -Message 'expo-tunnel target exists in project.json.' -Path $projectJsonPath
    } else {
        Add-Finding -Id 'TARGET-EXPO-TUNNEL' -Status 'WARN' -Category 'precheck' -Message 'expo-tunnel target not found; script will fall back to direct expo start --go --tunnel.' -Path $projectJsonPath
    }
} else {
    Add-Finding -Id 'TARGET-EXPO-TUNNEL' -Status 'WARN' -Category 'precheck' -Message 'project.json unreadable; script will fall back to direct expo start --go --tunnel.' -Path $projectJsonPath
}

if ($critical.Count -gt 0) {
    throw 'Precheck failed.'
}

# Kill old listeners to avoid stale host URLs
foreach ($port in @(8081,8082,8083,8084)) {
    $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($listener) {
        Stop-Process -Id $listener.OwningProcess -Force
        Add-Finding -Id ("KILL-{0}" -f $port) -Status 'PASS' -Category 'runtime' -Message ("Stopped existing listener on port {0}." -f $port) -Path ("tcp:{0}" -f $port)
    } else {
        Add-Finding -Id ("KILL-{0}" -f $port) -Status 'INFO' -Category 'runtime' -Message ("No listener found on port {0}." -f $port) -Path ("tcp:{0}" -f $port)
    }
}

$status = if ($critical.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }
$summaryLines = @(
    'APPLY_VERIFY_START_EXPO_GO_TUNNEL_APP_CLIENT',
    "repo=$repoRoot",
    "session_id=$sessionId",
    "status=$status",
    "critical_failures=$($critical.Count)",
    "warnings=$($warnings.Count)",
    "infos=$($infos.Count)",
    '',
    'Critical:',
    $(if ($critical.Count -eq 0) { '- none' } else { $critical | ForEach-Object { "- $_" } }),
    '',
    'Warnings:',
    $(if ($warnings.Count -eq 0) { '- none' } else { $warnings | ForEach-Object { "- $_" } })
)
$summaryPath = Join-Path $runRoot 'summary.txt'
$evidencePath = Join-Path $runRoot 'evidence.json'
[System.IO.File]::WriteAllText($summaryPath, ($summaryLines -join [Environment]::NewLine), (New-Object System.Text.UTF8Encoding($false)))
$findings | ConvertTo-Json -Depth 100 | Set-Content -Path $evidencePath -Encoding UTF8

Write-Host '------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host ("STATUS BEFORE RUN: {0}" -f $status) -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } elseif ($status -eq 'WARN') { 'Yellow' } else { 'Red' })
Write-Host ("summary.txt => {0}" -f $summaryPath)
Write-Host ("evidence.json => {0}" -f $evidencePath)
Write-Host '------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host 'Starting app-client in Expo Go tunnel mode now...' -ForegroundColor Cyan
Write-Host 'If QR does not stay visible, press E in the Expo terminal UI to show it again.' -ForegroundColor Cyan
Write-Host ''

if ($project -and $project.targets -and $project.targets.'expo-tunnel') {
    pnpm nx run app-client:expo-tunnel
} else {
    Set-Location $appRoot
    pnpm exec expo start --go --tunnel --port 8081 --clear
}
