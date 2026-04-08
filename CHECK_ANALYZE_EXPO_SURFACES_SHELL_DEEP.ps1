Set-Location "C:\Users\b\Documents\GitHub\bthwani-suite"
$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$sessionId = 'CHECK-EXPO-SURFACES-SHELL-DEEP-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
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

function Get-DepMap {
    param($Pkg)
    $map = @{}
    if ($null -eq $Pkg) { return $map }
    if ($Pkg.dependencies) {
        $Pkg.dependencies.PSObject.Properties | ForEach-Object { $map[$_.Name] = $_.Value }
    }
    if ($Pkg.devDependencies) {
        $Pkg.devDependencies.PSObject.Properties | ForEach-Object {
            if (-not $map.ContainsKey($_.Name)) { $map[$_.Name] = $_.Value }
        }
    }
    return $map
}

Write-Host ''
Write-Host '================ CHECK ANALYZE EXPO SURFACES SHELL DEEP ================' -ForegroundColor Cyan
Write-Host ("Repo: {0}" -f $repoRoot)
Write-Host ("Session: {0}" -f $sessionId)
Write-Host ("Evidence: {0}" -f $runRoot)
Write-Host '-----------------------------------------------------------------------' -ForegroundColor Cyan

# ----------------------------------------------------------------------
# 0) Baseline structure
# ----------------------------------------------------------------------
$requiredRoots = @(
    'apps',
    'apps\mobile',
    'apps\web',
    'packages',
    'packages\surfaces',
    'packages\ui-kit',
    'packages\api-types',
    'packages\api-clients',
    'tools\scripts',
    'kdt\volatile\registry\runs'
)

foreach ($rel in $requiredRoots) {
    $abs = Join-Path $repoRoot $rel
    if (Test-Path $abs) {
        Add-Finding -Id ("ROOT-{0}" -f ($rel -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'structure' -Message ("Required path exists: {0}" -f $rel) -Path $abs
    } else {
        Add-Finding -Id ("ROOT-{0}" -f ($rel -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'structure' -Message ("Required path missing: {0}" -f $rel) -Path $abs
    }
}

# ----------------------------------------------------------------------
# 1) Workspace package resolution truth
# ----------------------------------------------------------------------
$surfaceBrowserRoot = Join-Path $repoRoot 'packages\surface-browser'
$surfaceMobileRoot = Join-Path $repoRoot 'packages\surface-mobile'

if (Test-Path $surfaceBrowserRoot) {
    Add-Finding -Id 'WS-PKG-SB' -Status 'PASS' -Category 'workspace-package' -Message 'packages/surface-browser exists.' -Path $surfaceBrowserRoot
} else {
    Add-Finding -Id 'WS-PKG-SB' -Status 'FAIL' -Category 'workspace-package' -Message 'packages/surface-browser is missing.' -Path $surfaceBrowserRoot
}

if (Test-Path $surfaceMobileRoot) {
    Add-Finding -Id 'WS-PKG-SM' -Status 'WARN' -Category 'workspace-package' -Message 'packages/surface-mobile exists, but the chosen target architecture says it should not exist.' -Path $surfaceMobileRoot
} else {
    Add-Finding -Id 'WS-PKG-SM' -Status 'PASS' -Category 'workspace-package' -Message 'packages/surface-mobile is absent, matching the chosen target architecture.' -Path $surfaceMobileRoot
}

# ----------------------------------------------------------------------
# 2) surfaces ownership model
# ----------------------------------------------------------------------
$surfacesPlatformRoot = Join-Path $repoRoot 'packages\surfaces\src\platform'
$platformDirs = @('client','partner','captain','field','control-panel','webapp','website')
$mobilePlatforms = @('client','partner','captain','field')

if (Test-Path $surfacesPlatformRoot) {
    Add-Finding -Id 'SURF-PLATFORM-ROOT' -Status 'PASS' -Category 'surfaces' -Message 'packages/surfaces/src/platform exists.' -Path $surfacesPlatformRoot
} else {
    Add-Finding -Id 'SURF-PLATFORM-ROOT' -Status 'FAIL' -Category 'surfaces' -Message 'packages/surfaces/src/platform is missing.' -Path $surfacesPlatformRoot
}

foreach ($platform in $platformDirs) {
    $platformRoot = Join-Path $surfacesPlatformRoot $platform
    if (Test-Path $platformRoot) {
        Add-Finding -Id ("SURF-PLATFORM-{0}" -f $platform) -Status 'PASS' -Category 'surfaces' -Message ("Platform folder exists: {0}" -f $platform) -Path $platformRoot
    } else {
        Add-Finding -Id ("SURF-PLATFORM-{0}" -f $platform) -Status 'FAIL' -Category 'surfaces' -Message ("Platform folder missing: {0}" -f $platform) -Path $platformRoot
    }
}

foreach ($platform in $mobilePlatforms) {
    $entry = Join-Path $surfacesPlatformRoot ("{0}\mobile-entry.tsx" -f $platform)
    if (Test-Path $entry) {
        $text = Get-Text -Path $entry
        Add-Finding -Id ("SURF-MOBILE-ENTRY-{0}" -f $platform) -Status 'PASS' -Category 'surfaces-entry' -Message ("mobile-entry exists for {0}." -f $platform) -Path $entry
        if ($text -match '@bthwani/surface-mobile') {
            Add-Finding -Id ("SURF-MOBILE-ENTRY-BADIMPORT-{0}" -f $platform) -Status 'FAIL' -Category 'surfaces-entry' -Message ("mobile-entry for {0} still imports @bthwani/surface-mobile." -f $platform) -Path $entry
        }
    } else {
        Add-Finding -Id ("SURF-MOBILE-ENTRY-{0}" -f $platform) -Status 'FAIL' -Category 'surfaces-entry' -Message ("Missing mobile-entry.tsx for {0}." -f $platform) -Path $entry
    }
}

$surfacesTsxCount = @(Get-ChildItem -Path (Join-Path $repoRoot 'packages\surfaces\src') -Recurse -File -Include *.tsx -ErrorAction SilentlyContinue).Count
$surfacesTsCount = @(Get-ChildItem -Path (Join-Path $repoRoot 'packages\surfaces\src') -Recurse -File -Include *.ts -ErrorAction SilentlyContinue).Count
Add-Finding -Id 'SURF-CENSUS' -Status 'INFO' -Category 'surfaces' -Message ("surfaces src census => TSX: {0}, TS: {1}" -f $surfacesTsxCount, $surfacesTsCount) -Path (Join-Path $repoRoot 'packages\surfaces\src')

# ----------------------------------------------------------------------
# 3) Mobile shell contract: apps should be thin wrappers only
# ----------------------------------------------------------------------
$appMap = @{
    'app-client'  = 'client'
    'app-partner' = 'partner'
    'app-captain' = 'captain'
    'app-field'   = 'field'
}

foreach ($appName in $appMap.Keys) {
    $platform = $appMap[$appName]
    $appRoot = Join-Path $repoRoot ("apps\mobile\{0}" -f $appName)
    $indexPath = Join-Path $appRoot 'index.js'
    $appTsxPath = Join-Path $appRoot 'App.tsx'
    $packageJsonPath = Join-Path $appRoot 'package.json'
    $projectJsonPath = Join-Path $appRoot 'project.json'
    $expectedImport = "@bthwani/surfaces/src/platform/$platform/mobile-entry"

    if (Test-Path $appRoot) {
        Add-Finding -Id ("APP-ROOT-{0}" -f $appName) -Status 'PASS' -Category 'mobile-app' -Message ("App root exists: {0}" -f $appName) -Path $appRoot
    } else {
        Add-Finding -Id ("APP-ROOT-{0}" -f $appName) -Status 'FAIL' -Category 'mobile-app' -Message ("App root missing: {0}" -f $appName) -Path $appRoot
        continue
    }

    if (Test-Path $indexPath) {
        $indexText = Get-Text -Path $indexPath
        Add-Finding -Id ("APP-INDEX-{0}" -f $appName) -Status 'PASS' -Category 'mobile-entry' -Message 'index.js exists.' -Path $indexPath

        if ($indexText -match 'registerRootComponent') {
            Add-Finding -Id ("APP-REGISTER-{0}" -f $appName) -Status 'PASS' -Category 'mobile-entry' -Message 'index.js registers Expo root component.' -Path $indexPath
        } else {
            Add-Finding -Id ("APP-REGISTER-{0}" -f $appName) -Status 'FAIL' -Category 'mobile-entry' -Message 'index.js does not register Expo root component.' -Path $indexPath
        }

        if ($indexText -match "from './App.tsx'" -or $indexText -match 'from "./App.tsx"') {
            Add-Finding -Id ("APP-EXPECT-APPTSX-{0}" -f $appName) -Status 'INFO' -Category 'mobile-entry' -Message 'index.js expects ./App.tsx.' -Path $indexPath
        } else {
            Add-Finding -Id ("APP-EXPECT-APPTSX-{0}" -f $appName) -Status 'WARN' -Category 'mobile-entry' -Message 'index.js does not reference ./App.tsx. Custom entry or incomplete shell.' -Path $indexPath
        }
    } else {
        Add-Finding -Id ("APP-INDEX-{0}" -f $appName) -Status 'FAIL' -Category 'mobile-entry' -Message 'index.js is missing.' -Path $indexPath
    }

    if (Test-Path $appTsxPath) {
        $appText = Get-Text -Path $appTsxPath
        $lines = (Get-Content -Path $appTsxPath).Count
        Add-Finding -Id ("APP-APPTSX-{0}" -f $appName) -Status 'PASS' -Category 'mobile-entry' -Message 'App.tsx exists.' -Path $appTsxPath -Details $lines

        if ($lines -le 10) {
            Add-Finding -Id ("APP-THIN-{0}" -f $appName) -Status 'PASS' -Category 'thin-shell' -Message ("App.tsx is thin for {0}." -f $appName) -Path $appTsxPath -Details $lines
        } else {
            Add-Finding -Id ("APP-THIN-{0}" -f $appName) -Status 'WARN' -Category 'thin-shell' -Message ("App.tsx is heavier than expected for {0}." -f $appName) -Path $appTsxPath -Details $lines
        }

        if ($appText -match [regex]::Escape($expectedImport)) {
            Add-Finding -Id ("APP-IMPORT-{0}" -f $appName) -Status 'PASS' -Category 'thin-shell' -Message ("App.tsx imports the expected surfaces mobile entry for {0}." -f $platform) -Path $appTsxPath
        } elseif ($appText -match '@bthwani/surface-mobile') {
            Add-Finding -Id ("APP-IMPORT-{0}" -f $appName) -Status 'FAIL' -Category 'thin-shell' -Message ("App.tsx still imports @bthwani/surface-mobile for {0}." -f $platform) -Path $appTsxPath
        } else {
            Add-Finding -Id ("APP-IMPORT-{0}" -f $appName) -Status 'FAIL' -Category 'thin-shell' -Message ("App.tsx does not import the expected surfaces mobile entry for {0}." -f $platform) -Path $appTsxPath
        }
    } else {
        Add-Finding -Id ("APP-APPTSX-{0}" -f $appName) -Status 'FAIL' -Category 'mobile-entry' -Message 'App.tsx is absent.' -Path $appTsxPath
    }

    $pkg = Read-Json -Path $packageJsonPath
    if ($pkg) {
        Add-Finding -Id ("APP-PKG-{0}" -f $appName) -Status 'PASS' -Category 'mobile-package' -Message 'package.json is readable.' -Path $packageJsonPath
        $deps = Get-DepMap -Pkg $pkg

        foreach ($dep in @('expo','react','react-native','@bthwani/surfaces')) {
            if ($deps.ContainsKey($dep)) {
                Add-Finding -Id ("APP-DEP-{0}-{1}" -f $appName, ($dep -replace '[^A-Za-z0-9]','_')) -Status 'PASS' -Category 'mobile-package' -Message ("Dependency present for {0}: {1}" -f $appName, $dep) -Path $packageJsonPath -Details $deps[$dep]
            } else {
                Add-Finding -Id ("APP-DEP-{0}-{1}" -f $appName, ($dep -replace '[^A-Za-z0-9]','_')) -Status 'FAIL' -Category 'mobile-package' -Message ("Dependency missing for {0}: {1}" -f $appName, $dep) -Path $packageJsonPath
            }
        }

        if ($deps.ContainsKey('@bthwani/surface-browser')) {
            if (Test-Path $surfaceBrowserRoot) {
                Add-Finding -Id ("APP-SBDEP-{0}" -f $appName) -Status 'PASS' -Category 'workspace-package' -Message ("surface-browser dependency is resolvable for {0}." -f $appName) -Path $packageJsonPath
            } else {
                Add-Finding -Id ("APP-SBDEP-{0}" -f $appName) -Status 'FAIL' -Category 'workspace-package' -Message ("surface-browser dependency is declared but package is missing for {0}." -f $appName) -Path $packageJsonPath
            }
        } else {
            Add-Finding -Id ("APP-SBDEP-{0}" -f $appName) -Status 'PASS' -Category 'workspace-package' -Message ("surface-browser dependency is absent for {0}." -f $appName) -Path $packageJsonPath
        }

        if ($deps.ContainsKey('@bthwani/surface-mobile')) {
            Add-Finding -Id ("APP-SMDEP-{0}" -f $appName) -Status 'FAIL' -Category 'workspace-package' -Message ("surface-mobile dependency is still declared for {0}." -f $appName) -Path $packageJsonPath
        } else {
            Add-Finding -Id ("APP-SMDEP-{0}" -f $appName) -Status 'PASS' -Category 'workspace-package' -Message ("surface-mobile dependency is absent for {0}." -f $appName) -Path $packageJsonPath
        }

        if ($deps.ContainsKey('react-native-web')) {
            Add-Finding -Id ("APP-RNW-{0}" -f $appName) -Status 'INFO' -Category 'web-stack' -Message ("react-native-web dependency declared for {0}." -f $appName) -Path $packageJsonPath -Details $deps['react-native-web']
        } else {
            Add-Finding -Id ("APP-RNW-{0}" -f $appName) -Status 'WARN' -Category 'web-stack' -Message ("react-native-web is not declared for {0}; web bundling will be unsafe if Expo requests web." -f $appName) -Path $packageJsonPath
        }
    } else {
        Add-Finding -Id ("APP-PKG-{0}" -f $appName) -Status 'FAIL' -Category 'mobile-package' -Message 'package.json is unreadable.' -Path $packageJsonPath
    }

    $project = Read-Json -Path $projectJsonPath
    if ($project) {
        Add-Finding -Id ("APP-PROJECT-{0}" -f $appName) -Status 'PASS' -Category 'nx-targets' -Message 'project.json is readable.' -Path $projectJsonPath
        if ($project.targets.expo) {
            Add-Finding -Id ("APP-EXPO-{0}" -f $appName) -Status 'PASS' -Category 'nx-targets' -Message 'Expo target exists.' -Path $projectJsonPath
        } else {
            Add-Finding -Id ("APP-EXPO-{0}" -f $appName) -Status 'FAIL' -Category 'nx-targets' -Message 'Expo target missing.' -Path $projectJsonPath
        }
    } else {
        Add-Finding -Id ("APP-PROJECT-{0}" -f $appName) -Status 'FAIL' -Category 'nx-targets' -Message 'project.json is unreadable.' -Path $projectJsonPath
    }
}

# ----------------------------------------------------------------------
# 4) Expo / web-path risk markers
# ----------------------------------------------------------------------
$startPreviewScript = Join-Path $repoRoot 'tools\scripts\start-mobile-preview.ps1'
if (Test-Path $startPreviewScript) {
    $scriptText = Get-Text -Path $startPreviewScript
    Add-Finding -Id 'EXPO-SCRIPT-001' -Status 'PASS' -Category 'tooling' -Message 'start-mobile-preview.ps1 exists.' -Path $startPreviewScript
    if ($scriptText -match '--go') {
        Add-Finding -Id 'EXPO-SCRIPT-002' -Status 'INFO' -Category 'tooling' -Message 'start-mobile-preview.ps1 uses expo --go.' -Path $startPreviewScript
    }
} else {
    Add-Finding -Id 'EXPO-SCRIPT-001' -Status 'FAIL' -Category 'tooling' -Message 'start-mobile-preview.ps1 is missing.' -Path $startPreviewScript
}

$appsCount = @(Get-ChildItem -Path (Join-Path $repoRoot 'apps') -Recurse -Force -ErrorAction SilentlyContinue).Count
Add-Finding -Id 'APPS-CENSUS' -Status 'INFO' -Category 'census' -Message ("apps/ filesystem entries: {0}" -f $appsCount) -Path (Join-Path $repoRoot 'apps')

# ----------------------------------------------------------------------
# 5) Write evidence
# ----------------------------------------------------------------------
$status = if ($critical.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }
$summaryLines = @(
    'CHECK_ANALYZE_EXPO_SURFACES_SHELL_DEEP',
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

Write-Host '-----------------------------------------------------------------------' -ForegroundColor Cyan
Write-Host ("STATUS: {0}" -f $status) -ForegroundColor $(if ($status -eq 'PASS') { 'Green' } elseif ($status -eq 'WARN') { 'Yellow' } else { 'Red' })
Write-Host ("Critical Failures: {0}" -f $critical.Count)
Write-Host ("Warnings: {0}" -f $warnings.Count)
Write-Host ("summary.txt => {0}" -f $summaryPath)
Write-Host ("evidence.json => {0}" -f $evidencePath)
Write-Host '=======================================================================' -ForegroundColor Cyan
Write-Host ''
