Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$sessionId = 'CHECK-EXPO-GO-NATIVE-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
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

function Get-Text {
    param([string]$Path)
    if (!(Test-Path $Path)) { return $null }
    return Get-Content -Raw -Path $Path
}

Write-Host ''
Write-Host '================ CHECK ANALYZE EXPO GO NATIVE STARTUP ================' -ForegroundColor Cyan
Write-Host ("Repo: {0}" -f $repoRoot)
Write-Host ("Session: {0}" -f $sessionId)
Write-Host ("Evidence: {0}" -f $runRoot)
Write-Host '--------------------------------------------------------------------' -ForegroundColor Cyan

$appName = 'app-client'
$appRoot = Join-Path $repoRoot 'apps\mobile\app-client'
$packageJsonPath = Join-Path $appRoot 'package.json'
$appTsxPath = Join-Path $appRoot 'App.tsx'
$indexPath = Join-Path $appRoot 'index.js'
$projectJsonPath = Join-Path $appRoot 'project.json'
$entryPath = Join-Path $repoRoot 'packages\surfaces\src\platform\client\mobile-entry.tsx'
$startPreviewScript = Join-Path $repoRoot 'tools\scripts\start-mobile-preview.ps1'
$surfaceBrowserRoot = Join-Path $repoRoot 'packages\surface-browser'
$surfaceMobileRoot = Join-Path $repoRoot 'packages\surface-mobile'
$indexHtmlPath = Join-Path $appRoot 'index.html'
$viteConfigPath = Join-Path $appRoot 'vite.config.ts'
$appJsonPath = Join-Path $appRoot 'app.json'
$appConfigJsPath = Join-Path $appRoot 'app.config.js'
$appConfigTsPath = Join-Path $appRoot 'app.config.ts'

# 1) Baseline native-only contract
foreach ($path in @($appRoot, $packageJsonPath, $appTsxPath, $indexPath, $projectJsonPath, $entryPath, $startPreviewScript)) {
    if (Test-Path $path) {
        Add-Finding -Id ("PATH-" + ((Split-Path $path -Leaf) -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'baseline' -Message ("Required file/path exists: {0}" -f $path) -Path $path
    } else {
        Add-Finding -Id ("PATH-" + ((Split-Path $path -Leaf) -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'baseline' -Message ("Required file/path missing: {0}" -f $path) -Path $path
    }
}

$pkg = Read-Json -Path $packageJsonPath
if ($pkg) {
    $deps = @{}
    if ($pkg.dependencies) { $pkg.dependencies.PSObject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value } }
    if ($pkg.devDependencies) { $pkg.devDependencies.PSObject.Properties | ForEach-Object { if (-not $deps.ContainsKey($_.Name)) { $deps[$_.Name] = $_.Value } } }

    foreach ($dep in @('expo','react','react-native','@bthwani/surfaces')) {
        if ($deps.ContainsKey($dep)) {
            Add-Finding -Id ("DEP-REQ-{0}" -f ($dep -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'deps' -Message ("Required dependency present: {0}" -f $dep) -Path $packageJsonPath -Details $deps[$dep]
        } else {
            Add-Finding -Id ("DEP-REQ-{0}" -f ($dep -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'deps' -Message ("Required dependency missing: {0}" -f $dep) -Path $packageJsonPath
        }
    }

    foreach ($bad in @('@bthwani/surface-browser','@bthwani/surface-mobile','react-dom','react-native-web')) {
        if ($deps.ContainsKey($bad)) {
            Add-Finding -Id ("DEP-BAD-{0}" -f ($bad -replace '[^A-Za-z0-9]','_')) -Status 'WARN' -Category 'deps' -Message ("Native-only baseline drift: dependency still present => {0}" -f $bad) -Path $packageJsonPath -Details $deps[$bad]
        } else {
            Add-Finding -Id ("DEP-BAD-{0}" -f ($bad -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'deps' -Message ("Dependency absent as expected for native-only baseline: {0}" -f $bad) -Path $packageJsonPath
        }
    }
} else {
    Add-Finding -Id 'PKG-READ' -Status 'FAIL' -Category 'deps' -Message 'package.json is unreadable.' -Path $packageJsonPath
}

# 2) Wrapper correctness
$appText = Get-Text -Path $appTsxPath
if ($appText) {
    $lineCount = (Get-Content -Path $appTsxPath).Count
    if ($appText -match [regex]::Escape("@bthwani/surfaces/src/platform/client/mobile-entry")) {
        Add-Finding -Id 'WRAP-IMPORT' -Status 'PASS' -Category 'wrapper' -Message 'App.tsx points to surfaces mobile-entry.' -Path $appTsxPath
    } else {
        Add-Finding -Id 'WRAP-IMPORT' -Status 'FAIL' -Category 'wrapper' -Message 'App.tsx does not point to surfaces mobile-entry.' -Path $appTsxPath
    }

    if ($lineCount -le 3) {
        Add-Finding -Id 'WRAP-THIN' -Status 'PASS' -Category 'wrapper' -Message 'App.tsx is thin.' -Path $appTsxPath -Details $lineCount
    } else {
        Add-Finding -Id 'WRAP-THIN' -Status 'WARN' -Category 'wrapper' -Message 'App.tsx is heavier than expected for a native-only shell.' -Path $appTsxPath -Details $lineCount
    }
} else {
    Add-Finding -Id 'WRAP-READ' -Status 'FAIL' -Category 'wrapper' -Message 'App.tsx is unreadable.' -Path $appTsxPath
}

$indexText = Get-Text -Path $indexPath
if ($indexText) {
    if ($indexText -match 'registerRootComponent') {
        Add-Finding -Id 'INDEX-REGISTER' -Status 'PASS' -Category 'entry' -Message 'index.js registers Expo root component.' -Path $indexPath
    } else {
        Add-Finding -Id 'INDEX-REGISTER' -Status 'FAIL' -Category 'entry' -Message 'index.js does not register Expo root component.' -Path $indexPath
    }

    if ($indexText -match "from './App.tsx'" -or $indexText -match 'from "./App.tsx"') {
        Add-Finding -Id 'INDEX-APPTSX' -Status 'PASS' -Category 'entry' -Message 'index.js points to ./App.tsx.' -Path $indexPath
    } else {
        Add-Finding -Id 'INDEX-APPTSX' -Status 'FAIL' -Category 'entry' -Message 'index.js does not point to ./App.tsx.' -Path $indexPath
    }
} else {
    Add-Finding -Id 'INDEX-READ' -Status 'FAIL' -Category 'entry' -Message 'index.js is unreadable.' -Path $indexPath
}

# 3) start-mobile-preview tooling behavior
$previewText = Get-Text -Path $startPreviewScript
if ($previewText) {
    if ($previewText -match '--go') {
        Add-Finding -Id 'START-GO' -Status 'PASS' -Category 'tooling' -Message 'start-mobile-preview.ps1 uses Expo Go.' -Path $startPreviewScript
    } else {
        Add-Finding -Id 'START-GO' -Status 'FAIL' -Category 'tooling' -Message 'start-mobile-preview.ps1 does not use --go.' -Path $startPreviewScript
    }

    if ($previewText -match '--lan') {
        Add-Finding -Id 'START-LAN' -Status 'PASS' -Category 'tooling' -Message 'start-mobile-preview.ps1 uses LAN mode.' -Path $startPreviewScript
    } else {
        Add-Finding -Id 'START-LAN' -Status 'WARN' -Category 'tooling' -Message 'start-mobile-preview.ps1 does not explicitly use LAN mode.' -Path $startPreviewScript
    }

    if ($previewText -match '--clear') {
        Add-Finding -Id 'START-CLEAR' -Status 'PASS' -Category 'tooling' -Message 'start-mobile-preview.ps1 clears Metro cache.' -Path $startPreviewScript
    } else {
        Add-Finding -Id 'START-CLEAR' -Status 'WARN' -Category 'tooling' -Message 'start-mobile-preview.ps1 does not explicitly clear Metro cache.' -Path $startPreviewScript
    }
} else {
    Add-Finding -Id 'START-SCRIPT' -Status 'FAIL' -Category 'tooling' -Message 'start-mobile-preview.ps1 is unreadable.' -Path $startPreviewScript
}

# 4) Native-only drift markers inside app root
if (Test-Path $indexHtmlPath) {
    Add-Finding -Id 'DRIFT-INDEXHTML' -Status 'WARN' -Category 'drift' -Message 'index.html exists inside mobile app root. This is a web-preview drift marker for a native-only app.' -Path $indexHtmlPath
} else {
    Add-Finding -Id 'DRIFT-INDEXHTML' -Status 'PASS' -Category 'drift' -Message 'index.html is absent from mobile app root.' -Path $indexHtmlPath
}

if (Test-Path $viteConfigPath) {
    Add-Finding -Id 'DRIFT-VITE' -Status 'WARN' -Category 'drift' -Message 'vite.config.ts exists inside mobile app root. This is a web-preview drift marker for a native-only app.' -Path $viteConfigPath
} else {
    Add-Finding -Id 'DRIFT-VITE' -Status 'PASS' -Category 'drift' -Message 'vite.config.ts is absent from mobile app root.' -Path $viteConfigPath
}

# 5) App config presence and platforms signal
$appConfigFiles = @($appJsonPath, $appConfigJsPath, $appConfigTsPath) | Where-Object { Test-Path $_ }
if ($appConfigFiles.Count -gt 0) {
    foreach ($cfg in $appConfigFiles) {
        Add-Finding -Id ("CFG-" + ((Split-Path $cfg -Leaf) -replace '[^A-Za-z0-9]','_')) -Status 'INFO' -Category 'config' -Message ("App config file exists: {0}" -f (Split-Path $cfg -Leaf)) -Path $cfg
        $cfgText = Get-Text -Path $cfg
        if ($cfgText -match '"web"' -or $cfgText -match "'web'") {
            Add-Finding -Id ("CFG-WEB-" + ((Split-Path $cfg -Leaf) -replace '[^A-Za-z0-9]','_')) -Status 'WARN' -Category 'config' -Message 'App config explicitly mentions web.' -Path $cfg
        }
    }
} else {
    Add-Finding -Id 'CFG-NONE' -Status 'INFO' -Category 'config' -Message 'No app.json/app.config.js/app.config.ts found in app-client root.' -Path $appRoot
}

# 6) Runtime observation markers
$listener = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction SilentlyContinue
    Add-Finding -Id 'RUNTIME-8081' -Status 'INFO' -Category 'runtime' -Message 'A listener currently exists on 8081.' -Path 'tcp:8081' -Details @{ pid = $listener.OwningProcess; process = $proc.Name; commandLine = $proc.CommandLine }
} else {
    Add-Finding -Id 'RUNTIME-8081' -Status 'INFO' -Category 'runtime' -Message 'No listener currently exists on 8081.' -Path 'tcp:8081'
}

$browserProcesses = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -match 'chrome|msedge|firefox|opera|brave' -and $_.CommandLine -match '8081|localhost:8081|127.0.0.1:8081'
}
if ($browserProcesses) {
    Add-Finding -Id 'RUNTIME-BROWSER-8081' -Status 'WARN' -Category 'runtime' -Message 'A browser process appears to be targeting port 8081. This can trigger web-path requests.' -Path 'tcp:8081' -Details ($browserProcesses | Select-Object Name, ProcessId, CommandLine)
} else {
    Add-Finding -Id 'RUNTIME-BROWSER-8081' -Status 'PASS' -Category 'runtime' -Message 'No browser process explicitly targeting 8081 was detected.' -Path 'tcp:8081'
}

# 7) Evidence
$status = if ($critical.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }
$summaryLines = @(
    'CHECK_ANALYZE_EXPO_GO_NATIVE_STARTUP',
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
Write-Host ("STATUS: {0}" -f $status) -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } elseif ($status -eq 'WARN') { 'Yellow' } else { 'Red' })
Write-Host ("Critical Failures: {0}" -f $critical.Count)
Write-Host ("Warnings: {0}" -f $warnings.Count)
Write-Host ("summary.txt => {0}" -f $summaryPath)
Write-Host ("evidence.json => {0}" -f $evidencePath)
Write-Host '====================================================================' -ForegroundColor Cyan
Write-Host ''
