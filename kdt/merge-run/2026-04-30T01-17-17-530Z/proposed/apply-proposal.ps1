Param(
    [switch]$DryRun = $true,
    [switch]$Commit = $false
)

$root = Get-Location
$prFile = Join-Path $root 'kdt/merge-run/2026-04-30T01-17-17-530Z/proposed/pr_changes.json'
if (-not (Test-Path $prFile)) {
    Write-Error "pr_changes.json not found at $prFile"
    exit 1
}

$changes = Get-Content $prFile -Raw | ConvertFrom-Json

# Safety: require expected branch and clean working tree
$branch = ''
try { $branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim() } catch { $branch = '' }
Write-Host "Current branch: $branch"
if ($branch -ne 'governance/demo-service-pilot') {
    Write-Error "Expected to run on branch 'governance/demo-service-pilot'. Current branch: '$branch'. Aborting to preserve safety."
    exit 2
}

$porcelain = git status --porcelain
if ($porcelain.Trim()) {
    Write-Error "Working tree is not clean: commit or stash changes before applying. Aborting."
    exit 3
}

# Validate canonical targets exist
$missing = @()
foreach ($c in $changes) {
    $t = Join-Path $root ($c.target.Replace('/','\'))
    if (-not (Test-Path $t)) { $missing += $c }
}
if ($missing.Count -gt 0) {
    Write-Host "Missing canonical target files: $($missing.Count)"
    foreach ($m in $missing) { Write-Host " - $($m.target) (from $($m.source))" }
    Write-Error "Aborting: canonical drafts missing. Generate missing files before applying."
    exit 4
}

# Prepare archive root
$timestamp = (Get-Date).ToString('yyyyMMddTHHmmssZ')
$archiveRoot = Join-Path $root "governance\archive\$timestamp"

if ($DryRun) { Write-Host "DRY-RUN: Would create archive root: $archiveRoot" } else { New-Item -ItemType Directory -Path $archiveRoot -Force | Out-Null }

foreach ($c in $changes) {
    $src = Join-Path $root ($c.source.Replace('/','\'))
    $tgt = Join-Path $root ($c.target.Replace('/','\'))

    if (-not (Test-Path $src)) {
        Write-Error "Source missing: $src. Aborting."
        exit 5
    }

    $parent = Split-Path $c.source -Parent
    if ([string]::IsNullOrEmpty($parent)) { $archiveDest = $archiveRoot } else { $archiveDest = Join-Path $archiveRoot $parent }

    if ($DryRun) {
        Write-Host "DRY-RUN: Would copy '$src' to archive location '$archiveDest\'"
        Write-Host "DRY-RUN: Would replace '$src' with canonical '$tgt'"
    } else {
        New-Item -ItemType Directory -Path $archiveDest -Force | Out-Null
        Copy-Item -Path $src -Destination $archiveDest -Force
        Copy-Item -Path $tgt -Destination $src -Force
        Write-Host "Replaced: $src (backup at $archiveDest)"
    }
}

if ($DryRun) { Write-Host "DRY-RUN complete. No files modified." } else {
    Write-Host "Apply complete. Archival root: $archiveRoot"
    if ($Commit) {
        git add governance
        git commit -m "chore(gov): canonicalize governance corpus (applied via kdt/merge-run)"
        Write-Host "Committed changes."
    } else {
        Write-Host "No commit performed. Review changes and commit when ready."
    }
}

exit 0
