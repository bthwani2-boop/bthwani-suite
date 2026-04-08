Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$sessionId = 'APPLY-NATIVE-ONLY-EXPO-GO-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
$runRoot = Join-Path $repoRoot ("kdt\volatile\registry\runs\{0}" -f $sessionId)
New-Item -ItemType Directory -Force -Path $runRoot | Out-Null

$findings = New-Object System.Collections.Generic.List[object]
$critical = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]
$infos = New-Object System.Collections.Generic.List[string]

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
Write-Host '================ APPLY VERIFY NATIVE-ONLY EXPO GO CLEANUP ================' -ForegroundColor Cyan
Write-Host ("Repo: {0}" -f $repoRoot)
Write-Host ("Session: {0}" -f $sessionId)
Write-Host ("Evidence: {0}" -f $runRoot)
Write-Host '-------------------------------------------------------------------------' -ForegroundColor Cyan

# 1) Remove web-preview drift markers from mobile apps
foreach ($app in $apps) {
    $appRoot = Join-Path $repoRoot ("apps\mobile\{0}" -f $app)
    $indexHtml = Join-Path $appRoot 'index.html'
    $viteConfig = Join-Path $appRoot 'vite.config.ts'

    if (Test-Path $indexHtml) {
        Backup-File -Path $indexHtml
        Remove-Item -LiteralPath $indexHtml -Force
        Add-Finding -Id ("REMOVE-INDEXHTML-{0}" -f $app) -Status 'PASS' -Category 'apply' -Message ("Removed index.html from {0}." -f $app) -Path $indexHtml
    } else {
        Add-Finding -Id ("REMOVE-INDEXHTML-{0}" -f $app) -Status 'INFO' -Category 'apply' -Message ("index.html already absent in {0}." -f $app) -Path $indexHtml
    }

    if (Test-Path $viteConfig) {
        Backup-File -Path $viteConfig
        Remove-Item -LiteralPath $viteConfig -Force
        Add-Finding -Id ("REMOVE-VITE-{0}" -f $app) -Status 'PASS' -Category 'apply' -Message ("Removed vite.config.ts from {0}." -f $app) -Path $viteConfig
    } else {
        Add-Finding -Id ("REMOVE-VITE-{0}" -f $app) -Status 'INFO' -Category 'apply' -Message ("vite.config.ts already absent in {0}." -f $app) -Path $viteConfig
    }
}

# 2) Add explicit native-only app.json if no app config exists
foreach ($app in $apps) {
    $appRoot = Join-Path $repoRoot ("apps\mobile\{0}" -f $app)
    $appJson = Join-Path $appRoot 'app.json'
    $appConfigJs = Join-Path $appRoot 'app.config.js'
    $appConfigTs = Join-Path $appRoot 'app.config.ts'

    if ((Test-Path $appConfigJs) -or (Test-Path $appConfigTs)) {
        Add-Finding -Id ("CFG-SKIP-{0}" -f $app) -Status 'INFO' -Category 'apply' -Message ("Skipped app.json creation for {0} because app.config.js/ts already exists." -f $app) -Path $appRoot
        continue
    }

    if (Test-Path $appJson) {
        $cfg = Read-Json -Path $appJson
        if ($cfg -and $cfg.expo) {
            if (-not $cfg.expo.platforms) {
                $cfg.expo | Add-Member -MemberType NoteProperty -Name platforms -Value @('ios','android') -Force
            } else {
                $cfg.expo.platforms = @('ios','android')
            }
            Write-JsonNoBom -Path $appJson -Object $cfg
            Add-Finding -Id ("CFG-UPDATE-{0}" -f $app) -Status 'PASS' -Category 'apply' -Message ("Updated app.json to platforms=[ios,android] for {0}." -f $app) -Path $appJson
        } else {
            Backup-File -Path $appJson
            $cfgNew = [ordered]@{
                expo = [ordered]@{
                    name = $app
                    slug = $app
                    platforms = @('ios','android')
                }
            }
            Write-JsonNoBom -Path $appJson -Object $cfgNew
            Add-Finding -Id ("CFG-REWRITE-{0}" -f $app) -Status 'PASS' -Category 'apply' -Message ("Rewrote malformed app.json for {0} to native-only minimal config." -f $app) -Path $appJson
        }
    } else {
        $cfgNew = [ordered]@{
            expo = [ordered]@{
                name = $app
                slug = $app
                platforms = @('ios','android')
            }
        }
        Write-JsonNoBom -Path $appJson -Object $cfgNew
        Add-Finding -Id ("CFG-CREATE-{0}" -f $app) -Status 'PASS' -Category 'apply' -Message ("Created native-only app.json for {0}." -f $app) -Path $appJson
    }
}

# 3) Verify native-only state for app-client
$appClientRoot = Join-Path $repoRoot 'apps\mobile\app-client'
$appClientIndexHtml = Join-Path $appClientRoot 'index.html'
$appClientVite = Join-Path $appClientRoot 'vite.config.ts'
$appClientAppJson = Join-Path $appClientRoot 'app.json'

if (Test-Path $appClientIndexHtml) {
    Add-Finding -Id 'VERIFY-INDEXHTML' -Status 'FAIL' -Category 'verify' -Message 'index.html still exists in app-client.' -Path $appClientIndexHtml
} else {
    Add-Finding -Id 'VERIFY-INDEXHTML' -Status 'PASS' -Category 'verify' -Message 'index.html removed from app-client.' -Path $appClientIndexHtml
}

if (Test-Path $appClientVite) {
    Add-Finding -Id 'VERIFY-VITE' -Status 'FAIL' -Category 'verify' -Message 'vite.config.ts still exists in app-client.' -Path $appClientVite
} else {
    Add-Finding -Id 'VERIFY-VITE' -Status 'PASS' -Category 'verify' -Message 'vite.config.ts removed from app-client.' -Path $appClientVite
}

$appCfg = Read-Json -Path $appClientAppJson
if ($appCfg -and $appCfg.expo -and $appCfg.expo.platforms) {
    $platforms = @($appCfg.expo.platforms)
    if (($platforms -contains 'ios') -and ($platforms -contains 'android') -and (-not ($platforms -contains 'web'))) {
        Add-Finding -Id 'VERIFY-PLATFORMS' -Status 'PASS' -Category 'verify' -Message 'app-client app.json is explicit native-only (ios/android, no web).' -Path $appClientAppJson -Details $platforms
    } else {
        Add-Finding -Id 'VERIFY-PLATFORMS' -Status 'FAIL' -Category 'verify' -Message 'app-client app.json platforms are not native-only.' -Path $appClientAppJson -Details $platforms
    }
} else {
    Add-Finding -Id 'VERIFY-PLATFORMS' -Status 'FAIL' -Category 'verify' -Message 'app-client app.json is missing or unreadable after apply.' -Path $appClientAppJson
}

# 4) Restart app-client Expo Go cleanly
$listener = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
    Stop-Process -Id $listener.OwningProcess -Force
    Add-Finding -Id 'KILL-8081' -Status 'PASS' -Category 'runtime' -Message 'Stopped existing listener on 8081.' -Path 'tcp:8081'
} else {
    Add-Finding -Id 'KILL-8081' -Status 'INFO' -Category 'runtime' -Message 'No existing listener on 8081.' -Path 'tcp:8081'
}

# 5) Write evidence before rerun
$status = if ($critical.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }
$summaryLines = @(
    'APPLY_VERIFY_NATIVE_ONLY_EXPO_GO_CLEANUP_AND_RUN_APP_CLIENT',
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

Write-Host '-------------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host ("STATUS BEFORE RUN: {0}" -f $status) -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } elseif ($status -eq 'WARN') { 'Yellow' } else { 'Red' })
Write-Host ("summary.txt => {0}" -f $summaryPath)
Write-Host ("evidence.json => {0}" -f $evidencePath)
Write-Host '-------------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host 'Starting app-client Expo Go now...' -ForegroundColor Cyan
Write-Host ''

pnpm nx run app-client:expo
