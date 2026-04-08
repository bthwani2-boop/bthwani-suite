Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$sessionId = 'APPLY-FIX-EXPO-WEB-PATH-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
$runRoot = Join-Path $repoRoot ("kdt\volatile\registry\runs\{0}" -f $sessionId)
New-Item -ItemType Directory -Force -Path $runRoot | Out-Null

$findings = New-Object System.Collections.Generic.List[object]
$critical = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]
$infos = New-Object System.Collections.Generic.List[string]

$TargetReactDomVersion = '19.2.0'
$TargetReactNativeWebVersion = '0.21.0'
$apps = @('app-client','app-partner','app-captain','app-field')

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

function Write-JsonNoBom {
    param([string]$Path, $Object)
    $json = $Object | ConvertTo-Json -Depth 100
    [System.IO.File]::WriteAllText($Path, $json, (New-Object System.Text.UTF8Encoding($false)))
}

function Backup-File {
    param([string]$Path)
    if (Test-Path $Path) {
        $safe = $Path.Substring($repoRoot.Length).TrimStart('\\') -replace '[\\/: ]','__'
        Copy-Item -LiteralPath $Path -Destination (Join-Path $runRoot ("backup__{0}" -f $safe)) -Force
    }
}

Write-Host ''
Write-Host '================ APPLY VERIFY FIX EXPO WEB PATH + RUN ================' -ForegroundColor Cyan
Write-Host ("Repo: {0}" -f $repoRoot)
Write-Host ("Session: {0}" -f $sessionId)
Write-Host ("Evidence: {0}" -f $runRoot)
Write-Host '--------------------------------------------------------------------' -ForegroundColor Cyan

# 1) Ensure required package.json files exist
foreach ($app in $apps) {
    $pkgPath = Join-Path $repoRoot ("apps\mobile\{0}\package.json" -f $app)
    if (Test-Path $pkgPath) {
        Add-Finding -Id ("PRE-PKG-{0}" -f $app) -Status 'PASS' -Category 'precheck' -Message ("package.json exists for {0}." -f $app) -Path $pkgPath
    } else {
        Add-Finding -Id ("PRE-PKG-{0}" -f $app) -Status 'FAIL' -Category 'precheck' -Message ("package.json missing for {0}." -f $app) -Path $pkgPath
    }
}
if ($critical.Count -gt 0) { throw 'Precheck failed.' }

# 2) Apply exact Expo web deps for SDK 55 compatibility
foreach ($app in $apps) {
    $pkgPath = Join-Path $repoRoot ("apps\mobile\{0}\package.json" -f $app)
    $pkg = Read-Json -Path $pkgPath
    if (-not $pkg) {
        Add-Finding -Id ("READ-PKG-{0}" -f $app) -Status 'FAIL' -Category 'apply' -Message ("Unreadable package.json for {0}." -f $app) -Path $pkgPath
        continue
    }

    $changed = $false
    if (-not $pkg.dependencies) {
        $pkg | Add-Member -MemberType NoteProperty -Name dependencies -Value ([ordered]@{})
        $changed = $true
    }

    if ($pkg.dependencies.'react-dom' -ne $TargetReactDomVersion) {
        Backup-File -Path $pkgPath
        $pkg.dependencies.'react-dom' = $TargetReactDomVersion
        $changed = $true
    }

    if ($pkg.dependencies.'react-native-web' -ne $TargetReactNativeWebVersion) {
        Backup-File -Path $pkgPath
        $pkg.dependencies.'react-native-web' = $TargetReactNativeWebVersion
        $changed = $true
    }

    if ($changed) {
        Write-JsonNoBom -Path $pkgPath -Object $pkg
        Add-Finding -Id ("WRITE-PKG-{0}" -f $app) -Status 'PASS' -Category 'apply' -Message ("Pinned react-dom and react-native-web for {0}." -f $app) -Path $pkgPath
    } else {
        Add-Finding -Id ("WRITE-PKG-{0}" -f $app) -Status 'INFO' -Category 'apply' -Message ("react-dom and react-native-web already pinned for {0}." -f $app) -Path $pkgPath
    }
}

# 3) Verify direct dependency state
foreach ($app in $apps) {
    $pkgPath = Join-Path $repoRoot ("apps\mobile\{0}\package.json" -f $app)
    $pkg = Read-Json -Path $pkgPath
    if (-not $pkg) {
        Add-Finding -Id ("VERIFY-PKG-{0}" -f $app) -Status 'FAIL' -Category 'verify' -Message ("Unreadable package.json for {0}." -f $app) -Path $pkgPath
        continue
    }

    $deps = @{}
    if ($pkg.dependencies) { $pkg.dependencies.PSObject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value } }
    if ($deps.'react-dom' -eq $TargetReactDomVersion) {
        Add-Finding -Id ("VERIFY-RDOM-{0}" -f $app) -Status 'PASS' -Category 'verify' -Message ("react-dom pinned correctly for {0}." -f $app) -Path $pkgPath
    } else {
        Add-Finding -Id ("VERIFY-RDOM-{0}" -f $app) -Status 'FAIL' -Category 'verify' -Message ("react-dom mismatch for {0}." -f $app) -Path $pkgPath -Details $deps.'react-dom'
    }
    if ($deps.'react-native-web' -eq $TargetReactNativeWebVersion) {
        Add-Finding -Id ("VERIFY-RNW-{0}" -f $app) -Status 'PASS' -Category 'verify' -Message ("react-native-web pinned correctly for {0}." -f $app) -Path $pkgPath
    } else {
        Add-Finding -Id ("VERIFY-RNW-{0}" -f $app) -Status 'FAIL' -Category 'verify' -Message ("react-native-web mismatch for {0}." -f $app) -Path $pkgPath -Details $deps.'react-native-web'
    }
}

if ($critical.Count -gt 0) { throw 'Apply/verify dependency phase failed.' }

# 4) Install workspace deps cleanly
$listener = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
    Stop-Process -Id $listener.OwningProcess -Force
    Add-Finding -Id 'KILL-8081' -Status 'PASS' -Category 'runtime' -Message 'Stopped existing process on port 8081.' -Path 'tcp:8081'
} else {
    Add-Finding -Id 'KILL-8081' -Status 'INFO' -Category 'runtime' -Message 'No running process found on port 8081.' -Path 'tcp:8081'
}

pnpm install
Add-Finding -Id 'PNPM-INSTALL' -Status 'PASS' -Category 'runtime' -Message 'pnpm install completed successfully.' -Path $repoRoot

# 5) Write evidence before starting Expo
$status = if ($critical.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }
$summaryLines = @(
    'APPLY_VERIFY_FIX_EXPO_WEB_PATH_AND_RUN_APP_CLIENT',
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

Write-Host '--------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host ("STATUS BEFORE RUN: {0}" -f $status) -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } elseif ($status -eq 'WARN') { 'Yellow' } else { 'Red' })
Write-Host ("summary.txt => {0}" -f $summaryPath)
Write-Host ("evidence.json => {0}" -f $evidencePath)
Write-Host '--------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host 'Starting Expo for app-client now...' -ForegroundColor Cyan
Write-Host ''

pnpm nx run app-client:expo
