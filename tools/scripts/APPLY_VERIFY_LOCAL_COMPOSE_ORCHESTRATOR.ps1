param(
  [ValidateSet("DryRun", "Apply")]
  [string]$Mode = "DryRun"
)

Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "LOCAL_COMPOSE_ORCHESTRATOR"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "$IssueCode-$Timestamp"
$EvidenceRoot = Join-Path "tools\registry\runs" $SessionId
$ZipPath = Join-Path $EvidenceRoot "$SessionId.zip"

$RootCompose = "docker-compose.local.yml"
$DshCompose = "dsh\backend\docker-compose.local.yml"
$WltBackendDir = "wlt\backend"
$WltCompose = "wlt\backend\docker-compose.local.yml"

$RequiredComposeMajor = 2
$RequiredComposeMinor = 20
$RequiredComposePatch = 3

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

function Write-Evidence {
  param(
    [string]$Name,
    [string]$Content
  )
  $Path = Join-Path $EvidenceRoot $Name
  $Content | Set-Content -LiteralPath $Path -Encoding UTF8
}

function Invoke-Capture {
  param(
    [string]$Name,
    [scriptblock]$Command
  )

  $Path = Join-Path $EvidenceRoot $Name
  try {
    & $Command *> $Path
    return $true
  } catch {
    "ERROR: $($_.Exception.Message)" | Add-Content -LiteralPath $Path -Encoding UTF8
    return $false
  }
}

function Get-DockerComposeVersionObject {
  $Raw = (& docker compose version --short 2>$null)
  if (-not $Raw) {
    $Raw = (& docker compose version 2>$null)
  }

  $Text = ($Raw | Out-String).Trim()
  if ($Text -match "(\d+)\.(\d+)\.(\d+)") {
    return [pscustomobject]@{
      Raw = $Text
      Major = [int]$Matches[1]
      Minor = [int]$Matches[2]
      Patch = [int]$Matches[3]
    }
  }

  throw "Could not parse Docker Compose version from: $Text"
}

function Test-MinComposeVersion {
  param($Version)

  if ($Version.Major -gt $RequiredComposeMajor) { return $true }
  if ($Version.Major -lt $RequiredComposeMajor) { return $false }

  if ($Version.Minor -gt $RequiredComposeMinor) { return $true }
  if ($Version.Minor -lt $RequiredComposeMinor) { return $false }

  return ($Version.Patch -ge $RequiredComposePatch)
}

function Test-FileContainsExpectedManagedBlock {
  param(
    [string]$Path,
    [string]$Marker
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $false
  }

  $Text = Get-Content -LiteralPath $Path -Raw
  return $Text.Contains($Marker)
}

function New-BackupIfExists {
  param([string]$Path)

  if (Test-Path -LiteralPath $Path) {
    $BackupPath = Join-Path $EvidenceRoot (($Path -replace '[\\/:*?"<>|]', '_') + ".before")
    Copy-Item -LiteralPath $Path -Destination $BackupPath -Force
    return $BackupPath
  }

  return $null
}

function Set-ContentUtf8NoBom {
  param(
    [string]$Path,
    [string]$Content
  )

  $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  $Parent = Split-Path -Parent $Path
  if (-not $Parent) { $Parent = "." }
  $FullParent = (Resolve-Path -LiteralPath $Parent).Path
  $Leaf = Split-Path -Leaf $Path
  $FullPath = Join-Path $FullParent $Leaf
  [System.IO.File]::WriteAllText($FullPath, $Content, $Utf8NoBom)
}

$WltComposeContent = @"
# BTHWANI_MANAGED_LOCAL_COMPOSE: WLT_SERVICE_LOCAL
# Purpose: WLT service-local dependencies only.
# Scope: local infrastructure for WLT backend/runtime development.
# Boundary: WLT owns wallet/ledger/payment/refund/settlement financial truth.
# Safety: this file does NOT claim financial business truth by itself.

services:
  wlt-postgres:
    image: postgres:16-alpine
    container_name: bthwani-wlt-postgres-local
    environment:
      POSTGRES_DB: `${WLT_POSTGRES_DB:-wlt_local}
      POSTGRES_USER: `${WLT_POSTGRES_USER:-wlt_local}
      POSTGRES_PASSWORD: `${WLT_POSTGRES_PASSWORD:-wlt_local_password}
    ports:
      - "`${WLT_POSTGRES_PORT:-55433}:5432"
    volumes:
      - wlt-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U `${WLT_POSTGRES_USER:-wlt_local} -d `${WLT_POSTGRES_DB:-wlt_local}"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  wlt-postgres-data:
"@

$RootComposeContent = @"
# BTHWANI_MANAGED_LOCAL_COMPOSE: ROOT_ORCHESTRATOR
# Purpose: root local orchestration only.
# Scope: include service-owned local dependency stacks.
# Boundary: do not move service-owned dependencies into this file.
# DSH compose remains owned by dsh/backend.
# WLT compose remains owned by wlt/backend.
# Requires Docker Compose 2.20.3+ for include.

name: bthwani-suite-local

include:
  - ./dsh/backend/docker-compose.local.yml
  - ./wlt/backend/docker-compose.local.yml
"@

$Summary = [ordered]@{
  issueCode = $IssueCode
  sessionId = $SessionId
  mode = $Mode
  repo = "C:\bthwani-suite"
  rootCompose = $RootCompose
  dshCompose = $DshCompose
  wltCompose = $WltCompose
  status = "UNPROVEN"
  warnings = @()
  errors = @()
  changedFiles = @()
}

try {
  Invoke-Capture -Name "git-status-before.txt" -Command { git --no-pager status --short } | Out-Null
  Invoke-Capture -Name "git-diff-stat-before.txt" -Command { git --no-pager diff --stat } | Out-Null
  Invoke-Capture -Name "git-untracked-before.txt" -Command { git ls-files --others --exclude-standard } | Out-Null
  Invoke-Capture -Name "docker-compose-version.txt" -Command { docker compose version } | Out-Null

  if (-not (Test-Path -LiteralPath $DshCompose)) {
    throw "Missing required DSH compose file: $DshCompose"
  }

  $ComposeVersion = Get-DockerComposeVersionObject
  $Summary.dockerComposeVersion = $ComposeVersion.Raw

  if (-not (Test-MinComposeVersion -Version $ComposeVersion)) {
    throw "Docker Compose $($ComposeVersion.Raw) is below required 2.20.3 for include."
  }

  $ExistingRootIsManaged = Test-FileContainsExpectedManagedBlock -Path $RootCompose -Marker "BTHWANI_MANAGED_LOCAL_COMPOSE: ROOT_ORCHESTRATOR"
  $ExistingWltIsManaged = Test-FileContainsExpectedManagedBlock -Path $WltCompose -Marker "BTHWANI_MANAGED_LOCAL_COMPOSE: WLT_SERVICE_LOCAL"

  if ((Test-Path -LiteralPath $RootCompose) -and -not $ExistingRootIsManaged) {
    throw "Refusing to overwrite existing unmanaged root compose: $RootCompose"
  }

  if ((Test-Path -LiteralPath $WltCompose) -and -not $ExistingWltIsManaged) {
    throw "Refusing to overwrite existing unmanaged WLT compose: $WltCompose"
  }

  Write-Evidence -Name "planned-root-compose.yml" -Content $RootComposeContent
  Write-Evidence -Name "planned-wlt-compose.yml" -Content $WltComposeContent

  if ($Mode -eq "DryRun") {
    $Summary.status = "DRYRUN_PASS"
    $Summary.changedFiles = @()
  }

  if ($Mode -eq "Apply") {
    New-BackupIfExists -Path $RootCompose | Out-Null
    New-BackupIfExists -Path $WltCompose | Out-Null

    New-Item -ItemType Directory -Force -Path $WltBackendDir | Out-Null

    Set-ContentUtf8NoBom -Path $WltCompose -Content $WltComposeContent
    Set-ContentUtf8NoBom -Path $RootCompose -Content $RootComposeContent

    $Summary.changedFiles = @($RootCompose, $WltCompose)
    $Summary.status = "APPLY_WRITTEN_VERIFY_PENDING"
  }

  Invoke-Capture -Name "dsh-compose-config.txt" -Command { docker compose -f $DshCompose config } | Out-Null

  if ($Mode -eq "Apply") {
    Invoke-Capture -Name "wlt-compose-config.txt" -Command { docker compose -f $WltCompose config } | Out-Null
    Invoke-Capture -Name "root-compose-config.txt" -Command { docker compose -f $RootCompose config } | Out-Null
    Invoke-Capture -Name "git-diff-check.txt" -Command { git --no-pager diff --check } | Out-Null
    Invoke-Capture -Name "git-status-after.txt" -Command { git --no-pager status --short } | Out-Null
    Invoke-Capture -Name "git-diff-name-status.txt" -Command { git --no-pager diff --name-status } | Out-Null
    Invoke-Capture -Name "git-diff-stat-after.txt" -Command { git --no-pager diff --stat } | Out-Null
    Invoke-Capture -Name "local-change-review.patch" -Command { git --no-pager diff -- $RootCompose $WltCompose } | Out-Null
    $Summary.status = "APPLY_VERIFY_PASS_CANDIDATE"
  }

} catch {
  $Summary.status = "FAIL"
  $Summary.errors += $_.Exception.Message
  Write-Evidence -Name "error.txt" -Content $_.Exception.Message
}

$SummaryJson = $Summary | ConvertTo-Json -Depth 10
Write-Evidence -Name "evidence.json" -Content $SummaryJson

$SummaryMd = @"
# $IssueCode

status: $($Summary.status)
session_id: $SessionId
mode: $Mode
repo: C:\bthwani-suite
root_compose: $RootCompose
dsh_compose: $DshCompose
wlt_compose: $WltCompose
docker_compose_version: $($Summary.dockerComposeVersion)

## Decision Guard

- DSH compose is service-local and must remain under dsh/backend.
- WLT compose is service-local and must remain under wlt/backend.
- Root compose is orchestration only and must use include.
- WLT uses the same Postgres image family as DSH: postgres:16-alpine.
- This script does not start containers.
- This script does not edit DSH compose.
- This script does not claim WLT financial runtime/business truth is complete.

## Changed files

$($Summary.changedFiles -join "`n")

## Errors

$($Summary.errors -join "`n")
"@

Write-Evidence -Name "SUMMARY.md" -Content $SummaryMd

Compress-Archive -Path (Join-Path $EvidenceRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "RESULT: $($Summary.status)"
Write-Host "SESSION_ID: $SessionId"
Write-Host "EVIDENCE_ROOT: $EvidenceRoot"
Write-Host "ZIP: $ZipPath"

if ($Summary.status -eq "FAIL") {
  exit 1
}
