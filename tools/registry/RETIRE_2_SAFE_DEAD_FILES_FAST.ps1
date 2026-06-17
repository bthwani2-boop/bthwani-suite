Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "RETIRE_2_SAFE_DEAD_FILES_FAST-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $RunRoot "backups"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$Result = "NOT_STARTED"
$Failed = $false
$Touched = New-Object System.Collections.Generic.List[string]
$Findings = New-Object System.Collections.Generic.List[string]

$Targets = @(
  "dsh/frontend/app-captain/parts/DshCaptainAccountHubContent.tsx",
  "dsh/frontend/control-panel/shared/dsh-control-panel-operations-room.ts"
)

function Log([string]$Name, [string[]]$Lines) {
  $Lines | Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Encoding UTF8
}

function Add-Finding([string]$Text) {
  $Findings.Add($Text) | Out-Null
}

function Backup-File([string]$RelPath) {
  if (-not (Test-Path -LiteralPath $RelPath -PathType Leaf)) { return $false }

  $Backup = Join-Path $BackupRoot $RelPath
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Backup) | Out-Null
  Copy-Item -LiteralPath $RelPath -Destination $Backup -Force

  if (-not $Touched.Contains($RelPath)) {
    $Touched.Add($RelPath) | Out-Null
  }

  return $true
}

function Restore-Touched {
  foreach ($RelPath in $Touched) {
    $Backup = Join-Path $BackupRoot $RelPath

    if (Test-Path -LiteralPath $Backup -PathType Leaf) {
      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $RelPath) | Out-Null
      Copy-Item -LiteralPath $Backup -Destination $RelPath -Force
      Write-Host "RESTORED: $RelPath"
    }
  }
}

function Run-Step([string]$Name, [scriptblock]$Cmd, [bool]$Critical = $true) {
  $Out = Join-Path $RunRoot $Name
  "" | Set-Content -LiteralPath $Out -Encoding UTF8
  $Ok = $true

  try {
    & $Cmd *>&1 | Tee-Object -FilePath $Out
    $Code = $LASTEXITCODE
    if ($null -eq $Code) { $Code = 0 }
    "EXIT_CODE=$Code" | Add-Content -LiteralPath $Out
    if ($Code -ne 0) { $Ok = $false }
  }
  catch {
    $_ | Out-String | Tee-Object -FilePath $Out
    "EXIT_CODE=1" | Add-Content -LiteralPath $Out
    $Ok = $false
  }

  if (-not $Ok -and $Critical) {
    Add-Finding "FAILED_STEP: $Name"
    $script:Failed = $true
  }

  return $Ok
}

function N([string]$Path) {
  return $Path.Replace("\", "/")
}

Write-Host "Indexing project files once..."

$Roots = @(
  "dsh/frontend",
  "wlt/frontend/dsh",
  "control-panel/runtime"
)

$Files = New-Object System.Collections.Generic.List[object]

foreach ($Root in $Roots) {
  if (-not (Test-Path -LiteralPath $Root)) { continue }

  Get-ChildItem -LiteralPath $Root -Recurse -File |
    Where-Object {
      $_.Extension -in @(".ts", ".tsx", ".js", ".jsx") -and
      $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\|tools\\registry\\runs\\"
    } |
    ForEach-Object { $Files.Add($_) | Out-Null }
}

Write-Host "Indexed files: $($Files.Count)"

$Texts = @{}
$LinesMap = @{}
$RelByAbs = @{}

foreach ($File in $Files) {
  $Rel = N ($File.FullName.Replace((Get-Location).Path + "\", ""))
  $Full = [System.IO.Path]::GetFullPath($File.FullName)
  $RelByAbs[$Full] = $Rel

  $Text = Get-Content -LiteralPath $File.FullName -Raw -Encoding UTF8
  $Texts[$Rel] = $Text
  $LinesMap[$Rel] = $Text -split "`r?`n"
}

function Resolve-ImportTarget([string]$FromRel, [string]$Spec) {
  if (-not $Spec.StartsWith(".")) { return $null }

  $FromAbs = Join-Path (Get-Location) $FromRel
  $Base = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetDirectoryName($FromAbs)) $Spec))

  $Candidates = @(
    "$Base.ts",
    "$Base.tsx",
    "$Base.js",
    "$Base.jsx",
    "$Base/index.ts",
    "$Base/index.tsx"
  )

  foreach ($C in $Candidates) {
    $Full = [System.IO.Path]::GetFullPath($C)
    if ($RelByAbs.ContainsKey($Full)) {
      return $RelByAbs[$Full]
    }
  }

  return $null
}

function Find-Refs([string]$TargetRel) {
  $Refs = New-Object System.Collections.Generic.List[string]
  $FileName = [System.IO.Path]::GetFileName($TargetRel)
  $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($TargetRel)

  $ImportPattern = '(?:from\s+["''](?<spec>[^"'']+)["'']|import\s*\(\s*["''](?<spec2>[^"'']+)["'']\s*\)|require\s*\(\s*["''](?<spec3>[^"'']+)["'']\s*\))'

  foreach ($Rel in $Texts.Keys) {
    if ($Rel -eq $TargetRel) { continue }

    $Text = $Texts[$Rel]
    $Matches = [regex]::Matches($Text, $ImportPattern)

    foreach ($M in $Matches) {
      $Spec = $M.Groups["spec"].Value
      if (-not $Spec) { $Spec = $M.Groups["spec2"].Value }
      if (-not $Spec) { $Spec = $M.Groups["spec3"].Value }

      $Resolved = Resolve-ImportTarget $Rel $Spec

      if ($Resolved -eq $TargetRel) {
        $Refs.Add("IMPORT $Rel -> $Spec") | Out-Null
      }
    }

    $Lines = $LinesMap[$Rel]

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $Line = $Lines[$i]

      if (
        $Line.Contains($FileName) -or
        $Line.Contains($BaseName) -or
        $Line.Contains($TargetRel)
      ) {
        $Refs.Add(("STRING {0}:{1}:{2}" -f $Rel, ($i + 1), $Line.Trim())) | Out-Null
      }
    }
  }

  return $Refs
}

Run-Step "00_git_state_before.txt" {
  git branch --show-current
  git rev-parse HEAD
  git status -sb
  git status --short
  git --no-pager diff --stat
  git --no-pager diff --name-status
  git --no-pager diff --check
} $false | Out-Null

$Branch = (git branch --show-current).Trim()
if ($Branch -ne "feat/dsh-surface-refactor") {
  Add-Finding "WRONG_BRANCH: $Branch"
  $Failed = $true
}

$Report = New-Object System.Collections.Generic.List[string]

if (-not $Failed) {
  foreach ($Target in $Targets) {
    Write-Host "Checking refs: $Target"

    if (-not (Test-Path -LiteralPath $Target -PathType Leaf)) {
      $Report.Add("ALREADY_MISSING: $Target") | Out-Null
      continue
    }

    $Refs = Find-Refs $Target

    if ($Refs.Count -gt 0) {
      $OutName = "refs_blocking_" + ($Target -replace "[^A-Za-z0-9_]", "_") + ".txt"
      Log $OutName $Refs
      Add-Finding "RETIRE_BLOCKED_REFS_FOUND: $Target"
      $Failed = $true
      continue
    }

    Backup-File $Target | Out-Null
    Remove-Item -LiteralPath $Target -Force
    $Report.Add("RETIRED: $Target") | Out-Null
  }
}

Log "01_retire_report.txt" $Report

if (-not $Failed) {
  Write-Host "Running guards..."

  Run-Step "02_guards_after_retire.txt" {
    pnpm -w exec tsc --noEmit
    if ($LASTEXITCODE -ne 0) { return }

    pnpm run guard:no-broken-imports
    if ($LASTEXITCODE -ne 0) { return }

    pnpm run guard:depcruise:live-boundaries
    if ($LASTEXITCODE -ne 0) { return }

    node tools/guards/guard-service-runtime.mjs --service dsh
    if ($LASTEXITCODE -ne 0) { return }

    node tools/guards/guard-service-runtime.mjs --service wlt
    if ($LASTEXITCODE -ne 0) { return }

    pnpm run guard:service-postgres-runtime
    if ($LASTEXITCODE -ne 0) { return }

    git --no-pager diff --check
  } $true | Out-Null
}

Run-Step "03_final_git_state.txt" {
  git status --short
  git --no-pager diff --stat
  git --no-pager diff --name-status
  git --no-pager diff --check
  git ls-files --others --exclude-standard
} $false | Out-Null

if ($Failed) {
  Restore-Touched

  Run-Step "98_state_after_restore.txt" {
    git status --short
    git --no-pager diff --stat
    git --no-pager diff --name-status
    git --no-pager diff --check
  } $false | Out-Null

  $Result = "SAFE_RETIRE_FAILED_RESTORED"
} else {
  $Result = "SAFE_RETIRE_PASSED"
}

if ($Findings.Count -eq 0) {
  Log "findings.txt" @("NO_FINDINGS")
} else {
  Log "findings.txt" $Findings
}

$Summary = @(
  "# RETIRE_2_SAFE_DEAD_FILES_FAST",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "$Result",
  "",
  "## Target files",
  "",
  "1. dsh/frontend/app-captain/parts/DshCaptainAccountHubContent.tsx",
  "2. dsh/frontend/control-panel/shared/dsh-control-panel-operations-room.ts",
  "",
  "## Review",
  "",
  "1. findings.txt",
  "2. 01_retire_report.txt",
  "3. 02_guards_after_retire.txt",
  "4. 03_final_git_state.txt"
)

Log "SUMMARY.md" $Summary

$Zip = Join-Path $RunRoot "RETIRE_2_SAFE_DEAD_FILES_FAST.zip"
$Handoff = Join-Path $RunRoot "_HANDOFF.zip"

$Items = Get-ChildItem -LiteralPath $RunRoot -Force |
  Where-Object { $_.Name -notin @("RETIRE_2_SAFE_DEAD_FILES_FAST.zip", "_HANDOFF.zip") }

Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Zip -Force
Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Handoff -Force

Write-Host ""
Write-Host "RESULT: $Result"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $Zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
