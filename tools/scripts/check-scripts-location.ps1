param(
    [string]$RepoRoot = ".",
    [string[]]$AllowedRelative = @("tools/scripts", "tools/guards"),
    [string]$ChangedFilesPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRootFull = (Resolve-Path $RepoRoot).Path

function Normalize-RepoPath([string]$PathValue) {
    return ($PathValue -replace '\\','/').TrimStart('/')
}

$allowedRoots = @($AllowedRelative | ForEach-Object { Normalize-RepoPath $_ })

$legacyAllowedPatterns = @(
    '^tools/(APPLY_AGENCY_SKILLS_PHASE1_SAFE_GUARDS|CHECK_AGENCY_AGENTS_DEEP_DIAGNOSIS_V2|generate-dsh-fixture-images)\.ps1$',
    '^kdt/merge-run/.*/proposed/[^/]+\.ps1$'
)

function Test-IsAllowedPs1([string]$RelativePath) {
    $normalized = Normalize-RepoPath $RelativePath

    foreach ($root in $allowedRoots) {
        if ($normalized -eq $root -or $normalized -like "$root/*") {
            return $true
        }
    }

    foreach ($pattern in $legacyAllowedPatterns) {
        if ($normalized -match $pattern) {
            return $true
        }
    }

    return $false
}

$violations = @()

if ($ChangedFilesPath -and (Test-Path $ChangedFilesPath)) {
    $changed = Get-Content -Path $ChangedFilesPath -ErrorAction Stop |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -ne "" }

    foreach ($f in $changed) {
        $fNormalized = Normalize-RepoPath $f
        if ($fNormalized -match '\.ps1$' -and -not (Test-IsAllowedPs1 $fNormalized)) {
            $violations += (Join-Path $repoRootFull $f)
        }
    }
} else {
    $toolsDir = Join-Path $repoRootFull "tools"
    if (-not (Test-Path $toolsDir)) {
        Write-Host "No tools directory found at $toolsDir. Nothing to check."
        exit 0
    }

    $all = Get-ChildItem -Path $toolsDir -Recurse -File -Include *.ps1 -ErrorAction SilentlyContinue
    foreach ($it in $all) {
        $rel = $it.FullName.Substring($repoRootFull.Length).TrimStart('\','/')
        $relNorm = Normalize-RepoPath $rel
        if (-not (Test-IsAllowedPs1 $relNorm)) {
            $violations += $it.FullName
        }
    }
}

if ($violations.Count -gt 0) {
    Write-Host "ERROR: Found PowerShell scripts outside allowed roots:"
    $violations | ForEach-Object { Write-Host " - $_" }
    Write-Host ""
    Write-Host "Allowed roots:"
    $allowedRoots | ForEach-Object { Write-Host " - $_" }
    Write-Host ""
    Write-Host "To fix: move new scripts into tools/scripts or tools/guards, or update tools/SCRIPTS_LOCATION_POLICY.md and this guard intentionally."
    exit 1
}

Write-Host "OK: no disallowed PS1 files found in checked set."
exit 0