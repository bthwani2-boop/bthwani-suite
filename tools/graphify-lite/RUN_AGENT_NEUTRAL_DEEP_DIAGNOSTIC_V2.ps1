Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# =============================================================================
# BThwani Agent-Neutral Deep Diagnostic Script V2
# Mode: READ-ONLY against source code. Writes only diagnostics/evidence outputs.
# Target: C:\bthwani-suite
# Output:
#   - graphify-out\...
#   - tools\registry\runs\AGENT_NEUTRAL_DEEP_DIAG-YYYYMMDD-HHMMSS\...
#   - _HANDOFF.zip inside the run folder
#
# Usage:
#   PowerShell:
#     Set-Location -LiteralPath "C:\bthwani-suite"
#     powershell -ExecutionPolicy Bypass -File .\tools\graphify-lite\RUN_AGENT_NEUTRAL_DEEP_DIAGNOSTIC_V2.ps1
#
# Optional environment overrides before running:
#   $env:BTH_DIAG_TASK = "dsh-surface-refactor"
#   $env:BTH_DIAG_BRANCH = "feat/dsh-surface-refactor"
#   $env:BTH_DIAG_SCOPE = "dsh,packages,apps,services,control-panel"
#   $env:BTH_DIAG_RUN_TSC = "1"
#   $env:BTH_DIAG_RUN_OPTIONAL = "1"
#   $env:BTH_DIAG_RUN_SEMGREP = "0"
#   $env:BTH_DIAG_MAX_REPOMIX_FILES = "40"
# =============================================================================

$RepoRoot = "C:\bthwani-suite"
$TaskName = if ($env:BTH_DIAG_TASK) { $env:BTH_DIAG_TASK } else { "agent-neutral-deep-diagnostic" }
$ExpectedBranch = if ($env:BTH_DIAG_BRANCH) { $env:BTH_DIAG_BRANCH } else { "feat/dsh-surface-refactor" }
$ScopeText = if ($env:BTH_DIAG_SCOPE) { $env:BTH_DIAG_SCOPE } else { "dsh,wlt,control-panel" }
$RunTsc = if ($env:BTH_DIAG_RUN_TSC) { $env:BTH_DIAG_RUN_TSC -ne "0" } else { $true }
$RunOptional = if ($env:BTH_DIAG_RUN_OPTIONAL) { $env:BTH_DIAG_RUN_OPTIONAL -ne "0" } else { $true }
$RunSemgrep = if ($env:BTH_DIAG_RUN_SEMGREP) { $env:BTH_DIAG_RUN_SEMGREP -eq "1" } else { $false }
$MaxRepomixFiles = if ($env:BTH_DIAG_MAX_REPOMIX_FILES) { [int]$env:BTH_DIAG_MAX_REPOMIX_FILES } else { 40 }

$TimeStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "AGENT_NEUTRAL_DEEP_DIAG_V2-$TimeStamp"
$RunRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
$GraphifyOut = Join-Path $RepoRoot "graphify-out"
$DiagOut = Join-Path $GraphifyOut "agent-neutral-deep-diagnostic"
$CommandLog = Join-Path $RunRoot "commands.log"
$Results = New-Object System.Collections.Generic.List[object]
$Warnings = New-Object System.Collections.Generic.List[string]
$Errors = New-Object System.Collections.Generic.List[string]

New-Item -ItemType Directory -Force -Path $RunRoot, $GraphifyOut, $DiagOut | Out-Null

function Write-Utf8File {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][AllowEmptyString()][string]$Content
  )
  $parent = Split-Path -Parent $Path
  if ($parent -and !(Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }
  [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function Add-Log {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "s"), $Message
  Add-Content -LiteralPath $CommandLog -Value $line -Encoding UTF8
}

function Test-Cmd {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Add-Result {
  param(
    [string]$Name,
    [string]$Status,
    [string]$OutputFile,
    [int]$ExitCode,
    [string]$Command
  )
  $Results.Add([pscustomobject]@{
    name = $Name
    status = $Status
    output_file = if ($OutputFile) { Resolve-Path -LiteralPath $OutputFile -ErrorAction SilentlyContinue | ForEach-Object { $_.Path.Replace($RunRoot + "\", "") } } else { "" }
    exit_code = $ExitCode
    command = $Command
  }) | Out-Null
}

function Invoke-Captured {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][string]$Exe,
    [string[]]$Args = @(),
    [Parameter(Mandatory=$true)][string]$OutputFile,
    [switch]$Optional
  )

  $cmdForLog = "$Exe " + (($Args | ForEach-Object {
    if ($_ -match '\s') { '"' + $_ + '"' } else { $_ }
  }) -join " ")
  Add-Log "RUN [$Name]: $cmdForLog"

  if (!(Test-Cmd $Exe)) {
    $msg = "Command not found: $Exe"
    Write-Utf8File -Path $OutputFile -Content $msg
    if ($Optional) {
      $Warnings.Add("$Name skipped: $msg") | Out-Null
      Add-Result -Name $Name -Status "SKIPPED" -OutputFile $OutputFile -ExitCode 127 -Command $cmdForLog
      return 127
    } else {
      $Errors.Add("$Name failed: $msg") | Out-Null
      Add-Result -Name $Name -Status "MISSING_COMMAND" -OutputFile $OutputFile -ExitCode 127 -Command $cmdForLog
      return 127
    }
  }

  try {
    $output = & $Exe @Args 2>&1
    $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
    $text = ($output | Out-String)
    Write-Utf8File -Path $OutputFile -Content $text

    if ($exitCode -eq 0) {
      Add-Result -Name $Name -Status "PASS" -OutputFile $OutputFile -ExitCode $exitCode -Command $cmdForLog
    } elseif ($Optional) {
      $Warnings.Add("$Name returned exit code $exitCode") | Out-Null
      Add-Result -Name $Name -Status "WARN" -OutputFile $OutputFile -ExitCode $exitCode -Command $cmdForLog
    } else {
      $Errors.Add("$Name returned exit code $exitCode") | Out-Null
      Add-Result -Name $Name -Status "FAIL" -OutputFile $OutputFile -ExitCode $exitCode -Command $cmdForLog
    }
    return $exitCode
  } catch {
    $msg = $_ | Out-String
    Write-Utf8File -Path $OutputFile -Content $msg
    if ($Optional) {
      $Warnings.Add("$Name exception: $($_.Exception.Message)") | Out-Null
      Add-Result -Name $Name -Status "WARN_EXCEPTION" -OutputFile $OutputFile -ExitCode 1 -Command $cmdForLog
    } else {
      $Errors.Add("$Name exception: $($_.Exception.Message)") | Out-Null
      Add-Result -Name $Name -Status "FAIL_EXCEPTION" -OutputFile $OutputFile -ExitCode 1 -Command $cmdForLog
    }
    return 1
  }
}

function Get-PackageScripts {
  $pkgPath = Join-Path $RepoRoot "package.json"
  if (!(Test-Path -LiteralPath $pkgPath)) { return @{} }
  try {
    $pkg = Get-Content -LiteralPath $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $map = @{}
    if ($pkg.scripts) {
      $pkg.scripts.PSObject.Properties | ForEach-Object {
        $map[$_.Name] = [string]$_.Value
      }
    }
    return $map
  } catch {
    $Warnings.Add("Could not parse package.json scripts: $($_.Exception.Message)") | Out-Null
    return @{}
  }
}

function Run-PnpmScriptIfExists {
  param(
    [Parameter(Mandatory=$true)][hashtable]$Scripts,
    [Parameter(Mandatory=$true)][string]$ScriptName,
    [Parameter(Mandatory=$true)][string]$OutputFile,
    [switch]$Optional
  )
  if ($Scripts.ContainsKey($ScriptName)) {
    return Invoke-Captured -Name "pnpm run $ScriptName" -Exe "pnpm" -Args @("run", $ScriptName) -OutputFile $OutputFile -Optional:$Optional
  }
  $msg = "Script not found in package.json: $ScriptName"
  Write-Utf8File -Path $OutputFile -Content $msg
  $Warnings.Add($msg) | Out-Null
  Add-Result -Name "pnpm run $ScriptName" -Status "SKIPPED" -OutputFile $OutputFile -ExitCode 127 -Command "pnpm run $ScriptName"
  return 127
}

function Extract-RgFilePaths {
  param([string]$Path)
  $set = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  if (!(Test-Path -LiteralPath $Path)) { return @() }
  Get-Content -LiteralPath $Path -Encoding UTF8 -ErrorAction SilentlyContinue | ForEach-Object {
    $line = $_
    if ($line -match '^(?<p>[A-Za-z]:\\[^:]+|\.[^:]+|[^:]+):\d+:') {
      $p = $Matches["p"]
      if ($p -and $p -notmatch '^\s*$') {
        $normalized = $p -replace '/', '\'
        if ($normalized.StartsWith(".\")) { $normalized = $normalized.Substring(2) }
        [void]$set.Add($normalized)
      }
    }
  }
  return @($set | Sort-Object)
}

function Get-ExistingScopeRoots {
  $roots = @()
  $ScopeText.Split(",") | ForEach-Object {
    $p = $_.Trim()
    if ($p) {
      $full = Join-Path $RepoRoot $p
      if (Test-Path -LiteralPath $full) { $roots += $p }
      else { $Warnings.Add("Scope path not found, skipped: $p") | Out-Null }
    }
  }
  return $roots
}

$ScopeRoots = Get-ExistingScopeRoots
$Scripts = Get-PackageScripts

# -----------------------------------------------------------------------------
# 00 Environment snapshot
# -----------------------------------------------------------------------------
$envInfo = [ordered]@{
  repo_root = $RepoRoot
  task_name = $TaskName
  expected_branch = $ExpectedBranch
  scope_roots = $ScopeRoots
  session_id = $SessionId
  run_root = $RunRoot
  graphify_out = $GraphifyOut
  started_at = (Get-Date).ToString("s")
  tools = [ordered]@{
    git = Test-Cmd "git"
    node = Test-Cmd "node"
    pnpm = Test-Cmd "pnpm"
    rg = Test-Cmd "rg"
    fd = (Test-Cmd "fd")
    fdfind = (Test-Cmd "fdfind")
    repomix = (Test-Cmd "repomix")
    semgrep = (Test-Cmd "semgrep")
  }
}
Write-Utf8File -Path (Join-Path $RunRoot "00-env.json") -Content (($envInfo | ConvertTo-Json -Depth 10))

# -----------------------------------------------------------------------------
# 01 Git diagnostics
# -----------------------------------------------------------------------------
Invoke-Captured -Name "git branch" -Exe "git" -Args @("branch", "--show-current") -OutputFile (Join-Path $RunRoot "01-git-branch.txt")
Invoke-Captured -Name "git rev-parse HEAD" -Exe "git" -Args @("rev-parse", "HEAD") -OutputFile (Join-Path $RunRoot "01-git-head.txt")
Invoke-Captured -Name "git status short" -Exe "git" -Args @("--no-pager", "status", "--short") -OutputFile (Join-Path $RunRoot "01-git-status-short.txt")
Invoke-Captured -Name "git log recent" -Exe "git" -Args @("--no-pager", "log", "--oneline", "-n", "12") -OutputFile (Join-Path $RunRoot "01-git-log-oneline.txt")
Invoke-Captured -Name "git untracked" -Exe "git" -Args @("ls-files", "--others", "--exclude-standard") -OutputFile (Join-Path $RunRoot "01-git-untracked.txt")
Invoke-Captured -Name "git diff stat" -Exe "git" -Args @("--no-pager", "diff", "--stat") -OutputFile (Join-Path $RunRoot "01-git-diff-stat.txt")
Invoke-Captured -Name "git diff name-status" -Exe "git" -Args @("--no-pager", "diff", "--name-status") -OutputFile (Join-Path $RunRoot "01-git-diff-name-status.txt")
Invoke-Captured -Name "git diff check" -Exe "git" -Args @("--no-pager", "diff", "--check") -OutputFile (Join-Path $RunRoot "01-git-diff-check.txt")

# Compare with origin/main if available locally.
Invoke-Captured -Name "git compare origin/main...HEAD" -Exe "git" -Args @("rev-list", "--left-right", "--count", "origin/main...HEAD") -OutputFile (Join-Path $RunRoot "01-git-origin-main-ahead-behind.txt") -Optional
Invoke-Captured -Name "git changed files vs origin/main" -Exe "git" -Args @("--no-pager", "diff", "--name-status", "origin/main...HEAD") -OutputFile (Join-Path $RunRoot "01-git-changed-files-origin-main.txt") -Optional

# Branch mismatch warning.
$currentBranchPath = Join-Path $RunRoot "01-git-branch.txt"
$currentBranch = ""
if (Test-Path -LiteralPath $currentBranchPath) {
  $currentBranch = (Get-Content -LiteralPath $currentBranchPath -Raw -Encoding UTF8).Trim()
  if ($ExpectedBranch -and $currentBranch -and ($currentBranch -ne $ExpectedBranch)) {
    $Warnings.Add("Current branch '$currentBranch' does not match expected branch '$ExpectedBranch'.") | Out-Null
  }
}

# -----------------------------------------------------------------------------
# 02 Fast discovery: fd / rg
# -----------------------------------------------------------------------------
$fdExe = if (Test-Cmd "fd") { "fd" } elseif (Test-Cmd "fdfind") { "fdfind" } else { "" }
if ($fdExe) {
  $fdArgs = @("-t", "f", ".", "--hidden", "--exclude", ".git", "--exclude", "node_modules", "--exclude", ".next", "--exclude", "dist", "--exclude", "build") + $ScopeRoots
  Invoke-Captured -Name "fd candidate files" -Exe $fdExe -Args $fdArgs -OutputFile (Join-Path $RunRoot "02-fd-candidate-files.txt") -Optional
} else {
  $Warnings.Add("fd/fdfind not found. Candidate file discovery skipped.") | Out-Null
  Write-Utf8File -Path (Join-Path $RunRoot "02-fd-candidate-files.txt") -Content "fd/fdfind not found."
  Add-Result -Name "fd candidate files" -Status "SKIPPED" -OutputFile (Join-Path $RunRoot "02-fd-candidate-files.txt") -ExitCode 127 -Command "fd"
}

$rgPattern = "DshClientSurface|DshClientRouteRenderer|preview-data|dshFinancePreview|operational-statuses\.preview-data|from\s+['""]@tamagui|:\s*any\b|USE_FIXTURES|deliveryFeeNum|hardcoded|TODO|FIXME|console\.log|localStorage|window\."
if ($ScopeRoots.Count -gt 0) {
  $rgArgs = @("-n", "--hidden", "--glob", "!.git/**", "--glob", "!node_modules/**", "--glob", "!.next/**", "--glob", "!dist/**", "--glob", "!build/**", $rgPattern) + $ScopeRoots
  Invoke-Captured -Name "rg deep signals" -Exe "rg" -Args $rgArgs -OutputFile (Join-Path $RunRoot "02-rg-deep-signals.txt") -Optional
}

# -----------------------------------------------------------------------------
# 03 Workspace scripts and graphify-like guards
# -----------------------------------------------------------------------------
$scriptInventory = $Scripts.GetEnumerator() |
  Sort-Object Name |
  ForEach-Object { "{0} = {1}" -f $_.Key, $_.Value }
Write-Utf8File -Path (Join-Path $RunRoot "03-package-scripts.txt") -Content (($scriptInventory | Out-String))

$guardNames = @(
  "guard:depcruise:live-boundaries",
  "guard:ast-grep:live-boundaries",
  "guard:knip:design",
  "guard:jscpd:live",
  "guard:react-scanner:dsh",
  "guard:fixture-media-identity",
  "guard:sherif"
)

foreach ($guard in $guardNames) {
  $safeName = $guard -replace "[:/\\]", "-"
  Run-PnpmScriptIfExists -Scripts $Scripts -ScriptName $guard -OutputFile (Join-Path $RunRoot "03-$safeName.txt") -Optional
}

# -----------------------------------------------------------------------------
# 04 TypeScript verification
# -----------------------------------------------------------------------------
if ($RunTsc) {
  Invoke-Captured -Name "pnpm -w exec tsc --noEmit" -Exe "pnpm" -Args @("-w", "exec", "tsc", "--noEmit") -OutputFile (Join-Path $RunRoot "04-tsc-noemit.txt") -Optional
} else {
  $Warnings.Add("tsc skipped by BTH_DIAG_RUN_TSC=0") | Out-Null
  Write-Utf8File -Path (Join-Path $RunRoot "04-tsc-noemit.txt") -Content "Skipped by BTH_DIAG_RUN_TSC=0"
}

# -----------------------------------------------------------------------------
# 05 Optional security scan: Semgrep
# -----------------------------------------------------------------------------
if ($RunSemgrep) {
  if (Test-Cmd "semgrep") {
    $semgrepJson = Join-Path $RunRoot "05-semgrep.json"
    $semgrepArgs = @("scan", "--config", "auto", "--json", "--output", $semgrepJson) + $ScopeRoots
    Invoke-Captured -Name "semgrep scan" -Exe "semgrep" -Args $semgrepArgs -OutputFile (Join-Path $RunRoot "05-semgrep-console.txt") -Optional
  } else {
    $Warnings.Add("Semgrep requested but command not found.") | Out-Null
    Write-Utf8File -Path (Join-Path $RunRoot "05-semgrep-console.txt") -Content "Semgrep requested but command not found."
  }
} else {
  Write-Utf8File -Path (Join-Path $RunRoot "05-semgrep-console.txt") -Content "Skipped by default. Set BTH_DIAG_RUN_SEMGREP=1 to run."
}

# -----------------------------------------------------------------------------
# 06 Build affected-files list
# -----------------------------------------------------------------------------
$affectedSet = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)

# From git diff origin/main.
$changedPath = Join-Path $RunRoot "01-git-changed-files-origin-main.txt"
if (Test-Path -LiteralPath $changedPath) {
  Get-Content -LiteralPath $changedPath -Encoding UTF8 -ErrorAction SilentlyContinue | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^[AMDRCTUXB]\s+(.+)$') {
      $p = $Matches[1].Trim() -replace '/', '\'
      if ($p) { [void]$affectedSet.Add($p) }
    } elseif ($line -match '^[AMDRCTUXB]\d*\s+(.+?)\s+(.+)$') {
      $p = $Matches[2].Trim() -replace '/', '\'
      if ($p) { [void]$affectedSet.Add($p) }
    }
  }
}

# From git local diff.
$localChangedPath = Join-Path $RunRoot "01-git-diff-name-status.txt"
if (Test-Path -LiteralPath $localChangedPath) {
  Get-Content -LiteralPath $localChangedPath -Encoding UTF8 -ErrorAction SilentlyContinue | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^[AMDRCTUXB]\s+(.+)$') {
      $p = $Matches[1].Trim() -replace '/', '\'
      if ($p) { [void]$affectedSet.Add($p) }
    }
  }
}

# From rg signal paths.
Extract-RgFilePaths -Path (Join-Path $RunRoot "02-rg-deep-signals.txt") | ForEach-Object {
  if ($_ -and (Test-Path -LiteralPath (Join-Path $RepoRoot $_))) { [void]$affectedSet.Add($_) }
}

# Prioritize TypeScript/TSX/JSX/JSON/YAML/MD in allowed scope, avoid huge generated files.
$affectedFiles = @($affectedSet | Where-Object {
  $p = $_
  $full = Join-Path $RepoRoot $p
  (Test-Path -LiteralPath $full) -and
  ($p -notmatch '\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\') -and
  ($p -match '\.(ts|tsx|js|jsx|json|cjs|mjs|yml|yaml|md|css|scss)$')
} | Sort-Object)

Write-Utf8File -Path (Join-Path $RunRoot "06-affected-files.txt") -Content (($affectedFiles | Out-String).Trim())
Copy-Item -LiteralPath (Join-Path $RunRoot "06-affected-files.txt") -Destination (Join-Path $DiagOut "01-affected-files.txt") -Force

# File stats.
$fileStats = foreach ($p in $affectedFiles) {
  $full = Join-Path $RepoRoot $p
  try {
    $item = Get-Item -LiteralPath $full -ErrorAction Stop
    [pscustomobject]@{
      path = $p
      bytes = $item.Length
      extension = $item.Extension
      last_write_time = $item.LastWriteTime.ToString("s")
    }
  } catch {}
}
$fileStats | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $RunRoot "06-affected-file-stats.csv")
Copy-Item -LiteralPath (Join-Path $RunRoot "06-affected-file-stats.csv") -Destination (Join-Path $DiagOut "02-affected-file-stats.csv") -Force

# -----------------------------------------------------------------------------
# 07 Repomix selected context, best effort
# -----------------------------------------------------------------------------
$repomixSelected = Join-Path $DiagOut "09-repomix-selected.xml"
# Prefer live code over docs/agent resources for the agent context pack.
$repomixCandidates = @($affectedFiles | Where-Object {
  ($_ -notmatch '^\.agents\\') -and
  ($_ -notmatch '\\docs\\') -and
  ($_ -notmatch '\.md$') -and
  ($_ -notmatch '\\JOURNIES\\') -and
  ($_ -match '\.(ts|tsx|js|jsx|json|cjs|mjs|yml|yaml|css|scss)$')
})

if ($repomixCandidates.Count -eq 0) {
  $repomixCandidates = @($affectedFiles | Where-Object {
    ($_ -notmatch '^\.agents\\') -and
    ($_ -notmatch '\\docs\\') -and
    ($_ -match '\.(ts|tsx|js|jsx|json|cjs|mjs|yml|yaml|css|scss|md)$')
  })
}

if ($repomixCandidates.Count -eq 0) {
  $repomixCandidates = @($affectedFiles)
}

$selectedForRepomix = @($repomixCandidates | Select-Object -First $MaxRepomixFiles)
# Repomix include patterns work better with forward slashes.
$repomixInclude = (($selectedForRepomix | ForEach-Object { $_ -replace '\\', '/' }) -join ",")

Write-Utf8File -Path (Join-Path $RunRoot "07-repomix-selected-files.txt") -Content (($selectedForRepomix | Out-String).Trim())

if ($selectedForRepomix.Count -eq 0) {
  $Warnings.Add("No selected files for Repomix.") | Out-Null
  Write-Utf8File -Path (Join-Path $RunRoot "07-repomix-console.txt") -Content "No selected files for Repomix."
} elseif (Test-Cmd "repomix") {
  Invoke-Captured -Name "repomix selected files" -Exe "repomix" -Args @("--include", $repomixInclude, "--output", $repomixSelected, "--compress") -OutputFile (Join-Path $RunRoot "07-repomix-console.txt") -Optional
} elseif (Test-Cmd "pnpm") {
  Invoke-Captured -Name "pnpm exec repomix selected files" -Exe "pnpm" -Args @("exec", "repomix", "--include", $repomixInclude, "--output", $repomixSelected, "--compress") -OutputFile (Join-Path $RunRoot "07-repomix-console.txt") -Optional
} else {
  $Warnings.Add("Repomix not available. Context pack not generated.") | Out-Null
  Write-Utf8File -Path (Join-Path $RunRoot "07-repomix-console.txt") -Content "Repomix not available. Install/use Repomix, then run on 06-affected-files.txt."
}

if (!(Test-Path -LiteralPath $repomixSelected)) {
  Write-Utf8File -Path $repomixSelected -Content "<repomix-skipped>No repomix output generated. See tools\registry\runs\$SessionId\07-repomix-console.txt</repomix-skipped>"
}

# -----------------------------------------------------------------------------
# 08 Agent-neutral task card and verification instructions
# -----------------------------------------------------------------------------
$taskCard = @"
# Agent-Neutral Task Card

## Task
$TaskName

## Mode
Use one agent only. This package is agent-neutral and can be used with Codex, Claude Code, or Gemini.

## Current branch
$currentBranch

## Expected branch
$ExpectedBranch

## Scope roots
$($ScopeRoots -join ", ")

## Allowed source files
See:

- graphify-out/agent-neutral-deep-diagnostic/01-affected-files.txt
- tools/registry/runs/$SessionId/06-affected-files.txt

## Context pack
Use only:

- graphify-out/agent-neutral-deep-diagnostic/09-repomix-selected.xml

Do not load the whole repository unless a verification failure proves the selected context is insufficient.

## Forbidden
- Do not add a new AI agent.
- Do not modify dependencies or lockfiles unless explicitly instructed.
- Do not delete, move, or rename files unless explicitly instructed.
- Do not import Tamagui directly outside @bthwani/ui-kit.
- Do not import preview/demo data into runtime-adjacent code.
- Do not move WLT finance ownership into DSH.
- Do not claim PASS / READY / CLOSED / 100%.
- Do not continue to another task.

## Tool evidence
Review these evidence files before editing:

- 02-rg-deep-signals.txt
- 03-guard-depcruise-live-boundaries.txt
- 03-guard-ast-grep-live-boundaries.txt
- 03-guard-knip-design.txt
- 03-guard-jscpd-live.txt
- 03-guard-react-scanner-dsh.txt
- 04-tsc-noemit.txt

## Required after any edit
Run:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:ast-grep:live-boundaries
pnpm run guard:depcruise:live-boundaries
```

If UI changed, provide screenshots.
"@
Write-Utf8File -Path (Join-Path $DiagOut "10-agent-task.md") -Content $taskCard
Write-Utf8File -Path (Join-Path $RunRoot "08-agent-task.md") -Content $taskCard

$verification = @"
# Verification Checklist

## Minimum verification
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## Boundary guards
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm run guard:ast-grep:live-boundaries
pnpm run guard:depcruise:live-boundaries
```

## Optional by task
```powershell
pnpm run guard:knip:design
pnpm run guard:jscpd:live
pnpm run guard:react-scanner:dsh
pnpm run guard:fixture-media-identity
pnpm run guard:sherif
```

## Evidence to return for review
Upload:

- tools\registry\runs\$SessionId\_HANDOFF.zip
- screenshots if UI changed
- LOCAL_CHANGE_REVIEW.patch if any source code changed after agent execution
"@
Write-Utf8File -Path (Join-Path $DiagOut "11-verification.md") -Content $verification
Write-Utf8File -Path (Join-Path $RunRoot "08-verification.md") -Content $verification

# -----------------------------------------------------------------------------
# 09 Summary / evidence.json
# -----------------------------------------------------------------------------
$finalStatus =
  if ($Errors.Count -gt 0) { "FIX_REQUIRED" }
  elseif ($Warnings.Count -gt 0) { "PASS_WITH_WARNINGS" }
  else { "PASS" }

$recommendation =
  if ($Errors.Count -gt 0) { "Review failed checks before giving the package to an agent." }
  elseif ($Warnings.Count -gt 0) { "Usable as diagnostic package, but review warnings first." }
  else { "Diagnostic package generated cleanly. Use agent-task.md + repomix-selected.xml + verification.md." }

$summary = @"
status: $finalStatus
recommendation: $recommendation
session_id: $SessionId
repo: $RepoRoot
branch: $currentBranch
expected_branch: $ExpectedBranch
started_at: $($envInfo.started_at)
completed_at: $(Get-Date -Format "s")
evidence_root: $RunRoot
graphify_out: $DiagOut
handoff_zip: $RunRoot\_HANDOFF.zip

key_outputs:
- $DiagOut\01-affected-files.txt
- $DiagOut\09-repomix-selected.xml
- $DiagOut\10-agent-task.md
- $DiagOut\11-verification.md

warnings:
$($Warnings | ForEach-Object { "- $_" } | Out-String)

errors:
$($Errors | ForEach-Object { "- $_" } | Out-String)

next_action:
- Review summary/evidence.
- Give only graphify-out\agent-neutral-deep-diagnostic\10-agent-task.md, 09-repomix-selected.xml, and 11-verification.md to one agent.
- After edits, run verification and export LOCAL_CHANGE_REVIEW.patch.
"@
Write-Utf8File -Path (Join-Path $RunRoot "SUMMARY.md") -Content $summary
Write-Utf8File -Path (Join-Path $RunRoot "status.txt") -Content $finalStatus
Write-Utf8File -Path (Join-Path $DiagOut "00-summary.md") -Content $summary

# Build evidence as PSCustomObject to avoid OrderedDictionary type issues in Windows PowerShell/PowerShell 7 edge cases.
$evidence = [pscustomobject]@{
  status = $finalStatus
  recommendation = $recommendation
  repo = $RepoRoot
  branch = $currentBranch
  expected_branch = $ExpectedBranch
  session_id = $SessionId
  evidence_root = $RunRoot
  graphify_out = $DiagOut
  handoff_zip = (Join-Path $RunRoot "_HANDOFF.zip")
  affected_file_count = $affectedFiles.Count
  selected_for_repomix_count = $selectedForRepomix.Count
  checks = @($Results.ToArray())
  warnings = @($Warnings.ToArray())
  errors = @($Errors.ToArray())
  completed_at = (Get-Date).ToString("s")
}
Write-Utf8File -Path (Join-Path $RunRoot "evidence.json") -Content (($evidence | ConvertTo-Json -Depth 20))
Write-Utf8File -Path (Join-Path $DiagOut "00-evidence.json") -Content (($evidence | ConvertTo-Json -Depth 20))

# Copy key outputs into graphify-out for easy agent-neutral usage.
Copy-Item -LiteralPath (Join-Path $RunRoot "02-rg-deep-signals.txt") -Destination (Join-Path $DiagOut "03-rg-findings.txt") -Force -ErrorAction SilentlyContinue
Copy-Item -LiteralPath (Join-Path $RunRoot "03-guard-depcruise-live-boundaries.txt") -Destination (Join-Path $DiagOut "04-depcruise-live-boundaries.txt") -Force -ErrorAction SilentlyContinue
Copy-Item -LiteralPath (Join-Path $RunRoot "03-guard-ast-grep-live-boundaries.txt") -Destination (Join-Path $DiagOut "05-ast-grep-live-boundaries.txt") -Force -ErrorAction SilentlyContinue
Copy-Item -LiteralPath (Join-Path $RunRoot "03-guard-knip-design.txt") -Destination (Join-Path $DiagOut "06-knip-design.txt") -Force -ErrorAction SilentlyContinue
Copy-Item -LiteralPath (Join-Path $RunRoot "03-guard-jscpd-live.txt") -Destination (Join-Path $DiagOut "07-jscpd-live.txt") -Force -ErrorAction SilentlyContinue
Copy-Item -LiteralPath (Join-Path $RunRoot "03-guard-react-scanner-dsh.txt") -Destination (Join-Path $DiagOut "08-react-scanner-dsh.txt") -Force -ErrorAction SilentlyContinue

# Create mandatory handoff zip.
$handoffZip = Join-Path $RunRoot "_HANDOFF.zip"
if (Test-Path -LiteralPath $handoffZip) { Remove-Item -LiteralPath $handoffZip -Force }
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $handoffZip -Force

# Final console output.
Write-Host ""
Write-Host "=== BThwani Agent-Neutral Deep Diagnostic ==="
Write-Host "Status: $finalStatus"
Write-Host "Session: $SessionId"
Write-Host "Evidence root: $RunRoot"
Write-Host "Handoff ZIP: $handoffZip"
Write-Host "Graphify out: $DiagOut"
Write-Host "Affected files: $($affectedFiles.Count)"
Write-Host ""
Write-Host "Give the agent only these files:"
Write-Host "  $DiagOut\10-agent-task.md"
Write-Host "  $DiagOut\09-repomix-selected.xml"
Write-Host "  $DiagOut\11-verification.md"
Write-Host ""
Write-Host "Review warnings/errors in:"
Write-Host "  $RunRoot\SUMMARY.md"
Write-Host "  $RunRoot\evidence.json"
Write-Host ""
