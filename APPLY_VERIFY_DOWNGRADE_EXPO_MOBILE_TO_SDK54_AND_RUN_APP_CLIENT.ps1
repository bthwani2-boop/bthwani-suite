Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$sessionId = 'APPLY-DOWNGRADE-EXPO-SDK54-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
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

function Read-JsonMap {
    param([string]$Path)
    if (!(Test-Path $Path)) { return $null }
    try { return (Get-Content -Raw -Path $Path | ConvertFrom-Json -AsHashtable -Depth 100) } catch { return $null }
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
Write-Host '================ DOWNGRADE EXPO MOBILE TO SDK 54 + RUN ================' -ForegroundColor Cyan
Write-Host ("Repo: {0}" -f $repoRoot)
Write-Host ("Session: {0}" -f $sessionId)
Write-Host ("Evidence: {0}" -f $runRoot)
Write-Host '---------------------------------------------------------------------' -ForegroundColor Cyan

$appNames = @('app-client','app-partner','app-captain','app-field')
$targetExpo = '^54.0.0'
$targetReact = '19.1.0'
$targetReactNative = '0.81.0'

foreach ($appName in $appNames) {
    $appRoot = Join-Path $repoRoot ("apps\mobile\{0}" -f $appName)
    $pkgPath = Join-Path $appRoot 'package.json'
    $appJsonPath = Join-Path $appRoot 'app.json'

    if (Test-Path $appRoot) {
        Add-Finding -Id ("PRE-{0}" -f $appName) -Status 'PASS' -Category 'precheck' -Message ("App root exists: {0}" -f $appName) -Path $appRoot
    } else {
        Add-Finding -Id ("PRE-{0}" -f $appName) -Status 'FAIL' -Category 'precheck' -Message ("Missing app root: {0}" -f $appName) -Path $appRoot
        continue
    }

    $pkg = Read-JsonMap -Path $pkgPath
    if ($null -eq $pkg) {
        Add-Finding -Id ("PREPKG-{0}" -f $appName) -Status 'FAIL' -Category 'precheck' -Message ("Unreadable package.json for {0}." -f $appName) -Path $pkgPath
        continue
    }

    Backup-File -Path $pkgPath

    if (-not $pkg.ContainsKey('dependencies') -or $null -eq $pkg['dependencies']) {
        $pkg['dependencies'] = [ordered]@{}
    }

    $deps = $pkg['dependencies']
    if ($deps -isnot [System.Collections.IDictionary]) {
        $deps = [ordered]@{}
        $pkg['dependencies'] = $deps
    }

    $deps['expo'] = $targetExpo
    $deps['react'] = $targetReact
    $deps['react-native'] = $targetReactNative

    foreach ($bad in @('@bthwani/surface-browser','@bthwani/surface-mobile','react-dom','react-native-web')) {
        if ($deps.Contains($bad)) { [void]$deps.Remove($bad) }
    }

    if ($pkg.ContainsKey('devDependencies') -and $pkg['devDependencies'] -is [System.Collections.IDictionary]) {
        foreach ($bad in @('@bthwani/surface-browser','@bthwani/surface-mobile','react-dom','react-native-web')) {
            if ($pkg['devDependencies'].Contains($bad)) { [void]$pkg['devDependencies'].Remove($bad) }
        }
    }

    Write-JsonNoBom -Path $pkgPath -Object $pkg
    Add-Finding -Id ("WRITEPKG-{0}" -f $appName) -Status 'PASS' -Category 'apply' -Message ("Pinned Expo stack to SDK 54 baseline for {0}." -f $appName) -Path $pkgPath -Details @{ expo=$targetExpo; react=$targetReact; rn=$targetReactNative }

    if (Test-Path $appJsonPath) {
        Backup-File -Path $appJsonPath
        $appJson = Read-JsonMap -Path $appJsonPath
        if ($null -eq $appJson) { $appJson = [ordered]@{} }
    } else {
        $appJson = [ordered]@{}
    }

    if (-not $appJson.ContainsKey('expo') -or $null -eq $appJson['expo']) {
        $appJson['expo'] = [ordered]@{}
    }
    if ($appJson['expo'] -isnot [System.Collections.IDictionary]) {
        $appJson['expo'] = [ordered]@{}
    }

    $appJson['expo']['platforms'] = @('ios','android')
    Write-JsonNoBom -Path $appJsonPath -Object $appJson
    Add-Finding -Id ("APPJSON-{0}" -f $appName) -Status 'PASS' -Category 'apply' -Message ("Ensured native-only platforms in app.json for {0}." -f $appName) -Path $appJsonPath
}

if ($critical.Count -gt 0) {
    throw 'Precheck/apply failed before install.'
}

Write-Host '---------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host 'Running workspace install...' -ForegroundColor Cyan
pnpm install

Write-Host '---------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host 'Running expo install --fix in each mobile app...' -ForegroundColor Cyan
foreach ($appName in $appNames) {
    $appRoot = Join-Path $repoRoot ("apps\mobile\{0}" -f $appName)
    Push-Location $appRoot
    try {
        pnpm exec expo install --fix
        Add-Finding -Id ("FIX-{0}" -f $appName) -Status 'PASS' -Category 'fix' -Message ("expo install --fix completed for {0}." -f $appName) -Path $appRoot
    } catch {
        Add-Finding -Id ("FIX-{0}" -f $appName) -Status 'FAIL' -Category 'fix' -Message ("expo install --fix failed for {0}: {1}" -f $appName, $_.Exception.Message) -Path $appRoot
    } finally {
        Pop-Location
    }
}

Write-Host '---------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host 'Verifying app-client baseline...' -ForegroundColor Cyan
$verifyPkgPath = Join-Path $repoRoot 'apps\mobile\app-client\package.json'
$verifyPkg = Read-JsonMap -Path $verifyPkgPath
if ($null -eq $verifyPkg) {
    Add-Finding -Id 'VERIFY-app-client' -Status 'FAIL' -Category 'verify' -Message 'Unreadable package.json for app-client after install.' -Path $verifyPkgPath
} else {
    $vdeps = $verifyPkg['dependencies']
    foreach ($need in @('expo','react','react-native','@bthwani/surfaces')) {
        if ($vdeps.Contains($need)) {
            Add-Finding -Id ("VERIFYDEP-{0}" -f ($need -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'verify' -Message ("Dependency present after downgrade: {0}" -f $need) -Path $verifyPkgPath -Details $vdeps[$need]
        } else {
            Add-Finding -Id ("VERIFYDEP-{0}" -f ($need -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'verify' -Message ("Dependency missing after downgrade: {0}" -f $need) -Path $verifyPkgPath
        }
    }
    foreach ($bad in @('@bthwani/surface-browser','@bthwani/surface-mobile','react-dom','react-native-web')) {
        if ($vdeps.Contains($bad)) {
            Add-Finding -Id ("VERIFYBAD-{0}" -f ($bad -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'verify' -Message ("Unexpected dependency still present: {0}" -f $bad) -Path $verifyPkgPath
        } else {
            Add-Finding -Id ("VERIFYBAD-{0}" -f ($bad -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'verify' -Message ("Dependency absent as expected after downgrade: {0}" -f $bad) -Path $verifyPkgPath
        }
    }
}

# Kill common metro ports before run
foreach ($port in 8081,8082,8083,8084) {
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
    'APPLY_VERIFY_DOWNGRADE_EXPO_MOBILE_TO_SDK54_AND_RUN_APP_CLIENT',
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

Write-Host '---------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host ("STATUS BEFORE RUN: {0}" -f $status) -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } elseif ($status -eq 'WARN') { 'Yellow' } else { 'Red' })
Write-Host ("summary.txt => {0}" -f $summaryPath)
Write-Host ("evidence.json => {0}" -f $evidencePath)
Write-Host '---------------------------------------------------------------------' -ForegroundColor Cyan

if ($critical.Count -gt 0) {
    throw 'Downgrade/verify failed before Expo run.'
}

Write-Host 'Starting app-client Expo Go tunnel now...' -ForegroundColor Cyan
Push-Location (Join-Path $repoRoot 'apps\mobile\app-client')
try {
    pnpm exec expo start --go --tunnel --clear
} finally {
    Pop-Location
}
