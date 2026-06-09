param(
  [string]$ChangedFilesPath
)

$ErrorActionPreference = "Stop"

function Normalize-RepoPath([string]$Path) {
  if ($null -eq $Path) { return "" }
  return (($Path -replace "\\","/").Trim().TrimStart("./"))
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($repoRoot)) {
  $repoRoot = (Get-Location).Path
}
$repoRootFull = [System.IO.Path]::GetFullPath($repoRoot)
Set-Location -LiteralPath $repoRootFull

$allowedRoots = @(
  "tools/scripts",
  "tools/guards"
)

# Legacy exact wrappers/tools that pre-existed before this policy.
# Do not add broad roots here.
$legacyAllowedExact = @(
  "analyze_uikit.ps1",
  "tools/generate-dsh-fixture-images.ps1",
  "tools/GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1",
  "tools/ghb.ps1",
  "docker/local.ps1"
)

function Test-ExistsInIndexOrWorktree([string]$RelativePath) {
  $p = Normalize-RepoPath $RelativePath
  if ([string]::IsNullOrWhiteSpace($p)) { return $false }

  git cat-file -e ":$p" 2>$null
  if ($LASTEXITCODE -eq 0) { return $true }

  if (Test-Path -LiteralPath $p) { return $true }

  return $false
}

function Test-IsAllowedPs1([string]$RelativePath) {
  $normalized = Normalize-RepoPath $RelativePath

  foreach ($root in $allowedRoots) {
    if ($normalized -eq $root -or $normalized -like "$root/*") {
      return $true
    }
  }

  foreach ($exact in $legacyAllowedExact) {
    if ($normalized -eq $exact) {
      return $true
    }
  }

  return $false
}

$violations = New-Object System.Collections.Generic.List[string]

if ($ChangedFilesPath -and (Test-Path -LiteralPath $ChangedFilesPath)) {
  $changed = Get-Content -LiteralPath $ChangedFilesPath -ErrorAction Stop |
    ForEach-Object { Normalize-RepoPath $_ } |
    Where-Object { $_ -ne "" }

  foreach ($f in $changed) {
    if ($f -notmatch '\.ps1$') { continue }

    # Important: name-only diffs include deleted/renamed old paths.
    # Those are not final-index executable scripts and must not be false positives.
    if (-not (Test-ExistsInIndexOrWorktree $f)) {
      continue
    }

    if (-not (Test-IsAllowedPs1 $f)) {
      $violations.Add((Join-Path $repoRootFull $f)) | Out-Null
    }
  }
} else {
  $tracked = git ls-files "*.ps1"
  foreach ($f in $tracked) {
    $fNorm = Normalize-RepoPath $f
    if (-not (Test-ExistsInIndexOrWorktree $fNorm)) { continue }
    if (-not (Test-IsAllowedPs1 $fNorm)) {
      $violations.Add((Join-Path $repoRootFull $fNorm)) | Out-Null
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
  Write-Host "Legacy exact allowlist:"
  $legacyAllowedExact | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host "OK: no disallowed PS1 files found in checked set."
exit 0
