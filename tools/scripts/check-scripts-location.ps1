# Check scripts location: ensure PowerShell scripts are created under tools/scripts
# Usage:
# - For PR checks: pass a file with changed paths (one per line) via -ChangedFilesPath
#   pwsh -NoProfile -ExecutionPolicy Bypass -File tools/scripts/check-scripts-location.ps1 -ChangedFilesPath changed-files.txt
# - For a full scan (warn-only): run without -ChangedFilesPath

param(
    [string]$RepoRoot = ".",
    [string]$AllowedRelative = "tools/scripts",
    [string]$ChangedFilesPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRootFull = (Resolve-Path $RepoRoot).Path
$allowedRelativeNormalized = $AllowedRelative -replace '\\','/'

$violations = @()

if ($ChangedFilesPath -and (Test-Path $ChangedFilesPath)) {
    $changed = Get-Content -Path $ChangedFilesPath -ErrorAction Stop | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    foreach ($f in $changed) {
        $fNormalized = $f -replace '\\','/'
        if ($fNormalized -match '\.ps1$') {
            if (-not ($fNormalized -like "$allowedRelativeNormalized/*")) {
                $violations += (Join-Path $repoRootFull $f)
            }
        }
    }
} else {
    # Full scan (warn-only)
    $toolsDir = Join-Path $repoRootFull "tools"
    if (-not (Test-Path $toolsDir)) {
        Write-Host "No tools directory found at $toolsDir. Nothing to check."
        exit 0
    }
    $all = Get-ChildItem -Path $toolsDir -Recurse -File -Include *.ps1 -ErrorAction SilentlyContinue
    foreach ($it in $all) {
        $rel = $it.FullName.Substring($repoRootFull.Length).TrimStart('\','/')
        $relNorm = $rel -replace '\\','/'
        if (-not ($relNorm -like "$allowedRelativeNormalized/*")) {
            $violations += $it.FullName
        }
    }
}

if ($violations.Count -gt 0) {
    Write-Host "ERROR: Found PowerShell scripts outside $AllowedRelative:"
    $violations | ForEach-Object { Write-Host " - $_" }
    Write-Host ""
    Write-Host "To fix: move these scripts into $AllowedRelative or update the policy file tools/SCRIPTS_LOCATION_POLICY.md"
    exit 1
} else {
    Write-Host "OK: no PS1 files outside $AllowedRelative found in checked set."
    exit 0
}
