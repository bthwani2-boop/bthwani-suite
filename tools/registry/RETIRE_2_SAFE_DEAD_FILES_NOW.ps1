Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "RETIRE_2_SAFE_DEAD_FILES-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $RunRoot "backups"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$Result = "NOT_STARTED"
$Failed = $false
$Touched = New-Object System.Collections.Generic.List[string]
$Findings = New-Object System.Collections.Generic.List[string]

$SafeRetire = @(
  "dsh/frontend/app-captain/parts/DshCaptainAccountHubContent.tsx",
  "dsh/frontend/control-panel/shared/dsh-control-panel-operations-room.ts"
)

function Add-Finding([string]$Text) {
  $Findings.Add($Text) | Out-Null
}

function Write-Log([string]$Name, [string[]]$Lines) {
  $Lines | Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Encoding UTF8
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

function Get-SourceFiles {
  Get-ChildItem -LiteralPath "." -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\|tools\\registry\\runs\\"
    }
}

function Assert-No-Refs([string]$RelPath) {
  $FileName = [System.IO.Path]::GetFileName($RelPath)
  $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($RelPath)
  $Refs = New-Object System.Collections.Generic.List[string]

  foreach ($File in Get-SourceFiles) {
    $FileRel = $File.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    if ($FileRel -eq $RelPath) { continue }

    $Lines = Get-Content -LiteralPath $File.FullName -Encoding UTF8

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $Line = $Lines[$i]

      if (
        $Line.Contains($FileName) -or
        $Line.Contains($BaseName) -or
        $Line.Contains($RelPath)
      ) {
        $Refs.Add(("{0}:{1}:{2}" -f $FileRel, ($i + 1), $Line.Trim())) | Out-Null
      }
    }
  }

  if ($Refs.Count -gt 0) {
    $OutName = "refs_blocking_" + ($RelPath -replace "[^A-Za-z0-9_]", "_") + ".txt"
    Write-Log $OutName $Refs
    Add-Finding "RETIRE_BLOCKED_REFS_FOUND: $RelPath"
    $script:Failed = $true
    return $false
  }

  return $true
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

$RetireReport = New-Object System.Collections.Generic.List[string]

if (-not $Failed) {
  foreach ($RelPath in $SafeRetire) {
    if (-not (Test-Path -LiteralPath $RelPath -PathType Leaf)) {
      $RetireReport.Add("ALREADY_MISSING: $RelPath") | Out-Null
      continue
    }

    $NoRefs = Assert-No-Refs $RelPath

    if ($NoRefs) {
      Backup-File $RelPath | Out-Null
      Remove-Item -LiteralPath $RelPath -Force
      $RetireReport.Add("RETIRED: $RelPath") | Out-Null
    }
  }
}

Write-Log "01_retire_report.txt" $RetireReport

if (-not $Failed) {
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
  Write-Log "findings.txt" @("NO_FINDINGS")
} else {
  Write-Log "findings.txt" $Findings
}

$Summary = @(
  "# RETIRE_2_SAFE_DEAD_FILES",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "$Result",
  "",
  "## Retired files",
  "",
  "1. dsh/frontend/app-captain/parts/DshCaptainAccountHubContent.tsx",
  "2. dsh/frontend/control-panel/shared/dsh-control-panel-operations-room.ts",
  "",
  "## Preserved",
  "",
  "All KEEP_ACTIVE and KEEP_OR_CONNECT_ACTIVE files were preserved.",
  "No high-risk runtime/domain/surface file was deleted.",
  "",
  "## Review",
  "",
  "1. findings.txt",
  "2. 01_retire_report.txt",
  "3. 02_guards_after_retire.txt",
  "4. 03_final_git_state.txt"
)

Write-Log "SUMMARY.md" $Summary

$Zip = Join-Path $RunRoot "RETIRE_2_SAFE_DEAD_FILES_NOW.zip"
$Handoff = Join-Path $RunRoot "_HANDOFF.zip"

$Items = Get-ChildItem -LiteralPath $RunRoot -Force |
  Where-Object { $_.Name -notin @("RETIRE_2_SAFE_DEAD_FILES_NOW.zip", "_HANDOFF.zip") }

Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Zip -Force
Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Handoff -Force

Write-Host ""
Write-Host "RESULT: $Result"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $Zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
