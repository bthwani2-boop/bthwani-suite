Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

# =============================================================================
# BThwani Agent-Neutral Deep Diagnostic Launcher V5 - STRICT DSH + CLEAN GRAPHIFY
#
# Fixed scope only:
#   dsh
#   wlt
#   ui-kit
#   control-panel
#   app-client
#   app-partner
#   app-captain
#   app-field
#
# Policies:
#   - No packages/services assumption.
#   - No Madge.
#   - No Semgrep project dependency. Semgrep extension remains editor-only.
#   - Clean only graphify-out\agent-neutral-deep-diagnostic before running.
#   - Do not delete tools\registry\runs.
#   - Do not modify source files.
# =============================================================================

$RepoRoot = "C:\bthwani-suite"
Set-Location -LiteralPath $RepoRoot

$DiagnosticScript = Join-Path $PSScriptRoot "RUN_AGENT_NEUTRAL_DEEP_DIAGNOSTIC_V2.ps1"
$GraphifyDiagnosticOut = "C:\bthwani-suite\graphify-out\agent-neutral-deep-diagnostic"

$StrictScopeRoots = @(
  "dsh",
  "wlt",
  "ui-kit",
  "control-panel",
  "app-client",
  "app-partner",
  "app-captain",
  "app-field"
)

function Get-CurrentBranch {
  try {
    return (git branch --show-current 2>$null).Trim()
  } catch {
    return ""
  }
}

function Join-ExistingStrictRoots {
  param([string[]]$Roots)

  $existing = New-Object System.Collections.Generic.List[string]
  $missing = New-Object System.Collections.Generic.List[string]

  foreach ($root in $Roots) {
    if (Test-Path -LiteralPath (Join-Path $RepoRoot $root)) {
      $existing.Add($root) | Out-Null
    } else {
      $missing.Add($root) | Out-Null
    }
  }

  if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "WARNING: Missing strict scope roots; diagnostic script will not scan them:"
    $missing | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
  }

  if ($existing.Count -eq 0) {
    throw "No strict scope roots exist under $RepoRoot."
  }

  return (($existing | Select-Object -Unique) -join ",")
}

function Reset-GraphifyDiagnosticOut {
  param([Parameter(Mandatory=$true)][string]$Path)

  $full = [System.IO.Path]::GetFullPath($Path)
  $allowedPrefix = [System.IO.Path]::GetFullPath("C:\bthwani-suite\graphify-out\")

  if (-not $full.StartsWith($allowedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to clean outside graphify-out: $full"
  }

  if ($full -eq $allowedPrefix.TrimEnd("\")) {
    throw "Refusing to clean graphify-out root directly: $full"
  }

  if (Test-Path -LiteralPath $full) {
    Remove-Item -LiteralPath $full -Recurse -Force
  }

  New-Item -ItemType Directory -Force -Path $full | Out-Null
}

$currentBranch = Get-CurrentBranch
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
  $currentBranch = "feat/dsh-surface-refactor"
}

$Scope = Join-ExistingStrictRoots -Roots $StrictScopeRoots

if (!(Test-Path -LiteralPath $DiagnosticScript)) {
  throw "Diagnostic script not found: $DiagnosticScript"
}

Write-Host ""
Write-Host "=== BThwani Strict DSH Diagnostic Launcher V5 ==="
Write-Host "Repo:              $RepoRoot"
Write-Host "Branch:            $currentBranch"
Write-Host "Scope:             $Scope"
Write-Host "Graphify cleanup:  $GraphifyDiagnosticOut"
Write-Host "Diagnostic script: $DiagnosticScript"
Write-Host ""
Write-Host "Semgrep: editor extension only; not run as project guard here."
Write-Host "Madge: not used."
Write-Host ""

Write-Host "Cleaning graphify diagnostic output only..."
Reset-GraphifyDiagnosticOut -Path $GraphifyDiagnosticOut

Write-Host "This will scan ONLY:"
$StrictScopeRoots | ForEach-Object { Write-Host "  - $_" }
Write-Host ""

$env:BTH_DIAG_TASK = "dsh-surface-refactor"
$env:BTH_DIAG_BRANCH = $currentBranch
$env:BTH_DIAG_SCOPE = $Scope
$env:BTH_DIAG_RUN_TSC = "1"
$env:BTH_DIAG_RUN_OPTIONAL = "1"
$env:BTH_DIAG_RUN_SEMGREP = "0"
$env:BTH_DIAG_MAX_REPOMIX_FILES = "40"

Unblock-File -LiteralPath $DiagnosticScript

powershell -ExecutionPolicy Bypass -File $DiagnosticScript
